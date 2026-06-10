# ✅ Deployment Checklist

Use este checklist para verificar se tudo está pronto antes de fazer push para `main`.

## 🔐 Pre-Deploy: Configuração

- [ ] **GitHub Secrets Configurados** (ver `.github/SECRETS_SETUP.md`)
  - [ ] `TELEGRAM_BOT_TOKEN`
  - [ ] `TELEGRAM_CHAT_ID`
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
  - [ ] `RENDER_DEPLOY_HOOK_URL`

- [ ] **Variáveis Vercel Adicionadas** (Project Settings > Environment Variables)
  - [ ] `TELEGRAM_BOT_TOKEN`
  - [ ] `TELEGRAM_CHAT_ID`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `FRONTEND_URL`

## 🧪 Pre-Deploy: Testes Locais

- [ ] Backend testes passam:
  ```bash
  cd backend && python test_imports.py
  ```

- [ ] Telegram connection funciona:
  ```bash
  cd backend && python test_telegram.py
  ```

- [ ] Frontend build funciona:
  ```bash
  cd frontend && npm run build
  ```

- [ ] Frontend linting passa:
  ```bash
  cd frontend && npm run lint
  ```

## 📝 Pre-Deploy: Código

- [ ] Código está commited e pronto
- [ ] Sem arquivos `.env` commited (apenas `.env.example`)
- [ ] Sem arquivos `__pycache__` ou `node_modules` commited
- [ ] Mensagem de commit descritiva

## 🚀 Deploy: Push para Main

```bash
# Confirm you're on master branch
git branch

# Push para GitHub
git push origin master:main

# Ou se master já rastreia main:
git push
```

## 🔍 Post-Deploy: Verificação

Após fazer push para `main`:

- [ ] GitHub Actions iniciou (check **Actions** tab)
- [ ] Notificação chegou no Telegram ✅
- [ ] Backend tests passaram no workflow
- [ ] Frontend build passou no workflow
- [ ] Deploy started no Vercel/Render
- [ ] Deploy completou com sucesso
- [ ] Site funciona em produção

### Checklist de Funcionalidade

- [ ] Site carrega em `https://melissalevi.me`
- [ ] Página home funciona
- [ ] Página RSVP carrega
- [ ] Formulário RSVP submete sem erro
- [ ] Notificação RSVP chegou no Telegram (verifique o bot)
- [ ] Navbar e Footer funcionam
- [ ] Mobile responsive funciona

## 🆘 Se algo der errado

### Erro no GitHub Actions

1. Vá para **Actions** → Selecione o workflow falhado
2. Veja os logs (click no step que falhou)
3. Procure a causa do erro:
   - Import errors → Verifique `requirements.txt`
   - Secrets errors → Verifique `.github/SECRETS_SETUP.md`
   - Deploy errors → Verifique credenciais do Vercel/Render

### Erro de Deploy

1. Verifique se os secrets estão configurados
2. Confirme que o código compila localmente
3. Verifique os logs do Vercel/Render

### Telegram não recebe notificações

1. Teste localmente: `python backend/test_telegram.py`
2. Confirme que `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID` estão corretos
3. Verifique se o bot está no chat/grupo

## 📊 Fluxo de Deploy Esperado

```
git push to main
    ↓
GitHub Actions triggers
    ↓
┌─────────────────┐
│  Test Jobs      │
│ Backend + FE    │
└────────┬────────┘
         ↓
    Tests Pass?
    ↙       ↖
  Fail      Pass
   ↓         ↓
  ❌      Deploy Jobs
  msg      Backend+FE
           ↓
        Deploy Pass?
        ↙       ↖
      Fail      Pass
       ↓         ↓
      ❌ msg    ✅ msg
           ↓
        📱 Telegram
        notification
```

## 🎯 Objetivos Desta Release

- ✅ Feature Telegram integrada
- ✅ CI/CD workflows configurado
- ✅ Testes antes de deploy
- ✅ Notificações em produção
- ✅ Deploy automático em push para main

---

**Status:** 🚀 Pronto para deploy quando os secrets forem configurados!
