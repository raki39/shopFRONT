'use client'

import { useState } from 'react'
import {
  Send,
  Plus,
  MessageSquare,
  Settings,
  Menu,
  X,
  Zap,
  Moon,
  Sun,
  Trash2,
  Search,
  Mic,
  LayoutDashboard,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Fake data
const fakeConversations = [
  { id: 1, title: 'Análise de vendas Q4', date: '07/01', time: '2 min', active: true },
  { id: 2, title: 'Relatório de estoque', date: '06/01', time: '1h', active: false },
  { id: 3, title: 'Previsão de demanda', date: '05/01', time: '3h', active: false },
  { id: 4, title: 'KPIs regionais', date: '04/01', time: '1d', active: false },
]

const fakeMessages = [
  { id: 1, role: 'user', content: 'Qual foi o total de vendas do último trimestre?' },
  { id: 2, role: 'assistant', content: 'Com base nos dados analisados, o total de vendas do último trimestre (Q4 2025) foi de R$ 2.847.392,00. Isso representa um crescimento de 12,3% em comparação ao trimestre anterior.\n\nOs principais destaques foram:\n• Região Sul: R$ 892.450,00 (+18%)\n• Região Sudeste: R$ 1.245.800,00 (+8%)\n• Região Nordeste: R$ 709.142,00 (+15%)' },
  { id: 3, role: 'user', content: 'Quais produtos tiveram melhor desempenho?' },
  { id: 4, role: 'assistant', content: 'Os 5 produtos com melhor desempenho no período foram:\n\n1. **Produto Premium A** - 2.340 unidades (R$ 468.000)\n2. **Kit Especial B** - 1.890 unidades (R$ 378.000)\n3. **Linha Econômica C** - 3.200 unidades (R$ 256.000)\n4. **Produto Sazonal D** - 1.450 unidades (R$ 217.500)\n5. **Bundle Promocional E** - 1.200 unidades (R$ 180.000)' },
]

export default function Variante2() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isNewChat, setIsNewChat] = useState(false)
  const [messages, setMessages] = useState(fakeMessages)

  // Sugestões de perguntas para o novo chat
  const suggestions = [
    { label: 'Análise de vendas', query: 'Qual foi o total de vendas do último mês?' },
    { label: 'Destaques do Mês', query: 'Quais produtos tiveram melhor desempenho?' },
    { label: 'Tendências', query: 'Quais são as tendências de compra atuais?' },
    { label: 'Relatório rápido', query: 'Gere um resumo do desempenho da loja' },
  ]

  const handleNewChat = () => {
    setIsNewChat(true)
    setMessages([])
    setInputValue('')
  }

  const handleSuggestionClick = (query: string) => {
    setInputValue(query)
    setIsNewChat(false)
    // Aqui entraria a lógica de enviar a mensagem
  }

  // Glass morphism styles based on theme
  const bgGradient = darkMode
    ? 'bg-slate-950'
    : 'bg-slate-50'

  const glassCard = darkMode
    ? 'bg-white/5 backdrop-blur-xl'
    : 'bg-white border border-slate-200'

  const glassInput = darkMode
    ? 'bg-white/5 backdrop-blur-xl'
    : 'bg-white border border-slate-200'

  const glassSidebar = darkMode
    ? 'bg-black/40 backdrop-blur-2xl border-r border-white/5'
    : 'bg-slate-100 border-r border-slate-200'

  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-white/70' : 'text-gray-600'
  const textMuted = darkMode ? 'text-white/40' : 'text-gray-400'

  return (
    <div className={`h-screen flex ${bgGradient} transition-all duration-500 relative overflow-hidden`}>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${darkMode ? 'bg-cyan-600/5' : 'bg-violet-300/15'} blur-3xl`} />
        <div className={`absolute top-1/2 -left-20 w-60 h-60 rounded-full ${darkMode ? 'bg-blue-600/5' : 'bg-blue-300/15'} blur-3xl`} />
        <div className={`absolute -bottom-20 right-1/3 w-72 h-72 rounded-full ${darkMode ? 'bg-teal-600/5' : 'bg-rose-300/10'} blur-3xl`} />
      </div>

      {/* Sidebar */}
      <aside className={`
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
              <span className={`text-[10px] font-semibold tracking-[0.2em] ${textMuted}`}>ASSISTENTE</span>
            </div>
            <img src="/VAREJO180.png" alt="Varejo 180" className="h-12 object-contain drop-shadow-lg" />
            <span className={`text-[10px] font-medium tracking-[0.15em] ${textMuted}`}>POWERED BY</span>
            <div className="flex items-center gap-4">
              <img src="/login-logo.png" alt="Sellbit" className="h-7 object-contain opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/image-1.png" alt="Shopping Brasil" className="h-7 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
            <Search className={`w-4 h-4 ${textMuted}`} />
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className={`flex-1 bg-transparent text-sm outline-none ${textPrimary} placeholder:${textMuted}`}
            />
          </div>
        </div>

        {/* New Chat */}
        <div className="px-4 pb-3">
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
            Nova Conversa
          </button>
        </div>

        {/* Conversations */}
        <div className={`flex-1 overflow-y-auto px-3 py-2 custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''}`}>
          <p className={`text-[11px] font-semibold ${textMuted} px-3 mb-3 tracking-wider`}>HISTÓRICO</p>
          <div className="space-y-1">
            {fakeConversations.map((conv) => (
              <div
                key={conv.id}
                className={`
                  group flex items-center px-3 py-2.5 rounded-lg cursor-pointer
                  transition-all duration-300
                  ${conv.active
                    ? `${darkMode ? 'bg-white/10' : 'bg-slate-200'}`
                    : `${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-200/60'}`
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${textPrimary}`}>{conv.title}</p>
                  <p className={`text-xs ${textMuted}`}>{conv.date} • {conv.time}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Delete logic here
                  }}
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
        </div>

        {/* Dashboard & Settings */}
        <div className={`p-4 space-y-2 ${darkMode ? '' : 'border-t border-slate-200'}`}>
          <button
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-all`}
          >
            <LayoutDashboard className={`w-5 h-5 ${textSecondary}`} />
            <span className={`text-sm font-medium ${textSecondary}`}>Dashboard</span>
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-all`}
          >
            <Settings className={`w-5 h-5 ${textSecondary}`} />
            <span className={`text-sm font-medium ${textSecondary}`}>Configurações</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className={`${glassCard} m-4 mb-0 rounded-2xl px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2.5 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all lg:hidden`}
            >
              {sidebarOpen ? <X className={`w-5 h-5 ${textPrimary}`} /> : <Menu className={`w-5 h-5 ${textPrimary}`} />}
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400/90 to-purple-500/90 flex items-center justify-center shadow-md shadow-purple-400/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${textPrimary}`}>Varejo IA</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className={`text-xs ${textMuted}`}>Conectado • Modelo GPT-4</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/select-agent')}
              className={`p-3 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all duration-300`}
              title="Trocar de agente"
            >
              <RefreshCw className={`w-5 h-5 ${textSecondary}`} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all duration-300`}
            >
              {darkMode ? <Sun className={`w-5 h-5 ${textSecondary}`} /> : <Moon className={`w-5 h-5 ${textSecondary}`} />}
            </button>
          </div>
        </header>

        {/* Messages or Welcome Screen */}
        <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''}`}>
          {isNewChat || messages.length === 0 ? (
            /* Welcome Screen - New Chat */
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
              {/* Greeting */}
              <div className="w-full mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className={`w-6 h-6 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                  <span className={`text-lg font-medium ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                    Olá!
                  </span>
                </div>
                <h2 className={`text-2xl md:text-3xl font-semibold ${textPrimary} leading-snug`}>
                  Estou pronto para analisar seus dados<br />
                  e responder suas perguntas.
                </h2>
              </div>

              {/* Input Card */}
              <div className={`w-full ${glassInput} rounded-2xl p-4 mb-3`}>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (inputValue.trim()) {
                        setIsNewChat(false)
                      }
                    }
                  }}
                  placeholder="Pergunte sobre vendas, produtos, tendências..."
                  rows={2}
                  className={`w-full bg-transparent outline-none text-sm ${textPrimary} placeholder:${textMuted} resize-none max-h-32 overflow-y-auto custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''}`}
                />
                <div className="flex items-center justify-between mt-3">
                  <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-all`}>
                    <Mic className={`w-5 h-5 ${textSecondary}`} />
                  </button>
                  <button
                    onClick={() => inputValue.trim() && setIsNewChat(false)}
                    className={`
                      p-2.5 rounded-xl transition-all
                      ${inputValue.trim()
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-md'
                        : (darkMode ? 'bg-white/10' : 'bg-slate-200')
                      }
                    `}
                  >
                    <Send className={`w-5 h-5 ${inputValue.trim() ? 'text-white' : textMuted}`} />
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
          ) : (
            /* Messages List */
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start items-start gap-3'}`}>
                  {/* Sparkle icon for assistant */}
                  {message.role === 'assistant' && (
                    <Sparkles className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                  )}
                  {/* Message */}
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input - only show when not in new chat mode */}
        {!isNewChat && messages.length > 0 && (
          <div className="p-4 pt-0">
            <div className={`max-w-4xl mx-auto ${glassInput} rounded-2xl p-2`}>
              <div className="flex items-end gap-3">
                <button className={`p-3 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all mb-0.5`}>
                  <Mic className={`w-5 h-5 ${textSecondary}`} />
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      // Send message logic here
                    }
                  }}
                  placeholder="Pergunte qualquer coisa..."
                  rows={1}
                  className={`flex-1 bg-transparent outline-none text-sm ${textPrimary} placeholder:${textMuted} py-3 resize-none max-h-32 overflow-y-auto custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''}`}
                  style={{ minHeight: '24px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                  }}
                />

                <button className={`
                  p-3 rounded-xl
                  ${inputValue.trim()
                    ? 'bg-gradient-to-r from-violet-500/90 to-purple-500/90 shadow-md shadow-purple-400/20 hover:shadow-purple-400/30'
                    : (darkMode ? 'bg-white/10' : 'bg-gray-200')
                  }
                  transition-all duration-300
                  hover:scale-105
                  active:scale-95
                  mb-0.5
                `}>
                  <Send className={`w-5 h-5 ${inputValue.trim() ? 'text-white' : textMuted}`} />
                </button>
              </div>
            </div>
            <p className={`text-xs ${textMuted} text-center mt-3`}>
              Varejo IA pode cometer erros. Considere verificar informações importantes.
            </p>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className={`${glassCard} rounded-3xl w-full max-w-lg mx-4 p-8 shadow-2xl`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Configurações</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-all`}
              >
                <X className={`w-6 h-6 ${textSecondary}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center justify-between p-5 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                <div>
                  <p className={`font-semibold ${textPrimary}`}>Tema</p>
                  <p className={`text-sm ${textMuted}`}>{darkMode ? 'Modo escuro ativado' : 'Modo claro ativado'}</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`
                    w-14 h-8 rounded-full relative transition-all duration-300
                    ${darkMode ? 'bg-gradient-to-r from-violet-500/90 to-purple-500/90' : 'bg-gray-300'}
                  `}
                >
                  <div className={`
                    absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg
                    transition-all duration-300
                    ${darkMode ? 'left-7' : 'left-1'}
                  `} />
                </button>
              </div>

              <div className={`flex items-center justify-between p-5 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                <div>
                  <p className={`font-semibold ${textPrimary}`}>Som</p>
                  <p className={`text-sm ${textMuted}`}>Efeitos sonoros</p>
                </div>
                <button className="w-14 h-8 rounded-full bg-gradient-to-r from-violet-500/90 to-purple-500/90 relative">
                  <div className="absolute top-1 left-7 w-6 h-6 rounded-full bg-white shadow-lg" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setSettingsOpen(false)}
              className="w-full mt-8 py-4 bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white font-semibold rounded-2xl hover:from-violet-400/90 hover:to-purple-400/90 transition-all shadow-md shadow-purple-400/20 hover:shadow-purple-400/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

