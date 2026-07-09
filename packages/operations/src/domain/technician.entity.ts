import { v4 as uuid } from 'uuid';
import { TechnicianSkill, TimeSlot, GeoPoint } from './value-objects';

export class Technician {
  private readonly _id: string;
  private _currentWorkload: number;
  private _rating: number;

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly skills: TechnicianSkill[],
    public readonly maxDailyCapacity: number,
    public readonly vehicleType: 'BIKE' | 'MOTORCYCLE' | 'CAR' | 'VAN' | 'TRUCK',
    public readonly serviceArea: string[],
    public readonly availability: TimeSlot[],
    public readonly currentLocation: GeoPoint | null = null,
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._currentWorkload = 0;
    this._rating = 5.0;
  }

  get id(): string { return this._id; }
  get currentWorkload(): number { return this._currentWorkload; }
  get rating(): number { return this._rating; }

  hasSkill(skill: TechnicianSkill): boolean {
    return this.skills.includes(skill);
  }

  assignJob(): void {
    this._currentWorkload++;
  }

  completeJob(success: boolean): void {
    this._currentWorkload = Math.max(0, this._currentWorkload - 1);
    if (!success) {
      this._rating = Math.max(0, this._rating - 0.1);
    }
  }

  isAvailable(date: Date): boolean {
    if (this._currentWorkload >= this.maxDailyCapacity) return false;
    const day = date.getDay();
    const hour = date.getHours();
    return this.availability.some(slot => slot.dayOfWeek === day && hour >= slot.startHour && hour < slot.endHour);
  }

  distanceTo(location: GeoPoint): number {
    if (!this.currentLocation) return 0;
    const R = 6371;
    const dLat = this.toRad(location.latitude - this.currentLocation.latitude);
    const dLon = this.toRad(location.longitude - this.currentLocation.longitude);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(this.toRad(this.currentLocation.latitude)) * Math.cos(this.toRad(location.latitude)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
