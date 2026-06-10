# 📐 Melissa & Levi Wedding Website — Arquitectura e Guia Técnico

## 1. Visão Geral e Objetivo

O **Melissa & Levi Wedding Website** é uma aplicação full-stack para gerenciar convites, RSVPs e informações da cerimónia de casamento. O site oferece:

- **Página de Boas-vindas (Home)**: Apresentação visual elegante com imagens, informações da cerimónia e links de navegação
- **Página "Quando & Onde" (WhenWhere)**: Detalhes da data, hora, local e cronograma da cerimónia
- **Formulário RSVP**: Interface para convidados confirmarem presença, fornecerem preferências alimentares, sugestões de música e mensagens pessoais
- **Notificações em Tempo Real**: Alertas via Telegram quando novos RSVPs são submetidos
- **Gestão de Dados**: Persistência de RSVPs em base de dados Supabase com Row Level Security (RLS)

**Público-alvo**: Convidados do casamento (usuários finais) + casal (administrativo)

---

## 2. Arquitetura e Stack Tecnológica

### 2.1 Arquitetura Geral

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│          Vite + MUI + React Router (v7)            │
│  ┌──────────────────────────────────────────────┐  │
│  │ Pages: Home / WhenWhere / RSVP               │  │
│  │ Components: NavBar / Footer / UI Elements    │  │
│  │ Services: API Client (fetch to /api/*)      │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/CORS
                   ↓
┌──────────────────────────────────────────────────────┐
│              Backend (FastAPI)                       │
│        Python 3.14 + Async / Await                  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Routes: POST /api/rsvp, GET /api/rsvps      │  │
│  │ Models: Pydantic (RSVPSubmission)            │  │
│  │ Services: Supabase Client, Telegram Bot     │  │
│  │ Middleware: CORS, Error Telemetry           │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │ REST API
         ┌─────────┴───────────┐
         ↓                     ↓
    ┌──────────┐        ┌──────────────┐
    │ Supabase │        │ Telegram Bot │
    │ PostgreSQL       │ (Notifications)
    │ (RSVPs DB)       └──────────────┘
    └──────────┘
```

**Padrão Arquitectural**: Layered Architecture (três camadas)
- **Presentation Layer** (Frontend React)
- **API Layer** (FastAPI + Routers)
- **Data Layer** (Supabase PostgreSQL)

### 2.2 Stack Tecnológico

#### Frontend
- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12 (dev server, bundling)
- **Routing**: react-router-dom 7.17.0 (client-side navigation)
- **UI Library**: Material-UI (MUI) 9.1.0 com Emotion CSS-in-JS
- **Styling**: sx prop (MUI), CSS Modules
- **Node**: npm/yarn (package management)
- **Fonts**: Google Fonts (Cormorant Garamond serif + Jost sans)

#### Backend
- **Framework**: FastAPI 0.136.3 (async Python web framework)
- **Server**: Uvicorn 0.49.0 (ASGI server)
- **Validação**: Pydantic 2.13.4 (model validation)
- **Environment**: python-dotenv 1.2.2 (config via .env)
- **Database Client**: supabase-py 2.31.0
- **Notifications**: python-telegram-bot 22.7
- **Python**: 3.14+

#### Database
- **Platform**: Supabase (managed PostgreSQL + Auth)
- **Database**: PostgreSQL 15+ (via Supabase)
- **Features**: 
  - Row Level Security (RLS) policies
  - Realtime subscriptions (realtime-py)
  - Automatic migrations (Supabase CLI)
  - Anon Key (frontend) + Service Role Key (backend)

#### Deployment & DevOps
- **Frontend Hosting**: Vercel (planeado)
- **Backend Hosting**: (a definir — pode ser Vercel Functions, Railway, Render, etc.)
- **Database**: Supabase Cloud
- **Notifications**: Telegram Bot API (via python-telegram-bot)

---

## 3. Estrutura de Diretórios

```
melissa&levi/
├── frontend/                      # React + Vite application
│   ├── public/                    # Static assets (favicons, etc.)
│   ├── src/
│   │   ├── main.jsx              # Entry point (renders App into #root)
│   │   ├── App.jsx               # Root component: BrowserRouter + ThemeProvider
│   │   ├── theme.js              # MUI theme config (COLORS, FONTS, palette)
│   │   ├── data/
│   │   │   └── wedding.js        # Wedding data (dates, location, images)
│   │   ├── components/           # Reusable UI components
│   │   │   ├── index.js          # Barrel export (simplifies imports)
│   │   │   ├── Eyebrow.jsx       # Small heading/label component
│   │   │   ├── Ornament.jsx      # Decorative ornament element
│   │   │   ├── FadeImage.jsx     # Image with fade-in animation
│   │   │   ├── Reveal.jsx        # Text reveal animation wrapper
│   │   │   └── ...other UI bits
│   │   ├── layout/               # Layout components (persistent)
│   │   │   ├── NavBar.jsx        # Navigation header with burger menu
│   │   │   └── Footer.jsx        # Footer with links
│   │   ├── pages/                # Full-page components (routed)
│   │   │   ├── Home.jsx          # Landing page (hero + 6 sections)
│   │   │   ├── WhenWhere.jsx     # Date/time/location info (4 sections)
│   │   │   └── RSVP.jsx          # RSVP form (wired to backend API)
│   │   └── index.css             # Global styles (resets, animations)
│   ├── index.html                # HTML template with <div id="root">
│   ├── vite.config.js            # Vite config (proxy /api → backend)
│   ├── package.json              # Dependencies + scripts (dev, build, preview)
│   ├── .eslintrc.cjs             # ESLint config
│   └── .gitignore
│
├── backend/                       # FastAPI application
│   ├── main.py                   # App entry point + middleware + route inclusion
│   ├── requirements.txt          # Python dependencies (pip install)
│   ├── .env                      # Environment variables (local dev)
│   ├── .env.example              # Template for .env (credentials redacted)
│   ├── models/
│   │   ├── __init__.py
│   │   └── rsvp.py              # Pydantic model: RSVPSubmission (validation)
│   ├── routers/
│   │   ├── __init__.py
│   │   └── rsvp.py              # FastAPI router: POST /api/rsvp, GET /api/rsvps
│   ├── services/
│   │   ├── __init__.py
│   │   ├── supabase.py          # Supabase client singleton + get_client()
│   │   └── telegram.py          # Telegram notifications: dispatch_telegram_alert()
│   └── venv/                     # Python virtual environment (gitignored)
│
├── supabase/                     # Supabase project config & migrations
│   ├── config.toml              # Supabase project config (auth, DB settings)
│   ├── migrations/
│   │   └── 001_create_rsvps.sql # Migration: create rsvps table + RLS policies
│   └── .temp/                   # Temp files from Supabase CLI (gitignored)
│
├── .claude/
│   ├── CLAUDE.md               # Project-specific Claude Code instructions
│   └── settings.json           # Claude Code settings/hooks (gitignored)
│
├── .git/                        # Git repository
├── .gitignore                   # Git ignore rules
├── ARCHITECTURE.md              # This file — full technical guide
├── QUICKSTART.md               # Quick setup & development guide
└── README.md                    # High-level project overview
```

### Ficheiros-chave por responsabilidade:

| Ficheiro | Responsabilidade |
|----------|------------------|
| `frontend/src/App.jsx` | Root React component, router setup, theme provider |
| `frontend/vite.config.js` | Vite dev server proxy to backend |
| `backend/main.py` | FastAPI app creation, middleware, router registration |
| `backend/routers/rsvp.py` | HTTP endpoints: POST /api/rsvp, GET /api/rsvps |
| `backend/services/supabase.py` | Database connection singleton |
| `supabase/migrations/001_create_rsvps.sql` | Database schema + RLS security policies |
| `frontend/src/data/wedding.js` | Static wedding content (dates, locations, images) |

---

## 4. Fluxo de Dados / Execução

### 4.1 RSVP Submission Flow (Principal)

```
1. User fills RSVP form (frontend/src/pages/RSVP.jsx)
   ├─ Enters: name, email, attending, guests, meal, dietary, song, note
   └─ Clicks "Submit"

2. Form validation (Pydantic in backend will also validate)
   ├─ Frontend: basic HTML5 validation
   └─ Backend: Pydantic model (RSVPSubmission) enforces types & EmailStr

3. POST /api/rsvp (fetch from frontend)
   ├─ Method: POST
   ├─ URL: http://localhost:8000/api/rsvp (or CORS-allowed production URL)
   ├─ Body (JSON):
   │  {
   │    "name": "João Silva",
   │    "email": "joao@example.com",
   │    "attending": "yes",
   │    "guests": 2,
   │    "meal": "chicken",
   │    "dietary": "sem glúten",
   │    "song": "Uma música especial",
   │    "note": "Estamos felizes!"
   │  }
   └─ Headers: Content-Type: application/json

4. Backend routes request → backend/routers/rsvp.py (@router.post("/rsvp"))
   ├─ Deserialize JSON → RSVPSubmission (Pydantic validates)
   ├─ Get Supabase client: services/supabase.py → get_client()
   │   └─ Uses SUPABASE_URL + SUPABASE_ANON_KEY from .env
   └─ Insert into "rsvps" table

5. Database insert (Supabase PostgreSQL)
   ├─ Table: public.rsvps
   ├─ Columns: id, name, email, attending, guests, meal, dietary, song, note, created_at
   ├─ RLS Policy: "anon insert rsvp" allows frontend user to INSERT
   └─ Trigger: created_at defaults to NOW()

6. Telegram notification (async task)
   ├─ Backend spawns async task: dispatch_telegram_alert(msg)
   ├─ Service: services/telegram.py
   ├─ Sends: "💌 Novo RSVP! 👤 João Silva ✉️ joao@example.com 🎉 Comparece: Sim"
   ├─ Credentials: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID from .env
   └─ Runs in background (doesn't block API response)

7. API response (backend → frontend)
   ├─ Status: 201 (Created)
   └─ Body: {"status": "ok"}

8. Frontend updates UI
   ├─ Displays success message
   ├─ Clears form
   ├─ Redirects or shows confirmation
   └─ May fetch updated RSVP list (GET /api/rsvps)
```

### 4.2 Page Navigation Flow

```
1. User clicks link in NavBar (e.g., "Confirmar Presença")

2. React Router intercepts (useNavigate hook)
   ├─ Route change: "/" → "/rsvp"
   └─ No full page reload (SPA behavior)

3. Component mounts
   ├─ RSVP.jsx mounts
   ├─ useState hooks initialize form state
   └─ useEffect may fetch existing RSVPs

4. MUI theme applies (from theme.js)
   ├─ Colors (ink, gold, etc.)
   ├─ Typography (Cormorant Garamond serif, Jost sans)
   └─ Responsive breakpoints (xs, sm, md, lg, xl)

5. Page renders
   ├─ Page structure: header + form + footer
   ├─ NavBar always visible (persistent layout)
   └─ Footer always visible (persistent layout)
```

### 4.3 API Response Error Handling

```
Backend (main.py) has error telemetry middleware:

try:
    return await call_next(request)
except Exception as error:
    # Logs to Telegram (only 500 errors)
    stack_trace = traceback.format_exc()
    alert_body = f"🚨 ERRO 500\nRota: {request.url.path}\n..."
    asyncio.create_task(dispatch_telegram_alert(alert_body))
    raise error  # Re-raise for FastAPI to return 500

Frontend (RSVP.jsx) catches:
    try {
        const res = await fetch('/api/rsvp', { method: 'POST', body: JSON.stringify(...) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        // success
    } catch (err) {
        setError(err.message)
        // display error to user
    }
```

---

## 5. Convenções e Regras do Projeto

### 5.1 Nomenclatura

#### Frontend (JavaScript/JSX)
- **Componentes**: PascalCase (e.g., `NavBar`, `FadeImage`, `RSVPForm`)
- **Hooks/Funções**: camelCase (e.g., `useNavigate`, `handleSubmit`, `dispatch_telegram_alert`)
- **Constantes**: UPPER_SNAKE_CASE (e.g., `NAV`, `COLORS`, `FONTS`)
- **Ficheiros de componentes**: `ComponentName.jsx`
- **Ficheiros de hooks**: `useHookName.js`
- **Ficheiros de dados/config**: `lowercase.js` (e.g., `wedding.js`, `theme.js`)

#### Backend (Python)
- **Classes/Models**: PascalCase (e.g., `RSVPSubmission`)
- **Funções/Métodos**: snake_case (e.g., `get_client`, `dispatch_telegram_alert`)
- **Constantes**: UPPER_SNAKE_CASE (e.g., `TELEGRAM_BOT_TOKEN`)
- **Ficheiros de módulos**: snake_case (e.g., `rsvp.py`, `supabase.py`)
- **Routers**: `router` variable in `routers/*.py`
- **Models**: BaseModel subclasses in `models/*.py`

### 5.2 Imports & Module Exports

#### Frontend (Barrel Exports)
```javascript
// components/index.js — allows: import { NavBar, Footer } from '../components'
export { NavBar } from './layout/NavBar';
export { Footer } from './layout/Footer';
export { Eyebrow, Ornament, FadeImage, Reveal } from './components';
```

#### Backend (Routers)
```python
# main.py
from routers.rsvp import router as rsvp_router
app.include_router(rsvp_router)  # All routes get /api prefix from router
```

### 5.3 Environment Variables

All sensitive config lives in `.env` (local) and environment variables (production):

**Required for Backend**:
```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=987654321

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

**Never commit `.env`** — use `.env.example` as template.

### 5.4 Error Handling

#### Frontend
- **Form validation**: HTML5 + basic JS checks before submit
- **API errors**: try/catch with user-friendly error messages
- **Example**:
  ```javascript
  try {
    const response = await fetch('/api/rsvp', { /* ... */ })
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    setError(error.message) // Display in UI
  }
  ```

#### Backend
- **Request validation**: Pydantic models (automatic 422 on invalid schema)
- **Business logic errors**: Raise `HTTPException(status_code=..., detail=...)`
- **Unhandled errors**: Middleware catches, logs to Telegram (if 500), re-raises
- **Example**:
  ```python
  @router.post("/rsvp")
  async def submit_rsvp(payload: RSVPSubmission):
      try:
          result = supabase.table("rsvps").insert(payload.model_dump()).execute()
          if result.data:
              # success
              return {"status": "ok"}
          raise HTTPException(status_code=500, detail="Falha ao salvar")
      except HTTPException:
          raise  # Re-raise FastAPI exceptions
      except Exception as e:
          raise HTTPException(status_code=500, detail=str(e))
  ```

### 5.5 Database RLS (Row Level Security)

**Policies** (Supabase enforces at DB level):
- **"anon insert rsvp"**: Frontend (anon key) can INSERT new RSVPs
- **"anon read all"**: Frontend (anon key) can SELECT all RSVPs
- **"service_role full access"**: Backend (service_role key) has full access

**Key**: Always use SUPABASE_ANON_KEY on frontend (secure), SUPABASE_SERVICE_ROLE_KEY on backend (private).

### 5.6 Async/Await Patterns

#### Frontend (React)
- **useEffect for data fetching**:
  ```javascript
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/rsvps')
        const data = await res.json()
        setData(data)
      } catch (err) {
        setError(err)
      }
    }
    fetchData()
  }, [])
  ```

#### Backend (FastAPI)
- **All route handlers are async**:
  ```python
  @router.post("/rsvp")
  async def submit_rsvp(payload: RSVPSubmission):
      # async function — can use await
      result = supabase.table("rsvps").insert(...).execute()
  ```
- **Background tasks** (don't block response):
  ```python
  asyncio.create_task(dispatch_telegram_alert(msg))  # Fire and forget
  ```

### 5.7 Responsive Design (Frontend)

All pages use **MUI breakpoints** (xs, sm, md, lg, xl):
```javascript
sx={{
  fontSize: { xs: '1rem', md: '2rem' },  // Small on mobile, large on desktop
  px: { xs: 2, md: 4 },                 // Padding changes by breakpoint
  display: { xs: 'none', md: 'block' }  // Hidden on mobile, shown on desktop
}}
```

### 5.8 CSS Styling

- **Primary method**: MUI `sx` prop (inline CSS-in-JS)
- **Fallback**: CSS Modules (if needed for complex styles)
- **Global styles**: `frontend/src/index.css` (resets, animations, fonts)
- **Theme**: `frontend/src/theme.js` (colors, typography, spacing)

### 5.9 Git Commit Conventions

Commits should be descriptive:
```
✨ Add RSVP form with validation
🐛 Fix Supabase RLS policy syntax
🔧 Configure Vite proxy for backend
📚 Add architecture documentation
```

---

## 6. Passos para Adicionar Novas Funcionalidades

### 6.1 Adicionar uma Nova Página

**Scenario**: Criar página "Fotos" (Photo Gallery).

#### 1. Create Component
```
frontend/src/pages/Photos.jsx
```
```javascript
import { Box, Container, Grid } from '@mui/material';
import { NavBar } from '../layout/NavBar';
import { Footer } from '../layout/Footer';

