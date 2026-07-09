import { Technician } from './technician.entity';
import { TechnicianSkill } from './value-objects';

describe('Technician', () => {
  it('should create with skills and capacity', () => {
    const tech = new Technician('t-1', 'person-1', [TechnicianSkill.FTTH], 4, 'MOTORCYCLE', ['zone-1'], [{ dayOfWeek: 1, startHour: 8, endHour: 18 }]);
    expect(tech.skills).toContain(TechnicianSkill.FTTH);
    expect(tech.maxDailyCapacity).toBe(4);
  });

  it('should check skill availability', () => {
    const tech = new Technician('t-1', 'person-1', [TechnicianSkill.FTTH], 4, 'CAR', ['zone-1'], []);
    expect(tech.hasSkill(TechnicianSkill.FTTH)).toBe(true);
    expect(tech.hasSkill(TechnicianSkill.HFC)).toBe(false);
  });

  it('should track workload', () => {
    const tech = new Technician('t-1', 'person-1', [TechnicianSkill.FTTH], 4, 'CAR', ['zone-1'], []);
    expect(tech.currentWorkload).toBe(0);
    tech.assignJob();
    expect(tech.currentWorkload).toBe(1);
    tech.completeJob(true);
    expect(tech.currentWorkload).toBe(0);
  });

  it('should reduce rating on failed job', () => {
    const tech = new Technician('t-1', 'person-1', [TechnicianSkill.FTTH], 4, 'CAR', ['zone-1'], []);
    expect(tech.rating).toBe(5.0);
    tech.completeJob(false);
    expect(tech.rating).toBe(4.9);
  });

  it('should check availability by time', () => {
    const tech = new Technician('t-1', 'person-1', [TechnicianSkill.FTTH], 2, 'CAR', ['zone-1'], [
      { dayOfWeek: 1, startHour: 8, endHour: 18 },
      { dayOfWeek: 2, startHour: 8, endHour: 18 },
    ]);
    expect(tech.isAvailable(new Date('2024-01-15T10:00:00'))).toBe(true);
    tech.assignJob();
    tech.assignJob();
    expect(tech.isAvailable(new Date('2024-01-15T10:00:00'))).toBe(false);
  });
});
