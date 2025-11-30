"""
Tests for Academic Collapse Forecasting Engine
"""

import pytest
import numpy as np
from datetime import datetime

from app.core.forecasting_engine import (
    CatastropheTheoryAnalyzer,
    StochasticDynamicsModel,
    LyapunovStabilityAnalyzer,
    AcademicCollapseForecastingEngine
)


class TestCatastropheTheoryAnalyzer:
    """Test Catastrophe Theory implementation"""

    def test_potential_function(self):
        """Test cusp catastrophe potential function"""
        analyzer = CatastropheTheoryAnalyzer()

        # Test at origin
        V = analyzer.potential_function(0, 0, 0)
        assert V == 0.0

        # Test symmetry
        V1 = analyzer.potential_function(1, 2, 3)
        V2 = analyzer.potential_function(-1, 2, -3)
        assert V1 != V2  # Should be different due to cubic term

    def test_find_equilibria(self):
        """Test finding equilibrium points"""
        analyzer = CatastropheTheoryAnalyzer()

        # Simple case: should have one real root
        roots = analyzer.find_equilibria(a=0, b=0)
        assert len(roots) >= 1

    def test_bifurcation_detection(self):
        """Test bifurcation set detection"""
        analyzer = CatastropheTheoryAnalyzer()

        # On bifurcation set
        is_on = analyzer.is_on_bifurcation_set(a=0, b=0, threshold=1.0)
        assert isinstance(is_on, bool)

    def test_collapse_risk_analysis(self):
        """Test collapse risk calculation"""
        analyzer = CatastropheTheoryAnalyzer()

        result = analyzer.analyze_collapse_risk(
            momentum=50.0,
            stress=70.0,
            support=40.0
        )

        assert 'collapse_risk' in result
        assert 0 <= result['collapse_risk'] <= 1
        assert 'near_bifurcation' in result
        assert 'is_stable' in result


class TestStochasticDynamicsModel:
    """Test Stochastic Differential Equations model"""

    def test_drift_terms(self):
        """Test drift functions return valid values"""
        model = StochasticDynamicsModel()

        drift_M = model.drift_momentum(M=50, A=60, P=40, intervention=5)
        drift_A = model.drift_academic(M=50, A=60, P=40)
        drift_P = model.drift_psychological(M=50, A=60, P=40)

        assert isinstance(drift_M, float)
        assert isinstance(drift_A, float)
        assert isinstance(drift_P, float)

    def test_simulate_trajectory(self):
        """Test stochastic trajectory simulation"""
        model = StochasticDynamicsModel()

        intervention_schedule = np.zeros(30)

        result = model.simulate_trajectory(
            M0=50.0,
            A0=60.0,
            P0=40.0,
            intervention_schedule=intervention_schedule,
            n_days=30,
            n_simulations=10  # Small number for testing
        )

        assert 'momentum_mean' in result
        assert 'momentum_std' in result
        assert 'collapse_probability' in result
        assert len(result['momentum_mean']) <= 30


class TestLyapunovStabilityAnalyzer:
    """Test Lyapunov stability analysis"""

    def test_lyapunov_exponent(self):
        """Test Lyapunov exponent calculation"""
        analyzer = LyapunovStabilityAnalyzer()

        # Stable trajectory
        stable_trajectory = np.array([50.0] * 30)
        lyap_stable = analyzer.calculate_lyapunov_exponent(stable_trajectory)

        # Unstable trajectory
        unstable_trajectory = np.array([50 + i**2 for i in range(30)])
        lyap_unstable = analyzer.calculate_lyapunov_exponent(unstable_trajectory)

        assert isinstance(lyap_stable, float)
        assert isinstance(lyap_unstable, float)

    def test_assess_stability(self):
        """Test stability assessment"""
        analyzer = LyapunovStabilityAnalyzer()

        result = analyzer.assess_stability(
            current_momentum=70.0,
            academic_state=np.array([70.0, 65.0, 75.0, 80.0]),
            psychological_state=np.array([40.0, 50.0, 60.0, 55.0, 45.0])
        )

        assert 'stability' in result
        assert result['stability'] in ['stable', 'marginally_stable', 'unstable']
        assert 'stability_score' in result
        assert 0 <= result['stability_score'] <= 1


class TestAcademicCollapseForecastingEngine:
    """Test comprehensive forecasting engine"""

    def test_initialization(self):
        """Test forecasting engine initializes"""
        engine = AcademicCollapseForecastingEngine()

        assert engine.catastrophe_analyzer is not None
        assert engine.stochastic_model is not None
        assert engine.time_series_forecaster is not None
        assert engine.lyapunov_analyzer is not None

    def test_comprehensive_forecast(self):
        """Test comprehensive forecast generation"""
        engine = AcademicCollapseForecastingEngine()

        # Create sample history
        momentum_history = [60.0, 58.0, 56.0, 54.0, 52.0, 50.0]
        academic_history = [65.0, 63.0, 61.0, 59.0, 57.0, 55.0]
        psychological_history = [45.0, 47.0, 49.0, 51.0, 53.0, 55.0]

        forecast = engine.comprehensive_forecast(
            student_id="TEST001",
            momentum_history=momentum_history,
            academic_history=academic_history,
            psychological_history=psychological_history,
            current_support=60.0,
            forecast_days=30
        )

        # Check all required fields
        assert forecast.student_id == "TEST001"
        assert 0 <= forecast.collapse_probability <= 1
        assert forecast.collapse_risk_level in ['low', 'medium', 'high', 'critical']
        assert forecast.intervention_urgency >= 0
        assert len(forecast.primary_risk_factors) > 0
        assert len(forecast.momentum_forecast) == 30
        assert len(forecast.recommended_interventions) > 0

    def test_forecast_with_minimal_history(self):
        """Test forecast with minimal historical data"""
        engine = AcademicCollapseForecastingEngine()

        forecast = engine.comprehensive_forecast(
            student_id="TEST002",
            momentum_history=[50.0],
            academic_history=[55.0],
            psychological_history=[50.0],
            current_support=50.0,
            forecast_days=30
        )

        assert forecast.student_id == "TEST002"
        assert 0 <= forecast.collapse_probability <= 1


def test_forecast_consistency():
    """Test that forecast results are consistent"""
    engine = AcademicCollapseForecastingEngine()

    momentum_history = [70.0, 68.0, 66.0, 64.0, 62.0]
    academic_history = [75.0, 73.0, 71.0, 69.0, 67.0]
    psychological_history = [35.0, 37.0, 39.0, 41.0, 43.0]

    # Run forecast twice
    forecast1 = engine.comprehensive_forecast(
        "TEST003", momentum_history, academic_history,
        psychological_history, 70.0, 30
    )

    forecast2 = engine.comprehensive_forecast(
        "TEST003", momentum_history, academic_history,
        psychological_history, 70.0, 30
    )

    # Should produce similar (not identical due to randomness) results
    assert abs(forecast1.collapse_probability - forecast2.collapse_probability) < 0.3
    assert forecast1.collapse_risk_level == forecast2.collapse_risk_level or \
           abs(['low', 'medium', 'high', 'critical'].index(forecast1.collapse_risk_level) -
               ['low', 'medium', 'high', 'critical'].index(forecast2.collapse_risk_level)) <= 1


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
