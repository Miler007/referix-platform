import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

interface RefreshTokenRecord {
  id: string;
  userId: string;
  tenantId: string;
  value: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

@Injectable()
export class TokenService {
  private readonly tokens: Map<string, RefreshTokenRecord> = new Map();

  async generateRefreshToken(userId: string, tenantId: string): Promise<string> {
    const value = uuid();
    const record: RefreshTokenRecord = {
      id: uuid(),
      userId,
      tenantId,
      value,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revoked: false,
      createdAt: new Date(),
    };
    this.tokens.set(value, record);
    return value;
  }

  async validateRefreshToken(value: string): Promise<RefreshTokenRecord | null> {
    const record = this.tokens.get(value);
    if (!record || record.revoked || record.expiresAt < new Date()) return null;
    return record;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    for (const [key, record] of this.tokens) {
      if (record.id === id) {
        record.revoked = true;
        this.tokens.set(key, record);
        return;
      }
    }
  }

  async findByValue(value: string): Promise<RefreshTokenRecord | null> {
    return this.tokens.get(value) ?? null;
  }
}
