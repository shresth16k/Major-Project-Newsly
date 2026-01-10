import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building, Trophy, Cpu, Heart, Briefcase, DollarSign, Film } from 'lucide-react'
import { useTranslation } from '../store/settingsStore'

const Categories = () => {
  const t = useTranslation()

  const categories = [
    { 
      key: 'politics', 
      label: t.politics, 
      icon: Building, 
      color: 'from-blue-500 to-indigo-500',
      emoji: '🏛️',
      description: 'Stay informed with the latest political news and policy updates'
    },
    { 
      key: 'sports', 
      label: t.sports, 
      icon: Trophy, 
      color: 'from-green-500 to-emerald-500',
      emoji: '⚽',
      description: 'Get the latest scores, highlights, and sports analysis'
    },
    { 
      key: 'technology', 
      label: t.technology, 
      icon: Cpu, 
      color: 'from-purple-500 to-violet-500',
      emoji: '💻',
      description: 'Discover innovations and breakthroughs in technology'
    },
    { 
      key: 'health', 
      label: t.health, 
      icon: Heart, 
      color: 'from-red-500 to-pink-500',
      emoji: '🏥',
      description: 'Medical breakthroughs, wellness tips, and healthcare news'
    },
    { 
      key: 'business', 
      label: t.business, 
      icon: Briefcase, 
      color: 'from-amber-500 to-orange-500',
      emoji: '💼',
      description: 'Track market trends, corporate news, and business insights'
    },
    { 
      key: 'finance', 
      label: t.finance, 
      icon: DollarSign, 
      color: 'from-emerald-500 to-teal-500',
      emoji: '💰',
      description: 'Stay updated on markets, investments, and financial strategies'
    },
    { 
      key: 'entertainment', 
      label: t.entertainment, 
      icon: Film, 
      color: 'from-pink-500 to-rose-500',
      emoji: '🎬',
      description: 'Your guide to movies, music, celebrities, and pop culture'
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            {t.categories}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Explore news by category and stay informed about the topics that matter most to you
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link
                  to={`/category/${category.key}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-32 sm:h-40 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl mb-2">{category.emoji}</div>
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto opacity-80" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 sm:p-8 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Can't find what you're looking for?
            </h2>
            <p className="text-primary-100 mb-4 text-sm sm:text-base">
              Use our AI-powered summarization tool to get insights from any article or text
            </p>
            <Link
              to="/summarize"
              className="inline-block bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Summarizer
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Categories