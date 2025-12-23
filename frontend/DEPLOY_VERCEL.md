# 🚀 Guia de Deploy na Vercel

Este guia mostra como fazer o deploy do frontend AgentAPI na Vercel.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- API rodando no Railway: `https://agentapi-production-f788.up.railway.app`

## 🔧 Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que o código do frontend está commitado:

```bash
# Na raiz do projeto
git add frontend/
git commit -m "feat: adicionar frontend Next.js completo"
git push origin main
```

### 2. Criar Projeto na Vercel

#### Opção A: Via Dashboard Web

1. Acesse https://vercel.com/new
2. Clique em "Import Project"
3. Selecione seu repositório Git
4. Configure o projeto:

**Framework Preset:**
```
Next.js
```

**Root Directory:**
```
frontend
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```
npm install
```

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Na pasta frontend/
cd frontend

# Fazer login
vercel login

# Deploy
vercel
```

### 3. Configurar Variáveis de Ambiente

Na dashboard da Vercel, vá em:

**Settings → Environment Variables**

Adicione:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://agentapi-production-f788.up.railway.app` |

**Importante:** Marque para aplicar em:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Fazer Deploy

Clique em **"Deploy"** e aguarde!

A Vercel irá:
1. ✅ Clonar o repositório
2. ✅ Instalar dependências
3. ✅ Executar build
4. ✅ Fazer deploy

### 5. Verificar Deploy

Após o deploy, você receberá uma URL como:

```
https://seu-projeto.vercel.app
```

Teste:
1. Acesse a URL
2. Faça login
3. Selecione um agente
4. Envie uma mensagem

## 🔄 Deploys Automáticos

A Vercel faz deploy automático quando você:

- **Push para `main`** → Deploy em Production
- **Push para outras branches** → Deploy em Preview
- **Pull Request** → Deploy em Preview com URL única

## ⚙️ Configurações Avançadas

### Custom Domain

1. Vá em **Settings → Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### Build Settings

Se precisar customizar:

**package.json:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**vercel.json (opcional):**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Environment Variables por Branch

Você pode ter diferentes URLs de API por ambiente:

- **Production:** `https://agentapi-production-f788.up.railway.app`
- **Preview:** `https://agentapi-staging.up.railway.app` (se tiver)
- **Development:** `http://localhost:8000`

## 🐛 Troubleshooting

### Erro: "Module not found"

**Solução:** Verifique se todas as dependências estão no `package.json`:

```bash
cd frontend
npm install
```

### Erro: "API request failed"

**Solução:** Verifique:
1. Variável `NEXT_PUBLIC_API_URL` está configurada
2. API está rodando no Railway
3. CORS está configurado na API

### Erro: "Build failed"

**Solução:** Teste o build localmente:

```bash
cd frontend
npm run build
```

Se funcionar localmente, limpe o cache da Vercel:

**Settings → General → Clear Build Cache**

### Erro: "Token expired" imediatamente

**Solução:** Verifique se o token JWT está sendo salvo corretamente no localStorage.

## 📊 Monitoramento

### Analytics

A Vercel oferece analytics gratuito:

**Analytics → Overview**

Veja:
- Número de visitantes
- Páginas mais acessadas
- Performance

### Logs

Para ver logs de runtime:

**Deployments → [Seu Deploy] → Runtime Logs**

### Performance

Para ver métricas de performance:

**Speed Insights** (pode precisar ativar)

## 🔒 Segurança

### Variáveis de Ambiente

- ✅ Nunca commite `.env.local` no Git
- ✅ Use `NEXT_PUBLIC_` apenas para variáveis públicas
- ✅ Variáveis sem `NEXT_PUBLIC_` são server-side only

### Headers de Segurança

Adicione em `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## 📝 Checklist Final

Antes de fazer deploy em produção:

- [ ] Build local funciona (`npm run build`)
- [ ] Todas as páginas carregam corretamente
- [ ] Login funciona
- [ ] Seleção de agente funciona
- [ ] Chat envia e recebe mensagens
- [ ] Modal de configurações abre
- [ ] Teste de conexão funciona
- [ ] Logout funciona
- [ ] Variáveis de ambiente configuradas
- [ ] API está acessível
- [ ] CORS configurado na API

## 🎉 Pronto!

Seu frontend está no ar! 🚀

**URL de Produção:** https://seu-projeto.vercel.app

---

**Dúvidas?** Consulte a [documentação da Vercel](https://vercel.com/docs)

