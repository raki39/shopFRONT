/**
 * Configurações padrão para novos usuários cadastrados
 *
 * Este arquivo contém as configurações de conexão, contexto e agente
 * que serão criados automaticamente para cada novo usuário registrado.
 *
 * Altere as variáveis abaixo conforme necessário.
 *
 * NOTA: Por enquanto, usamos a conexão e contexto do usuário 1 (usuário pai)
 * para todos os novos usuários. A criação de conexão e contexto está comentada.
 */

// ============================================
// CONFIGURAÇÃO DA CONEXÃO PADRÃO (COMENTADO)
// Usando conexão do usuário 1 por enquanto
// ============================================
// export const DEFAULT_CONNECTION = {
//   tipo: "postgres",
//   dataset_id: 0,
//   pg_dsn: "postgresql://postgres:EVnlgbsRRZtcjhUpPJpCyHbFGKPBHtpG@interchange.proxy.rlwy.net:10874/railway",
//   mysql_dsn: "",
//   oracle_dsn: "",
//   clickhouse_dsn: "",
// }

// ============================================
// CONFIGURAÇÃO DO CONTEXTO PADRÃO (COMENTADO)
// Usando contexto do usuário 1 por enquanto
// ============================================
// export const DEFAULT_CONTEXT = {
//   nome: "Contexto Nestle",
//   context_type: "sql_agent",
//   context_text: "Você é um assistente especializado em consultas SQL e análise de dados.\nResponda sempre em Português.\n\n## REGRAS IMPORTANTES:\n\n### ORDENAÇÃO POR PREÇO\n- Para \"produtos mais caros\" ou \"maiores preços\": ORDER BY preco_normal DESC (ou preco_a_vista DESC)\n- NUNCA use ORDER BY produto quando quiser ordenar por preço\n\n### PRODUTOS ÚNICOS\n- Para \"sem repetir produto\": Use GROUP BY produto com MAX(), MIN() ou AVG()\n- Exemplo: SELECT produto, MAX(preco_normal) as preco FROM nestle_cafe GROUP BY produto ORDER BY preco DESC LIMIT 10;\n\n### PREÇOS\n- Valores 0.00 são dados não disponíveis. Filtre com WHERE preco_normal > 0\n\n### DATAS\n- Formato: YYYY-MM-DD (ex: '2025-04-01')\n- Para período: WHERE data_inicio >= '2025-04-01' AND data_fim <= '2025-04-30'\n\n### AGREGAÇÕES\n- Contagem: COUNT(*)\n- Média: AVG(preco_normal)\n- Máximo/Mínimo: MAX(preco_normal), MIN(preco_normal)\n- Sempre use GROUP BY quando usar agregações com outras colunas\n\n### TEXTO E ACENTOS\n- Os valores no banco NÃO têm acentos (ex: SAO PAULO, PILAO, 3 CORACOES)\n- Use ILIKE para buscas parciais: WHERE marca ILIKE '%PILAO%'\n\n### COLUNAS PRINCIPAIS\nproduto, marca, preco_a_vista, preco_normal, bandeira_loja, estado, cidade, data_inicio, data_fim\n",
// }

// ============================================
// CONFIGURAÇÃO DO AGENTE PADRÃO
// ============================================
export const DEFAULT_AGENT = {
  nome: "Agente 180",
  // connection_id e sql_context_id serão definidos dinamicamente após criar conexão e contexto
  connection_id: 1,
  selected_model: "gpt-4o",
  top_k: 10,
  include_tables_key: "*",
  advanced_mode: false,
  processing_enabled: false,
  refinement_enabled: false,
  single_table_mode: false,
  selected_table: "",
  description: "Especializado em dados e informações",
  icon: "MessageSquare",
  color: "from-blue-500 to-cyan-500",
  features: [
    "Analise de dados",
    "Geração de gráficos",
    "Insights comercias"
  ],
  sql_context_id: 1,
  processing_context_id: 0,
}

