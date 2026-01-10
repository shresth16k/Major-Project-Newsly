import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Shield, Heart, Volume2, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useTranslation, useSettingsStore } from '../../store/settingsStore'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const t = useTranslation()
  const darkMode = useSettingsStore((state) => state.darkMode)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const categories = [
    { key: 'politics', label: t.politics },
    { key: 'sports', label: t.sports },
    { key: 'technology', label: t.technology },
    { key: 'health', label: t.health },
    { key: 'business', label: t.business },
    { key: 'finance', label: t.finance },
    { key: 'entertainment', label: t.entertainment },
  ]
  
  const tools = [
    { label: t.fakeNewsDetector, path: '/verify', icon: Shield },
    { label: t.emotionAnalyzer, path: '/sentiment', icon: Heart },
    { label: t.textToSpeech, path: '/tts', icon: Volume2 },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? darkMode ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-lg' 
          : darkMode ? 'bg-slate-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex-shrink-0">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/images/logo.png"
              alt="Newsly"
              className="h-20 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            <NavLink to="/">{t.home}</NavLink>
            <NavLink to="/about">{t.about}</NavLink>
            
            <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
              <button className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-200 hover:text-primary-400' : 'text-gray-700 hover:text-primary-500'} font-semibold text-lg py-2 transition-colors`}>
                {t.tools} <ChevronDown className={`w-5 h-5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-0 mt-2 w-56 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} rounded-xl shadow-xl border py-2 overflow-hidden`}
                  >
                    {tools.map((tool, i) => (
                      <motion.div
                        key={tool.path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={tool.path}
                          className={`flex items-center gap-3 px-4 py-3 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-primary-50'} transition-colors`}
                        >
                          <tool.icon className="w-5 h-5 text-primary-500" />
                          <span className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>{tool.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
              <button className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-200 hover:text-primary-400' : 'text-gray-700 hover:text-primary-500'} font-semibold text-lg py-2 transition-colors`}>
                {t.categories} <ChevronDown className={`w-5 h-5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-0 mt-2 w-48 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} rounded-xl shadow-xl border py-2`}
                  >
                    {categories.map((cat, i) => (
                      <motion.div
                        key={cat.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link
                          to={`/category/${cat.key}`}
                          className={`block px-4 py-2 ${darkMode ? 'hover:bg-slate-700 text-gray-200' : 'hover:bg-primary-50 text-gray-700'} transition-colors`}
                        >
                          {cat.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/privacy">{t.privacy}</NavLink>
            <NavLink to="/contact">{t.contact}</NavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-full`}>
                  <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{user?.email?.split('@')[0]}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { logout(); navigate('/') }}
                  className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'} rounded-full transition-colors`}
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {t.login}
                </Link>
              </motion.div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'} border-t overflow-hidden`}
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { label: t.home, path: '/' },
                { label: t.about, path: '/about' },
                { label: t.categories, path: '/categories' },
                { label: t.fakeNewsDetector, path: '/verify' },
                { label: t.emotionAnalyzer, path: '/sentiment' },
                { label: t.textToSpeech, path: '/tts' },
                { label: t.privacy, path: '/privacy' },
                { label: t.contact, path: '/contact' },
              ].map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={item.path} className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-gray-200 hover:text-primary-400 hover:bg-slate-800' : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'}`}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Login/Logout Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-gray-200 dark:border-gray-600"
              >
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                      <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {user?.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={() => { logout(); navigate('/') }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block py-2.5 px-3 bg-primary-500 text-white rounded-lg text-center font-medium text-sm hover:bg-primary-600 transition-colors"
                  >
                    {t.login}
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation()
  const isActive = location.pathname === to
  const darkMode = useSettingsStore((state) => state.darkMode)

  return (
    <Link
      to={to}
      className={`relative font-semibold text-lg py-2 transition-colors ${
        isActive 
          ? 'text-primary-500' 
          : darkMode ? 'text-gray-200 hover:text-primary-400' : 'text-gray-700 hover:text-primary-500'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
        />
      )}
    </Link>
  )
}

export default Header
