import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Brain,
  TrendingUp
} from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { useAuthStore } from '../../store/authStore'

interface Question {
  id: string
  question: string
  description: string
  category: 'stress' | 'academic' | 'social' | 'wellness'
  min: number
  max: number
  minLabel: string
  maxLabel: string
}

export const WeeklySurvey = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const questions: Question[] = [
    {
      id: 'stress_level',
      question: 'How stressed have you felt this week?',
      description: 'Consider academic pressure, deadlines, and overall anxiety',
      category: 'stress',
      min: 1,
      max: 10,
      minLabel: 'Very relaxed',
      maxLabel: 'Extremely stressed'
    },
    {
      id: 'motivation',
      question: 'How motivated have you felt to complete your coursework?',
      description: 'Think about your drive and enthusiasm for learning',
      category: 'academic',
      min: 1,
      max: 10,
      minLabel: 'Not motivated',
      maxLabel: 'Very motivated'
    },
    {
      id: 'confidence',
      question: 'How confident do you feel about understanding course material?',
      description: 'Rate your comprehension and academic self-efficacy',
      category: 'academic',
      min: 1,
      max: 10,
      minLabel: 'Not confident',
      maxLabel: 'Very confident'
    },
    {
      id: 'sleep_quality',
      question: 'How would you rate your sleep quality this week?',
      description: 'Consider duration and restfulness of your sleep',
      category: 'wellness',
      min: 1,
      max: 10,
      minLabel: 'Very poor',
      maxLabel: 'Excellent'
    },
    {
      id: 'social_support',
      question: 'How supported do you feel by friends, family, or peers?',
      description: 'Think about your social connections and support system',
      category: 'social',
      min: 1,
      max: 10,
      minLabel: 'Not supported',
      maxLabel: 'Very supported'
    },
    {
      id: 'time_management',
      question: 'How well have you managed your time this week?',
      description: 'Consider your ability to balance academics, activities, and rest',
      category: 'academic',
      min: 1,
      max: 10,
      minLabel: 'Very poorly',
      maxLabel: 'Very well'
    },
    {
      id: 'academic_concern',
      question: 'How concerned are you about your academic performance?',
      description: 'Rate your worry about grades and academic success',
      category: 'academic',
      min: 1,
      max: 10,
      minLabel: 'Not concerned',
      maxLabel: 'Very concerned'
    },
    {
      id: 'engagement',
      question: 'How engaged have you felt in class this week?',
      description: 'Think about your participation and attention during classes',
      category: 'academic',
      min: 1,
      max: 10,
      minLabel: 'Not engaged',
      maxLabel: 'Very engaged'
    },
    {
      id: 'resilience',
      question: 'How well do you bounce back from academic setbacks?',
      description: 'Consider your ability to recover from challenges or failures',
      category: 'wellness',
      min: 1,
      max: 10,
      minLabel: 'Not resilient',
      maxLabel: 'Very resilient'
    },
    {
      id: 'help_seeking',
      question: 'How comfortable are you asking for help when needed?',
      description: 'Rate your willingness to seek support from teachers or tutors',
      category: 'social',
      min: 1,
      max: 10,
      minLabel: 'Very uncomfortable',
      maxLabel: 'Very comfortable'
    }
  ]

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = answers[currentQ.id] !== undefined

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQ.id]: value })
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowResults(true)
  }

  const calculateMomentumScore = () => {
    // Simple algorithm: invert stress and concern, then average all
    const scores = Object.entries(answers).map(([key, value]) => {
      if (key === 'stress_level' || key === 'academic_concern') {
        return 11 - value // Invert these scores
      }
      return value
    })
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 10)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stress': return 'red'
      case 'academic': return 'blue'
      case 'social': return 'green'
      case 'wellness': return 'purple'
      default: return 'gray'
    }
  }

  if (showResults) {
    const momentumScore = calculateMomentumScore()
    const riskLevel = momentumScore >= 70 ? 'low' : momentumScore >= 50 ? 'medium' : momentumScore >= 30 ? 'high' : 'critical'

    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard>
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-4"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">Survey Complete!</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Thank you for completing this week's check-in
              </p>
            </div>

            <div className="space-y-6">
              {/* Momentum Score */}
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Your Momentum Score
                </p>
                <div className="text-6xl font-bold gradient-text mb-4">
                  {momentumScore}
                </div>
                <ProgressBar value={momentumScore} className="max-w-md mx-auto" />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Risk Level: <span className="font-semibold capitalize">{riskLevel}</span>
                </p>
              </div>

              {/* AI Analysis */}
              <GlassCard className="bg-purple-50/50 dark:bg-purple-900/10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Based on your responses, we're generating personalized study materials
                      and recommendations to support your academic success.
                    </p>
                  </div>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                />
              </GlassCard>

              {/* Next Steps */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  What's Next?
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Personalized study guides are being generated based on your weak areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Your teacher will be notified if you need additional support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Check your dashboard for new resources tailored to your learning style</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => navigate('/student/resources')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Study Resources
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/student/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <ProgressBar value={progress} />
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard>
            <div className={`inline-block px-3 py-1 rounded-full bg-${getCategoryColor(currentQ.category)}-100 dark:bg-${getCategoryColor(currentQ.category)}-900/30 text-${getCategoryColor(currentQ.category)}-700 dark:text-${getCategoryColor(currentQ.category)}-400 text-sm font-medium mb-4 capitalize`}>
              {currentQ.category}
            </div>

            <h2 className="text-2xl font-bold mb-3">{currentQ.question}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {currentQ.description}
            </p>

            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {currentQ.minLabel}
                </span>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {answers[currentQ.id] || currentQ.min}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {currentQ.maxLabel}
                </span>
              </div>

              <input
                type="range"
                min={currentQ.min}
                max={currentQ.max}
                value={answers[currentQ.id] || currentQ.min}
                onChange={(e) => handleAnswer(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600
                         [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                         [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:cursor-pointer
                         [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
              />

              <div className="flex justify-between mt-2">
                {Array.from({ length: currentQ.max }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => handleAnswer(num)}
                    className={`text-sm px-2 py-1 rounded transition-colors ${
                      answers[currentQ.id] === num
                        ? 'bg-primary-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Processing...
                  </>
                ) : isLastQuestion ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Survey
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
