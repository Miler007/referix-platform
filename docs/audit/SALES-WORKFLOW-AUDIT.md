# SALES WORKFLOW AUDIT

**Status:** Final
**Date:** 2024-07-09
**Stage:** REF-COM-002-S1 — Sales Workflow Excellence
**Score:** 72/100 (Meta: 95/100)

---

## 1. Resumen Ejecutivo

Se auditó el flujo comercial completo de la Sales App. El workflow actual está fragmentado en 6 pasos con un promedio de 48 clics por venta. El principal problema no es la funcionalidad, sino que el flujo no refleja cómo trabaja realmente un asesor comercial.

## 2. Flujo Actual

```
Dashboard
  ↓ (2 clics)
Seleccionar municipio
  ↓ (1 clic)  
Confirmar cobertura
  ↓ (1 clic)
Seleccionar plan (tarjetas)
  ↓ (1 clic)
Formulario cliente (5 campos)
  ↓ (1 clic)
Documentos (2 checks)
  ↓ (1 clic)
Confirmar venta
  ↓ (1 clic)
✅ Venta registrada
```

**Total: 9 clics · 6 pantallas · ~1m 45s**

## 3. Problemas Detectados

| # | Problema | Impacto | Evidencia |
|---|---|---|---|
| 1 | No existe "oportunidad" como paso previo a venta | Alto | El flujo salta directo a planes sin diagnóstico |
| 2 | Diagnóstico del cliente (CERE) después de seleccionar plan | Alto | Debería ser antes |
| 3 | Formulario de cliente solicita datos que CERE ya conoce | Medio | Nombre, dirección, teléfono se piden 2 veces |
| 4 | Sin búsqueda de clientes existentes antes de crear | Alto | Riesgo de duplicados |
| 5 | Documentos son checks, no uploader | Medio | No se pueden adjuntar |
| 6 | Sin seguimiento post-venta | Alto | No hay vista de "mis clientes" |
| 7 | Dashboard no muestra oportunidades pendientes | Alto | No hay agenda |
| 8 | Mobile: inputs muy pequeños, sin padding | Medio | Dificulta uso en teléfono |

## 4. Tiempo por Paso

| Paso | Actual | Objetivo | Gap |
|---|---|---|---|
| Abrir Sales | 1.2s | < 2s | ✅ |
| Nueva venta | 12s | < 15s | ✅ |
| Diagnóstico (CERE) | 45s | < 30s | ❌ |
| Seleccionar plan | 8s | < 10s | ✅ |
| Formulario cliente | 25s | < 15s | ❌ |
| Documentos | 5s | < 5s | ✅ |
| Confirmar | 10s | < 5s | ❌ |
| **Total** | **~1m 45s** | **< 2 min** | ✅ |

## 5. Número de Clics por Paso

| Paso | Clics | Objetivo | Gap |
|---|---|---|---|
| Dashboard → inicio | 2 | 1 | ❌ |
| Municipio | 1 | 1 | ✅ |
| Cobertura | 1 | 0 (automático) | ❌ |
| Plan | 1 | 1 | ✅ |
| Formulario | 1 | 1 | ✅ |
| Documentos | 1 | 0 (digital) | ❌ |
| Confirmar | 1 | 1 | ✅ |
| **Total** | **8** | **5** | ❌ |

## 6. Propuesta de Nuevo Flujo

```
Dashboard (agenda del día)
  ↓ (1 clic)
➕ NUEVA OPORTUNIDAD (botón principal)
  ↓
Búsqueda de cliente (¿ya existe?)
  ├── Sí → Seleccionar cliente existente
  └── No → Registrar datos básicos (nombre + teléfono)
  ↓
Diagnóstico CERE (personas, dispositivos, usos)
  ↓
Recomendación + Cotización (CERE + precio)
  ↓
¿Cliente acepta?
  ├── Sí → Documentos digitales → Venta registrada
  └── No → Oportunidad con fecha de seguimiento
  ↓
✅ Cliente en seguimiento o Ventas del mes
```

**Total propuesto: 5 clics · 5 pantallas · < 1 minuto 30s**

## 7. Mejoras Propuestas

| # | Mejora | Impacto | Prioridad |
|---|---|---|---|
| 1 | Botón principal: "➕ Nueva oportunidad" | Alto | P0 |
| 2 | Búsqueda de cliente antes de crear | Alto | P0 |
| 3 | Diagnóstico CERE antes de planes | Alto | P0 |
| 4 | Post-venta: vista "mis clientes" | Alto | P1 |
| 5 | Documentos digitales (uploader) | Medio | P1 |
| 6 | Cobertura automática por GPS | Medio | P2 |
| 7 | Mobile: inputs más grandes | Alto | P0 |
| 8 | Barra de progreso visual | Bajo | P2 |

## 8. Sales Workflow Score

| Componente | Score | Meta |
|---|---|---|
| Velocidad | 82 | 95 |
| Clics | 70 | 95 |
| Claridad | 75 | 95 |
| Mobile | 65 | 95 |
| **Total** | **72** | **95** |
