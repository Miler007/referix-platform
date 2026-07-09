export class PersonRoleCreated {
  public readonly eventName = 'person_role.created';
  public readonly eventVersion = '1.0.0';
  public readonly timestamp: Date;
  constructor(
    public readonly roleId: string,
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly roleType: string,
  ) { this.timestamp = new Date(); }
}

export class PersonRoleApproved {
  public readonly eventName = 'person_role.approved';
  public readonly eventVersion = '1.0.0';
  public readonly timestamp: Date;
  constructor(
    public readonly roleId: string,
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly roleType: string,
    public readonly approvedBy: string,
  ) { this.timestamp = new Date(); }
}

export class PersonRoleRejected {
  public readonly eventName = 'person_role.rejected';
  public readonly eventVersion = '1.0.0';
  public readonly timestamp: Date;
  constructor(
    public readonly roleId: string,
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly roleType: string,
    public readonly reason: string,
    public readonly rejectedBy: string,
  ) { this.timestamp = new Date(); }
}

export class PersonRoleSuspended {
  public readonly eventName = 'person_role.suspended';
  public readonly eventVersion = '1.0.0';
  public readonly timestamp: Date;
  constructor(
    public readonly roleId: string,
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly roleType: string,
    public readonly reason: string,
  ) { this.timestamp = new Date(); }
}

export class PersonRoleActivated {
  public readonly eventName = 'person_role.activated';
  public readonly eventVersion = '1.0.0';
  public readonly timestamp: Date;
  constructor(
    public readonly roleId: string,
    public readonly tenantId: string,
    public readonly personId: string,
    public readonly roleType: string,
  ) { this.timestamp = new Date(); }
}
