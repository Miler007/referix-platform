import { Installation } from './installation.entity';
import { Technician } from './technician.entity';
import { InstallationStatus } from './value-objects';

export const INSTALLATION_REPOSITORY = 'INSTALLATION_REPOSITORY';
export const TECHNICIAN_REPOSITORY = 'TECHNICIAN_REPOSITORY';

export interface IInstallationRepository {
  save(installation: Installation): Promise<void>;
  findById(tenantId: string, id: string): Promise<Installation | null>;
  findByReferral(tenantId: string, referralId: string): Promise<Installation[]>;
  findByStatus(tenantId: string, status: InstallationStatus): Promise<Installation[]>;
  findByTechnician(tenantId: string, technicianId: string, date?: Date): Promise<Installation[]>;
  search(tenantId: string, criteria: { status?: InstallationStatus; technicianId?: string; date?: Date; page?: number; limit?: number }): Promise<{ data: Installation[]; total: number }>;
}

export interface ITechnicianRepository {
  save(technician: Technician): Promise<void>;
  findById(tenantId: string, id: string): Promise<Technician | null>;
  findByPersonId(tenantId: string, personId: string): Promise<Technician | null>;
  findAvailable(tenantId: string, date: Date, requiredSkills: string[]): Promise<Technician[]>;
  findBySkill(tenantId: string, skill: string): Promise<Technician[]>;
}
