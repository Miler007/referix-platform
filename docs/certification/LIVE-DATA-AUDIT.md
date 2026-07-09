# LIVE DATA AUDIT

**Status:** Final
**Date:** 2024-07-09
**Goal:** Cero datos simulados fuera de Demo Mode

---

## 1. Resumen

Se auditaron las 8 aplicaciones de Referix para identificar datos reales vs simulados.

| App | Datos Reales | Datos Simulados | % Real |
|---|---|---|---|
| Console | KPIs desde API | Alertas (hardcodeadas) | 80% |
| Sales | Planes desde API, zonas desde API | Fallback con 6 planes | 85% |
| Partner | Wallet desde API | Movimientos (fallback local) | 70% |
| Customer 360 | Búsqueda desde API | Timeline (hardcodeado) | 60% |
| Executive | KPIs desde API | Sin gráficos reales | 50% |
| **Promedio** | | | **69%** |

**Objetivo:** 100% datos reales en todas las aplicaciones.

---

## 2. Auditoría por Pantalla

### Console
| Elemento | Fuente | Estado |
|---|---|---|
| KPIs (ventas, comisiones, instalaciones) | API `/api/v1/dashboard` | ✅ Real |
| Embudo de ventas | Hardcodeado (100-87-52-39) | ❌ Simulado |
| Alertas | Hardcodeadas | ❌ Simulado |
| Actividad reciente | Hardcodeada | ❌ Simulado |
| Top referidores | API dashboard | ✅ Real |

### Sales
| Elemento | Fuente | Estado |
|---|---|---|
| Zonas | API `/api/v2/catalog/zones` | ✅ Real |
| Planes por zona | API `/api/v2/catalog/plans` | ✅ Real |
| Fallback de planes | Hardcodeado (6 planes) | ❌ Simulado (solo si API falla) |
| Comisiones | Calculadas 10% del precio | ✅ Regla configurada |
| Perfiles predefinidos | Hardcodeados en JS | ❌ Simulado |

### Partner
| Elemento | Fuente | Estado |
|---|---|---|
| Saldo wallet | API `/api/v1/wallet` | ✅ Real |
| Meta mensual | Hardcodeada ($3.000.000) | ❌ Simulado |
| Movimientos | Fallback local (3 txs) | ❌ Simulado |
| Ventas del mes | Hardcodeado (12) | ❌ Simulado |

### Customer 360
| Elemento | Fuente | Estado |
|---|---|---|
| Búsqueda de clientes | API `/api/v1/referrals` | ✅ Real |
| Timeline del cliente | Hardcodeado (7 eventos) | ❌ Simulado |
| Documentos | Hardcodeados | ❌ Simulado |
| Información financiera | Hardcodeada | ❌ Simulado |

### Executive
| Elemento | Fuente | Estado |
|---|---|---|
| KPIs | API dashboard | ✅ Real |
| Gráficos | No existen | ❌ Ausente |
| Alertas | Hardcodeadas | ❌ Simulado |

---

## 3. Plan de Migración a Live Data

### Sprint 1 — Crítico (P0)
- [ ] Console: Conectar embudo de ventas a API real
- [ ] Console: Conectar actividad reciente a eventos reales
- [ ] Console: Conectar alertas a datos de monitoreo
- [ ] Partner: Conectar meta mensual a config
- [ ] Partner: Conectar movimientos wallet a API real
- [ ] Executive: Conectar alertas a API

### Sprint 2 — Medio (P1)
- [ ] Customer 360: Timeline desde eventos reales
- [ ] Customer 360: Documentos desde API
- [ ] Executive: Gráficos con datos reales
- [ ] Partner: Ventas del mes desde API real

### Sprint 3 — Bajo (P2)
- [ ] Sales: Perfiles predefinidos desde API
- [ ] Sales: Uploader de documentos real
- [ ] Customer 360: Información financiera desde API

---

## 4. Demo Mode

```
if (demoMode) {
  showBanner("MODO DEMOSTRACIÓN — Datos simulados")
  useMockData()
} else {
  useRealData()
}
```

El Demo Mode se activa desde la Console mediante Feature Flag.

---

## 5. Live Data Score por App

| App | Score Actual | Score Objetivo |
|---|---|---|
| Console | 80% → C | 100% |
| Sales | 85% | 100% |
| Partner | 70% | 100% |
| Customer 360 | 60% | 100% |
| Executive | 50% → C | 100% |
| **Global** | **69%** | **100%** |
