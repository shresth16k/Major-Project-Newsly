import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  isAdmin: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => Promise<void>
}

const API_BASE = '/api'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          
          if (res.ok && data.success) {
            set({ 
              user: data.user, 
              isAuthenticated: true, 
              isLoading: false 
            })
            return { success: true }
          }
          set({ isLoading: false })
          return { success: false, error: data.error || 'Login failed' }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'Network error' }
        }
      },

      signup: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const res = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          set({ isLoading: false })
          
          if (res.ok && data.success) {
            return { success: true }
          }
          return { success: false, error: data.error || 'Signup failed' }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'Network error' }
        }
      },

      logout: async () => {
        try {
          await fetch(`${API_BASE}/logout`, { credentials: 'include' })
        } catch {}
        set({ user: null, isAuthenticated: false })
      },

      checkAuth: async () => {
        try {
          const res = await fetch(`${API_BASE}/me`, { credentials: 'include' })
          if (res.ok) {
            const data = await res.json()
            set({ user: data.user, isAuthenticated: true })
          } else {
            set({ user: null, isAuthenticated: false })
          }
        } catch {
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    { 
      name: 'newsly-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)