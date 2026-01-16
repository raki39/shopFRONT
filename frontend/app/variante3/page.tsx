'use client'

import { useState } from 'react'
import {
  Send,
  Plus,
  MessageSquare,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Bot,
  User,
  Building2,
  Moon,
  Sun,
  Trash2,
  Clock,
  TrendingUp,
  Database,
  FileText,
  ChevronDown,
  Check,
  Copy,
  RotateCcw,
  LayoutDashboard
} from 'lucide-react'

// Fake data
const fakeConversations = [
  { id: 1, title: 'Análise de vendas Q4', date: '06 Jan', messages: 12, active: true },
  { id: 2, title: 'Relatório de estoque', date: '05 Jan', messages: 8, active: false },
  { id: 3, title: 'Previsão de demanda', date: '04 Jan', messages: 15, active: false },
  { id: 4, title: 'KPIs regionais', date: '03 Jan', messages: 6, active: false },
]

const fakeMessages = [
  { id: 1, role: 'user', content: 'Qual foi o total de vendas do último trimestre?', time: '14:32' },
  { id: 2, role: 'assistant', content: 'Com base nos dados analisados, o total de vendas do último trimestre (Q4 2025) foi de R$ 2.847.392,00. Isso representa um crescimento de 12,3% em comparação ao trimestre anterior.\n\nOs principais destaques foram:\n• Região Sul: R$ 892.450,00 (+18%)\n• Região Sudeste: R$ 1.245.800,00 (+8%)\n• Região Nordeste: R$ 709.142,00 (+15%)', time: '14:32' },
  { id: 3, role: 'user', content: 'Quais produtos tiveram melhor desempenho?', time: '14:35' },
  { id: 4, role: 'assistant', content: 'Os 5 produtos com melhor desempenho no período foram:\n\n1. **Produto Premium A** - 2.340 unidades (R$ 468.000)\n2. **Kit Especial B** - 1.890 unidades (R$ 378.000)\n3. **Linha Econômica C** - 3.200 unidades (R$ 256.000)\n4. **Produto Sazonal D** - 1.450 unidades (R$ 217.500)\n5. **Bundle Promocional E** - 1.200 unidades (R$ 180.000)', time: '14:35' },
]

const quickActions = [
  { icon: TrendingUp, label: 'Análise de vendas', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Database, label: 'Consultar estoque', color: 'text-blue-600 bg-blue-50' },
  { icon: FileText, label: 'Gerar relatório', color: 'text-orange-600 bg-orange-50' },
]

