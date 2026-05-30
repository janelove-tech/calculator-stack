# API Reference

Base URL: `http://localhost:3001` (configurable via `PORT` in `backend/.env`)

All JSON request/response bodies use `Content-Type: application/json`.

---

## Health

### `GET /health`

Check API and database connectivity.

**Response `200`**

```json
{
  "status": "ok",
  "database": "connected"
}
```

When PostgreSQL is unreachable, `database` is `"disconnected"` but the API may still respond.

---

## Calculations (history)

Stored in PostgreSQL table `calculation_history` when the database is available.

### `GET /calculations?limit=50`

List recent calculations (newest first). Max `limit` is 100.

**Response `200`** — array of:

```json
{
  "id": "uuid",
  "mode": "STANDARD",
  "expression": "2 + 3",
  "result": "5",
  "metadata": null,
  "createdAt": "2026-05-30T12:00:00.000Z"
}
```

`mode` is one of: `STANDARD`, `SCIENTIFIC`, `CONVERTER`.

### `POST /calculations`

Save a history entry.

**Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mode` | enum | yes | `STANDARD`, `SCIENTIFIC`, or `CONVERTER` |
| `expression` | string | yes | Human-readable expression (max 500 chars) |
| `result` | string | yes | Result text (max 100 chars) |
| `metadata` | object | no | Extra JSON (e.g. units, angle mode) |

**Response `201`** — created record (same shape as GET item).

**Response `503`** — database not available.

### `DELETE /calculations`

Clear all history.

**Response `200`** — `{ "count": number }`

### `DELETE /calculations/:id`

Delete one entry by UUID.

**Response `200`** — deleted record.

**Response `404`** — not found.

---

## Evaluate (scientific & math)

### `POST /evaluate`

Perform a single math operation server-side.

**Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `operation` | string | yes | See operations table below |
| `value` | number | yes | Primary operand |
| `secondValue` | number | no | Second operand when required |
| `angleMode` | string | no | `deg` or `rad` (default `deg`) for trig |

**Operations**

| `operation` | Needs `secondValue` | Notes |
|-------------|---------------------|--------|
| `add`, `subtract`, `multiply`, `divide` | yes | |
| `percent` | no | Returns `value / 100` |
| `sin`, `cos`, `tan` | no | Uses `angleMode` |
| `asin`, `acos`, `atan` | no | Result in degrees if `deg` |
| `log`, `ln`, `sqrt` | no | Domain validated |
| `pow2` | no | `value²` |
| `pow` | yes | `value ^ secondValue` |
| `exp`, `tenpow`, `abs` | no | |
| `factorial` | no | Integer `n!`, n ≤ 170 |

**Response `200`**

```json
{
  "result": 0.5,
  "operation": "sin"
}
```

**Response `400`** — invalid input or domain error.

---

## Conversions

### `GET /conversions/categories`

List unit keys per category.

**Response `200`**

```json
{
  "length": ["m", "km", "cm", "..."],
  "weight": ["kg", "g", "..."],
  "volume": ["L", "mL", "..."],
  "area": ["m²", "km²", "..."],
  "time": ["s", "ms", "..."],
  "temperature": ["C", "F", "K"]
}
```

### `POST /conversions/convert`

Convert a numeric value between units.

**Body**

| Field | Type | Required |
|-------|------|----------|
| `value` | number | yes |
| `category` | string | yes |
| `fromUnit` | string | yes |
| `toUnit` | string | yes |

**Response `200`**

```json
{
  "result": 1.609344,
  "fromUnit": "mi",
  "toUnit": "km",
  "category": "length"
}
```

### `GET /conversions/presets`

List saved unit-pair presets (requires database).

### `POST /conversions/presets`

**Body**

| Field | Type | Required |
|-------|------|----------|
| `category` | string | yes |
| `fromUnit` | string | yes |
| `toUnit` | string | yes |
| `label` | string | no |

### `DELETE /conversions/presets/:id`

Remove a preset.

---

## CORS

The API allows requests from `FRONTEND_URL` (default `http://localhost:3000`).
