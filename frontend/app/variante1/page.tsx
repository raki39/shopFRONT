'use client'

import { useState } from 'react'
import { Send, Plus, MessageSquare, Settings, Bot, User, Moon, Sun, LayoutDashboard, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

const fakeConversations = [
  { id: 1, title: 'Análise de vendas Q4', time: 'Agora', active: true },
  { id: 2, title: 'Relatório de estoque', time: '1h', active: false },
  { id: 3, title: 'Previsão de demanda', time: '3h', active: false },
  { id: 4, title: 'KPIs regionais', time: '1d', active: false },
]

const fakeMessages = [
  { id: 1, role: 'user', content: 'Qual foi o total de vendas do último trimestre?' },
  { id: 2, role: 'assistant', content: 'O total de vendas do Q4 2025 foi de R$ 2.847.392,00, um crescimento de 12,3% em comparação ao trimestre anterior.\n\nDestaques por região:\n• Sul: R$ 892.450 (+18%)\n• Sudeste: R$ 1.245.800 (+8%)\n• Nordeste: R$ 709.142 (+15%)' },
  { id: 3, role: 'user', content: 'Quais produtos tiveram melhor desempenho?' },
  { id: 4, role: 'assistant', content: 'Os 5 produtos com melhor desempenho:\n\n1. Produto Premium A - 2.340 un (R$ 468k)\n2. Kit Especial B - 1.890 un (R$ 378k)\n3. Linha Econômica C - 3.200 un (R$ 256k)\n4. Produto Sazonal D - 1.450 un (R$ 217k)\n5. Bundle Promocional E - 1.200 un (R$ 180k)' },
]

export default function Variante1() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Theme - Blue/Cyan tones
  const theme = {
    bg: darkMode ? 'bg-slate-950' : 'bg-sky-50/50',
    sidebar: darkMode ? 'bg-slate-900' : 'bg-white',
    card: darkMode ? 'bg-slate-800' : 'bg-white',
    text: darkMode ? 'text-slate-100' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-600',
    textMuted: darkMode ? 'text-slate-500' : 'text-slate-400',
    border: darkMode ? 'border-slate-800' : 'border-sky-200/60',
    accent: 'bg-sky-600',
    accentHover: 'hover:bg-sky-700',
    accentLight: darkMode ? 'bg-sky-900/40 text-sky-400' : 'bg-sky-100 text-sky-800',
  }

  return (
    <div className={`h-screen flex ${theme.bg} transition-colors duration-300`}>
      {/* Fixed Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-72' : 'w-0'}
        ${theme.sidebar}
        border-r ${theme.border}
        flex flex-col
        transition-all duration-300
        overflow-hidden
        shadow-sm
      `}>
        {/* Logo Section */}
        <div className={`p-5 border-b ${theme.border}`}>
          <div className="flex flex-col items-center gap-2">
            <img src="/VAREJO180.png" alt="Varejo 180" className="h-10 object-contain" />
            <span className={`text-[10px] ${theme.textMuted} font-medium tracking-wider`}>POWERED BY</span>
            <div className="flex items-center gap-3">
              <img src="/login-logo.png" alt="Sellbit" className="h-6 object-contain" />
              <img src="/image-1.png" alt="Shopping Brasil" className="h-6 object-contain" />
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl ${theme.accent} ${theme.accentHover} text-white font-medium text-sm transition-all shadow-lg shadow-sky-500/25`}>
            <Plus className="w-4 h-4" />
            Nova Conversa
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3">
          <p className={`text-xs ${theme.textMuted} font-medium px-2 mb-2 tracking-wide`}>RECENTES</p>
          <div className="space-y-1">
            {fakeConversations.map((conv) => (
              <div key={conv.id} className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${conv.active ? theme.accentLight : (darkMode ? 'hover:bg-slate-800' : 'hover:bg-sky-50')}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${conv.active ? 'bg-sky-600 text-white' : (darkMode ? 'bg-slate-700 text-slate-400' : 'bg-sky-100 text-sky-600')}`}>
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${conv.active ? (darkMode ? 'text-sky-300' : 'text-sky-900') : theme.text}`}>{conv.title}</p>
                  <p className={`text-xs ${theme.textMuted}`}>{conv.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard & Settings */}
        <div className="p-4 space-y-1">
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-sky-50'} transition-all`}>
            <LayoutDashboard className={`w-5 h-5 ${theme.textSecondary}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>Dashboard</span>
          </button>
          <button onClick={() => setSettingsOpen(true)} className={`w-full flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-sky-50'} transition-all`}>
            <Settings className={`w-5 h-5 ${theme.textSecondary}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>Configurações</span>
          </button>
        </div>
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-1/2 -translate-y-1/2 ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'} p-1.5 rounded-r-lg border ${theme.border} border-l-0 shadow-sm hover:shadow-md transition-all z-10`}
        style={{ left: sidebarOpen ? '288px' : '0' }}
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`${theme.card} border-b ${theme.border} px-6 py-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${theme.text}`}>Assistente Varejo</h1>
              <p className={`text-xs ${theme.textMuted}`}>Online • Pronto para ajudar</p>
            </div>
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-sky-100'} transition-colors`}>
            {darkMode ? <Sun className={`w-5 h-5 ${theme.textSecondary}`} /> : <Moon className={`w-5 h-5 ${theme.textSecondary}`} />}
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            {fakeMessages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center ${message.role === 'assistant' ? 'bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/25' : (darkMode ? 'bg-slate-700' : 'bg-sky-200')}`}>
                  {message.role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <User className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-sky-700'}`} />}
                </div>
                <div className="max-w-[75%]">
                  <div className={`rounded-2xl px-5 py-4 ${message.role === 'assistant' ? `${theme.card} border ${theme.border} shadow-sm` : `${theme.accent} text-white shadow-lg shadow-sky-500/25`}`}>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === 'assistant' ? theme.text : 'text-white'}`}>{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 pt-0">
          <div className={`max-w-3xl mx-auto ${darkMode ? 'bg-slate-800/80' : 'bg-white/80'} backdrop-blur-xl rounded-2xl p-2 shadow-lg`}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua pergunta..."
                className={`flex-1 bg-transparent outline-none text-sm ${theme.text} px-3 py-3`}
              />
              <button className={`p-3 rounded-xl ${inputValue.trim() ? `${theme.accent} text-white shadow-lg shadow-sky-500/25` : (darkMode ? 'bg-slate-700 text-slate-500' : 'bg-sky-100 text-sky-400')} transition-all hover:scale-105 active:scale-95`}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className={`text-xs ${theme.textMuted} text-center mt-3`}>Assistente pode cometer erros. Verifique informações importantes.</p>
        </div>
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${theme.card} rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl border ${theme.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${theme.text}`}>Configurações</h2>
              <button onClick={() => setSettingsOpen(false)} className={`p-2 rounded-xl ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-sky-100'}`}>
                <X className={`w-5 h-5 ${theme.textSecondary}`} />
              </button>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-sky-50'}`}>
              <div>
                <p className={`font-semibold ${theme.text}`}>Tema</p>
                <p className={`text-sm ${theme.textMuted}`}>{darkMode ? 'Escuro' : 'Claro'}</p>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-8 rounded-full relative transition-colors ${darkMode ? 'bg-sky-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button onClick={() => setSettingsOpen(false)} className={`w-full mt-6 py-3.5 ${theme.accent} ${theme.accentHover} text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-all`}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

