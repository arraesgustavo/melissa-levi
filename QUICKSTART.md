# Quick Start Guide

## Development Setup (5 minutes)

### 1. Start Frontend
```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

### 2. Start Backend (in another terminal)
```bash
cd backend
source venv/bin/activate
python3 -m uvicorn main:app --reload
# API at http://localhost:8000
```

The frontend will proxy `/api/*` requests to the backend automatically.

### 3. Test the Site

Visit `http://localhost:5173` and:
- [ ] Navigate through all pages
- [ ] Scroll to see animations
- [ ] Test RSVP form (will fail without Supabase, but form validates)
- [ ] Check console for errors

---

## Before Production Deployment

### 1. Create Supabase Project
- Visit https://supabase.com
- Create new project and get credentials
- Run SQL migration from `supabase/migrations/001_create_rsvps.sql`
- Add credentials to `backend/.env`

### 2. Create Telegram Bot (Optional)
- Chat with @BotFather on Telegram
- Get bot token and chat ID
- Add to `backend/.env`

### 3. Deploy Frontend
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### 4. Deploy Backend
- Create account at https://render.com
- Connect GitHub repository
- Render will auto-deploy on push to main
- Set environment variables in Render dashboard

### 5. Configure DNS
- Point domain to Vercel (Name.com)
  - A record: `@` → `76.76.21.21`
  - CNAME record: `www` → `cname.vercel-dns.com.`
- Wait for DNS propagation (15-30 min)

### 6. GitHub Actions Secrets
Add to repository secrets:
- `RENDER_DEPLOY_HOOK_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

---

## Full Setup Instructions

See **[README.md](./README.md)** for complete documentation including:
- Environment configuration
- Database setup
- DNS configuration
- Deployment checklist
- Troubleshooting

---

## Key Features

✅ **Responsive Design** - Pixel-perfect mobile-first design  
✅ **Smooth Animations** - Scroll reveals and transitions  
✅ **RSVP Form** - Validation + Telegram notifications  
✅ **Production Ready** - Error handling + monitoring  
✅ **Zero-Cost Hosting** - Free tier infrastructure  
✅ **Automated Deploys** - GitHub Actions CI/CD  

---

## Tech Stack

| Layer | Technology | Free Tier |
|-------|-----------|-----------|
| Frontend | React 18 + Vite + MUI | ✅ Vercel Hobby |
| Backend | FastAPI + Python | ✅ Render Free |
| Database | Supabase (PostgreSQL) | ✅ 500MB |
| CDN | Vercel Edge Network | ✅ Included |
| Domain | Name.com | ~$10-15/yr |
| Monitoring | Telegram Bot API | ✅ Free |

---

## Troubleshooting

### Build fails
```bash
# Clear node_modules and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Backend won't start
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn main:app --reload
```

### API requests returning 404
- Make sure both frontend and backend are running
- Check that Vite proxy is configured in `vite.config.js`
- Verify backend is listening on `http://localhost:8000`

---

For detailed instructions, see **[README.md](./README.md)**
