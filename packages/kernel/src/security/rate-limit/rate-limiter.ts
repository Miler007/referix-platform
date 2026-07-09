export interface RateLimitRule {
  key: string;
  maxRequests: number;
  windowMs: number;
  by: 'ip' | 'userId' | 'tenantId' | 'endpoint';
}

export class RateLimiter {
  private windows = new Map<string, { count: number; resetAt: number }>();
  private rules: RateLimitRule[] = [];

  addRule(rule: RateLimitRule): void {
    this.rules.push(rule);
  }

  async check(key: string, ruleKey: string): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const rule = this.rules.find(r => r.key === ruleKey);
    if (!rule) return { allowed: true, remaining: Infinity, resetAt: Date.now() + 60000 };

    const windowKey = `${ruleKey}:${key}`;
    const now = Date.now();
    let window = this.windows.get(windowKey);

    if (!window || now >= window.resetAt) {
      window = { count: 0, resetAt: now + rule.windowMs };
      this.windows.set(windowKey, window);
    }

    window.count++;
    const remaining = Math.max(0, rule.maxRequests - window.count);

    if (window.count > rule.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: window.resetAt };
    }

    return { allowed: true, remaining, resetAt: window.resetAt };
  }

  middleware(ruleKey: string) {
    return async (req: any, res: any, next: () => void) => {
      const key = req.headers['x-forwarded-for'] ?? req.ip ?? 'unknown';
      const result = await this.check(key as string, ruleKey);
      if (!result.allowed) {
        res.status(429).json({ error: 'Too many requests', retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000) });
        return;
      }
      next();
    };
  }
}

export const rateLimiter = new RateLimiter();

// Default rules
rateLimiter.addRule({ key: 'api:default', maxRequests: 1000, windowMs: 60000, by: 'ip' });
rateLimiter.addRule({ key: 'auth:login', maxRequests: 5, windowMs: 60000, by: 'ip' });
rateLimiter.addRule({ key: 'api:register', maxRequests: 3, windowMs: 60000, by: 'ip' });
