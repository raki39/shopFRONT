export const translations = {
  'pt-br': {
    // Common
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      save: 'Salvar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      finish: 'Concluir',
      close: 'Fechar',
      online: 'Online',
      poweredBy: 'POWERED BY',
      logout: 'Sair',
    },
    
    // Login page
    login: {
      email: 'Email',
      emailPlaceholder: 'seu@email.com',
      password: 'Senha',
      passwordPlaceholder: '••••••••',
      submit: 'Entrar',
      loading: 'Entrando...',
      error: 'Erro ao fazer login. Verifique suas credenciais.',
      footer: 'AgentAPI © 2024 - Sistema de Agentes Inteligentes',
    },
    
    // Select Agent page
    selectAgent: {
      loadingAgents: 'Carregando agentes...',
      selectAssistant: 'Selecione seu Assistente',
      title: 'Com qual agente você quer conversar?',
      subtitle: 'Escolha um dos agentes disponíveis para iniciar sua análise de dados',
      noAgents: 'Nenhum Agente Disponível',
      noAgentsDesc: 'Não há agentes configurados para sua conta. Entre em contato com o administrador.',
      backToLogin: 'Voltar ao Login',
      defaultDescription: 'Agente inteligente para análise de dados',
      startConversation: 'Iniciar conversa',
      capabilities: 'Capacidades',
      agentAvailable: 'agente disponível para sua conta',
      agentsAvailable: 'agentes disponíveis para sua conta',
    },
    
    // Chat page
    chat: {
      assistant: 'ASSISTENTE',
      history: 'HISTÓRICO',
      newChat: 'Nova conversa',
      searchPlaceholder: 'Buscar conversas...',
      noConversations: 'Nenhuma conversa',
      dashboard: 'Dashboard',
      settings: 'Configurações',
      changeAgent: 'Trocar de agente',
      greeting: 'Olá!',
      greetingMessage: 'Estou pronto para analisar seus dados e responder suas perguntas.',
      inputPlaceholder: 'Pergunte sobre vendas, produtos, tendências...',
      conversation: 'Conversa',
      aiDisclaimer: 'pode cometer erros. Considere verificar informações importantes.',
      messages: 'mensagens',
      emptyConversation: 'Conversa vazia',
      sendMessageToStart: 'Envie uma mensagem para começar',
      confirmDelete: 'Deseja realmente deletar esta conversa?',
      deleteError: 'Erro ao deletar conversa',
      speechNotSupported: 'Reconhecimento de voz não suportado neste navegador. Por favor, use Chrome, Edge ou Safari.',
      speechListening: 'Ouvindo...',
      speechStop: 'Parar',
      speechLoading: 'Carregando modelo de voz...',
      suggestions: {
        salesAnalysis: 'Análise de vendas',
        salesQuery: 'Qual foi o total de vendas do último mês?',
        highlights: 'Destaques do Mês',
        highlightsQuery: 'Quais produtos tiveram melhor desempenho?',
        trends: 'Tendências',
        trendsQuery: 'Quais são as tendências de compra atuais?',
        quickReport: 'Relatório rápido',
        quickReportQuery: 'Gere um resumo do desempenho da loja',
      },
    },
    
    // Settings modal
    settings: {
      title: 'Configurações',
      system: 'Sistema',
      connections: 'Conexões',
      historyTab: 'Histórico',
      
      // Theme
      theme: 'Tema',
      appearance: 'Aparência',
      darkMode: 'Modo escuro',
      lightMode: 'Modo claro',
      
      // Language
      language: 'Idioma',
      systemLanguage: 'Idioma do sistema',
      portuguese: 'Português (Brasil)',
      english: 'English',
      
      // Connections
      currentConnection: 'Conexão atual',
      connected: 'Conectado',
      noConnection: 'Sem conexão configurada',
      noConnectionDesc: 'Configure uma conexão de banco de dados para o agente',
      selectedAgent: 'Agente selecionado',
      noAgent: 'Sem agente',
      changeAgent: 'Trocar agente',
      
      // Connection form
      connectionType: 'Tipo',
      host: 'Host',
      port: 'Porta',
      database: 'Banco de dados',
      user: 'Usuário',
      password: 'Senha',
      saveConnection: 'Salvar Conexão',
      saving: 'Salvando...',
      connectionSuccess: 'Conexão atualizada com sucesso!',
      connectionError: 'Erro ao atualizar conexão',
      
      // History
      manageHistory: 'Gerenciar histórico',
      conversationHistory: 'Histórico de conversas',
      keepContext: 'Mantém contexto entre mensagens',
      historyInfo: 'O histórico está sempre ativo no sistema atual. Esta configuração é apenas para preferência visual.',
    },
    
    // Onboarding
    onboarding: {
      welcome: 'Bem-vindo ao Varejo 180!',
      welcomeDesc: 'Este é seu Assistente de análise de dados. Vamos fazer um tour rápido para você conhecer a plataforma.',
      agents: 'Seus Assistentes de IA',
      agentsDesc: 'Aqui estão os Assistentes disponíveis. Cada Assistente possui habilidades específicas para responder suas perguntas sobre o negócio.',
      startConversation: 'Inicie uma Conversa',
      startConversationDesc: 'Clique em um card de Assistente para começar. Você será direcionado para o chat onde poderá fazer suas perguntas.',
      conversationHistory: 'Histórico de Conversas',
      conversationHistoryDesc: 'Nesta barra lateral ficam todas as suas conversas anteriores. Você pode acessá-las a qualquer momento.',
      newConversation: 'Nova Conversa',
      newConversationDesc: 'Clique aqui para iniciar uma nova conversa com o Assistente. Cada conversa fica salva automaticamente.',
      askQuestion: 'Faça sua Pergunta',
      askQuestionDesc: 'Digite sua pergunta aqui em linguagem natural. O Assistente irá analisar seus dados e responder com insights.',
      settingsTitle: 'Configurações',
      settingsDesc: 'Acesse as configurações do sistema e personalize suas preferências.',
      toggleTheme: 'Alternar Tema',
      toggleThemeDesc: 'Alterne entre o tema claro e escuro conforme sua preferência visual.',
    },
  },
  
  'en': {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      close: 'Close',
      online: 'Online',
      poweredBy: 'POWERED BY',
      logout: 'Logout',
    },
    
    // Login page
    login: {
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      submit: 'Sign In',
      loading: 'Signing in...',
      error: 'Login failed. Please check your credentials.',
      footer: 'AgentAPI © 2024 - Intelligent Agents System',
    },

    // Select Agent page
    selectAgent: {
      loadingAgents: 'Loading agents...',
      selectAssistant: 'Select your Assistant',
      title: 'Which agent would you like to talk to?',
      subtitle: 'Choose one of the available agents to start your data analysis',
      noAgents: 'No Agents Available',
      noAgentsDesc: 'There are no agents configured for your account. Please contact the administrator.',
      backToLogin: 'Back to Login',
      defaultDescription: 'Intelligent agent for data analysis',
      startConversation: 'Start conversation',
      capabilities: 'Capabilities',
      agentAvailable: 'agent available for your account',
      agentsAvailable: 'agents available for your account',
    },

    // Chat page
    chat: {
      assistant: 'ASSISTANT',
      history: 'HISTORY',
      newChat: 'New chat',
      searchPlaceholder: 'Search conversations...',
      noConversations: 'No conversations',
      dashboard: 'Dashboard',
      settings: 'Settings',
      changeAgent: 'Change agent',
      greeting: 'Hello!',
      greetingMessage: "I'm ready to analyze your data and answer your questions.",
      inputPlaceholder: 'Ask about sales, products, trends...',
      conversation: 'Conversation',
      aiDisclaimer: 'may make mistakes. Consider verifying important information.',
      messages: 'messages',
      emptyConversation: 'Empty conversation',
      sendMessageToStart: 'Send a message to start',
      confirmDelete: 'Do you really want to delete this conversation?',
      deleteError: 'Error deleting conversation',
      speechNotSupported: 'Voice recognition not supported in this browser. Please use Chrome, Edge or Safari.',
      speechListening: 'Listening...',
      speechStop: 'Stop',
      speechLoading: 'Loading voice model...',
      suggestions: {
        salesAnalysis: 'Sales analysis',
        salesQuery: 'What was the total sales last month?',
        highlights: 'Month Highlights',
        highlightsQuery: 'Which products performed best?',
        trends: 'Trends',
        trendsQuery: 'What are the current buying trends?',
        quickReport: 'Quick report',
        quickReportQuery: 'Generate a store performance summary',
      },
    },
    
    // Settings modal
    settings: {
      title: 'Settings',
      system: 'System',
      connections: 'Connections',
      historyTab: 'History',
      
      // Theme
      theme: 'Theme',
      appearance: 'Appearance',
      darkMode: 'Dark mode',
      lightMode: 'Light mode',
      
      // Language
      language: 'Language',
      systemLanguage: 'System language',
      portuguese: 'Português (Brasil)',
      english: 'English',
      
      // Connections
      currentConnection: 'Current connection',
      connected: 'Connected',
      noConnection: 'No connection configured',
      noConnectionDesc: 'Configure a database connection for the agent',
      selectedAgent: 'Selected agent',
      noAgent: 'No agent',
      changeAgent: 'Change agent',
      
      // Connection form
      connectionType: 'Type',
      host: 'Host',
      port: 'Port',
      database: 'Database',
      user: 'User',
      password: 'Password',
      saveConnection: 'Save Connection',
      saving: 'Saving...',
      connectionSuccess: 'Connection updated successfully!',
      connectionError: 'Error updating connection',

      // History
      manageHistory: 'Manage history',
      conversationHistory: 'Conversation history',
      keepContext: 'Keeps context between messages',
      historyInfo: 'History is always active in the current system. This setting is for visual preference only.',
    },
    
    // Onboarding
    onboarding: {
      welcome: 'Welcome to Varejo 180!',
      welcomeDesc: "This is your data analysis Assistant. Let's take a quick tour to help you get to know the platform.",
      agents: 'Your AI Assistants',
      agentsDesc: 'Here are the available Assistants. Each Assistant has specific skills to answer your business questions.',
      startConversation: 'Start a Conversation',
      startConversationDesc: 'Click on an Assistant card to begin. You will be directed to the chat where you can ask your questions.',
      conversationHistory: 'Conversation History',
      conversationHistoryDesc: 'All your previous conversations are in this sidebar. You can access them at any time.',
      newConversation: 'New Conversation',
      newConversationDesc: 'Click here to start a new conversation with the Assistant. Each conversation is saved automatically.',
      askQuestion: 'Ask a Question',
      askQuestionDesc: 'Type your question here in natural language. The Assistant will analyze your data and respond with insights.',
      settingsTitle: 'Settings',
      settingsDesc: 'Access system settings and customize your preferences.',
      toggleTheme: 'Toggle Theme',
      toggleThemeDesc: 'Switch between light and dark theme according to your visual preference.',
    },
  },
} as const

export type TranslationKeys = typeof translations['pt-br']

