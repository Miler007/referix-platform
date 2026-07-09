export interface SubscriptionReadModel {
  id: string;
  publicId: string;
  tenantId: string;
  personId: string;
  planId: string;
  serviceId: string;
  locationId: string;
  contractId: string | null;
  status: string;
  health: string;
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
  activatedAt: Date | null;
  cancelledAt: Date | null;
  archivedAt: Date | null;
}
