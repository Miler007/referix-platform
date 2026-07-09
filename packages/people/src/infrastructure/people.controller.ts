import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PeopleService } from './people.service';

@ApiTags('People')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new person identity' })
  async create(@Body() body: {
    tenantId: string;
    names: string;
    surnames: string;
    birthDate?: string;
    gender?: string;
    documentType?: string;
    documentNumber?: string;
    email?: string;
    phone?: string;
  }) {
    return this.peopleService.createPerson({
      tenantId: body.tenantId,
      names: body.names,
      surnames: body.surnames,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      gender: body.gender,
      documentType: body.documentType,
      documentNumber: body.documentNumber,
      email: body.email,
      phone: body.phone,
    });
  }

  @Get(':tenantId/:personId')
  @ApiOperation({ summary: 'Find person by ID' })
  async findById(@Param('tenantId') tenantId: string, @Param('personId') personId: string) {
    return this.peopleService.findById(tenantId, personId);
  }

  @Get(':tenantId')
  @ApiOperation({ summary: 'Search persons by criteria' })
  async search(
    @Param('tenantId') tenantId: string,
    @Query('query') query?: string,
    @Query('documentType') documentType?: string,
    @Query('documentNumber') documentNumber?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.peopleService.search(tenantId, { tenantId, query, documentType, documentNumber, email, phone, page, limit });
  }

  @Post(':tenantId/:personId/documents')
  @ApiOperation({ summary: 'Add document to person' })
  async addDocument(
    @Param('tenantId') tenantId: string,
    @Param('personId') personId: string,
    @Body() body: { documentType: string; documentNumber: string },
  ) {
    return this.peopleService.addDocument(tenantId, personId, body.documentType, body.documentNumber);
  }

  @Post(':tenantId/:personId/contacts')
  @ApiOperation({ summary: 'Add contact to person' })
  async addContact(
    @Param('tenantId') tenantId: string,
    @Param('personId') personId: string,
    @Body() body: { type: 'EMAIL' | 'PHONE'; value: string },
  ) {
    return this.peopleService.addContact(tenantId, personId, body.type, body.value);
  }

  @Post(':tenantId/:personId/consents')
  @ApiOperation({ summary: 'Grant consent' })
  async grantConsent(
    @Param('tenantId') tenantId: string,
    @Param('personId') personId: string,
    @Body() body: { type: 'DATA_PROCESSING' | 'MARKETING' | 'NOTIFICATIONS' | 'GEOLOCATION' },
  ) {
    return this.peopleService.grantConsent(tenantId, personId, body.type);
  }
}
