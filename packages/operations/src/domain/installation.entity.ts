import { v4 as uuid } from 'uuid';
import {
  InstallationStatus, FailureReason, InstallationEvidenceData,
  RescheduleEntry, GeoPoint, SlaTimers,
} from './value-objects';

export class Installation {
  private readonly _id: string;
  private _status: InstallationStatus;
  private _failureReason: FailureReason | null = null;
  private _failureDescription: string | null = null;
  private _evidence: InstallationEvidenceData | null = null;
  private _technicianId: string | null = null;
  private _scheduledDate: Date | null = null;
  private _rescheduleHistory: RescheduleEntry[] = [];
  private _slaTimers: SlaTimers = { assignmentTime: null, dispatchTime: null, travelTime: null, installationTime: null, totalSla: null };

  private _createdAt: Date;
  private _assignedAt: Date | null = null;
  private _transitStartedAt: Date | null = null;
  private _installingStartedAt: Date | null = null;
  private _completedAt: Date | null = null;

  constructor(
    public readonly tenantId: string,
    public readonly referralId: string,
    public readonly subscriptionId: string | null = null,
    public readonly address: string,
    public readonly location: GeoPoint,
    public readonly requiredSkills: string[] = ['FTTH'],
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._status = InstallationStatus.PENDING_SCHEDULE;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get status(): InstallationStatus { return this._status; }
  get failureReason(): FailureReason | null { return this._failureReason; }
  get failureDescription(): string | null { return this._failureDescription; }
  get evidence(): InstallationEvidenceData | null { return this._evidence; }
  get technicianId(): string | null { return this._technicianId; }
  get scheduledDate(): Date | null { return this._scheduledDate; }
  get rescheduleHistory(): readonly RescheduleEntry[] { return this._rescheduleHistory; }
  get slaTimers(): SlaTimers { return this._slaTimers; }
  get createdAt(): Date { return this._createdAt; }
  get completedAt(): Date | null { return this._completedAt; }
  get assignedAt(): Date | null { return this._assignedAt; }

  schedule(scheduledDate: Date): void {
    if (this._status !== InstallationStatus.PENDING_SCHEDULE) {
      throw new Error(`Cannot schedule installation in status ${this._status}`);
    }
    this._scheduledDate = scheduledDate;
    this._status = InstallationStatus.SCHEDULED;
  }

  assign(technicianId: string): void {
    if (this._status !== InstallationStatus.SCHEDULED) {
      throw new Error(`Cannot assign installation in status ${this._status}`);
    }
    this._technicianId = technicianId;
    this._assignedAt = new Date();
    this._status = InstallationStatus.ASSIGNED;
    this._slaTimers.assignmentTime = (this._assignedAt.getTime() - this._createdAt.getTime()) / 60000;
  }

  startTransit(): void {
    if (this._status !== InstallationStatus.ASSIGNED) {
      throw new Error(`Cannot start transit in status ${this._status}`);
    }
    this._transitStartedAt = new Date();
    this._status = InstallationStatus.IN_TRANSIT;
    this._slaTimers.dispatchTime = (this._transitStartedAt.getTime() - this._assignedAt!.getTime()) / 60000;
  }

  startInstallation(): void {
    if (this._status !== InstallationStatus.IN_TRANSIT) {
      throw new Error(`Cannot start installation in status ${this._status}`);
    }
    this._installingStartedAt = new Date();
    this._status = InstallationStatus.INSTALLING;
    this._slaTimers.travelTime = (this._installingStartedAt.getTime() - this._transitStartedAt!.getTime()) / 60000;
  }

  complete(evidence: InstallationEvidenceData): void {
    if (this._status !== InstallationStatus.INSTALLING) {
      throw new Error(`Cannot complete installation in status ${this._status}`);
    }
    this._evidence = evidence;
    this._completedAt = new Date();
    this._status = InstallationStatus.COMPLETED;
    this._slaTimers.installationTime = (this._completedAt.getTime() - this._installingStartedAt!.getTime()) / 60000;
    this._slaTimers.totalSla = (this._completedAt.getTime() - this._createdAt.getTime()) / 60000;
  }

  fail(reason: FailureReason, description: string): void {
    if (this._status !== InstallationStatus.INSTALLING && this._status !== InstallationStatus.IN_TRANSIT && this._status !== InstallationStatus.ASSIGNED) {
      throw new Error(`Cannot fail installation in status ${this._status}`);
    }
    this._failureReason = reason;
    this._failureDescription = description;
    this._status = InstallationStatus.FAILED;
    this._completedAt = new Date();
  }

  cancel(reason: string, changedBy: string): void {
    if (this._status === InstallationStatus.COMPLETED) {
      throw new Error('Cannot cancel completed installation');
    }
    this._status = InstallationStatus.CANCELLED;
    this._failureDescription = reason;
    this._completedAt = new Date();
  }

  reschedule(newDate: Date, reason: string, changedBy: string): void {
    if (this._status === InstallationStatus.COMPLETED || this._status === InstallationStatus.CANCELLED) {
      throw new Error('Cannot reschedule terminal installation');
    }
    this._rescheduleHistory.push({
      previousDate: this._scheduledDate ?? this._createdAt,
      newDate,
      reason,
      changedBy,
      changedAt: new Date(),
    });
    this._scheduledDate = newDate;
    this._status = InstallationStatus.RESCHEDULED;
  }
}
