# REFERIX UX ARCHITECTURE AUDIT

**Status:** Draft
**Date:** 2024-07-09
**Stage:** XI.1 — UX Architecture Audit

---

## 1. Resumen Ejecutivo

Se auditaron las 8 aplicaciones de Referix. El objetivo no fue revisar el código, sino evaluar si cada pantalla ayuda al usuario a trabajar más rápido, con menos clics y mayor claridad.

**Principio rector:** Antes de aplicar estilo, asegurar que la experiencia es correcta.

---

## 2. Auditoría por Aplicación

### 2.1 Console — Centro de Gobierno

**Estado actual:** Funcional pero con apariencia de panel administrativo tradicional.

**Problemas UX detectados:**

| # | Problema | Impacto | Prioridad |
|---|---|---|---|
| C1 | Dashboard muestra KPIs pero sin contexto. El usuario no sabe si "47 ventas" es bueno o malo | Alto | P1 |
| C2 | Embudo de ventas hardcodeado. No hay datos reales del backend | Alto | P1 |
| C3 | Organización: formularios largos sin agrupación visual | Medio | P2 |
| C4 | Comercial: editar plan no persiste cambios (B-002) | Alto | P1 |
| C5 | Sin vista de "hoy" o "qué necesita atención" | Alto | P1 |
| C6 | Navegación: 10 módulos en el menú sin jerarquía | Medio | P2 |
| C7 | Sin indicadores de carga ni estados vacíos | Medio | P2 |

**Recomendaciones:**
- Reemplazar KPIs estáticos por tarjetas con contexto ("↑ 15% vs mes anterior")
- Agregar sección "Requiere atención" con alertas visibles
- Convertir tablas en tarjetas
- Agregar resumen ejecutivo tipo "tu empresa hoy"

**Inspiración:** Stripe Dashboard · Linear

---

### 2.2 Sales — Venta (App referencia)

**Estado actual:** 92/100 — La más madura de la plataforma.

**Problemas UX detectados:**

| # | Problema | Impacto | Prioridad |
|---|---|---|---|
| S1 | Las tarjetas de planes muestran badges GPON/TV pero la info de "TV no incluida" es difícil de ver | Medio | P2 |
| S2 | El formulario de cliente no tiene autocompletado ni búsqueda de clientes existentes | Alto | P1 |
| S3 | No hay búsqueda de clientes en el dashboard | Alto | P1 |
| S4 | La sección de "oportunidades" en el dashboard de ventas no existe | Medio | P2 |
| S5 | Los documentos se muestran como checks, no como uploader real | Medio | P2 |

**Recomendaciones:**
- Agregar buscador de clientes en el dashboard
- Integrar uploader de documentos
- Mostrar ventas del día y meta en el dashboard
- Persistir borradores de ventas en curso

**Inspiración:** Shopify POS · Stripe Dashboard

---

### 2.3 Partner — Referidor

**Estado actual:** 70/100 — Parece app administrativa. Debe verse como fintech.

**Problemas UX detectados:**

| # | Problema | Impacto | Prioridad |
|---|---|---|---|
| P1 | Dashboard no muestra meta ni progreso visual | Alto | P1 |
| P2 | Wallet conectada a API pero sin detalle de movimientos | Medio | P2 |
| P3 | Sin indicación de "cuánto falta para cobrar" | Alto | P1 |
| P4 | Sin sección de "mis referidos" con estado visual | Alto | P1 |
| P5 | Diseño sin coherencia con Sales App | Medio | P2 |

**Recomendaciones:**
- Rediseñar como app fintech: wallet grande, progreso, metas
- Mostrar timeline de comisiones ganadas
- Agregar "siguiente pago estimado"

**Inspiración:** Mercado Pago · PayPal · Nequi

---

### 2.4 Customer 360 — Ficha del Cliente

**Estado actual:** 82/100 — Bueno pero no excepcional.

**Problemas UX detectados:**

| # | Problema | Impacto | Prioridad |
|---|---|---|---|
| H1 | Búsqueda conectada a API pero sin resultados visuales atractivos | Bajo | P3 |
| H2 | Timeline sin datos dinámicos reales | Medio | P2 |
| H3 | Las pestañas cargan todo el contenido de golpe | Medio | P2 |
| H4 | Sin sección de "próximos pasos" o "recomendaciones" | Bajo | P3 |

