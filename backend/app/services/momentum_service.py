"""
Service layer for Momentum Score calculations and forecasting
"""

from sqlalchemy.orm import Session
from app.models.database import (
    Student, Assessment, MomentumScore, TeacherFeedback,
    AcademicMetric, SystemAlert, StudySession
)
from app.core.momentum_engine import (
    MomentumScoreCalculator, StudentState, DeepQLearningAgent
)
from app.core.forecasting_engine import AcademicCollapseForecastingEngine
from datetime import datetime, timedelta
import numpy as np
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class MomentumService:
    """Service for momentum score calculations"""

    def __init__(self, db: Session):
        self.db = db
        self.calculator = MomentumScoreCalculator()
        self.forecaster = AcademicCollapseForecastingEngine()

    def calculate_student_momentum(self, student_id: str,
                                   teacher_feedback: Optional[float] = None) -> Dict:
        """
        Calculate comprehensive momentum score for a student

        Args:
            student_id: Student identifier
            teacher_feedback: Optional teacher intervention level (0-10)

        Returns:
            Dictionary with momentum score and analysis
        """
        # Get student
        student = self.db.query(Student).filter(
            Student.student_id == student_id
        ).first()

        if not student:
            raise ValueError(f"Student {student_id} not found")

        # Get latest assessment
        latest_assessment = self.db.query(Assessment).filter(
            Assessment.student_id == student_id
        ).order_by(Assessment.assessment_date.desc()).first()

        if not latest_assessment:
            raise ValueError(f"No assessment found for student {student_id}")

        # Get latest academic metrics
        latest_metrics = self.db.query(AcademicMetric).filter(
            AcademicMetric.student_id == student_id
        ).order_by(AcademicMetric.recorded_at.desc()).first()

        # Get latest momentum score or use default
        previous_momentum = self.db.query(MomentumScore).filter(
            MomentumScore.student_id == student_id
        ).order_by(MomentumScore.calculated_at.desc()).first()

        current_momentum = previous_momentum.momentum_score if previous_momentum else 50.0

        # Build student state
        student_state = self._build_student_state(
            student, latest_assessment, latest_metrics, current_momentum
        )

        # Get teacher feedback
        if teacher_feedback is None:
            teacher_feedback = self._get_average_teacher_feedback(student_id)

        # Calculate comprehensive score
        result = self.calculator.calculate_comprehensive_score(
            student_state,
            teacher_feedback,
            time_horizon=1.0
        )

        # Save to database
        momentum_score_record = MomentumScore(
            student_id=student_id,
            momentum_score=result['momentum_score'],
            pde_prediction=result['pde_prediction'],
            bayesian_prediction=result['bayesian_prediction'],
            uncertainty=result['uncertainty'],
            confidence_lower=result['confidence_interval'][0],
            confidence_upper=result['confidence_interval'][1],
            academic_state=student_state.academic_state.tolist(),
            psychological_state=student_state.psychological_state.tolist(),
            academic_composite=np.mean(student_state.academic_state),
            psychological_composite=np.mean(student_state.psychological_state),
            learning_velocity=result['learning_velocity'],
            intervention_level=teacher_feedback
        )

        self.db.add(momentum_score_record)
        self.db.commit()

        # Generate alerts if needed
        self._generate_alerts(student_id, result['momentum_score'])

        return {
            'student_id': student_id,
            'momentum_score': result['momentum_score'],
            'pde_prediction': result['pde_prediction'],
            'bayesian_prediction': result['bayesian_prediction'],
            'uncertainty': result['uncertainty'],
            'confidence_interval': result['confidence_interval'],
            'learning_velocity': result['learning_velocity'],
            'calculated_at': datetime.now().isoformat()
        }

    def generate_forecast(self, student_id: str,
                         forecast_days: int = 30) -> Dict:
        """
        Generate academic collapse forecast

        Args:
            student_id: Student identifier
            forecast_days: Number of days to forecast

        Returns:
            Comprehensive forecast result
        """
        # Get historical data
        momentum_history = self._get_momentum_history(student_id)
        academic_history = self._get_academic_history(student_id)
        psychological_history = self._get_psychological_history(student_id)

        # Get current support level
        student = self.db.query(Student).filter(
            Student.student_id == student_id
        ).first()

        # Calculate support from teacher feedback
        support_level = self._calculate_support_level(student_id)

        # Generate forecast
        forecast = self.forecaster.comprehensive_forecast(
            student_id=student_id,
            momentum_history=momentum_history,
            academic_history=academic_history,
            psychological_history=psychological_history,
            current_support=support_level,
            forecast_days=forecast_days
        )

        # Generate critical alerts if needed
        if forecast.collapse_risk_level in ['high', 'critical']:
            self._create_critical_alert(student_id, forecast)

        return {
            'student_id': forecast.student_id,
            'forecast_date': forecast.forecast_date.isoformat(),
            'collapse_probability': forecast.collapse_probability,
            'collapse_risk_level': forecast.collapse_risk_level,
            'days_until_collapse': forecast.days_until_collapse,
            'collapse_confidence': forecast.collapse_confidence,
            'primary_risk_factors': forecast.primary_risk_factors,
            'intervention_urgency': forecast.intervention_urgency,
            'momentum_forecast': forecast.momentum_forecast.tolist(),
            'academic_forecast': forecast.academic_forecast.tolist(),
            'psychological_forecast': forecast.psychological_forecast.tolist(),
            'is_stable': forecast.is_stable,
            'lyapunov_exponent': forecast.lyapunov_exponent,
            'bifurcation_nearness': forecast.bifurcation_nearness,
            'recommended_interventions': forecast.recommended_interventions,
            'optimal_intervention_timing': forecast.optimal_intervention_timing
        }

    def _build_student_state(self, student: Student,
                            assessment: Assessment,
                            metrics: Optional[AcademicMetric],
                            current_momentum: float) -> StudentState:
        """Build StudentState from database models"""

        # Academic state [gpa, engagement, completion, attendance]
        if metrics:
            academic_state = np.array([
                metrics.gpa * 25 if metrics.gpa else 50,  # Scale to 0-100
                metrics.engagement_score if metrics.engagement_score else 50,
                metrics.assignment_completion_rate if metrics.assignment_completion_rate else 50,
                metrics.attendance_rate if metrics.attendance_rate else 50
            ])
        else:
            academic_state = np.array([50.0, 50.0, 50.0, 50.0])

        # Psychological state [stress, motivation, confidence, resilience, wellbeing]
        psychological_state = np.array([
            assessment.stress_level * 10 if assessment.stress_level else 50,
            assessment.motivation * 10 if assessment.motivation else 50,
            assessment.confidence * 10 if assessment.confidence else 50,
            assessment.resilience * 10 if assessment.resilience else 50,
            np.mean([
                assessment.sleep_quality or 5,
                assessment.social_support or 5,
                assessment.family_support or 5
            ]) * 10
        ])

        # Subject performance
        subject_performance = {}
        if metrics and metrics.subject_grades:
            subject_performance = metrics.subject_grades

        return StudentState(
            student_id=student.student_id,
            timestamp=datetime.now(),
            momentum_score=current_momentum,
            academic_state=academic_state,
            psychological_state=psychological_state,
            subject_performance=subject_performance,
            learning_velocity=0.0,
            intervention_level=0.0
        )

    def _get_average_teacher_feedback(self, student_id: str) -> float:
        """Get average teacher feedback for student"""
        feedbacks = self.db.query(TeacherFeedback).filter(
            TeacherFeedback.student_id == student_id
        ).order_by(TeacherFeedback.feedback_date.desc()).limit(5).all()

        if not feedbacks:
            return 5.0  # Default neutral

        scores = [
            np.mean([
                f.overall_performance or 5,
                f.engagement_level or 5,
                f.behavior or 5,
                f.participation or 5
            ]) for f in feedbacks
        ]

        return np.mean(scores)

    def _get_momentum_history(self, student_id: str, days: int = 60) -> List[float]:
        """Get historical momentum scores"""
        cutoff_date = datetime.now() - timedelta(days=days)

        scores = self.db.query(MomentumScore).filter(
            MomentumScore.student_id == student_id,
            MomentumScore.calculated_at >= cutoff_date
        ).order_by(MomentumScore.calculated_at.asc()).all()

        if not scores:
            return [50.0]  # Default

        return [s.momentum_score for s in scores]

    def _get_academic_history(self, student_id: str, days: int = 60) -> List[float]:
        """Get historical academic composite scores"""
        cutoff_date = datetime.now() - timedelta(days=days)

        metrics = self.db.query(AcademicMetric).filter(
            AcademicMetric.student_id == student_id,
            AcademicMetric.recorded_at >= cutoff_date
        ).order_by(AcademicMetric.recorded_at.asc()).all()

        if not metrics:
            return [50.0]

        return [m.engagement_score or 50.0 for m in metrics]

    def _get_psychological_history(self, student_id: str, days: int = 60) -> List[float]:
        """Get historical psychological state"""
        cutoff_date = datetime.now() - timedelta(days=days)

        assessments = self.db.query(Assessment).filter(
            Assessment.student_id == student_id,
            Assessment.assessment_date >= cutoff_date
        ).order_by(Assessment.assessment_date.asc()).all()

        if not assessments:
            return [50.0]

        return [
            np.mean([
                a.stress_level or 5,
                a.motivation or 5,
                a.confidence or 5
            ]) * 10 for a in assessments
        ]

    def _calculate_support_level(self, student_id: str) -> float:
        """Calculate overall support level for student"""
        # Get recent teacher feedback
        avg_teacher = self._get_average_teacher_feedback(student_id)

        # Get latest assessment social support
        latest_assessment = self.db.query(Assessment).filter(
            Assessment.student_id == student_id
        ).order_by(Assessment.assessment_date.desc()).first()

        social_support = (latest_assessment.social_support or 5) * 10 if latest_assessment else 50

        # Combine
        support = (avg_teacher * 10 * 0.6 + social_support * 0.4)

        return support

    def _generate_alerts(self, student_id: str, momentum_score: float):
        """Generate system alerts based on momentum score"""
        if momentum_score < 30:
            alert = SystemAlert(
                student_id=student_id,
                alert_type='low_momentum',
                severity='critical',
                title='Critical: Very Low Momentum Score',
                message=f'Student {student_id} has a very low momentum score of {momentum_score:.1f}',
                recommended_intervention='Immediate counseling and academic support required'
            )
            self.db.add(alert)
            self.db.commit()

        elif momentum_score < 50:
            alert = SystemAlert(
                student_id=student_id,
                alert_type='low_momentum',
                severity='medium',
                title='Warning: Low Momentum Score',
                message=f'Student {student_id} has a low momentum score of {momentum_score:.1f}',
                recommended_intervention='Check-in and provide additional support'
            )
            self.db.add(alert)
            self.db.commit()

    def _create_critical_alert(self, student_id: str, forecast):
        """Create critical alert for high collapse risk"""
        alert = SystemAlert(
            student_id=student_id,
            alert_type='collapse_risk',
            severity=forecast.collapse_risk_level,
            title=f'Academic Collapse Risk: {forecast.collapse_risk_level.upper()}',
            message=f'Collapse probability: {forecast.collapse_probability:.1%}. ' +
                   f'Primary factors: {", ".join(forecast.primary_risk_factors[:3])}',
            recommended_intervention=forecast.recommended_interventions[0]['description']
            if forecast.recommended_interventions else 'Immediate intervention required'
        )
        self.db.add(alert)
        self.db.commit()
