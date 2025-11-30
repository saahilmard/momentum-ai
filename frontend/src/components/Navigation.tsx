import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  BarChart3,
  Users,
  ClipboardList,
  TrendingUp,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  BookOpen,
  Sparkles,
  Calendar
} from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggleTheme } = useThemeStore()
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Define navigation based on user role
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [{ name: 'Home', path: '/', icon: Home }]
    }

    if (user?.role === 'student') {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: BarChart3 },
        { name: 'Weekly Survey', path: '/student/survey', icon: Calendar },
        { name: 'Study Resources', path: '/student/resources', icon: Sparkles },
        { name: 'My Progress', path: '/student/profile', icon: TrendingUp },
      ]
    }

    if (user?.role === 'teacher') {
      return [
        { name: 'Dashboard', path: '/teacher/dashboard', icon: BarChart3 },
        { name: 'My Students', path: '/teacher/dashboard', icon: Users },
        { name: 'Class Analytics', path: '/school-overview', icon: TrendingUp },
      ]
    }

    // Default/admin navigation
    return [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
      { name: 'Students', path: '/student/STU001', icon: Users },
      { name: 'Assessment', path: '/assessment/STU001', icon: ClipboardList },
      { name: 'Forecast', path: '/forecast/STU001', icon: TrendingUp },
    ]
  }

  const navItems = getNavItems()
  const isActive = (path: string) => location.pathname === path

  // Don't show navigation on login or landing pages
  if (location.pathname === '/login' || location.pathname === '/landing') {
    return null
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-navy-900/95 backdrop-blur-lg shadow-medium border-b border-navy-100 dark:border-navy-800'
          : 'bg-white/80 dark:bg-navy-900/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? (user?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard') : '/'} className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg"
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">Momentum AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side: Theme Toggle, User Info, Logout */}
          <div className="flex items-center space-x-2">
            {/* User Info (desktop only) */}
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center space-x-3 mr-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                    {user.role}
                  </div>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </motion.button>

            {/* Logout Button */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-700 glass-strong"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* User Info (mobile) */}
              {isAuthenticated && user && (
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>
              )}

              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}

              {/* Logout (mobile) */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation
