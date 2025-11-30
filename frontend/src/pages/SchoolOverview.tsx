import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, AlertTriangle, TrendingUp, Target, ArrowRight,
  School, Award, Clock, Brain
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { getRiskLabel } from '../utils/riskCalculations'

interface SchoolStats {
  total_students: number
  critical_risk_count: number
  high_risk_count: number
  medium_risk_count: number
  low_risk_count: number
  average_momentum: number
  intervention_success_rate: number
}

const SchoolOverview = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<SchoolStats | null>(null)
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly')

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setStats({
        total_students: 127,
        critical_risk_count: 8,
        high_risk_count: 15,
        medium_risk_count: 34,
        low_risk_count: 70,
        average_momentum: 67.5,
        intervention_success_rate: 82,
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (!stats) return null

  // Risk distribution pie chart data
  const riskDistributionData = [
    { name: 'Low Risk', value: stats.low_risk_count, color: '#10b981' },
    { name: 'Medium Risk', value: stats.medium_risk_count, color: '#f59e0b' },
    { name: 'High Risk', value: stats.high_risk_count, color: '#f97316' },
    { name: 'Critical Risk', value: stats.critical_risk_count, color: '#ef4444' },
  ]

  // Momentum distribution histogram
  const momentumDistribution = [
    { range: '0-20', count: 5 },
    { range: '21-40', count: 12 },
    { range: '41-60', count: 35 },
    { range: '61-80', count: 52 },
    { range: '81-100', count: 23 },
  ]

  // Trend over time data
  const trendData = Array.from({ length: timeframe === 'daily' ? 7 : timeframe === 'weekly' ? 12 : 6 }, (_, i) => ({
    period: timeframe === 'daily' ? `Day ${i + 1}` :
            timeframe === 'weekly' ? `Week ${i + 1}` :
            `Month ${i + 1}`,
    avgMomentum: 60 + Math.random() * 20,
    atRisk: 15 + Math.floor(Math.random() * 10),
  }))

  // High priority students
  const highPriorityStudents = [
    { id: 'STU003', name: 'Sarah Williams', momentum: 28, risk: 'critical', days_until: 8 },
    { id: 'STU007', name: 'James Martinez', momentum: 31, risk: 'critical', days_until: 12 },
    { id: 'STU012', name: 'Ashley Chen', momentum: 35, risk: 'critical', days_until: 15 },
    { id: 'STU001', name: 'Emily Johnson', momentum: 45, risk: 'high', days_until: 18 },
    { id: 'STU019', name: 'Michael Brown', momentum: 42, risk: 'high', days_until: 21 },
  ]

  const statCards = [
    {
      title: 'Total Students Monitored',
      value: stats.total_students,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Critical Risk Students',
      value: stats.critical_risk_count,
      subtitle: `${((stats.critical_risk_count / stats.total_students) * 100).toFixed(1)}% of total`,
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
    },
    {
      title: 'Average Momentum',
      value: stats.average_momentum.toFixed(1),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Intervention Success Rate',
      value: `${stats.intervention_success_rate}%`,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              School Overview
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Real-time analytics across all students
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <School className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {stat.title}
                </div>
                {stat.subtitle && (
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {stat.subtitle}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Risk Level Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {riskDistributionData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Momentum Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Momentum Score Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={momentumDistribution}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="range" />
                  <YAxis label={{ value: 'Students', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Trends Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Trends Over Time
            </h2>
            <div className="flex space-x-2">
              {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeframe === tf
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" label={{ value: 'Avg Momentum', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'At Risk', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgMomentum"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Average Momentum"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="atRisk"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="At-Risk Students"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* High Priority Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              High-Priority Students
            </h2>
            <Badge variant="critical">
              {stats.critical_risk_count + stats.high_risk_count} Students Need Attention
            </Badge>
          </div>

          <div className="space-y-3">
            {highPriorityStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Link to={`/student/${student.id}`}>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            ID: {student.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Momentum
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {student.momentum}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Days Until Collapse
                          </div>
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {student.days_until}
                          </div>
                        </div>

                        <Badge variant={student.risk as any}>
                          {getRiskLabel(student.risk)}
                        </Badge>

                        <div className="flex space-x-2">
                          <Link to={`/forecast/${student.id}`}>
                            <Button variant="outline" size="sm">
                              <Brain className="w-4 h-4 mr-1" />
                              Forecast
                            </Button>
                          </Link>
                          <Button variant="primary" size="sm">
                            <Target className="w-4 h-4 mr-1" />
                            Intervene
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link to="/dashboard">
              <Button variant="ghost">
                View All Students
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default SchoolOverview
