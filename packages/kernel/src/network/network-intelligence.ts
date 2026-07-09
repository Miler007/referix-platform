/**
 * REF-NET-003 — Progressive Network Intelligence
 * 
 * Filosofía: Ayuda, no controla.
 * 
 * Nivel 1: Solo municipio → venta (hoy)
 * Nivel 2: + Barrios + cobertura opcional
 * Nivel 3: + Cajas + puertos (opcional)
 * Nivel 4: + Capacidad + mapas + reservas (opcional)
 * 
 * Si los datos existen → los usa para mejorar
 * Si no existen → continúa normalmente
 * Nunca bloquea una venta.
 */

export enum PortStatus { FREE = 'FREE', RESERVED = 'RESERVED', OCCUPIED = 'OCCUPIED', DAMAGED = 'DAMAGED' }
export enum BoxType { GPON = 'GPON', RADIO = 'RADIO' }

export interface NetworkBox {
  id: string;
  tenantId: string;
  name: string;
  type: BoxType;
  zoneId: string;
  neighborhoodId?: string;
  address?: string;
  totalPorts: number;
  usedPorts: number;
  status: 'ACTIVE' | 'SATURATED' | 'INACTIVE';
}

export interface NetworkPort {
  id: string;
  boxId: string;
  portNumber: number;
  status: PortStatus;
  subscriptionId: string | null;
}

export interface CoverageSuggestion {
  hasData: boolean;           // ¿Existe información de red?
  available: boolean | null;  // true/false si hay datos, null si no hay
  technology?: string;
  freePorts?: number;
  totalPorts?: number;
  boxName?: string;
  message: string;            // Mensaje para el vendedor
}

export class ProgressiveNetworkIntelligence {
  private boxes: Map<string, NetworkBox> = new Map();
  private ports: Map<string, NetworkPort[]> = new Map();

  // ── Gestión de infraestructura (opcional) ───────────────────────
  
  addBox(box: NetworkBox): void { this.boxes.set(box.id, box); }

  addPort(port: NetworkPort): void {
    const existing = this.ports.get(port.boxId) || [];
    existing.push(port);
    this.ports.set(port.boxId, existing);
  }

  getBoxesByZone(zoneId: string): NetworkBox[] {
    return Array.from(this.boxes.values()).filter(b => b.zoneId === zoneId && b.tenantId === 'interplay');
  }

  getFreePort(boxId: string): NetworkPort | undefined {
    return (this.ports.get(boxId) || []).find(p => p.status === PortStatus.FREE);
  }

  // ── Cobertura progresiva ───────────────────────────────────────
  
  checkCoverage(zoneId: string, neighborhood?: string): CoverageSuggestion {
    const zoneBoxes = this.getBoxesByZone(zoneId);
    const matching = neighborhood
      ? zoneBoxes.filter(b => b.neighborhoodId === neighborhood)
      : zoneBoxes;

    // No hay datos de red
    if (matching.length === 0) {
      return {
        hasData: false,
        available: null,
        message: 'Cobertura pendiente de validación. Operaciones confirmará antes de instalar.',
      };
    }

    const activeBox = matching.find(b => b.status === 'ACTIVE' || b.status === 'SATURATED');
    if (!activeBox) {
      return {
        hasData: true,
        available: false,
        message: 'Sin cobertura disponible en este sector.',
      };
    }

    const freePort = this.getFreePort(activeBox.id);
    const freePorts = (this.ports.get(activeBox.id) || []).filter(p => p.status === PortStatus.FREE).length;

    return {
      hasData: true,
      available: freePort !== null,
      technology: activeBox.type,
      freePorts,
      totalPorts: activeBox.totalPorts,
      boxName: activeBox.name,
      message: freePort
        ? `Cobertura verificada — ${activeBox.name} (${freePorts} puertos libres)`
        : `Cobertura verificada — ${activeBox.name} (saturada, ${activeBox.usedPorts}/${activeBox.totalPorts} ocupados)`,
    };
  }

  // ── Reserva de puerto (opcional) ────────────────────────────────
  
  reservePort(boxId: string, subscriptionId: string, portNumber?: number): NetworkPort | null {
    const boxPorts = this.ports.get(boxId);
    if (!boxPorts) return null;
    const port = portNumber
      ? boxPorts.find(p => p.portNumber === portNumber && p.status === PortStatus.FREE)
      : boxPorts.find(p => p.status === PortStatus.FREE);
    if (!port) return null;
    port.status = PortStatus.RESERVED;
    port.subscriptionId = subscriptionId;
    const box = this.boxes.get(boxId);
    if (box) box.usedPorts++;
    return port;
  }

  occupyPort(boxId: string, subscriptionId: string): NetworkPort | null {
    const port = (this.ports.get(boxId) || []).find(p => p.subscriptionId === subscriptionId);
    if (!port) return null;
    port.status = PortStatus.OCCUPIED;
    return port;
  }

  releasePort(boxId: string, subscriptionId: string): void {
    const port = (this.ports.get(boxId) || []).find(p => p.subscriptionId === subscriptionId);
    if (!port) return;
    port.status = PortStatus.FREE;
    port.subscriptionId = null;
    const box = this.boxes.get(boxId);
    if (box) box.usedPorts = Math.max(0, box.usedPorts - 1);
  }

  getUtilization(zoneId: string): { hasData: boolean; total: number; used: number; pct: number } | null {
    const zoneBoxes = this.getBoxesByZone(zoneId);
    if (zoneBoxes.length === 0) return null;
    const total = zoneBoxes.reduce((s, b) => s + b.totalPorts, 0);
    const used = zoneBoxes.reduce((s, b) => s + b.usedPorts, 0);
    return { hasData: true, total, used, free: total - used, pct: total > 0 ? Math.round((used / total) * 100) : 0 };
  }
}
