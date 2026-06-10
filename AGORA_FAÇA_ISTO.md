# ⚡ AGORA FAÇA ISTO - GitHub Secrets Setup

**Tempo total:** ~10 minutos

---

## 🎯 Sua tarefa: Adicionar 6 secrets no GitHub

**URL:** https://github.com/arraesgustavo/melissa-levi/settings/secrets/actions

---

## ✅ Checklist dos 6 Secrets

Clique em [New repository secret] e preencha cada um:

### ☑️ Secret 1 - TELEGRAM_BOT_TOKEN
```
Name:  TELEGRAM_BOT_TOKEN
Value: 8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo
```
Clique [Add secret]

### ☑️ Secret 2 - TELEGRAM_CHAT_ID
```
Name:  TELEGRAM_CHAT_ID
Value: 6644256527
```
Clique [Add secret]

### ☑️ Secret 3 - VERCEL_ORG_ID
```
Name:  VERCEL_ORG_ID
Value: team_kzCGFcOPbrrP7k2Dn6kD1cwU
```
Clique [Add secret]

### ☑️ Secret 4 - VERCEL_PROJECT_ID
```
Name:  VERCEL_PROJECT_ID
Value: prj_evAo7oRamQ2YGTRb7VLApsZgxFR7
```
Clique [Add secret]

### ⚠️ Secret 5 - VERCEL_TOKEN (GERAR PRIMEIRO!)

1. Abra: https://vercel.com/account/tokens
2. Clique [Create Token]
3. Preencha: Token name = "GitHub CI/CD"
4. Clique [Create Token]
5. **COPIE o token** (só aparece uma vez!)

Agora no GitHub:
```
Name:  VERCEL_TOKEN
Value: [Cole o token copiado do Vercel]
```
Clique [Add secret]

### ⚠️ Secret 6 - RENDER_DEPLOY_HOOK_URL (OBTER DO RENDER PRIMEIRO!)

1. Abra: https://dashboard.render.com
2. Selecione seu projeto (backend)
3. Vá para Settings
4. Procure por "Deploy Hook" ou "Webhooks"
5. Clique [Create Hook]
6. **COPIE a URL** gerada

Agora no GitHub:
```
Name:  RENDER_DEPLOY_HOOK_URL
Value: [Cole a URL copiada do Render]
```
Clique [Add secret]

---

## ✅ Confirmação

Você deve ver **6 secrets** listados na página:

```
🔒 Secrets (6)
✓ RENDER_DEPLOY_HOOK_URL
✓ TELEGRAM_BOT_TOKEN
✓ TELEGRAM_CHAT_ID
✓ VERCEL_ORG_ID
✓ VERCEL_PROJECT_ID
✓ VERCEL_TOKEN
```

---

## 🚀 Pronto! Agora teste

```bash
git push origin master:main
```

Você verá:
1. GitHub Actions rodando
2. Notificações no Telegram
3. Site atualizando

---

**Precisar de mais ajuda?**
- Guia visual: `.github/SECRETS_VISUAL_GUIDE.md`
- Checklist rápido: `.github/SECRETS_QUICK_CHECKLIST.md`
- Detalhes completos: `.github/GITHUB_SECRETS_STEP_BY_STEP.md`

---

**Boa sorte! 🎉**
