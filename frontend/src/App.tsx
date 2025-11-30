import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'

// Pages - Public
import Landing from './pages/Landing'
import { LandingPage } from './pages/LandingPage'
import { Login } from './pages/Login'

// Pages - Admin/Overview
import Dashboard from './pages/Dashboard'
import StudentProfile from './pages/StudentProfile'
import Assessment from './pages/Assessment'
import Forecast from './pages/Forecast'
import SchoolOverview from './pages/SchoolOverview'

// Pages - Student
import { StudentDashboard } from './pages/student/StudentDashboard'
import { WeeklySurvey } from './pages/student/WeeklySurvey'
import { StudyResources } from './pages/student/StudyResources'

// Pages - Teacher
import { TeacherDashboard } from './pages/teacher/TeacherDashboard'

// Components
import Navigation from './components/Navigation'
import { ProtectedRoute } from './components/ProtectedRoute'

// Store
import { useThemeStore } from './store/themeStore'
import { useAuthStore } from './store/authStore'

// Styles
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
})

// Page transition wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Animated routes
const AnimatedRoutes = () => {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  // Root redirect component
  const RootRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    // Redirect to role-based dashboard
    const dashboardPath = user?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'
    return <Navigate to={dashboardPath} replace />
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Root Route - Redirect based on auth status */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/old-landing" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <PageTransition><StudentDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/survey"
          element={
            <ProtectedRoute requiredRole="student">
              <PageTransition><WeeklySurvey /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/resources"
          element={
            <ProtectedRoute requiredRole="student">
              <PageTransition><StudyResources /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute requiredRole="student">
              <PageTransition><StudentProfile /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute requiredRole="student">
              <PageTransition><StudentProfile /></PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requiredRole="teacher">
              <PageTransition><TeacherDashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/student/:studentId"
          element={
            <ProtectedRoute requiredRole="teacher">
              <PageTransition><StudentProfile /></PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Admin/Overview Routes (legacy - can be accessed by any authenticated user) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/:studentId"
          element={
            <ProtectedRoute>
              <PageTransition><StudentProfile /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/:studentId"
          element={
            <ProtectedRoute>
              <PageTransition><Assessment /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forecast/:studentId"
          element={
            <ProtectedRoute>
              <PageTransition><Forecast /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school-overview"
          element={
            <ProtectedRoute>
              <PageTransition><SchoolOverview /></PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const { isDark, setTheme } = useThemeStore()

  // Initialize theme on mount
  useEffect(() => {
    setTheme(isDark)
  }, [isDark, setTheme])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  )
}

// Separate component to access router hooks
const AppContent = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/landing'
  const isLoginPage = location.pathname === '/login'

  // Hide navigation on landing and login pages
  const showNavigation = !isLandingPage && !isLoginPage

  return (
    <div className="min-h-screen">
      {showNavigation && <Navigation />}
      <main className={isLandingPage || isLoginPage ? '' : 'container mx-auto px-4 py-8'}>
        <AnimatedRoutes />
      </main>
    </div>
  )
}

export default App
