/**
 * Live Data API Client
 * 
 * Capa única de comunicación con el backend.
 * Toda petición pasa por aquí. Nunca fetch() directo desde las vistas.
 */

export type RequestState<T> = 
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string };

export class ApiClient {
  private base: string;
  private headers: Record<string, string>;

  constructor(base: string, tenantId: string) {
    this.base = base;
    this.headers = { 'Content-Type': 'application/json', 'X-Tenant-Id': tenantId };
  }

  async get<T>(path: string, fallback?: T): Promise<RequestState<T>> {
    try {
      const res = await fetch(`${this.base}${path}`, { headers: this.headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = json?.data as T;
      
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return { status: 'empty', message: 'No hay información disponible aún.' };
      }
      if (typeof data === 'object' && Object.keys(data as object).length === 0) {
        return { status: 'empty', message: 'No hay información disponible aún.' };
      }
      return { status: 'success', data };
    } catch (e) {
      if (fallback !== undefined) return { status: 'success', data: fallback };
      return { status: 'error', message: 'No pudimos cargar la información. Intenta de nuevo.' };
    }
  }

  async post<T>(path: string, body: unknown): Promise<RequestState<T>> {
    try {
      const res = await fetch(`${this.base}${path}`, { method: 'POST', headers: this.headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json?.errors) return { status: 'error', message: json.errors[0]?.message || 'Error del servidor' };
      return { status: 'success', data: json?.data as T };
    } catch (e) {
      return { status: 'error', message: 'No pudimos completar la operación. Intenta de nuevo.' };
    }
  }
}
