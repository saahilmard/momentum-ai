"""
Configuration settings for Momentum AI
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings"""

    # App
    APP_NAME: str = "Momentum AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/momentum_db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]

    # Redis (for caching)
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL: int = 3600  # 1 hour

    # Email (optional)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None

    # Forecasting settings
    DEFAULT_FORECAST_HORIZON: int = 30
    COLLAPSE_THRESHOLD: float = 20.0
    HIGH_RISK_THRESHOLD: float = 0.7
    MEDIUM_RISK_THRESHOLD: float = 0.5

    # ML Model settings
    RL_LEARNING_RATE: float = 0.1
    RL_DISCOUNT_FACTOR: float = 0.95
    RL_EXPLORATION_RATE: float = 0.2

    # PDE Model parameters
    PDE_ALPHA: float = 0.5  # Diffusion coefficient
    PDE_BETA: float = 0.3   # Psychological coupling
    PDE_GAMMA: float = 0.2  # Academic coupling

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
