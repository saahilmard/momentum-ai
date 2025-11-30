import { useState, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, BookOpen, Target, ExternalLink, Printer, Eye, EyeOff, Lightbulb, Sparkles } from 'lucide-react'
import type { StudyGuide } from '../types/user'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { LatexRenderer } from './LatexRenderer'

interface StudyGuideModalProps {
  guide: StudyGuide | null
  isOpen: boolean
  onClose: () => void
}

type TabType = 'overview' | 'examples' | 'practice' | 'resources'

export const StudyGuideModal = memo(({ guide, isOpen, onClose }: StudyGuideModalProps) => {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  if (!guide) return null

  const toggleAnswer = useCallback((problemId: string) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev)
      if (next.has(problemId)) {
        next.delete(problemId)
      } else {
        next.add(problemId)
      }
      return next
    })
  }, [])

  const handleDownloadPDF = useCallback(() => {
    alert('PDF download feature coming soon! For now, use Print to save as PDF.')
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'beginner': case 'easy': return 'green'
      case 'intermediate': case 'medium': return 'yellow'
      case 'advanced': case 'hard': return 'red'
      default: return 'gray'
    }
  }, [])

  const tabs = useMemo<{ id: TabType; label: string; icon: any }[]>(() => [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'examples', label: 'Examples', icon: Lightbulb },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'resources', label: 'Resources', icon: ExternalLink }
  ], [])

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
            className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden"
          >
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />

            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              {/* Header with Gradient */}
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                        {guide.subject}
                      </Badge>
                      <Badge variant={getDifficultyColor(guide.difficulty) as any} className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                        {guide.difficulty}
                      </Badge>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{guide.title}</h2>
                    <p className="text-sm text-white/80">
                      Generated {new Date(guide.generatedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/20"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mt-6 bg-white/10 backdrop-blur-sm p-1.5 rounded-2xl border border-white/20">
                  {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-white text-blue-600 shadow-lg'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(92vh-280px)] p-6">
                <AnimatePresence mode="wait">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Overview Card */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50">
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Introduction</h3>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                          <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                            <LatexRenderer content={guide.content.overview} />
                          </div>
                        </div>
                      </div>

                      {/* Key Concepts Grid */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Key Concepts</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {guide.content.keyPoints.map((point, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  <LatexRenderer content={point} />
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Examples Tab */}
                  {activeTab === 'examples' && (
                    <motion.div
                      key="examples"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {guide.content.examples.length > 0 ? (
                        guide.content.examples.map((example, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-700/50 shadow-sm"
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              <h4 className="font-bold text-lg text-slate-900 dark:text-white">{example.title}</h4>
                            </div>
                            <div className="mb-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-amber-200 dark:border-amber-700">
                              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">Problem:</p>
                              <div className="text-slate-700 dark:text-slate-300">
                                <LatexRenderer content={example.description} />
                              </div>
                            </div>
                            {example.solution && (
                              <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-green-200 dark:border-green-700">
                                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Solution:
                                </p>
                                <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                  <LatexRenderer content={example.solution} />
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-slate-500">
                          No examples available
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Practice Tab */}
                  {activeTab === 'practice' && (
                    <motion.div
                      key="practice"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {guide.content.practiceProblems.length > 0 ? (
                        guide.content.practiceProblems.map((problem, index) => {
                          const isAnswerRevealed = revealedAnswers.has(problem.id)
                          return (
                            <motion.div
                              key={problem.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50 shadow-sm"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                  </div>
                                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">Problem {index + 1}</h4>
                                </div>
                                <Badge variant={getDifficultyColor(problem.difficulty) as any} className="text-xs">
                                  {problem.difficulty}
                                </Badge>
                              </div>

                              <div className="mb-4 p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-purple-200 dark:border-purple-700">
                                <div className="text-slate-700 dark:text-slate-300">
                                  <LatexRenderer content={problem.question} />
                                </div>
                              </div>

                              {/* Hint */}
                              {problem.hint && (
                                <details className="mb-3">
                                  <summary className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                    <Lightbulb className="w-4 h-4" />
                                    Need a hint?
                                  </summary>
                                  <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Hint:</p>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                      <LatexRenderer content={problem.hint} />
                                    </div>
                                  </div>
                                </details>
                              )}

                              {/* Answer Reveal */}
                              {problem.answer && (
                                <div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleAnswer(problem.id)}
                                    className="w-full mb-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-purple-300 dark:border-purple-700"
                                  >
                                    {isAnswerRevealed ? (
                                      <>
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Hide Solution
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Show Solution
                                      </>
                                    )}
                                  </Button>

                                  <AnimatePresence>
                                    {isAnswerRevealed && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700"
                                      >
                                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                                          <CheckCircle className="w-5 h-5" />
                                          Complete Solution:
                                        </p>
                                        <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                          <LatexRenderer content={problem.answer} />
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </motion.div>
                          )
                        })
                      ) : (
                        <div className="text-center py-12 text-slate-500">
                          No practice problems available
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Resources Tab */}
                  {activeTab === 'resources' && (
                    <motion.div
                      key="resources"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      {guide.content.resources.length > 0 ? (
                        guide.content.resources.map((resource, index) => (
                          <motion.a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="block p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="text-xs capitalize bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                                    {resource.type}
                                  </Badge>
                                  {resource.duration && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                      ⏱️ {resource.duration}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-bold text-blue-700 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 mb-1 transition-colors">
                                  {resource.title}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {resource.description}
                                </p>
                              </div>
                              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                          </motion.a>
                        ))
                      ) : (
                        <div className="text-center py-12 text-slate-500">
                          No resources available
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" onClick={handlePrint} className="bg-white dark:bg-slate-800">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="primary"
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
})
