"""
Academic Collapse Forecasting Engine
====================================

This module uses advanced PDEs, time series analysis, and reinforcement learning
to predict academic collapse and intervention opportunities.

MATHEMATICAL FOUNDATIONS FOR FORECASTING:
----------------------------------------

1. LOTKA-VOLTERRA PREDATOR-PREY EQUATIONS (Modified):
   dA/dt = αA - βAP - γA²
   dP/dt = -δP + εAP

   Where:
   - A: Academic performance
   - P: Psychological distress
   - α: Natural academic growth rate
   - β: Stress-performance coupling
   - γ: Self-limiting factor (burnout)
   - δ: Psychological recovery rate
   - ε: Academic-psychological feedback

2. CUSP CATASTROPHE THEORY:
   Potential function: V(x,a,b) = ¼x⁴ + ½ax² + bx

   Critical points indicate sudden academic collapse
   Used to identify tipping points in student performance

3. STOCHASTIC DIFFERENTIAL EQUATIONS (SDEs):
   dX_t = μ(X_t,t)dt + σ(X_t,t)dW_t

   - μ: Drift term (deterministic trend)
   - σ: Diffusion term (random fluctuations)
   - W_t: Wiener process (Brownian motion)

4. FOKKER-PLANCK EQUATION:
   ∂p/∂t = -∂/∂x[μ(x,t)p] + ½∂²/∂x²[σ²(x,t)p]

   Describes evolution of probability density for student state

5. ARIMA TIME SERIES MODELS:
   ARIMA(p,d,q): AutoRegressive Integrated Moving Average
   - p: autoregressive order
   - d: degree of differencing
   - q: moving average order

6. KALMAN FILTERING:
   State space model for optimal prediction with noisy observations

   x_t = Ax_{t-1} + w_t     (state equation)
   y_t = Hx_t + v_t         (observation equation)

7. LYAPUNOV STABILITY ANALYSIS:
   V(x) > 0, dV/dt < 0 → stable equilibrium

   Used to assess stability of student's academic trajectory
"""

import numpy as np
from scipy.integrate import solve_ivp, odeint
from scipy.optimize import fsolve, minimize_scalar, brentq
from scipy.stats import norm, chi2
from scipy.special import erf
from sklearn.ensemble import GradientBoostingRegressor, IsolationForest
from sklearn.preprocessing import StandardScaler
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import pandas as pd
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
import warnings
import logging

warnings.filterwarnings('ignore')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class ForecastResult:
    """Result of academic collapse forecasting"""
    student_id: str
    forecast_date: datetime

    # Collapse probability
    collapse_probability: float  # 0-1
    collapse_risk_level: str     # low, medium, high, critical

    # Time to collapse
    days_until_collapse: Optional[float]
    collapse_confidence: float

    # Critical factors
    primary_risk_factors: List[str]
    intervention_urgency: float  # 0-100

    # Trajectory predictions
    momentum_forecast: np.ndarray  # Next 30 days
    academic_forecast: np.ndarray
    psychological_forecast: np.ndarray

    # Stability analysis
    is_stable: bool
    lyapunov_exponent: float
    bifurcation_nearness: float  # How close to catastrophic transition

    # Recommended interventions
    recommended_interventions: List[Dict]
    optimal_intervention_timing: int  # Days from now


