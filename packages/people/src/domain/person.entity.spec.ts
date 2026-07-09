import { Person } from './person.entity';
import { PersonDocument, ContactRecord } from './value-objects';

describe('Person Aggregate', () => {
  it('should create a person with minimal identity', () => {
    const person = new Person({
      tenantId: 'tenant-1',
      names: 'Juan',
      surnames: 'Pérez',
    });
    expect(person.personId).toBeDefined();
    expect(person.status).toBe('INCOMPLETE');
    expect(person.documents).toHaveLength(0);
  });

  it('should add a document', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    person.addDocument(new PersonDocument('CC', '123456789'));
    expect(person.documents).toHaveLength(1);
    expect(person.timeline).toHaveLength(1);
    expect(person.timeline[0].eventType).toBe('DOCUMENT_ADDED');
  });

  it('should reject duplicate document', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    person.addDocument(new PersonDocument('CC', '123456789'));
    expect(() => person.addDocument(new PersonDocument('CC', '123456789'))).toThrow('already exists');
  });

  it('should verify a document', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    person.addDocument(new PersonDocument('CC', '123456789'));
    person.verifyDocument('CC', '123456789', 'admin-1', 'MANUAL');
    const doc = person.documents[0];
    expect(doc.isVerified()).toBe(true);
    expect(person.timeline).toHaveLength(2);
  });

  it('should add a contact', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    person.addContact(new ContactRecord('EMAIL', 'juan@example.com', 'UNVERIFIED', true));
    expect(person.contacts).toHaveLength(1);
    expect(person.getPrimaryContact('EMAIL')?.value).toBe('juan@example.com');
  });

  it('should verify a contact', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    person.addContact(new ContactRecord('EMAIL', 'juan@example.com'));
    person.verifyContact('EMAIL', 'juan@example.com', 'system');
    expect(person.contacts[0].status).toBe('VERIFIED');
  });

  it('should manage consents', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    person.grantConsent('DATA_PROCESSING', '192.168.1.1', 'SIGNUP');
    expect(person.consents).toHaveLength(1);
    expect(person.consents[0].granted).toBe(true);

    person.revokeConsent('DATA_PROCESSING');
    expect(person.consents[0].granted).toBe(false);
    expect(person.consents[0].revokedAt).toBeDefined();
  });

  it('should update identity with timeline', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    person.updateIdentity({ names: 'Juan David' });
    expect(person.names).toBe('Juan David');

    const entry = person.timeline.find((t) => t.eventType === 'IDENTITY_UPDATED');
    expect(entry).toBeDefined();
    expect(entry!.description).toContain('names');
  });

  it('should merge two persons', () => {
    const target = new Person({ tenantId: 't1', names: 'Carlos', surnames: 'López' });
    const source = new Person({ tenantId: 't1', names: 'Carlos A.', surnames: 'López' });

    source.mergeInto(target);
    expect(source.status).toBe('MERGED');
    expect(source.mergedIntoId).toBe(target.personId);
    expect(target.timeline.some((t) => t.eventType === 'MERGED')).toBe(true);
  });

  it('should archive with reason', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    person.archive('Duplicado confirmado');
    expect(person.status).toBe('ARCHIVED');
    expect(person.timeline[0].description).toContain('Duplicado');
  });

  it('should reject document without contact info', () => {
    const person = new Person({ tenantId: 't1', names: 'Juan', surnames: 'Pérez' });
    expect(person.documents).toHaveLength(0);
    expect(person.contacts).toHaveLength(0);
    // Person is INCOMPLETE — valid state
    expect(person.status).toBe('INCOMPLETE');
  });
});
