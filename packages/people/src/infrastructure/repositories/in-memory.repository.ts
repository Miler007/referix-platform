import { Injectable } from '@nestjs/common';
import { Person } from '../../domain/person.entity';
import { IPersonRepository, PersonSearchCriteria, PaginatedResult } from '../../domain/person.repository.interface';

@Injectable()
export class InMemoryPersonRepository implements IPersonRepository {
  private readonly store: Map<string, Map<string, Person>> = new Map();

  private getTenantStore(tenantId: string): Map<string, Person> {
    if (!this.store.has(tenantId)) {
      this.store.set(tenantId, new Map());
    }
    return this.store.get(tenantId)!;
  }

  async save(person: Person): Promise<void> {
    this.getTenantStore(person.tenantId).set(person.personId, person);
  }

  async findById(tenantId: string, personId: string): Promise<Person | null> {
    return this.getTenantStore(tenantId).get(personId) ?? null;
  }

  async findByDocument(tenantId: string, documentType: string, documentNumber: string): Promise<Person | null> {
    for (const person of this.getTenantStore(tenantId).values()) {
      if (person.hasDocument(documentType, documentNumber)) return person;
    }
    return null;
  }

  async findByContact(tenantId: string, contactType: string, value: string): Promise<Person | null> {
    for (const person of this.getTenantStore(tenantId).values()) {
      if (person.hasContact(contactType as any, value)) return person;
    }
    return null;
  }

  async search(_tenantId: string, criteria: PersonSearchCriteria): Promise<PaginatedResult<Person>> {
    let results = Array.from(this.getTenantStore(_tenantId).values());

    if (criteria.query) {
      const q = criteria.query.toLowerCase();
      results = results.filter((p) =>
        p.names.toLowerCase().includes(q) ||
        p.surnames.toLowerCase().includes(q),
      );
    }
    if (criteria.email) {
      results = results.filter((p) => p.hasContact('EMAIL', criteria.email!));
    }
    if (criteria.phone) {
      results = results.filter((p) => p.hasContact('PHONE', criteria.phone!));
    }

    const total = results.length;
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 20;
    const totalPages = Math.ceil(total / limit);
    const data = results.slice((page - 1) * limit, page * limit);

    return { data, total, page, limit, totalPages };
  }

  async findDuplicates(tenantId: string, person: Person): Promise<Array<{ person: Person; confidence: number; matchedFields: string[] }>> {
    const results: Array<{ person: Person; confidence: number; matchedFields: string[] }> = [];

    for (const existing of this.getTenantStore(tenantId).values()) {
      if (existing.personId === person.personId) continue;
      if (existing.status === 'MERGED' || existing.status === 'ARCHIVED') continue;

      const matchedFields: string[] = [];
      let score = 0;

      for (const doc of person.documents) {
        if (existing.hasDocument(doc.documentType, doc.documentNumber)) {
          matchedFields.push(`document:${doc.documentType}`);
          score += 0.5;
        }
      }

      for (const contact of person.contacts) {
        if (existing.hasContact(contact.type, contact.value)) {
          matchedFields.push(`contact:${contact.type}`);
          score += 0.3;
        }
      }

      if (existing.names.toLowerCase() === person.names.toLowerCase() &&
          existing.surnames.toLowerCase() === person.surnames.toLowerCase()) {
        matchedFields.push('full_name');
        score += 0.2;
      }

      if (score > 0) {
        results.push({ person: existing, confidence: Math.min(score, 1), matchedFields });
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }
}
