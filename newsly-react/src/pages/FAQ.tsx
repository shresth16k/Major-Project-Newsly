import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '../store/settingsStore'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const t = useTranslation()

  const faqs = [
    { q: t.whatIsNewsly, a: t.whatIsNewslyAnswer },
    { q: t.howSummarization, a: t.howSummarizationAnswer },
    { q: t.isFree, a: t.isFreeAnswer },
    { q: t.howAccurate, a: t.howAccurateAnswer },
    { q: t.canUseOffline, a: t.canUseOfflineAnswer },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t.faqTitle.split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t.faqTitle.split(' ').slice(-1)}</span>
          </h1>
          <p className="text-xl text-gray-600">{t.faqSubtitle}</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-gray-800">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