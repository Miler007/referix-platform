import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantIsolationMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const tenantId = req.headers['x-tenant-id'] as string ?? (req as any).user?.tenantId;
    if (!tenantId) {
      _res.status(400).json({ error: 'X-Tenant-Id header required' });
      return;
    }
    (req as any).tenantId = tenantId;

    // Verify the user's tenant matches the request tenant
    const userTenantId = (req as any).user?.tenantId;
    if (userTenantId && userTenantId !== tenantId) {
      _res.status(403).json({ error: 'Tenant mismatch' });
      return;
    }

    next();
  }
}

export function enforceTenantIsolation(controller: any, methodName: string): void {
  const original = controller[methodName];
  controller[methodName] = function (...args: any[]) {
    const req = args.find(a => a?.tenantId || a?.headers);
    const tenantId = req?.tenantId ?? req?.headers?.['x-tenant-id'];
    if (!tenantId) throw new Error('Tenant context required');
    return original.apply(this, args);
  };
}
