import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Play, Pause, Square, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from '../store/settingsStore'

const TextToSpeech = () => {
  const [text, setText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [voice, setVoice] = useState(0)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const t = useTranslation()

  const voices = window.speechSynthesis?.getVoices() || []

  const speak = () => {
    if (!text.trim()) {
      toast.error(t.enterTextTTS)
      return
    }

    if (!window.speechSynthesis) {
      toast.error(t.error)
      return
    }

    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voices[voice] || null
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.lang = 'en-IN'
    
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => { setSpeaking(false); setPaused(false) }
    utterance.onerror = () => { setSpeaking(false); setPaused(false) }
    
    window.speechSynthesis.speak(utterance)
    toast.success(t.playingAudio)
  }

  const togglePause = () => {
    if (paused) {
      window.speechSynthesis.resume()
      setPaused(false)
    } else {
      window.speechSynthesis.pause()
      setPaused(true)
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            whileHover={{ rotate: 10, scale: 1.1 }}
            animate={{ boxShadow: ['0 0 0 0 rgba(249,115,22,0.4)', '0 0 0 20px rgba(249,115,22,0)', '0 0 0 0 rgba(249,115,22,0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Volume2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.ttsTitle}</h1>
          <p className="text-gray-600">{t.ttsSubtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6"
        >
          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">{t.enterTextTTS}</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.typeOrPaste}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all"
              />
              <p className="text-sm text-gray-400 mt-1">{text.length} {t.characters}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.voice}</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  {voices.length > 0 ? (
                    voices.map((v, i) => (
                      <option key={i} value={i}>{v.name}</option>
                    ))
                  ) : (
                    <option value={0}>{t.defaultVoice}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.speed}: {rate}x</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.pitch}: {pitch}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              {!speaking ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={speak}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  {t.play}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={togglePause}
                    className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    {paused ? t.resume : t.pause}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={stop}
                    className="px-6 py-4 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Square className="w-5 h-5" />
                    {t.stop}
                  </motion.button>
                </>
              )}
            </div>

            {speaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-orange-500"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{paused ? t.paused : t.speaking}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TextToSpeech
