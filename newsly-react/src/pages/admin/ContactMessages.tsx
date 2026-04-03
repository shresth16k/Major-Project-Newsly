import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, RefreshCw, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface ContactMsg {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMsg[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/contacts', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.contacts || [])
      } else {
        toast.error('Failed to fetch contact messages')
      }
    } catch (error) {
      toast.error('Failed to fetch contact messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Contact Messages</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">View messages submitted through the Contact Us page</p>
          </div>
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">{messages.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Total Messages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Table/Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Messages</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((msg, index) => (
                  <motion.tr
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                      <div className="text-sm text-gray-500 sm:hidden">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-md whitespace-pre-wrap">{msg.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {messages.length === 0 && !loading && (
            <div className="text-center py-8 sm:py-12 px-4">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No messages</h3>
              <p className="text-gray-500 text-sm sm:text-base">
                No contact messages have been received yet.
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8 sm:py-12 px-4">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-3 sm:mb-4 animate-spin" />
              <p className="text-gray-500 text-sm sm:text-base">Loading messages...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactMessages
