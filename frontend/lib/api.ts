import axios, { AxiosError } from 'axios'
import type {
  LoginResponse,
  User,
  Agent,
  Connection,
  ConnectionTestResponse,
  ChatSessionListResponse,
  ChatSession,
  MessagesResponse,
  Run,
  RunCreate,
} from './types'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand persist storage
    const storage = localStorage.getItem('agent-app-storage')
    if (storage) {
      try {
        const parsed = JSON.parse(storage)
        const token = parsed.state?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (e) {
        console.error('Error parsing token from storage:', e)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear everything
      localStorage.clear()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    
    const response = await api.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },
}

// Agents API
export const agentsAPI = {
  list: async (): Promise<Agent[]> => {
    const response = await api.get<Agent[]>('/agents')
    return response.data
  },

  get: async (id: number): Promise<Agent> => {
    const response = await api.get<Agent>(`/agents/${id}`)
    return response.data
  },

  update: async (id: number, data: Partial<Agent>): Promise<Agent> => {
    const response = await api.patch<Agent>(`/agents/${id}`, data)
    return response.data
  },
}

// Connections API
export const connectionsAPI = {
  list: async (): Promise<Connection[]> => {
    const response = await api.get<Connection[]>('/connections')
    return response.data
  },

  create: async (data: any): Promise<Connection> => {
    const response = await api.post<Connection>('/connections', data)
    return response.data
  },

  update: async (id: number, data: any): Promise<Connection> => {
    const response = await api.patch<Connection>(`/connections/${id}`, data)
    return response.data
  },

  test: async (tipo: string, dsn: string): Promise<ConnectionTestResponse> => {
    const payload: any = { tipo }

    if (tipo === 'postgres') {
      payload.pg_dsn = dsn
    } else if (tipo === 'mysql') {
      payload.mysql_dsn = dsn
    } else if (tipo === 'oracle') {
      payload.oracle_dsn = dsn
    }

    const response = await api.post<ConnectionTestResponse>('/connections/test', payload)
    return response.data
  },
}

// Chat Sessions API
export const chatSessionsAPI = {
  list: async (agentId: number, page = 1, perPage = 20): Promise<ChatSessionListResponse> => {
    const response = await api.get<ChatSessionListResponse>('/chat-sessions', {
      params: {
        agent_id: agentId,
        page,
        per_page: perPage,
        status: 'active',
      },
    })
    return response.data
  },

  get: async (sessionId: number): Promise<ChatSession> => {
    const response = await api.get<ChatSession>(`/chat-sessions/${sessionId}`)
    return response.data
  },

  create: async (agentId: number, title?: string): Promise<ChatSession> => {
    const response = await api.post<ChatSession>('/chat-sessions', {
      agent_id: agentId,
      title,
    })
    return response.data
  },

  getMessages: async (sessionId: number, page = 1, perPage = 50): Promise<MessagesResponse> => {
    const response = await api.get<MessagesResponse>(`/chat-sessions/${sessionId}/messages`, {
      params: { page, per_page: perPage },
    })
    return response.data
  },

  delete: async (sessionId: number): Promise<void> => {
    await api.delete(`/chat-sessions/${sessionId}`)
  },
}

// Runs API
export const runsAPI = {
  create: async (agentId: number, data: RunCreate): Promise<Run> => {
    const response = await api.post<Run>(`/agents/${agentId}/run`, data)
    return response.data
  },

  get: async (runId: number): Promise<Run> => {
    const response = await api.get<Run>(`/runs/${runId}`)
    return response.data
  },

  // Fetch graph image with authentication and return as blob URL
  getGraphBlobUrl: async (graphUrl: string): Promise<string> => {
    // Remove /api prefix if present (backend returns /api/runs/X/graph but route is /runs/X/graph)
    const cleanUrl = graphUrl.startsWith('/api') ? graphUrl.replace('/api', '') : graphUrl
    const fullUrl = `${API_URL}${cleanUrl}`

    // Get token from storage
    const storage = localStorage.getItem('agent-app-storage')
    let token = ''
    if (storage) {
      try {
        const parsed = JSON.parse(storage)
        token = parsed.state?.token || ''
      } catch (e) {
        console.error('Error parsing token from storage:', e)
      }
    }

    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch graph: ${response.status}`)
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  },
}

export default api

