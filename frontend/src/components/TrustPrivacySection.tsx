import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, UserCheck, Database } from 'lucide-react'

const privacyFeatures = [
  {
    icon: Lock,
    title: 'You Own Your Data',
    description: 'Every note, every mood, every grade band — you decide who sees it. Teachers, counselors, parents? Your call.'
  },
  {
    icon: Eye,
    title: 'Blurred Grades',
    description: 'We ask for grade ranges (A/B, B/C), not exact scores. Less surveillance, more support.'
  },
  {
    icon: UserCheck,
    title: 'FERPA-Aligned',
    description: 'Full compliance with student privacy laws. Because your education record should be yours.'
  },
  {
    icon: Database,
    title: 'Minimal Data Collection',
    description: 'We only collect what helps you. No tracking, no selling, no surveillance creep.'
  }
]

const trustPrinciples = [
  {
    title: 'Built for students, not admins',
    description: 'This isn\'t a surveillance tool disguised as "support." It\'s genuinely here to help you.'
  },
  {
    title: 'Transparent AI',
    description: 'Our study guides show you the Georgia standards they\'re based on. No black boxes.'
  },
  {
    title: 'Human-first design',
    description: 'The comeback stories, the reflections — this is about hope, not metrics.'
  }
]

export const TrustPrivacySection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-sand-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(15 23 42 / 0.05) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6"
          >
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Trust & Privacy</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4"
          >
            Your data.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Your choices.
            </span>
            {' '}Period.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-navy-600 max-w-3xl mx-auto"
          >
            We're not another EdTech company collecting everything and "promising" to keep it safe. Privacy is our foundation, not an afterthought.
          </motion.p>
        </div>

        {/* Privacy features grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {privacyFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative bg-white border border-navy-100 rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-medium group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-navy-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            )
          })}
        </div>

        {/* Trust principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white border border-navy-200 rounded-3xl p-8 md:p-12 shadow-large"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center shadow-medium">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-navy-900">
              Why we built this
            </h3>
          </div>

          <div className="space-y-6">
            {trustPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-sand-50 transition-colors duration-200"
              >
                <div className="mt-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-white"
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
                <div>
                  <h4 className="font-semibold text-navy-900 mb-1">
                    {principle.title}
                  </h4>
                  <p className="text-navy-600 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FERPA badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 pt-8 border-t border-navy-100"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-sand-100 border-2 border-sand-300 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-lg mb-1">
                    FERPA Compliant
                  </h4>
                  <p className="text-sm text-navy-600">
                    Full compliance with the Family Educational Rights and Privacy Act
                  </p>
                </div>
              </div>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-2 group"
              >
                Read our privacy policy
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-medium text-navy-800 italic max-w-4xl mx-auto">
            "Education technology should empower students, not surveil them."
          </blockquote>
          <p className="mt-4 text-navy-600">— The Momentum AI Team</p>
        </motion.div>
      </div>
    </section>
  )
}
