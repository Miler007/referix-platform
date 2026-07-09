import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export interface CatalogEntry {
  id: string;
  tenantId: string;
  type: string;
  data: Record<string, unknown>;
  active: boolean;
  validFrom: Date;
  validTo: Date | null;
  version: number;
}

@Injectable()
export class ConfigurationService {
  private catalogs = new Map<string, CatalogEntry[]>();

  async add(tenantId: string, type: string, data: Record<string, unknown>, validFrom?: Date, validTo?: Date | null): Promise<CatalogEntry> {
    const entry: CatalogEntry = {
      id: uuid(), tenantId, type, data, active: true,
      validFrom: validFrom ?? new Date(), validTo: validTo ?? null, version: 1,
    };
    const key = `${tenantId}:${type}`;
    this.catalogs.set(key, [...(this.catalogs.get(key) ?? []), entry]);
    return entry;
  }

  async findByType<T>(tenantId: string, type: string): Promise<T[]> {
    const key = `${tenantId}:${type}`;
    return (this.catalogs.get(key) ?? []).filter(e => e.active).map(e => e.data as T);
  }

  async update(tenantId: string, entryId: string, data: Record<string, unknown>): Promise<void> {
    for (const [key, entries] of this.catalogs.entries()) {
      if (!key.startsWith(`${tenantId}:`)) continue;
      const idx = entries.findIndex(e => e.id === entryId);
      if (idx !== -1) {
        entries[idx] = { ...entries[idx], data, version: entries[idx].version + 1 };
        return;
      }
    }
  }

  async deactivate(tenantId: string, entryId: string): Promise<void> {
    for (const [, entries] of this.catalogs.entries()) {
      const entry = entries.find(e => e.id === entryId && e.tenantId === tenantId);
      if (entry) { entry.active = false; return; }
    }
  }

  async getActiveTypes(tenantId: string): Promise<string[]> {
    const types = new Set<string>();
    for (const [key] of this.catalogs.entries()) {
      if (key.startsWith(`${tenantId}:`)) types.add(key.split(':')[1]!);
    }
    return Array.from(types);
  }
}
