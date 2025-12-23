import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Agent, ChatSession } from './types'

interface AppState {
  // Auth
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void

  // Selected Agent
  selectedAgent: Agent | null
  setSelectedAgent: (agent: Agent | null) => void

  // Selected Chat Session
  selectedChatSession: ChatSession | null
  setSelectedChatSession: (session: ChatSession | null) => void

  // UI State
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isSettingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token })
      },
      logout: () => {
        localStorage.clear()
        set({ user: null, token: null, selectedAgent: null, selectedChatSession: null })
      },

      // Selected Agent
      selectedAgent: null,
      setSelectedAgent: (agent) => set({ selectedAgent: agent }),

      // Selected Chat Session
      selectedChatSession: null,
      setSelectedChatSession: (session) => set({ selectedChatSession: session }),

      // UI State
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      isSettingsOpen: false,
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
    }),
    {
      name: 'agent-app-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        selectedAgent: state.selectedAgent,
      }),
    }
  )
)

