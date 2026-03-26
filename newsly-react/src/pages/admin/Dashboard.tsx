import { FileText, Users, TrendingUp, Eye, Trash2, Edit3, RefreshCw, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  is_admin: boolean
  created_at: string
}

interface Summary {
  id: number
  title: string
  summary_text: string
  method: string
  created_at: string
  user_id: number
}

interface AdminStats {
  totalUsers: number
  totalSummaries: number
  todaysSummaries: number
  avgSummaryLength: number
  totalVerifies: number
  fakeVerifies: number
  totalSentiments: number
  positiveSentiments: number
  negativeSentiments: number
}

interface AnalysisData {
  sentiment: {
    sentiment: string;
    confidence: number;
    emotions: { name: string; value: number }[];
  };
  fake_news: {
    score: number;
    verdict: string;
    reasons: string[];
    ai_reasoning: string;
  };
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([])
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSummaries: 0,
    todaysSummaries: 0,
    avgSummaryLength: 0,
    totalVerifies: 0,
    fakeVerifies: 0,
    totalSentiments: 0,
    positiveSentiments: 0,
    negativeSentiments: 0
  })
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [analyzingId, setAnalyzingId] = useState<number | null>(null)
  const [analysisData, setAnalysisData] = useState<Record<number, AnalysisData>>({})

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Fetch users
      const usersRes = await fetch('/api/admin/users', { credentials: 'include' })
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])
      }

      // Fetch summaries
      const summariesRes = await fetch('/api/admin/summaries', { credentials: 'include' })
      if (summariesRes.ok) {
        const summariesData = await summariesRes.json()
        setSummaries(summariesData.summaries || [])
      }

      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', { credentials: 'include' })
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          totalUsers: statsData.total_users || 0,
          totalSummaries: statsData.total_summaries || 0,
          todaysSummaries: statsData.todays_summaries || 0,
          avgSummaryLength: statsData.avg_summary_length || 0,
          totalVerifies: statsData.total_verifies || 0,
          fakeVerifies: statsData.fake_verifies || 0,
          totalSentiments: statsData.total_sentiments || 0,
          positiveSentiments: statsData.positive_sentiments || 0,
          negativeSentiments: statsData.negative_sentiments || 0
        })
      }

    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  // Analyze individual summary content on demand
  const analyzeSummary = async (id: number) => {
    if (analysisData[id] && analyzingId !== id) {
      // Data already fetched
      return
    }
    setAnalyzingId(id)
    try {
      const res = await fetch(`/api/admin/summaries/${id}/analysis`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setAnalysisData(prev => ({ ...prev, [id]: data }))
        toast.success('Analysis complete')
      } else {
        toast.error('Failed to analyze content')
      }
    } catch (error) {
      toast.error('Failed to analyze content')
    } finally {
      setAnalyzingId(null)
    }
  }

  // Delete user
  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
        toast.success('User deleted successfully')
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  // Update user email
  const updateUser = async (userId: number, newEmail: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: newEmail })
      })
      
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, email: newEmail } : u))
        setEditingUser(null)
        setNewEmail('')
        toast.success('User updated successfully')
      } else {
        toast.error('Failed to update user')
      }
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const statsData = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers.toString(), change: `+${stats.todaysSummaries} today`, color: 'bg-blue-500' },
    { icon: FileText, label: 'Total Summaries', value: stats.totalSummaries.toString(), change: `Avg ${stats.avgSummaryLength} chars`, color: 'bg-green-500' },
    { icon: Shield, label: 'News Verified', value: stats.totalVerifies.toString(), change: `${stats.totalVerifies ? Math.round((stats.fakeVerifies / stats.totalVerifies) * 100) : 0}% Fake`, color: 'bg-red-500' },
    { icon: TrendingUp, label: 'Sentiments Analyzed', value: stats.totalSentiments.toString(), change: `${stats.totalSentiments ? Math.round((stats.positiveSentiments / stats.totalSentiments) * 100) : 0}% Positive`, color: 'bg-purple-500' },
  ]

  const recentActivity = summaries.slice(0, 5).map(summary => ({
    icon: '📰',
    text: `User summarized "${summary.title || 'Untitled'}"`,
    time: new Date(summary.created_at).toLocaleString(),
    method: summary.method
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Dashboard</h1>
          <button 
            onClick={fetchAdminData}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Users</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {users.slice(0, 10).map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      {editingUser?.id === user.id ? (
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="text-sm font-medium text-gray-800 border rounded px-2 py-1"
                          onBlur={() => {
                            if (newEmail && newEmail !== user.email) {
                              updateUser(user.id, newEmail)
                            } else {
                              setEditingUser(null)
                              setNewEmail('')
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newEmail && newEmail !== user.email) {
                              updateUser(user.id, newEmail)
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className="font-medium text-gray-800">{user.email}</div>
                      )}
                      <div className="text-sm text-gray-500">
                        {user.is_admin ? 'Admin' : 'User'} • {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user)
                        setNewEmail(user.email)
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                    {!user.is_admin && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-lg">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800">{activity.text}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {activity.time} • Method: {activity.method}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Analytics */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary Methods Distribution</h2>
          <div className="space-y-3">
            {['transformer', 'extractive', 'sumy'].map((method, i) => {
              const count = summaries.filter(s => s.method === method).length
              const percentage = summaries.length > 0 ? Math.round((count / summaries.length) * 100) : 0
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500']
              
              return (
                <div key={method} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${colors[i]}`} />
                  <span className="text-sm text-gray-600 flex-1 capitalize">{method}</span>
                  <span className="text-sm font-medium text-gray-800">{count} ({percentage}%)</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className={`h-full ${colors[i]}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content Moderation Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" /> Content Moderation & Analysis
          </h2>
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
            {summaries.map((summary) => (
              <div key={summary.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors bg-gray-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{summary.title || 'Untitled'}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      Summary ID: {summary.id} • Method: {summary.method} • {new Date(summary.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => analyzeSummary(summary.id)}
                    disabled={analyzingId === summary.id}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                  >
                    {analyzingId === summary.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    {analysisData[summary.id] ? 'Refresh Insights' : 'Analyze Insights'}
                  </button>
                </div>
                
                <AnimatePresence>
                  {analysisData[summary.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {/* Fake News Report */}
                      <div className="bg-orange-50/80 rounded-xl p-5 border border-orange-100">
                        <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" /> Fake News Analysis
                        </h4>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="font-semibold text-orange-900">Verdict:</span> 
                          <span className={`px-2 py-1 rounded text-sm font-bold ${analysisData[summary.id].fake_news.score >= 80 ? 'bg-green-100 text-green-700' : analysisData[summary.id].fake_news.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {analysisData[summary.id].fake_news.verdict} ({analysisData[summary.id].fake_news.score}%)
                          </span>
                        </div>
                        <div className="text-sm text-orange-900 border-l-2 border-orange-300 pl-3 italic mb-3">
                          "{analysisData[summary.id].fake_news.ai_reasoning}"
                        </div>
                        <div className="text-xs text-orange-700 font-medium">Detection Indicators:</div>
                        <ul className="list-disc list-inside text-xs text-orange-800 mt-1">
                          {analysisData[summary.id].fake_news.reasons.slice(0, 3).map((r, idx) => (
                            <li key={idx} className="line-clamp-1">{r}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Sentiment Report */}
                      <div className="bg-purple-50/80 rounded-xl p-5 border border-purple-100">
                        <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" /> Sentiment Analysis
                        </h4>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="font-semibold text-purple-900">Overall:</span> 
                          <span className="px-2 py-1 bg-white rounded text-sm font-bold text-purple-700 capitalize shadow-sm">
                            {analysisData[summary.id].sentiment.sentiment} ({analysisData[summary.id].sentiment.confidence}%)
                          </span>
                        </div>
                        <div className="text-xs text-purple-700 font-medium mb-2">Dominant Emotions:</div>
                        <div className="flex flex-wrap gap-2">
                          {analysisData[summary.id].sentiment.emotions.slice(0, 3).map((emo: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 bg-white px-2 py-1.5 rounded shadow-sm">
                              <span className="text-xs font-semibold text-purple-800">{emo.name}</span>
                              <div className="w-12 h-1.5 bg-purple-100 rounded-full overflow-hidden ml-1">
                                <div className="h-full bg-purple-500" style={{ width: `${emo.value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {summaries.length === 0 && (
              <div className="text-center text-gray-500 py-8">No content to moderate yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard