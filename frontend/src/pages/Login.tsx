import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, User, Lock, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { GlassCard } from '../components/ui/GlassCard'

export const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [userType, setUserType] = useState<'student' | 'teacher'>('student')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate(userType === 'student' ? '/student/dashboard' : '/teacher/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    }
  }

  const fillDemo = (type: 'student' | 'teacher') => {
    setUserType(type)
    setEmail(type === 'student' ? 'student@demo.com' : 'teacher@demo.com')
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 mb-4"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Momentum AI</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Predict. Support. Succeed.
          </p>
        </div>

        <GlassCard hover={false}>
          {/* User Type Selector */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={userType === 'student' ? 'primary' : 'outline'}
              onClick={() => setUserType('student')}
              className="flex-1"
            >
              <User className="w-4 h-4 mr-2" />
              Student
            </Button>
            <Button
              variant={userType === 'teacher' ? 'primary' : 'outline'}
              onClick={() => setUserType('teacher')}
              className="flex-1"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Teacher
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${userType}@school.edu`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Logging in...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 text-center">
              Try Demo Accounts:
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fillDemo('student')}
                className="flex-1"
              >
                Student Demo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fillDemo('teacher')}
                className="flex-1"
              >
                Teacher Demo
              </Button>
            </div>
          </div>
        </GlassCard>

        <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
          Need help?{' '}
          <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Contact Support
          </button>
        </p>
      </motion.div>
    </div>
  )
}
