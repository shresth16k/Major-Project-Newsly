import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface NewsItem {
  id: string | number
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
  url?: string
}

interface NewsState {
  savedPosts: NewsItem[]
  savePost: (post: NewsItem) => void
  removePost: (postId: string | number) => void
  isSaved: (postId: string | number) => boolean
}

export const useNewsStore = create<NewsState>()(
  persist(
    (set, get) => ({
      savedPosts: [],
      savePost: (post) => {
        const posts = get().savedPosts
        if (!posts.find(p => p.id === post.id)) {
          set({ savedPosts: [post, ...posts] })
        }
      },
      removePost: (postId) => set({
        savedPosts: get().savedPosts.filter((post) => post.id !== postId)
      }),
      isSaved: (postId) => {
        return get().savedPosts.some((post) => post.id === postId)
      }
    }),
    {
      name: 'newsly-saved-posts',
    }
  )
)
