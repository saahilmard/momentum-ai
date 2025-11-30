# Momentum AI - Academic Recovery & Collapse Forecasting Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal.svg)
![React](https://img.shields.io/badge/React-18.2+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

An advanced educational platform that uses **Partial Differential Equations (PDEs)**, **Catastrophe Theory**, **Stochastic Calculus**, **Reinforcement Learning**, and **Bayesian Statistics** to:

1. 📊 Calculate dynamic "Momentum Scores" for students
2. 🔮 **Forecast academic collapse** weeks in advance
3. 🎯 Provide AI-driven intervention recommendations
4. 📈 Enable proactive academic support for schools

---

## 🎓 Mathematical Foundations

### 1. Heat Equation PDE (Parabolic PDE)

We model momentum evolution using the **heat equation**:

```
∂M/∂t = α∇²M + β·P(x,t) + γ·A(x,t) + I(t)
```

**Where:**
- `M`: Momentum score field
- `α`: Diffusion coefficient (how quickly momentum equilibrates)
- `∇²M`: Laplacian operator (second spatial derivative)
- `P(x,t)`: Psychological state field
- `A(x,t)`: Academic performance field
- `I(t)`: External intervention

**Physical Interpretation:**
- Momentum behaves like "heat" that diffuses over time
- Psychological distress and academic performance act as "heat sources"
- The Laplacian term captures how momentum spreads and stabilizes

**Implementation:** [`backend/app/core/momentum_engine.py:HeatEquationMomentumModel`](backend/app/core/momentum_engine.py)

---

### 2. Catastrophe Theory (Cusp Catastrophe)

We use **catastrophe theory** to identify critical tipping points where students may suddenly collapse:

```
V(x, a, b) = ¼x⁴ + ½ax² + bx
```

**Critical Surface:**
```
x³ + ax + b = 0
```

**Bifurcation Set:**
```
4a³ + 27b² = 0
```

**Where:**
- `x`: Current state (academic performance)
- `a`: Control parameter (stress/pressure)
- `b`: Control parameter (support/resources)

**When to Intervene:**
- When `(a,b)` approaches the bifurcation set, the system is near a catastrophic transition
- Small changes can trigger sudden collapse

**Implementation:** [`backend/app/core/forecasting_engine.py:CatastropheTheoryAnalyzer`](backend/app/core/forecasting_engine.py)

---

### 3. Stochastic Differential Equations (SDEs)

We model randomness and uncertainty using **stochastic calculus**:

```
dM_t = μ(M_t, A_t, P_t)dt + σdW_t
dA_t = f_A(M_t, A_t, P_t)dt + σ_A dW_t
dP_t = f_P(M_t, A_t, P_t)dt + σ_P dW_t
```

**Where:**
- `μ`: Drift term (deterministic trend)
- `σ`: Diffusion term (volatility)
- `W_t`: Wiener process (Brownian motion)

**Numerical Solution:**
- **Euler-Maruyama method** for SDE integration
- **Monte Carlo simulation** (100+ trajectories) for uncertainty quantification

**This allows us to:**
- Quantify prediction uncertainty
- Generate probability distributions
- Calculate confidence intervals

**Implementation:** [`backend/app/core/forecasting_engine.py:StochasticDynamicsModel`](backend/app/core/forecasting_engine.py)

---

### 4. Fokker-Planck Equation

Describes the evolution of probability density:

```
∂p/∂t = -∂/∂x[μ(x,t)p] + ½∂²/∂x²[σ²(x,t)p]
```

This PDE governs how the distribution of student states evolves over time.

---

### 5. Lyapunov Stability Analysis

We assess trajectory stability using **Lyapunov exponents**:

```
λ = lim(t→∞) [1/t · ln(||δ(t)||/||δ(0)||)]
```

**Interpretation:**
- `λ > 0`: **Unstable** (chaotic, sensitive to initial conditions)
- `λ < 0`: **Stable** (predictable trajectory)
- `λ ≈ 0`: **Marginally stable**

**Application:**
- Identify students with unstable academic trajectories
- Predict who needs immediate intervention

**Implementation:** [`backend/app/core/forecasting_engine.py:LyapunovStabilityAnalyzer`](backend/app/core/forecasting_engine.py)

---

### 6. Time Series Forecasting

**ARIMA Models:**
```
ARIMA(p, d, q): AutoRegressive Integrated Moving Average
```

**Where:**
- `p`: Autoregressive order
- `d`: Degree of differencing
- `q`: Moving average order

**SARIMAX Extension:**
```
SARIMAX adds seasonal components and exogenous variables
```

**Implementation:** [`backend/app/core/forecasting_engine.py:TimeSeriesForecaster`](backend/app/core/forecasting_engine.py)

---

### 7. Bayesian Inference & Gaussian Processes

**Prior:**
```
M ~ GP(μ, K)
```

**Posterior:**
```
M|y ~ GP(μ_post, K_post)
```

**Kernel (RBF):**
```
k(x, x') = σ² · exp(-||x - x'||² / 2l²)
```

**Benefits:**
- Uncertainty quantification
- Confidence intervals
- Adaptive learning

**Implementation:** [`backend/app/core/momentum_engine.py:BayesianMomentumEstimator`](backend/app/core/momentum_engine.py)

---

### 8. Reinforcement Learning (Q-Learning)

**Q-Learning Update Rule:**
```
Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]
```

**Where:**
- `s`: State (momentum, stress, subject)
- `a`: Action (study method)
- `r`: Reward (improvement in momentum)
- `α`: Learning rate
- `γ`: Discount factor

**Application:**
- Learn optimal study strategies
- Personalized recommendations
- Adaptive intervention timing

**Implementation:** [`backend/app/core/momentum_engine.py:DeepQLearningAgent`](backend/app/core/momentum_engine.py)

---

## 🏗️ Architecture

```
momentum-ai/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── core/              # Core mathematical engines
│   │   │   ├── momentum_engine.py        # PDE models, RL, Bayesian
│   │   │   ├── forecasting_engine.py     # Collapse prediction
│   │   │   ├── config.py                 # Configuration
│   │   │   └── database.py               # Database connection
│   │   ├── models/            # Database models
│   │   │   └── database.py               # SQLAlchemy models
│   │   ├── api/               # API routes
│   │   │   └── routes.py                 # REST endpoints
│   │   ├── services/          # Business logic
│   │   │   └── momentum_service.py       # Momentum calculations
│   │   └── main.py            # FastAPI app
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── pages/             # React pages
│   │   │   ├── Forecast.tsx              # Collapse forecasting UI
│   │   │   ├── Dashboard.tsx
│   │   │   └── ...
│   │   ├── components/        # Reusable components
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
│
├── docs/                      # Documentation
├── docker-compose.yml        # Docker orchestration
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/momentum-ai.git
cd momentum-ai

# Start all services
docker-compose up -d

# Backend API: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python -c "from app.core.database import init_db; init_db()"

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env

# Run development server
npm run dev
```

---

## 📡 API Endpoints

### Momentum Calculation

**POST** `/api/v1/momentum/calculate`

Calculate momentum score using PDEs and Bayesian estimation.

```json
{
  "student_id": "STU001",
  "teacher_feedback": 6.5
}
```

**Response:**
```json
{
  "momentum_score": 67.5,
  "pde_prediction": 68.2,
  "bayesian_prediction": 66.8,
  "uncertainty": 5.3,
  "confidence_interval": [62.2, 72.8],
  "learning_velocity": 1.2
}
```

---

### Academic Collapse Forecast

**POST** `/api/v1/forecast/collapse`

Generate comprehensive forecast using catastrophe theory, SDEs, and RL.

```json
{
  "student_id": "STU001",
  "forecast_days": 30
}
```

**Response:**
```json
{
  "collapse_probability": 0.65,
  "collapse_risk_level": "high",
  "days_until_collapse": 18,
  "intervention_urgency": 78,
  "primary_risk_factors": [
    "High psychological distress",
    "Declining academic performance",
    "Near critical tipping point"
  ],
  "momentum_forecast": [67.5, 66.2, ...],
  "is_stable": false,
  "lyapunov_exponent": 0.15,
  "bifurcation_nearness": 0.08,
  "recommended_interventions": [...],
  "optimal_intervention_timing": 5
}
```

---

## 🔬 Key Features

### 1. Advanced Mathematical Modeling

- **Heat Equation PDEs** for momentum diffusion
- **Catastrophe Theory** for tipping point detection
- **Stochastic Calculus** for uncertainty modeling
- **Lyapunov Analysis** for stability assessment

### 2. Academic Collapse Prediction

- Forecast student difficulties **30+ days in advance**
- Identify critical intervention points
- Quantify collapse probability
- Multi-model ensemble for robust predictions

### 3. AI-Driven Recommendations

- **Reinforcement Learning** for study strategy optimization
- Personalized intervention timing
- Adaptive learning paths

### 4. Real-Time Monitoring

- Live momentum score tracking
- Automated alert generation
- Teacher dashboard
- School-wide analytics

---

## 📊 Mathematical Methods Summary

| Method | Purpose | Location |
|--------|---------|----------|
| **Heat Equation PDE** | Momentum evolution | `momentum_engine.py` |
| **Catastrophe Theory** | Tipping point detection | `forecasting_engine.py` |
| **Stochastic DEs** | Uncertainty modeling | `forecasting_engine.py` |
| **ARIMA/SARIMAX** | Time series forecasting | `forecasting_engine.py` |
| **Lyapunov Analysis** | Stability assessment | `forecasting_engine.py` |
| **Gaussian Processes** | Bayesian inference | `momentum_engine.py` |
| **Q-Learning** | Study strategy optimization | `momentum_engine.py` |
| **PCA** | Dimensionality reduction | `momentum_engine.py` |

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

---

## 📖 Documentation

Comprehensive documentation is available at:

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc
- **Mathematical Details**: See [`docs/MATHEMATICS.md`](docs/MATHEMATICS.md)
- **Survey Questions**: See [`docs/SURVEY_QUESTIONS.md`](docs/SURVEY_QUESTIONS.md)
- **Quick Reference**: See [`docs/SURVEY_QUICK_REFERENCE.md`](docs/SURVEY_QUICK_REFERENCE.md)
- **Math Locations**: See [`docs/MATH_LOCATION_GUIDE.md`](docs/MATH_LOCATION_GUIDE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Mathematical Foundations**: Based on research in catastrophe theory, stochastic calculus, and dynamical systems
- **Educational Impact**: Designed to support students experiencing academic setbacks
- **Open Science**: Committed to transparent, explainable AI for education

---

## 📧 Contact

For questions, suggestions, or collaboration opportunities:

- **Email**: momentum-ai@example.com
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/momentum-ai/issues)

---

## 🎯 Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] Multi-language support
- [ ] Advanced intervention recommendation engine
- [ ] Integration with learning management systems (LMS)
- [ ] Real-time collaborative features
- [ ] Enhanced visualization dashboard
- [ ] Machine learning model retraining pipeline

---

Made with ❤️ for students and educators worldwide.
