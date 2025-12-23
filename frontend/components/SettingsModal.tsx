'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Database, History, ArrowLeft, Check, Loader2, AlertCircle, Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import { connectionsAPI, agentsAPI } from '@/lib/api'
import type { Connection } from '@/lib/types'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const router = useRouter()
  const { selectedAgent, setSelectedAgent } = useStore()
  const [activeTab, setActiveTab] = useState<'connections' | 'history'>('connections')
  
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
  const [savingHistory, setSavingHistory] = useState(false)

  useEffect(() => {
    if (isOpen && selectedAgent) {
      loadConnections()
      // Note: history is always enabled in the current API, this is just UI
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

      // Se o agente já tem uma conexão, atualiza ela ao invés de criar uma nova
      if (selectedAgent && selectedAgent.connection_id) {
        await connectionsAPI.update(selectedAgent.connection_id, payload)

        // Recarrega o agente para pegar os dados atualizados
        const updatedAgent = await agentsAPI.get(selectedAgent.id)
        setSelectedAgent(updatedAgent)

        // Reload connections para atualizar a UI
        await loadConnections()
      } else {
        // Se não tem conexão, cria uma nova
        const newConnection = await connectionsAPI.create(payload)

        // Update agent with new connection
        if (selectedAgent) {
          await agentsAPI.update(selectedAgent.id, {
            connection_id: newConnection.id
          })
          const updatedAgent = await agentsAPI.get(selectedAgent.id)
          setSelectedAgent(updatedAgent)
        }

        // Reload connections para atualizar a UI
        await loadConnections()
      }

      // Close modal and reset form
      setShowNewConnectionModal(false)
      setNewConnHost('')
      setNewConnPort('')
      setNewConnUser('')
      setNewConnPassword('')
      setNewConnDatabase('')
      setNewConnectionTestResult(null)

      alert('Conexão atualizada com sucesso!')
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erro ao atualizar conexão')
    } finally {
      setCreatingConnection(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 px-6 py-4 font-medium transition-all ${
              activeTab === 'connections'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-5 h-5 inline-block mr-2" />
            Conexões
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 font-medium transition-all ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <History className="w-5 h-5 inline-block mr-2" />
            Histórico
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'connections' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Conexão Atual
                </h3>
                {selectedAgent?.connection_id ? (
                  (() => {
                    const currentConnection = connections.find(c => c.id === selectedAgent.connection_id)
                    return currentConnection ? (
                      <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                        <div className="flex items-start gap-3">
                          <Database className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm mb-1">
                              {currentConnection.tipo.toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-600 break-all">
                              {currentConnection.pg_dsn || currentConnection.mysql_dsn || currentConnection.oracle_dsn || currentConnection.db_uri}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Conexão não encontrada
                      </p>
                    )
                  })()
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma conexão configurada
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewConnectionModal(true)}
                  className="w-full px-4 py-2.5 text-sm bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Trocar Conexão
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Gerenciar Histórico
                </h3>
                <p className="text-gray-600 mb-6">
                  O histórico de conversas permite que o agente mantenha contexto entre as mensagens.
                </p>
                
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="checkbox"
                    checked={historyEnabled}
                    onChange={(e) => setHistoryEnabled(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Habilitar Histórico</p>
                    <p className="text-sm text-gray-500">
                      Mantém o contexto das conversas anteriores
                    </p>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> O histórico está sempre ativo no sistema atual. Esta configuração é apenas visual.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleChangeAgent}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Trocar Agente
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* New Connection Modal */}
      {showNewConnectionModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Nova Conexão</h3>
              <button
                onClick={() => {
                  setShowNewConnectionModal(false)
                  setNewConnHost('')
                  setNewConnPort('')
                  setNewConnUser('')
                  setNewConnPassword('')
                  setNewConnDatabase('')
                  setNewConnectionTestResult(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Database Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Banco
                </label>
                <select
                  value={newConnectionType}
                  onChange={(e) => setNewConnectionType(e.target.value as 'postgres' | 'mysql' | 'oracle')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="postgres">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="oracle">Oracle</option>
                </select>
              </div>

              {/* Connection Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Host
                  </label>
                  <input
                    type="text"
                    value={newConnHost}
                    onChange={(e) => setNewConnHost(e.target.value)}
                    placeholder="localhost"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Porta
                  </label>
                  <input
                    type="text"
                    value={newConnPort}
                    onChange={(e) => setNewConnPort(e.target.value)}
                    placeholder={newConnectionType === 'postgres' ? '5432' : newConnectionType === 'mysql' ? '3306' : '1521'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Usuário
                </label>
                <input
                  type="text"
                  value={newConnUser}
                  onChange={(e) => setNewConnUser(e.target.value)}
                  placeholder="postgres"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Senha
                </label>
                <input
                  type="password"
                  value={newConnPassword}
                  onChange={(e) => setNewConnPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Database
                </label>
                <input
                  type="text"
                  value={newConnDatabase}
                  onChange={(e) => setNewConnDatabase(e.target.value)}
                  placeholder="mydb"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Test Result */}
              {newConnectionTestResult && (
                <div className={`p-3 rounded-lg ${newConnectionTestResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    {newConnectionTestResult.valid ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <p className={`text-xs font-medium ${newConnectionTestResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                      {newConnectionTestResult.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleValidateNewConnection}
                  disabled={validatingNewConnection}
                  className="flex-1 px-3 py-2.5 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {validatingNewConnection ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    'Validar'
                  )}
                </button>
                <button
                  onClick={handleCreateConnection}
                  disabled={creatingConnection}
                  className="flex-1 px-3 py-2.5 text-sm bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </div>
      )}
    </div>
  )
}

