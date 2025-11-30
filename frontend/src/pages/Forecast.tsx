import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from 'recharts'
import {
  AlertTriangle, TrendingDown, Clock, Target,
  Brain, Activity, Shield, Zap
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { getRiskLabel } from '../utils/riskCalculations'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface ForecastData {
  student_id: string
  collapse_probability: number
  collapse_risk_level: string
  days_until_collapse: number | null
  intervention_urgency: number
  primary_risk_factors: string[]
  momentum_forecast: number[]
  academic_forecast: number[]
  psychological_forecast: number[]
  is_stable: boolean
  lyapunov_exponent: number
  bifurcation_nearness: number
  recommended_interventions: Array<{
    type: string
    priority: string
    description: string
  }>
  optimal_intervention_timing: number
}

const Forecast = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true)
        const response = await axios.post(`${API_URL}/forecast/collapse`, {
          student_id: studentId,
          forecast_days: 30
        })
        setForecast(response.data)
      } catch (err: any) {
        // Use mock data for demo
        setTimeout(() => {
          setForecast({
            student_id: studentId || 'STU001',
            collapse_probability: 0.42,
            collapse_risk_level: 'medium',
            days_until_collapse: 18,
            intervention_urgency: 65,
            primary_risk_factors: ['High stress', 'Low motivation', 'Poor sleep'],
            momentum_forecast: Array.from({ length: 30 }, (_, i) => 55 - i * 0.8 + Math.random() * 5),
            academic_forecast: Array.from({ length: 30 }, (_, i) => 60 - i * 0.5 + Math.random() * 4),
            psychological_forecast: Array.from({ length: 30 }, (_, i) => 50 - i * 1.0 + Math.random() * 6),
            is_stable: false,
            lyapunov_exponent: 0.15,
            bifurcation_nearness: 0.08,
            recommended_interventions: [
              { type: 'Counseling', priority: 'HIGH', description: 'Weekly counseling sessions to address stress and motivation' },
              { type: 'Academic Support', priority: 'MEDIUM', description: 'Tutoring in challenging subjects' },
              { type: 'Wellness Program', priority: 'HIGH', description: 'Sleep hygiene and stress management workshop' },
            ],
            optimal_intervention_timing: 5,
          })
          setLoading(false)
        }, 1000)
      }
    }

    if (studentId) {
      fetchForecast()
    }
  }, [studentId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <GlassCard className="bg-red-500/10">
        <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-6 h-6" />
          <p className="font-medium">{error}</p>
        </div>
      </GlassCard>
    )
  }

  if (!forecast) return null

  // Prepare chart data
  const chartData = forecast.momentum_forecast.map((momentum, index) => ({
    day: index + 1,
    momentum: parseFloat(momentum.toFixed(2)),
    academic: parseFloat(forecast.academic_forecast[index].toFixed(2)),
    psychological: parseFloat(forecast.psychological_forecast[index].toFixed(2))
  }))

  const metrics = [
    {
      title: 'Collapse Probability',
      value: `${(forecast.collapse_probability * 100).toFixed(1)}%`,
      icon: TrendingDown,
      color: 'from-red-500 to-orange-500',
      badge: forecast.collapse_risk_level,
    },
    {
      title: 'Days Until Collapse',
      value: forecast.days_until_collapse !== null ? `${forecast.days_until_collapse}` : 'Stable',
      subtitle: forecast.days_until_collapse !== null ? 'days' : 'No collapse predicted',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Intervention Urgency',
      value: forecast.intervention_urgency.toFixed(0),
      subtitle: '/100',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      showProgress: true,
    },
    {
      title: 'Lyapunov Exponent',
      value: forecast.lyapunov_exponent.toFixed(3),
      subtitle: forecast.is_stable ? 'Stable' : 'Unstable',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Academic Collapse Forecast
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          30-day predictive analysis for Student {forecast.student_id}
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {metric.badge && (
                    <Badge variant={metric.badge as any}>
                      {getRiskLabel(metric.badge)}
                    </Badge>
                  )}
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {metric.value}
                  {metric.subtitle && (
                    <span className="text-lg text-slate-500 dark:text-slate-400 ml-1">
                      {metric.subtitle}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  {metric.title}
                </div>
                {metric.showProgress && (
                  <ProgressBar value={forecast.intervention_urgency} showLabel={false} />
                )}
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Forecast Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GlassCard>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            30-Day Trajectory Forecast
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="academicGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="psychologicalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="day"
                  label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                  }}
                />
                <Legend />
                <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label="Critical Threshold" />
                <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="3 3" label="Warning Threshold" />
                <Area
                  type="monotone"
                  dataKey="momentum"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#momentumGradient)"
                  name="Momentum"
                />
                <Area
                  type="monotone"
                  dataKey="academic"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#academicGradient)"
                  name="Academic"
                />
                <Area
                  type="monotone"
                  dataKey="psychological"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#psychologicalGradient)"
                  name="Psychological"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Primary Risk Factors
              </h2>
            </div>
            <ul className="space-y-3">
              {forecast.primary_risk_factors.map((factor, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-slate-700 dark:text-slate-300">{factor}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>

        {/* Mathematical Indicators */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Mathematical Indicators
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Bifurcation Nearness
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {forecast.bifurcation_nearness.toFixed(3)}
                  </span>
                  <Badge variant={forecast.bifurcation_nearness < 0.1 ? 'critical' : 'medium'}>
                    {forecast.bifurcation_nearness < 0.1 ? 'Near Tipping Point' : 'Safe Distance'}
                  </Badge>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Stability Status
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {forecast.is_stable ? 'Stable' : 'Unstable'}
                  </span>
                  <Badge variant={forecast.is_stable ? 'success' : 'critical'}>
                    λ = {forecast.lyapunov_exponent.toFixed(3)}
                  </Badge>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Optimal Intervention Window
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  Day {forecast.optimal_intervention_timing}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recommended Interventions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Recommended Interventions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecast.recommended_interventions.map((intervention, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:border-primary-500 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={
                    intervention.priority === 'HIGH' ? 'critical' :
                    intervention.priority === 'MEDIUM' ? 'medium' : 'low'
                  }>
                    {intervention.priority} PRIORITY
                  </Badge>
                  <Zap className={`w-5 h-5 ${
                    intervention.priority === 'HIGH' ? 'text-red-500' :
                    intervention.priority === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {intervention.type}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {intervention.description}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default Forecast
