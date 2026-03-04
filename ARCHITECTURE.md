# Heracle AI Backend — Architecture Guide

This document describes the backend architecture and the conventions to follow when writing new code.
It is intended as context for AI assistants and developers.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| ORM | Prisma |
| Database | PostgreSQL (Docker local / Supabase prod) |
| Auth | Firebase Admin SDK (ID token verify) + JWT (our own session token) |
| API Docs | Swagger / OpenAPI (`@nestjs/swagger`) |

---

## Project Structure

```
src/
├── main.ts                  # Bootstraps app; loads .env via dotenv/config
├── app.module.ts            # Root module; imports all feature modules
│
├── firebase/
│   └── firebase.module.ts   # @Global — initialises Firebase Admin on startup
│                              Reads heracle-ai-firebase-adminsdk.json from project root
│
├── prisma/
│   ├── prisma.module.ts     # @Global — exports PrismaService everywhere
│   └── prisma.service.ts    # Extends PrismaClient; injected into all services
│
├── common/
│   ├── decorators/
│   │   ├── public.decorator.ts   # @Public() — skips JWT guard on a route
│   │   └── admin.decorator.ts    # @Admin()  — requires role === 'admin'
│   ├── guards/
│   │   ├── jwt-auth.guard.ts     # Applied globally via APP_GUARD in AuthModule
│   │   └── admin.guard.ts        # Applied globally via APP_GUARD in AuthModule
│   └── strategys/
│       └── jwt.strategy.ts       # Decodes JWT → fetches full User from DB → sets req.user
│
├── auth/                    # Authentication feature
├── user/                    # User profile & body metrics
├── workout/                 # Workout sessions, today's plan, preferences
└── diet/                    # Diet plan and dietary preferences
```

---

## Auth Flow

```
Mobile App
  │
  ├─1─▶ Google Sign-In  →  Firebase.signInWithCredential()
  │
  ├─2─▶ firebaseUser.getIdToken()  →  Firebase ID Token
  │       iss: https://securetoken.google.com/heracle-ai  ✅
  │
  └─3─▶ POST /api/auth/google/token  { idToken: "..." }
            │
            ├─ Firebase Admin: verifyIdToken()
            ├─ Find or create User in DB (by email)
            └─ Return { user, token }   ← our own JWT (7d expiry)

All subsequent requests:
  Authorization: Bearer <our_jwt>
  JwtStrategy → decodes JWT → fetches User from DB → sets req.user
```

---

## Module Anatomy

Every feature module follows this structure:

```
src/<feature>/
├── <feature>.module.ts         # NestJS module; registers controller + service
├── <feature>.controller.ts     # HTTP layer: routes, guards, Swagger decorators
├── <feature>.service.ts        # Business logic; uses PrismaService
└── dto/
    ├── <action>-request.dto.ts  # Input shape (used in @Body / @Query)
    └── <action>-response.dto.ts # Output shape (used in @ApiOkResponse)
```
