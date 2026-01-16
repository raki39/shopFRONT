'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { chatSessionsAPI, runsAPI } from '@/lib/api'
import type { ChatSession, Message } from '@/lib/types'
import GraphImage from '@/components/GraphImage'
import SettingsModalChat from '@/components/SettingsModalChat'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from '@/hooks/useTranslation'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import {
  Send,
  Plus,
  Settings,
  Menu,
  X,
  Zap,
  Moon,
  Sun,
  Trash2,
  Search,
  Mic,
  MicOff,
  LayoutDashboard,
  Sparkles,
  RefreshCw,
  Loader2,
  Bot,
  User
} from 'lucide-react'

export default function ChatPage() {
  const router = useRouter()
  const { user, selectedAgent, selectedChatSession, setSelectedChatSession, isSettingsOpen, setSettingsOpen } = useStore()

  // Theme
  const { darkMode, toggleDarkMode, mounted: themeMounted } = useTheme()

  // Translation
  const { t } = useTranslation()

  // Speech Recognition - Web Speech API
  const { isListening, isSupported: isSpeechSupported, toggleListening } = useSpeechRecognition({
    onResult: (transcript) => {
      setInputValue(prev => prev ? `${prev} ${transcript}` : transcript)
    },
  })

  // Handle microphone click
  const handleMicClick = () => {
    if (!isSpeechSupported) {
      alert(t.chat.speechNotSupported || 'Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }
    toggleListening()
  }

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [isNewChat, setIsNewChat] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Data States
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [isNewSession, setIsNewSession] = useState(false)

  // Header visibility state
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sugestões de perguntas (usando traduções)
  const suggestions = [
    { label: t.chat.suggestions.salesAnalysis, query: t.chat.suggestions.salesQuery },
    { label: t.chat.suggestions.highlights, query: t.chat.suggestions.highlightsQuery },
    { label: t.chat.suggestions.trends, query: t.chat.suggestions.trendsQuery },
    { label: t.chat.suggestions.quickReport, query: t.chat.suggestions.quickReportQuery },
  ]

  // Glass morphism styles based on theme
  const bgGradient = darkMode ? 'bg-slate-950' : 'bg-slate-50'
  const glassCard = darkMode ? 'bg-white/5 backdrop-blur-xl' : 'bg-white border border-slate-200'
  const glassInput = darkMode ? 'bg-white/5 backdrop-blur-xl' : 'bg-white border border-slate-200'
  const glassSidebar = darkMode ? 'bg-black/40 backdrop-blur-2xl border-r border-white/5' : 'bg-slate-100 border-r border-slate-200'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-white/70' : 'text-gray-600'
  const textMuted = darkMode ? 'text-white/40' : 'text-gray-400'

  // Onboarding tour
  const { startTour, shouldRunOnboarding } = useOnboarding({
    page: 'chat',
    darkMode,
    enabled: !loadingSessions,
  })

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
    loadSessions()
  }, [mounted, user, selectedAgent, router])

  // Start onboarding tour when sessions are loaded
  useEffect(() => {
    if (shouldRunOnboarding && !loadingSessions && mounted) {
      startTour()
    }
  }, [shouldRunOnboarding, loadingSessions, mounted, startTour])

  useEffect(() => {
    if (selectedChatSession && !isNewSession) {
      loadMessages()
    } else if (!selectedChatSession) {
      setMessages([])
    }
  }, [selectedChatSession])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Reload sessions when a new session is selected
  useEffect(() => {
    if (selectedChatSession && !sessions.find(s => s.id === selectedChatSession.id)) {
      loadSessions()
    }
  }, [selectedChatSession])

  // Handle header visibility on scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop
      const scrollThreshold = 10 // Minimum scroll amount to trigger hide/show

      if (Math.abs(currentScrollY - lastScrollY.current) < scrollThreshold) {
        return
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down & past header height
        setHeaderVisible(false)
      } else {
        // Scrolling up
        setHeaderVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  const loadSessions = async () => {
    if (!selectedAgent) return
    try {
      setLoadingSessions(true)
      const response = await chatSessionsAPI.list(selectedAgent.id)
      setSessions(response.sessions)
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoadingSessions(false)
    }
  }

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

  const handleNewChat = () => {
    setSelectedChatSession(null)
    setMessages([])
    setIsNewChat(true)
    setIsNewSession(false)
    setInputValue('')
  }

  const handleSelectSession = (session: ChatSession) => {
    setIsNewSession(false)
    setIsNewChat(false)
    setSelectedChatSession(session)
  }

  const handleDeleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(t.chat.confirmDelete)) return
    try {
      await chatSessionsAPI.delete(sessionId)
      setSessions(sessions.filter(s => s.id !== sessionId))
      if (selectedChatSession?.id === sessionId) {
        handleNewChat()
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      alert(t.chat.deleteError)
    }
  }

  const handleSuggestionClick = (query: string) => {
    setInputValue(query)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sendingMessage || !selectedAgent) return

    const question = inputValue.trim()
    setInputValue('')
    setSendingMessage(true)
    setIsNewChat(false)

    try {
      let currentSessionId = selectedChatSession?.id || null

      // Create session if doesn't exist
      if (!currentSessionId) {
        const newSession = await chatSessionsAPI.create(selectedAgent.id)
        currentSessionId = newSession.id
        setIsNewSession(true)
        const sessionData = await chatSessionsAPI.get(currentSessionId)
        setSelectedChatSession(sessionData)
      }

      // Create user message (optimistic update)
      const userMessage: Message = {
        id: Date.now(),
        chat_session_id: currentSessionId,
        run_id: null,
        role: 'user',
        content: question,
        sql_query: null,
        graph_url: null,
        created_at: new Date().toISOString(),
        sequence_order: 0,
        message_metadata: null,
      }

      // Create assistant message placeholder
      const assistantMessage: Message = {
        id: Date.now() + 1,
        chat_session_id: currentSessionId,
        run_id: null,
        role: 'assistant',
        content: 'Processando...',
        sql_query: null,
        graph_url: null,
        created_at: new Date().toISOString(),
        sequence_order: 1,
        message_metadata: null,
      }

      setMessages(prev => [...prev.filter(m => m.id !== userMessage.id && m.id !== assistantMessage.id), userMessage, assistantMessage])

      // Send to API
      const run = await runsAPI.create(selectedAgent.id, {
        question,
        chat_session_id: currentSessionId,
      })

      // Poll for result
      let attempts = 0
      const maxAttempts = 60

      const pollResult = async () => {
        try {
          const result = await runsAPI.get(run.id)

          if (result.status === 'success') {
            const finalAssistantMessage: Message = {
              ...assistantMessage,
              content: result.result_data || 'Resposta recebida',
              sql_query: result.sql_used,
              graph_url: result.graph_url,
              run_id: result.id,
            }
            setMessages(prev => prev.map(m => m.id === assistantMessage.id ? finalAssistantMessage : m))
            setIsNewSession(false)
            setSendingMessage(false)
            loadSessions()
          } else if (result.status === 'failure') {
            const errorMessage: Message = {
              ...assistantMessage,
              content: `Erro: ${result.error_type || 'Erro desconhecido'}`,
            }
            setMessages(prev => prev.map(m => m.id === assistantMessage.id ? errorMessage : m))
            setIsNewSession(false)
            setSendingMessage(false)
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(pollResult, 1000)
          } else {
            const timeoutMessage: Message = {
              ...assistantMessage,
              content: 'Timeout: A resposta demorou muito tempo.',
            }
            setMessages(prev => prev.map(m => m.id === assistantMessage.id ? timeoutMessage : m))
            setIsNewSession(false)
            setSendingMessage(false)
          }
        } catch (error) {
          console.error('Error polling result:', error)
          const errorMessage: Message = {
            ...assistantMessage,
            content: 'Erro ao obter resposta. Tente novamente.',
          }
          setMessages(prev => prev.map(m => m.id === assistantMessage.id ? errorMessage : m))
          setIsNewSession(false)
          setSendingMessage(false)
        }
      }

      setTimeout(pollResult, 2000)
    } catch (error: any) {
      console.error('Error sending message:', error)
      alert('Erro ao enviar mensagem: ' + (error.response?.data?.detail || error.message))
      setSendingMessage(false)
    }
  }

  // Filter sessions by search
  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Prevent flash - show themed loading until ready
  if (!themeMounted || !mounted || !user || !selectedAgent) {
    return (
      <div className="h-screen flex items-center justify-center theme-loading-bg">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }


  return (
    <div className={`h-screen flex ${bgGradient} transition-all duration-500 relative overflow-hidden`}>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${darkMode ? 'bg-cyan-600/5' : 'bg-violet-300/15'} blur-3xl`} />
        <div className={`absolute top-1/2 -left-20 w-60 h-60 rounded-full ${darkMode ? 'bg-blue-600/5' : 'bg-blue-300/15'} blur-3xl`} />
        <div className={`absolute -bottom-20 right-1/3 w-72 h-72 rounded-full ${darkMode ? 'bg-teal-600/5' : 'bg-rose-300/10'} blur-3xl`} />
      </div>

      {/* Sidebar */}
      <aside id="onboarding-sidebar" className={`
        ${sidebarOpen ? 'w-80' : 'w-0'}
        ${glassSidebar}
        flex flex-col
        transition-all duration-500
        overflow-hidden
        relative z-10
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col items-center gap-3">
            <div className={`px-3 py-1 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-900/10'}`}>
              <span className={`text-[10px] font-semibold tracking-[0.2em] ${textMuted}`}>{t.chat.assistant}</span>
            </div>
            <img
              src="/VAREJO180.png"
              alt="Varejo 180"
              className={`h-12 object-contain drop-shadow-lg ${darkMode ? 'brightness-0 invert' : ''}`}
            />
            <span className={`text-[10px] font-medium tracking-[0.15em] ${textMuted}`}>POWERED BY</span>
            <div className="flex items-center gap-4">
              <img
                src="/image-1.png"
                alt="Shopping Brasil"
                className={`h-7 object-contain opacity-80 hover:opacity-100 transition-opacity ${darkMode ? 'brightness-0 invert' : ''}`}
              />
              <img
                src="/login-logo.png"
                alt="Sellbit"
                className={`h-7 object-contain opacity-80 hover:opacity-100 transition-opacity ${darkMode ? 'brightness-0 invert' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
            <Search className={`w-4 h-4 ${textMuted}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.chat.searchPlaceholder}
              className={`flex-1 bg-transparent text-sm outline-none ${textPrimary} placeholder:${textMuted}`}
            />
          </div>
        </div>

        {/* New Chat */}
        <div id="onboarding-new-chat" className="px-4 pb-3">
          <button
            onClick={handleNewChat}
            className={`
              w-full flex items-center justify-center gap-2
              px-3 py-2.5
              rounded-lg
              ${darkMode
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }
              font-medium text-sm
              transition-all duration-300
            `}>
            <Plus className="w-4 h-4" />
            {t.chat.newChat}
          </button>
        </div>

        {/* Conversations */}
        <div className={`flex-1 overflow-y-auto px-3 py-2 custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''}`}>
          <p className={`text-[11px] font-semibold ${textMuted} px-3 mb-3 tracking-wider`}>{t.chat.history}</p>
          {loadingSessions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className={`w-5 h-5 animate-spin ${textMuted}`} />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-xs ${textMuted}`}>{t.chat.noConversations}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className={`
                    group flex items-center px-3 py-2.5 rounded-lg cursor-pointer
                    transition-all duration-300
                    ${selectedChatSession?.id === session.id
                      ? `${darkMode ? 'bg-white/10' : 'bg-slate-200'}`
                      : `${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-200/60'}`
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${textPrimary}`}>{session.title}</p>
                    <p className={`text-xs ${textMuted}`}>{session.messages_count} {t.chat.messages}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className={`
                      opacity-0 group-hover:opacity-100 p-1.5 rounded-md
                      transition-all duration-200
                      ${darkMode
                        ? 'hover:bg-white/10 text-white/50 hover:text-red-400'
                        : 'hover:bg-slate-300 text-slate-400 hover:text-red-500'
                      }
                    `}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dashboard & Settings */}
        <div className={`p-4 space-y-2 ${darkMode ? '' : 'border-t border-slate-200'}`}>
          <button
            onClick={() => router.push('/em-construcao')}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-all`}
          >
            <LayoutDashboard className={`w-5 h-5 ${textSecondary}`} />
            <span className={`text-sm font-medium ${textSecondary}`}>{t.chat.dashboard}</span>
          </button>
          <button
            id="onboarding-settings"
            onClick={() => setSettingsOpen(true)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-all`}
          >
            <Settings className={`w-5 h-5 ${textSecondary}`} />
            <span className={`text-sm font-medium ${textSecondary}`}>{t.chat.settings}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header
          className={`
            ${glassCard} m-4 mb-0 rounded-2xl px-5 py-2.5 flex items-center justify-between
            transition-all duration-300 ease-in-out
            ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
          `}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all lg:hidden`}
            >
              {sidebarOpen ? <X className={`w-4 h-4 ${textPrimary}`} /> : <Menu className={`w-4 h-4 ${textPrimary}`} />}
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400/90 to-purple-500/90 flex items-center justify-center shadow-md shadow-purple-400/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <h1 className={`text-base font-bold ${textPrimary}`}>{selectedAgent.nome}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className={`text-xs ${textMuted}`}>
                  {selectedChatSession ? selectedChatSession.title : t.chat.newChat}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push('/select-agent')}
              className={`p-2.5 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all duration-300`}
              title="Trocar de agente"
            >
              <RefreshCw className={`w-4 h-4 ${textSecondary}`} />
            </button>
            <button
              id="onboarding-theme-toggle"
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all duration-300`}
            >
              {darkMode ? <Sun className={`w-4 h-4 ${textSecondary}`} /> : <Moon className={`w-4 h-4 ${textSecondary}`} />}
            </button>
          </div>
        </header>

        {/* Messages or Welcome Screen */}
        <div
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className={`w-8 h-8 animate-spin ${textMuted}`} />
            </div>
          ) : (isNewChat || (!selectedChatSession && messages.length === 0)) ? (
            /* Welcome Screen - New Chat */
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
              {/* Greeting */}
              <div className="w-full mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className={`w-6 h-6 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                  <span className={`text-lg font-medium ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                    {t.chat.greeting}
                  </span>
                </div>
                <h2 className={`text-2xl md:text-3xl font-semibold ${textPrimary} leading-snug`}>
                  {t.chat.greetingMessage}
                </h2>
              </div>

              {/* Input Card */}
              <div id="onboarding-input" className={`w-full ${glassInput} rounded-2xl p-4 mb-3`}>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder={t.chat.inputPlaceholder}
                  rows={2}
                  disabled={sendingMessage}
                  className={`w-full bg-transparent outline-none text-sm ${textPrimary} placeholder:${textMuted} resize-none max-h-32 overflow-y-auto custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''} disabled:opacity-50`}
                />
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    title={isListening ? t.chat.speechStop : isSpeechSupported ? t.chat.speechListening : t.chat.speechNotSupported}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      !isSpeechSupported
                        ? 'opacity-50'
                        : isListening
                        ? 'bg-red-500/20 text-red-500 animate-pulse'
                        : darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5 text-red-500" />
                    ) : (
                      <Mic className={`w-5 h-5 ${!isSpeechSupported ? 'opacity-50' : ''} ${textSecondary}`} />
                    )}
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !inputValue.trim()}
                    className={`
                      p-2.5 rounded-xl transition-all
                      ${inputValue.trim()
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-md'
                        : (darkMode ? 'bg-white/10' : 'bg-slate-200')
                      }
                      disabled:opacity-50
                    `}
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Send className={`w-5 h-5 ${inputValue.trim() ? 'text-white' : textMuted}`} />
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.query)}
                    className={`
                      px-3 py-3 rounded-lg text-sm font-medium
                      ${darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/80'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }
                      transition-all duration-200
                    `}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className={`w-12 h-12 mx-auto mb-3 ${textMuted} opacity-30`} />
                <p className={`text-sm font-medium ${textMuted}`}>{t.chat.emptyConversation}</p>
                <p className={`text-xs mt-1 ${textMuted}`}>{t.chat.sendMessageToStart}</p>
              </div>
            </div>
          ) : (
            /* Messages List */
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start items-start gap-3'}`}>
                  {message.role === 'assistant' && (
                    <Sparkles className="w-5 h-5 text-violet-500 mt-1 shrink-0" />
                  )}
                  <div className={`
                    max-w-[75%] px-4 py-3
                    ${message.role === 'assistant'
                      ? ''
                      : `rounded-2xl ${darkMode ? 'bg-slate-900/80' : 'bg-slate-200/80'}`
                    }
                    transition-all duration-300
                  `}>
                    <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${textPrimary}`}>
                      {message.content}
                    </p>
                    {message.graph_url && (
                      <GraphImage graphUrl={message.graph_url} darkMode={darkMode} />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input - only show when not in new chat mode and has messages or session */}
        {!isNewChat && (selectedChatSession || messages.length > 0) && (
          <div className="p-4 pt-0">
            <div className={`max-w-4xl mx-auto ${glassInput} rounded-2xl p-2`}>
              <div className="flex items-end gap-3">
                <button
                  type="button"
                  onClick={handleMicClick}
                  title={isListening ? t.chat.speechStop : isSpeechSupported ? t.chat.speechListening : t.chat.speechNotSupported}
                  className={`p-3 rounded-xl transition-all mb-0.5 cursor-pointer ${
                    !isSpeechSupported
                      ? 'opacity-50'
                      : isListening
                      ? 'bg-red-500/20 text-red-500 animate-pulse'
                      : darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5 text-red-500" />
                  ) : (
                    <Mic className={`w-5 h-5 ${!isSpeechSupported ? 'opacity-50' : ''} ${textSecondary}`} />
                  )}
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder={t.chat.inputPlaceholder}
                  rows={1}
                  disabled={sendingMessage}
                  className={`flex-1 bg-transparent outline-none text-sm ${textPrimary} placeholder:${textMuted} py-3 resize-none max-h-32 overflow-y-auto custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''} disabled:opacity-50`}
                  style={{ minHeight: '24px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                  }}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !inputValue.trim()}
                  className={`
                    p-3 rounded-xl
                    ${inputValue.trim()
                      ? 'bg-gradient-to-r from-violet-500/90 to-purple-500/90 shadow-md shadow-purple-400/20 hover:shadow-purple-400/30'
                      : (darkMode ? 'bg-white/10' : 'bg-gray-200')
                    }
                    transition-all duration-300
                    hover:scale-105
                    active:scale-95
                    mb-0.5
                    disabled:opacity-50 disabled:hover:scale-100
                  `}>
                  {sendingMessage ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className={`w-5 h-5 ${inputValue.trim() ? 'text-white' : textMuted}`} />
                  )}
                </button>
              </div>
            </div>
            <p className={`text-xs ${textMuted} text-center mt-3`}>
              {selectedAgent.nome} {t.chat.aiDisclaimer}
            </p>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModalChat
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    </div>
  )
}

