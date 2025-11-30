# Mathematical Foundations of Momentum AI

This document provides a comprehensive explanation of all mathematical models, PDEs, statistical methods, and algorithms used in Momentum AI.

---

## Table of Contents

1. [Heat Equation & Parabolic PDEs](#heat-equation)
2. [Reaction-Diffusion Systems](#reaction-diffusion)
3. [Catastrophe Theory](#catastrophe-theory)
4. [Stochastic Differential Equations](#sdes)
5. [Fokker-Planck Equation](#fokker-planck)
6. [Lyapunov Stability Analysis](#lyapunov)
7. [Time Series Forecasting](#time-series)
8. [Bayesian Inference](#bayesian)
9. [Reinforcement Learning](#reinforcement-learning)
10. [Numerical Methods](#numerical-methods)

---

## 1. Heat Equation & Parabolic PDEs {#heat-equation}

### Physical Interpretation

The **heat equation** models how "temperature" (momentum) diffuses through a medium over time.

### Mathematical Formulation

```
∂M/∂t = α∇²M + source(x,t)
```

Where:
- `M(x,t)`: Momentum score as a field over space and time
- `α`: Thermal diffusivity coefficient (how quickly momentum stabilizes)
- `∇²M`: Laplacian operator = ∂²M/∂x₁² + ∂²M/∂x₂² + ... (second derivatives)
- `source(x,t)`: External forcing terms

### Application to Student Momentum

```
∂M/∂t = α∇²M + β·P(x,t) + γ·A(x,t) + δ·I(t)
```

Where:
- `P(x,t)`: Psychological state field (stress, motivation, confidence)
- `A(x,t)`: Academic performance field (GPA, engagement, completion)
- `I(t)`: Teacher/system interventions
- `α, β, γ, δ`: Coupling coefficients

### Why This Works

1. **Diffusion**: Students' momentum tends to equilibrate over time (regression to mean)
2. **Sources**: Psychological and academic factors "heat up" or "cool down" momentum
3. **Interventions**: External support acts as a heat source
4. **Stability**: The Laplacian term ensures smooth, realistic trajectories

### Numerical Solution

We use **Runge-Kutta 4/5 (RK45)** method:

```python
from scipy.integrate import solve_ivp

solution = solve_ivp(
    fun=pde_right_hand_side,
    t_span=(0, T),
    y0=initial_state,
    method='RK45',
    rtol=1e-6,
    atol=1e-8
)
```

---

## 2. Reaction-Diffusion Systems {#reaction-diffusion}

### Lotka-Volterra-Inspired Model

```
∂M/∂t = D_M∇²M + αM - βMP - γM²
∂A/∂t = D_A∇²A + f(M,A,P)
∂P/∂t = D_P∇²P + g(M,A,P)
```

Where:
- `D_M, D_A, D_P`: Diffusion coefficients
- `αM`: Natural momentum growth
- `βMP`: Momentum-stress coupling (stress reduces momentum)
- `γM²`: Self-limiting term (burnout, diminishing returns)

### Interpretation

- **Momentum** and **Psychological Distress** interact like predator-prey
- High stress "consumes" momentum
- Recovery occurs when stress decreases
- Academic performance influences both

---

## 3. Catastrophe Theory {#catastrophe-theory}

### Cusp Catastrophe Model

```
V(x, a, b) = ¼x⁴ + ½ax² + bx
```

This is a **potential function** where:
- `x`: State variable (academic performance)
- `a, b`: Control parameters (stress and support)

### Critical Points

Equilibrium points satisfy:
```
dV/dx = 0  →  x³ + ax + b = 0
```

### Bifurcation Set

The system has multiple equilibria when:
```
4a³ + 27b² = 0
```

This is the **catastrophe manifold** - crossing it causes sudden state changes.

### Physical Meaning

```
        High Support
             │
             │  Safe Zone
        ─────┼─────
             │
Bifurcation  │  Danger Zone
   Curve     │  (Sudden Collapse)
        ─────┼─────
             │
        Low Support
             └──── High Stress
```

### Application

When a student's `(stress, support)` point approaches the bifurcation curve:
- **Small changes** → **Large effects**
- Risk of **catastrophic collapse**
- **Immediate intervention required**

### Mathematical Detection

```python
def is_near_bifurcation(stress, support):
    a = (stress - 50) / 25  # Normalized
    b = (support - 50) / 25

    bifurcation_value = abs(4 * a**3 + 27 * b**2)

    return bifurcation_value < threshold
```

---

## 4. Stochastic Differential Equations {#sdes}

### General Form

```
dX_t = μ(X_t, t)dt + σ(X_t, t)dW_t
```

Where:
- `μ(X_t, t)`: **Drift** (deterministic trend)
- `σ(X_t, t)`: **Diffusion** (random fluctuations)
- `dW_t`: **Wiener process** (Brownian motion)

### Student Momentum SDE

```
dM_t = [α(50 - M_t) + βA_t + γP_t + δI_t]dt + σdW_t
```

Components:
- `α(50 - M_t)`: Mean reversion (tend toward average)
- `βA_t`: Academic performance effect
- `γP_t`: Psychological state effect
- `δI_t`: Intervention effect
- `σdW_t`: Random noise (unpredictable events)

### Euler-Maruyama Method

Numerical solution:

```
M_{t+Δt} = M_t + μ(M_t,t)·Δt + σ·√Δt·Z
```

Where `Z ~ N(0,1)` (standard normal random variable)

### Monte Carlo Simulation

Run 100+ trajectories with different random seeds:

```python
for sim in range(n_simulations):
    M, A, P = M0, A0, P0

    for step in range(n_steps):
        dW = np.random.normal(0, sqrt(dt))

        dM = drift(M, A, P) * dt + noise * dW
        M += dM

        trajectories[sim, step] = M
```

### Uncertainty Quantification

```python
mean_forecast = np.mean(trajectories, axis=0)
std_forecast = np.std(trajectories, axis=0)

# 95% confidence interval
lower = np.percentile(trajectories, 2.5, axis=0)
upper = np.percentile(trajectories, 97.5, axis=0)
```

---

## 5. Fokker-Planck Equation {#fokker-planck}

### Probability Density Evolution

```
∂p/∂t = -∂/∂x[μ(x,t)p] + ½∂²/∂x²[σ²(x,t)p]
```

Where:
- `p(x,t)`: Probability density of being in state `x` at time `t`
- First term: **Advection** (drift)
- Second term: **Diffusion** (spread)

### Connection to SDEs

The Fokker-Planck equation describes the **evolution of probability** for the SDE:
```
dX_t = μ(X_t,t)dt + σ(X_t,t)dW_t
```

### Application

Compute the **probability distribution** of momentum scores at future times:
- What's the probability a student drops below 30?
- What's the expected distribution in 2 weeks?

---

## 6. Lyapunov Stability Analysis {#lyapunov}

### Lyapunov Exponent

Measures sensitivity to initial conditions:

```
λ = lim_{t→∞} [1/t · ln(||δ(t)||/||δ(0)||)]
```

Where `δ(t)` is the deviation from a reference trajectory.

### Interpretation

- `λ > 0`: **Unstable** (small changes → large effects, chaotic)
- `λ = 0`: **Neutrally stable** (marginal)
- `λ < 0`: **Stable** (deviations decay)

### Calculation from Time Series

```python
def calculate_lyapunov(trajectory):
    divergences = []

    for i in range(1, len(trajectory)):
        diff = abs(trajectory[i] - trajectory[i-1])
        if diff > epsilon:
            divergences.append(np.log(diff / epsilon))

    return np.mean(divergences)
```

### Application

Students with `λ > 0`:
- Unpredictable trajectories
- Small setbacks → major collapse
- **High priority for intervention**

---

## 7. Time Series Forecasting {#time-series}

### ARIMA Model

```
ARIMA(p, d, q)
```

**Components:**
- **AR(p)**: Autoregressive (depends on past values)
  ```
  y_t = c + φ₁y_{t-1} + φ₂y_{t-2} + ... + φ_p y_{t-p} + ε_t
  ```

- **I(d)**: Integrated (differencing to achieve stationarity)
  ```
  Δy_t = y_t - y_{t-1}
  ```

- **MA(q)**: Moving average (depends on past errors)
  ```
  y_t = c + ε_t + θ₁ε_{t-1} + θ₂ε_{t-2} + ... + θ_q ε_{t-q}
  ```

### SARIMAX Extension

Adds:
- **Seasonal** components
- **Exogenous** variables (teacher feedback, interventions)

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX

model = SARIMAX(
    time_series,
    order=(2, 1, 2),           # ARIMA order
    seasonal_order=(0, 0, 0, 0) # No seasonality
)

results = model.fit()
forecast = results.forecast(steps=30)
```

---

## 8. Bayesian Inference {#bayesian}

### Gaussian Process Regression

**Prior:**
```
f(x) ~ GP(μ(x), k(x, x'))
```

**Kernel Function (RBF):**
```
k(x, x') = σ² · exp(-||x - x'||² / (2l²))
```

Where:
- `σ²`: Signal variance
- `l`: Length scale (correlation distance)

**Posterior** (after observing data `y`):
```
f(x)|y ~ GP(μ_post(x), k_post(x, x'))
```

### Predictive Distribution

For new point `x*`:
```
f(x*)|y ~ N(μ_post(x*), σ²_post(x*))
```

### Application

```python
from sklearn.gaussian_process import GaussianProcessRegressor

gp = GaussianProcessRegressor(kernel=RBF())
gp.fit(X_train, y_train)

# Prediction with uncertainty
mean, std = gp.predict(X_test, return_std=True)

# 95% confidence interval
lower = mean - 1.96 * std
upper = mean + 1.96 * std
```

### Benefits

- **Uncertainty quantification**: Know how confident predictions are
- **Adaptive learning**: Updates beliefs with new data
- **Non-parametric**: Doesn't assume specific functional form

---

## 9. Reinforcement Learning {#reinforcement-learning}

### Q-Learning Algorithm

**Goal:** Learn optimal policy π*(s) that maximizes cumulative reward

**Q-Function:**
```
Q(s, a) = expected cumulative reward from state s, taking action a
```

**Bellman Equation:**
```
Q(s, a) = r + γ · max_{a'} Q(s', a')
```

**Update Rule:**
```
Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') - Q(s,a)]
```

Where:
- `α`: Learning rate (0 < α < 1)
- `γ`: Discount factor (0 < γ < 1)
- `r`: Immediate reward

### ε-Greedy Exploration

```python
if random() < ε:
    action = random_action()  # Explore
else:
    action = argmax Q(s, a)   # Exploit
```

### State Space

```
s = [momentum_score, stress, motivation, confidence,
     subject_difficulty, time_available]
```

### Action Space

```
a = {active_recall, spaced_repetition, practice_testing,
     pomodoro, interleaved_practice, elaborative_interrogation}
```

### Reward Function

```
r = Δ(momentum) + Δ(academic_performance) - time_cost
```

### Application

Learn which study method works best for each psychological/academic state.

---

## 10. Numerical Methods {#numerical-methods}

### Runge-Kutta Methods (RK45)

For solving ODEs: `dy/dt = f(t, y)`

**4th Order Runge-Kutta:**
```
k₁ = f(t_n, y_n)
k₂ = f(t_n + h/2, y_n + h·k₁/2)
k₃ = f(t_n + h/2, y_n + h·k₂/2)
k₄ = f(t_n + h, y_n + h·k₃)

y_{n+1} = y_n + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)
```

**Adaptive Step Size:**
- Compares 4th and 5th order estimates
- Adjusts `h` to maintain error tolerance

### Finite Difference Method

For PDEs, discretize space and time:

```
∂M/∂t ≈ (M_{i,j+1} - M_{i,j}) / Δt

∂²M/∂x² ≈ (M_{i+1,j} - 2M_{i,j} + M_{i-1,j}) / Δx²
```

### Monte Carlo Integration

For high-dimensional integrals:

```
∫f(x)dx ≈ (1/N) Σ f(x_i)
```

Where `x_i` are random samples.

---

## Summary of Mathematical Components

| Component | Type | Purpose | Key Equation |
|-----------|------|---------|--------------|
| **Heat Equation** | Parabolic PDE | Momentum evolution | ∂M/∂t = α∇²M + sources |
| **Catastrophe Theory** | Bifurcation Analysis | Tipping points | V = ¼x⁴ + ½ax² + bx |
| **Stochastic DEs** | Stochastic Calculus | Uncertainty | dX = μdt + σdW |
| **Fokker-Planck** | Probability PDE | Distribution evolution | ∂p/∂t = -∂(μp)/∂x + ½∂²(σ²p)/∂x² |
| **Lyapunov** | Stability Theory | Trajectory stability | λ = lim ln(δ(t)/δ(0))/t |
| **ARIMA** | Time Series | Trend forecasting | ARIMA(p,d,q) |
| **Gaussian Process** | Bayesian ML | Uncertainty quantification | f ~ GP(μ,K) |
| **Q-Learning** | Reinforcement Learning | Strategy optimization | Q(s,a) ← Q + α[r + γmax Q - Q] |
| **RK45** | Numerical ODE | PDE solving | Adaptive Runge-Kutta |

---

## References

1. **Catastrophe Theory**: Thom, R. (1972). "Structural Stability and Morphogenesis"
2. **Stochastic Calculus**: Øksendal, B. (2003). "Stochastic Differential Equations"
3. **Reinforcement Learning**: Sutton & Barto (2018). "Reinforcement Learning: An Introduction"
4. **Gaussian Processes**: Rasmussen & Williams (2006). "Gaussian Processes for Machine Learning"
5. **Numerical Methods**: Press et al. (2007). "Numerical Recipes"

---

**Questions or suggestions?** Open an issue on GitHub!
