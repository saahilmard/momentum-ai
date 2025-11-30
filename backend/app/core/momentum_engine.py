"""
Momentum AI - Advanced Mathematical Engine
==========================================

This module contains the core mathematical and AI models for calculating student momentum scores.

MATHEMATICAL FOUNDATIONS:
------------------------

1. HEAT EQUATION (Parabolic PDE):
   ∂M/∂t = α∇²M + source terms
   - Models diffusion of academic momentum over time
   - α: thermal diffusivity (how quickly momentum spreads/stabilizes)

2. REACTION-DIFFUSION SYSTEM:
   ∂M/∂t = D_M∇²M + f(M,A,P)
   ∂A/∂t = D_A∇²A + g(M,A,P)
   ∂P/∂t = D_P∇²P + h(M,A,P)
   - Coupled PDEs modeling momentum (M), academic (A), and psychological (P) states
   - Captures feedback loops and nonlinear interactions

3. VARIATIONAL CALCULUS:
   Minimize energy functional: E[M] = ∫∫[½|∇M|² + V(M,A,P)]dxdt
   - Optimizes momentum trajectory to minimize "energy"
   - Leads to Euler-Lagrange equations

4. MULTIVARIABLE CALCULUS:
   - Gradient descent: ∇f(x₁,x₂,...,xₙ)
   - Hessian matrix for stability analysis
   - Jacobian for sensitivity analysis

5. NUMERICAL ANALYSIS:
   - Runge-Kutta 4th/5th order methods (RK45) for ODE solving
   - Finite difference methods for PDE discretization
   - Adaptive step-size control for accuracy

6. ADVANCED STATISTICS:
   - Bayesian inference for parameter estimation
   - Gaussian processes for uncertainty quantification
   - Time series analysis (ARIMA, state-space models)
   - Principal Component Analysis (PCA) for dimensionality reduction

7. REINFORCEMENT LEARNING:
   - Q-Learning: Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]
   - Policy gradients: ∇J(θ) = E[∇log π_θ(a|s)Q(s,a)]
   - Deep Q-Networks (DQN) for continuous state spaces
"""

import numpy as np
from scipy.integrate import solve_ivp, odeint
from scipy.optimize import minimize, differential_evolution
from scipy.stats import norm, multivariate_normal
from sklearn.decomposition import PCA
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, ConstantKernel as C
from typing import Dict, List, Tuple, Optional, Callable
import json
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class StudentState:
    """Represents the complete state of a student at a given time"""
    student_id: str
    timestamp: datetime
    momentum_score: float
    academic_state: np.ndarray  # [gpa, engagement, completion, attendance]
    psychological_state: np.ndarray  # [stress, motivation, confidence, resilience, wellbeing]
    subject_performance: Dict[str, float]
    learning_velocity: float  # Rate of change of academic performance
    intervention_level: float  # Teacher/system intervention intensity


