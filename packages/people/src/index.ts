// Domain — Person
export { Person } from './domain/person.entity';
export { PersonDocument, ContactRecord, Consent, TimelineEntry, IdentityMatchProposal, PersonRoleStatus } from './domain/value-objects';
export type { VerificationStatus, ConsentType, ContactType, PersonStatus, TimelineEventType, RoleType } from './domain/value-objects';

// Events — Person
export {
  PersonIdentityCreated,
  PersonDocumentAdded,
  PersonDocumentVerified,
  PersonContactAdded,
  PersonContactVerified,
  PersonConsentGranted,
  PersonConsentRevoked,
  PersonMerged,
  PersonStatusChanged,
} from './domain/events';

// Contracts — Person
export { IPersonRepository, PERSON_REPOSITORY } from './domain/person.repository.interface';
export type { PersonSearchCriteria, PaginatedResult } from './domain/person.repository.interface';

// Domain — PersonRole
export { PersonRole } from './domain/person-role.entity';
export {
  PersonRoleCreated, PersonRoleApproved, PersonRoleRejected,
  PersonRoleSuspended, PersonRoleActivated,
} from './domain/person-role.events';

// Contracts — PersonRole
export { IPersonRoleRepository, PERSON_ROLE_REPOSITORY } from './domain/person-role.repository.interface';

// Services
export { PeopleService } from './infrastructure/people.service';

// Controllers
export { PeopleController } from './infrastructure/people.controller';

// NestJS Module
export { PeopleModule } from './infrastructure/people.module';
