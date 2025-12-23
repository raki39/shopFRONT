# 🚀 Deploy do Frontend na Vercel - Guia Rápido

## ✅ Pré-requisitos

- ✅ API rodando no Railway: `https://agentapi-production-f788.up.railway.app`
- ✅ Conta na Vercel: https://vercel.com
- ✅ Código commitado no Git

---

## 📝 Passo a Passo

### 1️⃣ **Configurar CORS no Railway (IMPORTANTE!)**

Antes de fazer deploy, você DEVE adicionar o domínio da Vercel no CORS da API:

1. Acesse o Railway: https://railway.app
2. Selecione o projeto **agentapi-production-f788**
3. Clique no serviço **API**
4. Vá em **Variables**
5. Encontre a variável `ALLOWED_ORIGINS`
6. Adicione (ou edite para incluir):
   ```
   https://seu-projeto.vercel.app,http://localhost:3000
   ```
   ⚠️ **IMPORTANTE:** Você vai adicionar o domínio real da Vercel depois do primeiro deploy!

---

### 2️⃣ **Deploy na Vercel**

#### Opção A: Via Dashboard (Recomendado)

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

5. Clique em **"Deploy"**

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Na pasta frontend/
cd frontend

# Login
vercel login

# Deploy
vercel --prod
```

---

### 3️⃣ **Configurar Variável de Ambiente**

Após o primeiro deploy, você receberá uma URL como: `https://seu-projeto.vercel.app`

1. Na dashboard da Vercel, vá em **Settings → Environment Variables**
2. Adicione:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://agentapi-production-f788.up.railway.app`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

3. Clique em **"Save"**

---

### 4️⃣ **Atualizar CORS no Railway**

Agora que você tem a URL da Vercel:

1. Volte no Railway
2. Edite a variável `ALLOWED_ORIGINS` para:
   ```
   https://seu-projeto-real.vercel.app,http://localhost:3000
   ```
3. Salve (Railway fará redeploy automático)

---

### 5️⃣ **Fazer Redeploy na Vercel**

Para aplicar a variável de ambiente:

1. Na dashboard da Vercel, vá em **Deployments**
2. Clique nos **"..."** do último deployment
3. Selecione **"Redeploy"**

---

## 🧪 Testar

1. Acesse: `https://seu-projeto.vercel.app`
2. Faça login
3. Selecione um agente
4. Envie uma mensagem
5. ✅ Deve funcionar!

---

## 🔄 Deploys Automáticos

A Vercel faz deploy automático quando você:

- **Push para `main`** → Deploy em Production
- **Push para outras branches** → Deploy em Preview
- **Pull Request** → Deploy em Preview

---

## 🐛 Problemas Comuns

### Erro: "Network Error" ou "CORS Error"

**Solução:**
1. Verifique se `ALLOWED_ORIGINS` no Railway inclui sua URL da Vercel
2. Verifique se a variável `NEXT_PUBLIC_API_URL` está configurada na Vercel
3. Aguarde o redeploy do Railway (pode levar 1-2 minutos)

### Erro: "API request failed"

**Solução:**
1. Verifique se a API está rodando: https://agentapi-production-f788.up.railway.app/healthz
2. Deve retornar: `{"status":"healthy"}`

### Erro: "Build failed"

**Solução:**
1. Teste o build localmente:
   ```bash
   cd frontend
   npm run build
   ```
2. Se funcionar localmente, limpe o cache da Vercel:
   **Settings → General → Clear Build Cache**

---

## 📊 Monitoramento

### Ver Logs

**Vercel:**
- Deployments → [Seu Deploy] → Runtime Logs

**Railway:**
- Serviço API → Logs

### Analytics

**Vercel:**
- Analytics → Overview

---

## ✅ Checklist Final

Antes de considerar pronto:

- [ ] Build local funciona (`npm run build`)
- [ ] Login funciona
- [ ] Seleção de agente funciona
- [ ] Chat envia e recebe mensagens
- [ ] SQL Query aparece corretamente
- [ ] Logout funciona
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] CORS configurado no Railway
- [ ] Sem erros no console do navegador

---

## 🎉 Pronto!

Seu frontend está no ar! 🚀

**Próximos passos:**
- Configurar domínio personalizado (opcional)
- Ativar Analytics da Vercel
- Configurar alertas de erro

