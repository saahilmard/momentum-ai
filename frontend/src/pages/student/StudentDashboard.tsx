import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  BookOpen,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Brain
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getRiskColor } from '../../utils/riskCalculations'

export const StudentDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const studentInfo = user?.studentInfo

  if (!studentInfo) return null

  const isSurveyDue = new Date(studentInfo.nextSurveyDue) <= new Date()
  const daysSinceLastSurvey = studentInfo.lastSurveyDate
    ? Math.floor((Date.now() - new Date(studentInfo.lastSurveyDate).getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Mock momentum history data
  const momentumHistory = [
    { week: 'Week 1', score: 58, date: '2024-01-08' },
    { week: 'Week 2', score: 62, date: '2024-01-15' },
    { week: 'Week 3', score: 65, date: '2024-01-22' },
    { week: 'Week 4', score: 62, date: '2024-01-29' }
  ]

  const strugglingCourses = studentInfo.currentCourses.filter(c => c.struggling)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.firstName}</span>!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's your academic momentum overview
        </p>
      </motion.div>

      {/* Survey Alert */}
      {isSurveyDue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="border-l-4 border-primary-500">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary-500/10">
                  <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Weekly Check-in Due!</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    It's time for your weekly momentum survey. Complete it now to receive personalized study materials.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button onClick={() => navigate('/student/survey')}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Take Survey Now
                    </Button>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Takes 2-3 minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${getRiskColor(studentInfo.riskLevel)}-500/10`}>
                <TrendingUp className={`w-6 h-6 text-${getRiskColor(studentInfo.riskLevel)}-600`} />
              </div>
              <Badge variant={studentInfo.riskLevel}>
                {studentInfo.riskLevel}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">{studentInfo.momentumScore}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Momentum Score</p>
            <ProgressBar value={studentInfo.momentumScore} className="mt-3" />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{studentInfo.gpa.toFixed(2)}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Current GPA</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              {studentInfo.currentCourses.length} Active Courses
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {momentumHistory.length}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Surveys Completed</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Last: {daysSinceLastSurvey} days ago
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1 capitalize">{studentInfo.learningStyle}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Learning Style</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Optimized resources
            </p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Momentum Trend */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Momentum Trend</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your progress over the last 4 weeks
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={momentumHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.1} />
              <XAxis dataKey="week" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Courses Needing Attention */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Courses Needing Attention</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Focus areas for improvement
              </p>
            </div>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {strugglingCourses.length > 0 ? (
              strugglingCourses.map(course => (
                <motion.div
                  key={course.id}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{course.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{course.code}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{course.currentGrade}%</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/student/resources', { state: { course: course.name } })}
                    className="w-full mt-2"
                  >
                    <Sparkles className="w-3 h-3 mr-2" />
                    Get Study Materials
                  </Button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>You're doing great in all courses!</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/student/resources')}
            className="justify-between"
          >
            <span className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Study Resources
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/student/history')}
            className="justify-between"
          >
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Survey History
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/student/profile')}
            className="justify-between"
          >
            <span className="flex items-center">
              <Target className="w-4 h-4 mr-2" />
              My Progress
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
