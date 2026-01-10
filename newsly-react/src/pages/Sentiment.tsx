import { useState } from 'react'
import { Heart, Smile, Meh, Frown, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTranslation } from '../store/settingsStore'

interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative'
  confidence: number
  emotions: { name: string; value: number }[]
}

const Sentiment = () => {
  const t = useTranslation()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SentimentResult | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || input.length < 10) {
      toast.error('Please enter at least 10 characters')
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      const res = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: input }),
      })
      const data = await res.json()
      
      if (res.ok) {
        setResult(data)
      } else {
        toast.error(data.error || 'Analysis failed')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentIcon = () => {
    if (!result) return null
    switch (result.sentiment) {
      case 'positive': return <Smile className="w-14 h-14 text-green-500" />
      case 'neutral': return <Meh className="w-14 h-14 text-gray-500" />
      case 'negative': return <Frown className="w-14 h-14 text-red-500" />
    }
  }

  const getSentimentColor = () => {
    if (!result) return ''
    switch (result.sentiment) {
      case 'positive': return 'from-green-400 to-emerald-500'
      case 'neutral': return 'from-gray-400 to-gray-500'
      case 'negative': return 'from-red-400 to-rose-500'
    }
  }

  const getSentimentBg = () => {
    if (!result) return ''
    switch (result.sentiment) {
      case 'positive': return 'bg-green-50'
      case 'neutral': return 'bg-gray-50'
      case 'negative': return 'bg-red-50'
    }
  }

  const getEmotionColor = (name: string) => {
    const colors: Record<string, string> = {
      'Joy': 'from-yellow-400 to-orange-400',
      'Trust': 'from-blue-400 to-cyan-400',
      'Fear': 'from-purple-400 to-violet-500',
      'Surprise': 'from-pink-400 to-rose-400',
      'Sadness': 'from-indigo-400 to-blue-500',
      'Anger': 'from-red-500 to-orange-500',
    }
    return colors[name] || 'from-gray-400 to-gray-500'
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            whileHover={{ rotate: -10, scale: 1.1 }}
            animate={{ boxShadow: ['0 0 0 0 rgba(168,85,247,0.4)', '0 0 0 20px rgba(168,85,247,0)', '0 0 0 0 rgba(168,85,247,0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.sentimentTitle}</h1>
          <p className="text-gray-600">{t.sentimentSubtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6"
        >
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Enter text to analyze</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste any text - news article, social media post, review, or message - to analyze its emotional tone..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all"
              />
              <p className="text-sm text-gray-400 mt-1">{input.length} characters</p>
            </div>
            
            <motion.button
              type="submit"
              disabled={loading || input.length < 10}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing emotions...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  {t.analyzeSentiment}
                </>
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="mt-8"
              >
                {/* Main Sentiment Card */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`p-6 rounded-xl ${getSentimentBg()} mb-6`}
                >
                  <div className="flex items-center gap-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className={`w-24 h-24 rounded-full bg-gradient-to-br ${getSentimentColor()} flex items-center justify-center shadow-lg`}
                    >
                      {getSentimentIcon()}
                    </motion.div>
                    <div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-gray-800 capitalize"
                      >
                        {result.sentiment}
                      </motion.div>
                      <div className="text-gray-600 text-lg">{result.confidence}% confidence</div>
                      <div className="mt-2">
                        <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className={`h-full bg-gradient-to-r ${getSentimentColor()} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Emotion Breakdown */}
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">Emotion Breakdown</h3>
                <div className="space-y-4">
                  {result.emotions.map((emotion, i) => (
                    <motion.div
                      key={emotion.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{emotion.name}</span>
                        <span className="text-gray-500">{emotion.value}%</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${emotion.value}%` }}
                          transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                          className={`h-full bg-gradient-to-r ${getEmotionColor(emotion.name)} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Emotion Summary */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 p-4 bg-purple-50 rounded-xl"
                >
                  <p className="text-purple-800 text-sm">
                    <strong>Analysis Summary:</strong> This text has a predominantly{' '}
                    <span className="font-semibold">{result.sentiment}</span> tone with{' '}
                    <span className="font-semibold">{result.emotions[0]?.name}</span> being the dominant emotion.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Sentiment