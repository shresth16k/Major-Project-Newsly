import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, FileText, Calendar, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface AnalyticsData {
  totalUsers: number
  totalSummaries: number
  todaysSummaries: number
  avgSummaryLength: number
  methodDistribution: { [key: string]: number }
  dailyActivity: { date: string; count: number }[]
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalSummaries: 0,
    todaysSummaries: 0,
    avgSummaryLength: 0,
    methodDistribution: {},
    dailyActivity: []
  })
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', { credentials: 'include' })
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        
        // Fetch summaries for method distribution
        const summariesRes = await fetch('/api/admin/summaries', { credentials: 'include' })
        let methodDistribution = {}
        let dailyActivity: { date: string; count: number }[] = []
        
        if (summariesRes.ok) {
          const summariesData = await summariesRes.json()
          const summaries = summariesData.summaries || []
          
          // Calculate method distribution
          methodDistribution = summaries.reduce((acc: any, summary: any) => {
            acc[summary.method] = (acc[summary.method] || 0) + 1
            return acc
          }, {})
          
          // Calculate daily activity for last 7 days
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            return date.toDateString()
          }).reverse()
          
          dailyActivity = last7Days.map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: summaries.filter((s: any) => new Date(s.created_at).toDateString() === date).length
          }))
        }
        
        setData({
          totalUsers: statsData.total_users || 0,
          totalSummaries: statsData.total_summaries || 0,
          todaysSummaries: statsData.todays_summaries || 0,
          avgSummaryLength: statsData.avg_summary_length || 0,
          methodDistribution,
          dailyActivity
        })
      } else {
        toast.error('Failed to fetch analytics data')
      }
    } catch (error) {
      toast.error('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const statsCards = [
    { icon: Users, label: 'Total Users', value: data.totalUsers, color: 'bg-blue-500', change: '+12%' },
    { icon: FileText, label: 'Total Summaries', value: data.totalSummaries, color: 'bg-green-500', change: '+8%' },
    { icon: TrendingUp, label: 'Today\'s Activity', value: data.todaysSummaries, color: 'bg-purple-500', change: '+23%' },
    { icon: BarChart3, label: 'Avg. Length', value: `${data.avgSummaryLength} chars`, color: 'bg-orange-500', change: '+15%' },
  ]

  const methodColors = {
    transformer: { bg: 'bg-blue-500', text: 'text-blue-600' },
    extractive: { bg: 'bg-green-500', text: 'text-green-600' },
    sumy: { bg: 'bg-purple-500', text: 'text-purple-600' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-600 mt-2">Insights and performance metrics</p>
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Daily Activity (Last 7 Days)</h2>
            <div className="space-y-4">
              {data.dailyActivity.map((day, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600">{day.date}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max((day.count / Math.max(...data.dailyActivity.map(d => d.count))) * 100, 5)}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="h-full bg-primary-500 rounded-full"
                    />
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-800">{day.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Method Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Summarization Methods</h2>
            <div className="space-y-4">
              {Object.entries(data.methodDistribution).map(([method, count], i) => {
                const total = Object.values(data.methodDistribution).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                const colors = methodColors[method as keyof typeof methodColors] || { bg: 'bg-gray-500', text: 'text-gray-600' }
                
                return (
                  <div key={method} className="flex items-center gap-4">
                    <div className={`w-4 h-4 ${colors.bg} rounded-full`} />
                    <div className="flex-1 capitalize font-medium text-gray-800">{method}</div>
                    <div className="text-sm text-gray-600">{count} ({percentage}%)</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className={`h-full ${colors.bg} rounded-full`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Performance Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {data.totalSummaries > 0 ? Math.round((data.todaysSummaries / data.totalSummaries) * 100) : 0}%
              </div>
              <div className="text-sm text-green-700 font-medium">Daily Activity Rate</div>
              <div className="text-xs text-green-600 mt-1">Of total summaries created today</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {data.totalUsers > 0 ? Math.round(data.totalSummaries / data.totalUsers) : 0}
              </div>
              <div className="text-sm text-blue-700 font-medium">Avg. Summaries per User</div>
              <div className="text-xs text-blue-600 mt-1">User engagement metric</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {data.avgSummaryLength > 0 ? Math.round(data.avgSummaryLength / 100) : 0}
              </div>
              <div className="text-sm text-purple-700 font-medium">Avg. Summary Quality</div>
              <div className="text-xs text-purple-600 mt-1">Based on length (x100 chars)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics