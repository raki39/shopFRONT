'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { agentsAPI } from '@/lib/api'
import type { Agent } from '@/lib/types'
import { LogOut, Loader2, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'

export default function SelectAgentPage() {
  const router = useRouter()
  const { user, logout, setSelectedAgent } = useStore()

  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const loadAgents = async () => {
    try {
      setLoading(true)
      const data = await agentsAPI.list()
      setAgents(data)
      
      if (data.length === 0) {
        setError('Você não possui agentes cadastrados. Entre em contato com o administrador.')
      }
    } catch (err: any) {
      console.error('Error loading agents:', err)
      setError('Erro ao carregar agentes. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    router.push('/dashboard')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const nextAgent = () => {
    setCurrentIndex((prev) => (prev + 1) % agents.length)
  }

  const prevAgent = () => {
    setCurrentIndex((prev) => (prev - 1 + agents.length) % agents.length)
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  const currentAgent = agents[currentIndex]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/bioo-logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Bem-vindo, {user?.nome}!</h1>
              <p className="text-sm text-gray-500">Selecione um agente para começar</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {error ? (
          <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum Agente Disponível</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
              >
                Voltar ao Login
              </button>
            </div>
          </div>
        ) : agents.length > 0 ? (
          <div className="max-w-md w-full">
            {/* Agent Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentAgent.nome}</h2>
                <p className="text-sm text-gray-500 mb-6">{currentAgent.description || 'Agente de análise de dados'}</p>
              </div>

              {/* Features */}
              {currentAgent.features && currentAgent.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recursos</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentAgent.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Select Button */}
              <button
                onClick={() => handleSelectAgent(currentAgent)}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-sm"
              >
                Selecionar Agente
              </button>
            </div>

            {/* Navigation */}
            {agents.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={prevAgent}
                  className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-indigo-300"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-sm text-gray-500 font-medium min-w-[60px] text-center">
                  {currentIndex + 1} / {agents.length}
                </span>
                <button
                  onClick={nextAgent}
                  className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-indigo-300"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

