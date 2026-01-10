import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Eye, Clock, Loader2, X, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from '../store/settingsStore'

interface Summary {
  id: number
  title: string
  summary_text: string
  method: string
  created_at: string
}

const History = () => {
  const t = useTranslation()
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setSummaries(data.summaries || [])
      } else if (res.status === 401) {
        toast.error('Please login to view history')
        navigate('/login')
      }
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this summary?')) return
    try {
      const res = await fetch(`/api/summary/${id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) {
        setSummaries(summaries.filter(s => s.id !== id))
        toast.success('Deleted successfully')
      }
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          {t.historyTitle}
        </motion.h1>

        {summaries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t.noHistory}</p>
            <button
              onClick={() => navigate('/summarize')}
              className="px-6 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition"
            >
              Create Your First Summary
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary, index) => (
              <motion.div
                key={summary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {summary.title || 'Untitled Summary'}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {summary.summary_text}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">{summary.method}</span>
                      <span>{new Date(summary.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedSummary(summary)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Eye className="w-5 h-5 text-gray-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(summary.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* View Summary Modal */}
      <AnimatePresence>
        {selectedSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSummary(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{selectedSummary.title || 'Summary'}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(selectedSummary.summary_text)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                  >
                    {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                  </button>
                  <button
                    onClick={() => setSelectedSummary(null)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">{selectedSummary.method}</span>
                  <span>{new Date(selectedSummary.created_at).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedSummary.summary_text}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default History