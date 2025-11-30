import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  className?: string
}

export const ProgressBar = ({ value, variant = 'primary', showLabel = true, className = '' }: ProgressBarProps) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    danger: 'bg-gradient-to-r from-red-500 to-red-600',
  }

  // Auto-select variant based on value if not specified
  const autoVariant = (() => {
    if (variant !== 'primary') return variant
    if (clampedValue >= 70) return 'success'
    if (clampedValue >= 50) return 'warning'
    return 'danger'
  })()

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${variants[autoVariant]} shadow-lg`}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 text-right font-medium">
          {clampedValue.toFixed(0)}%
        </p>
      )}
    </div>
  )
}
