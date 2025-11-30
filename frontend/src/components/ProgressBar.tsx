import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'

export interface ProgressStep {
  id: string
  label: string
  description: string
}

interface ProgressBarProps {
  steps: ProgressStep[]
  currentStep: number
  className?: string
}

export const ProgressBar = ({ steps, currentStep, className = '' }: ProgressBarProps) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Steps Container */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 via-blue-500 to-teal-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isPending = index > currentStep

            return (
              <div key={step.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    opacity: 1
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 mb-3"
                >
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                          : isCurrent
                          ? 'bg-gradient-to-br from-primary-500 via-blue-500 to-teal-500 shadow-xl shadow-primary-500/40 glass-strong'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      >
                        <CheckCircle className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600" />
                    )}
                  </div>

                  {/* Pulse Effect for Current Step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary-500/30"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center max-w-[120px]"
                >
                  <div
                    className={`
                      text-sm font-semibold mb-1 transition-colors duration-300
                      ${
                        isCompleted || isCurrent
                          ? 'text-slate-900 dark:text-slate-100'
                          : 'text-slate-500 dark:text-slate-500'
                      }
                    `}
                  >
                    {step.label}
                  </div>

                  {/* Show description for current step */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-slate-600 dark:text-slate-400 mt-1"
                    >
                      {step.description}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Step Info Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-8 p-4 rounded-xl glass-strong border border-primary-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 via-blue-500 to-teal-500 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              {steps[currentStep]?.label}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {steps[currentStep]?.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {currentStep + 1} / {steps.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 via-blue-500 to-teal-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

// Default steps for study guide generation
export const STUDY_GUIDE_STEPS: ProgressStep[] = [
  {
    id: 'analyze',
    label: 'Analyzing your needs',
    description: 'Understanding your learning style and weak areas...',
  },
  {
    id: 'retrieve',
    label: 'Retrieving Georgia Standards',
    description: 'Fetching relevant standards for your grade level...',
  },
  {
    id: 'generate',
    label: 'Generating personalized content',
    description: 'Creating tailored study materials with AI...',
  },
  {
    id: 'finalize',
    label: 'Finalizing study guide',
    description: 'Polishing and formatting your custom guide...',
  },
]
