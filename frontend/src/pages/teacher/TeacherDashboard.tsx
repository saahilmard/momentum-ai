import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Bell,
  Target,
  BookOpen,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { getRiskColor, getRiskLevel } from '../../utils/riskCalculations'

interface Student {
  id: string
  name: string
  email: string
  momentumScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lastSurvey: string
  trend: 'up' | 'down' | 'stable'
  courses: string[]
  needsAttention: boolean
}

export const TeacherDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState<string>('all')

  // Mock student data
  const students: Student[] = [
    {
      id: 'stu-001',
      name: 'Alex Johnson',
      email: 'alex.j@school.edu',
      momentumScore: 45,
      riskLevel: 'high',
      lastSurvey: '2024-01-28',
      trend: 'down',
      courses: ['MATH-101', 'MATH-102'],
      needsAttention: true
    },
    {
      id: 'stu-002',
      name: 'Emma Davis',
      email: 'emma.d@school.edu',
      momentumScore: 78,
      riskLevel: 'low',
      lastSurvey: '2024-01-29',
      trend: 'up',
      courses: ['MATH-101'],
      needsAttention: false
    },
    {
      id: 'stu-003',
      name: 'Michael Chen',
      email: 'michael.c@school.edu',
      momentumScore: 62,
      riskLevel: 'medium',
      lastSurvey: '2024-01-27',
      trend: 'stable',
      courses: ['MATH-101', 'MATH-102'],
      needsAttention: false
    },
    {
      id: 'stu-004',
      name: 'Sarah Williams',
      email: 'sarah.w@school.edu',
      momentumScore: 28,
      riskLevel: 'critical',
      lastSurvey: '2024-01-26',
      trend: 'down',
      courses: ['MATH-102'],
      needsAttention: true
    },
    {
      id: 'stu-005',
      name: 'James Brown',
      email: 'james.b@school.edu',
      momentumScore: 85,
      riskLevel: 'low',
      lastSurvey: '2024-01-29',
      trend: 'up',
      courses: ['MATH-101'],
      needsAttention: false
    }
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = filterRisk === 'all' || student.riskLevel === filterRisk
    return matchesSearch && matchesRisk
  })

  const studentsNeedingAttention = students.filter(s => s.needsAttention).length
  const averageMomentum = Math.round(students.reduce((sum, s) => sum + s.momentumScore, 0) / students.length)

  // Risk distribution data
  const riskDistribution = [
    { name: 'Low Risk', value: students.filter(s => s.riskLevel === 'low').length, color: '#10b981' },
    { name: 'Medium Risk', value: students.filter(s => s.riskLevel === 'medium').length, color: '#f59e0b' },
    { name: 'High Risk', value: students.filter(s => s.riskLevel === 'high').length, color: '#ef4444' },
    { name: 'Critical', value: students.filter(s => s.riskLevel === 'critical').length, color: '#7f1d1d' }
  ]

  // Trend data
  const trendData = [
    { name: 'Improving', count: students.filter(s => s.trend === 'up').length },
    { name: 'Stable', count: students.filter(s => s.trend === 'stable').length },
    { name: 'Declining', count: students.filter(s => s.trend === 'down').length }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400'
      case 'down': return 'text-red-600 dark:text-red-400'
      default: return 'text-slate-600 dark:text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome, <span className="gradient-text">Dr. {user?.lastName}</span>!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor your students' academic momentum and provide timely interventions
        </p>
      </motion.div>

      {/* Alert for students needing attention */}
      {studentsNeedingAttention > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="border-l-4 border-red-500">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Students Need Your Attention</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  {studentsNeedingAttention} student{studentsNeedingAttention > 1 ? 's show' : ' shows'} declining momentum or high risk levels
                </p>
                <Button variant="danger" onClick={() => setFilterRisk('high')}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  View At-Risk Students
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{students.length}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Students</p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{averageMomentum}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Avg Momentum Score</p>
            <ProgressBar value={averageMomentum} className="mt-2" />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{studentsNeedingAttention}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Need Attention</p>
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
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{students.filter(s => s.trend === 'up').length}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Improving</p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Trend Analysis */}
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Momentum Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.1} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Student List */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Your Students</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100"
              />
            </div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 cursor-pointer"
              onClick={() => navigate(`/teacher/student/${student.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{student.name}</h4>
                      <Badge variant={student.riskLevel}>{student.riskLevel}</Badge>
                      <span className={`text-xl ${getTrendColor(student.trend)}`}>
                        {getTrendIcon(student.trend)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>{student.email}</span>
                      <span>•</span>
                      <span>Courses: {student.courses.join(', ')}</span>
                      <span>•</span>
                      <span>Last survey: {new Date(student.lastSurvey).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold mb-1">{student.momentumScore}</div>
                  <ProgressBar value={student.momentumScore} className="w-24" />
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/teacher/message/${student.id}`)
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/teacher/student/${student.id}`)
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-between">
            <span className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Send Announcements
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="justify-between">
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Class Analytics
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="justify-between">
            <span className="flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Intervention Tools
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
