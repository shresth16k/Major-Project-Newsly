import { motion } from 'framer-motion'
import { Target, Users, Zap, Shield } from 'lucide-react'
import { useTranslation } from '../store/settingsStore'

const About = () => {
  const t = useTranslation()
  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t.aboutTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to make news consumption smarter, faster, and more reliable.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To democratize access to accurate, summarized news using cutting-edge AI technology.' },
            { icon: Users, title: 'Our Team', desc: 'A passionate group of AI researchers, journalists, and developers working together.' },
            { icon: Zap, title: 'Our Technology', desc: 'State-of-the-art NLP models that understand context and deliver accurate summaries.' },
            { icon: Shield, title: 'Our Promise', desc: 'Commitment to accuracy, transparency, and fighting misinformation.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Join 3 Million+ Users</h2>
          <p className="text-white/90 mb-6">Experience the future of news consumption today.</p>
          <a href="/signup" className="inline-block px-8 py-3 bg-white text-primary-500 rounded-full font-semibold hover:bg-gray-100 transition">
            Get Started Free
          </a>
        </div>
      </div>
    </div>
  )
}

export default About