export default function Variante3() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  // Theme colors - Corporate style
  const theme = {
    bg: darkMode ? 'bg-zinc-950' : 'bg-slate-50',
    sidebar: darkMode ? 'bg-zinc-900' : 'bg-white',
    card: darkMode ? 'bg-zinc-800' : 'bg-white',
    cardHover: darkMode ? 'hover:bg-zinc-700' : 'hover:bg-slate-50',
    border: darkMode ? 'border-zinc-800' : 'border-slate-200',
    text: darkMode ? 'text-zinc-100' : 'text-slate-900',
    textSecondary: darkMode ? 'text-zinc-400' : 'text-slate-600',
    textMuted: darkMode ? 'text-zinc-500' : 'text-slate-400',
    accent: 'bg-emerald-600',
    accentHover: 'hover:bg-emerald-700',
    accentLight: darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-700',
  }

  const handleCopy = (id: number) => {
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className={`h-screen flex ${theme.bg} transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-80' : 'w-0'} 
        ${theme.sidebar}
        border-r ${theme.border}
        flex flex-col 
        transition-all duration-300
        overflow-hidden
      `}>
        {/* Header with Logo */}
        <div className={`p-6 border-b ${theme.border}`}>
          {/* Brand Section */}
          <div className="flex flex-col items-center">
            <span className={`text-[10px] font-bold tracking-[0.2em] ${theme.textMuted} mb-2`}>ASSISTENTE</span>
            <img src="/VAREJO180.png" alt="Varejo 180" className="h-11 object-contain" />
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-4" />
            
            <span className={`text-[9px] font-semibold tracking-[0.15em] ${theme.textMuted}`}>POWERED BY</span>
            <div className="flex items-center gap-4 mt-2">
              <img src="/login-logo.png" alt="Sellbit" className="h-6 object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
              <div className={`w-px h-5 ${theme.border}`} />
              <img src="/image-1.png" alt="Shopping Brasil" className="h-6 object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
            </div>
          </div>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button className={`
            w-full flex items-center justify-center gap-2 
            px-4 py-3 
            ${theme.accent} ${theme.accentHover}
            text-white font-semibold text-sm
            rounded-lg
            transition-all duration-200
            shadow-sm hover:shadow-md
          `}>
            <Plus className="w-4 h-4" />
            Nova Conversa
          </button>
        </div>

        {/* Stats Bar */}
        <div className={`mx-4 p-3 rounded-lg ${darkMode ? 'bg-zinc-800' : 'bg-slate-100'} mb-4`}>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className={`text-lg font-bold ${theme.text}`}>247</p>
              <p className={`text-[10px] ${theme.textMuted}`}>Consultas</p>
            </div>
            <div className={`w-px h-8 ${theme.border}`} />
            <div className="text-center flex-1">
              <p className={`text-lg font-bold ${theme.text}`}>12</p>
              <p className={`text-[10px] ${theme.textMuted}`}>Sessões</p>
            </div>
            <div className={`w-px h-8 ${theme.border}`} />
            <div className="text-center flex-1">
              <p className={`text-lg font-bold text-emerald-600`}>98%</p>
              <p className={`text-[10px] ${theme.textMuted}`}>Precisão</p>
            </div>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          <div className={`px-4 py-2 flex items-center justify-between`}>
            <p className={`text-xs font-semibold ${theme.textMuted} tracking-wider`}>CONVERSAS RECENTES</p>
            <ChevronDown className={`w-4 h-4 ${theme.textMuted}`} />
          </div>
          <div className="px-2 space-y-1">
            {fakeConversations.map((conv) => (
              <div
                key={conv.id}
                className={`
                  group flex items-center gap-3 p-3 rounded-lg cursor-pointer
                  transition-all duration-200
                  ${conv.active 
                    ? theme.accentLight
                    : theme.cardHover
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${conv.active ? 'bg-emerald-600 text-white' : (darkMode ? 'bg-zinc-700' : 'bg-slate-100')}
                `}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${theme.text}`}>{conv.title}</p>
                  <div className={`flex items-center gap-2 text-xs ${theme.textMuted}`}>
                    <span>{conv.date}</span>
                    <span>•</span>
                    <span>{conv.messages} msgs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard & Settings */}
        <div className="p-4 space-y-1">
          <button
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.cardHover} transition-all`}
          >
            <LayoutDashboard className={`w-5 h-5 ${theme.textSecondary}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>Dashboard</span>
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.cardHover} transition-all`}
          >
            <Settings className={`w-5 h-5 ${theme.textSecondary}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>Configurações</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className={`${theme.card} border-b ${theme.border} px-6 py-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg ${theme.cardHover} transition-all`}
            >
              {sidebarOpen ? (
                <PanelLeftClose className={`w-5 h-5 ${theme.textSecondary}`} />
              ) : (
                <PanelLeft className={`w-5 h-5 ${theme.textSecondary}`} />
              )}
            </button>

            <div className={`h-6 w-px ${theme.border}`} />

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${theme.accent} flex items-center justify-center shadow-sm`}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-base font-bold ${theme.text}`}>Assistente Corporativo</h1>
                <p className={`text-xs ${theme.textMuted} flex items-center gap-1`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online • Análise de vendas Q4
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-lg ${theme.cardHover} transition-all`}
            >
              {darkMode ? <Sun className={`w-5 h-5 ${theme.textSecondary}`} /> : <Moon className={`w-5 h-5 ${theme.textSecondary}`} />}
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {fakeMessages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`
                  w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm
                  ${message.role === 'assistant' ? theme.accent : (darkMode ? 'bg-zinc-700' : 'bg-slate-200')}
                `}>
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className={`w-5 h-5 ${darkMode ? 'text-zinc-300' : 'text-slate-600'}`} />
                  )}
                </div>

                {/* Message */}
                <div className={`max-w-[75%] group`}>
                  <div className={`
                    rounded-xl px-5 py-4
                    ${message.role === 'assistant'
                      ? `${theme.card} border ${theme.border} shadow-sm`
                      : `${theme.accent} text-white shadow-sm`
                    }
                  `}>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === 'assistant' ? theme.text : 'text-white'}`}>
                      {message.content}
                    </p>
                  </div>

                  {/* Message Actions */}
                  <div className={`flex items-center gap-3 mt-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    <span className={`text-xs ${theme.textMuted}`}>{message.time}</span>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(message.id)}
                          className={`p-1.5 rounded ${theme.cardHover}`}
                        >
                          {copied === message.id ? (
                            <Check className={`w-3.5 h-3.5 text-emerald-500`} />
                          ) : (
                            <Copy className={`w-3.5 h-3.5 ${theme.textMuted}`} />
                          )}
                        </button>
                        <button className={`p-1.5 rounded ${theme.cardHover}`}>
                          <RotateCcw className={`w-3.5 h-3.5 ${theme.textMuted}`} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 pt-0">
          <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-zinc-800/80' : 'bg-white/80'} backdrop-blur-xl rounded-2xl p-2 shadow-lg`}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className={`flex-1 bg-transparent outline-none text-sm ${theme.text} px-3 py-3`}
              />
              <button className={`
                p-3 rounded-xl
                ${inputValue.trim()
                  ? `${theme.accent} text-white shadow-lg hover:shadow-emerald-500/30`
                  : (darkMode ? 'bg-zinc-700 text-zinc-500' : 'bg-slate-100 text-slate-400')
                }
                transition-all duration-200
                hover:scale-105
                active:scale-95
              `}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className={`text-xs ${theme.textMuted} text-center mt-3`}>
            Pressione Enter para enviar • Tempo médio de resposta: 1.2s
          </p>
        </div>
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${theme.card} rounded-xl shadow-2xl w-full max-w-md mx-4 border ${theme.border}`}>
            <div className={`flex items-center justify-between p-6 border-b ${theme.border}`}>
              <h2 className={`text-lg font-bold ${theme.text}`}>Configurações</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className={`p-2 rounded-lg ${theme.cardHover}`}
              >
                <span className={`text-xl ${theme.textSecondary}`}>×</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-zinc-800' : 'bg-slate-50'}`}>
                <div>
                  <p className={`font-semibold ${theme.text}`}>Tema</p>
                  <p className={`text-sm ${theme.textMuted}`}>{darkMode ? 'Escuro' : 'Claro'}</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-emerald-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-zinc-800' : 'bg-slate-50'}`}>
                <div>
                  <p className={`font-semibold ${theme.text}`}>Histórico</p>
                  <p className={`text-sm ${theme.textMuted}`}>Salvar conversas</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-emerald-600 relative">
                  <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>
            </div>

            <div className={`p-6 border-t ${theme.border}`}>
              <button
                onClick={() => setSettingsOpen(false)}
                className={`w-full py-3 ${theme.accent} ${theme.accentHover} text-white font-semibold rounded-lg transition-all`}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

