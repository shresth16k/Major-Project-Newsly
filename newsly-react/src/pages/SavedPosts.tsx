import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Clock, Star, X, Calendar, User, Share2, Trash2 } from 'lucide-react'
import { useTranslation } from '../store/settingsStore'
import { useNewsStore, type NewsItem } from '../store/newsStore'

const SavedPosts = () => {
  const t = useTranslation()
  const { savedPosts, removePost, savePost, isSaved } = useNewsStore()
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  const handleShare = async (news: NewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: news.url || window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(news.url || window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleToggleSave = (news: NewsItem) => {
    if (isSaved(news.id)) {
      removePost(news.id)
      if (selectedNews?.id === news.id) {
        setSelectedNews(null)
      }
    } else {
      savePost(news)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Bookmark className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.savedPosts || 'Saved Posts'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.savedPostsDesc || 'View your saved news articles'}
          </p>
        </motion.div>

        {savedPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No saved posts yet</h2>
            <p className="text-gray-500">Articles you save will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedPosts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer group flex flex-col"
              >
                <div className="h-56 relative overflow-hidden bg-gray-200">
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
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-red-500 hover:text-white transition-colors text-white z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm ${
                        item.trustScore >= 95 ? 'bg-green-500 text-white' :
                        item.trustScore >= 80 ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        <Star className="w-3 h-3" /> {item.trustScore}% Trust
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-white leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium mt-auto">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.readTime}</span>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 rounded-full truncate max-w-[120px]">{item.source}</span>
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
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1.5 text-sm font-bold rounded-full flex items-center gap-1.5 shadow-md ${
                      selectedNews.trustScore >= 95 ? 'bg-green-500 text-white' :
                      selectedNews.trustScore >= 80 ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      <Star className="w-4 h-4" /> Trust Score: {selectedNews.trustScore}%
                    </span>
                    <span className={`px-3 py-1.5 text-sm font-bold rounded-full shadow-md ${
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
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-4 h-4" /> {selectedNews.author}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4" /> {selectedNews.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4" /> {selectedNews.readTime} read
                  </span>
                  <span className="text-primary-500 font-semibold px-3 py-1 bg-primary-50 rounded-full">{selectedNews.source}</span>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                  {selectedNews.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                  {selectedNews.url && (
                    <a 
                      href={selectedNews.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                       Read Original
                    </a>
                  )}
                  <button 
                    onClick={() => handleShare(selectedNews)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                  >
                    <Share2 className="w-5 h-5" /> {t.share || 'Share'}
                  </button>
                  <button 
                    onClick={() => handleToggleSave(selectedNews)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors border-2 ${
                      isSaved(selectedNews.id) 
                        ? 'border-red-500 text-red-500 hover:bg-red-50' 
                        : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {isSaved(selectedNews.id) ? (
                      <><Trash2 className="w-5 h-5" /> Remove</>
                    ) : (
                      <><Bookmark className="w-5 h-5" /> {t.save || 'Save'}</>
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

export default SavedPosts
