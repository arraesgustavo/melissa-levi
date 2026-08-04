# Melissa & Levi Wedding Site — Documentação Técnica Completa

**Data de geração:** 04 de Agosto de 2026
**Repositório:** https://github.com/arraesgustavo/melissa-levi
**Domínio:** https://melissalevi.me

---

## 1. DEPENDÊNCIAS PARA EXECUTAR LOCALMENTE

### 1.1 Linguagens & Runtimes

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | **Node.js** + **npm** | v20+ (`node --version`) |
| Backend | **Python** | 3.12+ (venv incluso no repo, recomenda-se 3.12) |
| Database | Supabase (PostgreSQL 15+) | Cloud (não local) |

### 1.2 Frameworks & Bibliotecas

**Frontend** (`frontend/package.json`):
- React 19.2.6
- Vite 8.0.12 (dev server + bundler)
- react-router-dom 7.17.0
- MUI v9.1.0 (`@mui/material`, `@mui/icons-material`)
- Emotion CSS-in-JS (`@emotion/react`, `@emotion/styled`)
- ESLint 10.3.0 (linting)

**Backend** (`backend/requirements.txt`):
- FastAPI 0.136.3
- Uvicorn 0.49.0 (ASGI server)
- Pydantic 2.13.4 (validação de dados)
- python-dotenv 1.2.2 (variáveis de ambiente)
- supabase 2.31.0 (cliente Supabase)
- python-telegram-bot 22.7 (notificações)

### 1.3 Variáveis de Ambiente Obrigatórias

Arquivo `backend/.env` (já existe localmente com valores reais — NÃO comitar):

```env
SUPABASE_URL=https://coopmbirrsayeelcjuzw.supabase.co
SUPABASE_ANON_KEY=eyJhbGci... (JWT anon key)
TELEGRAM_BOT_TOKEN=8868771795:...
TELEGRAM_CHAT_ID=6644256527
FRONTEND_URL=https://melissalevi.me
```

### 1.4 Comandos para Rodar Localmente

```bash
# Terminal 1 — Backend
cd backend
source venv/bin/activate
python3 -m uvicorn main:app --reload
# → http://localhost:8000

# Terminal 2 — Frontend
cd frontend
npm install        # se node_modules não existir
npm run dev
# → http://localhost:5173 (proxy /api → localhost:8000 via vite.config.js)
```

---

## 2. CONFIGURAÇÃO DE PRODUÇÃO ATUAL

### 2.1 Evidências de Hospedagem

| Evidência | Fonte |
|-----------|-------|
| Domínio: `melissalevi.me` | `README.md:460`, `CI-CD-SETUP.md:211`, `ARCHITECTURE.md` |
| Frontend no **Vercel** | `vercel.json`, `frontend-deploy.yml`, VERCEL_PROJECT_ID=`prj_evAo7oRamQ2YGTRb7VLApsZgxFR7` |
| Backend no **Render** | `render.yaml`, `backend-deploy.yml` (usa RENDER_DEPLOY_HOOK_URL) |
| Database no **Supabase** | `SUPABASE_URL=https://coopmbirrsayeelcjuzw.supabase.co` |
| DNS no **Name.com** | `README.md:222`, `stack.md:33` |
| Monitoramento via **Telegram** | Todo o middleware de erro e notificações de deploy |

### 2.2 Configuração de DNS (Name.com → Vercel)

```
Tipo A:    @   → 76.76.21.21      (TTL 300)
Tipo CNAME: www → cname.vercel-dns.com. (TTL 300)
```