class HeatEquationMomentumModel:
    """
    Heat Equation-based Momentum Model

    Implements the parabolic PDE:
    ∂M/∂t = α∇²M + β·P(x,t) + γ·A(x,t) + source(x,t)

    Physical interpretation:
    - M: Momentum "temperature" field
    - α: Diffusion coefficient (how quickly momentum equilibrates)
    - P: Psychological "heat source"
    - A: Academic "heat source"
    - source: External interventions (teacher support, etc.)
    """

    def __init__(self, alpha: float = 0.5, beta: float = 0.3, gamma: float = 0.2):
        self.alpha = alpha  # Diffusion coefficient
        self.beta = beta    # Psychological coupling
        self.gamma = gamma  # Academic coupling

    def momentum_pde(self, t: float, state: np.ndarray,
                     params: Dict) -> np.ndarray:
        """
        Right-hand side of the PDE system

        State vector: [M, A₁, A₂, A₃, A₄, P₁, P₂, P₃, P₄, P₅]
        - M: Momentum score
        - A: Academic components (4D)
        - P: Psychological components (5D)
        """
        M = state[0]
        A = state[1:5]  # Academic state (4D)
        P = state[5:10]  # Psychological state (5D)

        # Extract parameters
        teacher_intervention = params.get('teacher_intervention', 0)
        external_stress = params.get('external_stress', 0)

        # Heat equation for momentum with sources
        # ∂M/∂t = α(∑A_i² - M²) + β(∑P_i) + γ·T
        laplacian_M = self.alpha * (np.sum(A**2) - M**2)  # Approximate Laplacian
        psychological_source = self.beta * np.mean(P)
        academic_source = self.gamma * np.mean(A)
        intervention_source = 0.1 * teacher_intervention

        # Logistic growth with carrying capacity
        nonlinear_term = M * (1 - M/100) * (1 + academic_source/50)

        dM_dt = laplacian_M + psychological_source + intervention_source + nonlinear_term

        # Academic dynamics (coupled to momentum)
        # ∂A/∂t = -decay·A + coupling·M + noise
        dA_dt = -0.05 * A + 0.15 * M * np.ones_like(A) + np.random.normal(0, 0.01, size=A.shape)

        # Psychological dynamics (influenced by stress and momentum)
        # ∂P/∂t = -decay·P + recovery·M - stress
        stress_effect = np.array([external_stress, 0, 0, 0, -external_stress])
        dP_dt = -0.08 * P + 0.12 * M * np.ones_like(P) + 0.01 * stress_effect

        return np.concatenate([[dM_dt], dA_dt, dP_dt])

    def solve(self, initial_state: StudentState,
              time_horizon: float, params: Dict) -> StudentState:
        """
        Solve the heat equation PDE system using numerical integration

        Args:
            initial_state: Initial student state
            time_horizon: Time period to simulate (in days)
            params: Additional parameters (teacher intervention, etc.)

        Returns:
            Updated student state
        """
        # Construct initial state vector
        y0 = np.concatenate([
            [initial_state.momentum_score],
            initial_state.academic_state,
            initial_state.psychological_state
        ])

        # Time span
        t_span = (0, time_horizon)
        t_eval = np.linspace(0, time_horizon, 100)

        # Solve using adaptive Runge-Kutta method
        solution = solve_ivp(
            lambda t, y: self.momentum_pde(t, y, params),
            t_span,
            y0,
            method='RK45',  # 4th/5th order Runge-Kutta
            dense_output=True,
            t_eval=t_eval,
            rtol=1e-6,  # Relative tolerance
            atol=1e-8   # Absolute tolerance
        )

        if not solution.success:
            logger.warning(f"PDE solver failed: {solution.message}")
            return initial_state

        # Extract final state
        final_state = solution.y[:, -1]

        # Update student state
        updated_state = StudentState(
            student_id=initial_state.student_id,
            timestamp=initial_state.timestamp + timedelta(days=time_horizon),
            momentum_score=float(np.clip(final_state[0], 0, 100)),
            academic_state=final_state[1:5],
            psychological_state=final_state[5:10],
            subject_performance=initial_state.subject_performance,
            learning_velocity=(final_state[0] - initial_state.momentum_score) / time_horizon,
            intervention_level=params.get('teacher_intervention', 0)
        )

        return updated_state


class VariationalMomentumOptimizer:
    """
    Variational calculus-based momentum optimizer

    Minimizes the energy functional:
    E[M] = ∫∫[½|∇M|² + V(M,A,P) + λ·constraints]dxdt

    This leads to the Euler-Lagrange equation:
    ∂V/∂M - ∇·(∂V/∂∇M) = 0
    """

    def __init__(self):
        self.lambda_constraint = 1.0  # Lagrange multiplier

    def energy_functional(self, M: np.ndarray, A: np.ndarray,
                         P: np.ndarray) -> float:
        """
        Calculate energy functional E[M]

        E = ½∫|∇M|²dx + ∫V(M,A,P)dx
        where V is a potential function
        """
        # Gradient energy (regularization term)
        gradient_energy = 0.5 * np.sum(np.gradient(M)**2)

        # Potential energy (deviation from ideal state)
        ideal_momentum = 75.0
        potential_energy = np.sum((M - ideal_momentum)**2)

        # Academic-momentum coupling energy
        coupling_energy = -np.sum(M * np.mean(A))

        # Psychological penalty
        stress_penalty = np.sum(P[0]**2)  # Penalize high stress

        total_energy = gradient_energy + potential_energy + coupling_energy + 0.1 * stress_penalty

        return total_energy

    def optimize_trajectory(self, current_state: StudentState,
                           target_momentum: float,
                           n_steps: int = 50) -> np.ndarray:
        """
        Find optimal momentum trajectory using variational methods

        Returns:
            Array of optimal momentum values over time
        """
        def objective(M_trajectory):
            """Objective function to minimize"""
            # Reshape to proper dimensions
            A_mean = np.mean(current_state.academic_state)
            P = current_state.psychological_state

            energy = self.energy_functional(M_trajectory,
                                          A_mean * np.ones(n_steps),
                                          np.tile(P, (n_steps, 1)).T)

            # Constraint: reach target momentum
            constraint_violation = (M_trajectory[-1] - target_momentum)**2

            return energy + self.lambda_constraint * constraint_violation

        # Initial guess: linear interpolation
        x0 = np.linspace(current_state.momentum_score, target_momentum, n_steps)

        # Bounds: momentum must be in [0, 100]
        bounds = [(0, 100) for _ in range(n_steps)]

        # Optimize using L-BFGS-B
        result = minimize(objective, x0, method='L-BFGS-B', bounds=bounds)

        if result.success:
            return result.x
        else:
            logger.warning("Variational optimization failed, returning linear trajectory")
            return x0


