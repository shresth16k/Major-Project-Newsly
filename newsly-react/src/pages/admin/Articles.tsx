import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Eye, Trash2, RefreshCw, Calendar, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface Summary {
  id: number
  title: string
  summary_text: string
  method: string
  created_at: string
  user_id: number
}

const Articles = () => {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)

  const fetchSummaries = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/summaries', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setSummaries(data.summaries || [])
      } else {
        toast.error('Failed to fetch summaries')
      }
    } catch (error) {
      toast.error('Failed to fetch summaries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaries()
  }, [])

  const deleteSummary = async (summaryId: number) => {
    if (!confirm('Are you sure you want to delete this summary?')) return
    
    try {
      const res = await fetch(`/api/summary/${summaryId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (res.ok) {
        setSummaries(summaries.filter(s => s.id !== summaryId))
        toast.success('Summary deleted successfully')
      } else {
        toast.error('Failed to delete summary')
      }
    } catch (error) {
      toast.error('Failed to delete summary')
    }
  }

  const filteredSummaries = summaries

  const methodColors = {
    transformer: 'bg-blue-100 text-blue-800',
    extractive: 'bg-green-100 text-green-800',
    sumy: 'bg-purple-100 text-purple-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Articles & Summaries</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage all user-generated summaries</p>
          </div>
          <button
            onClick={fetchSummaries}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{summaries.length}</div>
                <div className="text-sm text-gray-500">Total Summaries</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {summaries.filter(s => {
                    const today = new Date().toDateString()
                    return new Date(s.created_at).toDateString() === today
                  }).length}
                </div>
                <div className="text-sm text-gray-500">Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summaries Grid */}
        <div className="grid gap-6">
          {filteredSummaries.map((summary, index) => (
            <motion.div
              key={summary.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {summary.title || 'Untitled Summary'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      User ID: {summary.user_id}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(summary.created_at).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      methodColors[summary.method as keyof typeof methodColors] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {summary.method}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSummary(summary)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View summary"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSummary(summary.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete summary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {summary.summary_text}
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Length: {summary.summary_text?.length || 0} characters
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSummaries.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No summaries found</h3>
            <p className="text-gray-500">
              No summaries have been created yet.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading summaries...</p>
          </div>
        )}
      </div>

      {/* Summary Detail Modal */}
      {selectedSummary && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedSummary.title || 'Untitled Summary'}
                </h2>
                <button
                  onClick={() => setSelectedSummary(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>User ID: {selectedSummary.user_id}</span>
                <span>{new Date(selectedSummary.created_at).toLocaleString()}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  methodColors[selectedSummary.method as keyof typeof methodColors] || 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedSummary.method}
                </span>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedSummary.summary_text}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Articles