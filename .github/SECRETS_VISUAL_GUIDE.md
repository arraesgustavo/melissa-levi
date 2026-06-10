# 🎨 GitHub Secrets - Visual Step-by-Step Guide

## Passo 1: Acesse a Página de Settings

**URL:** https://github.com/arraesgustavo/melissa-levi

Clique em **Settings** (engrenagem no topo da página)

```
┌──────────────────────────────────────────────────────────────┐
│ arraesgustavo / melissa-levi                                 │
├──────────────────────────────────────────────────────────────┤
│ Code  |  Issues  |  Pull requests  |  Discussions  | Settings │
│                                                           ⚙️  │
│                                                     CLIQUE AQUI │
└──────────────────────────────────────────────────────────────┘
```

---

## Passo 2: Clique em "Secrets and variables"

Você está agora em Settings. Na barra lateral esquerda, procure por:

```
LEFT SIDEBAR:
┌─────────────────────────────────────┐
│ GENERAL                             │
│ ├─ About                            │
│ └─ Danger zone                      │
│                                     │
│ ACCESS                              │
│ ├─ Collaborators                    │
│ ├─ Moderation options               │
│ └─ Code security & analysis         │
│                                     │
│ SECURITY                            │
│ ├─ Secrets and variables ← CLIQUE   │
│ │                     AQUI!         │
│ └─ Dependabot                       │
│                                     │
│ INTEGRATIONS & NOTIFICATIONS        │
│ ├─ Deploy keys                      │
│ └─ Webhooks                         │
└─────────────────────────────────────┘
```

---

## Passo 3: Clique em "Actions"

Depois de clicar em "Secrets and variables", você vai para a página:

```
┌────────────────────────────────────────────────────────┐
│ Secrets and variables                                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [Codespaces]  [Dependabot]  [Actions] ← CLIQUE AQUI   │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Passo 4: Clique em "New repository secret"

Você verá:

```
┌────────────────────────────────────────────────────────┐
│ 🔐 Actions secrets and variables                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 🔒 Secrets                                             │
│                                                        │
│  There are currently no secrets for this repository    │
│                                                        │
│  [New repository secret] ← CLIQUE AQUI                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Passo 5: Preencha o Formulário

Quando você clica em "New repository secret", um formulário aparece:

```
┌────────────────────────────────────────────────────────┐
│ Create a new secret                                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Name *                                                 │
│ ┌──────────────────────────────────────────────────┐  │
│ │ TELEGRAM_BOT_TOKEN                               │  │
│ │                                                  │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ Secret *                                               │
│ ┌──────────────────────────────────────────────────┐  │
│ │ 8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo  │  │
│ │                                                  │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│                            [Add secret] ← CLIQUE AQUI  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Repetir para Cada Secret

Depois de clicar em [Add secret], volte para a página anterior:

```
┌────────────────────────────────────────────────────────┐
│ 🔐 Actions secrets and variables                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 🔒 Secrets (1)                                         │
│                                                        │
│ ├─ TELEGRAM_BOT_TOKEN                                 │
│                                                        │
│  [New repository secret] ← CLIQUE NOVAMENTE            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Repita este processo para os outros 5 secrets:**

1. ✅ TELEGRAM_BOT_TOKEN (`8868771795:AAG14JLy7vLpRISDzGS3Ks_lo5zqS8WPVRo`)
2. ⬜ TELEGRAM_CHAT_ID (`6644256527`)
3. ⬜ VERCEL_ORG_ID (`team_kzCGFcOPbrrP7k2Dn6kD1cwU`)
4. ⬜ VERCEL_PROJECT_ID (`prj_evAo7oRamQ2YGTRb7VLApsZgxFR7`)
5. ⬜ VERCEL_TOKEN (gerar em vercel.com/account/tokens)
6. ⬜ RENDER_DEPLOY_HOOK_URL (obter do Render)

---

## ✅ Resultado Final

Depois de adicionar os 6 secrets, você verá:

```
┌────────────────────────────────────────────────────────┐
│ 🔐 Actions secrets and variables                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 🔒 Secrets (6)                                         │
│                                                        │
│ ├─ RENDER_DEPLOY_HOOK_URL                             │
│ │  Updated 2 minutes ago                              │
│ │  ••••••••••••••••••••••••••••••••••••••••••••       │
│ │                                                      │
│ ├─ TELEGRAM_BOT_TOKEN                                 │
│ │  Updated 5 minutes ago                              │
│ │  ••••••••••••••••••••••••••••••••••••••••••••       │
│ │                                                      │
│ ├─ TELEGRAM_CHAT_ID                                   │
│ │  Updated 4 minutes ago                              │
│ │  ••••••••••••••••••••••••••••••••••••••••••••       │
│ │                                                      │
│ ├─ VERCEL_ORG_ID                                       │
│ │  Updated 3 minutes ago                              │
│ │  ••••••••••••••••••••••••••••••••••••••••••••       │
│ │                                                      │
│ ├─ VERCEL_PROJECT_ID                                  │
│ │  Updated 1 minute ago                               │
│ │  ••••••••••••••••••••••••••••••••••••••••••••       │
│ │                                                      │
│ ├─ VERCEL_TOKEN                                        │
│ │  Updated 30 seconds ago                             │
│ │  ••••••••••••••••••••••••••••••••••••••••••••       │
│ │                                                      │
│  [New repository secret]                              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 💡 Dicas

- 🔒 Os valores não são visíveis por segurança (mostram só •••)
- ✏️ Você pode editar um secret clicando no nome dele
- 🗑️ Você pode deletar um secret se clicar em "Delete"
- 🔄 As mudanças em secrets têm efeito imediato

---

## 🎬 Próximo Passo: Testar

Depois de adicionar os 6 secrets, faça um push:

```bash
git push origin master:main
```

Você verá:

1. **GitHub Actions** iniciando
   → https://github.com/arraesgustavo/melissa-levi/actions

2. **Notificações Telegram** chegando
   → Verifique seu chat Telegram

3. **Site atualizando** em produção
   → https://melissalevi.me

---

**Parabéns! CI/CD está ativo! 🎉**
