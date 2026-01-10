import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, Shield, Heart, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation, useSettingsStore } from '../../store/settingsStore'

const MobileNavBar = () => {
  const location = useLocation()
  const t = useTranslation()
  const darkMode = useSettingsStore((state) => state.darkMode)

  const navItems = [
    { icon: Home, label: t.home, path: '/' },
    { icon: FileText, label: t.summarize, path: '/summarize' },
    { icon: Shield, label: t.verify, path: '/verify' },
    { icon: Heart, label: t.sentiment, path: '/sentiment' },
    { icon: MoreHorizontal, label: t.more, path: '/more' },
  ]

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} border-t z-50 safe-area-pb`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] relative ${
                isActive ? 'text-primary-500' : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <item.icon className="w-6 h-6" />
              </motion.div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-1 w-1 h-1 bg-primary-500 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNavBar
