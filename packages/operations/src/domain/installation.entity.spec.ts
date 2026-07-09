import { Installation } from './installation.entity';
import { InstallationStatus, FailureReason } from './value-objects';

describe('Installation', () => {
  it('should create in PENDING_SCHEDULE status', () => {
    const inst = new Installation('t-1', 'ref-1', null, 'Calle 123', { latitude: 19.43, longitude: -99.13 });
    expect(inst.status).toBe(InstallationStatus.PENDING_SCHEDULE);
  });

  it('should transition through full lifecycle', () => {
    const inst = new Installation('t-1', 'ref-1', null, 'Addr', { latitude: 0, longitude: 0 });
    expect(inst.status).toBe(InstallationStatus.PENDING_SCHEDULE);

    inst.schedule(new Date());
    expect(inst.status).toBe(InstallationStatus.SCHEDULED);

    inst.assign('tech-1');
    expect(inst.status).toBe(InstallationStatus.ASSIGNED);
    expect(inst.technicianId).toBe('tech-1');

    inst.startTransit();
    expect(inst.status).toBe(InstallationStatus.IN_TRANSIT);

    inst.startInstallation();
    expect(inst.status).toBe(InstallationStatus.INSTALLING);

    inst.complete({
      photos: [], gpsCheckIn: { latitude: 0, longitude: 0 }, gpsCheckOut: { latitude: 0, longitude: 0 },
      digitalSignature: 'sig', checklistResults: [{ step: 'ONT', required: true, passed: true, notes: null }],
      observations: 'OK', clientName: 'Client', completedAt: new Date(),
    });
    expect(inst.status).toBe(InstallationStatus.COMPLETED);
    expect(inst.slaTimers.totalSla).not.toBeNull();
  });

  it('should record failure with reason', () => {
    const inst = new Installation('t-1', 'ref-1', null, 'Addr', { latitude: 0, longitude: 0 });
    inst.schedule(new Date());
    inst.assign('tech-1');
    inst.startTransit();
    inst.startInstallation();
    inst.fail(FailureReason.CLIENT_ABSENT, 'Cliente no estaba en domicilio');
    expect(inst.status).toBe(InstallationStatus.FAILED);
    expect(inst.failureReason).toBe(FailureReason.CLIENT_ABSENT);
    expect(inst.failureDescription).toBe('Cliente no estaba en domicilio');
  });

  it('should record reschedule history', () => {
    const inst = new Installation('t-1', 'ref-1', null, 'Addr', { latitude: 0, longitude: 0 });
    const d1 = new Date('2024-01-15');
    const d2 = new Date('2024-01-16');
    inst.schedule(d1);
    inst.reschedule(d2, 'Cliente no disponible', 'coord-1');
    expect(inst.rescheduleHistory).toHaveLength(1);
    expect(inst.rescheduleHistory[0].reason).toBe('Cliente no disponible');
    expect(inst.rescheduleHistory[0].changedBy).toBe('coord-1');
  });

  it('should cancel before start', () => {
    const inst = new Installation('t-1', 'ref-1', null, 'Addr', { latitude: 0, longitude: 0 });
    inst.schedule(new Date());
    inst.cancel('Cliente canceló', 'coord-1');
    expect(inst.status).toBe(InstallationStatus.CANCELLED);
  });

  it('should calculate SLA timers', () => {
    const inst = new Installation('t-1', 'ref-1', null, 'Addr', { latitude: 0, longitude: 0 });
    inst.schedule(new Date());
    inst.assign('tech-1');
    expect(inst.slaTimers.assignmentTime).toBeGreaterThanOrEqual(0);
  });

  it('should throw on invalid transitions', () => {
    const inst = new Installation('t-1', 'ref-1', null, 'Addr', { latitude: 0, longitude: 0 });
    expect(() => inst.assign('tech-1')).toThrow();
    expect(() => inst.complete({ photos: [], gpsCheckIn: { latitude: 0, longitude: 0 }, gpsCheckOut: { latitude: 0, longitude: 0 }, digitalSignature: null, checklistResults: [], observations: '', clientName: '', completedAt: new Date() })).toThrow();
  });

  it('should not allow reschedule of completed', () => {
    const inst = new Installation('t-1', 'ref-1', null, 'Addr', { latitude: 0, longitude: 0 });
    inst.schedule(new Date());
    inst.assign('tech-1');
    inst.startTransit();
    inst.startInstallation();
    inst.complete({ photos: [], gpsCheckIn: { latitude: 0, longitude: 0 }, gpsCheckOut: { latitude: 0, longitude: 0 }, digitalSignature: 'sig', checklistResults: [{ step: 'ONT', required: true, passed: true, notes: null }], observations: '', clientName: '', completedAt: new Date() });
    expect(() => inst.reschedule(new Date(), 'test', 'admin')).toThrow();
  });
});
