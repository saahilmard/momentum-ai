import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, TrendingUp, Calendar, Clock, Mail, Phone,
  Award, Target, Brain, Heart, Book, Activity
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { getRiskLevel, getRiskLabel } from '../utils/riskCalculations'
import { formatDate } from '../utils/formatters'

interface StudentData {
  student_id: string
  name: string
  email: string
  grade: string
  current_momentum: number
  risk_level: string
  last_assessment: string
  assessments_count: number
  momentum_history: Array<{ date: string; score: number }>
  latest_survey: {
    stress_level: number
    motivation: number
    confidence: number
    resilience: number
    social_support: number
    sleep_quality: number
    academic_concern: number
    family_support: number
    extracurricular_engagement: number
    time_management: number
  }
}

const StudentProfile = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'interventions'>('overview')
  const [student, setStudent] = useState<StudentData | null>(null)

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setStudent({
        student_id: studentId || 'STU001',
        name: 'Emily Johnson',
        email: 'emily.johnson@school.edu',
        grade: '10th Grade',
        current_momentum: 68.5,
        risk_level: 'medium',
        last_assessment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        assessments_count: 12,
        momentum_history: Array.from({ length: 90 }, (_, i) => ({
          date: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toISOString(),
          score: 60 + Math.sin(i / 10) * 20 + Math.random() * 10,
        })),
        latest_survey: {
          stress_level: 7,
          motivation: 6,
          confidence: 5,
          resilience: 7,
          social_support: 8,
          sleep_quality: 4,
          academic_concern: 8,
          family_support: 7,
          extracurricular_engagement: 5,
          time_management: 4,
        },
      })
      setLoading(false)
    }, 1000)
  }, [studentId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (!student) return null

  // Prepare radar chart data
  const radarData = [
    { subject: 'Motivation', value: student.latest_survey.motivation * 10, fullMark: 100 },
    { subject: 'Confidence', value: student.latest_survey.confidence * 10, fullMark: 100 },
    { subject: 'Resilience', value: student.latest_survey.resilience * 10, fullMark: 100 },
    { subject: 'Social Support', value: student.latest_survey.social_support * 10, fullMark: 100 },
    { subject: 'Sleep', value: student.latest_survey.sleep_quality * 10, fullMark: 100 },
    { subject: 'Time Mgmt', value: student.latest_survey.time_management * 10, fullMark: 100 },
  ]

  // Prepare momentum history chart
  const momentumChartData = student.momentum_history.map((h) => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: h.score,
  }))

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'assessments', label: 'Assessments', icon: Calendar },
    { id: 'interventions', label: 'Interventions', icon: Target },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Student Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {student.name}
                </h1>
                <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>{student.grade}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>ID: {student.student_id}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Current Momentum Score
              </div>
              <div className="text-5xl font-bold gradient-text mb-2">
                {student.current_momentum.toFixed(1)}
              </div>
              <Badge variant={student.risk_level as any}>
                {getRiskLabel(student.risk_level)}
              </Badge>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <div className="flex items-center space-x-3">
            <Link to={`/assessment/${studentId}`}>
              <Button variant="primary">
                <Activity className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </Link>
            <Link to={`/forecast/${studentId}`}>
              <Button variant="secondary">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Forecast
              </Button>
            </Link>
            <Button variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Schedule Intervention
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b-2 border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Momentum History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                90-Day Momentum History
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={momentumChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={false}
                      name="Momentum Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Survey Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Wellness Profile
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#94a3b8" opacity={0.3} />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" />
                      <Radar
                        name="Current State"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>

            {/* Survey Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Latest Survey Results
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Stress Level', value: student.latest_survey.stress_level, icon: Brain, reverse: true },
                    { label: 'Motivation', value: student.latest_survey.motivation, icon: Target },
                    { label: 'Confidence', value: student.latest_survey.confidence, icon: Award },
                    { label: 'Sleep Quality', value: student.latest_survey.sleep_quality, icon: Heart },
                    { label: 'Academic Concern', value: student.latest_survey.academic_concern, icon: Book, reverse: true },
                    { label: 'Time Management', value: student.latest_survey.time_management, icon: Clock },
                  ].map((item, index) => {
                    const Icon = item.icon
                    const percentage = item.value * 10
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.value}/10
                          </span>
                        </div>
                        <ProgressBar value={percentage} showLabel={false} />
                      </div>
                    )
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      )}

      {/* Assessments Tab */}
      {activeTab === 'assessments' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Assessment History
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Total Assessments: {student.assessments_count}
            </p>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Assessment #{student.assessments_count - i + 1}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Score</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {(70 - i * 3 + Math.random() * 5).toFixed(1)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Interventions Tab */}
      {activeTab === 'interventions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Intervention History
            </h2>
            <div className="space-y-4">
              {[
                { type: 'Counseling Session', date: '2024-11-20', status: 'Completed', effectiveness: 85 },
                { type: 'Academic Tutoring', date: '2024-11-15', status: 'Completed', effectiveness: 72 },
                { type: 'Stress Management Workshop', date: '2024-12-01', status: 'Scheduled', effectiveness: null },
              ].map((intervention, index) => (
                <div
                  key={index}
                  className="p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {intervention.type}
                    </h3>
                    <Badge variant={intervention.status === 'Completed' ? 'success' : 'info'}>
                      {intervention.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Date: {formatDate(intervention.date)}
                  </div>
                  {intervention.effectiveness && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Effectiveness: {intervention.effectiveness}%
                      </div>
                      <ProgressBar value={intervention.effectiveness} showLabel={false} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

export default StudentProfile
