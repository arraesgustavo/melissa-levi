# Melissa & Levi Wedding Site

Production-ready full-stack wedding website built with React, FastAPI, and Supabase.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [DNS Configuration](#dns-configuration)
- [GitHub Actions Secrets](#github-actions-secrets)
- [Deployment Checklist](#deployment-checklist)

## Overview

This project is a complete wedding website with:

- **Frontend**: React 18 + Vite + Material-UI v5 (deployed on Vercel)
- **Backend**: FastAPI + Python 3.11+ (deployed on Render)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Monitoring**: Telegram Bot alerts for errors
- **CI/CD**: GitHub Actions for automated deployments

### Architecture

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

## Prerequisites

- **Node.js** 20+ (for frontend)
- **Python** 3.11+ (for backend)
- **Supabase CLI** (optional, for local migrations)
- **Vercel CLI** (for frontend deployment)
- **Git** (for version control)

### Installation

```bash
# Verify Node.js
node --version  # should be v20+

# Verify Python
python3 --version  # should be 3.11+

# Install Vercel CLI (optional)
npm install -g vercel

# Install Supabase CLI (optional)
npm install -g supabase
```

## Local Development

### 1. Clone Repository

```bash
git clone <repository-url>
cd melissa-levi
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Run Local Development Servers

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python3 -m uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

Visit `http://localhost:5173` in your browser. The frontend will automatically proxy API requests to the backend via Vite's dev server.

## Environment Configuration

### Frontend (.env.local)

Create `frontend/.env.local` (only needed in production or specific environments):

```env
VITE_API_URL=https://api.melissalevi.me
```

**Note**: In local development, the Vite dev server proxies `/api` requests to `localhost:8000`.

### Backend (.env)

Create `backend/.env` from the template:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=9876543210
FRONTEND_URL=https://melissalevi.me
```

**⚠️ IMPORTANT**: Never commit `.env` files to Git. Use `.env.example` as a template.

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New project"
3. Choose region (preferably closest to your users)
4. Generate a strong database password
5. Create project and wait for initialization

### 2. Get Connection Credentials

1. Open your Supabase project
2. Go to **Settings** → **API**
3. Copy the **URL** and **anon public key**
4. Add them to `backend/.env`

### 3. Create Database Schema

**Option A: Using Supabase Dashboard (Recommended for beginners)**

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy and paste the contents of `supabase/migrations/001_create_rsvps.sql`
4. Click **Run**

**Option B: Using Supabase CLI**

```bash
# If you have Supabase CLI installed
supabase link --project-ref=your-project-ref
supabase db push
```

### 4. Verify Schema

In Supabase dashboard:
1. Go to **Database** → **Tables**
2. Verify `rsvps` table exists with these columns:
   - `id` (uuid, primary key)
   - `name` (text)
   - `email` (text)
   - `attending` (text: 'yes' or 'no')
   - `guests` (integer)
   - `meal` (text)
   - `dietary` (text)
   - `song` (text)
   - `note` (text)
   - `created_at` (timestamptz)

## Telegram Bot Setup (Optional but Recommended)

### 1. Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name (e.g., "Melissa & Levi Wedding Bot")
4. Choose a username (e.g., `melissa_levi_wedding_bot`)
5. Copy the **bot token** (looks like `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### 2. Get Your Chat ID

1. Create a private Telegram group (or use your personal chat)
2. Add your bot to the group
3. Send a test message to the bot
4. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for `"chat":{"id":...}` to find your chat ID

### 3. Add to .env

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=9876543210
```

## DNS Configuration

Configure your domain registrar to point to Vercel.

### Name.com Configuration

1. Log into your Name.com account
2. Select your domain (`melissalevi.me`)
3. Go to **Manage DNS Records**
4. Remove any existing A, CNAME, or MX records for the root domain
5. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 300 |
| CNAME | www | cname.vercel-dns.com. | 300 |

6. Click **Save**
7. Wait for DNS propagation (usually 15-30 minutes)

### Verify DNS

```bash
# Check A record
nslookup melissalevi.me

# Check CNAME record
nslookup www.melissalevi.me
```

**Note**: Vercel will automatically provision an SSL/TLS certificate from Let's Encrypt once DNS is configured.

## GitHub Actions Secrets

Configure secrets in your GitHub repository for automated deployments.

### 1. Backend Deployment Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

```
RENDER_DEPLOY_HOOK_URL
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

To get `RENDER_DEPLOY_HOOK_URL`:
1. Create a service in Render.com
2. Go to **Settings** → **Deploy Hook**
3. Copy the webhook URL

### 2. Frontend Deployment Secrets

Add these secrets for Vercel deployment:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Get these values by:
```bash
# After installing Vercel CLI
cd frontend
vercel login
vercel env list  # To verify your project is linked
```

Or manually from Vercel dashboard:
1. Go to your Vercel project
2. **Settings** → **Tokens** (for VERCEL_TOKEN)
3. **Settings** → **General** (for ORG_ID and PROJECT_ID in URL)

## Deployment Checklist

### Frontend (Vercel)

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Link project: `cd frontend && vercel login && vercel link`
- [ ] Set environment variables in Vercel dashboard
- [ ] Deploy: `vercel --prod`
- [ ] Verify: `https://melissalevi.me` loads correctly
- [ ] Test form submission on `/rsvp`

### Backend (Render)

- [ ] Create account at render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure build command: `pip install -r requirements.txt`
- [ ] Configure start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
  - `FRONTEND_URL`
- [ ] Deploy and verify: `https://<service-name>.onrender.com/health` returns `{"status":"ok"}`
- [ ] Test RSVP endpoint: `curl -X POST https://<service-name>.onrender.com/api/rsvp -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","attending":"yes"}'`

### Database (Supabase)

- [ ] Create Supabase project
- [ ] Run migration: Create `rsvps` table
- [ ] Enable Row Level Security
- [ ] Verify table has correct columns
- [ ] Test connection from backend

### DNS & SSL

- [ ] Configure DNS records at Name.com (A and CNAME)
- [ ] Wait for DNS propagation (15-30 min)
- [ ] Verify SSL certificate issued by Let's Encrypt
- [ ] Test HTTPS at `https://melissalevi.me`

### GitHub Actions

- [ ] Add all required secrets to repository
- [ ] Push to `main` branch
- [ ] Verify workflows run successfully
- [ ] Check Telegram notifications

### Post-Launch Testing

- [ ] [ ] Open https://melissalevi.me on desktop
- [ ] [ ] Navigate through all pages (Home, Quando & Onde, RSVP)
- [ ] [ ] Test form submission with valid data
- [ ] [ ] Verify RSVP appears in Supabase dashboard
- [ ] [ ] Check Telegram notification received
- [ ] [ ] Test on mobile (iOS Safari, Chrome, Firefox)
- [ ] [ ] Verify touch targets are ≥44×44px
- [ ] [ ] Test animations (scroll reveals)
- [ ] [ ] Test images load correctly
- [ ] [ ] Verify registry link works

## Troubleshooting

### "API requests returning 404 or CORS error"

**Frontend (Vite dev)**: The dev server should proxy `/api` to `http://localhost:8000`. Make sure both services are running.

**Production**: Ensure `FRONTEND_URL` environment variable in backend matches your Vercel domain.

### "RSVP not saving to database"

1. Check backend logs for errors
2. Verify Supabase credentials in `.env`
3. Verify `rsvps` table exists in Supabase
4. Check Row Level Security policies allow inserts

### "Telegram notifications not sending"

1. Verify bot token is correct
2. Verify chat ID is correct
3. Ensure bot has permission to send messages in the chat
4. Check backend logs for Telegram API errors

### "DNS not resolving"

```bash
# Clear DNS cache and check
nslookup melissalevi.me
dig melissalevi.me

# Wait up to 48 hours for full propagation
```

## Project Structure

```
melissa-levi/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── layout/          # Layout components (NavBar, Footer)
│   │   ├── theme/           # MUI theme & colors
│   │   ├── data/            # Wedding data
│   │   └── App.jsx          # Main app with router
│   ├── public/              # Static assets
│   ├── vite.config.js       # Vite configuration
│   ├── package.json
│   └── vercel.json          # Vercel SPA rewrite rules
│
├── backend/                 # FastAPI application
│   ├── main.py             # FastAPI app entry point
│   ├── routers/            # API route handlers
│   ├── services/           # External services (Supabase, Telegram)
│   ├── models/             # Pydantic models
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── render.yaml         # Render deployment config
│
├── supabase/
│   └── migrations/         # SQL migrations
│       └── 001_create_rsvps.sql
│
├── .github/
│   └── workflows/          # GitHub Actions workflows
│       ├── backend-deploy.yml
│       └── frontend-deploy.yml
│
└── README.md              # This file
```

## Production Notes

### Monitoring & Alerts

- **Backend errors**: Automatically sent to Telegram
- **Deployment status**: Sent to Telegram after each GitHub Actions run
- **Database**: Monitor Supabase dashboard for connection pool usage

### Cost Estimate (Monthly)

- **Vercel**: $0 (Hobby plan)
- **Render**: $0 (Free tier, up to 100 concurrent connections)
- **Supabase**: $0 (Free tier, 500MB database)
- **Telegram**: $0 (Bot API)
- **Domain**: ~$10-15 (varies by registrar)
- **Total**: ~$10-15/month

### Maintenance

- Update dependencies quarterly: `npm upgrade`, `pip install --upgrade -r requirements.txt`
- Monitor Supabase storage usage
- Review Telegram logs monthly
- Backup database regularly (Supabase auto-backups included)

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review deployment logs in GitHub Actions
3. Check Render and Vercel dashboards
4. Review Supabase database status

---

**Site**: https://melissalevi.me  
**Date**: 2027-07-XX  
**Location**: São José dos Campos, São Paulo, Brasil
# Rebuild