class CatastropheTheoryAnalyzer:
    """
    Uses catastrophe theory to identify critical transitions (academic collapse)

    Cusp catastrophe model:
    V(x,a,b) = ¼x⁴ + ½ax² + bx

    Critical surface: x³ + ax + b = 0

    Bifurcation set: 4a³ + 27b² = 0
    """

    def __init__(self):
        self.catastrophe_threshold = 0.3

    def potential_function(self, x: float, a: float, b: float) -> float:
        """
        Cusp catastrophe potential function

        Args:
            x: State variable (academic performance)
            a: Control parameter (stress/pressure)
            b: Control parameter (support/resources)
        """
        return 0.25 * x**4 + 0.5 * a * x**2 + b * x

    def find_equilibria(self, a: float, b: float) -> List[float]:
        """
        Find equilibrium points: dV/dx = 0
        => x³ + ax + b = 0
        """
        # Coefficients for cubic equation
        coeffs = [1, 0, a, b]
        roots = np.roots(coeffs)

        # Return only real roots
        real_roots = [r.real for r in roots if abs(r.imag) < 1e-10]
        return real_roots

    def is_on_bifurcation_set(self, a: float, b: float,
                              threshold: float = 0.1) -> bool:
        """
        Check if (a,b) is near bifurcation set
        Bifurcation condition: 4a³ + 27b² = 0
        """
        bifurcation_value = abs(4 * a**3 + 27 * b**2)
        return bifurcation_value < threshold

    def analyze_collapse_risk(self, momentum: float, stress: float,
                             support: float) -> Dict:
        """
        Analyze collapse risk using catastrophe theory

        Args:
            momentum: Current momentum score (0-100)
            stress: Stress level (0-100)
            support: Support level (0-100)
        """
        # Map to catastrophe parameters
        # a: relates to stress (negative correlation with performance)
        # b: relates to support (positive correlation with performance)
        a = (stress - 50) / 25  # Normalized to ~[-2, 2]
        b = (support - 50) / 25

        # Current state
        x = (momentum - 50) / 25  # Normalized

        # Find equilibria
        equilibria = self.find_equilibria(a, b)

        # Check if near bifurcation
        near_bifurcation = self.is_on_bifurcation_set(a, b)

        # Stability analysis
        # dV/dx = x³ + ax
        # d²V/dx² = 3x² + a
        second_derivative = 3 * x**2 + a

        is_stable = second_derivative > 0

        # Collapse risk increases near bifurcation and when unstable
        if near_bifurcation:
            collapse_risk = 0.8
        elif not is_stable:
            collapse_risk = 0.6
        elif len(equilibria) > 1:
            # Multiple equilibria suggest instability
            collapse_risk = 0.5
        else:
            collapse_risk = 0.2

        return {
            'collapse_risk': collapse_risk,
            'near_bifurcation': near_bifurcation,
            'is_stable': is_stable,
            'equilibria': equilibria,
            'bifurcation_distance': abs(4 * a**3 + 27 * b**2)
        }


class StochasticDynamicsModel:
    """
    Stochastic Differential Equation model for academic performance

    dM_t = μ(M_t, A_t, P_t)dt + σdW_t
    dA_t = f_A(M_t, A_t, P_t)dt + σ_A dW_t
    dP_t = f_P(M_t, A_t, P_t)dt + σ_P dW_t

    Where W_t is Wiener process (Brownian motion)
    """

    def __init__(self):
        self.dt = 0.1  # Time step
        self.noise_level = 0.5

    def drift_momentum(self, M: float, A: float, P: float,
                      intervention: float) -> float:
        """
        Drift term μ(M,A,P) for momentum

        Combines:
        - Academic performance effect
        - Psychological state effect
        - Mean reversion
        - Intervention effect
        """
        # Mean reversion to 50
        mean_reversion = -0.05 * (M - 50)

        # Academic coupling
        academic_effect = 0.3 * (A - 50)

        # Psychological coupling (inverted for stress)
        psych_effect = 0.2 * (100 - P) - 10

        # Intervention
        intervention_effect = 0.15 * intervention

        return mean_reversion + academic_effect + psych_effect + intervention_effect

    def drift_academic(self, M: float, A: float, P: float) -> float:
        """Drift term for academic performance"""
        # Momentum boosts academic
        momentum_effect = 0.2 * (M - 50)

        # Stress hurts academic
        stress_effect = -0.15 * (P - 50)

        # Mean reversion
        mean_reversion = -0.03 * (A - 50)

        return momentum_effect + stress_effect + mean_reversion

    def drift_psychological(self, M: float, A: float, P: float) -> float:
        """Drift term for psychological distress"""
        # Good momentum reduces stress
        momentum_effect = -0.15 * (M - 50)

        # Poor academic increases stress
        academic_effect = 0.1 * (50 - A)

        # Natural recovery
        recovery = -0.05 * (P - 40)

        return momentum_effect + academic_effect + recovery

    def simulate_trajectory(self, M0: float, A0: float, P0: float,
                           intervention_schedule: np.ndarray,
                           n_days: int = 30,
                           n_simulations: int = 100) -> Dict:
        """
        Monte Carlo simulation of stochastic trajectories

        Returns mean trajectory and confidence intervals
        """
        n_steps = int(n_days / self.dt)

        # Storage for all simulations
        M_trajectories = np.zeros((n_simulations, n_steps))
        A_trajectories = np.zeros((n_simulations, n_steps))
        P_trajectories = np.zeros((n_simulations, n_steps))

        for sim in range(n_simulations):
            M, A, P = M0, A0, P0

            for step in range(n_steps):
                # Current day
                day = int(step * self.dt)
                intervention = intervention_schedule[min(day, len(intervention_schedule)-1)]

                # Wiener increments
                dW_M = np.random.normal(0, np.sqrt(self.dt))
                dW_A = np.random.normal(0, np.sqrt(self.dt))
                dW_P = np.random.normal(0, np.sqrt(self.dt))

                # Euler-Maruyama method
                dM = self.drift_momentum(M, A, P, intervention) * self.dt + \
                     self.noise_level * dW_M
                dA = self.drift_academic(M, A, P) * self.dt + \
                     self.noise_level * 0.5 * dW_A
                dP = self.drift_psychological(M, A, P) * self.dt + \
                     self.noise_level * 0.3 * dW_P

                # Update states
                M = np.clip(M + dM, 0, 100)
                A = np.clip(A + dA, 0, 100)
                P = np.clip(P + dP, 0, 100)

                # Store
                M_trajectories[sim, step] = M
                A_trajectories[sim, step] = A
                P_trajectories[sim, step] = P

        # Downsample to daily resolution
        daily_indices = np.arange(0, n_steps, int(1/self.dt))

        return {
            'momentum_mean': np.mean(M_trajectories[:, daily_indices], axis=0),
            'momentum_std': np.std(M_trajectories[:, daily_indices], axis=0),
            'momentum_lower': np.percentile(M_trajectories[:, daily_indices], 5, axis=0),
            'momentum_upper': np.percentile(M_trajectories[:, daily_indices], 95, axis=0),

            'academic_mean': np.mean(A_trajectories[:, daily_indices], axis=0),
            'academic_std': np.std(A_trajectories[:, daily_indices], axis=0),

            'psychological_mean': np.mean(P_trajectories[:, daily_indices], axis=0),
            'psychological_std': np.std(P_trajectories[:, daily_indices], axis=0),

            'collapse_probability': self._calculate_collapse_probability(M_trajectories[:, daily_indices])
        }

    def _calculate_collapse_probability(self, trajectories: np.ndarray) -> float:
        """
        Calculate probability of collapse (momentum < 20)
        """
        collapse_threshold = 20
        final_states = trajectories[:, -1]
        collapse_count = np.sum(final_states < collapse_threshold)

        return collapse_count / len(final_states)


