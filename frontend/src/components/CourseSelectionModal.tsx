import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Book, Sparkles, Target } from 'lucide-react'
import type { Course } from '../types/user'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { GlassCard } from './ui/GlassCard'

interface CourseSelectionModalProps {
  courses: Course[]
  isOpen: boolean
  onClose: () => void
  onGenerate: (course: Course, topic: string, difficulty: string) => void
  isGenerating: boolean
}

export const CourseSelectionModal = ({
  courses,
  isOpen,
  onClose,
  onGenerate,
  isGenerating
}: CourseSelectionModalProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [customTopic, setCustomTopic] = useState('')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')

  const handleGenerate = () => {
    if (!selectedCourse) return

    const topic = customTopic || selectedCourse.name
    onGenerate(selectedCourse, topic, difficulty)
  }

  const handleClose = () => {
    setSelectedCourse(null)
    setCustomTopic('')
    setDifficulty('intermediate')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl"
          >
            <GlassCard className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    Generate Study Guide
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Choose a course and topic to generate personalized materials
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Course Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Select Course
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <motion.button
                      key={course.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedCourse?.id === course.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{course.name}</h4>
                        {course.struggling && (
                          <Badge variant="red" className="text-xs">Needs Focus</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{course.code}</p>
                      {course.currentGrade && (
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                          Current Grade: {course.currentGrade}%
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              {selectedCourse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Specific Topic (Optional)
                  </h3>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder={`e.g., Differential Equations, ${selectedCourse.name} fundamentals`}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Leave blank to generate a guide for the entire course
                  </p>
                </motion.div>
              )}

              {/* Difficulty Selection */}
              {selectedCourse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <h3 className="font-semibold mb-3">Difficulty Level</h3>
                  <div className="flex gap-3">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                          difficulty === level
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Generation Info */}
              {selectedCourse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 mb-6"
                >
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Generating:</strong> A {difficulty}-level study guide for{' '}
                    <strong>{customTopic || selectedCourse.name}</strong> using Georgia Standards
                    and adapted to your learning style.
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={!selectedCourse || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Study Guide
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
