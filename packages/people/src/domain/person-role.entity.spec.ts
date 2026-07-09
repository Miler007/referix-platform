import { PersonRole } from './person-role.entity';
import { PersonRoleStatus } from './value-objects';

describe('PersonRole', () => {
  it('should create in REGISTERED status', () => {
    const role = new PersonRole('t-1', 'person-1', 'REFERIDOR');
    expect(role.status).toBe(PersonRoleStatus.REGISTERED);
    expect(role.roleType).toBe('REFERIDOR');
  });

  it('should transition to PENDING_APPROVAL on request()', () => {
    const role = new PersonRole('t-1', 'person-1', 'REFERIDOR');
    role.request();
    expect(role.status).toBe(PersonRoleStatus.PENDING_APPROVAL);
    expect(role.events[0].eventName).toBe('person_role.created');
  });

  it('should transition to ACTIVE on approve', () => {
    const role = new PersonRole('t-1', 'person-1', 'REFERIDOR');
    role.request();
    role.approve('supervisor-1');
    expect(role.status).toBe(PersonRoleStatus.ACTIVE);
    expect(role.approvedBy).toBe('supervisor-1');
    expect(role.approvedAt).not.toBeNull();
  });

  it('should transition to REJECTED on reject', () => {
    const role = new PersonRole('t-1', 'person-1', 'REFERIDOR');
    role.request();
    role.reject('Invalid document', 'supervisor-1');
    expect(role.status).toBe(PersonRoleStatus.REJECTED);
    expect(role.rejectionReason).toBe('Invalid document');
  });

  it('should throw on approve without request', () => {
    const role = new PersonRole('t-1', 'person-1', 'REFERIDOR');
    expect(() => role.approve('supervisor-1')).toThrow();
  });

  it('should throw on double approve', () => {
    const role = new PersonRole('t-1', 'person-1', 'REFERIDOR');
    role.request();
    role.approve('supervisor-1');
    expect(() => role.approve('supervisor-2')).toThrow();
  });

  it('should support full lifecycle REGISTERED → PENDING → ACTIVE', () => {
    const role = new PersonRole('t-1', 'person-1', 'INSTALLER');
    expect(role.status).toBe(PersonRoleStatus.REGISTERED);
    role.request();
    expect(role.status).toBe(PersonRoleStatus.PENDING_APPROVAL);
    role.approve('supervisor-1');
    expect(role.status).toBe(PersonRoleStatus.ACTIVE);
  });

  it('should support REGISTERED → PENDING → REJECTED', () => {
    const role = new PersonRole('t-1', 'person-1', 'REFERIDOR');
    role.request();
    role.reject('Duplicate', 'admin');
    expect(role.status).toBe(PersonRoleStatus.REJECTED);
  });

  it('should support suspend and reactivate cycle', () => {
    const role = new PersonRole('t-1', 'person-1', 'INSTALLER');
    role.request();
    role.approve('supervisor-1');
    role.suspend('Performance issues');
    expect(role.status).toBe(PersonRoleStatus.SUSPENDED);
    role.activate();
    expect(role.status).toBe(PersonRoleStatus.ACTIVE);
  });

  it('should clear events after pull', () => {
    const role = new PersonRole('t-1', 'person-1', 'REFERIDOR');
    role.request();
    expect(role.events.length).toBeGreaterThan(0);
    role.pullEvents();
    expect(role.events).toHaveLength(0);
  });
});