**Recomendaciones:**
- Timeline vertical con iconos por evento
- Cards de resumen en la cabecera
- Sección de "próximo paso recomendado"

**Inspiración:** HubSpot CRM · Salesforce Lightning

---

### 2.5 Executive — Dirección

**Estado actual:** 65/100 — Básico, sin impacto.

**Problemas UX detectados:**

| # | Problema | Impacto | Prioridad |
|---|---|---|---|
| E1 | Sin gráficos ni visualizaciones | Alto | P1 |
| E2 | Sin KPIs comparativos vs período anterior | Alto | P1 |
| E3 | Sin alertas ni notificaciones | Alto | P1 |
| E4 | Sin tendencias ni predicciones | Medio | P2 |
| E5 | Diseño plano, sin premium | Alto | P1 |

**Recomendaciones:**
- Rediseñar completo con gráficos de tendencias
- KPIs con variación porcentual
- Alertas de clientes sin servicio
- Comparativas mes actual vs anterior

**Inspiración:** Stripe Dashboard · Notion Analytics

---

### 2.6 Operations — Técnicos

**Estado actual:** No implementada como app independiente. Solo existe Customer 360.

**Recomendaciones:**
- Pendiente para Sprint post-piloto

---

### 2.7 Support — Soporte

**Estado actual:** Integrado en Customer 360.

**Recomendaciones:**
- Pendiente para Sprint post-piloto

---

### 2.8 Finance — Finanzas

**Estado actual:** No implementada como app independiente.

**Recomendaciones:**
- Pendiente para Sprint post-piloto

---

## 3. Problemas Transversales

| # | Problema | Apps afectadas | Prioridad |
|---|---|---|---|
| T1 | Sin Design System compartido — cada app tiene su propio estilo | Todas | P1 |
| T2 | Tipografía inconsistente: Inter (Sales), sistema (Console, Partner) | Console, Partner, Executive | P1 |
| T3 | Sin estados vacíos: ninguna app muestra "sin datos" con ilustración | Todas | P2 |
| T4 | Sin loaders/skeletons: las pantallas cargan de golpe | Todas | P2 |
| T5 | Sin iconografía consistente: emojis en algunas, texto en otras | Todas | P2 |
| T6 | Sin modo oscuro | Todas | P3 |

---

## 4. Prioridades de Implementación

### Sprint 1 (Ahora — Core UX)
- [ ] P1-C1: Dashboard Console con contexto y alertas
- [ ] P1-C2: Embudo de ventas desde API
- [ ] P1-S3: Buscador de clientes en Sales
- [ ] P1-P1: Partner con progreso visual y metas
- [ ] P1-P3: Partner: "cuánto falta para cobrar"
- [ ] P1-E1: Executive con gráficos
- [ ] P1-T1: Design System compartido

### Sprint 2 (Post-piloto)
- [ ] P2: Estados vacíos, loaders, iconografía
- [ ] P2: Customer 360 timeline dinámico
- [ ] P2: Operations app
- [ ] P2: Support app

---

## 5. Inspiración para el rediseño

| App | Inspiración | Principio |
|---|---|---|
| Console | Stripe Dashboard | Claridad, métricas, contexto |
| Sales | Shopify POS | Flujo rápido, tarjetas, cero fricción |
| Partner | Mercado Pago | Wallet, progreso, metas |
| Customer 360 | HubSpot CRM | Historia del cliente, timeline |
| Executive | Notion Analytics | KPIs, tendencias, gráficos |

---

## 6. Product Polish Score Detallado

| App | Score | Objetivo | Diferencia |
|---|---|---|---|
| Sales | 92 | 95 | -3 |
| Customer 360 | 82 | 90 | -8 |
| Console | 80 | 90 | -10 |
| Partner | 70 | 85 | -15 |
| Executive | 65 | 85 | -20 |
| **PPS Global** | **88** | **95** | **-7** |

---

## 7. Próximo paso

Aprobación de este documento para iniciar **Stage XI.2 — Premium Design System Rollout**.
