# 🔐 Secure Transaction Service — System Architecture & Flow Guide

This document explains the complete system architecture, including:

- 🏗 Monorepo structure
- 🧩 TurboRepo orchestration
- 🚀 Backend startup lifecycle
- 🔐 Encrypt API flow (Frontend → Backend → Crypto → DB)
- 🔓 Decrypt API flow
- 🔑 Master key flow
- 📦 Crypto package responsibility
- 🧠 System-wide dependency graph

- Live: https://mirfa-intern-challenge-web-eight.vercel.app/

---

# 🏗 Monorepo Architecture

```
apps/
   api/ → Fastify backend
   web/ → Next.js frontend

packages/
   crypto/ → Shared AES-256-GCM encryption and decryption engine
```

---

# 🧩 TurboRepo Orchestration

```
When you run: pnpm dev

Turbo executes:
Turbo
├── packages/crypto (build first)
├── apps/api (depends on crypto)
└── apps/web
```

```
                   ┌────────────────────────┐
                   │       TurboRepo        │
                   │   (task orchestrator)  │
                   └────────────┬───────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ▼                       ▼                        ▼
      ┌───────────────┐ ┌────────────────┐ ┌────────────────┐
      │ packages/     │ │ apps/api       │ │ apps/web       │
      │ crypto        │ │ Fastify        │ │ Next.js        │
      │ (build first) │ │ backend        │ │ frontend       │
      └───────┬───────┘ └───────┬────────┘ └────────┬───────┘
              │    Startup Flow │                   |
              │                 │                   |
              ▼                 ▼                   ▼
      Crypto compiled                        frontend server started
      (usable by API)                        (calls backend API)
```

TurboRepo is responsible for:

- Task orchestration
- Dependency graph management
- Incremental builds
- Caching
- Parallel dev servers

Turbo does NOT connect frontend and backend directly.  
Frontend communicates with backend via HTTP.

---

# 🚀 Backend Startup Flow

Fastify Boot Order:

1. Fastify Instance cretaed
   - _app_ is created
2. env.plugin
   - Load .env
   - Validate variables
   - Build config
   - Decorate appConfig

3. db.plugin
   - Create DB connection (Drizzle + Neon)
   - Decorate db

4. Service Wiring
   - Create repository
   - Inject masterKey
   - Decorate txService

5. Routes Registered

```
            Fastify Instance Created
                        │
                        ▼
            ┌────────────────────────┐
            │ env.plugin             │
            │ - Load .env            │
            │ - Validate variables   │
            │ - buildConfig()        │
            │ - decorate appConfig   │
            └────────────┬───────────┘
                        ▼
            ┌────────────────────────┐
            │ db.plugin              │
            │ - createDb(DATABASE_URL)
            │ - drizzle(client,{schema})
            │ - decorate db          │
            └────────────┬───────────┘
                        ▼
            ┌────────────────────────┐
            │ service wiring         │
            │ - create repository    │
            │ - create service       │
            │ - inject masterKey     │
            │ - decorate txService   │
            └────────────┬───────────┘
                        ▼
            ┌────────────────────────┐
            │ routes registered      │
            │ - /api/tx/encrypt      │
            │ - /api/tx/decrypt      │
            └────────────────────────┘
```

---

# 🔐 Encrypt Flow

```
            Frontend (Next.js)
               ↓
            POST /api/tx/encrypt
               ↓
            Controller
               ↓
            Service
               ↓
            Crypto Package (Envelope Encryption)
               ↓
            Repository
               ↓
            Neon PostgreSQL

```

#### Crypto Encryption Steps:

1. Generate random DEK
2. Encrypt payload with AES-256-GCM
3. Wrap DEK with Master Key
4. Store nonce, ciphertext, tag, wrapped DEK

---

#### Encrypt: Request Cycle

