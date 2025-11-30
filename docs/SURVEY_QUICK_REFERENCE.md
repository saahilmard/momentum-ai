# Student Survey - Quick Reference Card

## 📋 10 Questions (1-10 Scale)

### 🧠 Psychological State

| # | Question | Low (1-3) | High (8-10) | Math Use |
|---|----------|-----------|-------------|----------|
| **1** | **Stress Level** | Relaxed, calm | Overwhelmed, anxious | Catastrophe parameter `a` |
| **2** | **Motivation** | Don't care, apathetic | Eager, driven | PDE source term, RL state |
| **3** | **Confidence** | Feel like failing | Believe in success | Bayesian prior, momentum |
| **4** | **Resilience** | Give up easily | Bounce back quickly | Lyapunov stability |

### 🤝 Support Systems

| # | Question | Low (1-3) | High (8-10) | Math Use |
|---|----------|-----------|-------------|----------|
| **5** | **Social Support** | Isolated, alone | Strong friend network | Catastrophe parameter `b` |
| **8** | **Family Support** | No support, conflict | Very supportive | Wellbeing composite |

### 🎯 Academic & Lifestyle

| # | Question | Low (1-3) | High (8-10) | Math Use |
|---|----------|-----------|-------------|----------|
| **7** | **Academic Concern** | Not worried | Extremely worried | Risk multiplier |
| **6** | **Sleep Quality** | Exhausted, poor sleep | Well-rested | Volatility term |
| **10** | **Time Management** | Disorganized, behind | Excellent organization | Study strategy selection |
| **9** | **Extracurriculars** | No activities | Well-balanced | Wellbeing (U-shaped) |

---

## 🚨 Critical Thresholds

| Condition | Action |
|-----------|--------|
| Stress ≥ 8 **AND** Motivation ≤ 3 | **CRITICAL ALERT** - Immediate intervention |
| Academic Concern ≥ 9 | **HIGH ALERT** - Counseling recommended |
| Sleep ≤ 2 for 2+ weeks | **HEALTH ALERT** - Medical referral |
| Social + Family ≤ 4 (combined) | **ISOLATION ALERT** - Support network building |

---

## 🎯 Ideal Ranges

- **Stress**: 3-5 (manageable)
- **Motivation**: 7-9 (engaged)
- **Confidence**: 6-8 (realistic optimism)
- **Resilience**: 7-9 (bounces back)
- **Support**: 7-10 (strong network)
- **Sleep**: 7-9 (well-rested)
- **Concern**: 2-5 (aware but not anxious)
- **Time Mgmt**: 6-8 (organized)
- **Activities**: 5-7 (balanced)

---

## 📊 Example Profiles

### 🟢 Thriving Student
```
Stress: 3, Motivation: 9, Confidence: 8
→ Momentum: 85, Risk: LOW (5%)
```

### 🟡 Needs Support
```
Stress: 6, Motivation: 5, Confidence: 4
→ Momentum: 48, Risk: MEDIUM (42%)
```

### 🔴 Critical Risk
```
Stress: 9, Motivation: 2, Confidence: 3
→ Momentum: 25, Risk: CRITICAL (85%)
```

---

## ⚡ Quick API Test

```bash
curl -X POST http://localhost:8000/api/v1/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "stress_level": 7,
    "motivation": 4,
    "confidence": 5,
    "resilience": 6,
    "social_support": 7,
    "sleep_quality": 5,
    "academic_concern": 8,
    "family_support": 6,
    "extracurricular_engagement": 3,
    "time_management": 4
  }'
```

---

**Full Details:** [SURVEY_QUESTIONS.md](SURVEY_QUESTIONS.md)
