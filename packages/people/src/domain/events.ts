export interface DomainEvent {
  eventName: string;
  version: number;
  tenantId: string;
  personId: string;
  timestamp: Date;
  correlationId?: string;
  data: Record<string, unknown>;
}

export class PersonIdentityCreated implements DomainEvent {
  readonly eventName = 'person.identity.created';
  readonly version = 1;
  readonly timestamp = new Date();

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly names: string,
    public readonly surnames: string,
    public readonly documentType?: string,
    public readonly documentNumber?: string,
    public readonly correlationId?: string,
  ) {}

  get data() {
    return { personId: this.personId, names: this.names, surnames: this.surnames, documentType: this.documentType, documentNumber: this.documentNumber };
  }
}

export class PersonDocumentAdded implements DomainEvent {
  readonly eventName = 'person.document.added';
  readonly version = 1;
  readonly timestamp = new Date();

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly documentType: string,
    public readonly documentNumber: string,
    public readonly correlationId?: string,
  ) {}

  get data() {
    return { personId: this.personId, documentType: this.documentType, documentNumber: this.documentNumber };
  }
}

export class PersonDocumentVerified implements DomainEvent {
  readonly eventName = 'person.document.verified';
  readonly version = 1;
  readonly timestamp = new Date();

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly documentType: string,
    public readonly documentNumber: string,
    public readonly method: string,
    public readonly verifiedBy: string,
    public readonly correlationId?: string,
  ) {}

  get data() {
    return { personId: this.personId, documentType: this.documentType, documentNumber: this.documentNumber, method: this.method, verifiedBy: this.verifiedBy };
  }
}

export class PersonContactAdded implements DomainEvent {
  readonly eventName = 'person.contact.added';
  readonly version = 1;
  readonly timestamp = new Date();

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly contactType: string,
    public readonly value: string,
    public readonly correlationId?: string,
  ) {}

  get data() {
    return { personId: this.personId, contactType: this.contactType, value: this.value };
  }
}

export class PersonContactVerified implements DomainEvent {
  readonly eventName = 'person.contact.verified';
  readonly version = 1;
  readonly timestamp = new Date();

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly contactType: string,
    public readonly value: string,
    public readonly verifiedBy: string,
    public readonly correlationId?: string,
  ) {}

  get data() {
    return { personId: this.personId, contactType: this.contactType, value: this.value, verifiedBy: this.verifiedBy };
  }
}

export class PersonConsentGranted implements DomainEvent {
  readonly eventName = 'person.consent.granted';
  readonly version = 1;
  readonly timestamp = new Date();

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly consentType: string,
    public readonly correlationId?: string,
  ) {}

  get data() {
    return { personId: this.personId, consentType: this.consentType };
  }
}

export class PersonConsentRevoked implements DomainEvent {
  readonly eventName = 'person.consent.revoked';
  readonly version = 1;
  readonly timestamp = new Date();

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly consentType: string,
    public readonly correlationId?: string,
  ) {}

  get data() {
    return { personId: this.personId, consentType: this.consentType };
  }
}

export class PersonMerged implements DomainEvent {
  readonly eventName = 'person.merged';
  readonly version = 1;
  readonly timestamp = new Date();
  readonly personId: string;

  constructor(
    public readonly tenantId: string,
    public readonly survivorId: string,
    public readonly absorbedId: string,
    public readonly correlationId?: string,
  ) {
    this.personId = survivorId;
  }

  get data() {
    return { survivorId: this.survivorId, absorbedId: this.absorbedId };
  }
}

export class PersonStatusChanged implements DomainEvent {
  readonly eventName = 'person.status.changed';
  readonly version = 1;
  readonly timestamp = new Date();

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly previousStatus: string,
    public readonly newStatus: string,
    public readonly reason: string,
    public readonly correlationId?: string,
  ) {}

  get data() {
    return { personId: this.personId, previousStatus: this.previousStatus, newStatus: this.newStatus, reason: this.reason };
  }
}
