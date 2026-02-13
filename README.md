
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
- 🚀 Production improvement roadmap

---

# 🏗 Monorepo Architecture

apps/
  api/        → Fastify backend  
  web/        → Next.js frontend  

packages/
  crypto/     → Shared AES-256-GCM encryption engine  

---

# 🧩 TurboRepo Orchestration

When you run: pnpm dev

Turbo executes:

Turbo
  ├── packages/crypto (build first)
  ├── apps/api (depends on crypto)
  └── apps/web

                   ┌────────────────────────┐
                   │       TurboRepo        │
                   │ (task orchestrator)    │
                   └────────────┬───────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ▼                       ▼                        ▼
┌───────────────┐      ┌────────────────┐       ┌────────────────┐
│ packages/     │      │ apps/api       │       │ apps/web       │
│ crypto        │      │ Fastify        │       │ Next.js        │
│ (build first) │      │ backend        │       │ frontend       │
└───────┬───────┘      └───────┬────────┘       └────────┬───────┘
        │                      Startup Flow              │
        │                                                │
        ▼                                                ▼
Crypto compiled                                  Dev server started
(usable by API)                                  (calls backend API)

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
   - *app* is created
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

---

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


# 🔐 Encrypt Flow

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

Crypto Steps:

1. Generate random DEK
2. Encrypt payload with AES-256-GCM
3. Wrap DEK with Master Key
4. Store nonce, ciphertext, tag, wrapped DEK

---

┌────────────────────────┐
│  Next.js Frontend     │
│  (apps/web)           │
└────────────┬───────────┘
             │ HTTP POST
             ▼
┌────────────────────────┐
│  Fastify Route        │
│  /api/tx/encrypt      │
└────────────┬───────────┘
             ▼
┌────────────────────────┐
│  Controller            │
│  req.server.txService  │
└────────────┬───────────┘
             ▼
┌────────────────────────┐
│  Service Layer         │
│  encryptPayload()      │
│  (injects masterKey)   │
└────────────┬───────────┘
             ▼
┌──────────────────────────────────┐
│ packages/crypto                 │
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

# 🔓 Decrypt Flow

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

---

# 🔑 Master Key Flow

.env (apps/api)
    ↓
env.plugin
    ↓
appConfig.masterKey
    ↓
Injected into service
    ↓
Used only inside crypto

Frontend never sees master key.

---

# 🧠 Combined System Overview

Turbo
  │
  ├── packages/crypto
  │       └── AES-256-GCM engine
  │
  ├── apps/api
  │       ├── env.plugin
  │       ├── db.plugin
  │       ├── service
  │       ├── repository
  │       └── routes
  │
  └── apps/web
          └── Calls backend API

---

# 🚀 Production Improvements

- Add DB transactions for encrypt+save
- Implement master key rotation using mk_version
- Add DB indexes
- Add /health endpoint
- Add rate limiting
- Structured logging
- Integration tests

---

# 🎯 Summary

Startup:
Turbo → Shared crypto packages boots first
      → API boot → Config → DB → Service → Routes
      → Web → frontend boots up

Encrypt:
Frontend → Controller → Service → Crypto → Repository → Neon

Decrypt:
Frontend → Controller → Repository → Crypto → Response

This system is modular, secure, and production-ready.
