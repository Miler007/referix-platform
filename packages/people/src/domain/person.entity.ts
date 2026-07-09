import { v4 as uuid } from 'uuid';
import {
  PersonDocument,
  ContactRecord,
  Consent,
  TimelineEntry,
  PersonStatus,
  ConsentType,
  ContactType,
  TimelineEventType,
} from './value-objects';

export class Person {
  public readonly personId: string;
  public readonly tenantId: string;
  public names: string;
  public surnames: string;
  public birthDate?: Date;
  public gender?: string;
  public status: PersonStatus;
  public readonly documents: PersonDocument[];
  public readonly contacts: ContactRecord[];
  public readonly consents: Consent[];
  public readonly timeline: TimelineEntry[];
  public readonly metadata: Record<string, unknown>;
  public mergedIntoId?: string;

  constructor(params: {
    tenantId: string;
    names: string;
    surnames: string;
    personId?: string;
    birthDate?: Date;
    gender?: string;
    status?: PersonStatus;
    documents?: PersonDocument[];
    contacts?: ContactRecord[];
    consents?: Consent[];
    timeline?: TimelineEntry[];
    metadata?: Record<string, unknown>;
    mergedIntoId?: string;
  }) {
    this.personId = params.personId ?? uuid();
    this.tenantId = params.tenantId;
    this.names = params.names;
    this.surnames = params.surnames;
    this.birthDate = params.birthDate;
    this.gender = params.gender;
    this.status = params.status ?? 'INCOMPLETE';
    this.documents = params.documents ?? [];
    this.contacts = params.contacts ?? [];
    this.consents = params.consents ?? [];
    this.timeline = params.timeline ?? [];
    this.metadata = params.metadata ?? {};
    this.mergedIntoId = params.mergedIntoId;
  }

  addDocument(document: PersonDocument, correlationId?: string): void {
    const duplicate = this.documents.find((d) => d.equals(document));
    if (duplicate) throw new Error(`Document ${document.documentType}:${document.documentNumber} already exists`);

    this.documents.push(document);
    this.timeline.push(
      new TimelineEntry(
        'DOCUMENT_ADDED',
        `Se agregó documento ${document.documentType}: ${document.documentNumber}`,
        new Date(),
        correlationId,
      ),
    );
  }

  verifyDocument(documentType: string, documentNumber: string, verifiedBy: string, method: string): void {
    const doc = this.documents.find((d) => d.documentType === documentType && d.documentNumber === documentNumber);
    if (!doc) throw new Error(`Document ${documentType}:${documentNumber} not found`);

    const idx = this.documents.indexOf(doc);
    this.documents[idx] = doc.verify(verifiedBy, method);
    this.timeline.push(
      new TimelineEntry('DOCUMENT_VERIFIED', `Documento ${documentType} verificado por ${verifiedBy}`, new Date()),
    );
  }

  addContact(contact: ContactRecord, correlationId?: string): void {
    const duplicate = this.contacts.find((c) => c.equals(contact));
    if (duplicate) throw new Error(`Contact ${contact.type}:${contact.value} already exists`);

    if (contact.isPrimary) {
      this.contacts.forEach((c) => {
        if (c.type === contact.type) {
          const idx = this.contacts.indexOf(c);
          this.contacts[idx] = c;
        }
      });
    }

    this.contacts.push(contact);
    this.timeline.push(
      new TimelineEntry('CONTACT_ADDED', `Se agregó contacto ${contact.type}: ${contact.value}`, new Date(), correlationId),
    );
  }

  verifyContact(type: ContactType, value: string, verifiedBy: string): void {
    const contact = this.contacts.find((c) => c.type === type && c.value === value);
    if (!contact) throw new Error(`Contact ${type}:${value} not found`);

    const idx = this.contacts.indexOf(contact);
    this.contacts[idx] = contact.verify(verifiedBy);
    this.timeline.push(
      new TimelineEntry('CONTACT_VERIFIED', `${type} ${value} verificado por ${verifiedBy}`, new Date()),
    );
  }

  grantConsent(type: ConsentType, ipAddress?: string, source?: string): void {
    const existing = this.consents.find((c) => c.type === type);
    if (existing?.granted) return;

    this.consents.push(new Consent(type, true, new Date(), undefined, ipAddress, source));
    this.timeline.push(new TimelineEntry('CONSENT_GRANTED', `Consentimiento ${type} otorgado`, new Date()));
  }

  revokeConsent(type: ConsentType): void {
    const consent = this.consents.find((c) => c.type === type);
    if (consent) {
      const idx = this.consents.indexOf(consent);
      this.consents[idx] = consent.revoke();
    }
    this.timeline.push(new TimelineEntry('CONSENT_REVOKED', `Consentimiento ${type} revocado`, new Date()));
  }

  mergeInto(targetPerson: Person, correlationId?: string): void {
    this.status = 'MERGED';
    this.mergedIntoId = targetPerson.personId;
    this.timeline.push(
      new TimelineEntry('MERGED', `Fusionada en persona ${targetPerson.personId}`, new Date(), correlationId),
    );
    targetPerson.timeline.push(
      new TimelineEntry('MERGED', `Absorbió persona ${this.personId}`, new Date(), correlationId),
    );
  }

  restrict(reason: string, correlationId?: string): void {
    this.status = 'RESTRICTED';
    this.timeline.push(new TimelineEntry('RESTRICTED', `Restringida: ${reason}`, new Date(), correlationId));
  }

  archive(reason: string, correlationId?: string): void {
    this.status = 'ARCHIVED';
    this.timeline.push(new TimelineEntry('ARCHIVED', `Archivada: ${reason}`, new Date(), correlationId));
  }

  updateIdentity(params: { names?: string; surnames?: string; birthDate?: Date }, correlationId?: string): void {
    const changedFields: string[] = [];
    if (params.names && params.names !== this.names) { this.names = params.names; changedFields.push('names'); }
    if (params.surnames && params.surnames !== this.surnames) { this.surnames = params.surnames; changedFields.push('surnames'); }
    if (params.birthDate && params.birthDate !== this.birthDate) { this.birthDate = params.birthDate; changedFields.push('birthDate'); }

    if (changedFields.length > 0) {
      this.timeline.push(
        new TimelineEntry(
          'IDENTITY_UPDATED',
          `Datos actualizados: ${changedFields.join(', ')}`,
          new Date(),
          correlationId,
        ),
      );
    }
  }

  hasDocument(documentType: string, documentNumber: string): boolean {
    return this.documents.some((d) => d.documentType === documentType && d.documentNumber === documentNumber);
  }

  hasContact(type: ContactType, value: string): boolean {
    return this.contacts.some((c) => c.type === type && c.value === value);
  }

  getPrimaryContact(type: ContactType): ContactRecord | undefined {
    return this.contacts.find((c) => c.type === type && c.isPrimary);
  }
}
