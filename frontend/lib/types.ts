// User & Auth Types
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export interface User {
  id: number
  email: string
  nome: string
  ativo: boolean
  role: UserRole
  created_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// Agent Types
export interface Agent {
  id: number
  owner_user_id: number
  nome: string
  connection_id: number | null
  selected_model: string
  top_k: number
  include_tables_key: string | null
  advanced_mode: boolean
  processing_enabled: boolean
  refinement_enabled: boolean
  single_table_mode: boolean
  selected_table: string | null
  description: string | null
  icon: string | null
  color: string | null
  features: string[] | null
  sql_context_id: number | null
  processing_context_id: number | null
  version: number
  created_at: string
  updated_at: string
}

// Connection Types
export interface Connection {
  id: number
  owner_user_id: number | null
  tipo: string
  db_uri: string | null
  pg_dsn: string | null
  mysql_dsn: string | null
  oracle_dsn: string | null
  created_at: string
}

export interface ConnectionTestResponse {
  valid: boolean
  message: string
  tipo: string
}

// Chat Session Types
export interface ChatSession {
  id: number
  title: string
  last_message: string | null
  messages_count: number
  updated_at: string
  status: string
  agent_id: number
}

export interface ChatSessionListResponse {
  sessions: ChatSession[]
  pagination: PaginationInfo
}

export interface PaginationInfo {
  page: number
  per_page: number
  total_items: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// Message Types
export interface Message {
  id: number
  chat_session_id: number
  run_id: number | null
  role: "user" | "assistant" | "system"
  content: string
  sql_query: string | null
  graph_url: string | null
  created_at: string
  sequence_order: number
  message_metadata: Record<string, any> | null
}

export interface MessagesResponse {
  messages: Message[]
  pagination: {
    page: number
    per_page: number
    total_items: number
    total_pages: number
  }
  session_info: {
    id: number
    title: string
    total_messages: number
  }
}

// Run Types
export interface Run {
  id: number
  agent_id: number
  user_id: number
  question: string
  task_id: string | null
  sql_used: string | null
  result_data: string | null
  graph_url: string | null
  status: "queued" | "running" | "success" | "failure"
  execution_ms: number | null
  result_rows_count: number | null
  error_type: string | null
  created_at: string
  finished_at: string | null
  chat_session_id: number | null
}

export interface RunCreate {
  question: string
  chat_session_id?: number
}

