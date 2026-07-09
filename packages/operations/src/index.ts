export { Installation } from './domain/installation.entity';
export { Technician } from './domain/technician.entity';
export {
  InstallationStatus, FailureReason, TechnicianSkill, PhotoType,
} from './domain/value-objects';
export type { GeoPoint, TimeSlot, PhotoEvidence, ChecklistItem, InstallationEvidenceData, RescheduleEntry, SlaTimers } from './domain/value-objects';
export { IInstallationRepository, ITechnicianRepository, INSTALLATION_REPOSITORY, TECHNICIAN_REPOSITORY } from './domain/repository.interface';
export { IDispatchEngine, DispatchCriteria, DispatchResult } from './application/services/dispatch-engine.interface';
