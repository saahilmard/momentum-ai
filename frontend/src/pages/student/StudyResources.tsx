import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  BookOpen,
  Video,
  FileText,
  Brain,
  Target,
  Download,
  ExternalLink,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { StudyGuide, SupportMaterial } from '../../types/user'

export const StudyResources = () => {
  const { user } = useAuthStore()
  const studentInfo = user?.studentInfo
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock AI-generated study guides based on student's weak areas and learning style
  const studyGuides: StudyGuide[] = [
    {
      id: 'sg-001',
      title: 'Differential Equations Fundamentals',
      subject: 'Mathematics',
      topic: 'Differential Equations',
      difficulty: 'intermediate',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      basedOnSurvey: 'survey-004',
      content: {
        overview: 'A comprehensive visual guide to understanding differential equations, tailored to your visual learning style.',
        keyPoints: [
          'Understanding the concept of rate of change',
          'First-order differential equations',
          'Separation of variables technique',
          'Applications in physics and engineering'
        ],
        examples: [
          {
            title: 'Population Growth Model',
            description: 'Visual representation of exponential growth using differential equations',
            solution: 'dP/dt = kP, where k is the growth rate'
          },
          {
            title: 'Newton\'s Cooling Law',
            description: 'Temperature change over time modeled with first-order DE',
            solution: 'dT/dt = -k(T - T_ambient)'
          }
        ],
        practiceProblems: [
          {
            id: 'prob-001',
            question: 'Solve: dy/dx = 3x² + 2x',
            difficulty: 'easy',
            hint: 'Use direct integration',
            answer: 'y = x³ + x² + C'
          },
          {
            id: 'prob-002',
            question: 'Solve: dy/dx = y/x, y(1) = 2',
            difficulty: 'medium',
            hint: 'Use separation of variables',
            answer: 'y = 2x'
          }
        ],
        resources: [
          {
            type: 'video',
            title: '3Blue1Brown: Differential Equations',
            url: 'https://youtube.com/watch?v=p_di4Zn4wz4',
            description: 'Visual introduction to differential equations',
            duration: '15 min'
          },
          {
            type: 'article',
            title: 'Khan Academy: Separation of Variables',
            url: 'https://khanacademy.org/differential-equations',
            description: 'Interactive exercises and explanations'
          },
          {
            type: 'tool',
            title: 'Desmos Differential Equation Grapher',
            url: 'https://desmos.com/calculator',
            description: 'Visualize solutions to differential equations'
          }
        ]
      }
    },
    {
      id: 'sg-002',
      title: 'Newton\'s Laws of Motion - Visual Guide',
      subject: 'Physics',
      topic: 'Newton\'s Laws',
      difficulty: 'beginner',
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      basedOnSurvey: 'survey-003',
      content: {
        overview: 'Master Newton\'s three laws with visual diagrams and real-world examples.',
        keyPoints: [
          'First Law: Inertia and equilibrium',
          'Second Law: F = ma relationship',
          'Third Law: Action-reaction pairs',
          'Free body diagrams and force vectors'
        ],
        examples: [
          {
            title: 'Car Acceleration',
            description: 'Visualizing force and acceleration in everyday motion',
            solution: 'F_net = m × a; Friction opposes motion'
          },
          {
            title: 'Rocket Propulsion',
            description: 'Understanding action-reaction with momentum',
            solution: 'Gas expelled downward → Rocket pushed upward'
          }
        ],
        practiceProblems: [
          {
            id: 'prob-003',
            question: 'A 1000 kg car accelerates at 2 m/s². What is the net force?',
            difficulty: 'easy',
            hint: 'Use F = ma',
            answer: '2000 N'
          }
        ],
        resources: [
          {
            type: 'video',
            title: 'MIT OpenCourseWare: Newton\'s Laws',
            url: 'https://ocw.mit.edu/physics',
            description: 'Lecture series on classical mechanics',
            duration: '45 min'
          },
          {
            type: 'exercise',
            title: 'PhET Interactive Simulations',
            url: 'https://phet.colorado.edu/en/simulation/forces-and-motion',
            description: 'Hands-on force simulations'
          }
        ]
      }
    }
  ]

  const supportMaterials: SupportMaterial[] = [
    {
      id: 'sm-001',
      type: 'practice_test',
      subject: 'Mathematics',
      topic: 'Calculus Integration',
      title: 'Integration Techniques Practice Test',
      description: 'Adaptive practice test with 20 problems covering u-substitution, integration by parts, and partial fractions',
      difficulty: 'intermediate',
      matchScore: 95,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sm-002',
      type: 'concept_map',
      subject: 'Physics',
      topic: 'Classical Mechanics',
      title: 'Forces and Motion Concept Map',
      description: 'Visual mind map connecting Newton\'s Laws, energy, and momentum',
      difficulty: 'beginner',
      matchScore: 88,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sm-003',
      type: 'tutorial',
      subject: 'Mathematics',
      topic: 'Differential Equations',
      title: 'Step-by-Step DE Solver Tutorial',
      description: 'Interactive tutorial teaching you to solve first and second-order differential equations',
      difficulty: 'intermediate',
      matchScore: 92,
      createdAt: new Date().toISOString()
    }
  ]

  const generateNewGuide = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const filteredGuides = studyGuides.filter(guide => {
    const subjectMatch = selectedSubject === 'all' || guide.subject === selectedSubject
    const difficultyMatch = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty
    return subjectMatch && difficultyMatch
  })

  const filteredMaterials = supportMaterials.filter(material => {
    const subjectMatch = selectedSubject === 'all' || material.subject === selectedSubject
    const difficultyMatch = selectedDifficulty === 'all' || material.difficulty === selectedDifficulty
    return subjectMatch && difficultyMatch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'article': return <FileText className="w-4 h-4" />
      case 'practice_test': return <Target className="w-4 h-4" />
      case 'concept_map': return <Brain className="w-4 h-4" />
      case 'tutorial': return <BookOpen className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green'
      case 'intermediate': return 'yellow'
      case 'advanced': return 'red'
      default: return 'gray'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">AI-Powered Study Resources</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Personalized materials based on your learning style, courses, and survey responses
        </p>
      </motion.div>

      {/* AI Generation Card */}
      <GlassCard className="border-l-4 border-purple-500">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Generate Custom Study Guide</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Our AI analyzes your survey responses, weak areas ({studentInfo?.weakAreas.join(', ')}),
                and {studentInfo?.learningStyle} learning style to create personalized materials.
              </p>
              <Button onClick={generateNewGuide} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate New Study Guide
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="glass px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Subjects</option>
            {studentInfo?.subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="glass px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* AI-Generated Study Guides */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          AI-Generated Study Guides
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">{guide.subject}</Badge>
                      <Badge variant={getDifficultyColor(guide.difficulty) as any}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {guide.content.overview}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />
                </div>

                {/* Key Points Preview */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Key Topics Covered
                  </h4>
                  <ul className="space-y-1">
                    {guide.content.keyPoints.slice(0, 3).map((point, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 pl-6">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources Count */}
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {guide.content.examples.length} examples
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {guide.content.practiceProblems.length} problems
                  </span>
                  <span className="flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" />
                    {guide.content.resources.length} resources
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => window.open(`/student/guide/${guide.id}`, '_blank')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Open Guide
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Generated {Math.floor((Date.now() - new Date(guide.generatedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Support Materials */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          Recommended Materials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    {getTypeIcon(material.type)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {material.matchScore}% match
                    </div>
                  </div>
                </div>
                <h4 className="font-semibold mb-2">{material.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {material.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="ghost" className="text-xs">{material.topic}</Badge>
                  <Badge variant={getDifficultyColor(material.difficulty) as any} className="text-xs">
                    {material.difficulty}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Access Resource
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
