# GitHub Actions Workflows

Este diretório contém os workflows de CI/CD para o projeto Melissa & Levi Wedding Site.

## Workflows

### 1. **Backend Deploy** (`backend-deploy.yml`)
- **Trigger:** Push para `main` ou PR com mudanças em `backend/**`
- **O que faz:**
  - ✅ Roda testes de import no Python
  - 🧪 Valida a estrutura do projeto
  - 📤 Faz deploy no Render (webhook)
  - 📢 Notifica no Telegram

**Variáveis de Ambiente Necessárias:**
- `RENDER_DEPLOY_HOOK_URL` - URL do webhook do Render
- `TELEGRAM_BOT_TOKEN` - Token do bot Telegram
- `TELEGRAM_CHAT_ID` - ID do chat para notificações

### 2. **Frontend Deploy** (`frontend-deploy.yml`)
- **Trigger:** Push para `main` ou PR com mudanças em `frontend/**`
- **O que faz:**
  - ✅ Instala dependências do Node
  - 🧪 Roda linting (ESLint)
  - 🏗️ Faz build do projeto
  - 📤 Faz deploy no Vercel
  - 📢 Notifica no Telegram

**Variáveis de Ambiente Necessárias:**
- `VERCEL_TOKEN` - Token de autenticação do Vercel
- `VERCEL_ORG_ID` - ID da organização no Vercel
- `VERCEL_PROJECT_ID` - ID do projeto no Vercel
- `TELEGRAM_BOT_TOKEN` - Token do bot Telegram
- `TELEGRAM_CHAT_ID` - ID do chat para notificações

### 3. **Telegram Integration Test** (`test-telegram-integration.yml`)
- **Trigger:** Push para `main` com mudanças em `backend/services/telegram.py`
- **O que faz:**
  - 🧪 Testa a conexão com o bot Telegram
  - ✅ Valida que as credenciais estão configuradas
  - 📢 Notifica no Telegram se passou/falhou

**Variáveis de Ambiente Necessárias:**
- `TELEGRAM_BOT_TOKEN` - Token do bot Telegram
- `TELEGRAM_CHAT_ID` - ID do chat para notificações

## Secrets Necessárias

Configure as seguintes secrets no GitHub:

```
TELEGRAM_BOT_TOKEN         # Token do bot @BotFather
TELEGRAM_CHAT_ID           # ID do chat para notificações
VERCEL_TOKEN               # Token de autenticação do Vercel
VERCEL_ORG_ID              # ID da organização do Vercel
VERCEL_PROJECT_ID          # ID do projeto do Vercel
RENDER_DEPLOY_HOOK_URL     # URL do webhook do Render
```

### Como adicionar secrets:

1. Vá para GitHub → Settings → Secrets and variables → Actions
2. Clique em "New repository secret"
3. Adicione cada secret com seu respectivo valor

## Fluxo de Deployment

```
Pull Request / Push to main
         ↓
   ┌─────────────────────────┐
   │   Executar Testes       │
   │ (Backend + Frontend)    │
   └────────────┬────────────┘
                ↓
         ✅ Testes Passaram?
         ↙              ↖
       Não              Sim
        ↓                ↓
    ❌ Falhar      🚀 Deploy
        ↓                ↓
    Notificar      Notificar
    no Telegram    no Telegram
```

## Monitoramento

Todos os deployments enviam notificações para o Telegram:
- ✅ Testes passaram
- 🚀 Deploy iniciou
- ✅ Deploy bem-sucedido
- ❌ Deploy falhou

## Troubleshooting

### Erro: "Secrets not found"
- Verifique se os secrets estão configurados em GitHub Settings
- Confirme que os nomes exatos foram usados

### Erro: "Module not found"
- Verifique que `requirements.txt` está atualizado
- Rode `pip install -r requirements.txt` localmente

### Deploy não inicia após testes passarem
- Confirme que você fez push para a branch `main`
- Verifique se há secrets configurados corretamente
- Veja os logs no GitHub Actions

## Executar workflow manualmente

Clique em **Actions** → Selecione o workflow → **Run workflow**

Isso é útil para forçar um deploy sem fazer push de código.
