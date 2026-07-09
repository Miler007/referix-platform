# REF-CFG-001: Commercial Configuration Architecture

**Status:** Draft
**Author:** Miler (Chief Product & Enterprise Architect)
**Date:** 2024-07-09
**Stage:** Pilot Day 0 — Live Operations

---

## 1. Purpose

Define el modelo de datos y la estrategia de configuración comercial de Referix. Todo producto, plan, precio, promoción, comisión y regla de negocio debe ser configurable desde la Console sin modificar código.

---

## 2. Core Principle

> **Zero hardcoded business logic.**

Ninguna característica comercial debe estar escrita en el código. Todo se configura desde la plataforma.

---

## 3. Domain Model

```
CommercialProduct (Internet, TV, Alarma, Energía, SaaS...)
        │
        ▼
ProductPlan (300 Megas, 500 Megas, Plan Básico...)
        │
        ├── IncludedServices (TV HD, IP Pública, WiFi Mesh...)
        ├── CompatibleEquipment (ONT Huawei, Router AX3000...)
        ├── RequiredDocuments (CC, Recibo, Contrato...)
        ├── Promotions (1er mes gratis, 50% 3 meses...)
        ├── CommissionRules ($25.000, 8%, 10%...)
        ├── BusinessRules (migración, permanencia, reconexión...)
        ├── SLA (48h instalación, 99.5%, 4h respuesta...)
        └── CoverageZones (Norte, Centro, Rural...)
```

### 3.1 CommercialProduct

```typescript
interface CommercialProduct {
  id: string;
  tenantId: string;
  name: string;
  code: string;           // INTERNET, TV, ALARM, ENERGY, SAAS
  description: string;
  category: string;
  icon: string;
  active: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 ProductPlan

```typescript
interface ProductPlan {
  id: string;
  tenantId: string;
  productId: string;
  name: string;
  code: string;
  description: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  
  // Pricing
  price: number;
  promotionalPrice: number | null;
  promotionDurationDays: number | null;
  tax: number;
  currency: string;
  
  // Technical (product-specific)
  specs: Record<string, string>;  // { downloadSpeed: "300", uploadSpeed: "300", symmetric: "true" }
  
  // Costs (internal, never exposed)
  internalCosts: {
    installation: number;
    equipment: number;
    monthly: number;
    support: number;
  };
  
  // SLA
  sla: {
    maxInstallationHours: number;
    availability: number;
    responseTimeHours: number;
    repairTimeHours: number;
  };
  
  // Associations
  includedServiceIds: string[];
  compatibleEquipmentIds: string[];
  requiredDocumentTypes: string[];
  promotionIds: string[];
  commissionRuleIds: string[];
  coverageZoneIds: string[];
  businessRuleIds: string[];
  
  // Versioning
  version: number;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.3 IncludedService

```typescript
interface IncludedService {
  id: string;
  tenantId: string;
  name: string;
  code: string;          // TV_HD, IP_PUBLICA, TELEFONIA, WIFI_MESH
  description: string;
  category: string;
  active: boolean;
}
```

### 3.4 Promotion

```typescript
interface Promotion {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: 'FREE_MONTH' | 'FREE_INSTALL' | 'FREE_EQUIPMENT' | 'DISCOUNT' | 'DOUBLE_SPEED' | 'CUSTOM';
  value: number;
  durationDays: number;
  conditions: Record<string, unknown>;
  active: boolean;
  validFrom: Date;
  validTo: Date | null;
}
```

### 3.5 CommissionRule

```typescript
interface CommissionRule {
  id: string;
  tenantId: string;
  name: string;
  type: 'FIXED' | 'PERCENTAGE' | 'TIERED' | 'MUNICIPALITY' | 'PLAN_BASED';
  value: number;
  conditions: Record<string, unknown>;
  priority: number;
  holdingDays: number;
  active: boolean;
}
```

### 3.6 BusinessRule

```typescript
interface BusinessRule {
  id: string;
  tenantId: string;
  name: string;
  category: 'MIGRATION' | 'DOWNGRADE' | 'MINIMUM_TERM' | 'PERMANENCE' | 'RECONNECTION' | 'REQUIRED_DOCUMENTS' | 'OTHER';
  value: string | number | boolean;
  description: string;
  active: boolean;
}
```

---

## 4. Versioning Strategy

```
PlanVersion {
  id, planId, version, snapshot (JSON), 
  publishedAt, createdBy, changelog
}
```

- Each publish creates a new version
- Subscription links to the plan version at time of creation
- New sales use the current published version
- Historical subscriptions retain their version
- Config changes do not affect existing subscriptions unless explicitly migrated

---

## 5. Publication Flow

```
DRAFT → REVIEW → PUBLISHED → ARCHIVED
              ↕
           REJECTED
```

- Only PUBLISHED plans are used for new sales
- ARCHIVED plans cannot be sold but existing subscriptions remain valid
- Changes to PUBLISHED plans create a new version (previous version is preserved)

---

## 6. Integration Points

| Context | How It Consumes |
|---|---|
| **Subscription** | Reads planId + version at creation. Uses price, specs for provisioning. |
| **Billing** | Uses plan price (versioned). Invoice amount = plan price at subscription creation. |
| **Commissions** | Uses CommissionRule linked to plan. Applies policy engine. |
| **Coverage** | Reads coverageZoneIds from plan to determine availability. |
| **Provisioning** | Uses specs (speed, technology) for OLT/CPE configuration. |
| **Console** | Full CRUD for products, plans, services, promotions, rules. |
| **Partner App** | Reads published plans for referidor to offer. |

---

## 7. What Must Never Be Hardcoded

- Product names, codes, categories
- Plan prices, speeds, specs
- Commission amounts and percentages
- Promotion types and values
- Business rules (minimum term, permanence)
- Required document types
- Compatible equipment lists
- SLA targets
- Coverage zones per plan

---

## 8. What Remains in Core Domain

- Subscription lifecycle (create, activate, suspend, cancel)
- Installation state machine
- Provisioning provider interface
- Wallet ledger logic
- Commission calculation engine (uses configurable rules)
- Event bus
- Multi-tenant isolation

---

## 9. Console UI Structure

```
Commercial Configuration
├── Products
│   ├── Internet
│   ├── TV
│   ├── Telephony
│   ├── Alarm
│   └── + Add Product
├── Plans
│   ├── 300 Megas (PUBLISHED v3)
│   ├── 500 Megas (PUBLISHED v2)
│   ├── 600 Megas (DRAFT)
│   └── + New Plan
├── Services
│   ├── TV HD
│   ├── IP Pública
│   ├── WiFi Mesh
│   └── + Add Service
├── Promotions
│   ├── Primer mes gratis
│   ├── Instalación gratis
│   └── + Add Promotion
├── Commissions
│   ├── $25.000 300 Megas
│   ├── 8% 600 Megas
│   └── + Add Rule
├── Equipment
│   ├── ONT Huawei
│   ├── Router AX3000
│   └── + Add Equipment
├── SLA
│   ├── 48h Instalación
│   ├── 99.5% Disponibilidad
│   └── + Add SLA
├── Business Rules
│   ├── Migración: Sí
│   ├── Permanencia: 12 meses
│   └── + Add Rule
└── Version History
    ├── v3 — 2024-07-01
    ├── v2 — 2024-06-01
    └── v1 — 2024-01-15
```
