import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const testimonials = [
  {
    quote: "I was failing calculus and thought I'd have to drop out. The weekly check-ins helped me realize it wasn't just about math — I was burnt out. The AI study guides actually made sense for how I learn.",
    author: "Sarah M.",
    role: "11th Grade Student",
    school: "Atlanta Metro Area",
    rating: 5,
    highlight: "From D to B+ in one semester"
  },
  {
    quote: "As a teacher, I was skeptical of 'another EdTech tool.' But this one actually helps my students without adding surveillance. I can see who's struggling without invading their privacy.",
    author: "Mr. Johnson",
    role: "AP Calculus Teacher",
    school: "Public High School, GA",
    rating: 5,
    highlight: "Student engagement up 40%"
  },
  {
    quote: "The comeback stories section literally saved me. Knowing other kids went through the same panic and made it out — that's what kept me going when I wanted to quit.",
    author: "Marcus T.",
    role: "12th Grade Student",
    school: "Rural Georgia",
    rating: 5,
    highlight: "Now headed to Georgia Tech"
  }
]

export const TestimonialsSection = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/login')
  }

  const handleScheduleDemo = () => {
    // Scroll to contact or open contact form
    window.scrollTo({ top: 0, behavior: 'smooth' })
    alert('Demo scheduling coming soon! For now, please sign up to try Momentum AI.')
  }

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

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
            <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
            <span className="text-sm font-medium text-navy-700">Testimonials</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4"
          >
            Real students.{' '}
            <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
              Real results.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-navy-600 max-w-3xl mx-auto"
          >
            Hear from students and teachers using Momentum AI across Georgia
          </motion.p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative bg-white border border-navy-100 rounded-2xl p-8 shadow-soft hover:shadow-large transition-all duration-300 group"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-blue-500 fill-blue-500"
                  />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="text-navy-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Highlight badge */}
              <div className="mb-6 inline-block">
                <span className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-lg">
                  {testimonial.highlight}
                </span>
              </div>

              {/* Author info */}
              <div className="border-t border-navy-100 pt-6">
                <div className="font-semibold text-navy-900 mb-1">
                  {testimonial.author}
                </div>
                <div className="text-sm text-navy-600">
                  {testimonial.role}
                </div>
                <div className="text-xs text-navy-500 mt-1">
                  {testimonial.school}
                </div>
              </div>

              {/* Hover gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 grid md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-navy-900 mb-2">
              2,000+
            </div>
            <div className="text-navy-600">Active Students</div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-navy-900 mb-2">
              150+
            </div>
            <div className="text-navy-600">Partner Teachers</div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-navy-900 mb-2">
              12K+
            </div>
            <div className="text-navy-600">Study Guides Generated</div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-2">
              4.9/5
            </div>
            <div className="text-navy-600">Student Rating</div>
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 text-center bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-12 shadow-large"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to build your momentum?
          </h3>
          <p className="text-navy-200 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students turning academic spirals into comeback stories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-navy-900 font-semibold rounded-xl hover:bg-sand-50 shadow-medium hover:shadow-large transition-all duration-300"
            >
              Get Started Free
            </button>
            <button
              onClick={handleScheduleDemo}
              className="px-8 py-4 bg-navy-700 text-white font-semibold rounded-xl hover:bg-navy-600 border border-navy-600 transition-all duration-300"
            >
              Schedule a Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
