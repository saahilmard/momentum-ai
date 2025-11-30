import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'

// Pages
import Dashboard from './pages/Dashboard'
import StudentProfile from './pages/StudentProfile'
import Assessment from './pages/Assessment'
import Forecast from './pages/Forecast'
import SchoolOverview from './pages/SchoolOverview'
import Landing from './pages/Landing'

// Components
import Navigation from './components/Navigation'

// Store
import { useThemeStore } from './store/themeStore'

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

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/student/:studentId" element={<PageTransition><StudentProfile /></PageTransition>} />
        <Route path="/assessment/:studentId" element={<PageTransition><Assessment /></PageTransition>} />
        <Route path="/forecast/:studentId" element={<PageTransition><Forecast /></PageTransition>} />
        <Route path="/school-overview" element={<PageTransition><SchoolOverview /></PageTransition>} />
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
        <div className="min-h-screen">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
