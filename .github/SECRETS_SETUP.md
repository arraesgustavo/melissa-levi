# 🔐 Configurar GitHub Secrets

Este guia mostra como configurar os secrets necessários para os workflows de CI/CD funcionarem.

## Pré-requisitos

- Acesso ao repositório GitHub
- Permissão de admin para configurar secrets
- Valores dos secrets (veja abaixo)

## Valores dos Secrets

### 1. **TELEGRAM_BOT_TOKEN**
**O que é:** Token do bot Telegram  
**Valor:** `8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo`  
**Onde obter:** @BotFather no Telegram

### 2. **TELEGRAM_CHAT_ID**
**O que é:** ID do chat para receber notificações  
**Valor:** `6644256527`  
**Onde obter:** @RawDataBot no Telegram ou ID do grupo

### 3. **VERCEL_TOKEN**
**O que é:** Token de autenticação do Vercel  
**Onde obter:** https://vercel.com/account/tokens
**Como gerar:**
1. Vá para https://vercel.com/account/tokens
2. Clique em "Create Token"
3. Dê um nome (ex: "GitHub CI/CD")
4. Copie o token (⚠️ aparece só uma vez!)

### 4. **VERCEL_ORG_ID**
**O que é:** ID da organização no Vercel  
**Valor:** `team_kzCGFcOPbrrP7k2Dn6kD1cwU`  
**Onde obter:** `.vercel/project.json` no frontend

### 5. **VERCEL_PROJECT_ID**
**O que é:** ID do projeto no Vercel  
**Valor:** `prj_evAo7oRamQ2YGTRb7VLApsZgxFR7`  
**Onde obter:** `.vercel/project.json` no frontend

### 6. **RENDER_DEPLOY_HOOK_URL**
**O que é:** URL do webhook para deploy no Render  
**Onde obter:** Render.com → Project Settings → Deploy Hooks
**Como gerar:**
1. Vá para seu projeto no Render.com
2. Settings → Deploy Hooks
3. Clique em "Create Hook"
4. Copie a URL gerada

---

## 📝 Adicionar Secrets no GitHub

### Via Dashboard (Recomendado)

1. Vá para seu repositório no GitHub
2. Settings → Secrets and variables → Actions
3. Clique em **"New repository secret"**
4. Para cada secret abaixo, clique em "New repository secret" e adicione:

| Name | Value |
|------|-------|
| `TELEGRAM_BOT_TOKEN` | `8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo` |
| `TELEGRAM_CHAT_ID` | `6644256527` |
| `VERCEL_TOKEN` | (gerar em vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `team_kzCGFcOPbrrP7k2Dn6kD1cwU` |
| `VERCEL_PROJECT_ID` | `prj_evAo7oRamQ2YGTRb7VLApsZgxFR7` |
| `RENDER_DEPLOY_HOOK_URL` | (obter do Render) |

5. Clique em "Add secret" para cada um

### Via GitHub CLI

Se tiver GitHub CLI instalado:

```bash
gh secret set TELEGRAM_BOT_TOKEN -b "8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo"
gh secret set TELEGRAM_CHAT_ID -b "6644256527"
gh secret set VERCEL_ORG_ID -b "team_kzCGFcOPbrrP7k2Dn6kD1cwU"
gh secret set VERCEL_PROJECT_ID -b "prj_evAo7oRamQ2YGTRb7VLApsZgxFR7"
gh secret set VERCEL_TOKEN -b "<seu token do Vercel>"
gh secret set RENDER_DEPLOY_HOOK_URL -b "<sua URL do Render>"
```

---

## ✅ Verificar Secrets

1. Vá para GitHub → Settings → Secrets
2. Você deve ver todos os 6 secrets listados
3. ⚠️ Os valores não serão visíveis (por segurança)

---

## 🧪 Testar Workflow

Depois de adicionar os secrets:

1. Faça um pequeño commit em `backend/` ou `frontend/`
2. Faça push para `main` (ou crie uma PR)
3. Vá para **Actions** no GitHub
4. Veja o workflow executar
5. Você receberá notificações no Telegram!

---

## 🚨 Troubleshooting

### Erro: "Secrets not available in workflow"
- Verifique se os nomes dos secrets estão exatos
- Confirme que estão configurados em Settings → Secrets

### Deploy falha com "Invalid VERCEL_TOKEN"
- Regenere o token em vercel.com/account/tokens
- Atualize o secret no GitHub

### Notificações não chegam no Telegram
- Confirme que o TELEGRAM_BOT_TOKEN está correto
- Confirme que o TELEGRAM_CHAT_ID está correto
- Teste manualmente: `python backend/test_telegram.py`

### Vercel Deploy falha
- Verifique se VERCEL_ORG_ID e VERCEL_PROJECT_ID estão corretos
- Confirme que o token do Vercel tem permissão de deploy

---

## 📚 Links Úteis

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Vercel Token Management](https://vercel.com/account/tokens)
- [Telegram Bot Token](https://t.me/BotFather)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)

---

**Status:** ⏳ Aguardando configuração de secrets
