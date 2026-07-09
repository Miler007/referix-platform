# ADR-002: Platform Kernel Design

**Status:** Accepted
**Date:** 2026-07-08

## Context
Every module needs auth, permissions, audit, config, logging, etc. Without a shared kernel, each module reinvents these capabilities.

## Decision
Create `@referix/kernel` as a NestJS library with 11 sub-modules:

1. **auth** - JWT (HS256 dev), refresh token rotation, bcrypt (cost 12)
2. **tenants** - Multi-tenant resolution via subdomain/header
3. **rbac** - Role-based access with granular permissions
4. **audit** - Append-only audit logging
5. **config** - Hierarchical config (env > file > db)
6. **flags** - 24 feature flags per tenant
7. **observability** - Structured logging, correlation IDs, health checks
8. **security** - CSP, HSTS, XSS headers
9. **database** - Prisma multi-schema connection manager
10. **cache** - In-memory cache (Redis-ready interface)
11. **events** - In-process event bus with outbox pattern

## Alternatives
- **NestJS shared module**: No clear boundaries, grows undocumented
- **External service (e.g., Auth0)**: Vendor lock-in, cost, no offline capability

## Consequences
- All modules import from kernel; kernel never imports from modules
- Kernel is loaded once at app bootstrap
- Future: extract kernel into separate deployable service if needed
