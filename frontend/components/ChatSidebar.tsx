'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { chatSessionsAPI } from '@/lib/api'
import type { ChatSession } from '@/lib/types'
import { Plus, MessageSquare, Trash2, Loader2, Settings, LayoutDashboard } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  agentId: number
  onSelectSession: (session: ChatSession) => void
  onNewChat: () => void
}

export default function ChatSidebar({ agentId, onSelectSession, onNewChat }: ChatSidebarProps) {
  const router = useRouter()
  const { selectedChatSession, setSettingsOpen } = useStore()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [agentId])

  // Reload sessions when a new session is selected (created)
  useEffect(() => {
    if (selectedChatSession && !sessions.find(s => s.id === selectedChatSession.id)) {
      loadSessions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatSession])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const response = await chatSessionsAPI.list(agentId)
      setSessions(response.sessions)

      // Auto-select last session if none selected
      if (!selectedChatSession && response.sessions.length > 0) {
        onSelectSession(response.sessions[0])
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm('Deseja realmente deletar esta conversa?')) return

    try {
      await chatSessionsAPI.delete(sessionId)
      setSessions(sessions.filter(s => s.id !== sessionId))

      if (selectedChatSession?.id === sessionId) {
        onNewChat()
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Erro ao deletar conversa')
    }
  }

  const handleNewChat = () => {
    onNewChat()
    loadSessions()
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logos */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col items-center gap-3">
          {/* Varejo - Maior no topo */}
          <img src="/VAREJO180.png" alt="Varejo" className="w-52 h-auto object-contain" />

          {/* Powered By */}
          <p className="text-xs font-semibold text-gray-500 tracking-wide mt-2">POWERED BY</p>

          {/* Shopping Brasil - Menor */}
          <img src="/image-1.png" alt="Shopping Brasil" className="w-36 h-auto object-contain" />

          {/* Sellbit (Login) - Menor */}
          <img src="/login-logo.png" alt="Sellbit" className="w-28 h-auto object-contain" />
        </div>
      </div>

      {/* Dashboard and New Chat Buttons */}
      <div className="p-4 border-b border-gray-200 space-y-2">
        <button
          onClick={() => router.push('/em-construcao')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </button>

        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Nova Conversa</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Nenhuma conversa ainda</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "w-full text-left p-2.5 rounded-md transition-colors group relative cursor-pointer",
                selectedChatSession?.id === session.id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              )}
              onClick={() => onSelectSession(session)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-700 truncate text-[13px] leading-tight">
                    {session.title}
                  </h3>
                  {session.last_message && (
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {session.last_message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {session.messages_count} mensagens
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Settings Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Configurações
        </button>
      </div>
    </div>
  )
}