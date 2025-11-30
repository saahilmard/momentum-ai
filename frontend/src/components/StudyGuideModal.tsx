import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, BookOpen, Target, ExternalLink, Printer, Eye, EyeOff } from 'lucide-react'
import type { StudyGuide } from '../types/user'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { LatexRenderer } from './LatexRenderer'

interface StudyGuideModalProps {
  guide: StudyGuide | null
  isOpen: boolean
  onClose: () => void
}

export const StudyGuideModal = ({ guide, isOpen, onClose }: StudyGuideModalProps) => {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set())

  if (!guide) return null

  const toggleAnswer = (problemId: string) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev)
      if (next.has(problemId)) {
        next.delete(problemId)
      } else {
        next.add(problemId)
      }
      return next
    })
  }

  const handleDownloadPDF = () => {
    alert('PDF download feature coming soon! For now, use Print to save as PDF.')
  }

  const handlePrint = () => {
    window.print()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': case 'easy': return 'green'
      case 'intermediate': case 'medium': return 'yellow'
      case 'advanced': case 'hard': return 'red'
      default: return 'gray'
    }
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
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">{guide.subject}</Badge>
                    <Badge variant={getDifficultyColor(guide.difficulty) as any}>
                      {guide.difficulty}
                    </Badge>
                    <Badge variant="ghost" className="text-xs">Georgia Standards</Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{guide.title}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Generated {new Date(guide.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
                {/* Overview */}
                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    Overview
                  </h3>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                      {guide.content.overview}
                    </p>
                  </div>
                </section>

                {/* Key Points */}
                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Key Concepts
                  </h3>
                  <ul className="space-y-2">
                    {guide.content.keyPoints.map((point, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-primary-600 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Examples */}
                {guide.content.examples.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Worked Examples</h3>
                    <div className="space-y-4">
                      {guide.content.examples.map((example, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                          <h4 className="font-semibold mb-2">{example.title}</h4>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <LatexRenderer content={example.description} />
                          </div>
                          {example.solution && (
                            <div className="mt-3 p-3 rounded bg-primary-50 dark:bg-primary-900/20">
                              <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-1">
                                Solution:
                              </p>
                              <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                <LatexRenderer content={example.solution} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Practice Problems */}
                {guide.content.practiceProblems.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      Practice Problems
                    </h3>
                    <div className="space-y-3">
                      {guide.content.practiceProblems.map((problem, index) => {
                        const isAnswerRevealed = revealedAnswers.has(problem.id)
                        return (
                          <div
                            key={problem.id}
                            className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold">Problem {index + 1}</h4>
                              <Badge variant={getDifficultyColor(problem.difficulty) as any} className="text-xs">
                                {problem.difficulty}
                              </Badge>
                            </div>
                            <div className="text-slate-700 dark:text-slate-300 mb-3">
                              <LatexRenderer content={problem.question} />
                            </div>

                            {/* Hint */}
                            {problem.hint && (
                              <details className="mt-2 mb-3">
                                <summary className="cursor-pointer text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                                  💡 Show hint
                                </summary>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 ml-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                  <LatexRenderer content={problem.hint} />
                                </div>
                              </details>
                            )}

                            {/* Answer Reveal Button */}
                            {problem.answer && (
                              <div className="mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleAnswer(problem.id)}
                                  className="w-full"
                                >
                                  {isAnswerRevealed ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Hide Answer
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Show Answer
                                    </>
                                  )}
                                </Button>

                                {/* Answer Content */}
                                <AnimatePresence>
                                  {isAnswerRevealed && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="mt-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                                    >
                                      <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Solution:
                                      </p>
                                      <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                        <LatexRenderer content={problem.answer} />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )}

                {/* Resources */}
                {guide.content.resources.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                      Additional Resources
                    </h3>
                    <div className="space-y-2">
                      {guide.content.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="ghost" className="text-xs capitalize">
                                  {resource.type}
                                </Badge>
                                {resource.duration && (
                                  <span className="text-xs text-slate-500">
                                    {resource.duration}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-semibold text-blue-700 dark:text-blue-400 group-hover:underline">
                                {resource.title}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {resource.description}
                              </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print / Save as PDF
                </Button>
                <Button variant="primary" onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