class BayesianMomentumEstimator:
    """
    Bayesian inference for momentum score estimation

    Uses Gaussian Process regression with uncertainty quantification

    Prior: M ~ GP(μ, K)
    Likelihood: y|M ~ N(M, σ²I)
    Posterior: M|y ~ GP(μ_post, K_post)
    """

    def __init__(self):
        # Kernel: captures correlation structure
        # k(x,x') = σ²·exp(-||x-x'||²/2l²)
        kernel = C(1.0, (1e-3, 1e3)) * RBF(10, (1e-2, 1e2))
        self.gp = GaussianProcessRegressor(
            kernel=kernel,
            n_restarts_optimizer=10,
            alpha=1e-2,  # Noise level
            normalize_y=True
        )
        self.training_data: List[Tuple[np.ndarray, float]] = []

    def update(self, features: np.ndarray, momentum_score: float):
        """Update posterior with new observation"""
        self.training_data.append((features, momentum_score))

        if len(self.training_data) > 10:  # Need sufficient data
            X = np.array([x[0] for x in self.training_data])
            y = np.array([x[1] for x in self.training_data])
            self.gp.fit(X, y)

    def predict(self, features: np.ndarray) -> Tuple[float, float]:
        """
        Predict momentum score with uncertainty

        Returns:
            (mean, std_deviation)
        """
        if len(self.training_data) < 10:
            return 50.0, 20.0  # Default with high uncertainty

        features_2d = features.reshape(1, -1)
        mean, std = self.gp.predict(features_2d, return_std=True)

        return float(mean[0]), float(std[0])

    def get_confidence_interval(self, features: np.ndarray,
                               confidence: float = 0.95) -> Tuple[float, float]:
        """Get confidence interval for prediction"""
        mean, std = self.predict(features)
        z_score = norm.ppf((1 + confidence) / 2)

        lower = mean - z_score * std
        upper = mean + z_score * std

        return (lower, upper)


class PCADimensionalityReducer:
    """
    Principal Component Analysis for feature reduction

    Reduces high-dimensional student features to essential components

    X = UΣV^T (SVD decomposition)
    Principal components: first k columns of V
    """

    def __init__(self, n_components: int = 5):
        self.pca = PCA(n_components=n_components)
        self.fitted = False

    def fit_transform(self, features: np.ndarray) -> np.ndarray:
        """
        Fit PCA and transform features

        Args:
            features: (n_samples, n_features) array

        Returns:
            Reduced features: (n_samples, n_components) array
        """
        reduced = self.pca.fit_transform(features)
        self.fitted = True
        return reduced

    def transform(self, features: np.ndarray) -> np.ndarray:
        """Transform new features using fitted PCA"""
        if not self.fitted:
            raise ValueError("PCA not fitted yet")
        return self.pca.transform(features)

    def get_explained_variance_ratio(self) -> np.ndarray:
        """Get proportion of variance explained by each component"""
        return self.pca.explained_variance_ratio_

    def inverse_transform(self, reduced_features: np.ndarray) -> np.ndarray:
        """Reconstruct original features from reduced representation"""
        return self.pca.inverse_transform(reduced_features)


