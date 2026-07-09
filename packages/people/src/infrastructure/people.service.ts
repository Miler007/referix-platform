import { Inject, Injectable } from '@nestjs/common';
import { Person } from '../domain/person.entity';
import { PersonDocument, ContactRecord } from '../domain/value-objects';
import { IPersonRepository, PERSON_REPOSITORY, PersonSearchCriteria, PaginatedResult } from '../domain/person.repository.interface';

@Injectable()
export class PeopleService {
  constructor(
    @Inject(PERSON_REPOSITORY) private readonly personRepo: IPersonRepository,
  ) {}

  async createPerson(params: {
    tenantId: string;
    names: string;
    surnames: string;
    birthDate?: Date;
    gender?: string;
    documentType?: string;
    documentNumber?: string;
    email?: string;
    phone?: string;
  }): Promise<Person> {
    const person = new Person({
      tenantId: params.tenantId,
      names: params.names,
      surnames: params.surnames,
      birthDate: params.birthDate,
      gender: params.gender,
    });

    if (params.documentType && params.documentNumber) {
      const existing = await this.personRepo.findByDocument(params.tenantId, params.documentType, params.documentNumber);
      if (existing) throw new Error(`Person with ${params.documentType}:${params.documentNumber} already exists`);
      person.addDocument(new PersonDocument(params.documentType, params.documentNumber));
    }

    if (params.email) {
      const existing = await this.personRepo.findByContact(params.tenantId, 'EMAIL', params.email);
      if (existing) throw new Error(`Person with email ${params.email} already exists`);
      person.addContact(new ContactRecord('EMAIL', params.email, 'UNVERIFIED', true));
    }

    if (params.phone) {
      person.addContact(new ContactRecord('PHONE', params.phone, 'UNVERIFIED', !params.email));
    }

    await this.personRepo.save(person);
    return person;
  }

  async findById(tenantId: string, personId: string): Promise<Person | null> {
    return this.personRepo.findById(tenantId, personId);
  }

  async search(tenantId: string, criteria: PersonSearchCriteria): Promise<PaginatedResult<Person>> {
    return this.personRepo.search(tenantId, criteria);
  }

  async addDocument(tenantId: string, personId: string, documentType: string, documentNumber: string): Promise<Person> {
    const person = await this.personRepo.findById(tenantId, personId);
    if (!person) throw new Error('Person not found');

    person.addDocument(new PersonDocument(documentType, documentNumber));
    await this.personRepo.save(person);
    return person;
  }

  async verifyDocument(tenantId: string, personId: string, documentType: string, documentNumber: string, verifiedBy: string, method: string): Promise<Person> {
    const person = await this.personRepo.findById(tenantId, personId);
    if (!person) throw new Error('Person not found');

    person.verifyDocument(documentType, documentNumber, verifiedBy, method);
    await this.personRepo.save(person);
    return person;
  }

  async addContact(tenantId: string, personId: string, type: 'EMAIL' | 'PHONE', value: string): Promise<Person> {
    const person = await this.personRepo.findById(tenantId, personId);
    if (!person) throw new Error('Person not found');

    person.addContact(new ContactRecord(type, value));
    await this.personRepo.save(person);
    return person;
  }

  async grantConsent(tenantId: string, personId: string, consentType: 'DATA_PROCESSING' | 'MARKETING' | 'NOTIFICATIONS' | 'GEOLOCATION'): Promise<Person> {
    const person = await this.personRepo.findById(tenantId, personId);
    if (!person) throw new Error('Person not found');

    person.grantConsent(consentType);
    await this.personRepo.save(person);
    return person;
  }
}
