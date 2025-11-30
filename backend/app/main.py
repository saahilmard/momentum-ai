"""
Momentum AI - Main FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.core.database import init_db
from app.api.routes import router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    # Momentum AI - Academic Recovery Platform

    A sophisticated educational platform that uses advanced mathematics and AI to:
    - Assess student psychological and academic state
    - Calculate dynamic "Momentum Score" using PDEs and numerical analysis
    - **Forecast academic collapse** using catastrophe theory and stochastic models
    - Provide personalized study recommendations using reinforcement learning

    ## Mathematical Foundations

    ### 1. Heat Equation PDE
    Models momentum diffusion over time:
    ```
    ∂M/∂t = α∇²M + β·P(x,t) + γ·A(x,t)
    ```

    ### 2. Catastrophe Theory
    Identifies critical tipping points using cusp catastrophe model:
    ```
    V(x,a,b) = ¼x⁴ + ½ax² + bx
    ```

    ### 3. Stochastic Differential Equations
    Models uncertainty in student trajectories:
    ```
    dM_t = μ(M_t,A_t,P_t)dt + σdW_t
    ```

    ### 4. Reinforcement Learning
    Optimizes study strategies using Q-learning and policy gradients

    ### 5. Bayesian Inference
    Provides uncertainty quantification using Gaussian processes

    ## Key Features

    - **Real-time Momentum Scoring**: Advanced PDE-based calculations
    - **Academic Collapse Forecasting**: Predict student difficulties 30+ days in advance
    - **Intervention Recommendations**: AI-driven support strategies
    - **Risk Assessment**: Multi-model ensemble for accurate predictions
    - **Stability Analysis**: Lyapunov exponents and bifurcation detection
    """,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    logger.info("Starting Momentum AI API...")
    logger.info("Initializing database...")
    try:
        init_db()
        logger.info("Database initialized successfully!")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Momentum AI API...")


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Momentum AI",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "api": settings.API_V1_STR,
        "description": "Advanced academic recovery platform using PDEs, RL, and forecasting"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
