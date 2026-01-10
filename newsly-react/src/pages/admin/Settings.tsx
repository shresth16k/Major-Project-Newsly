import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Save, RefreshCw, Shield, Database, Globe, Lock } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

interface AdminSettings {
  siteName: string
  siteDescription: string
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxSummaryLength: number
  defaultSummaryMethod: string
  enableNotifications: boolean
  maintenanceMode: boolean
}

const Settings = () => {
  const { user } = useAuthStore()
  const [settings, setSettings] = useState<AdminSettings>({
    siteName: 'Newsly',
    siteDescription: 'AI-powered news summarization platform',
    allowRegistration: true,
    requireEmailVerification: false,
    maxSummaryLength: 1000,
    defaultSummaryMethod: 'transformer',
    enableNotifications: true,
    maintenanceMode: false
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        toast.success('Settings saved successfully!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      siteName: 'Newsly',
      siteDescription: 'AI-powered news summarization platform',
      allowRegistration: true,
      requireEmailVerification: false,
      maxSummaryLength: 1000,
      defaultSummaryMethod: 'transformer',
      enableNotifications: true,
      maintenanceMode: false
    })
    toast.success('Settings reset to defaults')
  }

  const settingSections = [
    {
      title: 'General Settings',
      icon: SettingsIcon,
      color: 'bg-blue-500',
      settings: [
        {
          key: 'siteName',
          label: 'Site Name',
          type: 'text',
          description: 'The name of your application'
        },
        {
          key: 'siteDescription',
          label: 'Site Description',
          type: 'textarea',
          description: 'Brief description of your platform'
        }
      ]
    },
    {
      title: 'User Management',
      icon: Shield,
      color: 'bg-green-500',
      settings: [
        {
          key: 'allowRegistration',
          label: 'Allow User Registration',
          type: 'toggle',
          description: 'Allow new users to register accounts'
        },
        {
          key: 'requireEmailVerification',
          label: 'Require Email Verification',
          type: 'toggle',
          description: 'Require users to verify their email addresses'
        }
      ]
    },
    {
      title: 'Content Settings',
      icon: Database,
      color: 'bg-purple-500',
      settings: [
        {
          key: 'maxSummaryLength',
          label: 'Max Summary Length',
          type: 'number',
          description: 'Maximum characters allowed in summaries'
        },
        {
          key: 'defaultSummaryMethod',
          label: 'Default Summary Method',
          type: 'select',
          options: [
            { value: 'transformer', label: 'Transformer (AI)' },
            { value: 'extractive', label: 'Extractive' },
            { value: 'sumy', label: 'Sumy' }
          ],
          description: 'Default method for text summarization'
        }
      ]
    },
    {
      title: 'System Settings',
      icon: Globe,
      color: 'bg-orange-500',
      settings: [
        {
          key: 'enableNotifications',
          label: 'Enable Notifications',
          type: 'toggle',
          description: 'Send system notifications to users'
        },
        {
          key: 'maintenanceMode',
          label: 'Maintenance Mode',
          type: 'toggle',
          description: 'Put the site in maintenance mode'
        }
      ]
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Settings</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Configure your application settings and preferences</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Admin Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Administrator Account</h2>
              <p className="text-gray-600">Logged in as: {user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">You have full administrative privileges</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-500 mb-3">{setting.description}</p>
                    </div>
                    
                    <div className="w-full sm:w-auto sm:ml-6">
                      {setting.type === 'text' && (
                        <input
                          type="text"
                          value={settings[setting.key as keyof AdminSettings] as string}
                          onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
                          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      )}
                      
                      {setting.type === 'textarea' && (
                        <textarea
                          value={settings[setting.key as keyof AdminSettings] as string}
                          onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
                          rows={3}
                          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        />
                      )}
                      
                      {setting.type === 'number' && (
                        <input
                          type="number"
                          value={settings[setting.key as keyof AdminSettings] as number}
                          onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: parseInt(e.target.value) || 0 }))}
                          className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      )}
                      
                      {setting.type === 'select' && (
                        <select
                          value={settings[setting.key as keyof AdminSettings] as string}
                          onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
                          className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        >
                          {setting.options?.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {setting.type === 'toggle' && (
                        <div className="flex justify-start sm:justify-end">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[setting.key as keyof AdminSettings] as boolean}
                              onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Security Notice</h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                These settings affect the entire application. Changes will be applied immediately and may affect all users. 
                Please review your changes carefully before saving. Some settings may require application restart to take full effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings