import { PasswordService } from './auth/password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('should hash and verify password', async () => {
    const password = 'MySecureP@ss123';
    const hash = await service.hash(password);
    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2a$')).toBe(true);

    const isValid = await service.verify(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject wrong password', async () => {
    const hash = await service.hash('correct-password');
    const isValid = await service.verify('wrong-password', hash);
    expect(isValid).toBe(false);
  });
});
