/**
 * @referix/live-data — Enterprise Data Platform
 * 
 * Fuente Única de Verdad para toda la plataforma Referix.
 * Organizado por dominio del negocio, no por interfaz.
 */

// Core
export { ApiClient } from './api-client';
export type { RequestState } from './api-client';

// Commercial
export { CatalogService, SalesService, OpportunityService } from './commercial/catalog.service';
export type { Zone, Plan } from './commercial/catalog.service';

// Customer
export { CustomerService, Customer360Service } from './customer/customer.service';
export type { CustomerSummary } from './customer/customer.service';

// Finance
export { WalletService, CommissionService } from './finance/wallet.service';
export type { Wallet, Commission } from './finance/wallet.service';

// Operations
export { InstallationService, CoverageService } from './operations/installation.service';
export type { Installation, CoverageResult } from './operations/installation.service';

// Executive
export { DashboardService, KpiService } from './executive/dashboard.service';
export type { DashboardKpi, KpiDefinition } from './executive/dashboard.service';
