import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CorrelationService {
  private currentId?: string;

  generate(): string {
    this.currentId = uuid();
    return this.currentId;
  }

  set(id: string): void {
    this.currentId = id;
  }

  getCurrent(): string {
    return this.currentId ?? 'no-correlation-id';
  }
}
