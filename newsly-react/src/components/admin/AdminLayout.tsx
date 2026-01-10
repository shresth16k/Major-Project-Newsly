import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useState } from 'react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FileText, label: 'Articles', path: '/admin/articles' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-500 text-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-primary-500 text-white flex flex-col transition-transform duration-300 ease-in-out lg:flex-shrink-0`}>
        <div className="p-6 border-b border-white/20">
          <h1 className="text-xl font-bold">NEWSLY ADMIN</h1>
          <p className="text-primary-200 text-sm mt-1">Welcome, {user?.email?.split('@')[0]}</p>
        </div>
        
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive ? 'bg-white/20 border-r-4 border-white' : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen lg:flex-shrink-0">
        <div className="lg:hidden h-20" /> {/* Spacer for mobile menu button */}
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout