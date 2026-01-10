import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, Bell, Moon, Globe, Lock, Trash2, Save, Volume2, History, AlertTriangle, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSettingsStore, useTranslation } from '../store/settingsStore'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const navigate = useNavigate()
  const t = useTranslation()
  const { isAuthenticated, logout } = useAuthStore()
  
  const {
    notifications,
    darkMode,
    language,
    summaryLength,
    autoPlayTTS,
    setNotifications,
    setDarkMode,
    setLanguage,
    setSummaryLength,
    setAutoPlayTTS,
  } = useSettingsStore()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success(t.settingsSaved)
  }

  const handleDeleteAccount = () => {
    logout()
    setShowDeleteModal(false)
    toast.success(t.accountDeleted)
    navigate('/')
  }

  const handleClearHistory = () => {
    // Clear history from localStorage
    localStorage.removeItem('newsly-history')
    setShowClearHistoryModal(false)
    toast.success(t.historyCleared)
  }

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode)
    toast(darkMode ? '☀️ Light mode enabled' : '🌙 Dark mode enabled')
  }

  const handleNotificationToggle = () => {
    setNotifications(!notifications)
    if (!notifications) {
      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toast.success('Notifications enabled!')
          }
        })
      }
    }
    toast(notifications ? '🔕 Notifications disabled' : '🔔 Notifications enabled')
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <SettingsIcon className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.settings}</h1>
          <p className="text-gray-600">{t.customize}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Notifications */}
          <div className="p-6 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Bell className={`w-6 h-6 ${notifications ? 'text-blue-600' : 'text-gray-400'}`} />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.notifications}</h3>
                  <p className="text-sm text-gray-500">{t.notificationsDesc}</p>
                </div>
              </div>
              <button
                onClick={handleNotificationToggle}
                className={`w-14 h-8 rounded-full transition-colors relative ${notifications ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <motion.div
                  animate={{ x: notifications ? 24 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow absolute top-1"
                />
              </button>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="p-6 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Moon className={`w-6 h-6 ${darkMode ? 'text-purple-600' : 'text-gray-400'}`} />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.darkMode}</h3>
                  <p className="text-sm text-gray-500">{t.darkModeDesc}</p>
                </div>
              </div>
              <button
                onClick={handleDarkModeToggle}
                className={`w-14 h-8 rounded-full transition-colors relative ${darkMode ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <motion.div
                  animate={{ x: darkMode ? 24 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow absolute top-1"
                />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="p-6 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Globe className="w-6 h-6 text-green-600" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.language}</h3>
                  <p className="text-sm text-gray-500">{t.languageDesc}</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as 'en' | 'hi')
                  toast.success(e.target.value === 'en' ? 'Language changed to English' : 'भाषा हिंदी में बदल गई')
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white cursor-pointer"
              >
                <option value="en">🇬🇧 {t.english}</option>
                <option value="hi">🇮🇳 {t.hindi}</option>
              </select>
            </div>
          </div>

          {/* Summary Length */}
          <div className="p-6 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <SettingsIcon className="w-6 h-6 text-orange-600" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-gray-800">{t.summaryLength}</h3>
                <p className="text-sm text-gray-500">{t.summaryLengthDesc}</p>
              </div>
            </div>
            <div className="flex gap-3 ml-16">
              {(['short', 'medium', 'long'] as const).map((len) => (
                <motion.button
                  key={len}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSummaryLength(len)
                    toast.success(`Summary length set to ${len}`)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    summaryLength === len
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t[len]}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Auto TTS */}
          <div className="p-6 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Volume2 className={`w-6 h-6 ${autoPlayTTS ? 'text-cyan-600' : 'text-gray-400'}`} />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.autoTTS}</h3>
                  <p className="text-sm text-gray-500">{t.autoTTSDesc}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAutoPlayTTS(!autoPlayTTS)
                  toast(autoPlayTTS ? '🔇 Auto TTS disabled' : '🔊 Auto TTS enabled')
                }}
                className={`w-14 h-8 rounded-full transition-colors relative ${autoPlayTTS ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <motion.div
                  animate={{ x: autoPlayTTS ? 24 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow absolute top-1"
                />
              </button>
            </div>
          </div>

          {/* Clear History */}
          <div className="p-6 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <History className="w-6 h-6 text-yellow-600" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.clearHistory}</h3>
                  <p className="text-sm text-gray-500">{t.clearHistoryDesc}</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowClearHistoryModal(true)}
                className="px-4 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition font-medium"
              >
                Clear
              </motion.button>
            </div>
          </div>

          {/* Privacy */}
          <div className="p-6 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Lock className="w-6 h-6 text-indigo-600" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.privacy}</h3>
                  <p className="text-sm text-gray-500">{t.privacyDesc}</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/privacy')}
                className="px-4 py-2 text-primary-500 hover:bg-primary-50 rounded-lg transition font-medium"
              >
                {t.manage}
              </motion.button>
            </div>
          </div>

          {/* Delete Account */}
          {isAuthenticated && (
            <div className="p-6 hover:bg-red-50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{t.deleteAccount}</h3>
                    <p className="text-sm text-gray-500">{t.deleteAccountDesc}</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-red-500 hover:bg-red-100 rounded-lg transition font-medium"
                >
                  {t.delete}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t.saveSettings}
            </>
          )}
        </motion.button>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{t.deleteAccount}</h3>
              </div>
              <p className="text-gray-600 mb-6">{t.deleteConfirm}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
                >
                  {t.delete}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear History Modal */}
      <AnimatePresence>
        {showClearHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowClearHistoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <History className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{t.clearHistory}</h3>
              </div>
              <p className="text-gray-600 mb-6">This will permanently delete all your summarization history. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearHistoryModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Settings
