# RC-001: Release Candidate Report

**Status:** Draft
**Author:** OpenCode (Lead Engineer)
**Date:** 2024-07-09
**Stage:** Stabilization Sprint

---

## 1. Executive Summary

Referix entra en fase de estabilización previa al Pilot Day 1. Se han realizado 17 auditorías sobre 8 aplicaciones, 28 planes comerciales, 5 zonas y 6 roles. Este reporte documenta el estado actual, los defectos encontrados y el checklist de liberación.

---

## 2. Release Candidate Checklist

### Backend

| Item | Estado | Observación |
|---|---|---|
| Tests unitarios (kernel) | ✅ 18/18 | Sin regresiones |
| Tests de seguridad | ✅ 3/3 | Tenant isolation, rate limit |
| Build | ✅ | TypeScript compila |
| APIs documentadas | 🔲 | Pendiente OpenAPI |
| Logs | ✅ | StructuredLogger implementado |
| Seeds | ✅ | seed-oficial.sql con 28 planes |
| Migraciones | ✅ | schema.sql + schema-v2.sql |

### Frontend

| Item | Estado | Observación |
|---|---|---|
| Console App | ✅ | Dashboard, KPIs, embudo |
| Sales App | ✅ | Flujo completo con CERE v4 |
| Partner App | ✅ | Dashboard, wallet |
| Customer 360 | ✅ | Ficha única del cliente |
| Executive | ✅ | Indicadores ejecutivos |
| Experience Router | ✅ | Login + apps por rol |
| Navegación | 🔲 | Pendiente auditoría completa |
| Responsive | 🔲 | Pendiente verificación mobile |
| Estados vacíos | 🔲 | Pendiente revisión |
| Estados de error | 🔲 | Pendiente revisión |

### Comercial

| Item | Estado | Observación |
|---|---|---|
| Catálogo oficial | ✅ | 28 planes, 5 zonas GPON |
| CERE v4 | ✅ | Perfil digital, RQI, tranquilidad |
| Centro de Oportunidades | ✅ | 12 motivos, seguimiento, agenda |
| Dashboard comercial | ✅ | KPIs, top planes, conversión |
| Customer 360 | ✅ | 8 pestañas, timeline completo |

### Operación

| Item | Estado | Observación |
|---|---|---|
| Roles | ✅ | 4 roles base (ADMIN, SALES, REFERIDOR, TECHNICIAN) |
| Permisos | ✅ | Matriz por rol |
| Network Intelligence | ✅ | Progresivo, opcional |
| Demo Mode | 🔲 | Pendiente validación |

---

## 3. Bug Register

### P0 — Criticos

| ID | Aplicación | Descripción | Estado |
|---|---|---|---|
| B-001 | Sales | Cobertura: si API no responde, el flujo se detiene | 🔴 Abierto |
| B-002 | Console | Catálogo: editar plan no persiste cambios | 🔴 Abierto |
| B-003 | Customer 360 | Búsqueda: no conecta con API real de clientes | 🔴 Abierto |

### P1 — Altos

| ID | Aplicación | Descripción | Estado |
|---|---|---|---|
| B-004 | Sales | Perfiles predefinidos: no cargan desde API | 🟡 Abierto |
| B-005 | Partner | Wallet: datos simulados, no conectados a backend | 🟡 Abierto |
| B-006 | Console | Embudo de ventas: porcentajes hardcodeados | 🟡 Abierto |
| B-007 | General | Login: sin validación de token expirado | 🟡 Abierto |

### P2 — Medios

| ID | Aplicación | Descripción | Estado |
|---|---|---|---|
| B-008 | Sales | Comparador económico: valores no dinámicos | 🟠 Abierto |
| B-009 | Console | Top referidores: datos simulados | 🟠 Abierto |
| B-010 | General | Sin página 404 personalizada | 🟠 Abierto |

### P3 — Bajos

| ID | Aplicación | Descripción | Estado |
|---|---|---|---|
| B-011 | Sales | Texto "Confianza: 96%" fijo | 🔵 Abierto |
| B-012 | Console | Logo Referix: usar SVG en lugar de emoji | 🔵 Abierto |
| B-013 | General | Sin favicon personalizado | 🔵 Abierto |

---

## 4. Deployment Checklist

```bash
# 1. Subir a GitHub
git add -A
git commit -m "Release Candidate v1.0.0"
git push

# 2. Desplegar Worker API
cd workers/api
npx wrangler deploy src/index.ts

# 3. Actualizar base de datos
npx wrangler d1 execute referix-db --remote --file=schema.sql
npx wrangler d1 execute referix-db --remote --file=schema-v2.sql
npx wrangler d1 execute referix-db --remote --file=schema-commercial-engine.sql
npx wrangler d1 execute referix-db --remote --file=seed-oficial.sql

# 4. Desplegar Frontend
cd ../..
npx wrangler pages deploy public --project-name=referix-platform

# 5. Verificar
curl https://referix-api.reto-diario.workers.dev/health
curl -o /dev/null -s -w "%{http_code}" https://referix-platform.pages.dev
```

---

## 5. Pilot Readiness Certificate

**Estado:** ⏳ Pendiente (requiere cierre de bugs P0 y P1)

**Condiciones para certificar:**
- [ ] Todos los bugs P0 cerrados
- [ ] Todos los bugs P1 cerrados
- [ ] Checklist RC completo al 100%
- [ ] Prueba de humo completa en Sales App (login → venta → confirmación)
- [ ] Prueba de humo completa en Console (login → dashboard → catálogo)
- [ ] Prueba de humo completa en Customer 360 (búsqueda → ficha → timeline)
- [ ] Seed ejecutable sin errores
- [ ] API health check responde 200
- [ ] Frontend carga sin errores de JavaScript

---

## 6. Próximos pasos

1. Corregir bugs P0 y P1
2. Ejecutar auditorías de navegación, mobile y accesibilidad
3. Completar Release Checklist
4. Obtener Pilot Readiness Certificate
5. Iniciar Pilot Day 1
