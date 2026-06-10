# 🚀 CI/CD Setup - Melissa & Levi Wedding Site

**Status:** ✅ Workflows configurados e código enviado para GitHub

---

## 📋 Visão Geral

Este projeto usa **GitHub Actions** para **testes automáticos** e **deploy contínuo** para o Vercel (frontend) e Render (backend).

### O que acontece agora:

```
Você faz: git push origin master:main
            ↓
    GitHub Actions detecta push
            ↓
    ┌──────────────────────────────┐
    │   TESTES AUTOMÁTICOS        │
    │  Backend (Python)            │
    │  Frontend (Node)             │
    └────────┬─────────────────────┘
             ↓
         Testes Passaram?
         ↙          ↖
       Não           Sim
        ↓             ↓
    ❌ Notificar  🚀 Deploy Automático
    no Telegram   ↓ Backend + Frontend
                  ↓
              ✅ Notificar no Telegram
```

---

## 🔐 AÇÕES CRÍTICAS (Faça AGORA!)

### 1. Configurar GitHub Secrets

**⚠️ ESSENCIAL para os workflows funcionarem**

[Instrções completas](/.github/SECRETS_SETUP.md)

Vá para:
```
GitHub → Settings → Secrets and variables → Actions → New repository secret
```

Adicione estes 6 secrets:

| Secret | Valor |
|--------|-------|
| `TELEGRAM_BOT_TOKEN` | `8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo` |
| `TELEGRAM_CHAT_ID` | `6644256527` |
| `VERCEL_ORG_ID` | `team_kzCGFcOPbrrP7k2Dn6kD1cwU` |
| `VERCEL_PROJECT_ID` | `prj_evAo7oRamQ2YGTRb7VLApsZgxFR7` |
| `VERCEL_TOKEN` | [Gerar em vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `RENDER_DEPLOY_HOOK_URL` | Obter no Render Dashboard |

### 2. Validar Variáveis Vercel

Vá para **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**

Confirme que estas variáveis foram adicionadas (da Phase 2):
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `FRONTEND_URL`

---

## 📚 Documentação

### Para Developers

- [GitHub Workflows Reference](/.github/workflows/README.md) - O que cada workflow faz
- [Deployment Checklist](/.github/DEPLOYMENT_CHECKLIST.md) - Checklist antes/depois de deploy
- [Production Validation](/.github/PRODUCTION_VALIDATION.md) - Como validar após deploy

### Para Setup

- [GitHub Secrets Setup](/.github/SECRETS_SETUP.md) - Como adicionar secrets

---

## 🚀 Workflows Disponíveis

### 1. **Backend Deploy** (automático em push)
- Localização: `.github/workflows/backend-deploy.yml`
- **Trigger:** Push para `main` com mudanças em `backend/`
- **Steps:**
  1. ✅ Testa imports Python
  2. 📤 Deploy no Render
  3. 📢 Notifica Telegram

### 2. **Frontend Deploy** (automático em push)
- Localização: `.github/workflows/frontend-deploy.yml`
- **Trigger:** Push para `main` com mudanças em `frontend/`
- **Steps:**
  1. 🧪 ESLint linting
  2. 🏗️ Build validation
  3. 📤 Deploy no Vercel
  4. 📢 Notifica Telegram

### 3. **Telegram Integration Test** (automático)
- Localização: `.github/workflows/test-telegram-integration.yml`
- **Trigger:** Push para `main` com mudanças em `backend/services/telegram.py`
- **Steps:**
  1. 🧪 Testa conexão com bot
  2. 📢 Notifica Telegram resultado

---

## 🧪 Testes Locais

Antes de fazer push, você pode testar localmente:

### Backend Tests

```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate no Windows

# Testar imports
python test_imports.py

# Testar Telegram (requer .env configurado)
python test_telegram.py
```

### Frontend Tests

```bash
cd frontend

# Linting
npm run lint

# Build
npm run build

# Preview
npm run preview
```

---

## 📊 Monitorar Deployments

### Ver Logs em Tempo Real

1. Vá para seu repositório GitHub
2. Clique em **Actions**
3. Selecione o workflow em execução
4. Veja os logs de cada step

### Notificações Telegram

Você receberá notificações automáticas:
- ✅ Testes passaram
- 🚀 Deploy iniciou
- ✅ Deploy sucesso
- ❌ Deploy falha (+ erro)

---

## 🐛 Troubleshooting

### Erro: "Secrets not available"
**Solução:** Verifique se todos os 6 secrets foram adicionados em GitHub Settings

### Erro: "Module not found" (Python)
**Solução:** `requirements.txt` pode estar desatualizado
```bash
cd backend
pip install -r requirements.txt
```

### Telegram não recebe notificações
**Solução:** Teste localmente
```bash
cd backend && source venv/bin/activate
python test_telegram.py
```

### Frontend não faz build
**Solução:** Tente localmente
```bash
cd frontend && npm ci && npm run build
```

---

## 🔄 Fluxo Typical de Desenvolvimento

```
1. Você faz commit
   git add .
   git commit -m "seu mensage"

2. Push para GitHub
   git push origin master:main

3. GitHub Actions roda automaticamente
   - Vê os logs em GitHub Actions tab
   - Recebe notificação Telegram

4. Se tudo passou
   - Site atualiza automaticamente
   - Vercel (frontend): https://melissalevi.me
   - Render (backend): conforme seu setup

5. Validar em produção
   - Acesse o site
   - Teste RSVP
   - Confirme Telegram notificação
```

---

## 📱 Testes de RSVP End-to-End

Depois de um deploy, sempre teste:

1. Acesse https://melissalevi.me/rsvp
2. Preencha com dados teste
3. Envie
4. Confirme:
   - [ ] Formulário foi aceito
   - [ ] Notificação chegou no Telegram
   - [ ] Dados aparecem no Supabase (se você tiver acesso)

---

## ✅ Checklist de Setup Completo

- [ ] 6 secrets adicionados no GitHub
- [ ] 5 variáveis adicionadas no Vercel
- [ ] Código feito push para GitHub (`main` branch)
- [ ] GitHub Actions executou com sucesso
- [ ] Notificações chegaram no Telegram
- [ ] Site funciona em produção
- [ ] RSVP funciona end-to-end

---

## 📞 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)

---

## 🎯 Próximos Passos

1. **AGORA:** Adicionar secrets no GitHub (CRÍTICO!)
2. **Validar:** Confirmar que workflows rodaram
3. **Testar:** RSVP em produção
4. **Monitor:** Acompanhar por erros nos próximos dias
5. **Iterate:** Fazer mais deployments com confiança!

---

**Seu CI/CD está pronto! 🚀**

Qualquer dúvida, veja a documentação em `.github/`
