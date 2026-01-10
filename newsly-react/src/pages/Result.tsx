import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Check, Share2, Sparkles, FileText, Square } from 'lucide-react'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from '../store/settingsStore'

const Result = () => {
  const t = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  
  const { summary, original_text, method } = location.state || {}

  if (!summary) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No summary data found</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/summarize')}
            className="px-6 py-3 bg-primary-500 text-white rounded-full font-semibold"
          >
            Go to Summarize
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Newsly Summary', text: summary })
    } else {
      handleCopy()
    }
  }

  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      toast.error('Text-to-speech not supported in this browser')
      return
    }

    if (isMuted) {
      // Start speaking
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(summary)
      
      // Try to find Indian English voice
      const voices = window.speechSynthesis.getVoices()
      const indianVoice = voices.find(v => 
        v.lang === 'en-IN' || 
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('hindi')
      )
      if (indianVoice) {
        utterance.voice = indianVoice
      }
      utterance.lang = 'en-IN' // Set Indian English
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => { 
        setIsSpeaking(false)
        setIsMuted(true)
      }
      utterance.onerror = () => { 
        setIsSpeaking(false)
        setIsMuted(true)
      }
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsMuted(false)
      toast.success('🔊 Playing summary in Indian English...')
    } else {
      // Stop speaking
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsMuted(true)
      toast('🔇 Audio stopped')
    }
  }

  const stopSpeech = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsMuted(true)
  }

  const wordCount = summary.split(/\s+/).length
  const originalWordCount = original_text?.split(/\s+/).length || 0
  const reduction = originalWordCount > 0 ? Math.round((1 - wordCount / originalWordCount) * 100) : 0

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => { stopSpeech(); navigate('/summarize') }}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          {t.backToSummarize}
        </motion.button>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: 'Words Reduced', value: `${reduction}%`, color: 'text-green-600' },
            { label: 'Summary Words', value: wordCount, color: 'text-blue-600' },
            { label: 'Method', value: method, color: 'text-purple-600' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-xl font-bold">{t.aiSummary}</h2>
                </div>
                <div className="flex gap-2">
                  {/* Text-to-Speech Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSpeech}
                    className={`p-2 rounded-lg transition relative ${
                      isMuted ? 'bg-white/20 hover:bg-white/30' : 'bg-green-500 hover:bg-green-600'
                    }`}
                    title={isMuted ? 'Click to play audio' : 'Click to stop audio'}
                  >
                    <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
                    {isSpeaking && (
                      <motion.span
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                  {isSpeaking && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={stopSpeech}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                      title="Stop"
                    >
                      <Square className="w-5 h-5 text-white fill-white" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                  >
                    {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg"
              >
                {summary}
              </motion.p>
            </div>
          </motion.div>

          {/* Original Text Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-bold text-gray-800">{t.originalText}</h2>
              <span className="ml-auto text-sm text-gray-400">{originalWordCount} words</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{original_text}</p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(87,10,140,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { stopSpeech(); navigate('/summarize') }}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {t.summarizeAnother}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { stopSpeech(); navigate('/history') }}
            className="px-8 py-4 border-2 border-primary-500 text-primary-500 rounded-full font-semibold flex items-center gap-2"
          >
            {t.viewHistory}
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
      `}</style>
    </div>
  )
}

export default Result