export function Photos() {
  return (
    <>
      <NavBar />
      <Container>
        <Grid container spacing={2}>
          {/* Photo grid */}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
```

#### 2. Register Route
```
frontend/src/App.jsx
```
```javascript
import { Photos } from './pages/Photos';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/quando-onde" element={<WhenWhere />} />
  <Route path="/rsvp" element={<RSVP />} />
  <Route path="/fotos" element={<Photos />} />  {/* NEW */}
</Routes>
```

#### 3. Add Navigation Link
```
frontend/src/layout/NavBar.jsx
```
```javascript
const NAV = [
  { label: 'Quando & Onde', path: '/quando-onde' },
  { label: 'Confirmar Presença', path: '/rsvp' },
  { label: 'Fotos', path: '/fotos' },  // NEW
];
```

#### 4. Test
```bash
npm run dev
# Navigate to http://localhost:5173/fotos
```

---

### 6.2 Adicionar um Novo Endpoint API

**Scenario**: Criar `POST /api/contact` para formulário de contacto.

#### 1. Create Pydantic Model
```
backend/models/contact.py
```
```python
from pydantic import BaseModel, EmailStr

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str
```

#### 2. Create Router Endpoint
```
backend/routers/contact.py
```
```python
from fastapi import APIRouter, HTTPException
from models.contact import ContactMessage
from services.telegram import dispatch_telegram_alert
import asyncio

router = APIRouter(prefix="/api", tags=["contact"])

@router.post("/contact", status_code=201)
async def submit_contact(payload: ContactMessage):
    try:
        # Save to DB (if needed) or just send alert
        msg = f"📧 Novo contacto\n👤 {payload.name}\n✉️ {payload.email}\n📝 {payload.message}"
        asyncio.create_task(dispatch_telegram_alert(msg))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### 3. Register Router
```
backend/main.py
```
```python
from routers.rsvp import router as rsvp_router
from routers.contact import router as contact_router  # NEW

app.include_router(rsvp_router)
app.include_router(contact_router)  # NEW
```

#### 4. Create Frontend Form
```
frontend/src/pages/Contact.jsx
```
```javascript
import { useState } from 'react';
import { Box, Button, TextField, Container } from '@mui/material';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Erro ao enviar');
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mensagem"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button type="submit" variant="contained">Enviar</Button>
        {error && <Box color="error">{error}</Box>}
        {success && <Box color="success">Enviado com sucesso!</Box>}
      </Box>
    </Container>
  );
}
```

#### 5. Test
```bash
# Terminal 1: npm run dev (frontend)
# Terminal 2: python main.py (backend)
# Navigate to http://localhost:5173/contacto
# Fill form and submit
# Check Telegram for notification
```

---

### 6.3 Adicionar uma Coluna à Base de Dados

**Scenario**: Adicionar campo `phone` à tabela `rsvps`.

#### 1. Create Migration
```
supabase/migrations/002_add_phone_to_rsvps.sql
```
```sql
ALTER TABLE public.rsvps
ADD COLUMN phone TEXT;
```

#### 2. Apply Migration
```bash
cd supabase
supabase db push
# or locally:
# supabase db reset
```

#### 3. Update Pydantic Model
```
backend/models/rsvp.py
```
```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class RSVPSubmission(BaseModel):
    name: str
    email: EmailStr
    attending: Literal["yes", "no"]
    guests: Optional[int] = 1
    phone: Optional[str] = None  # NEW
    meal: Optional[str] = None
    dietary: Optional[str] = None
    song: Optional[str] = None
    note: Optional[str] = None
```

#### 4. Update Frontend Form
```
frontend/src/pages/RSVP.jsx
```
```javascript
const [form, setForm] = useState({
  // ...existing fields
  phone: '',  // NEW
  // ...
});

// Add TextField for phone in the form
<TextField
  label="Telefone (opcional)"
  type="tel"
  value={form.phone}
  onChange={(e) => setForm({ ...form, phone: e.target.value })}
  fullWidth
/>
```

---

### 6.4 Adding a Reusable Component

**Scenario**: Create `Button` component with custom styling.

#### 1. Create Component
```
frontend/src/components/Button.jsx
```
```javascript
import { Button as MuiButton } from '@mui/material';
import { COLORS, FONTS } from '../theme';

export function Button({ children, variant = 'contained', ...props }) {
  return (
    <MuiButton
      variant={variant}
      sx={{
        fontFamily: FONTS.SANS,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        bgcolor: variant === 'contained' ? COLORS.ink : 'transparent',
        color: variant === 'contained' ? COLORS.paper : COLORS.ink,
        border: variant === 'outlined' ? `1px solid ${COLORS.ink}` : 'none',
        '&:hover': {
          bgcolor: variant === 'contained' ? COLORS.gold : 'rgba(0,0,0,0.04)',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
```

#### 2. Export from Barrel
```
frontend/src/components/index.js
```
```javascript
export { Button } from './Button';
export { Eyebrow } from './Eyebrow';
// ... others
```

#### 3. Use Everywhere
```javascript
import { Button } from '../components';

<Button variant="contained" onClick={handleSubmit}>
  Submeter
</Button>
```

---

### 6.5 Debugging Workflow

#### Frontend
```bash
cd frontend
npm run dev        # Dev server at http://localhost:5173
# Check browser console (F12)
# Use React DevTools extension
```

#### Backend
```bash
cd backend
python main.py     # Server at http://localhost:8000
# Check terminal for logs
# Use FastAPI docs at http://localhost:8000/docs
```

#### Database
```bash
cd supabase
supabase status    # Check Supabase connection
supabase db push   # Apply pending migrations
# Check Supabase dashboard for data
```

---

## 7. Deployment Checklist

### Frontend (Vercel)
- [ ] Ensure `vite build` succeeds locally
- [ ] Set `VITE_API_URL` env var in Vercel (production API URL)
- [ ] Update `vite.config.js` to use env var for proxy (production)
- [ ] Push to GitHub, link to Vercel, auto-deploy on push

### Backend
- [ ] Set `.env` variables in production hosting (Railway, Render, etc.)
- [ ] Ensure `requirements.txt` includes all dependencies
- [ ] Test `python main.py` locally with production `.env`
- [ ] Set up CI/CD (GitHub Actions or hosting platform's native)

### Database
- [ ] Run all migrations: `supabase db push`
- [ ] Verify RLS policies are in place
- [ ] Test RSVP form end-to-end in production

### Notifications
- [ ] Verify Telegram bot token and chat ID are correct
- [ ] Test with a sample RSVP submission

---

## 8. Common Tasks Quick Reference

| Task | Command / Location |
|------|------------------|
| Start frontend dev server | `cd frontend && npm run dev` |
| Start backend dev server | `cd backend && python main.py` |
| Build frontend | `cd frontend && npm run build` |
| Lint frontend code | `cd frontend && npm run lint` |
| Create DB migration | Create `supabase/migrations/NNN_description.sql` |
| Apply migrations | `cd supabase && supabase db push` |
| View FastAPI docs | Visit `http://localhost:8000/docs` |
| View Supabase dashboard | https://app.supabase.com |
| Reload Python venv | `cd backend && source venv/bin/activate` |

---

## 9. Key Decisions & Trade-offs

| Decision | Rationale |
|----------|-----------|
| **React Router v7** (vs Next.js) | Lighter weight for SPA, lower learning curve, good for frontend-only team |
| **FastAPI** (vs Django/Node) | Async-first, fast, minimal boilerplate, great for small APIs |
| **Supabase** (vs Firebase/custom DB) | PostgreSQL power + managed hosting, open-source, cost-effective |
| **MUI v9** (vs Tailwind) | Component library → faster UI, built-in accessibility, great theme system |
| **Pydantic models** (vs plain dicts) | Type safety, validation, docs auto-generation |
| **RLS policies** (vs app-level auth) | Database-enforced security, defense-in-depth |

---

## 10. Future Enhancements

Ideias para expansão:

1. **Admin Dashboard**: View RSVPs, export to CSV, send email confirmations
2. **Guest List Management**: Invite codes, tiered RSVPs, plus-ones
3. **Real-time Updates**: WebSocket subscriptions for live RSVP count
4. **Payment Integration**: Collect payments for rehearsal dinner, honeymoon fund
5. **Email Notifications**: Replace/augment Telegram with email confirmations
6. **Image Uploads**: Allow guests to upload photos post-wedding
7. **Seating Chart**: Assign tables, dietary restrictions summary
8. **Multi-language**: Support PT + EN (or other languages)

---

## 11. Recursos & Referências

- **React**: https://react.dev
- **Vite**: https://vite.dev
- **MUI Docs**: https://mui.com
- **FastAPI**: https://fastapi.tiangolo.com
- **Supabase**: https://supabase.com/docs
- **React Router v7**: https://reactrouter.com
- **Pydantic**: https://docs.pydantic.dev

---

**Last Updated**: June 9, 2026  
**Maintainer**: Gustavo (arraesgustavo)  
**Status**: ✅ Production-ready (MVP complete)
