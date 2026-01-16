'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { agentsAPI } from '@/lib/api'
import type { Agent } from '@/lib/types'
import { LogOut, Loader2, Bot, Zap, Sparkles, ArrowRight, Sun, Moon, MessageSquare } from 'lucide-react'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from '@/hooks/useTranslation'

export default function SelectAgentPage() {
  const router = useRouter()
  const { user, logout, setSelectedAgent } = useStore()

  // Theme
  const { darkMode, toggleDarkMode, mounted: themeMounted } = useTheme()

  // Translation
  const { t } = useTranslation()

  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null)

  // Theme styles matching /chat
  const bgGradient = darkMode ? 'bg-slate-950' : 'bg-slate-50'
  const glassCard = darkMode ? 'bg-white/5 backdrop-blur-xl' : 'bg-white border border-slate-200'
  const glassCardHover = darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50 hover:border-slate-300'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-white/70' : 'text-gray-600'
  const textMuted = darkMode ? 'text-white/40' : 'text-gray-400'

  // Onboarding tour
  const { startTour, shouldRunOnboarding } = useOnboarding({
    page: 'select-agent',
    darkMode,
    enabled: !loading && agents.length > 0,
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

    loadAgents()
  }, [mounted, user, router])

  // Start onboarding tour when agents are loaded
  useEffect(() => {
    if (shouldRunOnboarding && !loading && agents.length > 0) {
      startTour()
    }
  }, [shouldRunOnboarding, loading, agents.length, startTour])

  const loadAgents = async () => {
    try {
      setLoading(true)
      const data = await agentsAPI.list()
      setAgents(data)

      if (data.length === 0) {
        setError(t.selectAgent.noAgentsDesc)
      }
    } catch (err: any) {
      console.error('Error loading agents:', err)
      setError(t.common.error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    router.push('/chat')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Prevent flash - show themed loading until ready
  if (!themeMounted || !mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-loading-bg">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-violet-400" />
          <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>{t.selectAgent.loadingAgents}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${bgGradient} transition-colors duration-300`}>
      {/* Ambient Background Effects */}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
        </div>
      )}

      {/* Header */}
      <header id="onboarding-header" className={`${glassCard} m-4 rounded-2xl px-6 py-3 flex justify-between items-center relative z-10`}>
        {/* Logos */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/VAREJO180.png"
              alt="Varejo"
              className={`h-8 w-auto object-contain ${darkMode ? 'brightness-0 invert opacity-90' : ''}`}
            />
            <span className={`text-[10px] font-semibold tracking-widest uppercase ${textMuted}`}>Powered by</span>
            <img
              src="/image-1.png"
              alt="Shopping Brasil"
              className={`h-6 w-auto object-contain ${darkMode ? 'brightness-0 invert opacity-80' : ''}`}
            />
            <img
              src="/login-logo.png"
              alt="Sellbit"
              className={`h-6 w-auto object-contain ${darkMode ? 'brightness-0 invert opacity-80' : ''}`}
            />
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl ${darkMode ? 'bg-white/10' : 'bg-violet-100'} flex items-center justify-center`}>
              <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-violet-600'}`}>
                {user?.nome?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className={`text-sm font-medium ${textSecondary} hidden sm:block`}>
              {user?.nome}
            </span>
          </div>

          <div className={`w-px h-6 ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`} />

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-all`}
          >
            {darkMode ? <Sun className={`w-4 h-4 ${textSecondary}`} /> : <Moon className={`w-4 h-4 ${textSecondary}`} />}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
              ${darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">{t.common.logout}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {error ? (
          <div className={`max-w-md w-full ${glassCard} rounded-2xl p-8`}>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'} flex items-center justify-center mx-auto mb-4`}>
                <MessageSquare className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>{t.selectAgent.noAgents}</h2>
              <p className={`${textSecondary} mb-6`}>{error}</p>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25"
              >
                {t.selectAgent.backToLogin}
              </button>
            </div>
          </div>
        ) : agents.length > 0 ? (
          <div className="w-full max-w-4xl">
            {/* Title Section */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                  {t.selectAgent.selectAssistant}
                </span>
              </div>
              <h1 className={`text-3xl sm:text-4xl font-bold ${textPrimary} mb-3`}>
                {t.selectAgent.title}
              </h1>
              <p className={`${textSecondary} max-w-lg mx-auto`}>
                {t.selectAgent.subtitle}
              </p>
            </div>

            {/* Agents Grid - Side by side */}
            <div id="onboarding-agents-grid" className={`grid gap-5 ${agents.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : agents.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'}`}>
              {agents.map((agent, index) => (
                <div
                  key={agent.id}
                  id={index === 0 ? 'onboarding-agent-card' : undefined}
                  onClick={() => handleSelectAgent(agent)}
                  onMouseEnter={() => setHoveredAgent(index)}
                  onMouseLeave={() => setHoveredAgent(null)}
                  className={`
                    ${glassCard} ${glassCardHover} rounded-2xl p-7 pb-9 cursor-pointer
                    transition-all duration-300 ease-out group
                  `}
                >
                  {/* Header with Icon and Status */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      bg-gradient-to-br from-violet-500 to-purple-600
                      shadow-lg shadow-violet-500/30
                      group-hover:shadow-violet-500/50 transition-all duration-300
                    `}>
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className={`
                      flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}
                    `}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t.common.online}
                    </div>
                  </div>

                  {/* Agent Name */}
                  <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
                    {agent.nome}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm ${textMuted} mb-5 line-clamp-2 min-h-[44px]`}>
                    {agent.description || t.selectAgent.defaultDescription}
                  </p>

                  {/* Model Badge */}
                  <div className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium mb-5
                    ${darkMode ? 'bg-white/5 text-white/60' : 'bg-slate-100 text-slate-600'}
                  `}>
                    <Zap className="w-3 h-3" />
                    {agent.selected_model || 'GPT-4'}
                  </div>

                  {/* Features */}
                  {agent.features && agent.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6 min-h-[56px]">
                      {agent.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className={`
                            px-2 py-0.5 rounded-md text-[11px] font-medium
                            ${darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}
                          `}
                        >
                          {feature}
                        </span>
                      ))}
                      {agent.features.length > 3 && (
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${textMuted}`}>
                          +{agent.features.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <button className={`
                    w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                    text-sm font-semibold transition-all duration-300
                    ${darkMode
                      ? 'bg-white/10 text-white hover:bg-white/15'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}>
                    <span>{t.selectAgent.startConversation}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Info */}
            <div className="text-center mt-10">
              <p className={`text-xs ${textMuted}`}>
                {agents.length} {agents.length === 1 ? t.selectAgent.agentAvailable : t.selectAgent.agentsAvailable}
              </p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
