import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Link as LinkIcon, Upload, Loader2, Sparkles, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation, useSettingsStore } from '../store/settingsStore'

const Summarize = () => {
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { summaryLength, setSummaryLength } = useSettingsStore()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'pdf'>('text')
  const navigate = useNavigate()
  const t = useTranslation()
  const darkMode = useSettingsStore((state) => state.darkMode)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput && !urlInput && !file) {
      toast.error('Please provide text, URL, or upload a PDF')
      return
    }

    setLoading(true)
    const formData = new FormData()
    if (activeTab === 'text' && textInput) formData.append('text_input', textInput)
    if (activeTab === 'url' && urlInput) formData.append('url_input', urlInput)
    if (activeTab === 'pdf' && file) formData.append('file_input', file)
    formData.append('summary_length', summaryLength)

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Summary generated!')
        navigate('/result', { state: data })
      } else {
        toast.error(data.error || 'Summarization failed')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'url', label: 'URL', icon: LinkIcon },
    { id: 'pdf', label: 'PDF', icon: Upload },
  ] as const

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'url(/images/sm.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          {/* Header */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
              whileHover={{ rotate: 10, scale: 1.1 }}
              animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 20px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0.4)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800">{t.summarizer}</h2>
            <p className="text-gray-500 mt-2">{t.summarizerDesc}</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id ? 'bg-white text-primary-500 shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'text' && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <label className="block font-semibold text-gray-700 mb-2">Enter Text</label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your article, news, or any text here..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all bg-white/80"
                  />
                  <p className="text-sm text-gray-400 mt-2">{textInput.length} characters</p>
                </motion.div>
              )}

              {activeTab === 'url' && (
                <motion.div
                  key="url"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <label className="block font-semibold text-gray-700 mb-2">Enter URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/article"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/80"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">We'll extract and summarize the article content</p>
                </motion.div>
              )}

              {activeTab === 'pdf' && (
                <motion.div
                  key="pdf"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <label className="block font-semibold text-gray-700 mb-2">Upload PDF</label>
                  <motion.label
                    whileHover={{ scale: 1.02, borderColor: '#3b82f6' }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      file ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {file ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <span className="font-medium text-green-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setFile(null) }}
                          className="mt-2 text-sm text-red-500 hover:text-red-600 flex items-center gap-1 mx-auto"
                        >
                          <X className="w-4 h-4" /> Remove
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <span className="font-medium text-gray-700">Click to upload PDF</span>
                        <span className="text-sm text-gray-400 mt-1">or drag and drop</span>
                      </>
                    )}
                    <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                  </motion.label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Length Selector */}
            <div>
              <label className="block font-semibold text-gray-700 mb-3">{t.summaryLength}</label>
              <div className="grid grid-cols-3 gap-3">
                {(['short', 'medium', 'long'] as const).map((len) => (
                  <motion.button
                    key={len}
                    type="button"
                    onClick={() => setSummaryLength(len)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 rounded-xl font-medium capitalize transition-all ${
                      summaryLength === len
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t[len]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(59,130,246,0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.generateSummary}
                  </>
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate('/history')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                {t.history}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Summarize