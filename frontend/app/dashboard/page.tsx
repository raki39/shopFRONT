'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import type { ChatSession, Message } from '@/lib/types'
import ChatSidebar from '@/components/ChatSidebar'
import ChatInput from '@/components/ChatInput'
import SettingsModal from '@/components/SettingsModal'
import GraphImage from '@/components/GraphImage'
import { Bot, User, Code, Loader2, Copy, Check } from 'lucide-react'
import { chatSessionsAPI } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const { user, selectedAgent, selectedChatSession, setSelectedChatSession, isSettingsOpen, setSettingsOpen } = useStore()

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedQuery, setCopiedQuery] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isNewSession, setIsNewSession] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!user) {
      router.push('/login')
      return
    }

    if (!selectedAgent) {
      router.push('/select-agent')
      return
    }
  }, [mounted, user, selectedAgent, router])

  useEffect(() => {
    if (selectedChatSession) {
      // Only load messages if it's not a new session (new sessions start with optimistic messages)
      if (!isNewSession) {
        loadMessages()
      }
    } else {
      setMessages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatSession])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!selectedChatSession) return

    try {
      setLoading(true)
      const response = await chatSessionsAPI.getMessages(selectedChatSession.id, 1, 100)
      setMessages(response.messages)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSelectSession = (session: ChatSession) => {
    setIsNewSession(false)
    setSelectedChatSession(session)
  }

  const handleNewChat = () => {
    setSelectedChatSession(null)
    setMessages([])
    setIsNewSession(false)
  }

  const handleCopyQuery = async (messageId: number, query: string) => {
    try {
      await navigator.clipboard.writeText(query)
      setCopiedQuery(messageId)
      setTimeout(() => setCopiedQuery(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleSessionCreated = async (sessionId: number) => {
    try {
      // Mark as new session to prevent loading messages (we already have optimistic messages)
      setIsNewSession(true)

      // Get the new session details
      const newSession = await chatSessionsAPI.get(sessionId)
      setSelectedChatSession(newSession)
    } catch (error) {
      console.error('Error loading new session:', error)
      setIsNewSession(false)
    }
  }

  const handleMessageSent = (userMessage: Message, assistantMessage: Message) => {
    setMessages(prev => {
      // Remove any existing messages with the same IDs
      const filtered = prev.filter(m =>
        m.id !== userMessage.id &&
        m.id !== assistantMessage.id
      )

      // Add both messages
      return [...filtered, userMessage, assistantMessage]
    })
  }

  const handleMessageComplete = () => {
    // Reset the new session flag when message is complete
    setIsNewSession(false)
  }

  if (!mounted || !user || !selectedAgent) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <ChatSidebar
        agentId={selectedAgent.id}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">{selectedAgent.nome}</h1>
                <p className="text-xs text-gray-500">
                  {selectedChatSession ? selectedChatSession.title : 'Nenhuma conversa selecionada'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : !selectedChatSession ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Selecione ou crie uma conversa</p>
                <p className="text-xs mt-1">Comece uma nova conversa para interagir com o agente</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Conversa vazia</p>
                <p className="text-xs mt-1">Envie uma mensagem para começar</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 items-start",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="shrink-0 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                  {message.sql_query && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">SQL Query</span>
                        </div>
                        <button
                          onClick={() => handleCopyQuery(message.id, message.sql_query!)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copiar query"
                        >
                          {copiedQuery === message.id ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-900 text-white p-2.5 rounded max-w-full overflow-hidden">
                        <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-all overflow-x-auto">
                          {message.sql_query}
                        </pre>
                      </div>
                    </div>
                  )}

                  {message.graph_url && (
                    <GraphImage graphUrl={message.graph_url} />
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          agentId={selectedAgent.id}
          sessionId={selectedChatSession?.id || null}
          onSessionCreated={handleSessionCreated}
          onMessageSent={handleMessageSent}
          onMessageComplete={handleMessageComplete}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}

