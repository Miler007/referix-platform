import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    service = new ConfigService();
  });

  it('should return default value when key not set', () => {
    expect(service.get('NONEXISTENT', 'default')).toBe('default');
  });

  it('should return PORT default', () => {
    expect(service.get('PORT')).toBe('3000');
  });

  it('should return custom value after set', () => {
    service.set('CUSTOM_KEY', 'custom_value');
    expect(service.get('CUSTOM_KEY')).toBe('custom_value');
  });

  it('should return number value', () => {
    expect(service.getNumber('PORT')).toBe(3000);
  });

  it('should detect development mode', () => {
    expect(service.isDevelopment()).toBe(true);
    expect(service.isProduction()).toBe(false);
  });

  it('should get and set tenant config', async () => {
    await service.setTenantConfig('tenant-1', 'feature_x', 'true');
    const val = await service.getTenantConfig('tenant-1', 'feature_x');
    expect(val).toBe('true');
  });
});
