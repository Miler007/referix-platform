# Sprint 1 — Engineering Report

## 1. Resumen Ejecutivo

Sprint 1 construyó el **Platform Kernel** de Referix — el núcleo compartido sobre el que vivirán todos los módulos de negocio. No se introdujo lógica de negocio. La plataforma está en estado **potencialmente desplegable**: compila, pasa 16 pruebas, expone health checks y documentación Swagger.

## 2. Cumplimiento del Plan

| Entregable | Estado | Detalle |
|-----------|--------|---------|
| E1: Monorepo (Turborepo) | ✅ | 4 workspaces configurados, scripts lint/test/build |
| E2: Platform Kernel (11 submódulos) | ✅ | Auth, Tenants, RBAC, Audit, Config, Flags, Observability, Security, Database, Cache, Events |
| E3: CI/CD Pipeline | ✅ | Husky, lint-staged, commitlint configurados |
| E4: Documentación | ✅ | 3 ADRs, Swagger, README |

## 3. Decisiones Arquitectónicas

### ADR-001: Monorepo Structure
Turborepo + pnpm workspaces. 4 packages iniciales: api, kernel, database, config.

### ADR-002: Platform Kernel Design
11 submódulos en `@referix/kernel`. Cada módulo exporta módulo NestJS + servicio + decorators/guards. Todos globales.

### ADR-003: Multi-tenant Strategy
Schema-per-tenant con `PrismaService.getTenantConnection(schema)`.

## 4. Riesgos Detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Sin DB en CI | Pruebas de integración de base de datos no ejecutables | TestContainers planificado para Sprint 2 |
| JWT con HS256 (dev) | No es seguro para producción | Migrar a RS256 con keys generadas automáticamente en Sprint 2 |
| In-memory cache | No persiste entre reinicios | Interfaz preparada para Redis — solo cambiar provider |
| Audit en memoria | Se pierde al reiniciar | Persistencia a DB pendiente de migración |

## 5. Deuda Técnica

| Deuda | Justificación | Plan |
|-------|---------------|------|
| Refresh tokens en memoria | No hay DB disponible aún | Migrar a tabla `refresh_tokens` en Sprint 2 |
| Sin rate limiting con Redis | Redis no disponible | Conectar Redis en Sprint 2 |
| Sin OpenTelemetry export | Proveedor de tracing no configurado | Configurar en Sprint 2 con infraestructura |
| Sin CSP estricto | Puede romper dev tools | Refinar en Sprint 2 |

## 6. Métricas

| Métrica | Valor |
|---------|-------|
| Cobertura de tests (kernel) | 14 tests, 3 suites |
| Cobertura de tests (api) | 2 tests e2e (smoke) |
| Líneas de código | ~2,000 (kernel) + ~200 (api) |
| Tiempo de build | ~11s |
| Tiempo de tests | ~22s (14 kernel + 2 api) |
| Dependencias | 0 de negocio, solo infraestructura |
| Archivos | 35 archivos fuente |

## 7. Observabilidad

| Componente | Estado |
|-----------|--------|
| Logging estructurado (JSON) | ✅ LoggerService con correlation ID |
| Correlation ID | ✅ CorrelationService + middleware |
| Health Checks | ✅ /health, /health/readiness, /health/liveness |
| Métricas | 🔄 Endpoint preparado, falta Prometheus |
| OpenTelemetry | 🔄 SDK instalado, sin exportadores |

## 8. Seguridad

| Componente | Estado |
|-----------|--------|
| JWT con refresh rotation | ✅ Implementado |
| Password hashing (bcrypt, costo 12) | ✅ |
| CSP / HSTS / XSS headers | ✅ SecurityMiddleware |
| Rate limiting | 🔄 Express middleware listo, falta Redis |
| Helmet | 🔄 Reemplazado por SecurityMiddleware manual |

## 9. Preparación para Sprint 2

### Capacidades listas
- Auth: login, refresh, logout, password hashing
- RBAC: 7 roles, 25+ permisos, guards y decorators
- Tenant: resolución por subdominio/header, multi-schema
- Feature flags: 24 flags evaluables por tenant
- Config: jerarquía env > file > db, config por tenant
- Audit: decorator @AuditLog, consulta por filtros
- Events: EventBus in-process con outbox
- Cache: getOrSet, pattern invalidation, interface para Redis

### Riesgos para Sprint 2
- Prisma multi-schema sin migración ejecutada
- Dependencia de PostgreSQL y Redis para integración
- JWT secreto hardcodeado (dev)

### Recomendaciones
1. Iniciar con migración de esquema público (tenants, users, roles)
2. Agregar TestContainers para pruebas de integración
3. Generar keys RSA para JWT producción
4. Conectar Redis para cache y rate limiting
5. Extender kernel con Platform Services (Notification, Storage, Email)

## Estructura Final del Proyecto

```
referix/
├── apps/
│   └── api/
│       ├── src/
│       │   ├── main.ts              # Bootstrap con Swagger
│       │   └── app.module.ts        # Importa KernelModule
│       └── test/
│           └── api.smoke.spec.ts    # Health check E2E
├── packages/
│   ├── kernel/
│   │   └── src/
│   │       ├── auth/                # JWT, refresh, bcrypt
│   │       ├── tenants/             # Multi-tenant resolution
│   │       ├── rbac/                # Roles, permissions, guards
│   │       ├── audit/               # Append-only audit log
│   │       ├── config/              # Hierarchical config
│   │       ├── flags/               # 24 feature flags
│   │       ├── observability/       # Logger, correlation, health
│   │       ├── security/            # CSP, HSTS, headers
│   │       ├── database/            # Prisma multi-schema
│   │       ├── cache/               # In-memory (Redis-ready)
│   │       └── events/              # Event bus + outbox
│   └── database/
│       └── prisma/
│           └── schema.prisma        # Public schema (6 tables)
├── docs/
│   └── adr/
│       ├── ADR-001-monorepo-structure.md
│       ├── ADR-002-platform-kernel.md
│       └── ADR-003-multi-tenant-strategy.md
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```
