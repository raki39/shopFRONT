'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { runsAPI, chatSessionsAPI } from '@/lib/api'
import type { Message } from '@/lib/types'

interface ChatInputProps {
  agentId: number
  sessionId: number | null
  onSessionCreated: (sessionId: number) => void
  onMessageSent: (userMessage: Message, assistantMessage: Message) => void
  onMessageComplete?: () => void
}

export default function ChatInput({ agentId, sessionId, onSessionCreated, onMessageSent, onMessageComplete }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput('')
    setLoading(true)

    try {
      let currentSessionId = sessionId

      // Create session if doesn't exist
      if (!currentSessionId) {
        const newSession = await chatSessionsAPI.create(agentId)
        currentSessionId = newSession.id
        onSessionCreated(currentSessionId)
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

      onMessageSent(userMessage, assistantMessage)

      // Send to API
      const run = await runsAPI.create(agentId, {
        question,
        chat_session_id: currentSessionId,
      })

      // Poll for result
      let attempts = 0
      const maxAttempts = 60 // 60 seconds max
      
      const pollResult = async () => {
        try {
          const result = await runsAPI.get(run.id)
          
          if (result.status === 'success') {
            // Update assistant message with real response
            const finalAssistantMessage: Message = {
              ...assistantMessage,
              content: result.result_data || 'Resposta recebida',
              sql_query: result.sql_used,
              graph_url: result.graph_url,
              run_id: result.id,
            }

            onMessageSent(userMessage, finalAssistantMessage)
            onMessageComplete?.()
            setLoading(false)
          } else if (result.status === 'failure') {
            const errorMessage: Message = {
              ...assistantMessage,
              content: `Erro: ${result.error_type || 'Erro desconhecido'}`,
            }
            onMessageSent(userMessage, errorMessage)
            onMessageComplete?.()
            setLoading(false)
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(pollResult, 1000)
          } else {
            const timeoutMessage: Message = {
              ...assistantMessage,
              content: 'Timeout: A resposta demorou muito tempo.',
            }
            onMessageSent(userMessage, timeoutMessage)
            onMessageComplete?.()
            setLoading(false)
          }
        } catch (error) {
          console.error('Error polling result:', error)
          const errorMessage: Message = {
            ...assistantMessage,
            content: 'Erro ao obter resposta. Tente novamente.',
          }
          onMessageSent(userMessage, errorMessage)
          onMessageComplete?.()
          setLoading(false)
        }
      }

      // Start polling after 2 seconds
      setTimeout(pollResult, 2000)

    } catch (error: any) {
      console.error('Error sending message:', error)
      alert('Erro ao enviar mensagem: ' + (error.response?.data?.detail || error.message))
      setLoading(false)
    }
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  )
}

