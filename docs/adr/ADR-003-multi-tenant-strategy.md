# ADR-003: Multi-tenant Strategy

**Status:** Accepted
**Date:** 2026-07-08

## Context
Referix serves multiple companies. Complete data isolation is required. Schema-per-tenant was chosen in REF-ARQ-001.

## Decision
**Schema-per-tenant** with separate `public` schema for cross-tenant data.

- `public` schema: tenants, users, roles, capabilities
- Per-tenant schema (`tenant_{id}`): all business tables (clients, sales, etc.)

The PrismaService in the kernel manages tenant connections dynamically:
- Default connection uses `public` schema
- Per-tenant connections created on demand with `getTenantConnection(schema)`

## Alternatives
- **Shared DB + RLS**: Data leakage risk, PostgreSQL RLS has performance overhead
- **DB-per-tenant**: Connection pool explosion, backup complexity

## Consequences
- Complete data isolation between tenants
- Can backup/restore per tenant
- Sharding roadmap: 1 DB → 50 tenants (growth), 500 (partition), 2000+ (shard)
- Slight connection overhead per new tenant
