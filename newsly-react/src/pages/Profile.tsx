import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Bookmark, History, Settings, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation, useSettingsStore } from '../store/settingsStore'

const Profile = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const t = useTranslation()
  const darkMode = useSettingsStore(state => state.darkMode)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const sections = [
    {
      title: 'Your Files & History',
      items: [
        { icon: Bookmark, label: t.savedPosts || 'Saved Posts', path: '/saved', color: 'text-blue-500' },
        { icon: History, label: t.history, path: '/history', color: 'text-indigo-500' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Settings, label: t.settings, path: '/settings', color: 'text-gray-500' },
      ]
    }
  ]

  if (user?.isAdmin) {
    sections[1].items.push({ icon: Shield, label: 'Admin Dashboard', path: '/admin', color: 'text-red-500' })
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className={`p-6 rounded-3xl mb-8 shadow-md flex items-center gap-4 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-primary-100'}`}>
            <User className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-primary-600'}`} />
          </div>
          <div>
             <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.profile || 'Profile'}</h1>
             <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
          </div>
        </motion.div>

        {sections.map((section, sidx) => (
          <div key={sidx} className="mb-8">
            <h2 className={`text-sm font-semibold mb-3 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{section.title}</h2>
            <div className={`rounded-2xl overflow-hidden shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
              {section.items.map((item, idx) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-4 ${idx !== section.items.length - 1 ? (darkMode ? 'border-b border-slate-700' : 'border-b border-gray-100') : ''} ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className={`w-full flex justify-center items-center gap-2 py-4 rounded-xl font-medium shadow-sm transition-colors ${darkMode ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
        >
          <LogOut className="w-5 h-5" />
          {t.logout}
        </button>
      </div>
    </div>
  )
}

export default Profile
