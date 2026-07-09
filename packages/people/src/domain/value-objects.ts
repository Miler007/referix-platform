export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'FAILED';

export type ConsentType = 'DATA_PROCESSING' | 'MARKETING' | 'NOTIFICATIONS' | 'GEOLOCATION' | 'DIGITAL_SIGNATURE';

export type ContactType = 'EMAIL' | 'PHONE' | 'FAX';

export type PersonStatus = 'INCOMPLETE' | 'VERIFIED' | 'RESTRICTED' | 'ARCHIVED' | 'MERGED' | 'DUPLICATE';

export type TimelineEventType =
  | 'IDENTITY_CREATED'
  | 'DOCUMENT_ADDED'
  | 'DOCUMENT_VERIFIED'
  | 'CONTACT_ADDED'
  | 'CONTACT_VERIFIED'
  | 'CONTACT_CHANGED'
  | 'CONSENT_GRANTED'
  | 'CONSENT_REVOKED'
  | 'IDENTITY_UPDATED'
  | 'MERGE_SUGGESTED'
  | 'MERGED'
  | 'RESTRICTED'
  | 'ARCHIVED';

export class PersonDocument {
  constructor(
    public readonly documentType: string,
    public readonly documentNumber: string,
    public readonly status: VerificationStatus = 'UNVERIFIED',
    public readonly verifiedAt?: Date,
    public readonly verifiedBy?: string,
    public readonly verificationMethod?: string,
  ) {}

  isVerified(): boolean {
    return this.status === 'VERIFIED';
  }

  verify(verifiedBy: string, method: string): PersonDocument {
    return new PersonDocument(
      this.documentType,
      this.documentNumber,
      'VERIFIED',
      new Date(),
      verifiedBy,
      method,
    );
  }

  equals(other: PersonDocument): boolean {
    return this.documentType === other.documentType && this.documentNumber === other.documentNumber;
  }
}

export class ContactRecord {
  constructor(
    public readonly type: ContactType,
    public readonly value: string,
    public readonly status: VerificationStatus = 'UNVERIFIED',
    public readonly isPrimary: boolean = false,
    public readonly verifiedAt?: Date,
    public readonly verifiedBy?: string,
  ) {}

  verify(verifiedBy: string): ContactRecord {
    return new ContactRecord(this.type, this.value, 'VERIFIED', this.isPrimary, new Date(), verifiedBy);
  }

  makePrimary(): ContactRecord {
    return new ContactRecord(this.type, this.value, this.status, true, this.verifiedAt, this.verifiedBy);
  }

  equals(other: ContactRecord): boolean {
    return this.type === other.type && this.value === other.value;
  }
}

export class Consent {
  constructor(
    public readonly type: ConsentType,
    public readonly granted: boolean,
    public readonly grantedAt: Date,
    public readonly revokedAt?: Date,
    public readonly ipAddress?: string,
    public readonly source?: string,
  ) {}

  revoke(): Consent {
    return new Consent(this.type, false, this.grantedAt, new Date(), this.ipAddress, this.source);
  }
}

export class TimelineEntry {
  constructor(
    public readonly eventType: TimelineEventType,
    public readonly description: string,
    public readonly timestamp: Date = new Date(),
    public readonly correlationId?: string,
    public readonly changedBy?: string,
  ) {}
}

export enum PersonRoleStatus {
  REGISTERED = 'REGISTERED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE',
}

export type RoleType = 'REFERIDOR' | 'SUPERVISOR' | 'INSTALLER' | 'CLIENT' | 'COORDINATOR' | 'BILLING_OPERATOR' | 'ADMIN' | 'MANAGER' | 'DISTRIBUTOR';

export class IdentityMatchProposal {
  constructor(
    public readonly sourcePersonId: string,
    public readonly targetPersonId: string,
    public readonly confidence: number,
    public readonly matchedFields: Array<{ field: string; sourceValue: string; targetValue: string; exact: boolean }>,
    public readonly suggestedAction: 'AUTO_MERGE' | 'REVIEW' | 'REJECT',
  ) {}
}
