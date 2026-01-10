import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users as UsersIcon, Edit3, Trash2, Plus, RefreshCw, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  is_admin: boolean
  created_at: string
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newEmail, setNewEmail] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their summaries.')) return
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
        toast.success('User deleted successfully')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete user')
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

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
        const data = await res.json()
        toast.error(data.error || 'Failed to update user')
      }
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const filteredUsers = users

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Users Management</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={fetchUsers}
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
                <UsersIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">{users.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">
                  {users.filter(u => u.is_admin).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Admins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table/Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {user.is_admin ? (
                            <Shield className="w-5 h-5 text-purple-500" />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4 min-w-0">
                          {editingUser?.id === user.id ? (
                            <input
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              className="text-sm font-medium text-gray-900 border rounded px-2 py-1 w-64"
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
                                } else if (e.key === 'Escape') {
                                  setEditingUser(null)
                                  setNewEmail('')
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900 truncate">{user.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_admin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setNewEmail(user.email)
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {!user.is_admin && (
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {user.is_admin ? (
                        <Shield className="w-5 h-5 text-purple-500" />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {editingUser?.id === user.id ? (
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="text-sm font-medium text-gray-900 border rounded px-2 py-1 w-full"
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
                            } else if (e.key === 'Escape') {
                              setEditingUser(null)
                              setNewEmail('')
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900 truncate">{user.email}</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_admin 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => {
                        setEditingUser(user)
                        setNewEmail(user.email)
                      }}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit user"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {!user.is_admin && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-8 sm:py-12 px-4">
              <UsersIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500 text-sm sm:text-base">
                No users have been registered yet.
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8 sm:py-12 px-4">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-3 sm:mb-4 animate-spin" />
              <p className="text-gray-500 text-sm sm:text-base">Loading users...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Users