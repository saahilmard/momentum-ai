import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, Brain, Users, Target, ArrowRight, Zap, Shield } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'

const Landing = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-time Momentum Tracking',
      description: 'Monitor student academic momentum in real-time using advanced PDEs and mathematical models.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Brain,
      title: 'Collapse Forecasting',
      description: 'Predict academic difficulties 30+ days in advance using catastrophe theory and stochastic dynamics.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Personalized Interventions',
      description: 'AI-driven support strategies optimized via reinforcement learning for each student.',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const stats = [
    { value: '85%', label: 'Prediction Accuracy' },
    { value: '30+', label: 'Days Early Warning' },
    { value: '10', label: 'Key Indicators' },
  ]

  const steps = [
    { number: '01', title: 'Take Survey', description: '10-question assessment of psychological and academic state' },
    { number: '02', title: 'Analyze Data', description: 'Advanced mathematical models calculate momentum and risk' },
    { number: '03', title: 'Receive Support', description: 'Personalized interventions and study strategies' },
  ]

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Predict Academic Success</span>
              <br />
              <span className="text-slate-800 dark:text-slate-200">with AI-Powered Momentum</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
          >
            Momentum AI uses advanced mathematics—PDEs, catastrophe theory, and reinforcement learning—to
            forecast academic collapse and provide proactive interventions before students fall behind.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/dashboard">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/forecast/STU001">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-8 justify-center pt-10"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass rounded-xl px-8 py-4"
              >
                <div className="text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Powered by Advanced Mathematics
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Not just machine learning—real mathematical theory from dynamical systems and stochastic calculus
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <GlassCard className="h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Three simple steps to transform student outcomes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <GlassCard className="relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl font-bold text-primary-100 dark:text-primary-900/20 -mr-4 -mt-8">
                  {step.number}
                </div>
                <div className="relative z-10">
                  <div className="text-primary-600 dark:text-primary-400 font-bold text-sm mb-2">
                    STEP {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Highlights */}
      <section className="max-w-7xl mx-auto">
        <GlassCard className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 dark:from-primary-900/20 dark:to-purple-900/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Built on Rigorous Theory
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: 'Heat Equation PDEs for momentum modeling' },
                  { icon: Target, text: 'Catastrophe Theory for tipping point detection' },
                  { icon: Brain, text: 'Stochastic Differential Equations for uncertainty' },
                  { icon: Shield, text: 'Bayesian Inference for adaptive learning' },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
            <div className="relative">
              <div className="glass-strong rounded-2xl p-8 space-y-4">
                <div className="text-sm font-mono text-primary-600 dark:text-primary-400">
                  ∂M/∂t = α∇²M + β·P(x,t) + γ·A(x,t)
                </div>
                <div className="text-sm font-mono text-purple-600 dark:text-purple-400">
                  V(x,a,b) = ¼x⁴ + ½ax² + bx
                </div>
                <div className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  dM = μ(M,A,P)dt + σdW_t
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Real mathematics, not just buzzwords. Every equation is implemented and validated.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto text-center">
        <GlassCard className="bg-gradient-to-br from-primary-500/20 to-indigo-500/20 dark:from-primary-900/30 dark:to-indigo-900/30">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to help your students succeed?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Join schools using Momentum AI to identify at-risk students early and provide targeted support
            before it's too late.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </GlassCard>
      </section>
    </div>
  )
}

export default Landing
