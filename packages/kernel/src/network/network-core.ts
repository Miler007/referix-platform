/**
 * REF-NET-001 — Network Operations Core
 * 
 * Modelo de infraestructura física GPON/Radio Enlace.
 * Cajas, puertos, capacidad, cobertura por dirección.
 */

export enum PortStatus { FREE = 'FREE', RESERVED = 'RESERVED', OCCUPIED = 'OCCUPIED', DAMAGED = 'DAMAGED', BLOCKED = 'BLOCKED' }
export enum BoxType { GPON = 'GPON', RADIO = 'RADIO', MIXED = 'MIXED' }

export interface GponBox {
  id: string;
  tenantId: string;
  zoneId: string;
  neighborhoodId: string;
  name: string;
  type: BoxType;
  address: string;
  latitude: number;
  longitude: number;
  totalPorts: number;
  usedPorts: number;
  reservedPorts: number;
  damagedPorts: number;
  capacity: number;
  status: 'ACTIVE' | 'SATURATED' | 'EXPANSION' | 'INACTIVE';
  createdAt: Date;
}

export interface NetworkPort {
  id: string;
  boxId: string;
  portNumber: number;
  status: PortStatus;
  subscriptionId: string | null;
  reservedUntil: Date | null;
  opticalPower: number | null;
  lastMaintenance: Date | null;
}

export interface CoverageResult {
  available: boolean;
  box: GponBox | null;
  port: NetworkPort | null;
  technology: string;
  freePorts: number;
  totalPorts: number;
  capacity: number;
}

export class NetworkInventory {
  private boxes: Map<string, GponBox> = new Map();
  private ports: Map<string, NetworkPort[]> = new Map();

  addBox(box: GponBox): void {
    this.boxes.set(box.id, box);
  }

  getBox(id: string): GponBox | undefined {
    return this.boxes.get(id);
  }

  getBoxesByZone(zoneId: string): GponBox[] {
    return Array.from(this.boxes.values()).filter(b => b.zoneId === zoneId);
  }

  getBoxesByNeighborhood(neighborhoodId: string): GponBox[] {
    return Array.from(this.boxes.values()).filter(b => b.neighborhoodId === neighborhoodId);
  }

  addPort(port: NetworkPort): void {
    const existing = this.ports.get(port.boxId) || [];
    existing.push(port);
    this.ports.set(port.boxId, existing);
  }

  getPorts(boxId: string): NetworkPort[] {
    return this.ports.get(boxId) || [];
  }

  getFreePort(boxId: string): NetworkPort | undefined {
    return this.getPorts(boxId).find(p => p.status === PortStatus.FREE);
  }

  reservePort(boxId: string, subscriptionId: string): NetworkPort | null {
    const port = this.getFreePort(boxId);
    if (!port) return null;
    port.status = PortStatus.RESERVED;
    port.subscriptionId = subscriptionId;
    port.reservedUntil = new Date(Date.now() + 20 * 60 * 1000);
    
    const box = this.boxes.get(boxId);
    if (box) { box.reservedPorts++; }
    return port;
  }

  occupyPort(boxId: string, subscriptionId: string): NetworkPort | null {
    const ports = this.getPorts(boxId);
    const port = ports.find(p => p.status === PortStatus.RESERVED && p.subscriptionId === subscriptionId)
      || ports.find(p => p.status === PortStatus.FREE);
    if (!port) return null;
    port.status = PortStatus.OCCUPIED;
    port.subscriptionId = subscriptionId;
    
    const box = this.boxes.get(boxId);
    if (box) {
      box.usedPorts++;
      if (port.status === PortStatus.RESERVED) box.reservedPorts--;
      if (box.usedPorts >= box.totalPorts) box.status = 'SATURATED';
    }
    return port;
  }

  releasePort(boxId: string, portNumber: number): void {
    const port = this.getPorts(boxId).find(p => p.portNumber === portNumber);
    if (port) {
      port.status = PortStatus.FREE;
      port.subscriptionId = null;
      port.reservedUntil = null;
      const box = this.boxes.get(boxId);
      if (box) {
        box.usedPorts--;
        box.reservedPorts--;
        if (box.status === 'SATURATED' && box.usedPorts < box.totalPorts) box.status = 'ACTIVE';
      }
    }
  }

  checkCoverage(neighborhoodId: string): CoverageResult | null {
    const boxes = this.getBoxesByNeighborhood(neighborhoodId);
    if (boxes.length === 0) return null;
    
    const box = boxes.find(b => b.status === 'ACTIVE' || b.status === 'SATURATED');
    if (!box) return null;

    const boxPorts = this.getPorts(box.id);
    const free = boxPorts.filter(p => p.status === PortStatus.FREE).length;
    const freePort = boxPorts.find(p => p.status === PortStatus.FREE);

    return {
      available: free > 0,
      box,
      port: freePort || null,
      technology: box.type === BoxType.GPON ? 'GPON' : 'RADIO',
      freePorts: free,
      totalPorts: box.totalPorts,
      capacity: box.capacity,
    };
  }

  getUtilization(zoneId: string): { total: number; used: number; free: number; pct: number } {
    const boxes = this.getBoxesByZone(zoneId);
    const total = boxes.reduce((s, b) => s + b.totalPorts, 0);
    const used = boxes.reduce((s, b) => s + b.usedPorts, 0);
    return { total, used, free: total - used, pct: total > 0 ? Math.round((used / total) * 100) : 0 };
  }
}
