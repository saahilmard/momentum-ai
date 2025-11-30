"""
API Routes for Momentum AI Platform
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

from app.core.database import get_db
from app.models.database import (
    Student, Teacher, Class, Assessment, MomentumScore,
    TeacherFeedback, StudyMaterial, StudySession, SystemAlert,
    AcademicMetric, RecommendedStrategy
)
from app.services.momentum_service import MomentumService

router = APIRouter()


# ============= PYDANTIC SCHEMAS =============

class StudentCreate(BaseModel):
    student_id: str
    email: EmailStr
    first_name: str
    last_name: str
    grade: int = Field(..., ge=1, le=12)
    school: Optional[str] = None


class StudentResponse(BaseModel):
    student_id: str
    email: str
    first_name: str
    last_name: str
    grade: int
    school: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AssessmentCreate(BaseModel):
    student_id: str
    stress_level: int = Field(..., ge=1, le=10)
    motivation: int = Field(..., ge=1, le=10)
    confidence: int = Field(..., ge=1, le=10)
    resilience: int = Field(..., ge=1, le=10)
    social_support: int = Field(..., ge=1, le=10)
    sleep_quality: int = Field(..., ge=1, le=10)
    academic_concern: int = Field(..., ge=1, le=10)
    family_support: Optional[int] = Field(None, ge=1, le=10)
    extracurricular_engagement: Optional[int] = Field(None, ge=1, le=10)
    time_management: Optional[int] = Field(None, ge=1, le=10)


class AcademicMetricCreate(BaseModel):
    student_id: str
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    attendance_rate: Optional[float] = Field(None, ge=0.0, le=100.0)
    assignment_completion_rate: Optional[float] = Field(None, ge=0.0, le=100.0)
    test_average: Optional[float] = Field(None, ge=0.0, le=100.0)
    subject_grades: Optional[dict] = None


class TeacherFeedbackCreate(BaseModel):
    student_id: str
    teacher_id: str
    overall_performance: float = Field(..., ge=0.0, le=10.0)
    engagement_level: float = Field(..., ge=0.0, le=10.0)
    behavior: float = Field(..., ge=0.0, le=10.0)
    participation: float = Field(..., ge=0.0, le=10.0)
    comments: Optional[str] = None
    concerns: Optional[str] = None
    strengths: Optional[str] = None
    intervention_recommended: bool = False
    intervention_type: Optional[str] = None


class MomentumCalculateRequest(BaseModel):
    student_id: str
    teacher_feedback: Optional[float] = Field(None, ge=0.0, le=10.0)


class ForecastRequest(BaseModel):
    student_id: str
    forecast_days: int = Field(30, ge=7, le=90)


# ============= STUDENT ROUTES =============

@router.post("/students", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    """Register a new student"""
    # Check if student already exists
    existing = db.query(Student).filter(Student.student_id == student.student_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student ID already exists")

    existing_email = db.query(Student).filter(Student.email == student.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)

    return db_student


@router.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: str, db: Session = Depends(get_db)):
    """Get student by ID"""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/students", response_model=List[StudentResponse])
def list_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all students"""
    students = db.query(Student).offset(skip).limit(limit).all()
    return students


# ============= ASSESSMENT ROUTES =============

@router.post("/assessments", status_code=status.HTTP_201_CREATED)
def create_assessment(assessment: AssessmentCreate, db: Session = Depends(get_db)):
    """Submit a student assessment (survey)"""
    # Verify student exists
    student = db.query(Student).filter(Student.student_id == assessment.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db_assessment = Assessment(**assessment.dict())
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)

    return {
        "message": "Assessment submitted successfully",
        "assessment_id": db_assessment.id,
        "student_id": db_assessment.student_id
    }


@router.get("/assessments/{student_id}")
def get_student_assessments(student_id: str, limit: int = 10, db: Session = Depends(get_db)):
    """Get assessment history for a student"""
    assessments = db.query(Assessment).filter(
        Assessment.student_id == student_id
    ).order_by(Assessment.assessment_date.desc()).limit(limit).all()

    return assessments


# ============= ACADEMIC METRICS ROUTES =============

