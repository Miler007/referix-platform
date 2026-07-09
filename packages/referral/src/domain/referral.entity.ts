import { v4 as uuid } from 'uuid';
import { FunnelStatus, ReferralSource, LostReason, DuplicateClassification, ProspectInfo } from './value-objects';

export interface TimelineEntry {
  timestamp: Date;
  event: string;
  description: string;
  actorId: string | null;
  correlationId: string | null;
}

export class Referral {
  private readonly _id: string;
  private _funnelStatus: FunnelStatus;
  private _source: ReferralSource;
  private _campaignId: string | null;
  private _lostReason: LostReason | null;
  private _lostDescription: string | null;
  private _duplicateClassification: DuplicateClassification | null;
  private _duplicateOfReferralId: string | null;
  private _subscriptionId: string | null;
  private _commissionId: string | null;
  private _timeline: TimelineEntry[] = [];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly referrerPersonId: string,
    public readonly prospect: ProspectInfo,
    source: ReferralSource = ReferralSource.DIRECT,
    campaignId: string | null = null,
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._funnelStatus = FunnelStatus.NEW;
    this._source = source;
    this._campaignId = campaignId;
    this._lostReason = null;
    this._lostDescription = null;
    this._duplicateClassification = null;
    this._duplicateOfReferralId = null;
    this._subscriptionId = null;
    this._commissionId = null;
    this._createdAt = new Date();
    this._updatedAt = new Date();
    this.addTimelineEntry('REFERRAL_CREATED', 'Referral registered', null, null);
  }

  get id(): string { return this._id; }
  get funnelStatus(): FunnelStatus { return this._funnelStatus; }
  get source(): ReferralSource { return this._source; }
  get campaignId(): string | null { return this._campaignId; }
  get lostReason(): LostReason | null { return this._lostReason; }
  get lostDescription(): string | null { return this._lostDescription; }
  get duplicateClassification(): DuplicateClassification | null { return this._duplicateClassification; }
  get duplicateOfReferralId(): string | null { return this._duplicateOfReferralId; }
  get subscriptionId(): string | null { return this._subscriptionId; }
  get commissionId(): string | null { return this._commissionId; }
  get timeline(): readonly TimelineEntry[] { return this._timeline; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  contact(actorId: string | null = null): void {
    this.assertFunnelNotTerminal();
    this._funnelStatus = FunnelStatus.CONTACTED;
    this._updatedAt = new Date();
    this.addTimelineEntry('CONTACTED', 'Prospect contacted', actorId, null);
  }

  qualify(actorId: string | null = null): void {
    this.assertFunnelNotTerminal();
    this._funnelStatus = FunnelStatus.QUALIFIED;
    this._updatedAt = new Date();
    this.addTimelineEntry('QUALIFIED', 'Prospect qualified (coverage OK, data complete)', actorId, null);
  }

  startNegotiation(actorId: string | null = null): void {
    this.assertFunnelNotTerminal();
    this._funnelStatus = FunnelStatus.NEGOTIATING;
    this._updatedAt = new Date();
    this.addTimelineEntry('NEGOTIATING', 'Negotiation started', actorId, null);
  }

  win(actorId: string | null = null): void {
    this.assertFunnelNotTerminal();
    this._funnelStatus = FunnelStatus.WON;
    this._updatedAt = new Date();
    this.addTimelineEntry('WON', 'Sale won', actorId, null);
  }

  lose(reason: LostReason, description: string, actorId: string | null = null): void {
    this.assertFunnelNotTerminal();
    this._funnelStatus = FunnelStatus.LOST;
    this._lostReason = reason;
    this._lostDescription = description;
    this._updatedAt = new Date();
    this.addTimelineEntry('LOST', `Lost: ${description} (${reason})`, actorId, null);
  }

  classifyDuplicate(classification: DuplicateClassification, originalReferralId: string | null = null): void {
    this._duplicateClassification = classification;
    this._duplicateOfReferralId = originalReferralId;
  }

  linkSubscription(subscriptionId: string): void {
    this._subscriptionId = subscriptionId;
    this.addTimelineEntry('SUBSCRIPTION_LINKED', `Subscription ${subscriptionId} linked`, null, null);
  }

  linkCommission(commissionId: string): void {
    this._commissionId = commissionId;
    this.addTimelineEntry('COMMISSION_LINKED', `Commission ${commissionId} generated`, null, null);
  }

  private assertFunnelNotTerminal(): void {
    if (this._funnelStatus === FunnelStatus.WON || this._funnelStatus === FunnelStatus.LOST) {
      throw new Error(`Cannot change funnel from terminal status ${this._funnelStatus}`);
    }
  }

  private addTimelineEntry(event: string, description: string, actorId: string | null, correlationId: string | null): void {
    this._timeline.push({ timestamp: new Date(), event, description, actorId, correlationId });
  }
}
