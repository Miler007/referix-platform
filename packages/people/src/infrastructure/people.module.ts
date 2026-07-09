import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { PERSON_REPOSITORY } from '../domain/person.repository.interface';
import { PERSON_ROLE_REPOSITORY } from '../domain/person-role.repository.interface';
import { InMemoryPersonRepository } from './repositories/in-memory.repository';
import { InMemoryPersonRoleRepository } from './repositories/in-memory-person-role.repository';

@Module({
  controllers: [PeopleController],
  providers: [
    PeopleService,
    { provide: PERSON_REPOSITORY, useClass: InMemoryPersonRepository },
    { provide: PERSON_ROLE_REPOSITORY, useClass: InMemoryPersonRoleRepository },
  ],
  exports: [PeopleService, PERSON_REPOSITORY, PERSON_ROLE_REPOSITORY],
})
export class PeopleModule {}
