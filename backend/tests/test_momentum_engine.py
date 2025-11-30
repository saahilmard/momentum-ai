"""
Tests for Momentum Engine
"""

import pytest
import numpy as np
from datetime import datetime

from app.core.momentum_engine import (
    HeatEquationMomentumModel,
    StudentState,
    MomentumScoreCalculator,
    BayesianMomentumEstimator
)


class TestHeatEquationModel:
    """Test Heat Equation PDE Model"""

    def test_initialization(self):
        """Test model initializes correctly"""
        model = HeatEquationMomentumModel(alpha=0.5, beta=0.3, gamma=0.2)

        assert model.alpha == 0.5
        assert model.beta == 0.3
        assert model.gamma == 0.2

    def test_pde_output_shape(self):
        """Test PDE returns correct shape"""
        model = HeatEquationMomentumModel()

        state = np.array([50.0, 60.0, 55.0, 70.0, 65.0, 40.0, 50.0, 60.0, 55.0, 45.0])
        params = {'teacher_intervention': 5.0, 'external_stress': 6.0}

        result = model.momentum_pde(0, state, params)

        assert result.shape == state.shape
        assert len(result) == 10

    def test_solve_produces_valid_state(self):
        """Test solve produces valid student state"""
        model = HeatEquationMomentumModel()

        initial_state = StudentState(
            student_id="TEST001",
            timestamp=datetime.now(),
            momentum_score=50.0,
            academic_state=np.array([60.0, 55.0, 70.0, 65.0]),
            psychological_state=np.array([40.0, 50.0, 60.0, 55.0, 45.0]),
            subject_performance={},
            learning_velocity=0.0,
            intervention_level=0.0
        )

        params = {'teacher_intervention': 5.0, 'external_stress': 5.0}

        result_state = model.solve(initial_state, time_horizon=1.0, params=params)

        assert isinstance(result_state, StudentState)
        assert 0 <= result_state.momentum_score <= 100
        assert result_state.student_id == "TEST001"


class TestBayesianEstimator:
    """Test Bayesian Momentum Estimator"""

    def test_initialization(self):
        """Test Bayesian estimator initializes"""
        estimator = BayesianMomentumEstimator()

        assert estimator.gp is not None
        assert len(estimator.training_data) == 0

    def test_prediction_with_insufficient_data(self):
        """Test prediction returns default with insufficient data"""
        estimator = BayesianMomentumEstimator()

        features = np.array([50.0, 60.0, 55.0, 70.0, 65.0, 40.0, 50.0, 60.0, 55.0, 45.0])
        mean, std = estimator.predict(features)

        assert mean == 50.0
        assert std == 20.0

    def test_update_adds_data(self):
        """Test update adds training data"""
        estimator = BayesianMomentumEstimator()

        features = np.array([50.0, 60.0, 55.0, 70.0, 65.0, 40.0, 50.0, 60.0, 55.0, 45.0])
        estimator.update(features, 67.5)

        assert len(estimator.training_data) == 1
        assert estimator.training_data[0][1] == 67.5


class TestMomentumScoreCalculator:
    """Test comprehensive momentum score calculator"""

    def test_initialization(self):
        """Test calculator initializes all components"""
        calculator = MomentumScoreCalculator()

        assert calculator.heat_model is not None
        assert calculator.bayesian_estimator is not None
        assert calculator.rl_agent is not None

    def test_comprehensive_score_calculation(self):
        """Test comprehensive score returns valid result"""
        calculator = MomentumScoreCalculator()

        student_state = StudentState(
            student_id="TEST001",
            timestamp=datetime.now(),
            momentum_score=50.0,
            academic_state=np.array([60.0, 55.0, 70.0, 65.0]),
            psychological_state=np.array([40.0, 50.0, 60.0, 55.0, 45.0]),
            subject_performance={},
            learning_velocity=0.0,
            intervention_level=0.0
        )

        result = calculator.calculate_comprehensive_score(
            student_state,
            teacher_feedback=6.5,
            time_horizon=1.0
        )

        assert 'momentum_score' in result
        assert 'pde_prediction' in result
        assert 'bayesian_prediction' in result
        assert 'uncertainty' in result
        assert 0 <= result['momentum_score'] <= 100


def test_momentum_score_bounds():
    """Test that momentum scores stay within bounds"""
    calculator = MomentumScoreCalculator()

    # Test extreme values
    for momentum in [0, 25, 50, 75, 100]:
        student_state = StudentState(
            student_id="TEST001",
            timestamp=datetime.now(),
            momentum_score=float(momentum),
            academic_state=np.array([60.0, 55.0, 70.0, 65.0]),
            psychological_state=np.array([40.0, 50.0, 60.0, 55.0, 45.0]),
            subject_performance={},
            learning_velocity=0.0,
            intervention_level=0.0
        )

        result = calculator.calculate_comprehensive_score(
            student_state,
            teacher_feedback=5.0
        )

        assert 0 <= result['momentum_score'] <= 100, \
            f"Score {result['momentum_score']} out of bounds for input {momentum}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
