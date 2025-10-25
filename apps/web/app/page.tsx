'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="px-6 py-4 flex justify-between items-center border-b">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-blue-600"
        >
          HireLoop
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4"
        >
          <Link href="/dashboard" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
          <Link href="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Get Started</Link>
        </motion.div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Recruitment <span className="text-blue-600">Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your hiring process with intelligent candidate screening, 
            automated evaluations, and data-driven insights.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/jobs" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
              Start Hiring
            </Link>
            <Link href="/about" className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition">
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <FeatureCard 
            title="AI Screening"
            description="Automatically screen resumes and rank candidates based on job requirements"
            icon="🤖"
          />
          <FeatureCard 
            title="Smart Evaluation"
            description="Conduct structured interviews with AI-assisted evaluation tools"
            icon="📊"
          />
          <FeatureCard 
            title="Data Insights"
            description="Get actionable insights to make better hiring decisions faster"
            icon="💡"
          />
        </motion.div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}
