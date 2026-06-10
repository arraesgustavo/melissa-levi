# 🔐 Configurar GitHub Secrets - Passo a Passo

## Acesso Rápido

**URL direto:** https://github.com/arraesgustavo/melissa-levi/settings/secrets/actions

---

## 📍 Como Acessar

### Via GitHub Web:

1. Vá para seu repositório: https://github.com/arraesgustavo/melissa-levi
2. Clique em **Settings** (engrenagem no topo)
3. Na barra lateral esquerda, clique em **Secrets and variables**
4. Clique em **Actions**

Você verá:
```
🔒 Secrets (0)
```

---

## ➕ Adicionar Primeiro Secret

### Passo 1: Clique em "New repository secret"

```
┌─────────────────────────────────────────────┐
│ 🔐 Secrets and variables > Actions          │
├─────────────────────────────────────────────┤
│                                             │
│ 🔒 Secrets (0)                              │
│                                             │
│ [New repository secret] ← CLIQUE AQUI       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔑 Adicionar os 6 Secrets

### Secret #1: TELEGRAM_BOT_TOKEN

**Passo 1:** Clique em "New repository secret"

**Passo 2:** Preencha o formulário:

```
Name:
┌─────────────────────────────────────────┐
│ TELEGRAM_BOT_TOKEN                      │
└─────────────────────────────────────────┘

Secret:
┌─────────────────────────────────────────┐
│ 8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5 │
│ zqS8WPVRo                               │
└─────────────────────────────────────────┘
```

**Passo 3:** Clique em **[Add secret]** (botão verde no canto inferior direito)

---

### Secret #2: TELEGRAM_CHAT_ID

**Clique novamente em "New repository secret"**

```
Name:
┌─────────────────────────────────────────┐
│ TELEGRAM_CHAT_ID                        │
└─────────────────────────────────────────┘

Secret:
┌─────────────────────────────────────────┐
│ 6644256527                              │
└─────────────────────────────────────────┘
```

**Clique em [Add secret]**

---

### Secret #3: VERCEL_ORG_ID

**Clique novamente em "New repository secret"**

```
Name:
┌─────────────────────────────────────────┐
│ VERCEL_ORG_ID                           │
└─────────────────────────────────────────┘

Secret:
┌─────────────────────────────────────────┐
│ team_kzCGFcOPbrrP7k2Dn6kD1cwU          │
└─────────────────────────────────────────┘
```

**Clique em [Add secret]**

---

### Secret #4: VERCEL_PROJECT_ID

**Clique novamente em "New repository secret"**

```
Name:
┌─────────────────────────────────────────┐
│ VERCEL_PROJECT_ID                       │
└─────────────────────────────────────────┘

Secret:
┌─────────────────────────────────────────┐
│ prj_evAo7oRamQ2YGTRb7VLApsZgxFR7       │
└─────────────────────────────────────────┘
```

**Clique em [Add secret]**

---

### Secret #5: VERCEL_TOKEN ⚠️ (Precisa gerar)

**Antes de adicionar, você precisa gerar um token no Vercel:**

#### Como gerar o VERCEL_TOKEN:

1. Acesse: https://vercel.com/account/tokens
2. Você será redirecionado para fazer login (se necessário)
3. Clique em **[Create]** ou **[Create Token]**
4. Preencha:
   ```
   Token name: GitHub CI/CD
   (ou qualquer nome descritivo)
   ```
5. Clique em **[Create Token]**
6. **COPIE O TOKEN IMEDIATAMENTE** (aparece só uma vez!)

Exemplo do que você receberá:
```
gnRz1234567890abcdefghijklmnopqrstuvwxyzA
```

#### Agora adicione no GitHub:

**Clique em "New repository secret"**

```
Name:
┌─────────────────────────────────────────┐
│ VERCEL_TOKEN                            │
└─────────────────────────────────────────┘

