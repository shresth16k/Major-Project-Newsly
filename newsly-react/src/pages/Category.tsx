import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, Clock, Star, X, Calendar, User, Share2, Bookmark, Building, Trophy, Cpu, Heart, Briefcase, DollarSign, Film } from 'lucide-react'
import { useTranslation } from '../store/settingsStore'

interface NewsItem {
  id: number
  title: string
  summary: string
  content: string
  trustScore: number
  sentiment: string
  readTime: string
  source: string
  author: string
  date: string
  image: string
}

interface CategoryInfo {
  icon: typeof Newspaper
  color: string
  description: string
  news: NewsItem[]
}

const categoryData: Record<string, CategoryInfo> = {
  politics: {
    icon: Building,
    color: 'from-blue-500 to-indigo-500',
    description: 'Stay informed with the latest political news, policy updates, and government affairs.',
    news: [
      { id: 1, title: 'Global Leaders Meet for Climate Summit', summary: 'World leaders gather to discuss ambitious carbon reduction targets.', content: 'In a historic gathering, world leaders from over 190 countries convened at the annual Climate Summit to address the pressing challenges of global warming. The summit, held in Geneva, saw unprecedented commitments from major economies to reduce carbon emissions by 50% before 2035.\n\nKey highlights include new funding mechanisms for developing nations, technology transfer agreements, and binding commitments on renewable energy adoption. The agreement also establishes a global carbon trading system that will come into effect next year.\n\nEnvironmental groups have cautiously welcomed the outcomes while calling for more aggressive timelines. Industry leaders present at the summit pledged to accelerate their transition to sustainable practices.', trustScore: 96, sentiment: 'Neutral', readTime: '4 min', source: 'World News', author: 'Sarah Mitchell', date: 'Jan 9, 2026', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop' },
      { id: 2, title: 'New Economic Policy Announced', summary: 'Government unveils comprehensive economic reform package.', content: 'The government today announced a sweeping economic reform package aimed at stimulating growth and creating millions of new jobs over the next five years. The policy includes tax incentives for small businesses, infrastructure investments, and workforce development programs.\n\nFinance Minister announced that the reforms will inject $500 billion into the economy through public-private partnerships. The package also includes measures to support green industries and digital transformation initiatives.\n\nEconomists have given mixed reactions, with some praising the ambitious scope while others express concerns about fiscal sustainability.', trustScore: 94, sentiment: 'Positive', readTime: '5 min', source: 'Policy Daily', author: 'James Chen', date: 'Jan 8, 2026', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=600&fit=crop' },
      { id: 3, title: 'International Trade Agreement Signed', summary: 'Historic trade deal promises to reduce tariffs and boost commerce.', content: 'A landmark trade agreement was signed today between 15 nations, creating one of the largest free trade zones in history. The deal eliminates tariffs on over 90% of goods and establishes common standards for digital commerce.\n\nThe agreement is expected to boost regional GDP by 2.5% annually and create significant opportunities for exporters. Special provisions protect sensitive industries while promoting fair competition.\n\nBusiness leaders have welcomed the deal as a major step toward economic integration and recovery.', trustScore: 92, sentiment: 'Positive', readTime: '3 min', source: 'Trade Weekly', author: 'Maria Santos', date: 'Jan 7, 2026', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop' },
    ]
  },
  sports: {
    icon: Trophy,
    color: 'from-green-500 to-emerald-500',
    description: 'Get the latest scores, highlights, and analysis from your favorite sports.',
    news: [
      { id: 1, title: 'Championship Finals Set New Viewership Record', summary: 'Historic match draws millions of viewers worldwide.', content: 'The championship finals captivated audiences around the globe, setting a new viewership record with over 500 million people tuning in. The thrilling match went into overtime, with the underdog team securing a dramatic victory in the final seconds.\n\nThe game featured outstanding performances from both teams, with multiple records broken throughout the match. Analysts are calling it one of the greatest finals in the sport\'s history.\n\nCelebrations erupted in cities worldwide as fans witnessed the historic moment.', trustScore: 98, sentiment: 'Positive', readTime: '3 min', source: 'Sports Central', author: 'Mike Johnson', date: 'Jan 9, 2026', image: 'https://images.unsplash.com/photo-1461896836934- voices-of-the-game?w=800&h=600&fit=crop' },
      { id: 2, title: 'Rising Star Breaks World Record', summary: 'Young athlete shatters long-standing record.', content: 'A 19-year-old sensation has rewritten the record books with a stunning performance at the international championships. The young athlete broke a record that had stood for over two decades, finishing with a time that experts thought was impossible.\n\nCoaches and fellow athletes praised the remarkable achievement, noting the dedication and training that made it possible. The performance has sparked discussions about the future of the sport.', trustScore: 99, sentiment: 'Positive', readTime: '2 min', source: 'Athletic News', author: 'Lisa Park', date: 'Jan 8, 2026', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop' },
      { id: 3, title: 'Major League Announces Expansion', summary: 'League confirms addition of new franchises.', content: 'The league has officially announced the addition of four new teams, marking the largest expansion in its history. The new franchises will be based in growing markets that have shown strong fan support and infrastructure readiness.\n\nThe expansion is set to begin next season, with draft picks and player allocations already being planned. This move is expected to significantly increase the league\'s reach and revenue.', trustScore: 95, sentiment: 'Positive', readTime: '4 min', source: 'League Report', author: 'Tom Bradley', date: 'Jan 7, 2026', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop' },
    ]
  },
  technology: {
    icon: Cpu,
    color: 'from-purple-500 to-violet-500',
    description: 'Discover the latest innovations and breakthroughs shaping our digital future.',
    news: [
      { id: 1, title: 'AI Breakthrough Revolutionizes Healthcare', summary: 'New AI system achieves unprecedented accuracy in diagnosis.', content: 'A groundbreaking artificial intelligence system has demonstrated the ability to diagnose diseases with 99.2% accuracy, outperforming human doctors in clinical trials. The system, developed by a consortium of tech companies and medical institutions, can analyze medical images and patient data in seconds.\n\nThe technology is expected to be deployed in hospitals worldwide within the next year, potentially saving millions of lives through early detection. Regulatory bodies have fast-tracked approval given the promising results.\n\nMedical professionals are embracing the technology as a powerful diagnostic aid.', trustScore: 97, sentiment: 'Positive', readTime: '5 min', source: 'Tech Daily', author: 'Dr. Emily Watson', date: 'Jan 9, 2026', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop' },
      { id: 2, title: 'Quantum Computing Milestone Achieved', summary: 'Researchers demonstrate quantum supremacy.', content: 'Scientists have achieved a major milestone in quantum computing, successfully running calculations that would take traditional supercomputers thousands of years to complete. The breakthrough opens new possibilities for drug discovery, climate modeling, and cryptography.\n\nThe quantum processor, containing over 1,000 qubits, maintained coherence long enough to perform complex operations. This achievement brings practical quantum computing closer to reality.', trustScore: 96, sentiment: 'Positive', readTime: '6 min', source: 'Science Tech', author: 'Prof. Alan Richards', date: 'Jan 8, 2026', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop' },
      { id: 3, title: 'Electric Vehicle Sales Surge Globally', summary: 'EV adoption accelerates with improved range.', content: 'Electric vehicle sales have surged by 150% year-over-year, with new models offering ranges exceeding 500 miles on a single charge. The rapid adoption is being driven by falling battery costs and expanding charging infrastructure.\n\nMajor automakers have announced plans to phase out internal combustion engines entirely by 2035. Government incentives continue to make EVs more accessible to average consumers.', trustScore: 94, sentiment: 'Positive', readTime: '3 min', source: 'Auto Tech', author: 'Rachel Green', date: 'Jan 7, 2026', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop' },
    ]
  },
  health: {
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description: 'Your source for medical breakthroughs, wellness tips, and healthcare news.',
    news: [
      { id: 1, title: 'New Treatment Shows Promise for Chronic Disease', summary: 'Clinical trials reveal breakthrough therapy.', content: 'A revolutionary new treatment has shown remarkable results in clinical trials, offering hope to millions suffering from chronic conditions. The therapy, which targets the root cause of the disease rather than just symptoms, achieved a 90% success rate in phase 3 trials.\n\nPatients reported significant improvements in quality of life within weeks of starting treatment. The FDA has granted breakthrough therapy designation, expediting the approval process.\n\nMedical experts are calling this one of the most significant advances in treatment in decades.', trustScore: 97, sentiment: 'Positive', readTime: '5 min', source: 'Medical Journal', author: 'Dr. Robert Kim', date: 'Jan 9, 2026', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop' },
      { id: 2, title: 'Mental Health Awareness Campaign Launches', summary: 'Global initiative aims to reduce stigma.', content: 'A comprehensive global campaign has been launched to address mental health awareness and reduce the stigma associated with seeking help. The initiative includes educational programs, free counseling services, and workplace wellness resources.\n\nCelebrities and public figures have joined the campaign, sharing their personal experiences to encourage others to seek support. Mental health organizations report a significant increase in people reaching out for help since the campaign began.', trustScore: 95, sentiment: 'Positive', readTime: '3 min', source: 'Health Today', author: 'Amanda Foster', date: 'Jan 8, 2026', image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=600&fit=crop' },
      { id: 3, title: 'Nutrition Study Reveals Surprising Benefits', summary: 'Research shows health improvements from dietary changes.', content: 'A comprehensive 10-year study has revealed that simple dietary changes can have profound effects on long-term health outcomes. Participants who adopted a plant-forward diet showed 40% lower rates of heart disease and improved cognitive function.\n\nThe study, involving over 100,000 participants across multiple countries, provides the strongest evidence yet for the connection between diet and health. Nutritionists are updating their recommendations based on these findings.', trustScore: 93, sentiment: 'Positive', readTime: '4 min', source: 'Wellness Weekly', author: 'Dr. Nina Patel', date: 'Jan 7, 2026', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop' },
    ]
  },
  business: {
    icon: Briefcase,
    color: 'from-amber-500 to-orange-500',
    description: 'Track market trends, corporate news, and business insights.',
    news: [
      { id: 1, title: 'Tech Giant Announces Major Acquisition', summary: 'Industry-shaking deal reshapes competitive landscape.', content: 'In one of the largest tech acquisitions in history, a leading technology company has announced plans to acquire a major competitor for $85 billion. The deal, pending regulatory approval, would create a powerhouse in cloud computing and artificial intelligence.\n\nAnalysts predict the merger will accelerate innovation while raising questions about market concentration. Both companies\' stocks surged on the news, with investors optimistic about synergies.\n\nThe acquisition is expected to close within 18 months following regulatory review.', trustScore: 96, sentiment: 'Neutral', readTime: '4 min', source: 'Business Insider', author: 'David Chang', date: 'Jan 9, 2026', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop' },
      { id: 2, title: 'Startup Ecosystem Sees Record Investment', summary: 'Venture capital funding reaches all-time high.', content: 'Venture capital investment in startups has reached unprecedented levels, with $300 billion deployed globally in the past year. AI and climate tech companies attracted the lion\'s share of funding, reflecting investor priorities.\n\nUnicorn valuations continue to multiply, with 50 new billion-dollar startups emerging this quarter alone. The funding boom is creating opportunities for entrepreneurs worldwide.', trustScore: 94, sentiment: 'Positive', readTime: '3 min', source: 'Startup News', author: 'Jennifer Liu', date: 'Jan 8, 2026', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop' },
      { id: 3, title: 'Remote Work Trends Reshape Office Market', summary: 'Companies adapt to hybrid work models.', content: 'The commercial real estate market is undergoing a fundamental transformation as companies embrace hybrid work arrangements. Office vacancy rates have stabilized as businesses redesign spaces for collaboration rather than individual work.\n\nNew office designs feature more meeting rooms, social spaces, and technology infrastructure. Companies report improved employee satisfaction and productivity with flexible arrangements.', trustScore: 92, sentiment: 'Neutral', readTime: '5 min', source: 'Work Weekly', author: 'Mark Thompson', date: 'Jan 7, 2026', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop' },
    ]
  },
  finance: {
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    description: 'Stay updated on markets, investments, and financial strategies.',
    news: [
      { id: 1, title: 'Stock Markets Rally on Economic Data', summary: 'Major indices reach new highs.', content: 'Global stock markets surged to record highs following the release of better-than-expected economic data. The rally was broad-based, with technology, healthcare, and financial sectors leading gains.\n\nInvestors are increasingly optimistic about corporate earnings and economic growth prospects. Trading volumes hit multi-year highs as institutional investors increased their equity allocations.\n\nAnalysts predict continued momentum as inflation concerns ease and central banks signal supportive policies.', trustScore: 95, sentiment: 'Positive', readTime: '3 min', source: 'Financial Times', author: 'William Hayes', date: 'Jan 9, 2026', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop' },
      { id: 2, title: 'Central Bank Announces Interest Rate Decision', summary: 'Policy makers signal cautious approach.', content: 'The central bank held interest rates steady in its latest policy meeting, signaling a data-dependent approach to future decisions. The decision was widely expected by markets, which had priced in a pause in the tightening cycle.\n\nBank officials emphasized their commitment to price stability while acknowledging improvements in inflation metrics. Forward guidance suggests rates may begin declining later this year if economic conditions warrant.', trustScore: 97, sentiment: 'Neutral', readTime: '4 min', source: 'Market Watch', author: 'Susan Miller', date: 'Jan 8, 2026', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=600&fit=crop' },
      { id: 3, title: 'Cryptocurrency Regulation Framework Proposed', summary: 'New guidelines for digital assets.', content: 'Regulators have unveiled a comprehensive framework for cryptocurrency oversight, providing much-needed clarity for the digital asset industry. The rules establish licensing requirements for exchanges, custody standards, and consumer protection measures.\n\nIndustry participants have largely welcomed the regulations, viewing them as a step toward mainstream adoption. The framework is expected to attract institutional investors who had been waiting for regulatory certainty.', trustScore: 91, sentiment: 'Neutral', readTime: '5 min', source: 'Crypto Daily', author: 'Alex Rivera', date: 'Jan 7, 2026', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop' },
    ]
  },
  entertainment: {
    icon: Film,
    color: 'from-pink-500 to-rose-500',
    description: 'Your guide to movies, music, celebrities, and pop culture.',
    news: [
      { id: 1, title: 'Blockbuster Film Breaks Box Office Records', summary: 'Sequel exceeds expectations with massive opening.', content: 'The highly anticipated sequel has shattered box office records with a stunning $350 million opening weekend, making it the biggest debut in cinema history. The film has received rave reviews from critics and audiences alike.\n\nThe success marks a triumphant return for the franchise, which had been dormant for over a decade. Studios are already planning additional sequels and spin-offs based on the overwhelming response.\n\nTheaters reported sold-out shows throughout the weekend, with many adding extra screenings to meet demand.', trustScore: 98, sentiment: 'Positive', readTime: '2 min', source: 'Entertainment Weekly', author: 'Chris Anderson', date: 'Jan 9, 2026', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop' },
      { id: 2, title: 'Music Festival Announces Star-Studded Lineup', summary: 'Annual event promises unforgettable performances.', content: 'The world\'s premier music festival has revealed its most impressive lineup yet, featuring headliners from across genres. The three-day event will showcase over 100 artists on multiple stages.\n\nTickets sold out within hours of the announcement, with fans eager to experience the diverse musical offerings. The festival has also announced sustainability initiatives to reduce its environmental footprint.', trustScore: 96, sentiment: 'Positive', readTime: '3 min', source: 'Music News', author: 'Taylor Brooks', date: 'Jan 8, 2026', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop' },
      { id: 3, title: 'Streaming Platform Launches Original Series', summary: 'New show from acclaimed creator generates buzz.', content: 'A major streaming platform has premiered its most ambitious original series to date, created by an award-winning filmmaker. The show has already garnered critical acclaim and is trending globally.\n\nThe series features an ensemble cast of established and emerging talent, with production values rivaling theatrical releases. Early viewership numbers suggest it could become the platform\'s most-watched original content.', trustScore: 94, sentiment: 'Positive', readTime: '3 min', source: 'Stream Watch', author: 'Jordan Lee', date: 'Jan 7, 2026', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=600&fit=crop' },
    ]
  },
}


const Category = () => {
  const { category } = useParams<{ category: string }>()
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const categoryKey = category?.toLowerCase() || ''
  const data = categoryData[categoryKey]
  const t = useTranslation()

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.categoryNotFound}</h1>
          <p className="text-gray-600">{t.categoryNotFoundDesc}</p>
        </div>
      </div>
    )
  }

  const Icon = data.icon

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className={`w-20 h-20 bg-gradient-to-br ${data.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">{category}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">{data.description}</p>
        </motion.div>

        {/* Square Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedNews(item)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                      item.trustScore >= 95 ? 'bg-green-500 text-white' :
                      item.trustScore >= 90 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
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
                    <span>{item.source}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full flex items-center gap-1 ${
                      selectedNews.trustScore >= 95 ? 'bg-green-500 text-white' :
                      selectedNews.trustScore >= 90 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      <Star className="w-4 h-4" /> Trust Score: {selectedNews.trustScore}%
                    </span>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${
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

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {selectedNews.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {selectedNews.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {selectedNews.readTime} read
                  </span>
                  <span className="text-primary-500 font-medium">{selectedNews.source}</span>
                </div>

                <div className="prose prose-lg max-w-none">
                  {selectedNews.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <Bookmark className="w-4 h-4" /> Save
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