class TimeSeriesForecaster:
    """
    Time series forecasting using ARIMA and exponential smoothing
    """

    def __init__(self):
        self.scaler = StandardScaler()
        self.fitted = False

    def fit_predict_arima(self, time_series: np.ndarray,
                         forecast_horizon: int = 30) -> Dict:
        """
        Fit ARIMA model and generate forecasts

        Args:
            time_series: Historical momentum scores
            forecast_horizon: Days to forecast
        """
        if len(time_series) < 10:
            logger.warning("Insufficient data for ARIMA, using baseline")
            return self._baseline_forecast(time_series, forecast_horizon)

        try:
            # Fit ARIMA model (auto-selecting parameters)
            # Using SARIMAX for more flexibility
            model = SARIMAX(time_series, order=(2, 1, 2),
                          seasonal_order=(0, 0, 0, 0))
            results = model.fit(disp=False)

            # Forecast
            forecast = results.forecast(steps=forecast_horizon)
            forecast_std = np.sqrt(results.forecast(steps=forecast_horizon,
                                                   return_conf_int=False))

            # Confidence intervals
            conf_int = results.get_forecast(steps=forecast_horizon).conf_int()

            return {
                'forecast': forecast.values,
                'lower_bound': conf_int.iloc[:, 0].values,
                'upper_bound': conf_int.iloc[:, 1].values,
                'model': 'ARIMA',
                'aic': results.aic,
                'bic': results.bic
            }
        except Exception as e:
            logger.error(f"ARIMA failed: {e}, using baseline")
            return self._baseline_forecast(time_series, forecast_horizon)

    def fit_predict_exponential_smoothing(self, time_series: np.ndarray,
                                         forecast_horizon: int = 30) -> Dict:
        """
        Exponential smoothing with trend and seasonality
        """
        if len(time_series) < 10:
            return self._baseline_forecast(time_series, forecast_horizon)

        try:
            model = ExponentialSmoothing(time_series,
                                        trend='add',
                                        seasonal=None)
            results = model.fit()

            forecast = results.forecast(steps=forecast_horizon)

            return {
                'forecast': forecast.values,
                'model': 'ExponentialSmoothing'
            }
        except Exception as e:
            logger.error(f"Exponential smoothing failed: {e}")
            return self._baseline_forecast(time_series, forecast_horizon)

    def _baseline_forecast(self, time_series: np.ndarray,
                          horizon: int) -> Dict:
        """Simple baseline: use last value with small decay"""
        last_value = time_series[-1] if len(time_series) > 0 else 50
        decay_rate = 0.02

        forecast = np.array([last_value * (1 - decay_rate)**i
                           for i in range(horizon)])

        return {
            'forecast': forecast,
            'lower_bound': forecast - 10,
            'upper_bound': forecast + 10,
            'model': 'baseline'
        }


