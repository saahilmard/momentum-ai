import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Target,
  ArrowRight,
  Clock,
  Activity
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { CardSkeleton } from '../components/ui/Skeleton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { getRiskLevel, getRiskLabel } from '../utils/riskCalculations'
import { formatDate, formatRelativeTime } from '../utils/formatters'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface StudentData {
  student_id: string
  name: string
  momentum_score: number
  risk_level: string
  last_assessment: string
  trend: 'up' | 'down' | 'stable'
}

interface DashboardStats {
  total_students: number
  at_risk_students: number
  average_momentum: number
  active_interventions: number
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    total_students: 0,
    at_risk_students: 0,
    average_momentum: 0,
    active_interventions: 0,
  })
  const [students, setStudents] = useState<StudentData[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Simulated data - replace with actual API call
        // const response = await axios.get(`${API_URL}/dashboard`)

        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            total_students: 127,
            at_risk_students: 18,
            average_momentum: 67.5,
            active_interventions: 12,
          })

          setStudents([
            {
              student_id: 'STU001',
              name: 'Emily Johnson',
              momentum_score: 45,
              risk_level: 'high',
              last_assessment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              trend: 'down',
            },
            {
              student_id: 'STU002',
              name: 'Michael Chen',
              momentum_score: 82,
              risk_level: 'low',
              last_assessment: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              trend: 'up',
            },
            {
              student_id: 'STU003',
              name: 'Sarah Williams',
              momentum_score: 28,
              risk_level: 'critical',
              last_assessment: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              trend: 'down',
            },
            {
              student_id: 'STU004',
              name: 'David Martinez',
              momentum_score: 55,
              risk_level: 'medium',
              last_assessment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              trend: 'stable',
            },
            {
              student_id: 'STU005',
              name: 'Jessica Lee',
              momentum_score: 73,
              risk_level: 'low',
              last_assessment: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              trend: 'up',
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Total Students',
      value: stats.total_students,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12 this month',
    },
    {
      title: 'At-Risk Students',
      value: stats.at_risk_students,
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      change: `${((stats.at_risk_students / stats.total_students) * 100).toFixed(1)}% of total`,
    },
    {
      title: 'Avg Momentum',
      value: stats.average_momentum.toFixed(1),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: '+2.3 from last week',
    },
    {
      title: 'Active Interventions',
      value: stats.active_interventions,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      change: '8 pending review',
    },
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗'
    if (trend === 'down') return '↘'
    return '→'
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400'
    if (trend === 'down') return 'text-red-600 dark:text-red-400'
    return 'text-slate-600 dark:text-slate-400'
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
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
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {stat.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {stat.change}
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GlassCard>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/assessment/STU001">
              <Button variant="primary">
                <Activity className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </Link>
            <Link to="/forecast/STU001">
              <Button variant="secondary">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Forecasts
              </Button>
            </Link>
            <Link to="/school-overview">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                School Overview
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>

      {/* Recent Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Assessments
            </h2>
            <Link to="/school-overview">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {students.map((student, index) => (
              <motion.div
                key={student.student_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={`/student/${student.student_id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(student.last_assessment)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Momentum Score
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-2xl font-bold ${getTrendColor(student.trend)}`}>
                            {student.momentum_score}
                          </span>
                          <span className={`text-lg ${getTrendColor(student.trend)}`}>
                            {getTrendIcon(student.trend)}
                          </span>
                        </div>
                      </div>

                      <div className="w-32">
                        <ProgressBar value={student.momentum_score} showLabel={false} />
                      </div>

                      <Badge variant={student.risk_level as any}>
                        {getRiskLabel(student.risk_level)}
                      </Badge>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default Dashboard
