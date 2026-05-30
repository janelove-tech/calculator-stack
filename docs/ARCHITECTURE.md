# Architecture

## Overview

```
┌─────────────────┐     HTTP (REST)      ┌─────────────────┐
│  Next.js UI     │ ◄──────────────────► │  NestJS API     │
│  localhost:3000 │                      │  localhost:3001 │
└────────┬────────┘                      └────────┬────────┘
         │                                        │
         │  Fallback: local math +               │  Prisma ORM
         │  localStorage history                  ▼
         │                               ┌─────────────────┐
         │                               │  PostgreSQL     │
         │                               │  localhost:5433 │
         └───────────────────────────────┴─────────────────┘
              (works when API/DB offline)
```

## Frontend (`frontend/`)

| Area | Role |
|------|------|
| `app/` | Next.js App Router pages and global styles |
| `components/` | Calculator UI, keypad, converter, history panel |
| `hooks/` | `useCalculator`, `useConverter` state machines |
| `lib/api.ts` | HTTP client with **offline fallbacks** |
| `lib/evaluate.ts` | Client-side mirror of evaluate operations |
| `lib/convert.ts` | Client-side unit conversion tables |

The UI always remains usable: if the API or database is down, calculations run in the browser and history is stored in `localStorage`.

## Backend (`backend/`)

NestJS modules:

| Module | Responsibility |
|--------|----------------|
| `HealthModule` | `/health` — DB ping |
| `CalculationsModule` | CRUD for `CalculationHistory` |
| `EvaluateModule` | Stateless math operations |
| `ConversionsModule` | Unit conversion + `SavedConversion` presets |
| `PrismaModule` | Global Prisma client; connects on startup (non-fatal if DB missing) |

## Database (`backend/prisma/`)

**Models**

- `CalculationHistory` — `mode`, `expression`, `result`, optional `metadata` JSON
- `SavedConversion` — favorite `category` / `fromUnit` / `toUnit` pairs

Migrations live in `prisma/migrations/`. Apply with:

```bash
npm exec prisma migrate deploy
```

## Port layout

| Service | Port | Notes |
|---------|------|--------|
| Next.js | 3000 | `npm run dev` in `frontend/` |
| NestJS | 3001 | `PORT` in `backend/.env` |
| PostgreSQL (Docker) | **5433** → container 5432 | Avoids conflict with local PostgreSQL on 5432 |

## Data flow examples

**Standard calculation (`2 + 3 =`)**

1. User taps keys → state in `useCalculator` (client).
2. On `=` → client computes result, then `POST /calculations` to persist.
3. If POST fails → entry saved to `localStorage` via `lib/api.ts`.

**Scientific (`sin(30)`)**

1. Client sends `POST /evaluate` with `{ operation: "sin", value: 30, angleMode: "deg" }`.
2. On failure → `evaluateLocal()` in `lib/evaluate.ts`.
3. Result shown and optionally saved to history.

**Converter**

1. User changes value/units → debounced `POST /conversions/convert`.
2. On failure → `convertLocal()` in `lib/convert.ts`.