```
            ┌────────────────────────┐
            │ Next.js Frontend       │
            │ (apps/web)             │
            └────────────┬───────────┘
                        │ HTTP POST
                        ▼
            ┌────────────────────────┐
            │ Fastify Route          │
            │ /api/tx/encrypt        │
            └────────────┬───────────┘
                        ▼
            ┌────────────────────────┐
            │ Controller             │
            │ req.server.txService   │
            └────────────┬───────────┘
                        ▼
            ┌────────────────────────┐
            │ Service Layer          │
            │ encryptPayload()       │
            │ (injects masterKey)    │
            └────────────┬───────────┘
                        ▼
            ┌──────────────────────────────────┐
            │ packages/crypto                  │
            │                                  │
            │ 1. Generate random DEK           │
            │ 2. AES-256-GCM encrypt payload   │
            │ 3. AES-256-GCM wrap DEK          │
            │ 4. Return envelope record        │
            └────────────┬─────────────────────┘
                        ▼
            ┌────────────────────────┐
            │ Repository             │
            │ Drizzle insert         │
            └────────────┬───────────┘
                        ▼
            ┌────────────────────────┐
            │ Neon PostgreSQL        │
            │ transactions table     │
            └────────────────────────┘
```

---

# 🔓 Decrypt Flow

```
            Frontend (Next.js)
               │
               ▼
            POST /api/tx/decrypt/:id
               │
               ▼
            Controller
               │
               ▼
            Service
               │
               ▼
            Repository → Fetch encrypted record
               │
               ▼
            packages/crypto
               │
               ▼
         1. Validate nonce (12 bytes)
         2. Validate tag (16 bytes)
         3. Validate hex
         4. Unwrap DEK with masterKey
         5. Decrypt payload
               │
               ▼
            Return plaintext JSON
               │
               ▼
            Frontend displays decrypted payload
```

---

# 🔑 Master Key Flow

```
         .env (apps/api)
            ↓
         env.plugin
            ↓
         appConfig.masterKey
            ↓
         Injected into service
            ↓
         Used only inside crypto
```

Note: _Frontend never sees master key._

---

# 🧠 Combined System Overview

```
   Turbo
   │
   ├── packages/crypto
   │ └── AES-256-GCM engine
   │
   ├── apps/api
   │ ├── env.plugin
   │ ├── db.plugin
   │ ├── service
   │ ├── repository
   │ └── routes
   │
   └── apps/web
   └── Calls backend API
```

---

# 🚀 Production Improvements

- Add DB transactions for encrypt+save
- Implement master key rotation using mk_version
- Add rate limiting
- Integration tests

---

# 🎯 Summary

```
Startup:
Turbo → Shared crypto packages boots first
   → API boot → Config → DB → Service → Routes
   → Web → frontend boots up

Encrypt:
Frontend → Controller → Service → Crypto → Repository → Neon

Decrypt:
Frontend → Controller → Repository → Crypto → Response

This system is modular, secure, and production-ready.
```

# Deployment:

1. “We initially attempted to deploy both frontend and backend on Vercel as requested. However, our backend is a custom Fastify server inside a pnpm + Turborepo monorepo with a shared workspace package. Vercel’s deployment model is serverless-first and optimized for Next.js API routes, not persistent Node servers.”

2. “Because Vercel detected Turborepo, it switched into build artifact mode, expecting static output. This interfered with automatic serverless function detection. Additionally, workspace package resolution caused module import issues in the serverless bundling environment.”

3. “The backend expects a long-running Node process listening on a port, while Vercel expects stateless serverless handlers. Adapting Fastify to serverless required manual wrappers, and Turbo’s build pipeline prevented consistent function mounting.”

4. “Due to these architectural mismatches, deployment resulted in successful builds but no mounted runtime endpoints.”

5. “Therefore, we chose a platform better suited for long-running Node servers (Render), while keeping the frontend on Vercel where it performs best.”

#### Important

Our deployment didn’t fail because:

1. Our code was wrong
2. Fastify was wrong
3. Vercel is bad

   ```
   It failed because:

   - We were combining serverless-first hosting with a long-running
   Node server in a monorepo with workspace packages.
   - That’s an architectural mismatch.

   ```

4. Fastify runs as a persistent Node server requiring port binding, and lifecycle control
5. Whereas Vercel’s Next.js API routes are stateless serverless functions.
6. Our backend architecture was designed as a traditional long-running service inside a monorepo with shared workspace packages, which created friction with Vercel’s serverless-first execution model.”
