# AgentAPI Frontend

Front-end em Next.js 14 com TypeScript e Tailwind CSS para o sistema AgentAPI.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Axios** - Cliente HTTP
- **Zustand** - Gerenciamento de estado
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
frontend/
├── app/                    # App Router do Next.js
│   ├── login/             # Página de login
│   ├── select-agent/      # Seleção de agente
│   ├── dashboard/         # Chat principal
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial (redirect)
├── components/            # Componentes React
│   ├── ChatSidebar.tsx   # Menu lateral de conversas
│   ├── ChatInput.tsx     # Input de mensagens
│   └── SettingsModal.tsx # Modal de configurações
├── lib/                   # Utilitários e configurações
│   ├── api.ts            # Cliente API com Axios
│   ├── store.ts          # Store Zustand
│   ├── types.ts          # Tipos TypeScript
│   └── utils.ts          # Funções utilitárias
└── .env.local            # Variáveis de ambiente
```

## 🔧 Configuração

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://agentapi-production-f788.up.railway.app
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📱 Fluxo da Aplicação

### 1. **Login** (`/login`)
- Autenticação com email e senha
- Sem opção de cadastro (apenas login)
- Armazena JWT token no localStorage
- Redireciona para seleção de agente

### 2. **Seleção de Agente** (`/select-agent`)
- Carrossel de agentes disponíveis
- Mostra nome, descrição, ícone e recursos
- Botão de logout
- Usuários sem agentes não podem prosseguir
- Redireciona para dashboard após seleção

### 3. **Dashboard/Chat** (`/dashboard`)
- **Menu Lateral Esquerdo:**
  - Botão "Nova Conversa"
  - Lista de chat-sessions do agente selecionado
  - Botão de deletar conversa (hover)
  - Botão "Configurações" no rodapé

- **Área Principal:**
  - Header com nome do agente e conversa atual
  - Mensagens do chat (user e assistant)
  - Exibe SQL query quando disponível
  - Input de mensagem na parte inferior

### 4. **Modal de Configurações**
- **Aba Conexões:**
  - Lista de conexões disponíveis
  - Seleção de conexão para o agente
  - Botão "Testar Conexão"
  - Botão "Salvar Conexão"

- **Aba Histórico:**
  - Toggle para habilitar/desabilitar histórico
  - (Nota: histórico sempre ativo no backend atual)

- **Botão "Trocar Agente":**
  - Retorna para seleção de agente

## 🔌 Integração com API

### Endpoints Utilizados

#### Autenticação
- `POST /auth/login` - Login com email/senha
- `GET /auth/me` - Verificar usuário logado

#### Agentes
- `GET /agents` - Listar agentes do usuário
- `GET /agents/{id}` - Detalhes do agente
- `PATCH /agents/{id}` - Atualizar agente (conexão, histórico)

#### Chat Sessions
- `GET /chat-sessions?agent_id={id}` - Listar conversas
- `POST /chat-sessions` - Criar nova conversa
- `GET /chat-sessions/{id}/messages` - Mensagens da conversa
- `DELETE /chat-sessions/{id}` - Deletar conversa

#### Runs (Execução de Queries)
- `POST /agents/{id}/run` - Enviar pergunta
- `GET /runs/{id}` - Obter resultado (polling)

#### Conexões
- `GET /connections` - Listar conexões
- `POST /connections/test` - Validar conexão

### Autenticação

Todas as requisições (exceto login) incluem o token JWT:

```typescript
Authorization: Bearer <token>
```

### Polling de Resultados

Após enviar uma pergunta via `POST /agents/{id}/run`, o sistema faz polling do resultado:

1. Cria run com status "queued"
2. Aguarda 2 segundos
3. Faz polling a cada 1 segundo
4. Máximo de 60 tentativas (60 segundos)
5. Atualiza mensagem quando status = "success" ou "failure"

## 🎨 Componentes Principais

### `ChatSidebar`
- Lista chat-sessions do agente
- Botão criar nova conversa
- Botão deletar conversa
- Botão configurações

### `ChatInput`
- Input de mensagem
- Envio de pergunta
- Criação automática de session se não existir
- Polling de resultado

### `SettingsModal`
- Tabs: Conexões e Histórico
- Teste de conexão
- Atualização de agente
- Botão trocar agente

## 🚢 Deploy na Vercel

### 1. Conectar Repositório

```bash
# Fazer commit das mudanças
git add frontend/
git commit -m "feat: adicionar frontend Next.js"
git push
```

### 2. Criar Projeto na Vercel

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Selecione o repositório
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 3. Configurar Variáveis de Ambiente

Na Vercel, adicione:

```
NEXT_PUBLIC_API_URL=https://agentapi-production-f788.up.railway.app
```

### 4. Deploy

Clique em "Deploy" e aguarde!

## 📝 Notas Importantes

- **Isolamento:** Todo código do frontend está na pasta `frontend/`
- **Sem arquivos na raiz:** Nenhum arquivo do frontend na pasta raiz do projeto
- **API em produção:** Conecta diretamente com Railway
- **Roles:** Sistema suporta USER, ADMIN, SUPER_ADMIN
- **Chat-sessions:** Cada agente tem suas próprias conversas
- **Histórico:** Sempre ativo (campo `processing_enabled` no backend)

## 🐛 Troubleshooting

### Erro de CORS
Verifique se a API permite requisições do domínio da Vercel.

### Token expirado
O sistema redireciona automaticamente para login quando o token expira (401).

### Polling timeout
Se a query demorar mais de 60 segundos, mostra mensagem de timeout.

## 📚 Próximos Passos

- [ ] Adicionar testes unitários
- [ ] Implementar loading states mais elaborados
- [ ] Adicionar notificações toast
- [ ] Implementar paginação infinita nas mensagens
- [ ] Adicionar suporte a markdown nas respostas
- [ ] Implementar WebSocket para updates em tempo real

---

**Desenvolvido para AgentAPI** 🚀
