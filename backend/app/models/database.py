"""
Database Models for Momentum AI Platform
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Boolean, Text, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Dict, List, Optional
import json

Base = declarative_base()


# Association table for many-to-many relationship between students and classes
student_classes = Table(
    'student_classes',
    Base.metadata,
    Column('student_id', String, ForeignKey('students.student_id'), primary_key=True),
    Column('class_id', Integer, ForeignKey('classes.id'), primary_key=True)
)


class Student(Base):
    """Student model"""
    __tablename__ = 'students'

    student_id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    grade = Column(Integer, nullable=False)
    school = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    classes = relationship("Class", secondary=student_classes, back_populates="students")
    assessments = relationship("Assessment", back_populates="student", cascade="all, delete-orphan")
    momentum_scores = relationship("MomentumScore", back_populates="student", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="student", cascade="all, delete-orphan")


class Teacher(Base):
    """Teacher model"""
    __tablename__ = 'teachers'

    teacher_id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    school = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    classes = relationship("Class", back_populates="teacher")
    feedbacks = relationship("TeacherFeedback", back_populates="teacher")


class Class(Base):
    """Class/Course model"""
    __tablename__ = 'classes'

    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    grade_level = Column(Integer)
    teacher_id = Column(String, ForeignKey('teachers.teacher_id'))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    teacher = relationship("Teacher", back_populates="classes")
    students = relationship("Student", secondary=student_classes, back_populates="classes")
    study_materials = relationship("StudyMaterial", back_populates="class_obj")


class Assessment(Base):
    """Student assessment (survey) model"""
    __tablename__ = 'assessments'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey('students.student_id'), nullable=False)
    assessment_date = Column(DateTime(timezone=True), server_default=func.now())

    # Survey responses (1-10 scale)
    stress_level = Column(Integer)
    motivation = Column(Integer)
    confidence = Column(Integer)
    resilience = Column(Integer)
    social_support = Column(Integer)
    sleep_quality = Column(Integer)
    academic_concern = Column(Integer)
    family_support = Column(Integer)
    extracurricular_engagement = Column(Integer)
    time_management = Column(Integer)

    # Additional JSON data for flexible survey questions
    additional_responses = Column(JSON)

    # Relationships
    student = relationship("Student", back_populates="assessments")


class MomentumScore(Base):
    """Calculated momentum scores over time"""
    __tablename__ = 'momentum_scores'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey('students.student_id'), nullable=False)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Core scores
    momentum_score = Column(Float, nullable=False)
    pde_prediction = Column(Float)
    bayesian_prediction = Column(Float)
    uncertainty = Column(Float)

    # Component scores
    academic_composite = Column(Float)
    psychological_composite = Column(Float)
    learning_velocity = Column(Float)

    # Confidence interval
    confidence_lower = Column(Float)
    confidence_upper = Column(Float)

    # Academic state (stored as JSON array)
    academic_state = Column(JSON)
    psychological_state = Column(JSON)

    # Teacher intervention level at time of calculation
    intervention_level = Column(Float)

    # Relationships
    student = relationship("Student", back_populates="momentum_scores")


class TeacherFeedback(Base):
    """Teacher feedback on student progress"""
    __tablename__ = 'teacher_feedback'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey('students.student_id'), nullable=False)
    teacher_id = Column(String, ForeignKey('teachers.teacher_id'), nullable=False)
    feedback_date = Column(DateTime(timezone=True), server_default=func.now())

    # Feedback scores
    overall_performance = Column(Float)  # 0-10
    engagement_level = Column(Float)     # 0-10
    behavior = Column(Float)              # 0-10
    participation = Column(Float)         # 0-10

    # Text feedback
    comments = Column(Text)
    concerns = Column(Text)
    strengths = Column(Text)

    # Intervention recommended
    intervention_recommended = Column(Boolean, default=False)
    intervention_type = Column(String)

    # Relationships
    teacher = relationship("Teacher", back_populates="feedbacks")


class StudyMaterial(Base):
    """Study materials and resources"""
    __tablename__ = 'study_materials'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    subject = Column(String, nullable=False)
    topic = Column(String)
    difficulty_level = Column(Integer)  # 1-12 (grade level)
    material_type = Column(String)  # video, pdf, interactive, practice_test, etc.

    # URL or file path
    url = Column(String)
    file_path = Column(String)

    # Metadata for personalization
    engagement_score = Column(Float, default=50.0)  # How engaging (0-100)
    completion_time_minutes = Column(Integer)
    prerequisites = Column(JSON)  # List of prerequisite topics
    learning_outcomes = Column(JSON)  # List of learning outcomes

    # Relationships
    class_id = Column(Integer, ForeignKey('classes.id'))
    class_obj = relationship("Class", back_populates="study_materials")

    # Analytics
    view_count = Column(Integer, default=0)
    average_rating = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StudySession(Base):
    """Track student study sessions"""
    __tablename__ = 'study_sessions'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey('students.student_id'), nullable=False)
    material_id = Column(Integer, ForeignKey('study_materials.id'))
    subject = Column(String, nullable=False)

    # Session details
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True))
    duration_minutes = Column(Integer)

    # Study strategy used
    study_method = Column(String)  # active_recall, spaced_repetition, etc.
    intensity = Column(String)      # low, medium, high
    breaks_taken = Column(Integer)

    # Outcomes
    completed = Column(Boolean, default=False)
    self_rating = Column(Integer)  # 1-10 how well they understood
    notes = Column(Text)

    # RL feedback
    momentum_before = Column(Float)
    momentum_after = Column(Float)
    reward_signal = Column(Float)  # For RL training

    # Relationships
    student = relationship("Student", back_populates="study_sessions")


class RecommendedStrategy(Base):
    """AI-recommended study strategies"""
    __tablename__ = 'recommended_strategies'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey('students.student_id'), nullable=False)
    subject = Column(String, nullable=False)
    recommended_at = Column(DateTime(timezone=True), server_default=func.now())

    # Strategy details
    study_method = Column(String, nullable=False)
    duration_minutes = Column(Integer)
    intensity = Column(String)
    break_frequency_minutes = Column(Integer)

    # AI confidence
    confidence_score = Column(Float)
    action_id = Column(Integer)  # RL action ID

    # State at recommendation time
    momentum_score = Column(Float)
    academic_state = Column(JSON)
    psychological_state = Column(JSON)

    # Outcome tracking
    was_followed = Column(Boolean)
    effectiveness_rating = Column(Float)


class AcademicMetric(Base):
    """Track academic performance metrics"""
    __tablename__ = 'academic_metrics'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey('students.student_id'), nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Metrics
    gpa = Column(Float)
    attendance_rate = Column(Float)  # Percentage
    assignment_completion_rate = Column(Float)  # Percentage
    test_average = Column(Float)

    # Subject-specific performance (JSON)
    subject_grades = Column(JSON)

    # Trends
    gpa_trend = Column(Float)  # Derivative
    engagement_score = Column(Float)


class SystemAlert(Base):
    """System-generated alerts for intervention"""
    __tablename__ = 'system_alerts'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey('students.student_id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Alert details
    alert_type = Column(String)  # low_momentum, high_stress, declining_performance
    severity = Column(String)     # low, medium, high, critical
    title = Column(String)
    message = Column(Text)

    # Recommended actions
    recommended_intervention = Column(Text)

    # Status
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String)
    acknowledged_at = Column(DateTime(timezone=True))
    resolved = Column(Boolean, default=False)
    resolution_notes = Column(Text)
