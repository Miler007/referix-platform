export enum InstallationStatus {
  PENDING_SCHEDULE = 'PENDING_SCHEDULE',
  SCHEDULED = 'SCHEDULED',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  INSTALLING = 'INSTALLING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum FailureReason {
  CLIENT_ABSENT = 'CLIENT_ABSENT',
  WRONG_ADDRESS = 'WRONG_ADDRESS',
  NO_POWER = 'NO_POWER',
  PORT_OCCUPIED = 'PORT_OCCUPIED',
  INSUFFICIENT_MATERIAL = 'INSUFFICIENT_MATERIAL',
  WEATHER = 'WEATHER',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_DAMAGE = 'NETWORK_DAMAGE',
  TECHNICAL_LIMITATION = 'TECHNICAL_LIMITATION',
  OTHER = 'OTHER',
}

export enum TechnicianSkill {
  FTTH = 'FTTH',
  HFC = 'HFC',
  WIRELESS = 'WIRELESS',
  CCTV = 'CCTV',
  ALARMS = 'ALARMS',
  ENERGY = 'ENERGY',
  FIBER_ENTERPRISE = 'FIBER_ENTERPRISE',
}

export enum PhotoType {
  ONT = 'ONT',
  ROUTER = 'ROUTER',
  CABLE = 'CABLE',
  FACADE = 'FACADE',
  GENERAL = 'GENERAL',
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface TimeSlot {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
}

export interface PhotoEvidence {
  url: string;
  type: PhotoType;
  timestamp: Date;
  gps: GeoPoint;
}

export interface ChecklistItem {
  step: string;
  required: boolean;
  passed: boolean;
  notes: string | null;
}

export interface InstallationEvidenceData {
  photos: PhotoEvidence[];
  gpsCheckIn: GeoPoint;
  gpsCheckOut: GeoPoint;
  digitalSignature: string | null;
  checklistResults: ChecklistItem[];
  observations: string;
  clientName: string;
  completedAt: Date;
}

export interface RescheduleEntry {
  previousDate: Date;
  newDate: Date;
  reason: string;
  changedBy: string;
  changedAt: Date;
}

export interface SlaTimers {
  assignmentTime: number | null;
  dispatchTime: number | null;
  travelTime: number | null;
  installationTime: number | null;
  totalSla: number | null;
}