SSL provisionado automaticamente pela Vercel (Let's Encrypt).

### 2.3 Diagrama da Arquitetura

```
User Browser
    ↓ (https://melissalevi.me)
Vercel Edge Network (Frontend)
    ↓ (/api requests)
Render Web Service (FastAPI Backend)
    ↓ (queries)
Supabase PostgreSQL Database
    ↓ (alerts)
Telegram Bot API
```

---

## 3. SERVIÇOS E PLATAFORMAS PARA VERIFICAR

Você precisa acessar e verificar o estado de **6 plataformas**:

| # | Plataforma | URL de Acesso | O que verificar |
|---|-----------|---------------|-----------------|
| 1 | **GitHub** | https://github.com/arraesgustavo/melissa-levi | Repositório, branch `main`, Actions, Secrets |
| 2 | **Vercel** | https://vercel.com/arraesgustavo-projects | Projeto `melissa-levi`, domain `melissalevi.me`, env vars, deploys |
| 3 | **Render** | https://dashboard.render.com | Web Service `melissa-levi-api`, Deploy Hook, env vars, status |
| 4 | **Supabase** | https://app.supabase.com | Projeto `coopmbirrsayeelcjuzw`, tabela `rsvps`, RLS policies |
| 5 | **Name.com** | https://www.name.com | DNS records para `melissalevi.me` |
| 6 | **Telegram** | App Telegram | Bot `@melissa_levi_wedding_bot` (via @BotFather) |

---

## 4. COMO IDENTIFICAR CONFIGURAÇÕES NO GITHUB

### 4.1 Repositório

- **URL:** `https://github.com/arraesgustavo/melissa-levi`
- **Branch principal:** `main` (remota) / `master` (local — o push faz `master:main`)

### 4.2 Workflows Existentes (GitHub Actions)

Os arquivos estão em `.github/workflows/`:

| Workflow | Arquivo | Gatilho |
|----------|---------|---------|
| Backend CI/CD | `backend-deploy.yml` | Push/PR com mudanças em `backend/**` |
| Frontend CI/CD | `frontend-deploy.yml` | Push/PR com mudanças em `frontend/**` |
| Telegram Test | `test-telegram-integration.yml` | Push com mudanças em `backend/services/telegram.py` |

### 4.3 Secrets Necessárias no GitHub

Verifique em: **GitHub → Settings → Secrets and variables → Actions**

Deveriam existir 6 secrets:

```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
VERCEL_ORG_ID        → team_kzCGFcOPbrrP7k2Dn6kD1cwU
VERCEL_PROJECT_ID    → prj_evAo7oRamQ2YGTRb7VLApsZgxFR7
VERCEL_TOKEN         → (token gerado em vercel.com/account/tokens)
RENDER_DEPLOY_HOOK_URL → (URL do Deploy Hook no Render)
```

### 4.4 Variáveis de Ambiente no Vercel

Verifique em: **Vercel Dashboard → melissa-levi → Settings → Environment Variables**

Deveriam existir:
```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
SUPABASE_URL
SUPABASE_ANON_KEY
FRONTEND_URL → https://melissalevi.me
```

---

## 5. PIPELINE DE CI/CD — COMO FUNCIONA

### 5.1 Diagrama do Fluxo

```
git push origin master:main
         │
         ▼
  GitHub Actions detecta push na branch main
         │
    ┌────┴────┐
    ▼         ▼
 Backend    Frontend
 (se        (se
 backend/  frontend/
 mudou)    mudou)
    │         │
    ▼         ▼
  Teste:    Teste:
  Python    npm ci
  imports   + lint
  (test_    + build
  imports   (vite
  .py)      build)
    │         │
    ▼         ▼
  Deploy    Deploy
  Render    Vercel
  (curl     (vercel-
  webhook)  action
    │        v25)
    │         │
    └────┬────┘
         ▼
  Telegram: ✅/❌
```

### 5.2 Detalhamento de Cada Workflow

#### Backend Deploy (`backend-deploy.yml`)
1. **Triggers:** push/PR em `main` com alterações em `backend/**`
2. **Job `test`:**
   - Python 3.12 no Ubuntu
   - `pip install -r requirements.txt`
   - `python test_imports.py` (valida imports)
   - Notifica Telegram (✅ ou ❌)
3. **Job `deploy-to-production`** (só no push, não no PR):
   - Depende do job `test` passar
   - Envia `curl -X POST $RENDER_DEPLOY_HOOK_URL`
   - Notifica Telegram

#### Frontend Deploy (`frontend-deploy.yml`)
1. **Triggers:** push/PR em `main` com alterações em `frontend/**`
2. **Job `test`:**
   - Node.js 20 no Ubuntu
   - `npm ci` + `npm run lint` + `npm run build`
   - Notifica Telegram
3. **Job `deploy`** (só no push):
   - Usa action `amondnet/vercel-action@v25` com `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - Notifica Telegram

#### Telegram Integration Test (`test-telegram-integration.yml`)
- Roda `python test_telegram.py` com as env vars do Telegram
- Notifica resultado

### 5.3 Como Verificar os Workflows no GitHub

1. Acesse https://github.com/arraesgustavo/melissa-levi
2. Clique na aba **Actions**
3. Veja o histórico de execuções de cada workflow
4. Clique em uma execução para ver os logs detalhados

---

## 6. COMO AUTOMATIZAR O DEPLOY (JÁ EXISTE — RESUMO)

O pipeline já está configurado. O fluxo é:

```bash
# 1. Faça alterações no código
# 2. Commit
git add .
git commit -m "✨ Minha alteração"

# 3. Push (master local → main remota)
git push origin master:main

# 4. Automático:
#    - GitHub Actions executa testes
#    - Se passarem, deploy no Render (backend) + Vercel (frontend)
#    - Notificações no Telegram
```

> **Nota:** A branch local é `master`, mas a remota é `main`. O push usa `master:main` explicitamente. Considere renomear a branch local para `main` para simplificar: `git branch -m master main && git push -u origin main`.

---

## 7. MELHORIAS RECOMENDADAS NA INFRAESTRUTURA E SEGURANÇA

### 🔴 Críticas (Imediatas)

1. **Secrets expostos no repositório:** O arquivo `backend/.env`, `.env.vercel` e `AGORA_FAÇA_ISTO.md` contêm tokens reais do Telegram e chaves do Supabase. Embora `.env` esteja no `.gitignore`, ele já foi commitado anteriormente. **Rotacione imediatamente:**
   - O token do Telegram (`8868771795:...`) — revogue via @BotFather e gere um novo
   - A chave anon do Supabase — gere uma nova no dashboard

2. **`.env` no histórico do Git:** Verifique com `git log -- backend/.env` se há versões antigas. Se sim, use `git filter-branch` ou `BFG Repo-Cleaner` para removê-las.

3. **`AGORA_FAÇA_ISTO.md` contém todos os secrets em texto puro** — delete ou adicione ao `.gitignore`.

### 🟡 Médias (Curto Prazo)

4. **Renomear branch `master` → `main`** para alinhar local e remoto e evitar o `master:main` em cada push.
5. **Atualizar actions/checkout@v3 → v4** (v3 está deprecated).
6. **Atualizar actions/setup-python@v4 → v5** e **actions/setup-node@v3 → v4**.
7. **Adicionar `.env.example` no backend** para documentar quais variáveis são necessárias sem expor valores.
8. **Adicionar `supabase/.env.local` ao `.gitignore`** — já está listado mas confirmar.
9. **Usar `SUPABASE_SERVICE_ROLE_KEY` no backend** em vez de `SUPABASE_ANON_KEY` para maior segurança (hoje usa anon key).
10. **Adicionar verificação de build do frontend em PRs** com deploy preview (Vercel já suporta).

### 🟢 Melhorias (Longo Prazo)

11. **Healthcheck automatizado pós-deploy** — um step que faz curl para `/health` do backend e verifica status 200.
12. **Cache de dependências** no workflow (pip cache, npm cache) para acelerar builds.
13. **Configurar Vercel Preview Deployments** para PRs (URLs efêmeras por branch).
14. **Adicionar testes unitários** (pytest para backend, vitest para frontend).
15. **Configurar alertas de downtime** (UptimeRobot ou similar gratuito).
16. **Migrar backend do Render Free Tier** para algo mais confiável se houver cold-start problemático (Railway, Fly.io, ou Vercel Functions).

---

## 8. PLANO DE MIGRAÇÃO — PRIORIDADE DE TAREFAS

### Fase 0 — Auditoria de Segurança (FAÇA AGORA)

| Prioridade | Tarefa | Ação |
|-----------|--------|------|
| **P0** | Rotacionar Telegram Bot Token | Acesse @BotFather → `/revoke` → gere novo token → atualize `.env`, Supabase, Render, Vercel e GitHub Secrets |
| **P0** | Rotacionar Supabase Anon Key | Supabase Dashboard → Settings → API → Revoke → gere nova → atualize `.env`, Vercel env vars, Render env vars |
| **P0** | Remover `AGORA_FAÇA_ISTO.md` ou sanitizá-lo | Delete o arquivo ou remova os valores sensíveis |
| **P0** | Limpar histórico Git de secrets | `git filter-branch` para remover `.env`, `.env.vercel`, `AGORA_FAÇA_ISTO.md` do histórico |

### Fase 1 — Verificação de Infraestrutura (HOJE)

| Prioridade | Tarefa | Onde |
|-----------|--------|------|
| **P1** | Verificar se o site está online | https://melissalevi.me |
| **P1** | Verificar GitHub Actions — última execução | https://github.com/arraesgustavo/melissa-levi/actions |
| **P1** | Verificar GitHub Secrets — existem os 6? | Settings → Secrets and variables → Actions |
| **P1** | Verificar Vercel — projeto ativo? Deploy mais recente? | https://vercel.com/arraesgustavo-projects/melissa-levi |
| **P1** | Verificar Render — serviço ativo? Último deploy? | https://dashboard.render.com |
| **P1** | Verificar Supabase — tabela `rsvps` existe? RLS ativo? | https://app.supabase.com → projeto `coopmbirrsayeelcjuzw` |
| **P1** | Verificar DNS — `nslookup melissalevi.me` → resolve para Vercel? | Terminal |
| **P1** | Verificar Telegram — bot responde? | Teste com `/start` no chat |

### Fase 2 — Correções e Atualizações (ESTA SEMANA)

| Prioridade | Tarefa | Arquivo |
|-----------|--------|---------|
| **P2** | Renomear branch local `master` → `main` | `git branch -m master main` |
| **P2** | Atualizar actions nos workflows (v3→v4, v4→v5) | `.github/workflows/backend-deploy.yml`, `frontend-deploy.yml`, `test-telegram-integration.yml` |
| **P2** | Adicionar `.env.example` ao backend (se não existir) | `backend/.env.example` |
| **P2** | Atualizar URL do frontend no Vercel env vars se mudou | Vercel Dashboard |
| **P2** | Testar RSVP end-to-end em produção | https://melissalevi.me/rsvp |

### Fase 3 — Robustez (PRÓXIMO MÊS)

| Prioridade | Tarefa |
|-----------|--------|
| **P3** | Migrar backend para `SUPABASE_SERVICE_ROLE_KEY` (não anon) |
| **P3** | Adicionar cache de dependências nos workflows |
| **P3** | Configurar Vercel Preview Deployments para PRs |
| **P3** | Adicionar testes automatizados (pytest, vitest) |
| **P3** | Configurar monitoramento de uptime (UptimeRobot) |

---

## 9. ARQUIVOS-CHAVE — REFERÊNCIA RÁPIDA

| Arquivo | Função |
|---------|--------|
| `README.md` | Visão geral, setup, deploy manual |
| `ARCHITECTURE.md` | Arquitetura detalhada, fluxos, convenções |
| `CI-CD-SETUP.md` | Configuração do CI/CD com GitHub Actions |
| `QUICKSTART.md` | Guia rápido para desenvolvimento local |
| `stack.md` | Especificação técnica da stack gratuita |
| `AGORA_FAÇA_ISTO.md` | ⚠️ Contém secrets — ação imediata necessária |
| `backend/.env` | ⚠️ Contém secrets — já está no `.gitignore` |
| `.env.vercel` | ⚠️ Contém secrets — template para Vercel |
| `.github/workflows/backend-deploy.yml` | CI/CD do backend |
| `.github/workflows/frontend-deploy.yml` | CI/CD do frontend |
| `.github/workflows/test-telegram-integration.yml` | Teste de integração Telegram |
| `backend/main.py` | Entry point FastAPI, CORS, middleware de erro |
| `backend/render.yaml` | Configuração de deploy no Render |
| `backend/models/rsvp.py` | Modelo Pydantic do RSVP |
| `backend/routers/rsvp.py` | Endpoints POST/GET do RSVP |
| `backend/services/supabase.py` | Singleton do cliente Supabase |
| `backend/services/telegram.py` | Notificações Telegram |
| `frontend/package.json` | Dependências e scripts do frontend |
| `frontend/vite.config.js` | Config Vite + proxy `/api` |
| `frontend/vercel.json` | Config de deploy no Vercel |
| `supabase/migrations/001_create_rsvps.sql` | Schema + RLS |
| `.gitignore` | Regras de ignore |

---

## Resumo Executivo

O projeto é um site de casamento full-stack com **React + Vite (frontend)** e **FastAPI + Python (backend)**, usando **Supabase** como banco, **Vercel** e **Render** como hosting, **Telegram** para notificações, e **GitHub Actions** para CI/CD. O domínio `melissalevi.me` está configurado via Name.com apontando para Vercel.

**Ação mais urgente:** Rotacionar todos os tokens e chaves expostos no repositório (Telegram, Supabase) e limpar o histórico do Git. Depois, verificar se cada plataforma (Vercel, Render, Supabase) está operacional e com as variáveis de ambiente corretas.
