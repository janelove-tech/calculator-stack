# Multifaceted Calculator

A full-stack calculator with **Standard**, **Scientific**, and **Unit Converter** modes. Built for learning and extension.

[![Stack](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Stack](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![Stack](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Stack](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)

## Features

| Mode | Capabilities |
|------|----------------|
| **Standard** | `+ − × ÷`, decimals, percent, memory (MC / MR / M+ / M−) |
| **Scientific** | Trig, inverse trig, log, ln, √, powers, factorial, π, e — DEG/RAD |
| **Converter** | Length, weight, volume, area, time, temperature |
| **History** | Saved to PostgreSQL when available; falls back to browser storage |
| **Presets** | Save favorite unit pairs (database) |

The app **works offline**: math and conversions run in the browser if the API is down.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript |
| Backend | [NestJS 10](https://nestjs.com/), class-validator |
| Database | PostgreSQL 16 (Docker) |
| ORM | [Prisma 6](https://www.prisma.io/) |

## Screenshots

Run the app locally, then open **http://localhost:3000**.

## Prerequisites

- **Node.js** 20+ and npm
- **Docker Desktop** (optional — for PostgreSQL persistence)
- **Git** (to clone / push this repo)

## Quick start

### 1. Clone and install

```powershell
git clone https://github.com/YOUR_USERNAME/calculator-stack.git
cd calculator-stack
.\setup.ps1
```

`setup.ps1` installs dependencies in `backend/` and `frontend/` and runs `prisma generate`.

### 2. Run the app (no database required)

**Terminal 1 — API**

```powershell
cd backend
npm run start:dev
```

**Terminal 2 — UI**

```powershell
cd frontend
npm run dev
```

Open **http://localhost:3000**

### 3. Enable PostgreSQL (optional)

```powershell
# From project root
docker compose up -d

cd backend
npm exec prisma migrate deploy
npm run start:dev
```

> Use **`npm exec prisma`**, not bare `npx prisma` (which may install Prisma 7 and break this project).

Postgres is exposed on **port 5433** (not 5432) to avoid conflicting with an existing local PostgreSQL install on Windows.

## Environment variables

Copy examples before first run:

```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

| File | Variable | Default | Description |
|------|----------|---------|-------------|
| `backend/.env` | `DATABASE_URL` | `postgresql://calculator:calculator@localhost:5433/calculator_db` | Prisma connection |
| `backend/.env` | `PORT` | `3001` | API port |
| `backend/.env` | `FRONTEND_URL` | `http://localhost:3000` | CORS origin |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | API base URL |

Never commit `.env` or `.env.local` — they are gitignored.

## Project structure

```
calculator-stack/
├── docker-compose.yml      # PostgreSQL (port 5433)
├── setup.ps1               # One-shot install script (Windows)
├── docs/
│   ├── API.md              # REST API reference
│   └── ARCHITECTURE.md     # System design
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── calculations/   # History CRUD
│       ├── conversions/    # Units + presets
│       ├── evaluate/       # Math operations
│       └── health/
└── frontend/
    ├── app/                # Next.js pages
    ├── components/         # UI
    ├── hooks/              # Calculator state
    └── lib/                # API client + offline math
```

## API

See **[docs/API.md](docs/API.md)** for full endpoint documentation.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | API + database status |
| `GET` | `/calculations` | List history |
| `POST` | `/calculations` | Save history entry |
| `DELETE` | `/calculations` | Clear history |
| `POST` | `/evaluate` | Scientific / math operations |
| `POST` | `/conversions/convert` | Unit conversion |
| `GET` | `/conversions/categories` | Available units |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find module` in editor | Run `.\setup.ps1`, then reload the IDE window |
| `npm install` SSL errors | `.npmrc` uses `use-system-ca=true`, or: `$env:NODE_OPTIONS="--use-system-ca"` |
| Prisma P1012 (`url` not supported) | Wrong Prisma version — use `npm exec prisma` inside `backend/` |
| P1000 authentication failed | Another Postgres on port 5432 — use Docker on **5433** (see `docker-compose.yml`) |
| API offline in UI | Start backend; calculator still works locally |
| Database disconnected | `docker compose up -d` then `npm exec prisma migrate deploy` |

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| Root | `.\setup.ps1` | Install all dependencies |
| `backend/` | `npm run start:dev` | API with hot reload |
| `backend/` | `npm run build` | Production build |
| `backend/` | `npm exec prisma studio` | DB GUI |
| `frontend/` | `npm run dev` | Next.js dev server |
| `frontend/` | `npm run build` | Production build |

## Publishing to GitHub

See **[docs/GITHUB.md](docs/GITHUB.md)** if you are pushing this repository for the first time.

## License

[MIT](LICENSE) — Copyright (c) 2026 Jane
