'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Users, MessageSquare, Database, Activity, Zap, BarChart3, Clock } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function DashboardPage() {
  const router = useRouter()
  const { user, selectedAgent } = useStore()

  const stats = [
    {
      title: 'Total de Consultas',
      value: '12,847',
      change: '+12.5%',
      trend: 'up',
      icon: Database,
      color: 'bg-blue-500'
    },
    {
      title: 'Usuários Ativos',
      value: '2,341',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Conversas Hoje',
      value: '847',
      change: '+23.1%',
      trend: 'up',
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Tempo Médio',
      value: '1.2s',
      change: '-5.4%',
      trend: 'down',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ]

  const recentActivity = [
    { user: 'João Silva', action: 'Executou consulta SQL', time: '2 min atrás', status: 'success' },
    { user: 'Maria Santos', action: 'Criou novo agente', time: '15 min atrás', status: 'success' },
    { user: 'Pedro Costa', action: 'Atualizou dashboard', time: '1 hora atrás', status: 'success' },
    { user: 'Ana Oliveira', action: 'Exportou relatório', time: '2 horas atrás', status: 'success' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user?.nome || 'Usuário'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Sistema Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Performance do Sistema</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {['CPU', 'Memória', 'Rede', 'Disco'].map((resource, index) => {
                const values = [85, 62, 45, 73]
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{resource}</span>
                      <span className="text-sm text-gray-500">{values[index]}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${values[index]}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Agents and Queries */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Agentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Agentes Mais Utilizados</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {[
                { name: 'Vendas Analytics', queries: 3247, percentage: 85 },
                { name: 'Estoque Manager', queries: 2156, percentage: 65 },
                { name: 'Cliente Insights', queries: 1893, percentage: 55 },
                { name: 'Financeiro Bot', queries: 1421, percentage: 45 },
                { name: 'Marketing Data', queries: 987, percentage: 30 }
              ].map((agent, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                      <span className="text-xs text-gray-500">{agent.queries.toLocaleString()} queries</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
                        style={{ width: `${agent.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Queries Mais Executadas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Queries Mais Executadas</h2>
              <Database className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {[
                { query: 'SELECT vendas por região', count: 1247, time: '0.8s' },
                { query: 'SELECT estoque disponível', count: 1089, time: '1.2s' },
                { query: 'SELECT clientes ativos', count: 956, time: '0.5s' },
                { query: 'SELECT receita mensal', count: 834, time: '1.5s' },
                { query: 'SELECT produtos top 10', count: 721, time: '0.9s' }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-mono text-gray-700 mb-1">{item.query}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {item.count}x executada
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time} média
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Database Connections */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Conexões de Banco de Dados</h2>
            <Zap className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'PostgreSQL', status: 'online', connections: 45, color: 'bg-blue-500' },
              { name: 'MySQL', status: 'online', connections: 32, color: 'bg-orange-500' },
              { name: 'MongoDB', status: 'online', connections: 28, color: 'bg-green-500' },
              { name: 'Redis Cache', status: 'online', connections: 67, color: 'bg-red-500' }
            ].map((db, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${db.color} w-3 h-3 rounded-full`}></div>
                  <span className="text-sm font-semibold text-gray-900">{db.name}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Status: <span className="text-green-600 font-medium">{db.status}</span></p>
                  <p className="text-xs text-gray-500">Conexões: <span className="text-gray-900 font-medium">{db.connections}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

