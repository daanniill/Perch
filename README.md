# Perch

An eBay seller analytics dashboard — real profit after every fee, AI-powered listings, and insights on what to list next.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Third-Party Setup](#third-party-setup)
  - [NeonDB + Neon Auth](#neondb--neon-auth)
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
| Database | NeonDB (PostgreSQL) | — |
| Auth | Neon Auth (Stack Auth) | — |

The Vite dev server proxies `/api` and `/auth/ebay` to the Express backend, so the frontend only ever calls relative URLs.

---

## Project Structure

```
Perch/
├── src/                         # React frontend
│   ├── lib/
│   │   └── stackauth.js         # Stack Auth client + apiFetch helper
│   ├── App.jsx                  # Hash-based router + auth guard
│   ├── main.jsx                 # React root, StackProvider wrapper
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
│   │   ├── client.js            # pg Pool connected to NeonDB
│   │   └── schema.sql           # Table definitions (run once in Neon console)
│   ├── middleware/
│   │   └── requireAuth.js       # Verifies Stack Auth tokens
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
- A [NeonDB](https://neon.tech) account
- An [eBay Developer](https://developer.ebay.com) account

---

## Third-Party Setup

### NeonDB + Neon Auth

1. Create a new project at [neon.tech](https://neon.tech). Name the database `perch`.
2. In your Neon project dashboard go to **Auth** → Enable **Neon Auth**.
3. Neon Auth is powered by [Stack Auth](https://stack-auth.com). It will open the Stack Auth dashboard — enable the **Google** provider there.
4. Copy the following credentials:

| Where | Value | Env var |
|-------|-------|---------|
| Neon → Connection string | `postgresql://...` | `DATABASE_URL` (server) |
| Stack Auth → Project ID | `proj_...` | `STACK_PROJECT_ID` (server) + `VITE_STACK_PROJECT_ID` (frontend) |
| Stack Auth → Publishable client key | `pck_...` | `VITE_STACK_PUBLISHABLE_KEY` (frontend) |
| Stack Auth → Secret server key | `ssk_...` | `STACK_SECRET_SERVER_KEY` (server) |

5. Run the schema in the **Neon SQL Editor** (open `server/db/schema.sql` and paste the full contents). Neon Auth creates `neon_auth.users_sync` automatically — do not create a `users` table manually.

### eBay Developer Portal

1. Sign in at [developer.ebay.com](https://developer.ebay.com) and create an application.
2. Copy your **Client ID** and **Client Secret** from the application keys page.
3. Go to **My Account → User Tokens → Get a Token from eBay via Your Application**.
4. Add `http://localhost:3001/auth/ebay/callback` as a redirect URI. eBay will generate an **RuName** (e.g. `YourName-AppName-PRD-abc123-45678`).
5. Copy the RuName — this is used as the `redirect_uri` parameter in the eBay OAuth URL (not the raw callback URL).

> Start with `EBAY_ENVIRONMENT=sandbox` and sandbox credentials while developing. Switch to `production` and your production keys when going live.

---

## Environment Variables

**Frontend** — create `.env.local` at the project root:

```env
VITE_STACK_PROJECT_ID=proj_...
VITE_STACK_PUBLISHABLE_KEY=pck_...
```

**Backend** — create `server/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

# NeonDB
DATABASE_URL=postgresql://user:pass@host.neon.tech/perch?sslmode=require

# Stack Auth (Neon Auth)
STACK_PROJECT_ID=proj_...
STACK_SECRET_SERVER_KEY=ssk_...

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

All tables use Stack Auth user IDs (`TEXT`) as the foreign key — there is no custom `users` table.

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
2. **Step 1** — sign in with Google (powered by Stack Auth)
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
| `@stackframe/stack` | ^2.8.108 | Stack Auth React SDK (Google OAuth, session management) |
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
| `pg` | ^8.13.0 | PostgreSQL client for NeonDB |
| `jsonwebtoken` | ^9.0.2 | Signs/verifies eBay OAuth state JWT |
| `dotenv` | ^16.4.0 | Loads environment variables from `.env` |
