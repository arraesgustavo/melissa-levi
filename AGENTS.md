# AGENTS.md — Internal Project Context

Working context and invariants for AI agents operating in the **Melissa & Levi** wedding website repository. For full human-facing documentation, see `README.md`.

## 1. Project Identity & Production Coordinates

- **App**: Full-stack wedding website for Melissa & Levi (`11.07.2027`, Bassi Eventos, São José dos Campos - SP, Brazil).
- **UI Language**: Brazilian Portuguese (`pt-BR`) for all user-facing copy, validation errors, and Telegram messages.
- **Git Branch**: `main` (both local and `origin/main`).
- **Production Frontend**: `https://melissalevi.page` (Vercel project `melissa-levi`, **Root Directory = `frontend`**). Do **not** use `melissalevi.me` (legacy domain that does not resolve).
- **Production Backend**: `https://melissa-levi-backend.onrender.com` (Render Free Web Service; note `backend/render.yaml` has `name: melissa-levi-api`, which only applies to initial Blueprint creation—live env vars are managed in the Render Dashboard).
- **Database & Auth**: Supabase PostgreSQL + GoTrue Auth + Row Level Security (`supabase/migrations/`).

## 2. Critical Architectural Invariants (Do Not Break)

1. **Same-Origin `/api/*` Proxying**:
   - Production: `frontend/vercel.json` rewrites `/api/(.*)` → `https://melissa-levi-backend.onrender.com/api/$1` and falls back `/(.*)` → `/index.html`.
   - Local dev: `frontend/vite.config.js` proxies `/api` → `http://localhost:8000`.
   - Keep frontend API calls relative (`/api/rsvp`, `/api/admin/rsvps`). Do not re-introduce `VITE_API_URL`.
   - `frontend/src/pages/RSVP.jsx` must continue validating `response.ok && data?.status === 'ok'` to prevent false-positive confirmations if a proxy misconfiguration returns SPA HTML with HTTP `200`.

2. **Supabase Client Separation & RLS (`backend/services/supabase.py`)**:
   - `002_admin_rls.sql` dropped `"anon read all"` and added `"admin read all"` (`FOR SELECT TO authenticated USING ((select auth.uid()) = 'b20dc951-b872-4123-991a-df1e2fb12f01'::uuid)`).
   - `POST /api/rsvp` **must** use `get_service_client()` (`SUPABASE_SERVICE_ROLE_KEY`) because PostgREST `.insert().execute()` implicitly requests `RETURNING *` and fails under `anon` without SELECT permission.
   - `GET /api/admin/rsvps` **must** use `get_client_for_token(token)` (a fresh client per request with `Authorization: Bearer <token>`) so PostgreSQL RLS is enforced as defense-in-depth alongside `get_current_admin` (`ADMIN_USER_ID` check) and auth headers never leak across concurrent requests. Never mutate headers on the shared `_client` singleton.

3. **Isolated `/admin` Bundle & Layout**:
   - `frontend/src/App.jsx` lazy-loads `Admin.jsx` so `@supabase/supabase-js` and `@mui/x-data-grid` stay out of the main guest bundle.
   - `NavBar` and `Footer` are intentionally hidden when `pathname === '/admin'`.
   - `frontend/src/lib/supabaseClient.js` intentionally hardcodes the public Supabase URL and `anon` key (workaround for Vercel build-time env var issues). Never place `SUPABASE_SERVICE_ROLE_KEY` or other secrets in frontend code.

4. **Non-Blocking Telemetry**:
   - Telegram alerts (`backend/services/telegram.py`) are dispatched via `asyncio.create_task(...)` in both `routers/rsvp.py` and `error_telemetry_middleware` (`backend/main.py`) so notification latency/failures never block or fail API responses.

## 3. Codebase Map

| Area | Key Files | Responsibility |
|---|---|---|
| Frontend Shell | `frontend/src/App.jsx`, `theme/index.js` | Router (`/`, `/quando-onde`, `/rsvp`, `/admin`), MUI v9 theme (`COLORS`, `FONTS`), global CSS |
| Layout & UI | `frontend/src/layout/{NavBar,Footer}.jsx`, `components/{Eyebrow,Ornament,FadeImage,Reveal}.jsx` | Editorial chrome, scroll reveals, image fade/fallback |
| Pages | `frontend/src/pages/{Home,WhenWhere,RSVP,Admin}.jsx` | Public pages, RSVP submission, Admin DataGrid |
| Static Data | `frontend/src/data/wedding.js` | Couple names, dates, venue, registry URL, images |
| Backend Core | `backend/main.py`, `models/rsvp.py` | FastAPI app, CORS, 500 Telegram middleware, `/health`, Pydantic `RSVPSubmission` |
| Backend API | `backend/routers/{rsvp,admin}.py` | `POST /api/rsvp` (201), `GET /api/admin/rsvps` (admin JWT) |
| Backend Services | `backend/services/{auth,supabase,telegram}.py` | JWT admin guard (`401`/`403`), Supabase clients, Telegram Bot API |
| Database | `supabase/migrations/001_create_rsvps.sql`, `002_admin_rls.sql` | `public.rsvps` schema, `idx_rsvps_email`, RLS policies |
| CI/CD | `.github/workflows/{backend-deploy,frontend-deploy}.yml` | Import test + Render webhook, lint/build + `vercel@latest` prebuilt deploy |

## 4. Coding & Maintenance Conventions

- **Frontend**: React 19, Vite 8, React Router v7, MUI v9 (`sx` prop). Preserve the editorial visual language: warm cream palette (`COLORS` in `theme/index.js`), `Cormorant Garamond` / `Jost` fonts, `borderRadius: 0`, ≥44px touch targets, and `16px` input font sizes (prevents iOS Safari auto-zoom).
- **Backend**: FastAPI + Pydantic v2 (`model_dump()`). Keep routes thin and delegate external I/O to `backend/services/`.
- **Documentation**: `README.md` is the single source of truth. Update `README.md` (and this `AGENTS.md` if invariants change) instead of creating new ad-hoc `.md` files.
- **Secrets & Git Hygiene**: Never commit `.env`, `.env.local`, `.env.vercel`, or plaintext tokens/keys. Avoid staging nested `backend/**/__pycache__/*.pyc` files (currently tracked due to incomplete `.gitignore`).

## 5. Verification Commands

```bash
# Backend tests (from repo root)
cd backend && source venv/bin/activate && python test_imports.py && python test_auth.py

# Frontend lint & build (from repo root)
cd frontend && npm run lint && npm run build

# Run full stack locally
./dev.sh
```

## 6. Known Issues & Backlog

- **Configuration reminders**: Replace placeholder `pixKey` in `frontend/src/data/wedding.js`, apply `supabase/migrations/003_rsvp_guests_children_phone_unique_email.sql` in Supabase, and set `RESEND_API_KEY` (or `SMTP_*`) + `EMAIL_FROM` on Render for live confirmation emails.
- **CI gaps**: `backend-deploy.yml` runs `test_imports.py` but not `test_auth.py`/`test_rsvp.py`; `frontend-deploy.yml` has `continue-on-error: true` on `npm run lint`; workflows still use `actions/checkout@v3`, `actions/setup-python@v4`, `actions/setup-node@v3`.
- **Backlog (`todo.txt`)**: Duplicate-name conflict prevention, confirmation email 1 month before the wedding, countdown timer.
