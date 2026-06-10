# ⚡ GitHub Secrets - Quick Checklist

**Tempo estimado:** 5-10 minutos

---

## 🚀 Rápido & Prático

### 1️⃣ Abra a página de secrets

**URL:** https://github.com/arraesgustavo/melissa-levi/settings/secrets/actions

✓ Clique em **Settings**
✓ Clique em **Secrets and variables** (esquerda)
✓ Clique em **Actions**
✓ Clique em **[New repository secret]**

---

### 2️⃣ Adicione Secret #1

```
Name:   TELEGRAM_BOT_TOKEN
Value:  8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo
```

✓ **[Add secret]**

---

### 3️⃣ Adicione Secret #2

```
Name:   TELEGRAM_CHAT_ID
Value:  6644256527
```

✓ **[Add secret]**

---

### 4️⃣ Adicione Secret #3

```
Name:   VERCEL_ORG_ID
Value:  team_kzCGFcOPbrrP7k2Dn6kD1cwU
```

✓ **[Add secret]**

---

### 5️⃣ Adicione Secret #4

```
Name:   VERCEL_PROJECT_ID
Value:  prj_evAo7oRamQ2YGTRb7VLApsZgxFR7
```

✓ **[Add secret]**

---

### 6️⃣ Adicione Secret #5 (GERAR PRIMEIRO!)

**ANTES DE ADICIONAR, GERE O TOKEN:**

1. Acesse: https://vercel.com/account/tokens
2. Clique em **[Create]** ou **[Create Token]**
3. Nome: `GitHub CI/CD`
4. Clique em **[Create Token]**
5. **COPIE O TOKEN** (aparece só uma vez!)

**AGORA ADICIONE NO GITHUB:**

```
Name:   VERCEL_TOKEN
Value:  [Cole o token copiado do Vercel]
```

✓ **[Add secret]**

---

### 7️⃣ Adicione Secret #6 (OBTER DO RENDER PRIMEIRO!)

**ANTES DE ADICIONAR, OBTENHA A URL:**

1. Acesse: https://dashboard.render.com
2. Selecione seu projeto (backend)
3. Vá para **Settings**
4. Procure por **Deploy Hook** ou **Webhooks**
5. Clique em **[Create Hook]** ou similar
6. **COPIE A URL** gerada

**AGORA ADICIONE NO GITHUB:**

```
Name:   RENDER_DEPLOY_HOOK_URL
Value:  [Cole a URL copiada do Render]
```

✓ **[Add secret]**

---

## ✅ Verificação Final

Volte para: https://github.com/arraesgustavo/melissa-levi/settings/secrets/actions

Você deve ver **6 secrets** listados:

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

## 🎯 Próximo Passo

Após adicionar todos os secrets:

```bash
# Faça um pequeno commit
echo "✅ Secrets configured" >> README.md

# Commit & push
git add README.md
git commit -m "test: CI/CD configuration complete"
git push origin master:main
```

**Você verá:**
1. ✅ GitHub Actions rodando
2. 📱 Notificações Telegram chegando
3. ✅ Deploy automático acontecendo

---

**Pronto! CI/CD ativado! 🚀**
