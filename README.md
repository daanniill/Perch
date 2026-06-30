# Perch

An eBay seller analytics dashboard — real profit after every fee, AI-powered listings, and insights on what to list next.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Third-Party Setup](#third-party-setup)
  - [Supabase](#supabase)
  - [eBay Developer Portal](#ebay-developer-portal)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Local Development](#local-development)
- [Dependencies](#dependencies)

---

## Overview

Perch is a two-process full-stack app:

| Layer | Tech | Port |
|-------|------|------|
| Frontend | React 19 + Vite + Tailwind CSS | 5173 |
| Backend | Node.js + Express | 3001 |
| Database | Supabase (PostgreSQL) | — |
| Auth | Supabase Auth (Google OAuth) | — |

The Vite dev server proxies `/api` and `/auth/ebay` to the Express backend, so the frontend only ever calls relative URLs.

---

## Project Structure

```
Perch/
├── src/                         # React frontend
│   ├── lib/
│   │   └── supabase.js          # Supabase client + apiFetch helper
│   ├── App.jsx                  # Hash-based router + auth guard
│   ├── main.jsx                 # React root
│   ├── PerchLanding.jsx         # Marketing landing page
│   ├── PerchOnboarding.jsx      # 5-step onboarding (auth → eBay → sync → Q&A → done)
│   ├── PerchDashboard.jsx       # Main dashboard (KPIs, charts, sales)
│   ├── PerchListings.jsx        # Listings table
│   ├── PerchListingGenerator.jsx
│   ├── PerchAnalytics.jsx
│   ├── PerchFinances.jsx
│   ├── PerchPricing.jsx
│   └── PerchSettings.jsx
│
├── server/                      # Express backend
│   ├── index.js                 # Entry point, route mounting
│   ├── package.json
│   ├── .env                     # Backend secrets (not committed)
│   ├── db/
│   │   ├── client.js            # pg Pool connected to Supabase PostgreSQL
│   │   └── schema.sql           # Table definitions (run once in Supabase SQL editor)
│   ├── middleware/
│   │   └── requireAuth.js       # Verifies Supabase Auth tokens via service role key
│   └── routes/
│       ├── ebay.js              # eBay OAuth + data sync
│       └── user.js              # Onboarding Q&A + user profile
│
├── .env.local                   # Frontend secrets (not committed)
├── .env.example                 # Frontend env template
├── server/.env.example          # Backend env template
├── vite.config.js
└── package.json
```

---

## Prerequisites

- **Node.js** 18+ (for built-in `fetch` in the Express server)
- **npm** 9+
- A [Supabase](https://supabase.com) account
- An [eBay Developer](https://developer.ebay.com) account

---

## Third-Party Setup

### Supabase

1. Create a new project at [supabase.com](https://supabase.com). Note the **Project URL** and **anon key** from **Settings → API**.
2. In **Authentication → Providers**, enable **Google** and configure your OAuth app credentials from [console.cloud.google.com](https://console.cloud.google.com). Add your Supabase callback URL as an authorized redirect URI in Google's OAuth settings.
3. Run the schema in the **Supabase SQL Editor** (open `server/db/schema.sql` and paste the full contents).
4. Copy the credentials you need:

| Where in Supabase | Value | Env var |
|-------------------|-------|---------|
| Settings → API → Project URL | `https://xxx.supabase.co` | `VITE_SUPABASE_URL` (frontend) + `SUPABASE_URL` (server) |
| Settings → API → anon public | `eyJ...` | `VITE_SUPABASE_ANON_KEY` (frontend) |
| Settings → API → service_role secret | `eyJ...` | `SUPABASE_SERVICE_ROLE_KEY` (server — never expose to browser) |
| Settings → Database → Connection string (URI) | `postgresql://...` | `DATABASE_URL` (server) |

### eBay Developer Portal

1. Sign in at [developer.ebay.com](https://developer.ebay.com) and create an application.
2. Copy your **Client ID** and **Client Secret** from the application keys page.
3. Go to **My Account → User Tokens → Get a Token from eBay via Your Application**.
4. Add `http://localhost:3001/auth/ebay/callback` as a redirect URI. eBay will generate an **RuName** (e.g. `YourName-AppName-PRD-abc123-45678`).
5. Copy the RuName — this is used as the `redirect_uri` parameter in the eBay OAuth URL (not the raw callback URL).

> Start with `EBAY_ENVIRONMENT=sandbox` and sandbox credentials while developing. Switch to `production` and your production keys when going live.

---

## Environment Variables

**Frontend** — create `.env.local` at the project root (copy from `.env.example`):

```env
# Supabase — Settings → API
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Backend** — create `server/.env` (copy from `server/.env.example`):

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

# Supabase — Settings → API
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # keep secret — never send to browser

# Supabase PostgreSQL — Settings → Database → Connection string (URI)
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# eBay Developer
EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
EBAY_REDIRECT_URI=http://localhost:3001/auth/ebay/callback
EBAY_RUNAME=YourName-AppName-SBX-abc123-45678
EBAY_ENVIRONMENT=sandbox

# Random 32-byte hex — generate with:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=
```

---

## Database Schema

All tables use Supabase Auth user IDs (`UUID`) as the foreign key, referencing `auth.users(id)`. There is no custom `users` table.

| Table | Purpose |
|-------|---------|
| `onboarding_responses` | Step 4 Q&A: categories, listing style, monthly goal, experience level, primary goal |
| `ebay_connections` | eBay OAuth access + refresh tokens, store name, last sync time |
| `ebay_listings` | Listings synced from eBay Sell Inventory API |
| `ebay_orders` | Orders synced from eBay Sell Fulfillment API |

Full DDL is in [`server/db/schema.sql`](server/db/schema.sql).

---

## Local Development

Install dependencies for both the frontend and backend:

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

Run both processes in separate terminals:

```bash
# Terminal 1 — frontend (http://localhost:5173)
npm run dev

# Terminal 2 — backend (http://localhost:3001)
cd server && npm run dev
```

The Vite dev server proxies `/api` and `/auth/ebay` to `http://localhost:3001`, so all API calls from the frontend use relative paths.

### First-time flow

1. Navigate to `http://localhost:5173` → click **Get started**
2. **Step 1** — sign in with Google (powered by Supabase Auth)
3. **Step 2** — connect your eBay account (redirects to eBay OAuth)
4. **Step 3** — eBay data syncs in the background; progress is polled every 2 s
5. **Step 4** — answer the Q&A (categories, experience level, goal, writing style)
6. **Step 5** — review your real listing/order counts and go to the dashboard

Returning users are dropped into the correct step automatically based on their auth and sync state.

---

## Dependencies

### Frontend (`package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.7 | UI framework |
| `react-dom` | ^19.2.7 | React DOM renderer |
| `@supabase/supabase-js` | ^2.x | Supabase client (auth + database) |
| `@tailwindcss/vite` | ^4.3.1 | Tailwind CSS via Vite plugin |
| `tailwindcss` | ^4.3.1 | Utility-first CSS framework |
| `@vitejs/plugin-react` | ^6.0.2 | Vite plugin for React |
| `vite` | ^8.1.0 | Frontend build tool + dev server |
| `oxlint` | ^1.69.0 | Fast JavaScript linter |

### Backend (`server/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.21.0 | HTTP server and routing |
| `cors` | ^2.8.5 | Cross-origin resource sharing middleware |
| `pg` | ^8.13.0 | PostgreSQL client for Supabase database |
| `@supabase/supabase-js` | ^2.x | Supabase Auth token verification (service role) |
| `jsonwebtoken` | ^9.0.2 | Signs/verifies eBay OAuth state JWT |
| `dotenv` | ^16.4.0 | Loads environment variables from `.env` |
