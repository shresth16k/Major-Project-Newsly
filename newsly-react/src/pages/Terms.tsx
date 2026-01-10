import { motion } from 'framer-motion'
import { useTranslation } from '../store/settingsStore'

const Terms = () => {
  const t = useTranslation()
  
  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8">{t.termsTitle}</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">{t.lastUpdated}: January 2025</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. {t.acceptanceTerms}</h2>
              <p className="text-gray-600">{t.acceptanceTermsDesc}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. {t.useLicense}</h2>
              <p className="text-gray-600">{t.useLicenseDesc}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. {t.userResponsibilities}</h2>
              <p className="text-gray-600">{t.userResponsibilitiesDesc}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. {t.disclaimer}</h2>
              <p className="text-gray-600">{t.disclaimerDesc}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. {t.termsContact}</h2>
              <p className="text-gray-600">{t.termsContactDesc}</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Terms