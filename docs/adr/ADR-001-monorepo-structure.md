# ADR-001: Monorepo Structure

**Status:** Accepted
**Date:** 2026-07-08

## Context
Referix needs a codebase that scales to 22+ modules while maintaining code quality and build times.

## Decision
Use Turborepo with pnpm workspaces. Monorepo structure:

```
referix/
  apps/api/          - NestJS backend
  apps/web/          - Next.js frontend (placeholder)
  packages/kernel/   - Platform Kernel
  packages/database/ - Prisma schemas
  packages/config/   - Shared configs
  packages/types/    - Shared types
  packages/validators/ - Zod schemas
```

## Alternatives
- **Nx**: More features but steeper learning curve and slower
- **Multiple repos**: Impossible to maintain consistency across 22 modules
- **Single package**: No module boundaries, no build optimization

## Consequences
- Faster builds via Turborepo caching
- Shared TypeScript configs across all packages
- Strict module boundaries enforced by package.json
- All packages versioned together

## Compliance
ESLint, Prettier, Husky, commitlint, lint-staged enforced at root.
