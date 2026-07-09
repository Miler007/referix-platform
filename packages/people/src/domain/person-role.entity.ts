import { v4 as uuid } from 'uuid';
import { PersonRoleStatus, RoleType } from './value-objects';
import { PersonRoleCreated, PersonRoleApproved, PersonRoleRejected, PersonRoleSuspended, PersonRoleActivated } from './person-role.events';

export type PersonRoleEvent = PersonRoleCreated | PersonRoleApproved | PersonRoleRejected | PersonRoleSuspended | PersonRoleActivated;

export class PersonRole {
  private readonly _id: string;
  private _status: PersonRoleStatus;
  private _events: PersonRoleEvent[] = [];
  private _approvedBy: string | null = null;
  private _approvedAt: Date | null = null;
  private _rejectionReason: string | null = null;
  private _createdAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly roleType: RoleType,
    id?: string,
    status?: PersonRoleStatus,
  ) {
    this._id = id ?? uuid();
    this._status = status ?? PersonRoleStatus.REGISTERED;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get status(): PersonRoleStatus { return this._status; }
  get events(): readonly PersonRoleEvent[] { return this._events; }
  get createdAt(): Date { return this._createdAt; }
  get approvedBy(): string | null { return this._approvedBy; }
  get approvedAt(): Date | null { return this._approvedAt; }
  get rejectionReason(): string | null { return this._rejectionReason; }

  request(): void {
    if (this._status !== PersonRoleStatus.REGISTERED) {
      throw new Error(`Role already requested. Current status: ${this._status}`);
    }
    this._status = PersonRoleStatus.PENDING_APPROVAL;
    this._events.push(new PersonRoleCreated(this._id, this.tenantId, this.personId, this.roleType));
  }

  approve(approvedBy: string): void {
    if (this._status !== PersonRoleStatus.PENDING_APPROVAL) {
      throw new Error(`Cannot approve role in status ${this._status}`);
    }
    this._approvedBy = approvedBy;
    this._approvedAt = new Date();
    this._status = PersonRoleStatus.ACTIVE;
    this._events.push(new PersonRoleApproved(this._id, this.tenantId, this.personId, this.roleType, approvedBy));
  }

  reject(reason: string, rejectedBy: string): void {
    if (this._status !== PersonRoleStatus.PENDING_APPROVAL) {
      throw new Error(`Cannot reject role in status ${this._status}`);
    }
    this._rejectionReason = reason;
    this._status = PersonRoleStatus.REJECTED;
    this._events.push(new PersonRoleRejected(this._id, this.tenantId, this.personId, this.roleType, reason, rejectedBy));
  }

  suspend(reason: string): void {
    if (this._status !== PersonRoleStatus.ACTIVE) {
      throw new Error(`Cannot suspend role in status ${this._status}`);
    }
    this._status = PersonRoleStatus.SUSPENDED;
    this._events.push(new PersonRoleSuspended(this._id, this.tenantId, this.personId, this.roleType, reason));
  }

  activate(): void {
    if (this._status !== PersonRoleStatus.SUSPENDED) {
      throw new Error(`Cannot activate role in status ${this._status}`);
    }
    this._status = PersonRoleStatus.ACTIVE;
    this._events.push(new PersonRoleActivated(this._id, this.tenantId, this.personId, this.roleType));
  }

  pullEvents(): PersonRoleEvent[] {
    const events = [...this._events];
    this._events = [];
    return events;
  }
}