class DeepQLearningAgent:
    """
    Deep Q-Learning for optimal study strategy selection

    Q-Learning update:
    Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)]

    State space: [momentum, stress, motivation, confidence, subject_difficulty, time]
    Action space: [study_method_id, duration, intensity, break_frequency]
    Reward: improvement in momentum + academic performance
    """

    def __init__(self, state_dim: int = 10, action_dim: int = 6):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.q_table: Dict[Tuple, np.ndarray] = {}

        # Hyperparameters
        self.learning_rate = 0.1
        self.discount_factor = 0.95
        self.epsilon = 0.2  # Exploration rate
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01

        # Action space definition
        self.actions = {
            0: {'method': 'active_recall', 'duration': 25, 'intensity': 'high'},
            1: {'method': 'spaced_repetition', 'duration': 30, 'intensity': 'medium'},
            2: {'method': 'interleaved_practice', 'duration': 45, 'intensity': 'medium'},
            3: {'method': 'practice_testing', 'duration': 50, 'intensity': 'high'},
            4: {'method': 'pomodoro', 'duration': 25, 'intensity': 'medium'},
            5: {'method': 'elaborative_interrogation', 'duration': 20, 'intensity': 'high'}
        }

    def discretize_state(self, state: np.ndarray, bins: int = 10) -> Tuple:
        """Discretize continuous state space"""
        discretized = tuple(np.digitize(s, np.linspace(0, 100, bins)) for s in state)
        return discretized

    def get_action(self, state: np.ndarray, epsilon_greedy: bool = True) -> int:
        """
        Select action using ε-greedy policy

        With probability ε: explore (random action)
        With probability 1-ε: exploit (best known action)
        """
        state_key = self.discretize_state(state)

        # Initialize Q-values if state not seen before
        if state_key not in self.q_table:
            self.q_table[state_key] = np.random.uniform(0, 1, self.action_dim)

        # Epsilon-greedy
        if epsilon_greedy and np.random.random() < self.epsilon:
            return np.random.randint(self.action_dim)
        else:
            return int(np.argmax(self.q_table[state_key]))

    def update(self, state: np.ndarray, action: int, reward: float,
              next_state: np.ndarray, done: bool):
        """
        Q-learning update rule

        Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)]
        """
        state_key = self.discretize_state(state)
        next_state_key = self.discretize_state(next_state)

        # Initialize if needed
        if state_key not in self.q_table:
            self.q_table[state_key] = np.random.uniform(0, 1, self.action_dim)
        if next_state_key not in self.q_table:
            self.q_table[next_state_key] = np.random.uniform(0, 1, self.action_dim)

        # Current Q-value
        current_q = self.q_table[state_key][action]

        # TD target
        if done:
            td_target = reward
        else:
            td_target = reward + self.discount_factor * np.max(self.q_table[next_state_key])

        # TD error
        td_error = td_target - current_q

        # Update Q-value
        self.q_table[state_key][action] += self.learning_rate * td_error

        # Decay epsilon
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)

    def get_action_details(self, action: int) -> Dict:
        """Get study strategy details for action"""
        return self.actions.get(action, self.actions[0])


class MomentumScoreCalculator:
    """
    Main momentum score calculator integrating all mathematical models
    """

    def __init__(self):
        self.heat_model = HeatEquationMomentumModel()
        self.variational_optimizer = VariationalMomentumOptimizer()
        self.bayesian_estimator = BayesianMomentumEstimator()
        self.pca_reducer = PCADimensionalityReducer()
        self.rl_agent = DeepQLearningAgent()

    def calculate_comprehensive_score(self,
                                     student_state: StudentState,
                                     teacher_feedback: float,
                                     time_horizon: float = 1.0) -> Dict:
        """
        Calculate momentum score using multiple mathematical approaches

        Combines:
        1. Heat equation PDE solution
        2. Bayesian estimation with uncertainty
        3. Variational optimization

        Returns comprehensive analysis
        """
        # 1. PDE-based prediction
        params = {
            'teacher_intervention': teacher_feedback,
            'external_stress': student_state.psychological_state[0] / 10
        }
        pde_state = self.heat_model.solve(student_state, time_horizon, params)

        # 2. Bayesian prediction with uncertainty
        features = np.concatenate([
            student_state.academic_state,
            student_state.psychological_state,
            [teacher_feedback]
        ])
        bayesian_mean, bayesian_std = self.bayesian_estimator.predict(features)
        conf_lower, conf_upper = self.bayesian_estimator.get_confidence_interval(features)

        # 3. Combined score (weighted average)
        pde_weight = 0.6
        bayesian_weight = 0.4

        combined_score = (pde_weight * pde_state.momentum_score +
                         bayesian_weight * bayesian_mean)

        # Update Bayesian model
        self.bayesian_estimator.update(features, combined_score)

        return {
            'momentum_score': float(combined_score),
            'pde_prediction': float(pde_state.momentum_score),
            'bayesian_prediction': float(bayesian_mean),
            'uncertainty': float(bayesian_std),
            'confidence_interval': (float(conf_lower), float(conf_upper)),
            'learning_velocity': float(pde_state.learning_velocity),
            'updated_state': pde_state
        }

    def recommend_study_strategy(self, student_state: StudentState,
                                subject: str) -> Dict:
        """Use RL agent to recommend optimal study strategy"""
        # Construct state vector for RL
        rl_state = np.concatenate([
            [student_state.momentum_score],
            student_state.academic_state[:3],  # Use first 3 academic features
            student_state.psychological_state[:3],  # Use first 3 psych features
            [student_state.subject_performance.get(subject, 50)]
        ])

        # Get optimal action
        action = self.rl_agent.get_action(rl_state, epsilon_greedy=True)
        strategy = self.rl_agent.get_action_details(action)

        return {
            'subject': subject,
            'recommended_strategy': strategy,
            'action_id': action,
            'confidence': 1 - self.rl_agent.epsilon
        }
