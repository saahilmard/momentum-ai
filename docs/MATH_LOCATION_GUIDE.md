# Mathematical Components - Location Guide

This guide shows you exactly where each mathematical model is implemented in the codebase.

---

## 📍 Heat Equation (Parabolic PDE)

### Location
[`backend/app/core/momentum_engine.py:HeatEquationMomentumModel`](../backend/app/core/momentum_engine.py)

### Lines
~60-150

### Equation Implemented
```
∂M/∂t = α∇²M + β·P(x,t) + γ·A(x,t) + source(x,t)
```

### Key Methods
- `momentum_pde()` - Right-hand side of PDE system
- `solve()` - Numerical integration using RK45

### Usage Example
```python
from app.core.momentum_engine import HeatEquationMomentumModel

model = HeatEquationMomentumModel(alpha=0.5, beta=0.3, gamma=0.2)
updated_state = model.solve(student_state, time_horizon=1.0, params)
```

---

## 📍 Catastrophe Theory (Cusp Catastrophe)

### Location
[`backend/app/core/forecasting_engine.py:CatastropheTheoryAnalyzer`](../backend/app/core/forecasting_engine.py)

### Lines
~80-180

### Equations Implemented
```
V(x,a,b) = ¼x⁴ + ½ax² + bx
Bifurcation set: 4a³ + 27b² = 0
Critical surface: x³ + ax + b = 0
```

### Key Methods
- `potential_function()` - Cusp potential V(x,a,b)
- `find_equilibria()` - Solves x³ + ax + b = 0
- `is_on_bifurcation_set()` - Checks proximity to tipping point
- `analyze_collapse_risk()` - Complete catastrophe analysis

### Usage Example
```python
from app.core.forecasting_engine import CatastropheTheoryAnalyzer

analyzer = CatastropheTheoryAnalyzer()
result = analyzer.analyze_collapse_risk(momentum=50, stress=70, support=40)
# result['collapse_risk'], result['near_bifurcation']
```

---

## 📍 Stochastic Differential Equations

### Location
[`backend/app/core/forecasting_engine.py:StochasticDynamicsModel`](../backend/app/core/forecasting_engine.py)

### Lines
~185-350

### Equations Implemented
```
dM_t = μ(M,A,P)dt + σdW_t
dA_t = f_A(M,A,P)dt + σ_A dW_t
dP_t = f_P(M,A,P)dt + σ_P dW_t
```

### Key Methods
- `drift_momentum()` - Deterministic drift μ(M,A,P)
- `drift_academic()` - Academic drift f_A
- `drift_psychological()` - Psychological drift f_P
- `simulate_trajectory()` - Monte Carlo simulation with Euler-Maruyama

### Usage Example
```python
from app.core.forecasting_engine import StochasticDynamicsModel

model = StochasticDynamicsModel()
result = model.simulate_trajectory(
    M0=50, A0=60, P0=40,
    intervention_schedule=np.zeros(30),
    n_days=30,
    n_simulations=100
)
# result['momentum_mean'], result['momentum_std'], result['collapse_probability']
```

---

## 📍 Fokker-Planck Equation

### Location
Implicitly used in [`backend/app/core/forecasting_engine.py:StochasticDynamicsModel`](../backend/app/core/forecasting_engine.py)

### Implementation
The Monte Carlo simulation of SDEs generates samples from the probability distribution governed by the Fokker-Planck equation.

### Equation
```
∂p/∂t = -∂/∂x[μ(x,t)p] + ½∂²/∂x²[σ²(x,t)p]
```

---

## 📍 Lyapunov Stability Analysis

### Location
[`backend/app/core/forecasting_engine.py:LyapunovStabilityAnalyzer`](../backend/app/core/forecasting_engine.py)

### Lines
~480-560

### Equation Implemented
```
λ = lim_{t→∞} [1/t · ln(||δ(t)||/||δ(0)||)]
```

### Key Methods
- `calculate_lyapunov_exponent()` - Compute λ from trajectory
- `assess_stability()` - Determine stability classification

### Usage Example
```python
from app.core.forecasting_engine import LyapunovStabilityAnalyzer

analyzer = LyapunovStabilityAnalyzer()
lyapunov_exp = analyzer.calculate_lyapunov_exponent(momentum_trajectory)
stability = analyzer.assess_stability(momentum=70, academic_state, psych_state)
# lyapunov_exp > 0 → unstable
```

---

## 📍 Time Series Forecasting (ARIMA/SARIMAX)

### Location
[`backend/app/core/forecasting_engine.py:TimeSeriesForecaster`](../backend/app/core/forecasting_engine.py)

### Lines
~355-475

### Models Implemented
```
ARIMA(p,d,q): AutoRegressive Integrated Moving Average
SARIMAX: Seasonal ARIMA with exogenous variables
```

### Key Methods
- `fit_predict_arima()` - SARIMAX model fitting and forecasting
- `fit_predict_exponential_smoothing()` - Holt-Winters method

### Usage Example
```python
from app.core.forecasting_engine import TimeSeriesForecaster

forecaster = TimeSeriesForecaster()
result = forecaster.fit_predict_arima(momentum_history, forecast_horizon=30)
# result['forecast'], result['lower_bound'], result['upper_bound']
```

---

## 📍 Bayesian Inference (Gaussian Processes)

