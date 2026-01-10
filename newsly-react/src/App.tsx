import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Summarize from './pages/Summarize'
import Result from './pages/Result'
import History from './pages/History'
import Verify from './pages/Verify'
import Sentiment from './pages/Sentiment'
import Briefing from './pages/Briefing'
import Categories from './pages/Categories'
import Category from './pages/Category'
import More from './pages/More'
import ForgotPassword from './pages/ForgotPassword'
import TextToSpeech from './pages/TextToSpeech'
import Settings from './pages/Settings'
import AdminDashboard from './pages/admin/Dashboard'
import Articles from './pages/admin/Articles'
import Users from './pages/admin/Users'
import Analytics from './pages/admin/Analytics'
import AdminSettings from './pages/admin/Settings'
import { useSettingsStore } from './store/settingsStore'

function App() {
  const darkMode = useSettingsStore((state) => state.darkMode)

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="summarize" element={<Summarize />} />
          <Route path="result" element={<Result />} />
          <Route path="history" element={<History />} />
          <Route path="verify" element={<Verify />} />
          <Route path="sentiment" element={<Sentiment />} />
          <Route path="briefing" element={<Briefing />} />
          <Route path="category/:category" element={<Category />} />
          <Route path="categories" element={<Categories />} />
          <Route path="more" element={<More />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="tts" element={<TextToSpeech />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<Articles />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
