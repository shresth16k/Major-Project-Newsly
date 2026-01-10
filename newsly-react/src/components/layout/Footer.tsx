import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { useTranslation } from '../../store/settingsStore'

const Footer = () => {
  const t = useTranslation()

  return (
    <footer className="bg-primary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <img src="/images/logo.png" alt="Newsly" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-white/80">{t.aiReadsForYou}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.contact.toUpperCase()}</h4>
            <a href="mailto:support@newsly.com" className="text-white/80 hover:text-white">support@newsly.com</a>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.quickLinks.toUpperCase()}</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-white/80 hover:text-white">{t.privacy}</Link></li>
              <li><Link to="/terms" className="text-white/80 hover:text-white">{t.terms}</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-white">{t.contact}</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white">{t.about}</Link></li>
              <li><Link to="/faq" className="text-white/80 hover:text-white">{t.faq}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.followUs.toUpperCase()}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>© 2025 Newsly Solutions Pvt. Ltd. {t.allRightsReserved}.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
