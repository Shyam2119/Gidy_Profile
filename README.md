# Gidy Profile — Full-Stack Technical Challenge

> A high-fidelity, full-stack replica of the **Gidy.ai Profile Page**, built with **React + Vite** (frontend) and **Express + SQLite** (backend), featuring two innovative enhancements: a **Skill Endorsement System** and an **AI-Powered Bio Generator**.

---

## Live Demo

🔗 **[https://gidy-profile.vercel.app](https://gidy-profile.vercel.app)** *(deploy after cloning — see Deployment Guide below)*

---

## Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | React 18, Vite 5, CSS Custom Properties            |
| Backend    | Node.js 18, Express 4                              |
| Database   | SQLite (via `better-sqlite3`)                      |
| AI Feature | Anthropic Claude API (server-side, with template fallback) |
| Hosting    | Frontend → Vercel · Backend → Render               |

---

## Project Structure

```
gidy-profile/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Root — Gidy nav, dark mode, view/edit routing
│   │   ├── index.css                # All styles — CSS custom properties, light/dark themes
│   │   ├── main.jsx                 # React entry point
│   │   ├── api/
│   │   │   └── profileApi.js        # HTTP client for all API endpoints
│   │   └── components/
│   │       ├── ProfileView.jsx      # Full profile display (matches Gidy.ai layout)
│   │       ├── ProfileEdit.jsx      # Edit form — all fields incl. education & certs
│   │       └── AIBioGenerator.jsx  # 🔥 Innovation: AI bio generator
│   ├── index.html
│   ├── vite.config.js               # Vite dev server + /api proxy to backend
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── server.js               # Express API — all routes + SQLite setup + seed
│   ├── schema.sql                  # Database schema documentation
│   └── package.json
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint                                | Description                                  |
|--------|-----------------------------------------|----------------------------------------------|
| GET    | `/api/profile`                          | Fetch full profile with skills               |
| PUT    | `/api/profile`                          | Update profile + sync skills                 |
| POST   | `/api/profile/skills/:id/endorse`       | Increment skill endorsement count            |
| POST   | `/api/generate-bio`                     | AI-powered bio generation (server-side)      |
| GET    | `/api/health`                           | Health check                                 |

---

## Local Setup

### Prerequisites
- **Node.js 18+** and **npm 9+**

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/gidy-profile.git
cd gidy-profile
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
# ✅ API running at http://localhost:5000
```

> The SQLite database (`src/profile.db`) is created and seeded automatically on first run.

### 3. Start the Frontend

```bash
# Open a NEW terminal
cd frontend
npm install
npm run dev
# ✅ App running at http://localhost:5173
```

### 4. Open in Browser

Navigate to **http://localhost:5173**

> The Vite dev server proxies `/api` requests to `http://localhost:5000`, so both servers must be running simultaneously.

### 5. Optional — AI Bio Generator with Claude

Create `backend/.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
ANTHROPIC_API_KEY=sk-ant-...your-key...
```

> Without a key, the generator falls back to high-quality **template-based bios** — it still works!

---

## Features

### Core (The Replica)

| Feature | Details |
|---------|---------|
| ✅ Responsive Profile Page | Matches Gidy.ai layout: nav bar, profile header card, career goals card, two-column grid, skills chips, experience/education/certification sections |
| ✅ League Stats | Bronze/Silver/Gold badge with Rank and Points display |
| ✅ Level Up Profile | Progress bar + task rows showing profile completion |
| ✅ Edit Mode | Full-screen edit form covering every field — bio, skills, experience, education, certifications, social links |
| ✅ RESTful Backend | Express with proper route separation and CORS |
| ✅ Database Persistence | SQLite with `profiles` + `skills` normalized tables |
| ✅ Dark Mode | Persisted to `localStorage`, toggleable from nav |

---

## Innovation Features

### 🏆 Feature 1: Skill Endorsement System

**What it does:** Each skill chip shows a live endorsement count (stored in the database). Clicking a chip endorses that skill — the count increments instantly, is persisted to SQLite, and the chip turns green. A session-based `localStorage` guard prevents double-endorsing.

**Why I chose it:** Endorsements are the strongest social signal on a professional profile. They convert a self-reported skill list into a peer-validated credential. LinkedIn proved this works at scale — seeing "10 engineers endorsed Full Stack Development" is far more convincing than any progress bar. It's also the natural foundation for future features like *top endorsers*, *domain-expert weighting*, or *endorsement notifications*.

**Backend route:** `POST /api/profile/skills/:id/endorse`

---

### 🏆 Feature 2: AI-Powered Bio Generator

**What it does:** A dedicated panel lets users pick a tone (**Professional / Casual / Creative**), then generates a personalised 2–3 sentence bio using the **Anthropic Claude API** — seeded with the user's actual name, title, location, skills, and work history from their live profile data. Falls back to curated templates when no API key is configured.

**Why I chose it:** Writing a compelling bio is the single hardest part of setting up a profile. Most people leave it blank or copy a generic template. An AI generator that *reads your actual profile data* removes that friction entirely while producing genuinely personalised output. The "Copy to Clipboard" action makes it instantly usable in the Edit form — closing the loop from inspiration to action.

**Backend route:** `POST /api/generate-bio` *(server-side — avoids CORS and API key exposure)*

---

## Deployment Guide

### Frontend → Vercel

```bash
cd frontend
npm run build
```
Push to GitHub → Connect to [vercel.com](https://vercel.com) → Set **Root Directory** to `frontend`.

### Backend → Render

1. Create a **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Add environment variable: `FRONTEND_URL=https://your-app.vercel.app`
6. Optionally add `ANTHROPIC_API_KEY` for full AI bio generation

---

## Design Decisions

- **SQLite in dev, Postgres-ready for prod** — Standard SQL only; swap the driver and connection string to migrate.
- **No ORM** — Direct `better-sqlite3` queries for transparency and zero overhead. Prisma would be appropriate at scale.
- **CSS Custom Properties over a UI library** — Full design control, zero runtime cost. Dark/light theme is a single attribute swap on `<html>`.
- **Server-side AI calls** — Keeps API keys off the client and centralises retry/fallback logic.

---

*Built for the Gidy.ai Technical Assessment — March 2026*
