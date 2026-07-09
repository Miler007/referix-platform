import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcryptjs';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    const salt = await genSalt(this.saltRounds);
    return hash(password, salt);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
