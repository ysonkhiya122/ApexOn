import { motion } from 'framer-motion'
import { Layout } from '../components/Layout'
import { Counter } from '../components/Counter'

export function HomePage() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-blue-500">ApexOn</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            A modern Formula 1 digital platform for beginners and hardcore fans, combining
            schedules, results, rules, history, team radio, AI assistance, and interactive
            fan experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Live Schedules"
            description="Get real-time updates on race schedules and practice sessions"
            icon="📅"
          />
          <FeatureCard
            title="Race Results"
            description="Track detailed results, standings, and performance analytics"
            icon="🏁"
          />
          <FeatureCard
            title="AI Insights"
            description="Get AI-powered analysis and predictions for races"
            icon="🤖"
          />
        </div>

        {/* Counter Example */}
        <div className="flex justify-center py-12">
          <Counter />
        </div>

        {/* Tech Stack Section */}
        <div className="bg-slate-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Powered By</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'React 19',
              'Vite',
              'TypeScript',
              'Tailwind CSS',
              'Redux Toolkit',
              'React Router',
              'Framer Motion',
              'Lucide Icons',
            ].map((tech) => (
              <div
                key={tech}
                className="bg-slate-700 rounded-lg p-4 text-center text-gray-300 hover:bg-slate-600 transition-colors"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}
