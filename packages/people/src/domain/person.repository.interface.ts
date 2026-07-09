import { Person } from './person.entity';

export const PERSON_REPOSITORY = 'PERSON_REPOSITORY';

export interface PersonSearchCriteria {
  tenantId: string;
  query?: string;
  documentType?: string;
  documentNumber?: string;
  email?: string;
  phone?: string;
  names?: string;
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPersonRepository {
  save(person: Person): Promise<void>;
  findById(tenantId: string, personId: string): Promise<Person | null>;
  findByDocument(tenantId: string, documentType: string, documentNumber: string): Promise<Person | null>;
  findByContact(tenantId: string, contactType: string, value: string): Promise<Person | null>;
  search(tenantId: string, criteria: PersonSearchCriteria): Promise<PaginatedResult<Person>>;
  findDuplicates(tenantId: string, person: Person): Promise<Array<{ person: Person; confidence: number; matchedFields: string[] }>>;
}
