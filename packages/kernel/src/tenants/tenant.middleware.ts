import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const host = (req.headers['x-tenant-host'] as string | undefined) ?? req.hostname;
    const subdomain = host.split('.')[0] ?? '';

    const tenant = await this.tenantService.resolve(subdomain);
    if (tenant) {
      this.tenantService.setCurrent(tenant);
      (req as unknown as Record<string, unknown>).tenant = tenant;
    }

    next();
  }
}
