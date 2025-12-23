'use client'

import { useEffect, useState, useRef } from 'react'
import { chatSessionsAPI, runsAPI } from '@/lib/api'
import type { Message, Run } from '@/lib/types'
import { Loader2, User, Bot, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessagesProps {
  sessionId: number | null
  agentId: number
}

export default function ChatMessages({ sessionId, agentId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionId) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!sessionId) return

    try {
      setLoading(true)
      const response = await chatSessionsAPI.getMessages(sessionId, 1, 100)
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

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const updateLastMessage = (content: string) => {
    setMessages(prev => {
      const newMessages = [...prev]
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content
        }
      }
      return newMessages
    })
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Selecione ou crie uma conversa</p>
          <p className="text-sm mt-2">Comece uma nova conversa para interagir com o agente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Conversa vazia</p>
            <p className="text-sm mt-2">Envie uma mensagem para começar</p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3",
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              )}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              
              {message.sql_query && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4" />
                    <span className="text-xs font-semibold">SQL Query:</span>
                  </div>
                  <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                    {message.sql_query}
                  </pre>
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-700" />
              </div>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

// Export function to be used by parent component
export function useChatMessages() {
  const [messagesRef, setMessagesRef] = useState<any>(null)
  
  return {
    messagesRef,
    setMessagesRef,
    addMessage: (message: Message) => messagesRef?.addMessage(message),
    updateLastMessage: (content: string) => messagesRef?.updateLastMessage(content),
  }
}

