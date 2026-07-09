/**
 * @referix/live-data
 * 
 * Live Data Layer — Capa única de datos para toda la plataforma.
 * Ninguna aplicación consulta APIs directamente.
 * Todo pasa por estos servicios.
 */

export { ApiClient } from './api-client';
export type { RequestState } from './api-client';

export {
  DashboardService, SalesService, PartnerService,
  CustomerService, ExecutiveService,
} from './services';

export type {
  DashboardData, PlanData, WalletData, CustomerData,
} from './services';
