# Melissa & Levi — Wedding Website Documentation

Central technical documentation and source of truth for the **Melissa & Levi** full-stack wedding website (`https://melissalevi.page`).

- **Repository**: `https://github.com/arraesgustavo/melissa-levi` (default branch: `main`)
- **Production Frontend**: `https://melissalevi.page` (Vercel)
- **Production Backend**: `https://melissa-levi-backend.onrender.com` (Render)
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security + GoTrue Auth)
- **Notifications & Alerts**: Telegram Bot API

---

## Table of Contents

1. [Overview & Capabilities](#1-overview--capabilities)
2. [System Architecture](#2-system-architecture)
3. [Project Structure](#3-project-structure)
4. [Key Architectural Decisions & Git History Insights](#4-key-architectural-decisions--git-history-insights)
5. [Components, Modules & Responsibilities](#5-components-modules--responsibilities)
6. [Database Schema & Security (RLS)](#6-database-schema--security-rls)
7. [API Reference](#7-api-reference)
8. [Dependencies & Environment Configuration](#8-dependencies--environment-configuration)
9. [Local Development & Testing](#9-local-development--testing)
10. [CI/CD & Production Deployment](#10-cicd--production-deployment)
11. [Known Issues, Security Advisories & Backlog](#11-known-issues-security-advisories--backlog)

---

## 1. Overview & Capabilities

The application is a decoupled, zero-fixed-cost full-stack wedding site built for **Melissa & Levi** (event date: **July 11, 2027**, at **Bassi Eventos**, São José dos Campos, SP, Brazil):

- **Public Editorial Pages**: Responsive, mobile-first `Home` (`/`) and `Quando & Onde` (`/quando-onde`) pages with custom typography (`Cormorant Garamond` + `Jost`), scroll-reveal animations, and a gift registry link.
- **RSVP Flow (`/rsvp`)**: Interactive form with client-side and server-side (Pydantic) validation, conditional attendance fields, PostgreSQL persistence, and real-time Telegram notifications.
- **Admin Dashboard (`/admin`)**: Protected guest management view authenticated via Supabase email/password login, backed by JWT verification + PostgreSQL RLS, and rendered with MUI `DataGrid`.
- **Operational Telemetry**: Unhandled backend HTTP `500` errors and GitHub Actions CI/CD events automatically alert a Telegram chat.

---

## 2. System Architecture

```text
User Browser (https://melissalevi.page)
  │
  ├── Static SPA Assets ──────────────────► Vercel Edge Network (React + Vite)
  │
  ├── /api/* (Same-Origin Rewrite) ───────► Vercel Proxy (frontend/vercel.json)
  │                                               │
  │                                               ▼
  │                                         Render Web Service (FastAPI + Uvicorn)
  │                                               ├── POST /api/rsvp (service_role) ──► Supabase PostgreSQL
  │                                               ├── GET /api/admin/rsvps (JWT+RLS) ─► Supabase PostgreSQL
  │                                               └── Async Alerts (RSVP / 500s) ─────► Telegram Bot API
  │
  └── /admin Auth (Sign-in / Session) ────► Supabase Auth (GoTrue)
```

### Core Data Flows

1. **RSVP Submission (`POST /api/rsvp`)**:
   - Guest submits the form in `frontend/src/pages/RSVP.jsx`.
   - Frontend sends `POST /api/rsvp` (proxied to `localhost:8000` by Vite in dev, or to `https://melissa-levi-backend.onrender.com/api/rsvp` by `frontend/vercel.json` in production).
   - FastAPI validates the payload with `RSVPSubmission` (`backend/models/rsvp.py`), inserts into `public.rsvps` using the Supabase `service_role` client, and schedules a non-blocking Telegram notification via `asyncio.create_task`.
   - Frontend verifies both `response.ok` and `data?.status === 'ok'` before showing the confirmation screen.

2. **Admin Guest List (`GET /api/admin/rsvps`)**:
   - Admin visits `/admin` (lazy-loaded bundle without public `NavBar`/`Footer`) and signs in via `supabase.auth.signInWithPassword`.
   - Frontend calls `GET /api/admin/rsvps` with `Authorization: Bearer <access_token>`.
   - Backend dependency `get_current_admin` validates the JWT with Supabase Auth and verifies `user.id == ADMIN_USER_ID` (`401` if invalid/expired, `403` if non-admin).
   - Backend instantiates a fresh per-request Supabase client scoped to that JWT (`get_client_for_token`), querying `public.rsvps` under PostgreSQL RLS (`"admin read all"`).

---

## 3. Project Structure

```text
melissa&levi/
├── README.md                          # Central project documentation (this file)
├── dev.sh                             # Local dev launcher (starts backend + frontend concurrently)
├── todo.txt                           # Feature backlog notes
├── backend/                           # FastAPI application (Render)
│   ├── main.py                        # App entry point, CORS, 500 telemetry middleware, /health
│   ├── render.yaml                    # Render Blueprint specification
│   ├── requirements.txt               # Pinned Python dependencies
│   ├── models/
│   │   └── rsvp.py                    # Pydantic schema: RSVPSubmission
│   ├── routers/
│   │   ├── rsvp.py                    # POST /api/rsvp
│   │   └── admin.py                   # GET /api/admin/rsvps
│   ├── services/
│   │   ├── auth.py                    # Admin JWT verification dependency (get_current_admin)
│   │   ├── supabase.py                # Supabase clients (anon, service_role, per-token)
│   │   └── telegram.py                # Async/sync Telegram alert dispatchers
│   ├── test_imports.py                # Module import smoke test (run in CI)
│   ├── test_auth.py                   # Unit tests for admin authorization (200/401/403)
│   └── test_telegram.py               # Live Telegram bot connectivity test
├── frontend/                          # React + Vite SPA (Vercel, Root Directory = frontend)
│   ├── index.html                     # HTML entry point & Google Fonts links
│   ├── package.json                   # Frontend dependencies & npm scripts
│   ├── vite.config.js                 # Vite config + local /api -> localhost:8000 proxy
│   ├── vercel.json                    # Production /api/* proxy to Render + SPA fallback rewrite
│   ├── eslint.config.js               # ESLint flat configuration
│   ├── .env.example                   # Template for VITE_SUPABASE_* vars (currently unused at runtime)
│   └── src/
│       ├── main.jsx                   # React root mount
│       ├── App.jsx                    # ThemeProvider, global CSS, Router, lazy /admin route
│       ├── theme/index.js             # MUI theme, COLORS, FONTS, component overrides
│       ├── data/wedding.js            # Static wedding metadata & image URLs
│       ├── lib/supabaseClient.js      # Supabase browser client (used by /admin)
│       ├── layout/
│       │   ├── NavBar.jsx             # Fixed responsive header + mobile Drawer
│       │   └── Footer.jsx             # Dark footer with navigation links
│       ├── components/
│       │   ├── index.js               # Barrel export
│       │   ├── Eyebrow.jsx            # Uppercase tracked section label
│       │   ├── Ornament.jsx           # Decorative diamond divider
│       │   ├── FadeImage.jsx          # Progressive image fade-in with "M & L" error fallback
│       │   └── Reveal.jsx             # IntersectionObserver + scroll reveal animation
│       └── pages/
│           ├── Home.jsx               # Landing page (Hero, Invitation, Strip, Accommodations, Registry, CTA)
│           ├── WhenWhere.jsx          # Event details & schedule
│           ├── RSVP.jsx               # RSVP form, validation, API submission, ConfirmCard
│           └── Admin.jsx              # Admin login & MUI DataGrid guest table
├── supabase/
│   └── migrations/
│       ├── 001_create_rsvps.sql       # rsvps table, email index, initial RLS policies
│       └── 002_admin_rls.sql          # Drops anon SELECT, adds admin-only authenticated SELECT
├── .github/workflows/
│   ├── backend-deploy.yml             # Backend import test + Render webhook deploy + Telegram alerts
│   ├── frontend-deploy.yml            # Frontend lint/build + Vercel prebuilt deploy + Telegram alerts
│   └── test-telegram-integration.yml  # Telegram integration test on telegram.py changes
├── resources/                         # Local image assets (venue photo)
├── qrcode/                            # Generated wedding QR codes (untracked locally)
└── claude-design/                     # Original static design prototype & screenshots (non-production)
```

---

## 4. Key Architectural Decisions & Git History Insights

The repository's Git history reveals several critical design decisions and production fixes that explain the current implementation:

| Decision / Fix | Commits | Rationale & Current Behavior |
|---|---|---|
| **Same-origin `/api/*` proxy in Vercel** | `c5f6a6b`, `aeb6046` | Previously, missing `VITE_API_URL` caused `/api/rsvp` to hit Vercel's SPA rewrite and return `index.html` with HTTP `200` (a false-positive success). Now `frontend/vercel.json` proxies `/api/(.*)` directly to Render, and `RSVP.jsx` explicitly validates `data?.status === 'ok'`. |
| **Production domain is `melissalevi.page`** | `b51e608`, `5e86a15` | Earlier docs referenced `melissalevi.me` (which does not resolve). The live domain is `https://melissalevi.page`, reflected in `backend/render.yaml` and `frontend-deploy.yml`. |
| **Admin panel with defense-in-depth RLS** | `bfa363f`, `f911de6` | Replaced the open `GET /api/rsvps` endpoint with `GET /api/admin/rsvps`. Access is enforced twice: in FastAPI (`ADMIN_USER_ID` check) and in PostgreSQL (`002_admin_rls.sql` restricts `SELECT` to the admin UUID). |
| **`service_role` client for RSVP inserts** | `afe0a70` | After `002_admin_rls.sql` removed `"anon read all"`, PostgREST inserts using the `anon` key failed because `.insert().execute()` implicitly requests `RETURNING *`. `POST /api/rsvp` now uses `get_service_client()` (`SUPABASE_SERVICE_ROLE_KEY`). |
| **Per-request Supabase client for admin reads** | `bfa363f` | `get_client_for_token(token)` creates a fresh Supabase client per request rather than mutating headers on a shared singleton, preventing `Authorization` token leakage across concurrent requests. |
| **Lazy-loaded `/admin` route** | `bfa363f` | `App.jsx` lazy-loads `Admin.jsx` so `@supabase/supabase-js` and `@mui/x-data-grid` stay out of the main guest bundle and any admin-side error cannot break the public wedding pages. |
| **Hardcoded Supabase config in frontend** | `3975917`, `9d0a59d`, `709e306` | After Vercel build-time env var issues with `VITE_SUPABASE_*`, `frontend/src/lib/supabaseClient.js` was updated to hardcode the public Supabase URL and `anon` key directly. This is safe because the `anon` key is designed to be public and data access is protected by RLS. |
| **Vercel CLI prebuilt CI/CD** | `309072c` | Replaced `amondnet/vercel-action@v25` (pinned to an obsolete Vercel CLI rejected by Vercel's API) with `vercel@latest` running `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod` from the repository root (matching Vercel's `Root Directory = frontend` setting). |
| **Hardened Render deploy webhook** | `14d9d67`, `12ed67b` (PR #2) | `backend-deploy.yml` strips `\r\n`, asserts non-empty `https://` URL, and uses `curl --fail` so misconfigured secrets fail loudly. |

---

## 5. Components, Modules & Responsibilities

### Frontend (`frontend/src/`)

- **`App.jsx`**: Wraps the app in MUI `ThemeProvider` + `CssBaseline`, injects global CSS (44px touch ergonomics, `font-size: 16px !important` on inputs to prevent iOS Safari zoom, keyframe animations, `prefers-reduced-motion`), configures `BrowserRouter` routes (`/`, `/quando-onde`, `/rsvp`, `/admin`), and hides `NavBar`/`Footer` on `/admin`.
- **`theme/index.js`**: Defines the warm editorial palette (`cream: #F4EEE3`, `creamDeep: #ECE3D4`, `ink: #1C1B19`, `taupe: #7A6F60`, `line: #CDC2AE`, `accent: #8A6F52`), serif/sans typography (`Cormorant Garamond` / `Jost`), sharp corners (`borderRadius: 0`), and ≥44px touch targets.
- **`layout/NavBar.jsx` & `layout/Footer.jsx`**: Fixed header that stays transparent over the `Home` hero and transitions to frosted cream on scroll (`scrollY > 60`), switching to a top-anchored MUI `Drawer` below `900px`.
- **`components/`**:
  - `Eyebrow.jsx`: Uppercase, wide-tracked section header.
  - `Ornament.jsx`: Horizontal hairline divider with rotated diamond.
  - `FadeImage.jsx`: Image wrapper with fade/scale transition on load and an `"M & L"` monogram fallback on load failure.
  - `Reveal.jsx`: Scroll-triggered entrance animation using `IntersectionObserver` with a passive scroll listener fallback.
- **`pages/Home.jsx`**: Composes `Hero`, `Invitation`, `WhenWhereStrip` (`Domingo, 11 de Julho de 2027` · `Cerimônia · 15h` and centered `Onde` without photos), `Registry` (Amazon link + copyable PIX button with Snackbar toast), and `ClosingCTA`. (`Accommodations` section removed.)
- **`pages/WhenWhere.jsx`**: Event date/time/venue details (centered, with `"A cerimônia e a recepção serão realizadas no Bassi Eventos."` and centered parking callout `"Terá estacionamento no local."` in the `Onde` section), responsive `Bassi Eventos` gallery (`photo1.jpeg` & `photo2.jpeg`), and RSVP CTA.
- **`pages/RSVP.jsx`**: Controlled form (`name`, `email`, `phone`, `attending`, `guests` >7 years + individual `guest_names`, independent `children_count` ≤7 years + `children_names`, `note`). Handles HTTP `409` duplicate email rejection, displays `ConfirmCard` with individual guest removal, and supports self-service guest management via `/rsvp?token=<manage_token>`.
- **`pages/Admin.jsx`**: Subscribes to `supabase.auth.onAuthStateChange`, renders `LoginForm` when unauthenticated, fetches `GET /api/admin/rsvps` when authenticated (auto-signing out on `401`), displays summary stats and MUI `DataGrid` (with phone, adult/child guest names, and a `ManageGuestsDialog` to remove individual guests via `DELETE /api/admin/rsvps/{rsvp_id}/guests/{guest_id}`).
- **`data/wedding.js`**: Central static configuration for couple names, event dates (`Domingo, 11 de Julho de 2027`, `Cerimônia · 15h`), venue (`Bassi Eventos`), address, parking notice, registry URL, PIX key (`pixKey`), and Vite-bundled venue images (`src/assets/photo1.jpeg`, `photo2.jpeg`).

### Backend (`backend/`)

- **`main.py`**: Initializes FastAPI (`v1.0.0`), configures `CORSMiddleware` (`localhost`, `localhost:5173`, `localhost:3000`, `FRONTEND_URL`), registers `error_telemetry_middleware` (dispatches HTML-formatted Telegram alerts with a 500-char stack trace on unhandled exceptions), mounts `rsvp_router` and `admin_router`, and exposes `GET /health`.
- **`models/rsvp.py`**: `RSVPSubmission(BaseModel)` enforcing required `name`, `email`, `phone` (10–15 digits), `attending`, `guests` (>7 years) with matching `guest_names`, independent `children_count` with matching `children_names`, and optional `note`; plus typed response models (`RSVPCreateResponse`, `RSVPManageResponse`, `RemoveGuestResponse`, `GuestItem`).
- **`routers/rsvp.py`**:
  - `POST /api/rsvp` (`201 Created` / `409 Conflict` on duplicate email): Inserts into `public.rsvps` and `public.rsvp_guests` via `get_service_client()`, fires an async Telegram alert, and sends a confirmation email with a secure management link.
  - `GET /api/rsvp/manage/{manage_token}`: Loads an RSVP and its individual guests/children for self-service management.
  - `DELETE /api/rsvp/manage/{manage_token}/guests/{guest_id}`: Removes a single guest/child, recalculates `guests`/`children_count` (and `attending` if 0 remain), and notifies Telegram.
- **`routers/admin.py`**:
  - `GET /api/admin/rsvps`: Protected by `Depends(get_current_admin)`; queries `rsvps` with nested `rsvp_guests(*)` ordered by `created_at DESC` using `get_client_for_token(token)`.
  - `DELETE /api/admin/rsvps/{rsvp_id}/guests/{guest_id}`: Protected by `Depends(get_current_admin)`; removes an individual guest and updates parent counts under PostgreSQL RLS.
- **`services/auth.py`**: `get_current_admin` using `HTTPBearer`. Calls `get_client().auth.get_user(token)` (`401` on `AuthApiError`) and checks `user.id == os.getenv("ADMIN_USER_ID")` (`403` otherwise).
- **`services/supabase.py`**: Manages three access patterns: `get_client()` (cached `anon`), `get_service_client()` (cached `service_role`), and `get_client_for_token(token)` (fresh client per request with user JWT).
- **`services/email.py`**: Builds and sends HTML + plain-text RSVP confirmation emails via **Resend API** (`RESEND_API_KEY`) or **SMTP fallback** (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`), degrading gracefully without breaking RSVP creation if unconfigured.
- **`services/telegram.py`**: Async `dispatch_telegram_alert(message, parse_mode="HTML")` and sync wrapper `send_telegram_alert_sync`. Gracefully no-ops with a warning if credentials are missing.

---

## 6. Database Schema & Security (RLS)

Managed via SQL migrations in `supabase/migrations/`:

### Table: `public.rsvps` (`001` + `002` + `003_rsvp_guests_children_phone_unique_email.sql`)

| Column | Type | Constraints / Default |
|---|---|---|
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` |
| `name` | `text` | `NOT NULL` |
| `email` | `text` | `NOT NULL`, case-insensitive unique (`uq_rsvps_email_lower`) |
| `phone` | `text` | Required for new RSVPs (nullable in DDL for historical rows) |
| `attending` | `text` | `NOT NULL CHECK (attending IN ('yes', 'no'))` |
| `guests` | `int` | `DEFAULT 0 CHECK (guests >= 0 AND guests <= 4)` (guests > 7 years) |
| `children_count` | `int` | `NOT NULL DEFAULT 0 CHECK (children_count >= 0 AND children_count <= 4)` (children ≤ 7 years) |
| `manage_token` | `uuid` | `NOT NULL DEFAULT gen_random_uuid()` (unique: `uq_rsvps_manage_token`) |
| `meal`, `dietary`, `song` | `text` | Legacy nullable columns preserved for historical data |
| `note` | `text` | Nullable |
| `created_at` | `timestamptz` | `DEFAULT now()` |

### Table: `public.rsvp_guests` (`003_rsvp_guests_children_phone_unique_email.sql`)

| Column | Type | Constraints / Default |
|---|---|---|
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` |
| `rsvp_id` | `uuid` | `NOT NULL REFERENCES public.rsvps(id) ON DELETE CASCADE` (indexed: `idx_rsvp_guests_rsvp_id`) |
| `full_name` | `text` | `NOT NULL CHECK (length(trim(full_name)) > 0)` |
| `guest_type` | `text` | `NOT NULL DEFAULT 'adult' CHECK (guest_type IN ('adult', 'child'))` |
| `is_primary` | `boolean` | `NOT NULL DEFAULT false` |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` |

### Effective Row Level Security Policies (`001` + `002` + `003`)

RLS is enabled on `public.rsvps` and `public.rsvp_guests`:

- **`public.rsvps`**:
  - `"anon insert rsvp"`: Allows `INSERT` (`WITH CHECK (true)`).
  - `"admin read all"` & `"admin update rsvps"`: Allows `SELECT` and `UPDATE` only `TO authenticated` matching the admin UUID.
  - `"service_role full access"`: Grants full access to `service_role`.
- **`public.rsvp_guests`**:
  - `"admin read all guests"` & `"admin delete guests"`: Allows `SELECT` and `DELETE` only `TO authenticated` matching the admin UUID.
  - `"service_role full access"`: Grants full access to `service_role`.

---

## 7. API Reference

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| `GET` | `/health` | Public | `200` | Health check; returns `{"status": "ok"}`. |
| `POST` | `/api/rsvp` | Public | `201` / `409` | Validates `RSVPSubmission`, enforces unique email (`409`), saves `rsvps` + `rsvp_guests`, sends Telegram alert & confirmation email; returns `{status, id, manage_token, email_sent, guests_list}`. |
| `GET` | `/api/rsvp/manage/{manage_token}` | Token | `200` / `404` | Returns RSVP details and individual guests/children for the secure `manage_token`. |
| `DELETE` | `/api/rsvp/manage/{manage_token}/guests/{guest_id}` | Token | `200` / `404` | Removes one individual guest/child from the RSVP, recalculates counts, notifies Telegram, and returns the updated RSVP. |
| `GET` | `/api/admin/rsvps` | Bearer JWT (Admin) | `200` | Returns all rows in `public.rsvps` with nested `rsvp_guests` ordered by `created_at DESC`. Returns `401`/`403` on auth failure. |
| `DELETE` | `/api/admin/rsvps/{rsvp_id}/guests/{guest_id}` | Bearer JWT (Admin) | `200` / `404` | Removes one individual guest/child under admin RLS and updates parent RSVP counts. |

---

## 8. Dependencies & Environment Configuration

### Runtime Versions & Key Packages

- **Frontend** (Node.js 20+, `frontend/package.json`):
  - `react` `^19.2.6`, `react-dom` `^19.2.6`, `react-router-dom` `^7.17.0`
  - `@mui/material` `^9.1.0`, `@mui/icons-material` `^9.1.0`, `@mui/x-data-grid` `^9.10.1`, `@emotion/react`, `@emotion/styled`
  - `@supabase/supabase-js` `^2.112.1`
  - `vite` `^8.0.12`, `eslint` `^10.3.0`
- **Backend** (Python 3.12 in CI, `backend/requirements.txt`):
  - `fastapi==0.136.3`, `uvicorn==0.49.0`, `pydantic==2.13.4`, `email-validator==2.3.0`
  - `supabase==2.31.0`, `httpx==0.28.1`, `python-telegram-bot==22.7`, `python-dotenv==1.2.2`

### Backend Environment Variables (`backend/.env` locally & Render Dashboard in prod)

| Variable | Required | Purpose |
|---|---|---|
| `SUPABASE_URL` | Yes | Supabase project URL (`https://<ref>.supabase.co`). |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon key (used for `auth.get_user` and per-token admin client). |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (used by public RSVP endpoints). |
| `ADMIN_USER_ID` | Yes | Supabase Auth UUID of the single admin user allowed on `/api/admin/*`. |
| `FRONTEND_URL` | Yes | Allowed CORS origin & base URL for RSVP management links (`https://melissalevi.page` in prod). |
| `TELEGRAM_BOT_TOKEN` | Optional | Bot token from `@BotFather` for RSVP & 500 alerts. |
| `TELEGRAM_CHAT_ID` | Optional | Target chat/group ID for Telegram alerts. |
| `RESEND_API_KEY` | Optional | Resend API key for sending RSVP confirmation emails via HTTPS (recommended on Render Free). |
| `EMAIL_FROM` | Optional | Sender header (e.g., `Melissa & Levi <confirmacao@melissalevi.page>`). |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_USE_TLS` | Optional | Alternative SMTP credentials if `RESEND_API_KEY` is not set. |

> **Note**: `backend/render.yaml` is only used during initial Render Blueprint provisioning. For the live Render service (`melissa-levi-backend`), environment variables must be updated directly in the Render Dashboard.

### GitHub Actions Secrets (`Settings → Secrets and variables → Actions`)

| Secret | Used By |
|---|---|
| `RENDER_DEPLOY_HOOK_URL` | `backend-deploy.yml` |
| `VERCEL_TOKEN` | `frontend-deploy.yml` |
| `VERCEL_ORG_ID` | `frontend-deploy.yml` |
| `VERCEL_PROJECT_ID` | `frontend-deploy.yml` |

---

## 9. Local Development & Testing

### Quick Start (Recommended)

Run both servers simultaneously from the repository root:

```bash
./dev.sh
```

- **Frontend**: `http://localhost:5173` (proxies `/api/*` → `http://localhost:8000`)
- **Backend**: `http://localhost:8000`
- **Interactive API Docs**: `http://localhost:8000/docs`

### Manual Start

```bash
# Terminal 1 — Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

### Local Tests & Validation

```bash
# Backend smoke & unit tests
cd backend && source venv/bin/activate
python test_imports.py      # Verifies all modules import cleanly
python test_auth.py         # Unit tests admin auth (200/401/403) with mocks
python test_rsvp.py         # Unit & API tests for RSVP validation, duplicate email, guest removal & email
python test_telegram.py     # Sends a real test message (requires backend/.env)

# Frontend lint & production build
cd frontend
npm run lint
npm run build
```

---

## 10. CI/CD & Production Deployment

Deployments are automated via GitHub Actions on pushes to `main`:

1. **Backend (`.github/workflows/backend-deploy.yml`)** — triggers on `backend/**`:
   - `test` job (push & PR): Python 3.12 → installs `requirements.txt` → runs `python test_imports.py`.
   - `deploy-to-production` job (push to `main` only): validates `RENDER_DEPLOY_HOOK_URL` → triggers Render deploy via `curl --fail -X POST`.
2. **Frontend (`.github/workflows/frontend-deploy.yml`)** — triggers on `frontend/**`:
   - `test` job (push & PR): Node 20 → `npm ci` → `npm run lint` (`continue-on-error: true`) → `npm run build`.
   - `deploy` job (push to `main` only): installs `vercel@latest` → runs `vercel pull`, `vercel build --prod`, and `vercel deploy --prebuilt --prod` from the repo root.

### DNS & Hosting Summary

- **Frontend (Vercel)**: Custom domain `melissalevi.page` (A record `@ → 76.76.21.21`, CNAME `www → cname.vercel-dns.com.`), automatic Let's Encrypt SSL.
- **Backend (Render)**: Free Web Service (`melissa-levi-backend.onrender.com`), start command `uvicorn main:app --host 0.0.0.0 --port $PORT`. Note: Render's free tier spins down after inactivity (cold-start latency on first request).

---

## 11. Known Issues, Security Advisories & Backlog

### Critical Security Advisory
- **Exposed Telegram Bot Token in Git History**: Earlier documentation commits exposed the real `TELEGRAM_BOT_TOKEN` in plaintext. Even though those files have been removed from the working tree, the token remains in Git history and **must be rotated** via `@BotFather` (`/revoke`), then updated in Render, GitHub Actions Secrets, and local `backend/.env`.

### Pending Configuration Steps
1. **Supabase Migration**: Run `supabase/migrations/003_rsvp_guests_children_phone_unique_email.sql` in the Supabase SQL Editor (adds `phone`, `children_count`, `manage_token`, unique email index, and `public.rsvp_guests` table with RLS).
2. **PIX Key**: Replace the `pixKey` placeholder in `frontend/src/data/wedding.js` with the real PIX key.
3. **Confirmation Emails (Render)**: Configure `RESEND_API_KEY` + `EMAIL_FROM` (or `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`) in Render Dashboard environment variables.

### Maintenance & CI Improvements
- **Run `test_auth.py` in CI**: `backend-deploy.yml` currently runs only `test_imports.py`; add `python test_auth.py`.
- **Enforce Frontend Linting**: `frontend-deploy.yml` has `continue-on-error: true` on `npm run lint`.
- **Upgrade GitHub Actions**: Replace deprecated `actions/checkout@v3`, `actions/setup-python@v4`, and `actions/setup-node@v3` with current versions (`v4`/`v5`).
- **Repository Hygiene**: Update `.gitignore` to ignore `**/__pycache__/` and `**/*.pyc` (nested `.pyc` files in `backend/{models,routers,services}/__pycache__/` are currently tracked in Git), and add a `backend/.env.example` template.

### Planned Features (`todo.txt`)
- Allow entering names of accompanying guests.
- Prevent duplicate guest name conflicts.
- Send final confirmation emails 1 month before the wedding.
- Add a wedding countdown timer.
