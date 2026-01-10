import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Loader2, XCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTranslation } from '../store/settingsStore'

interface VerifyResult {
  score: number
  verdict: string
  reasons: string[]
  indicators: {
    clickbait_phrases: number
    credibility_phrases: number
    excessive_punctuation: number
    caps_words: number
  }
}

const Verify = () => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)
  const t = useTranslation()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || input.length < 10) {
      toast.error('Please enter at least 10 characters')
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      const res = await fetch('/api/verify', {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    if (score >= 40) return 'bg-orange-100'
    return 'bg-red-100'
  }

  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-10 h-10 text-green-600" />
    if (score >= 60) return <Info className="w-10 h-10 text-yellow-600" />
    if (score >= 40) return <AlertTriangle className="w-10 h-10 text-orange-600" />
    return <XCircle className="w-10 h-10 text-red-600" />
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            whileHover={{ rotate: 10, scale: 1.1 }}
            animate={{ boxShadow: ['0 0 0 0 rgba(239,68,68,0.4)', '0 0 0 20px rgba(239,68,68,0)', '0 0 0 0 rgba(239,68,68,0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.fakeNewsDetector}</h1>
          <p className="text-gray-600">{t.verifySubtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6"
        >
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Enter text to verify</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste a headline, article text, or news content to verify its credibility..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none transition-all"
              />
              <p className="text-sm text-gray-400 mt-1">{input.length} characters</p>
            </div>
            
            <motion.button
              type="submit"
              disabled={loading || input.length < 10}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify Now
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
                {/* Score Card */}
                <div className={`p-6 rounded-xl ${getScoreBg(result.score)} mb-6`}>
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className={`w-20 h-20 rounded-full ${getScoreBg(result.score)} flex items-center justify-center`}
                    >
                      {getIcon(result.score)}
                    </motion.div>
                    <div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-4xl font-bold ${getScoreColor(result.score)}`}
                      >
                        {result.score}%
                      </motion.div>
                      <div className={`font-semibold text-lg ${getScoreColor(result.score)}`}>
                        {result.verdict}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicators */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Clickbait Phrases', value: result.indicators.clickbait_phrases, bad: true },
                    { label: 'Credibility Phrases', value: result.indicators.credibility_phrases, bad: false },
                    { label: 'Excessive Punctuation', value: result.indicators.excessive_punctuation, bad: true },
                    { label: 'ALL CAPS Words', value: result.indicators.caps_words, bad: true },
                  ].map((ind, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <div className="text-sm text-gray-500">{ind.label}</div>
                      <div className={`text-2xl font-bold ${ind.bad ? (ind.value > 0 ? 'text-red-500' : 'text-green-500') : (ind.value > 0 ? 'text-green-500' : 'text-gray-400')}`}>
                        {ind.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Reasons */}
                <h3 className="font-semibold text-gray-800 mb-3">Analysis Details:</h3>
                <ul className="space-y-2">
                  {result.reasons.map((reason, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      {reason}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Verify