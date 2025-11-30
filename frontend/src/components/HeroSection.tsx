import { motion } from 'framer-motion'
import { ArrowRight, Shield, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'

export const HeroSection = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/login')
  }

  const handleSeeHowItWorks = () => {
    // Scroll to product cards section
    const productSection = document.getElementById('how-it-works')
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-sand-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-navy-200 rounded-full shadow-soft"
            >
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-navy-700">FERPA-compliant & student-first</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-navy-900 leading-tight"
            >
              Turn academic{' '}
              <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                spirals
              </span>{' '}
              into comeback stories
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-navy-600 leading-relaxed max-w-xl"
            >
              The app that's still proud of you when everything goes wrong. Weekly check-ins, personalized study guides, and hope when you need it most.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="group bg-navy-900 hover:bg-navy-800 text-white shadow-medium hover:shadow-large transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSeeHowItWorks}
                className="border-navy-300 text-navy-700 hover:bg-navy-50 shadow-soft"
              >
                See How It Works
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 border-2 border-white shadow-soft"
                  />
                ))}
              </div>
              <div className="text-sm text-navy-600">
                <span className="font-semibold text-navy-900">2,000+ students</span> building momentum
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative lg:ml-auto"
          >
            {/* Floating card container */}
            <div className="relative">
              {/* Main dashboard card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative bg-white rounded-2xl shadow-large p-6 border border-navy-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">Your Momentum</h3>
                    <p className="text-sm text-navy-500">Week 12 of 16</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">+12%</span>
                  </div>
                </div>

                {/* Progress visualization */}
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-600">Momentum Score</span>
                      <span className="font-semibold text-navy-900">7.8/10</span>
                    </div>
                    <div className="h-3 bg-navy-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-600">Study Blocks Completed</span>
                      <span className="font-semibold text-navy-900">8/10</span>
                    </div>
                    <div className="h-3 bg-navy-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '80%' }}
                        transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick stats grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-sand-50 border border-sand-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-navy-900">12</div>
                    <div className="text-xs text-navy-600">Guides</div>
                  </div>
                  <div className="bg-sand-50 border border-sand-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-navy-900">3</div>
                    <div className="text-xs text-navy-600">Courses</div>
                  </div>
                  <div className="bg-sand-50 border border-sand-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">B+</div>
                    <div className="text-xs text-navy-600">Avg</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating notification card */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-medium p-4 border border-navy-100 max-w-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">AI</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy-900 mb-1">New study guide ready!</p>
                    <p className="text-xs text-navy-600">
                      "Quadratic Functions" based on this week's check-in
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
