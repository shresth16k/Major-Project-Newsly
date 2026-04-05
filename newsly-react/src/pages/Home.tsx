import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Shield, Heart, Newspaper, ArrowRight, Sparkles, X, ChevronLeft, ChevronRight, Bookmark, Trash2, Share2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../store/settingsStore'
import { useNewsStore, type NewsItem } from '../store/newsStore'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden">
      <HeroSection navigate={navigate} />
      <ToolsGrid navigate={navigate} />
      <TrendingPicks />
      <StatsSection />
      <DifferenceSection />
      <CTASection navigate={navigate} />
    </div>
  )
}

const HeroSection = ({ navigate }: { navigate: (path: string) => void }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const t = useTranslation()
  
  return (
    <section className="relative min-h-[800px] overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-white to-secondary-400/10"
        animate={{ 
          background: [
            'linear-gradient(135deg, rgba(87,10,140,0.1) 0%, white 50%, rgba(133,123,235,0.1) 100%)',
            'linear-gradient(135deg, rgba(133,123,235,0.1) 0%, white 50%, rgba(87,10,140,0.1) 100%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
      />
      
      {/* Floating Particles - More particles with varied sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'w-3 h-3 bg-primary-500/30' : i % 3 === 1 ? 'w-2 h-2 bg-secondary-400/25' : 'w-1.5 h-1.5 bg-blue-500/20'}`}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ 
              y: [-30, 30, -30], 
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-secondary-400/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {t.aiPoweredPlatform}
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t.heroTitle}
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="gradient-text"
              >
                {t.heroSubtitle}
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl text-gray-600 mb-8"
            >
              {t.heroDescription}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59,130,246,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/summarize')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all min-h-[56px] shadow-lg"
              >
                <FileText className="w-5 h-5" />
                {t.summarizeArticle}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(239,68,68,0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/verify')}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-red-500 text-red-500 hover:bg-red-50 rounded-full font-semibold text-lg transition-all min-h-[56px]"
              >
                <Shield className="w-5 h-5" />
                {t.verifyCredibility}
              </motion.button>
            </motion.div>

            {/* Mobile Phone Image - Shows below buttons on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="lg:hidden mt-12 relative"
            >
              {/* Background Decorations */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Animated Rings */}
                <motion.div
                  className="absolute w-72 h-72 rounded-full border-2 border-dashed border-primary-300/40"
                  animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                  transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity } }}
                />
                <motion.div
                  className="absolute w-56 h-56 rounded-full border border-secondary-300/30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                
                {/* Pulsing Glow */}
                <motion.div 
                  className="absolute w-64 h-64 bg-gradient-to-r from-primary-500/40 to-secondary-400/40 blur-3xl rounded-full"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              
              {/* Phone Container */}
              <div className="relative flex justify-center items-center min-h-[350px]">
                {/* Orbiting Feature Icons - Mobile */}
                <motion.div
                  className="absolute w-64 h-64"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                >
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  >
                    <FileText className="w-5 h-5 text-white" />
                  </motion.div>
                  <motion.div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </motion.div>
                  <motion.div 
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </motion.div>
                  <motion.div 
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  >
                    <Newspaper className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>

                {/* Phone Image - Large and Centered */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <motion.img
                    src="/images/hero-phone.png"
                    alt="Newsly App Preview"
                    className="w-64 sm:w-72 mx-auto drop-shadow-2xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                  />
                </motion.div>
              </div>
              
              {/* Floating Stats Cards - Positioned around phone */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5, type: 'spring' }}
                className="absolute left-2 top-16 bg-white rounded-2xl shadow-xl p-3 border border-gray-100"
              >
                <motion.div 
                  className="flex items-center gap-2"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-green-600">Verified ✓</span>
                    <p className="text-xs text-gray-500">98% Trust</p>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5, type: 'spring' }}
                className="absolute right-2 top-24 bg-white rounded-2xl shadow-xl p-3 border border-gray-100"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-xl font-bold gradient-text">3.2M+</div>
                  <p className="text-xs text-gray-500">Active Users</p>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5, type: 'spring' }}
                className="absolute left-4 bottom-4 bg-white rounded-2xl shadow-xl p-3 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.4 + i * 0.1 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">+250K reviews</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Phone Animation - Enhanced - Desktop Only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="relative hidden lg:flex justify-center items-center min-h-[600px]"
          >
            {/* Rotating Ring */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full border-2 border-dashed border-primary-300/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-[420px] h-[420px] rounded-full border border-secondary-300/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />

            {/* Orbiting Icons */}
            <motion.div
              className="absolute w-[480px] h-[480px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <FileText className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div 
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div 
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Newspaper className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              {/* Glow Effect - Larger */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary-500/40 to-secondary-400/40 blur-3xl rounded-full scale-125"
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1.2, 1.4, 1.2]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              {/* Phone Image - Larger */}
              <motion.img
                src="/images/hero-phone.png"
                alt="Newsly App Preview"
                className="relative w-full max-w-xl mx-auto drop-shadow-2xl"
                onLoad={() => setImageLoaded(true)}
                initial={{ filter: 'blur(10px)' }}
                animate={{ 
                  filter: imageLoaded ? 'blur(0px)' : 'blur(10px)',
                  rotateY: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  filter: { duration: 0.5 },
                  rotateY: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              />
              
              {/* Floating Cards - Enhanced */}
              <motion.div
                initial={{ opacity: 0, x: -80, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="absolute -left-20 top-1/4 bg-white rounded-2xl shadow-2xl p-5 max-w-[220px] border border-gray-100"
              >
                <motion.div 
                  className="flex items-center gap-3 mb-3"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Shield className="w-5 h-5 text-green-600" />
                  </motion.div>
                  <span className="text-base font-bold text-green-600">Verified ✓</span>
                </motion.div>
                <p className="text-sm text-gray-600">AI Trust Score: <span className="font-bold text-green-600">98%</span></p>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    transition={{ delay: 1.5, duration: 1 }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 80, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="absolute -right-16 top-1/3 bg-white rounded-2xl shadow-2xl p-5 max-w-[200px] border border-gray-100"
              >
                <motion.div 
                  className="text-3xl font-bold gradient-text"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  3.2M+
                </motion.div>
                <p className="text-sm text-gray-600">Active Users</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white -ml-2 first:ml-0"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const ToolsGrid = ({ navigate }: { navigate: (path: string) => void }) => {
  const t = useTranslation()
  
  const toolsData = [
    { id: 1, title: t.summarizer, description: t.summarizerDesc, icon: FileText, buttonText: t.startReading, path: '/summarize', size: 'large' as const, gradient: 'from-blue-500 to-blue-600' },
    { id: 2, title: t.fakeNewsDetector, description: t.fakeNewsDesc, icon: Shield, buttonText: t.verifyNow, path: '/verify', size: 'medium' as const, gradient: 'from-red-500 to-orange-500' },
    { id: 3, title: t.emotionAnalyzer, description: t.emotionDesc, icon: Heart, buttonText: t.analyzeTone, path: '/sentiment', size: 'medium' as const, gradient: 'from-purple-500 to-pink-500' },
    { id: 4, title: t.dailyBriefing, description: t.dailyBriefingDesc, icon: Newspaper, buttonText: t.readFeed, path: '/briefing', size: 'medium' as const, gradient: 'from-green-500 to-emerald-500' },
  ]

  return (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {t.aiPowerTools.split(' ').slice(0, 2).join(' ')} <span className="gradient-text">{t.aiPowerTools.split(' ').slice(2).join(' ') || 'Tools'}</span>
        </h2>
        <p className="mt-4 text-lg text-gray-600">{t.everythingYouNeed}</p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolsData.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={() => navigate(tool.path)}
            className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer ${tool.size === 'large' ? 'sm:col-span-2 lg:col-span-2' : ''} bg-gradient-to-br ${tool.gradient} text-white shadow-lg hover:shadow-2xl min-h-[220px] group`}
          >
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <div className="relative z-10">
              <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.2 }}>
                <tool.icon className="w-12 h-12 mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">{tool.title}</h3>
              <p className="text-white/90 mb-6">{tool.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-full font-medium transition backdrop-blur-sm"
              >
                {tool.buttonText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  )
}

const TrendingPicks = () => {
  const [trendingStories, setTrendingStories] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStory, setSelectedStory] = useState<NewsItem | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const scrollDirectionRef = useRef(1)
  
  const t = useTranslation()
  const { isSaved, savePost, removePost } = useNewsStore()

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/news/latest')
        if (res.ok) {
          const data = await res.json()
          setTrendingStories(data.news || [])
        }
      } catch (err) {
        console.error('Error fetching live news:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestNews()
  }, [])

  // Auto-scroll logic
  useEffect(() => {
    const container = scrollRef.current
    if (!container || trendingStories.length === 0) return

    const interval = setInterval(() => {
      if (isPaused || !container) return
      
      const maxScroll = container.scrollWidth - container.clientWidth
      
      if (container.scrollLeft >= maxScroll - 5) {
        scrollDirectionRef.current = -1
      } else if (container.scrollLeft <= 5) {
        scrollDirectionRef.current = 1
      }
      
      container.scrollLeft += scrollDirectionRef.current * 1
    }, 30)

    return () => clearInterval(interval)
  }, [isPaused, trendingStories])

  const scrollTo = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return
    setIsPaused(true)
    const amount = direction === 'left' ? -350 : 350
    container.scrollBy({ left: amount, behavior: 'smooth' })
    setTimeout(() => setIsPaused(false), 1000)
  }

  const handleShare = async (news: NewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: news.url || window.location.href,
        })
      } catch (err) {
        console.error('Error sharing', err)
      }
    } else {
      navigator.clipboard.writeText(news.url || window.location.href)
      alert('Link copied to clipboard')
    }
  }

  const handleToggleSave = (news: NewsItem) => {
    if (isSaved(news.id)) removePost(news.id)
    else savePost(news)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-8 h-8 text-primary-500" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t.topRatedStories}
            </h2>
          </div>
          
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollTo('left')}
              className="p-3 rounded-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTo('right')}
              className="p-3 rounded-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
        
        <div 
          className="relative min-h-[300px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {loading ? (
             <div className="flex justify-center items-center h-48">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
             </div>
          ) : trendingStories.length === 0 ? (
             <div className="text-gray-500 text-center py-12">No recent news available at the moment.</div>
          ) : (
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {trendingStories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                  onClick={() => setSelectedStory(story)}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 group flex flex-col"
                >
                  <div className="h-48 relative overflow-hidden bg-gray-200">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSave(story);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors text-white z-10"
                    >
                      {isSaved(story.id) ? <Bookmark className="w-4 h-4 fill-white" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        {story.trustScore}% Trust
                      </span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${story.sentiment === 'Positive' ? 'bg-blue-500 text-white' : story.sentiment === 'Negative' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {story.sentiment}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">{story.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                      <span className="truncate max-w-[140px]">{story.source}</span>
                      <span>{story.readTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 sticky top-0">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white/40 transition group"
                >
                  <X className="w-5 h-5 text-white transition" />
                </button>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                      {selectedStory.trustScore}% Trust Score
                    </span>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${selectedStory.sentiment === 'Positive' ? 'bg-blue-500 text-white' : selectedStory.sentiment === 'Negative' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {selectedStory.sentiment}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {selectedStory.title}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b flex-wrap">
                  <span>{selectedStory.author}</span>
                  <span>•</span>
                  <span>{selectedStory.date}</span>
                  <span>•</span>
                  <span>{selectedStory.readTime} read</span>
                  <span className="ml-auto text-primary-500 font-medium bg-primary-50 px-3 py-1 rounded-full">{selectedStory.source}</span>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-6">
                  {selectedStory.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                <p className="text-gray-500 text-sm leading-relaxed mt-4 p-4 bg-gray-50 rounded-xl">
                  This story was fetched live and evaluated dynamically. Trust scores and sentiment are generated by rapid AI analysis of the content.
                </p>

                <div className="mt-6 pt-4 border-t flex gap-3 flex-wrap">
                  {selectedStory.url && (
                     <a
                       href={selectedStory.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-center hover:opacity-90 transition-opacity"
                     >
                       {t.readFullArticle || 'Read Full Article'}
                     </a>
                  )}
                  <button
                    onClick={() => handleShare(selectedStory)}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5" /> {t.share || 'Share'}
                  </button>
                  <button
                    onClick={() => handleToggleSave(selectedStory)}
                    className={`flex items-center gap-2 px-6 py-3 border-2 rounded-xl font-semibold transition-colors ${
                      isSaved(selectedStory.id) 
                      ? 'border-red-500 text-red-500 hover:bg-red-50' 
                      : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {isSaved(selectedStory.id) ? (
                      <><Trash2 className="w-5 h-5" /> Remove</>
                    ) : (
                      <><Bookmark className="w-5 h-5" /> Save</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

const StatsSection = () => {
  const t = useTranslation()
  const stats = [
    { number: '1.3B', label: t.newsSummarized, suffix: '+' },
    { number: '250K', label: t.positiveReviews, suffix: '+' },
    { number: '3.2M', label: t.activeUsers, suffix: '+' },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 100 }}
              className="p-8"
            >
              <motion.div
                className="text-5xl font-bold gradient-text mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {stat.number}{stat.suffix}
              </motion.div>
              <p className="text-gray-600 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const DifferenceSection = () => {
  const t = useTranslation()
  const features = [
    { title: t.audioNews, desc: t.audioNewsDesc, icon: '🎧' },
    { title: t.offlineMode, desc: t.offlineModeDesc, icon: '📴' },
    { title: t.flexibleInput, desc: t.flexibleInputDesc, icon: '📄' },
    { title: t.productionReady, desc: t.productionReadyDesc, icon: '🚀' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          {t.whatMakesDifferent}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, borderColor: '#570a8c' }}
              className="p-6 border-2 border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 bg-white"
            >
              <motion.div
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTASection = ({ navigate }: { navigate: (path: string) => void }) => {
  const t = useTranslation()
  return (
  <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white relative overflow-hidden">
    <motion.div
      className="absolute inset-0"
      animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
      transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      style={{ backgroundImage: 'url(/images/hero-phone.png)', backgroundSize: '30%', opacity: 0.05 }}
    />
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-bold mb-4"
      >
        {t.readyToSee}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-xl text-white/90 mb-8"
      >
        {t.aiReadsForYou}
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/summarize')}
        className="px-10 py-4 bg-white text-primary-500 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all min-h-[56px] shadow-xl"
      >
        {t.summarizeNow}
      </motion.button>
    </div>
  </section>
  )
}

export default Home