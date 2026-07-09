export interface CacheProvider {
  readonly name: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMs: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
}

// L1: In-memory cache
export class MemoryCacheProvider implements CacheProvider {
  readonly name = 'memory';
  private store = new Map<string, { value: unknown; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { this.store.delete(key); return null; }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async del(key: string): Promise<void> { this.store.delete(key); }
  async clear(): Promise<void> { this.store.clear(); }
}

// L2: Redis-compatible cache (in-memory stub for dev)
export class RedisCacheProvider implements CacheProvider {
  readonly name = 'redis';
  private store = new Map<string, { value: unknown; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { this.store.delete(key); return null; }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async del(key: string): Promise<void> { this.store.delete(key); }
  async clear(): Promise<void> { this.store.clear(); }
}

// Multi-level cache
export class CacheService {
  constructor(
    private readonly l1: CacheProvider,
    private readonly l2?: CacheProvider,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const l1Result = await this.l1.get<T>(key);
    if (l1Result !== null) return l1Result;

    if (this.l2) {
      const l2Result = await this.l2.get<T>(key);
      if (l2Result !== null) {
        await this.l1.set(key, l2Result, 5000);
        return l2Result;
      }
    }
    return null;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    await Promise.all([
      this.l1.set(key, value, ttlMs),
      ...(this.l2 ? [this.l2.set(key, value, ttlMs)] : []),
    ]);
  }

  async del(key: string): Promise<void> {
    await Promise.all([
      this.l1.del(key),
      ...(this.l2 ? [this.l2.del(key)] : []),
    ]);
  }
}

export const memoryCache = new MemoryCacheProvider();
export const cacheService = new CacheService(memoryCache);
