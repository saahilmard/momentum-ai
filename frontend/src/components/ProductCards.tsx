import { motion } from 'framer-motion'
import { Brain, Heart, LineChart, Sparkles, Shield, Users } from 'lucide-react'

const products = [
  {
    icon: Heart,
    title: 'Weekly Check-Ins',
    description: 'Not just "how are you doing?" — we ask about momentum, hope, and when things started feeling off.',
    features: [
      'Track your emotional trajectory',
      'Grade bands (not exact scores)',
      'Privacy controls you actually control'
    ],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    icon: Brain,
    title: 'AI Study Guides',
    description: 'Personalized to your learning style, Georgia standards, and what you\'re actually struggling with.',
    features: [
      'Adapts to visual/auditory/kinesthetic learners',
      'LaTeX-rendered math & science',
      'Practice problems with hints'
    ],
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200'
  },
  {
    icon: LineChart,
    title: 'Comeback Stories',
    description: 'Real stories from students who turned it around. Because sometimes you just need to know it\'s possible.',
    features: [
      'Anonymized student journeys',
      'From panic to peace',
      'Share your own story (optional)'
    ],
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export const ProductCards = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.05),transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sand-100 border border-sand-200 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-navy-700">Three Core Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4"
          >
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
              turn things around
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-navy-600 max-w-3xl mx-auto"
          >
            Built for students who are trying, not for admins who want surveillance
          </motion.p>
        </div>

        {/* Product cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.title}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white border border-navy-100 rounded-2xl p-8 shadow-soft hover:shadow-large transition-all duration-300"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} mb-6 shadow-medium`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-navy-900 mb-3">
                  {product.title}
                </h3>

                {/* Description */}
                <p className="text-navy-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Features list */}
                <ul className="space-y-3">
                  {product.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + (index * 0.2) + (featureIndex * 0.1), duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${product.color} flex items-center justify-center flex-shrink-0`}>
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm text-navy-700 leading-relaxed">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* Hover gradient border effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Trust indicators row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          <div className="flex items-center gap-4 p-6 bg-sand-50 border border-sand-200 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-white border border-sand-300 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-navy-900 mb-1">FERPA Compliant</h4>
              <p className="text-sm text-navy-600">Your data is yours, period</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-sand-50 border border-sand-200 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-white border border-sand-300 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-teal-500" />
            </div>
            <div>
              <h4 className="font-semibold text-navy-900 mb-1">Student-First</h4>
              <p className="text-sm text-navy-600">Built for you, not surveillance</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-sand-50 border border-sand-200 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-white border border-sand-300 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h4 className="font-semibold text-navy-900 mb-1">Human-Centered</h4>
              <p className="text-sm text-navy-600">Tech that actually cares</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
