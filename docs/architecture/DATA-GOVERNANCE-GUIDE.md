# DATA GOVERNANCE GUIDE

**Status:** Final
**Date:** 2024-07-09
**Standard:** Enterprise Data Platform

---

## 1. Single Source of Truth

Cloudflare D1 es la única fuente de verdad de Referix. Toda la información que ve el usuario proviene de esta base de datos a través de los Live Data Services.

## 2. Data Ownership

| Dato | Productor | Consumidores | Actualización |
|---|---|---|---|
| Ventas | Sales App | Console, Executive, Partner, Customer 360 | Inmediata |
| Catálogo | Console (Admin) | Sales, Customer 360 | Bajo demanda |
| Wallet | Sistema (comisiones) | Partner, Finance | Inmediata |
| Clientes | Sales + Sistema | Customer 360, Support | Inmediata |
| Instalaciones | Operations | Console, Executive | Inmediata |

## 3. Data Flow

```
Business Event (ej: Venta registrada)
    │
    ▼
Cloudflare D1 (Single Source of Truth)
    │
    ▼
Live Data Services (@referix/live-data)
    │
    ├── Commercial → Sales, Console
    ├── Customer → Customer 360, Support
    ├── Finance → Partner, Finance
    ├── Operations → Operations, Console
    └── Executive → Executive, Console
```

## 4. Rules

1. Ninguna UI hace fetch() directo a la API
2. Todos los KPIs se calculan en el backend
3. Cada KPI tiene una única definición oficial
4. Los datos comerciales son 100% configurables desde Console
5. No hay datos hardcodeados en el frontend