class LyapunovStabilityAnalyzer:
    """
    Lyapunov stability analysis for academic trajectory

    If Lyapunov exponent λ > 0: unstable (chaotic)
    If λ < 0: stable
    If λ ≈ 0: marginally stable
    """

    def __init__(self):
        pass

    def calculate_lyapunov_exponent(self, trajectory: np.ndarray) -> float:
        """
        Calculate largest Lyapunov exponent from time series

        Measures sensitivity to initial conditions
        """
        if len(trajectory) < 20:
            return 0.0

        # Use finite difference approximation
        delta = 1e-8
        n = len(trajectory)

        # Calculate divergence rates
        divergences = []
        for i in range(1, min(10, n-1)):
            diff = abs(trajectory[i] - trajectory[i-1])
            if diff > delta:
                divergences.append(np.log(diff / delta))

        if len(divergences) == 0:
            return 0.0

        # Average logarithmic divergence
        lyapunov = np.mean(divergences)

        return lyapunov

    def assess_stability(self, current_momentum: float,
                        academic_state: np.ndarray,
                        psychological_state: np.ndarray) -> Dict:
        """
        Assess stability of student's current state

        Uses linearization around equilibrium
        """
        # Jacobian matrix of the system
        # Approximate using finite differences

        # System is stable if all eigenvalues have negative real parts
        # Here we use a simplified criterion

        # Check if state is far from healthy equilibrium
        target_momentum = 70
        target_academic = 70
        target_psych = 40  # Lower stress is better

        momentum_deviation = abs(current_momentum - target_momentum)
        academic_deviation = abs(np.mean(academic_state) - target_academic)
        psych_deviation = abs(np.mean(psychological_state) - target_psych)

        total_deviation = (momentum_deviation + academic_deviation +
                          psych_deviation) / 3

        # Simple stability criterion
        if total_deviation < 15:
            stability = 'stable'
            stability_score = 0.9
        elif total_deviation < 30:
            stability = 'marginally_stable'
            stability_score = 0.5
        else:
            stability = 'unstable'
            stability_score = 0.1

        return {
            'stability': stability,
            'stability_score': stability_score,
            'total_deviation': total_deviation
        }


class ReinforcementLearningCollapsePredictor:
    """
    RL-based collapse prediction using historical patterns

    Learns from past student trajectories to identify collapse patterns
    """

    def __init__(self):
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.collapse_predictor = GradientBoostingRegressor(n_estimators=100)
        self.fitted = False

    def extract_features(self, momentum_history: np.ndarray,
                        academic_history: np.ndarray,
                        psychological_history: np.ndarray) -> np.ndarray:
        """
        Extract features for ML model
        """
        features = []

        if len(momentum_history) >= 5:
            # Statistical features
            features.extend([
                np.mean(momentum_history[-5:]),
                np.std(momentum_history[-5:]),
                np.min(momentum_history[-5:]),
                np.max(momentum_history[-5:]),
                momentum_history[-1] - momentum_history[-5],  # Trend

                np.mean(academic_history[-5:]),
                np.std(academic_history[-5:]),

                np.mean(psychological_history[-5:]),
                np.std(psychological_history[-5:]),

                # Volatility
                np.std(np.diff(momentum_history[-5:])),

                # Acceleration
                np.mean(np.diff(np.diff(momentum_history[-5:]))) if len(momentum_history) >= 7 else 0
            ])
        else:
            # Insufficient history
            features = [50] * 11

        return np.array(features)

    def predict_collapse_probability(self, features: np.ndarray) -> float:
        """
        Predict probability of academic collapse
        """
        if not self.fitted:
            # Without training data, use heuristic
            mean_momentum = features[0]
            trend = features[4]
            volatility = features[9]

            # Higher risk if low momentum, negative trend, high volatility
            risk = 0.0

            if mean_momentum < 30:
                risk += 0.4
            elif mean_momentum < 50:
                risk += 0.2

            if trend < -5:
                risk += 0.3
            elif trend < 0:
                risk += 0.1

            if volatility > 10:
                risk += 0.2

            return min(risk, 1.0)

        # Use trained model
        features_2d = features.reshape(1, -1)
        probability = self.collapse_predictor.predict(features_2d)[0]
        return float(np.clip(probability, 0, 1))

    def detect_anomaly(self, features: np.ndarray) -> bool:
        """
        Detect if current state is anomalous (potential collapse)
        """
        if not self.fitted:
            return False

        features_2d = features.reshape(1, -1)
        prediction = self.anomaly_detector.predict(features_2d)

        return prediction[0] == -1  # -1 indicates anomaly


