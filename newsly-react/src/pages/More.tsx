import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Shield, Heart, Newspaper, History, User, Settings, HelpCircle, Info, Mail, Lock, Volume2 } from 'lucide-react'
import { useTranslation } from '../store/settingsStore'

const More = () => {
  const t = useTranslation()
  
  const menuItems = [
    { icon: FileText, label: t.summarizer, path: '/summarize', color: 'bg-blue-500' },
    { icon: Shield, label: t.fakeNewsDetector, path: '/verify', color: 'bg-red-500' },
    { icon: Heart, label: t.emotionAnalyzer, path: '/sentiment', color: 'bg-purple-500' },
    { icon: Newspaper, label: t.dailyBriefing, path: '/briefing', color: 'bg-green-500' },
    { icon: Volume2, label: t.textToSpeech, path: '/tts', color: 'bg-orange-500' },
    { icon: History, label: t.history, path: '/history', color: 'bg-indigo-500' },
    { icon: User, label: t.profile, path: '/login', color: 'bg-pink-500' },
    { icon: Settings, label: t.settings, path: '/settings', color: 'bg-gray-500' },
    { icon: Info, label: t.about, path: '/about', color: 'bg-cyan-500' },
    { icon: Mail, label: t.contact, path: '/contact', color: 'bg-teal-500' },
    { icon: HelpCircle, label: t.faq, path: '/faq', color: 'bg-amber-500' },
    { icon: Lock, label: t.privacy, path: '/privacy', color: 'bg-slate-500' },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-6"
        >
          {t.moreOptions}
        </motion.h1>
        
        <div className="grid grid-cols-3 gap-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-2`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 text-center">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default More