### Location
[`backend/app/core/momentum_engine.py:BayesianMomentumEstimator`](../backend/app/core/momentum_engine.py)

### Lines
~220-310

### Models Implemented
```
Prior: M ~ GP(μ, K)
Kernel: k(x,x') = σ² exp(-||x-x'||²/2l²)
Posterior: M|y ~ GP(μ_post, K_post)
```

### Key Methods
- `update()` - Bayesian update with new observation
- `predict()` - Posterior predictive distribution
- `get_confidence_interval()` - Uncertainty bounds

### Usage Example
```python
from app.core.momentum_engine import BayesianMomentumEstimator

estimator = BayesianMomentumEstimator()
estimator.update(features, momentum_score)
mean, std = estimator.predict(new_features)
lower, upper = estimator.get_confidence_interval(new_features, confidence=0.95)
```

---

## 📍 Reinforcement Learning (Q-Learning)

### Location
[`backend/app/core/momentum_engine.py:DeepQLearningAgent`](../backend/app/core/momentum_engine.py)

### Lines
~320-450

### Algorithm Implemented
```
Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') - Q(s,a)]
```

### Key Methods
- `get_action()` - ε-greedy action selection
- `update()` - Q-learning update rule
- `discretize_state()` - State space discretization

### Usage Example
```python
from app.core.momentum_engine import DeepQLearningAgent

agent = DeepQLearningAgent(state_dim=10, action_dim=6)
action = agent.get_action(state_vector, epsilon_greedy=True)
agent.update(state, action, reward, next_state, done=False)
strategy = agent.get_action_details(action)
```

---

## 📍 Principal Component Analysis (PCA)

### Location
[`backend/app/core/momentum_engine.py:PCADimensionalityReducer`](../backend/app/core/momentum_engine.py)

### Lines
~315-365

### Method Implemented
```
X = UΣV^T (SVD decomposition)
Reduced features: first k principal components
```

### Key Methods
- `fit_transform()` - Fit PCA and reduce dimensions
- `transform()` - Apply fitted PCA to new data
- `get_explained_variance_ratio()` - Variance explained by each component

---

## 📍 Variational Calculus (Energy Minimization)

### Location
[`backend/app/core/momentum_engine.py:VariationalMomentumOptimizer`](../backend/app/core/momentum_engine.py)

### Lines
~155-215

### Functional Minimized
```
E[M] = ∫∫[½|∇M|² + V(M,A,P) + λ·constraints]dxdt
```

### Key Methods
- `energy_functional()` - Compute E[M]
- `optimize_trajectory()` - Find optimal path via L-BFGS-B

---

## 📍 Comprehensive Integration

### Location
[`backend/app/core/forecasting_engine.py:AcademicCollapseForecastingEngine`](../backend/app/core/forecasting_engine.py)

### Lines
~570-800

### What It Does
Combines ALL mathematical models:
1. Catastrophe theory → tipping points
2. Stochastic dynamics → uncertainty
3. Time series → trends
4. Lyapunov → stability
5. RL → pattern recognition

### Master Method
```python
def comprehensive_forecast(student_id, momentum_history, academic_history,
                          psychological_history, current_support, forecast_days=30)
```

**Returns:** Complete `ForecastResult` with collapse probability, interventions, trajectories

---

## 📊 Quick Reference Table

| Math Component | File | Class | Key Method |
|----------------|------|-------|------------|
| **Heat Equation** | `momentum_engine.py` | `HeatEquationMomentumModel` | `solve()` |
| **Catastrophe Theory** | `forecasting_engine.py` | `CatastropheTheoryAnalyzer` | `analyze_collapse_risk()` |
| **SDEs** | `forecasting_engine.py` | `StochasticDynamicsModel` | `simulate_trajectory()` |
| **Lyapunov** | `forecasting_engine.py` | `LyapunovStabilityAnalyzer` | `calculate_lyapunov_exponent()` |
| **ARIMA** | `forecasting_engine.py` | `TimeSeriesForecaster` | `fit_predict_arima()` |
| **Gaussian Process** | `momentum_engine.py` | `BayesianMomentumEstimator` | `predict()` |
| **Q-Learning** | `momentum_engine.py` | `DeepQLearningAgent` | `get_action()`, `update()` |
| **PCA** | `momentum_engine.py` | `PCADimensionalityReducer` | `fit_transform()` |
| **Variational** | `momentum_engine.py` | `VariationalMomentumOptimizer` | `optimize_trajectory()` |
| **Master Forecast** | `forecasting_engine.py` | `AcademicCollapseForecastingEngine` | `comprehensive_forecast()` |

---

## 🎯 API Endpoints Using These Models

| Endpoint | Mathematical Models Used |
|----------|-------------------------|
| `POST /api/v1/momentum/calculate` | Heat Equation PDE, Bayesian GP |
| `POST /api/v1/forecast/collapse` | ALL models (ensemble) |
| `GET /api/v1/momentum/{id}/history` | Time series analysis |

---

## 📖 Additional Documentation

- **Full Math Theory**: [`docs/MATHEMATICS.md`](MATHEMATICS.md)
- **API Reference**: `http://localhost:8000/docs`
- **Quick Start**: [`docs/QUICKSTART.md`](QUICKSTART.md)

---

**Need help?** Open an issue on GitHub!
