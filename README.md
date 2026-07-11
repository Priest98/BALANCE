# 🎁 GiftCard Verify

> A production-ready, full-stack Gift Card Verification Platform.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://docker.com/)

---

## 📋 Overview

GiftCard Verify is a modern, public-facing platform where users can verify their gift card balance without any account. It features:

- **Instant verification** with real-time polling
- **Plug-and-play provider architecture** — swap verification providers without touching the core
- **Enterprise security** — AES-256-GCM encryption, rate limiting, audit logs
- **Premium UI** — dark mode, glassmorphism, Framer Motion animations
- **Full admin dashboard** — manage card types, view verifications, monitor queue

---

## 🏗️ Architecture

```
BALANCE/
├── frontend/          # Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui
├── backend/           # NestJS + Prisma + PostgreSQL + Redis + BullMQ
├── docker-compose.yml # Full stack orchestration
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm

### 1. Clone and configure

```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Edit the `.env` files and set:
- `ADMIN_SECRET_KEY` — a long random string for admin panel access
- `ENCRYPTION_KEY` — 64-character hex string (generate with `openssl rand -hex 32`)
- Database and Redis passwords

### 2. Start with Docker Compose

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- NestJS API on port 3001
- Next.js frontend on port 3000

### 3. Run database migrations and seed

```bash
cd backend
npx prisma migrate deploy
npm run seed
```

### 4. Access the app

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs (Swagger)**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

---

## 💻 Local Development

### Backend

```bash
cd backend
cp .env.example .env  # configure your env
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local  # configure your env
npm install
npm run dev
```

---

## 🔐 Admin Access

The admin panel at `/admin` is protected by a static `ADMIN_SECRET_KEY`.

1. Set `ADMIN_SECRET_KEY=your_secret_here` in `backend/.env` and `frontend/.env.local`
2. Navigate to http://localhost:3000/admin
3. Enter the admin key to authenticate

---

## 🔌 Adding a New Provider

1. Create `backend/src/providers/your-provider/your.provider.ts`
2. Implement the `IGiftCardProvider` interface:

```typescript
export class YourProvider implements IGiftCardProvider {
  readonly name = 'your-provider';
  
  async verifyCard(input: VerifyCardInput): Promise<ProviderResponse> {
    // Call your provider API
  }
  
  async checkBalance(cardCode: string, pin?: string) { ... }
  async healthCheck(): Promise<boolean> { ... }
  normalizeResponse(raw: unknown): ProviderResponse { ... }
}
```

3. Register it in `providers.module.ts`:

```typescript
{
  provide: GIFT_CARD_PROVIDER,
  useClass: YourProvider,  // Replace MockProvider
}
```

That's it — no other changes needed.

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `card_types` | Supported gift card brands |
| `verification_requests` | All verification submissions |
| `verification_results` | Results from providers |
| `audit_logs` | Immutable audit trail |
| `settings` | Key-value system configuration |

---

## 🛡️ Security Features

- **AES-256-GCM** encryption for card codes and PINs at rest
- **IP rate limiting** via `@nestjs/throttler` + Redis
- **Duplicate detection** — SHA-256 fingerprint prevents replay within 5 minutes
- **Helmet** — secure HTTP headers
- **Audit logging** — every verification is logged
- **Input validation** — strict class-validator DTOs
- **Admin guard** — X-Admin-Key header required for all admin endpoints
- **No plain-text storage** — encrypted fields only

---

## 📚 API Reference

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/card-types` | List active card types |
| `POST` | `/api/verify` | Submit verification request |
| `GET` | `/api/verification/:id` | Poll verification result |
| `GET` | `/api/health` | Health check |

### Admin (requires `X-Admin-Key: <your-key>` header)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Stats overview |
| `GET` | `/api/admin/verifications` | Paginated history |
| `CRUD` | `/api/admin/card-types` | Manage card types |
| `GET` | `/api/admin/logs` | Audit logs |
| `GET/PATCH` | `/api/admin/settings` | System settings |
| `GET` | `/api/admin/queue` | Queue stats |
| `POST` | `/api/admin/queue/retry-failed` | Retry failed jobs |
| `POST` | `/api/admin/queue/clean` | Clean old jobs |

Full Swagger docs available at: http://localhost:3001/api/docs

---

## 🐳 Production Deployment

```bash
# Build and start all services
docker-compose -f docker-compose.yml up -d --build

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed initial data
docker-compose exec backend node dist/prisma/seed.js
```

Recommended: Place behind a reverse proxy (nginx/Caddy) with TLS termination.

---

## 📁 Project Structure

```
backend/src/
├── admin/              # Admin API aggregation
├── analytics/          # Dashboard stats
├── card-types/         # Gift card brand management
├── health/             # Health check endpoint
├── logs/               # Audit log access
├── prisma/             # Database client
├── providers/
│   ├── interfaces/     # IGiftCardProvider contract
│   └── mock/           # MockProvider (development)
├── queue/              # BullMQ producer + processor
├── settings/           # Key-value config store
├── shared/
│   ├── guards/         # AdminGuard
│   └── services/       # Encryption, Fingerprint, AuditLog, Geo
└── verification/       # Core verification flow

frontend/
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── contact/        # Contact page
│   ├── privacy/        # Privacy policy
│   ├── result/[id]/    # Verification result (polling)
│   └── terms/          # Terms of service
├── components/
│   ├── admin/          # Admin sidebar
│   ├── home/           # Brands, Features, FAQ
│   ├── layout/         # Navbar, Footer
│   ├── providers/      # ThemeProvider, QueryProvider
│   └── verification/   # VerificationForm
└── lib/
    └── api.ts          # Type-safe API client
```
