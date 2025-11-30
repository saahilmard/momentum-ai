import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, TrendingUp, Award, BookOpen, ChevronRight } from 'lucide-react'
import type { ComebackStory } from '../types/user'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

// Sample comeback stories (in production, fetch from backend)
const sampleStories: ComebackStory[] = [
  {
    id: '1',
    title: 'From Failing Precalc to MIT',
    preview: 'I failed Precalculus junior year. Everyone said I wasn\'t "math material."',
    fullStory: `I failed Precalculus junior year. Everyone said I wasn't "math material." My parents were disappointed. I felt like I'd blown my shot at a good college.

But here's what changed: I stopped trying to memorize formulas and started asking "why does this work?" I found a tutor who explained concepts visually. I did 20 minutes every single day instead of cramming.

By senior year, I got an A in AP Calculus BC. Got into MIT for computer science. The failure wasn't permanent - it was data.`,
    situation: 'Failed Precalculus junior year',
    outcome: 'Accepted to MIT for Computer Science',
    keyLessons: [
      'Daily consistency beats occasional cramming',
      'Find YOUR learning style (visual worked for me)',
      'One F doesn\'t define your trajectory'
    ],
    isAnonymized: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Almost Dropped Out, Graduated with Honors',
    preview: 'Sophomore year, I stopped showing up. Depression hit hard and school felt impossible.',
    fullStory: `Sophomore year, I stopped showing up. Depression hit hard and school felt impossible. By November, I'd missed 40 days.

My counselor could have just reported it. Instead, she asked: "What's one small thing we can fix?" We started with attending just 1st period. Then two classes. Then three.

I didn't magically get better. But I learned to show up even when it felt pointless. Graduated with a 3.7. Now studying psychology to help kids like me.`,
    situation: 'Chronic absences, almost dropped out',
    outcome: 'Graduated with 3.7 GPA, studying psychology',
    keyLessons: [
      'Start impossibly small when overwhelmed',
      'Showing up matters more than being perfect',
      'Ask for help BEFORE the spiral gets deep'
    ],
    isAnonymized: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'From Panic to Peace: Managing Test Anxiety',
    preview: 'I knew the material but would blank during every test. My GPA didn\'t reflect what I actually knew.',
    fullStory: `I knew the material but would blank during every test. Sophomore year GPA: 2.1. Junior year: 3.8. Same brain, different approach.

What changed: I learned my anxiety had a pattern. It spiked 10 minutes into tests. So I built in a "reset ritual" - close my eyes, three deep breaths, read the easiest question first.

I also started doing practice tests in the actual classroom after school. My body learned: "This room = safe, not threat." Sounds weird, works beautifully.`,
    situation: 'Severe test anxiety, 2.1 GPA sophomore year',
    outcome: '3.8 GPA junior year, studying neuroscience',
    keyLessons: [
      'Anxiety follows patterns you can interrupt',
      'Practice in the actual test environment',
      'Your brain can be retrained'
    ],
    isAnonymized: true,
    createdAt: new Date().toISOString()
  }
]

export const ComebackStoriesFeed = () => {
  const [expandedStory, setExpandedStory] = useState<string | null>(null)

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-4">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Comeback Stories</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          The app that is still proud of you when everything goes wrong
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Real stories from students who spiraled and came back stronger
        </p>
      </div>

      {/* Stories Grid */}
      <div className="space-y-4">
        {sampleStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200">
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {story.title}
                      </h3>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {story.situation}
                      </Badge>
                      <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        <Award className="w-3 h-3 mr-1" />
                        {story.outcome}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 italic">
                  "{story.preview}"
                </p>

                {/* Expanded Content */}
                {expandedStory === story.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {story.fullStory}
                      </p>
                    </div>

                    {/* Key Lessons */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Key Lessons
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {story.keyLessons.map((lesson, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* Expand/Collapse Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                  className="w-full mt-4"
                >
                  {expandedStory === story.id ? (
                    'Show less'
                  ) : (
                    <>
                      Read full story
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Your Story CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 text-center"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Have your own comeback story?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Share anonymously and inspire others navigating their own spirals
        </p>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          Share Your Story
        </Button>
      </motion.div>
    </div>
  )
}
