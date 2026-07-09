# KPI CATALOG

**Status:** Final
**Date:** 2024-07-09
**Standard:** Enterprise Data Platform

---

## 1. Commercial KPIs

| KPI | Fórmula | SQL | Endpoint | Consumido por |
|---|---|---|---|---|
| Ventas del mes | COUNT(*) FROM referrals WHERE tenant_id=? AND month(created_at)=month(now) | `SELECT COUNT(*) FROM referrals WHERE tenant_id=? AND strftime('%m',created_at)=strftime('%m','now')` | `/api/v1/dashboard` | Console, Executive |
| Conversión | COUNT(IF status='WON') / COUNT(*) | `SELECT COUNT(CASE WHEN funnel_status='WON' THEN 1 END) as won, COUNT(*) as total FROM referrals` | `/api/v1/dashboard` | Console, Executive |
| Plan más vendido | MODE(plan_id) | `SELECT plan_id, COUNT(*) as count FROM referrals GROUP BY plan_id ORDER BY count DESC LIMIT 1` | `/api/v1/dashboard` | Console |

## 2. Finance KPIs

| KPI | Fórmula | SQL | Endpoint | Consumido por |
|---|---|---|---|---|
| Comisiones retenidas | SUM(final_amount) WHERE financial_state='HELD' | `SELECT COUNT(*), SUM(final_amount) FROM commissions WHERE financial_state='HELD'` | `/api/v1/dashboard` | Console, Partner |
| Comisiones pagadas | SUM(final_amount) WHERE financial_state='PAID' | `SELECT SUM(final_amount) FROM commissions WHERE financial_state='PAID'` | `/api/v1/wallet` | Partner, Finance |

## 3. Operations KPIs

| KPI | Fórmula | SQL | Endpoint | Consumido por |
|---|---|---|---|---|
| Instalaciones pendientes | COUNT(*) WHERE status IN ('PENDING','SCHEDULED') | `SELECT COUNT(*) FROM installations WHERE status IN ('PENDING','SCHEDULED')` | `/api/v1/dashboard` | Console, Executive |
| Instalaciones del día | COUNT(*) WHERE date(scheduled_date)=date('now') | `SELECT COUNT(*) FROM installations WHERE date(scheduled_date)=date('now')` | `/api/v1/installations` | Operations |

## 4. Customer KPIs

| KPI | Fórmula | SQL | Endpoint | Consumido por |
|---|---|---|---|---|
| Clientes activos | COUNT(*) WHERE funnel_status='WON' | `SELECT COUNT(*) FROM referrals WHERE funnel_status='WON'` | `/api/v1/dashboard` | Console, Executive |
| Clientes sin servicio | COUNT(*) WHERE status IN ('PENDING','ISSUE') | Pendiente de implementar | — | Support |