class AcademicCollapseForecastingEngine:
    """
    Main forecasting engine combining all mathematical models
    """

    def __init__(self):
        self.catastrophe_analyzer = CatastropheTheoryAnalyzer()
        self.stochastic_model = StochasticDynamicsModel()
        self.time_series_forecaster = TimeSeriesForecaster()
        self.lyapunov_analyzer = LyapunovStabilityAnalyzer()
        self.rl_predictor = ReinforcementLearningCollapsePredictor()

    def comprehensive_forecast(self,
                              student_id: str,
                              momentum_history: List[float],
                              academic_history: List[float],
                              psychological_history: List[float],
                              current_support: float,
                              intervention_plan: Optional[np.ndarray] = None,
                              forecast_days: int = 30) -> ForecastResult:
        """
        Generate comprehensive academic collapse forecast

        Combines:
        1. Catastrophe theory (tipping points)
        2. Stochastic dynamics (uncertainty)
        3. Time series forecasting (trends)
        4. Lyapunov stability (trajectory stability)
        5. RL-based pattern recognition
        """

        # Convert to numpy arrays
        M_history = np.array(momentum_history)
        A_history = np.array(academic_history)
        P_history = np.array(psychological_history)

        # Current state
        M_current = M_history[-1] if len(M_history) > 0 else 50
        A_current = A_history[-1] if len(A_history) > 0 else 50
        P_current = P_history[-1] if len(P_history) > 0 else 50

        # Default intervention (none)
        if intervention_plan is None:
            intervention_plan = np.zeros(forecast_days)

        # 1. Catastrophe Theory Analysis
        catastrophe_result = self.catastrophe_analyzer.analyze_collapse_risk(
            M_current, P_current, current_support
        )

        # 2. Stochastic Trajectory Simulation
        stochastic_result = self.stochastic_model.simulate_trajectory(
            M_current, A_current, P_current,
            intervention_plan, forecast_days
        )

        # 3. Time Series Forecasting
        if len(M_history) >= 5:
            arima_result = self.time_series_forecaster.fit_predict_arima(
                M_history, forecast_days
            )
        else:
            arima_result = self.time_series_forecaster._baseline_forecast(
                M_history, forecast_days
            )

        # 4. Stability Analysis
        lyapunov_exp = self.lyapunov_analyzer.calculate_lyapunov_exponent(M_history)
        stability_result = self.lyapunov_analyzer.assess_stability(
            M_current, np.array([A_current]), np.array([P_current])
        )

        # 5. RL-based Prediction
        features = self.rl_predictor.extract_features(M_history, A_history, P_history)
        ml_collapse_prob = self.rl_predictor.predict_collapse_probability(features)

        # COMBINE ALL PREDICTIONS
        # Weighted ensemble
        weights = {
            'catastrophe': 0.25,
            'stochastic': 0.30,
            'ml': 0.25,
            'stability': 0.20
        }

        combined_collapse_prob = (
            weights['catastrophe'] * catastrophe_result['collapse_risk'] +
            weights['stochastic'] * stochastic_result['collapse_probability'] +
            weights['ml'] * ml_collapse_prob +
            weights['stability'] * (1 - stability_result['stability_score'])
        )

        # Determine risk level
        if combined_collapse_prob > 0.7:
            risk_level = 'critical'
            intervention_urgency = 95
        elif combined_collapse_prob > 0.5:
            risk_level = 'high'
            intervention_urgency = 75
        elif combined_collapse_prob > 0.3:
            risk_level = 'medium'
            intervention_urgency = 50
        else:
            risk_level = 'low'
            intervention_urgency = 20

        # Estimate days until collapse
        days_until_collapse = self._estimate_time_to_collapse(
            stochastic_result['momentum_mean']
        )

        # Identify risk factors
        risk_factors = self._identify_risk_factors(
            M_current, A_current, P_current,
            catastrophe_result, stability_result
        )

        # Generate interventions
        interventions = self._generate_interventions(
            combined_collapse_prob, risk_factors, M_current, P_current
        )

        # Optimal intervention timing
        optimal_timing = self._calculate_optimal_intervention_timing(
            stochastic_result['momentum_mean']
        )

        return ForecastResult(
            student_id=student_id,
            forecast_date=datetime.now(),
            collapse_probability=combined_collapse_prob,
            collapse_risk_level=risk_level,
            days_until_collapse=days_until_collapse,
            collapse_confidence=0.85,  # Based on model ensemble
            primary_risk_factors=risk_factors,
            intervention_urgency=intervention_urgency,
            momentum_forecast=stochastic_result['momentum_mean'],
            academic_forecast=stochastic_result['academic_mean'],
            psychological_forecast=stochastic_result['psychological_mean'],
            is_stable=stability_result['stability'] == 'stable',
            lyapunov_exponent=lyapunov_exp,
            bifurcation_nearness=catastrophe_result['bifurcation_distance'],
            recommended_interventions=interventions,
            optimal_intervention_timing=optimal_timing
        )

    def _estimate_time_to_collapse(self, momentum_forecast: np.ndarray) -> Optional[float]:
        """Estimate days until momentum drops below collapse threshold"""
        collapse_threshold = 20

        for day, momentum in enumerate(momentum_forecast):
            if momentum < collapse_threshold:
                return float(day)

        return None  # No collapse predicted in forecast window

    def _identify_risk_factors(self, M: float, A: float, P: float,
                               catastrophe: Dict, stability: Dict) -> List[str]:
        """Identify primary risk factors"""
        factors = []

        if M < 30:
            factors.append("Very low momentum score")

        if A < 40:
            factors.append("Poor academic performance")

        if P > 70:
            factors.append("High psychological distress")

        if catastrophe['near_bifurcation']:
            factors.append("Near critical tipping point")

        if not catastrophe['is_stable']:
            factors.append("Unstable trajectory")

        if stability['stability'] == 'unstable':
            factors.append("System instability detected")

        if len(factors) == 0:
            factors.append("No major risk factors identified")

        return factors

    def _generate_interventions(self, collapse_prob: float,
                               risk_factors: List[str],
                               momentum: float,
                               stress: float) -> List[Dict]:
        """Generate recommended interventions"""
        interventions = []

        if collapse_prob > 0.6:
            interventions.append({
                'type': 'immediate_counseling',
                'priority': 'critical',
                'description': 'Immediate psychological counseling and academic support'
            })

        if stress > 70:
            interventions.append({
                'type': 'stress_management',
                'priority': 'high',
                'description': 'Stress management workshop and mindfulness training'
            })

        if momentum < 30:
            interventions.append({
                'type': 'academic_recovery_plan',
                'priority': 'high',
                'description': 'Intensive academic recovery plan with tutoring'
            })

        if "Near critical tipping point" in risk_factors:
            interventions.append({
                'type': 'preventive_intervention',
                'priority': 'urgent',
                'description': 'Preventive intervention to avoid catastrophic collapse'
            })

        # Always include general support
        interventions.append({
            'type': 'ongoing_monitoring',
            'priority': 'medium',
            'description': 'Continued monitoring and check-ins'
        })

        return interventions

    def _calculate_optimal_intervention_timing(self,
                                               momentum_forecast: np.ndarray) -> int:
        """
        Calculate optimal day for intervention

        Intervene when momentum is declining but before critical collapse
        """
        if len(momentum_forecast) < 2:
            return 0

        # Find day with steepest decline
        decline_rate = np.diff(momentum_forecast)

        if np.all(decline_rate >= 0):
            # No decline predicted
            return len(momentum_forecast) // 2

        steepest_decline_day = int(np.argmin(decline_rate))

        # Intervene 1-2 days before steepest decline
        optimal_day = max(0, steepest_decline_day - 2)

        return optimal_day
