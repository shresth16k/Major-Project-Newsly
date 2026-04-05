import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, Clock, Star, X, Calendar, User, Share2, Bookmark, Building, Trophy, Cpu, Heart, Briefcase, DollarSign, Film, Trash2 } from 'lucide-react'
import { useTranslation } from '../store/settingsStore'
import { useNewsStore, type NewsItem } from '../store/newsStore'

interface CategoryInfo {
  icon: typeof Newspaper
  color: string
  description: string
}

const categoryDataInfo: Record<string, CategoryInfo> = {
  politics: {
    icon: Building,
    color: 'from-blue-500 to-indigo-500',
    description: 'Stay informed with the latest political news, policy updates, and government affairs.',
  },
  sports: {
    icon: Trophy,
    color: 'from-green-500 to-emerald-500',
    description: 'Get the latest scores, highlights, and analysis from your favorite sports.',
  },
  technology: {
    icon: Cpu,
    color: 'from-purple-500 to-violet-500',
    description: 'Discover the latest innovations and breakthroughs shaping our digital future.',
  },
  health: {
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description: 'Your source for medical breakthroughs, wellness tips, and healthcare news.',
  },
  business: {
    icon: Briefcase,
    color: 'from-amber-500 to-orange-500',
    description: 'Track market trends, corporate news, and business insights.',
  },
  finance: {
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    description: 'Stay updated on markets, investments, and financial strategies.',
  },
  entertainment: {
    icon: Film,
    color: 'from-pink-500 to-rose-500',
    description: 'Your guide to movies, music, celebrities, and pop culture.',
  },
}

const Category = () => {
  const { category } = useParams<{ category: string }>()
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const categoryKey = category?.toLowerCase() || ''
  const data = categoryDataInfo[categoryKey]
  const t = useTranslation()
  const { isSaved, savePost, removePost } = useNewsStore()

  useEffect(() => {
    const fetchCategoryNews = async () => {
      if (!category) return
      try {
        setLoading(true)
        const res = await fetch(`/api/news/latest?category=${encodeURIComponent(category)}`)
        if (res.ok) {
          const result = await res.json()
          setNews(result.news || [])
        }
      } catch (err) {
        console.error('Error fetching category news:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategoryNews()
  }, [category])

  if (!data && !loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.categoryNotFound || 'Category Not Found'}</h1>
          <p className="text-gray-600">{t.categoryNotFoundDesc || 'The category you are looking for does not exist.'}</p>
        </div>
      </div>
    )
  }

  const handleShare = async (item: NewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.summary,
          url: item.url || window.location.href,
        })
      } catch (err) {
        console.error('Error sharing', err)
      }
    } else {
      navigator.clipboard.writeText(item.url || window.location.href)
      alert('Link copied to clipboard')
    }
  }

  const handleToggleSave = (item: NewsItem) => {
    if (isSaved(item.id)) removePost(item.id)
    else savePost(item)
  }

  const Icon = data?.icon || Newspaper
  const color = data?.color || 'from-gray-500 to-slate-500'
  const description = data?.description || 'Latest news for this category.'

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 transition-colors duration-300 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">{category}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">{description}</p>
        </motion.div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
           </div>
        ) : news.length === 0 ? (
           <div className="text-center py-20 text-gray-500">
             No recent news found for this category.
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group border border-gray-100"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSave(item);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors text-white z-10"
                  >
                    {isSaved(item.id) ? <Bookmark className="w-4 h-4 fill-white" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                        item.trustScore >= 95 ? 'bg-green-500 text-white' :
                        item.trustScore >= 80 ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        <Star className="w-3 h-3" /> {item.trustScore}%
                      </span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        item.sentiment === 'Positive' ? 'bg-blue-500 text-white' :
                        item.sentiment === 'Negative' ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {item.sentiment}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-white leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.readTime}
                      </span>
                      <span className="truncate max-w-[120px]">{item.source}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80 sticky top-0">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full flex items-center gap-1 shadow-md ${
                      selectedNews.trustScore >= 95 ? 'bg-green-500 text-white' :
                      selectedNews.trustScore >= 80 ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      <Star className="w-4 h-4" /> Trust Score: {selectedNews.trustScore}%
                    </span>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full shadow-md ${
                      selectedNews.sentiment === 'Positive' ? 'bg-blue-500 text-white' :
                      selectedNews.sentiment === 'Negative' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {selectedNews.sentiment}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {selectedNews.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {selectedNews.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {selectedNews.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {selectedNews.readTime} read
                  </span>
                  <span className="text-primary-500 font-medium bg-primary-50 px-3 py-1 rounded-full">{selectedNews.source}</span>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700">
                  {selectedNews.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex items-center flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
                  {selectedNews.url && (
                    <a
                      href={selectedNews.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold hover:opacity-90 transition"
                    >
                      {t.readFullArticle || 'Read Full Article'}
                    </a>
                  )}
                  <button 
                    onClick={() => handleShare(selectedNews)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full font-semibold transition"
                  >
                    <Share2 className="w-4 h-4" /> {t.share || 'Share'}
                  </button>
                  <button 
                    onClick={() => handleToggleSave(selectedNews)}
                    className={`flex items-center gap-2 px-6 py-2.5 border-2 rounded-full font-semibold transition ${
                      isSaved(selectedNews.id)
                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                      : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {isSaved(selectedNews.id) ? (
                      <><Trash2 className="w-4 h-4" /> Remove</>
                    ) : (
                      <><Bookmark className="w-4 h-4" /> Save</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Category