Secret:
┌─────────────────────────────────────────┐
│ [Cole aqui o token que você copiou]     │
│ gnRz1234567890abcdefghijklmnopqrstuv    │
└─────────────────────────────────────────┘
```

**Clique em [Add secret]**

---

### Secret #6: RENDER_DEPLOY_HOOK_URL ⚠️ (Obter do Render)

**Antes de adicionar, você precisa obter a URL do Render:**

#### Como obter o RENDER_DEPLOY_HOOK_URL:

1. Acesse o **Render Dashboard**: https://dashboard.render.com
2. Selecione seu **projeto** (o backend da Melissa & Levi)
3. Vá para **Settings** (ou "Project Settings")
4. Na barra lateral, procure por:
   - **Deploy** ou **Deploy Hooks**
   - **Webhooks** ou **Integrations**
5. Procure por uma seção chamada **"Deploy Hook"** ou **"Render API"**
6. Clique em **[Create Hook]** ou similar
7. Uma URL será gerada:
   ```
   https://api.render.com/deploy/srv-xxxxxxxxxxxxx?key=xxxxxxxxxxxxxxxx
   ```
8. **COPIE ESTA URL**

#### Agora adicione no GitHub:

**Clique em "New repository secret"**

```
Name:
┌─────────────────────────────────────────┐
│ RENDER_DEPLOY_HOOK_URL                  │
└─────────────────────────────────────────┘

Secret:
┌─────────────────────────────────────────┐
│ [Cole aqui a URL do Render]             │
│ https://api.render.com/deploy/srv-...   │
└─────────────────────────────────────────┘
```

**Clique em [Add secret]**

---

## ✅ Verificação Final

Depois de adicionar todos os 6 secrets, você deve ver:

```
🔐 Secrets and variables > Actions

🔒 Secrets (6)

├─ RENDER_DEPLOY_HOOK_URL
├─ TELEGRAM_BOT_TOKEN
├─ TELEGRAM_CHAT_ID
├─ VERCEL_ORG_ID
├─ VERCEL_PROJECT_ID
└─ VERCEL_TOKEN
```

Cada secret mostrará:
- **Name:** (o nome que você colocou)
- **Created:** (data de criação)
- **Updated:** (data de última atualização)
- **Value:** (não visível por segurança) 🔒

---

## 🧪 Testar os Secrets

Depois de adicionar, teste fazendo um pequeno push:

```bash
# Faça uma mudança qualquer
echo "# Test" >> README.md

# Commit
git add README.md
git commit -m "test: trigger CI/CD workflow"

# Push
git push origin master:main
```

Você deve ver:
1. ✅ GitHub Actions executando (vá para Actions tab)
2. ✅ Notificações chegando no Telegram
3. ✅ Deploy executando

---

## ⚠️ Erros Comuns

### Erro: "Secrets are not available"
**Causa:** Você não adicionou o secret
**Solução:** Refaça os passos acima

### Erro: "Invalid VERCEL_TOKEN"
**Causa:** Token expirou ou está incorreto
**Solução:** 
1. Regenere em https://vercel.com/account/tokens
2. Atualize o secret no GitHub

### Erro: "Webhook failed"
**Causa:** RENDER_DEPLOY_HOOK_URL está incorreta
**Solução:**
1. Verifique a URL no Render Dashboard
2. Atualize o secret no GitHub

### Workflow não executa após push
**Causa:** Algum secret está faltando ou errado
**Solução:**
1. Verifique que todos os 6 secrets estão adicionados
2. Veja os logs em GitHub Actions para mensagens de erro

---

## 📚 Referências Rápidas

### Valores Já Conhecidos (copie direto):

| Secret | Valor |
|--------|-------|
| TELEGRAM_BOT_TOKEN | `8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo` |
| TELEGRAM_CHAT_ID | `6644256527` |
| VERCEL_ORG_ID | `team_kzCGFcOPbrrP7k2Dn6kD1cwU` |
| VERCEL_PROJECT_ID | `prj_evAo7oRamQ2YGTRb7VLApsZgxFR7` |

### Valores que Você Precisa Gerar/Obter:

| Secret | Onde Obter |
|--------|-----------|
| VERCEL_TOKEN | https://vercel.com/account/tokens |
| RENDER_DEPLOY_HOOK_URL | Render Dashboard → Project → Settings |

---

## 🎯 Próximo Passo

Depois de adicionar os 6 secrets:

1. Faça um pequeno commit/push
2. Vá para **Actions** tab no GitHub
3. Veja os workflows rodarem
4. Confirme notificações no Telegram
5. Valide o site em produção

---

**Status:** 🟢 Pronto para configurar secrets!
