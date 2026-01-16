'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Database, History, Users, Check, Loader2, AlertCircle, Settings, Moon, Sun, Globe, ChevronDown } from 'lucide-react'
import { useStore } from '@/lib/store'
import { connectionsAPI, agentsAPI } from '@/lib/api'
import type { Connection } from '@/lib/types'
import { useTranslation } from '@/hooks/useTranslation'

interface SettingsModalChatProps {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
  onToggleDarkMode?: () => void
}

type TabType = 'system' | 'connections' | 'history'

interface MenuItem {
  id: TabType
  label: string
  icon: React.ReactNode
}

export default function SettingsModalChat({ isOpen, onClose, darkMode, onToggleDarkMode }: SettingsModalChatProps) {
  const router = useRouter()
  const { selectedAgent, setSelectedAgent } = useStore()
  const [activeTab, setActiveTab] = useState<TabType>('system')

  // Translation hook
  const { t, language, setLanguage } = useTranslation()

  // Connections state
  const [connections, setConnections] = useState<Connection[]>([])

  // New connection modal
  const [showNewConnectionModal, setShowNewConnectionModal] = useState(false)
  const [newConnectionType, setNewConnectionType] = useState<'postgres' | 'mysql' | 'oracle'>('postgres')
  const [newConnHost, setNewConnHost] = useState('')
  const [newConnPort, setNewConnPort] = useState('')
  const [newConnUser, setNewConnUser] = useState('')
  const [newConnPassword, setNewConnPassword] = useState('')
  const [newConnDatabase, setNewConnDatabase] = useState('')
  const [creatingConnection, setCreatingConnection] = useState(false)
  const [validatingNewConnection, setValidatingNewConnection] = useState(false)
  const [newConnectionTestResult, setNewConnectionTestResult] = useState<{ valid: boolean; message: string } | null>(null)

  // History state
  const [historyEnabled, setHistoryEnabled] = useState(true)

  // Language dropdown state
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  // Menu items - using translations
  const menuItems: MenuItem[] = [
    { id: 'system', label: t.settings.system, icon: <Settings className="w-4 h-4" /> },
    { id: 'connections', label: t.settings.connections, icon: <Database className="w-4 h-4" /> },
    { id: 'history', label: t.settings.historyTab, icon: <History className="w-4 h-4" /> },
  ]

  // Theme styles - Sidebar matching chat sidebar
  const sidebarBg = darkMode ? 'bg-black/40' : 'bg-slate-100'
  const contentBg = darkMode ? 'bg-slate-900' : 'bg-white'
  const borderColor = darkMode ? 'border-white/10' : 'border-slate-200'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-white/70' : 'text-gray-600'
  const textMuted = darkMode ? 'text-white/40' : 'text-gray-400'
  const hoverBg = darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'
  const activeBg = darkMode ? 'bg-white/10' : 'bg-slate-200'
  const cardBg = darkMode ? 'bg-white/5' : 'bg-slate-50'
  const inputStyle = darkMode
    ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30'
    : 'bg-slate-50 border-slate-200 text-gray-900 placeholder:text-gray-400 focus:border-slate-400'
  const buttonPrimary = darkMode
    ? 'bg-white/10 hover:bg-white/15 text-white'
    : 'bg-slate-800 hover:bg-slate-700 text-white'
  const buttonSecondary = darkMode
    ? 'bg-white/5 hover:bg-white/10 text-white/70'
    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
  const buttonSelector = darkMode
    ? 'bg-white/5 text-white/60 hover:bg-white/10'
    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
  const buttonSelectorActive = darkMode
    ? 'bg-white/15 text-white'
    : 'bg-slate-800 text-white'
  // Card border - no border in dark mode (except for special cases)
  const cardBorder = darkMode ? '' : `border ${borderColor}`

  useEffect(() => {
    if (isOpen && selectedAgent) {
      loadConnections()
      setHistoryEnabled(true)
    }
  }, [isOpen, selectedAgent])

  const loadConnections = async () => {
    try {
      const data = await connectionsAPI.list()
      setConnections(data)
    } catch (error) {
      console.error('Error loading connections:', error)
    }
  }

  const handleChangeAgent = () => {
    setSelectedAgent(null)
    router.push('/select-agent')
  }

  const buildDsn = () => {
    if (!newConnHost || !newConnPort || !newConnUser || !newConnPassword || !newConnDatabase) {
      return ''
    }
    if (newConnectionType === 'postgres') {
      return `postgresql://${newConnUser}:${newConnPassword}@${newConnHost}:${newConnPort}/${newConnDatabase}`
    } else if (newConnectionType === 'mysql') {
      return `mysql://${newConnUser}:${newConnPassword}@${newConnHost}:${newConnPort}/${newConnDatabase}`
    } else if (newConnectionType === 'oracle') {
      return `oracle://${newConnUser}:${newConnPassword}@${newConnHost}:${newConnPort}/${newConnDatabase}`
    }
    return ''
  }

  const handleValidateNewConnection = async () => {
    const dsn = buildDsn()
    if (!dsn) {
      alert('Por favor, preencha todos os campos')
      return
    }
    setValidatingNewConnection(true)
    setNewConnectionTestResult(null)
    try {
      const result = await connectionsAPI.test(newConnectionType, dsn)
      setNewConnectionTestResult(result)
    } catch (error: any) {
      setNewConnectionTestResult({
        valid: false,
        message: error.response?.data?.detail || 'Erro ao validar conexão'
      })
    } finally {
      setValidatingNewConnection(false)
    }
  }

  const handleCreateConnection = async () => {
    const dsn = buildDsn()
    if (!dsn) {
      alert('Por favor, preencha todos os campos')
      return
    }
    setCreatingConnection(true)
    try {
      const payload: any = { tipo: newConnectionType }
      if (newConnectionType === 'postgres') {
        payload.pg_dsn = dsn
      } else if (newConnectionType === 'mysql') {
        payload.mysql_dsn = dsn
      } else if (newConnectionType === 'oracle') {
        payload.oracle_dsn = dsn
      }

      if (selectedAgent && selectedAgent.connection_id) {
        await connectionsAPI.update(selectedAgent.connection_id, payload)
        const updatedAgent = await agentsAPI.get(selectedAgent.id)
        setSelectedAgent(updatedAgent)
        await loadConnections()
      } else {
        const newConnection = await connectionsAPI.create(payload)
        if (selectedAgent) {
          await agentsAPI.update(selectedAgent.id, { connection_id: newConnection.id })
          const updatedAgent = await agentsAPI.get(selectedAgent.id)
          setSelectedAgent(updatedAgent)
        }
        await loadConnections()
      }

      resetConnectionForm()
      alert(t.settings.connectionSuccess)
    } catch (error: any) {
      alert(error.response?.data?.detail || t.settings.connectionError)
    } finally {
      setCreatingConnection(false)
    }
  }

  const resetConnectionForm = () => {
    setShowNewConnectionModal(false)
    setNewConnHost('')
    setNewConnPort('')
    setNewConnUser('')
    setNewConnPassword('')
    setNewConnDatabase('')
    setNewConnectionTestResult(null)
  }

  if (!isOpen) return null

  // Get current tab label
  const currentTabLabel = menuItems.find(item => item.id === activeTab)?.label || ''

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-3xl h-[520px] flex overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>

        {/* Sidebar Navigation */}
        <div className={`w-56 ${sidebarBg} flex flex-col border-r ${borderColor}`}>
          {/* Close button */}
          <div className="p-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${hoverBg} transition-all`}
            >
              <X className={`w-5 h-5 ${textSecondary}`} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? `${activeBg} ${textPrimary}`
                    : `${textSecondary} ${hoverBg}`
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Agent Switch Button at Bottom */}
          <div className="px-3 pb-3">
            <div className={`mb-3 border-t ${darkMode ? 'border-white/10' : 'border-slate-200'}`}></div>
            <button
              onClick={handleChangeAgent}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${textSecondary} ${hoverBg} transition-all`}
            >
              <Users className="w-4 h-4" />
              {t.settings.changeAgent}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col ${contentBg}`}>
          {/* Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Content Header */}
            <div className="mb-6">
              <h2 className={`text-lg font-semibold ${textPrimary}`}>{currentTabLabel}</h2>
              <div className={`mt-4 border-t ${borderColor}`}></div>
            </div>
            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                {/* Theme Option */}
                <div className="space-y-3">
                  <span className={`text-sm ${textSecondary}`}>{t.settings.theme}</span>
                  <div className="mt-2">
                    <div className={`flex items-center justify-between p-4 rounded-xl ${cardBg} ${cardBorder}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                          {darkMode ? <Moon className={`w-5 h-5 ${textSecondary}`} /> : <Sun className={`w-5 h-5 ${textSecondary}`} />}
                        </div>
                        <div>
                          <p className={`font-medium ${textPrimary} text-sm`}>{t.settings.appearance}</p>
                          <p className={`text-xs ${textMuted}`}>{darkMode ? t.settings.darkMode : t.settings.lightMode}</p>
                        </div>
                      </div>
                      {/* Theme Toggle Switch */}
                      <button
                        onClick={onToggleDarkMode}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          darkMode ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                          darkMode ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Language Option */}
                <div className="space-y-3">
                  <span className={`text-sm ${textSecondary}`}>{t.settings.language}</span>
                  <div className="mt-2">
                    <div className={`p-4 rounded-xl ${cardBg} ${cardBorder}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                            <Globe className={`w-5 h-5 ${textSecondary}`} />
                          </div>
                          <div>
                            <p className={`font-medium ${textPrimary} text-sm`}>{t.settings.systemLanguage}</p>
                            <p className={`text-xs ${textMuted}`}>{language === 'pt-br' ? t.settings.portuguese : t.settings.english}</p>
                          </div>
                        </div>
                        {/* Language Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${buttonSelector} transition-all`}
                          >
                            {language === 'pt-br' ? 'PT-BR' : 'EN'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {languageDropdownOpen && (
                            <div className={`absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg border ${borderColor} ${darkMode ? 'bg-slate-800' : 'bg-white'} z-10 overflow-hidden`}>
                              <button
                                onClick={() => { setLanguage('pt-br'); setLanguageDropdownOpen(false) }}
                                className={`w-full px-4 py-2.5 text-left text-sm ${language === 'pt-br' ? buttonSelectorActive : `${textSecondary} ${hoverBg}`} transition-all`}
                              >
                                {t.settings.portuguese}
                              </button>
                              <button
                                onClick={() => { setLanguage('en'); setLanguageDropdownOpen(false) }}
                                className={`w-full px-4 py-2.5 text-left text-sm ${language === 'en' ? buttonSelectorActive : `${textSecondary} ${hoverBg}`} transition-all`}
                              >
                                {t.settings.english}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Connections Tab */}
            {activeTab === 'connections' && (
              <div className="space-y-6">
                {/* Current Connection */}
                <div className="space-y-3">
                  <span className={`text-sm ${textSecondary}`}>{t.settings.currentConnection}</span>
                  <div className="mt-2">
                    {selectedAgent?.connection_id ? (
                      (() => {
                        const currentConnection = connections.find(c => c.id === selectedAgent.connection_id)
                        const dsn = currentConnection?.pg_dsn || currentConnection?.mysql_dsn || currentConnection?.oracle_dsn || currentConnection?.db_uri || ''
                        const hostMatch = dsn.match(/@([^:\/]+)/)
                        const host = hostMatch ? hostMatch[1] : 'Host desconhecido'

                        return currentConnection ? (
                          <div className={`p-4 rounded-xl ${cardBg} border ${darkMode ? 'border-emerald-500/30' : 'border-emerald-200'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                <Database className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium ${textPrimary} text-sm`}>{currentConnection.tipo.toUpperCase()}</p>
                                <p className={`text-xs ${textMuted}`}>{host}</p>
                              </div>
                              <div className={`px-2 py-1 rounded-md text-xs font-medium ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                                Conectado
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={`p-4 rounded-xl ${cardBg} ${cardBorder}`}>
                            <p className={`${textMuted} text-sm text-center`}>Conexão não encontrada</p>
                          </div>
                        )
                      })()
                    ) : (
                      <div className={`p-4 rounded-xl ${cardBg} ${cardBorder}`}>
                        <p className={`${textMuted} text-sm text-center`}>Nenhuma conexão configurada</p>
                      </div>
                    )}
                  </div>
                  {/* Hidden for client release - internal use only */}
                  <button
                    onClick={() => setShowNewConnectionModal(true)}
                    className={`hidden w-full px-4 py-2.5 text-sm font-medium rounded-xl ${buttonSecondary} transition-all flex items-center justify-center gap-2`}
                  >
                    <Database className="w-4 h-4" />
                    Alterar Conexão
                  </button>
                </div>

                {/* Divider */}
                <div className={`border-t ${borderColor}`}></div>

                {/* Agent Info */}
                <div className="space-y-3">
                  <span className={`text-sm ${textSecondary}`}>{t.settings.selectedAgent}</span>
                  <div className="mt-2">
                    <div className={`p-4 rounded-xl ${cardBg} ${cardBorder}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                          <Users className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${textPrimary} text-sm`}>{selectedAgent?.nome || t.settings.noAgent}</p>
                          <p className={`text-xs ${textMuted}`}>ID: {selectedAgent?.id || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* Toggle Option */}
                <div className="space-y-3">
                  <span className={`text-sm ${textSecondary}`}>{t.settings.manageHistory}</span>
                  <div className="mt-2">
                    <div className={`flex items-center justify-between p-4 rounded-xl ${cardBg} ${cardBorder}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                          <History className={`w-5 h-5 ${textSecondary}`} />
                        </div>
                        <div>
                          <p className={`font-medium ${textPrimary} text-sm`}>{t.settings.conversationHistory}</p>
                          <p className={`text-xs ${textMuted}`}>{t.settings.keepContext}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setHistoryEnabled(!historyEnabled)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          historyEnabled ? 'bg-emerald-500' : (darkMode ? 'bg-white/20' : 'bg-slate-300')
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                          historyEnabled ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    {t.settings.historyInfo}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Connection Modal */}
      {showNewConnectionModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-60 p-4"
          style={{ backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)' }}
          onClick={(e) => { if (e.target === e.currentTarget) resetConnectionForm() }}
        >
          <div className={`rounded-2xl shadow-2xl w-full max-w-md overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}>
              <h3 className={`text-base font-semibold ${textPrimary}`}>Alterar Conexão</h3>
              <button
                onClick={resetConnectionForm}
                className={`p-1.5 rounded-lg ${hoverBg} transition-all`}
              >
                <X className={`w-5 h-5 ${textSecondary}`} />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4 space-y-4">
              {/* Database Type Selector */}
              <div className="space-y-2">
                <label className={`text-sm ${textSecondary}`}>Tipo de banco</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['postgres', 'mysql', 'oracle'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewConnectionType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        newConnectionType === type
                          ? buttonSelectorActive
                          : buttonSelector
                      }`}
                    >
                      {type === 'postgres' ? 'PostgreSQL' : type === 'mysql' ? 'MySQL' : 'Oracle'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Connection Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={`text-sm ${textSecondary}`}>Host</label>
                  <input
                    type="text"
                    value={newConnHost}
                    onChange={(e) => setNewConnHost(e.target.value)}
                    placeholder="localhost"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${inputStyle} transition-all outline-none`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-sm ${textSecondary}`}>Porta</label>
                  <input
                    type="text"
                    value={newConnPort}
                    onChange={(e) => setNewConnPort(e.target.value)}
                    placeholder={newConnectionType === 'postgres' ? '5432' : newConnectionType === 'mysql' ? '3306' : '1521'}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm ${inputStyle} transition-all outline-none`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm ${textSecondary}`}>Usuário</label>
                <input
                  type="text"
                  value={newConnUser}
                  onChange={(e) => setNewConnUser(e.target.value)}
                  placeholder="postgres"
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${inputStyle} transition-all outline-none`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm ${textSecondary}`}>Senha</label>
                <input
                  type="password"
                  value={newConnPassword}
                  onChange={(e) => setNewConnPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${inputStyle} transition-all outline-none`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm ${textSecondary}`}>Database</label>
                <input
                  type="text"
                  value={newConnDatabase}
                  onChange={(e) => setNewConnDatabase(e.target.value)}
                  placeholder="mydb"
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${inputStyle} transition-all outline-none`}
                />
              </div>

              {/* Test Result */}
              {newConnectionTestResult && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  newConnectionTestResult.valid
                    ? (darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50')
                    : (darkMode ? 'bg-red-500/10' : 'bg-red-50')
                }`}>
                  {newConnectionTestResult.valid ? (
                    <Check className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  ) : (
                    <AlertCircle className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  )}
                  <p className={`text-sm ${
                    newConnectionTestResult.valid
                      ? (darkMode ? 'text-emerald-300' : 'text-emerald-700')
                      : (darkMode ? 'text-red-300' : 'text-red-700')
                  }`}>
                    {newConnectionTestResult.message}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className={`flex gap-3 px-5 py-4 border-t ${borderColor}`}>
              <button
                onClick={handleValidateNewConnection}
                disabled={validatingNewConnection}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'bg-white/5 hover:bg-white/10 text-white/70'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {validatingNewConnection ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  'Testar conexão'
                )}
              </button>
              <button
                onClick={handleCreateConnection}
                disabled={creatingConnection}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'bg-white/10 hover:bg-white/15 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {creatingConnection ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Trocando...
                  </>
                ) : (
                  'Trocar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