@router.post("/academic-metrics", status_code=status.HTTP_201_CREATED)
def create_academic_metric(metric: AcademicMetricCreate, db: Session = Depends(get_db)):
    """Record academic metrics for a student"""
    # Verify student exists
    student = db.query(Student).filter(Student.student_id == metric.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db_metric = AcademicMetric(**metric.dict())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)

    return {
        "message": "Academic metrics recorded successfully",
        "metric_id": db_metric.id,
        "student_id": db_metric.student_id
    }


# ============= TEACHER FEEDBACK ROUTES =============

@router.post("/teacher-feedback", status_code=status.HTTP_201_CREATED)
def create_teacher_feedback(feedback: TeacherFeedbackCreate, db: Session = Depends(get_db)):
    """Submit teacher feedback"""
    # Verify student and teacher exist
    student = db.query(Student).filter(Student.student_id == feedback.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    teacher = db.query(Teacher).filter(Teacher.teacher_id == feedback.teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    db_feedback = TeacherFeedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)

    return {
        "message": "Teacher feedback submitted successfully",
        "feedback_id": db_feedback.id
    }


# ============= MOMENTUM CALCULATION ROUTES =============

@router.post("/momentum/calculate")
def calculate_momentum(request: MomentumCalculateRequest, db: Session = Depends(get_db)):
    """
    Calculate momentum score for a student using advanced PDEs and math

    This endpoint:
    1. Retrieves student assessment and academic data
    2. Applies Heat Equation PDE model
    3. Uses Bayesian estimation with uncertainty
    4. Combines multiple models for robust prediction
    """
    try:
        service = MomentumService(db)
        result = service.calculate_student_momentum(
            request.student_id,
            request.teacher_feedback
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@router.get("/momentum/{student_id}/history")
def get_momentum_history(student_id: str, limit: int = 30, db: Session = Depends(get_db)):
    """Get momentum score history"""
    scores = db.query(MomentumScore).filter(
        MomentumScore.student_id == student_id
    ).order_by(MomentumScore.calculated_at.desc()).limit(limit).all()

    return [{
        "calculated_at": s.calculated_at.isoformat(),
        "momentum_score": s.momentum_score,
        "pde_prediction": s.pde_prediction,
        "bayesian_prediction": s.bayesian_prediction,
        "uncertainty": s.uncertainty,
        "learning_velocity": s.learning_velocity,
        "intervention_level": s.intervention_level
    } for s in scores]


@router.get("/momentum/{student_id}/latest")
def get_latest_momentum(student_id: str, db: Session = Depends(get_db)):
    """Get latest momentum score"""
    score = db.query(MomentumScore).filter(
        MomentumScore.student_id == student_id
    ).order_by(MomentumScore.calculated_at.desc()).first()

    if not score:
        raise HTTPException(status_code=404, detail="No momentum score found for student")

    return {
        "student_id": score.student_id,
        "calculated_at": score.calculated_at.isoformat(),
        "momentum_score": score.momentum_score,
        "pde_prediction": score.pde_prediction,
        "bayesian_prediction": score.bayesian_prediction,
        "uncertainty": score.uncertainty,
        "confidence_interval": [score.confidence_lower, score.confidence_upper],
        "learning_velocity": score.learning_velocity,
        "academic_composite": score.academic_composite,
        "psychological_composite": score.psychological_composite
    }


# ============= FORECASTING ROUTES (ACADEMIC COLLAPSE PREDICTION) =============

@router.post("/forecast/collapse")
def forecast_academic_collapse(request: ForecastRequest, db: Session = Depends(get_db)):
    """
    Generate academic collapse forecast using advanced PDEs and RL

    This endpoint uses:
    1. CATASTROPHE THEORY: Identifies tipping points
    2. STOCHASTIC DIFFERENTIAL EQUATIONS: Models uncertainty
    3. TIME SERIES ANALYSIS: ARIMA forecasting
    4. LYAPUNOV STABILITY ANALYSIS: Assesses trajectory stability
    5. REINFORCEMENT LEARNING: Pattern recognition from historical data

    Returns comprehensive forecast with intervention recommendations
    """
    try:
        service = MomentumService(db)
        forecast = service.generate_forecast(
            request.student_id,
            request.forecast_days
        )
        return forecast
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast error: {str(e)}")


@router.get("/forecast/{student_id}/risk-summary")
def get_risk_summary(student_id: str, db: Session = Depends(get_db)):
    """Get quick risk summary for a student"""
    try:
        service = MomentumService(db)
        forecast = service.generate_forecast(student_id, forecast_days=30)

        return {
            "student_id": student_id,
            "collapse_probability": forecast['collapse_probability'],
            "risk_level": forecast['collapse_risk_level'],
            "intervention_urgency": forecast['intervention_urgency'],
            "primary_risk_factors": forecast['primary_risk_factors'],
            "is_stable": forecast['is_stable'],
            "days_until_collapse": forecast['days_until_collapse']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============= ALERTS ROUTES =============

@router.get("/alerts/{student_id}")
def get_student_alerts(student_id: str, db: Session = Depends(get_db)):
    """Get system-generated alerts for a student"""
    alerts = db.query(SystemAlert).filter(
        SystemAlert.student_id == student_id,
        SystemAlert.resolved == False
    ).order_by(SystemAlert.created_at.desc()).all()

    return alerts


@router.get("/alerts/school/critical")
def get_critical_alerts(db: Session = Depends(get_db)):
    """Get all critical alerts across the school"""
    alerts = db.query(SystemAlert).filter(
        SystemAlert.severity.in_(['critical', 'high']),
        SystemAlert.resolved == False
    ).order_by(SystemAlert.created_at.desc()).all()

    return alerts


@router.put("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, acknowledged_by: str, db: Session = Depends(get_db)):
    """Acknowledge an alert"""
    alert = db.query(SystemAlert).filter(SystemAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged = True
    alert.acknowledged_by = acknowledged_by
    alert.acknowledged_at = datetime.now()

    db.commit()

    return {"message": "Alert acknowledged successfully"}


# ============= DASHBOARD ROUTES =============

@router.get("/dashboard/school-overview")
def get_school_overview(db: Session = Depends(get_db)):
    """Get school-wide overview statistics"""
    total_students = db.query(Student).count()

    # Get latest momentum scores
    recent_scores = db.query(MomentumScore).order_by(
        MomentumScore.calculated_at.desc()
    ).limit(1000).all()

    if recent_scores:
        avg_momentum = sum(s.momentum_score for s in recent_scores) / len(recent_scores)
        at_risk_count = sum(1 for s in recent_scores if s.momentum_score < 40)
    else:
        avg_momentum = 0
        at_risk_count = 0

    critical_alerts = db.query(SystemAlert).filter(
        SystemAlert.severity == 'critical',
        SystemAlert.resolved == False
    ).count()

    return {
        "total_students": total_students,
        "average_momentum": avg_momentum,
        "at_risk_students": at_risk_count,
        "critical_alerts": critical_alerts,
        "last_updated": datetime.now().isoformat()
    }


@router.get("/dashboard/student/{student_id}")
def get_student_dashboard(student_id: str, db: Session = Depends(get_db)):
    """Get comprehensive dashboard for a student"""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Latest momentum
    latest_momentum = db.query(MomentumScore).filter(
        MomentumScore.student_id == student_id
    ).order_by(MomentumScore.calculated_at.desc()).first()

    # Recent assessments
    recent_assessment = db.query(Assessment).filter(
        Assessment.student_id == student_id
    ).order_by(Assessment.assessment_date.desc()).first()

    # Active alerts
    active_alerts = db.query(SystemAlert).filter(
        SystemAlert.student_id == student_id,
        SystemAlert.resolved == False
    ).all()

    return {
        "student": {
            "student_id": student.student_id,
            "name": f"{student.first_name} {student.last_name}",
            "grade": student.grade,
            "school": student.school
        },
        "momentum": {
            "current_score": latest_momentum.momentum_score if latest_momentum else None,
            "uncertainty": latest_momentum.uncertainty if latest_momentum else None,
            "learning_velocity": latest_momentum.learning_velocity if latest_momentum else None,
            "last_calculated": latest_momentum.calculated_at.isoformat() if latest_momentum else None
        },
        "psychological_state": {
            "stress": recent_assessment.stress_level if recent_assessment else None,
            "motivation": recent_assessment.motivation if recent_assessment else None,
            "confidence": recent_assessment.confidence if recent_assessment else None
        } if recent_assessment else None,
        "active_alerts": len(active_alerts),
        "alert_severity": max([a.severity for a in active_alerts], default="none")
    }


# ============= HEALTH CHECK =============

@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Momentum AI API"
    }
