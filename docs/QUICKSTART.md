# Quick Start Guide - Momentum AI

This guide will help you get Momentum AI running in under 10 minutes.

---

## Prerequisites

- **Docker** and **Docker Compose** installed
- OR **Python 3.11+** and **Node.js 18+**

---

## Option 1: Docker (Recommended)

### Step 1: Clone and Start

```bash
git clone https://github.com/yourusername/momentum-ai.git
cd momentum-ai
docker-compose up -d
```

### Step 2: Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Step 3: Initialize Database

```bash
docker-compose exec backend python -c "from app.core.database import init_db; init_db()"
```

---

## Option 2: Manual Installation

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Initialize database
python -c "from app.core.database import init_db; init_db()"

# Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env

# Start development server
npm run dev
```

---

## Quick Test

### 1. Create a Student

```bash
curl -X POST "http://localhost:8000/api/v1/students" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "grade": 10,
    "school": "Example High School"
  }'
```

### 2. Submit Assessment

```bash
curl -X POST "http://localhost:8000/api/v1/assessments" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "stress_level": 7,
    "motivation": 4,
    "confidence": 5,
    "resilience": 6,
    "social_support": 7,
    "sleep_quality": 5,
    "academic_concern": 8
  }'
```

### 3. Add Academic Metrics

```bash
curl -X POST "http://localhost:8000/api/v1/academic-metrics" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "gpa": 2.8,
    "attendance_rate": 85,
    "assignment_completion_rate": 60,
    "test_average": 72
  }'
```

### 4. Calculate Momentum Score

```bash
curl -X POST "http://localhost:8000/api/v1/momentum/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "teacher_feedback": 6.5
  }'
```

**Expected Response:**
```json
{
  "student_id": "STU001",
  "momentum_score": 67.5,
  "pde_prediction": 68.2,
  "bayesian_prediction": 66.8,
  "uncertainty": 5.3,
  "confidence_interval": [62.2, 72.8],
  "learning_velocity": 1.2
}
```

### 5. Generate Collapse Forecast

```bash
curl -X POST "http://localhost:8000/api/v1/forecast/collapse" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "forecast_days": 30
  }'
```

**Expected Response:**
```json
{
  "collapse_probability": 0.45,
  "collapse_risk_level": "medium",
  "days_until_collapse": null,
  "intervention_urgency": 55,
  "primary_risk_factors": [
    "Moderate stress levels",
    "Below-average academic performance"
  ],
  "momentum_forecast": [67.5, 66.8, ...],
  "is_stable": true,
  "lyapunov_exponent": -0.05,
  "bifurcation_nearness": 0.25,
  "recommended_interventions": [...]
}
```

---

## Understanding the Results

### Momentum Score (0-100)

- **80-100**: Excellent momentum, thriving student
- **60-79**: Good momentum, on track
- **40-59**: Moderate momentum, needs some support
- **20-39**: Low momentum, intervention recommended
- **0-19**: Critical, immediate intervention required

### Collapse Risk Levels

- **Low**: Probability < 0.3, student is stable
- **Medium**: Probability 0.3-0.5, monitor closely
- **High**: Probability 0.5-0.7, intervention recommended
- **Critical**: Probability > 0.7, immediate intervention required

### Lyapunov Exponent

- **Negative**: Stable trajectory, predictable progress
- **Near Zero**: Marginally stable, monitor
- **Positive**: Unstable, small changes → large effects

### Bifurcation Nearness

- **> 0.5**: Far from tipping point, safe
- **0.1-0.5**: Approaching instability, caution
- **< 0.1**: Near catastrophic transition, urgent

---

## Running Tests

```bash
# Backend tests
cd backend
pytest -v

# Frontend tests
cd frontend
npm test
```

---

## Troubleshooting

### Port Already in Use

```bash
# Change ports in docker-compose.yml or use:
docker-compose down
lsof -ti:8000 | xargs kill -9
```

### Database Connection Error

```bash
# Ensure PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## Next Steps

1. **Explore API**: http://localhost:8000/docs
2. **Read Math Documentation**: [docs/MATHEMATICS.md](MATHEMATICS.md)
3. **Customize Settings**: Edit `.env` file
4. **Add Real Data**: Use the API or web interface
5. **Set Up Production**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Support

- **Issues**: https://github.com/yourusername/momentum-ai/issues
- **Documentation**: [Full Documentation](README.md)
- **Math Explanations**: [Mathematical Foundations](MATHEMATICS.md)

---

**Happy forecasting!** 🚀
