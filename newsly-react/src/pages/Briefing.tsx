import { useState, useEffect } from 'react'
import { Newspaper, Clock, TrendingUp, Star, RefreshCw, Loader2, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTranslation } from '../store/settingsStore'

interface NewsItem {
  id: string
  title: string
  summary: string
  category: string
  trustScore: number
  sentiment: string
  readTime: string
  source: string
  isCurated: boolean
  createdAt?: string
}

interface BriefingResponse {
  news: NewsItem[]
  lastUpdated: string
  totalItems: number
}

const Briefing = () => {
  const t = useTranslation()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchBriefing = async (showRefreshToast = false) => {
    try {
      const res = await fetch('/api/briefing', {
        credentials: 'include',
      })
      const data: BriefingResponse = await res.json()
      
      if (res.ok) {
        setNews(data.news)
        setLastUpdated(data.lastUpdated)
        if (showRefreshToast) {
          toast.success(`Updated! ${data.totalItems} stories loaded`)
        }
      } else {
        toast.error('Failed to load briefing')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBriefing()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchBriefing(true)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.briefingTitle}</h1>
          <p className="text-gray-600">{t.briefingSubtitle}</p>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:shadow-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your briefing...</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {news.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                      item.isCurated 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                    }`}>
                      {item.isCurated ? index + 1 : <User className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {item.category}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
                          item.trustScore >= 90 ? 'bg-green-100 text-green-700' :
                          item.trustScore >= 70 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          <Star className="w-3 h-3" /> {item.trustScore}%
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          item.sentiment === 'Positive' ? 'bg-blue-100 text-blue-700' :
                          item.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.sentiment}
                        </span>
                        {!item.isCurated && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                            Your Summary
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.summary}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {item.readTime}
                        </span>
                        <span>{item.source}</span>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {!loading && news.length === 0 && (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No news available. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Briefing