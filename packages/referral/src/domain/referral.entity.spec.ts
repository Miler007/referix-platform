import { Referral } from './referral.entity';
import { FunnelStatus, ReferralSource, LostReason, DuplicateClassification, ProspectInfo } from './value-objects';

function makeProspect(): ProspectInfo {
  return new ProspectInfo('Carlos López', '+521234567890', 'carlos@email.com', 'Calle 456', 19.43, -99.13);
}

describe('Referral', () => {
  it('should create in NEW funnel status', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect());
    expect(ref.funnelStatus).toBe(FunnelStatus.NEW);
    expect(ref.source).toBe(ReferralSource.DIRECT);
  });

  it('should accept custom source and campaign', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect(), ReferralSource.FACEBOOK, 'camp-1');
    expect(ref.source).toBe(ReferralSource.FACEBOOK);
    expect(ref.campaignId).toBe('camp-1');
  });

  it('should transition through funnel stages', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect());
    expect(ref.funnelStatus).toBe(FunnelStatus.NEW);

    ref.contact();
    expect(ref.funnelStatus).toBe(FunnelStatus.CONTACTED);

    ref.qualify();
    expect(ref.funnelStatus).toBe(FunnelStatus.QUALIFIED);

    ref.startNegotiation();
    expect(ref.funnelStatus).toBe(FunnelStatus.NEGOTIATING);

    ref.win();
    expect(ref.funnelStatus).toBe(FunnelStatus.WON);
  });

  it('should record lost reason', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect());
    ref.contact();
    ref.lose(LostReason.CLIENT_REJECTED_PRICE, 'Muy caro');
    expect(ref.funnelStatus).toBe(FunnelStatus.LOST);
    expect(ref.lostReason).toBe(LostReason.CLIENT_REJECTED_PRICE);
    expect(ref.lostDescription).toBe('Muy caro');
  });

  it('should throw on transition from terminal WON', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect());
    ref.win();
    expect(() => ref.contact()).toThrow();
    expect(() => ref.lose(LostReason.OTHER, 'test')).toThrow();
  });

  it('should throw on transition from terminal LOST', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect());
    ref.lose(LostReason.COVERAGE_FAILED, 'No coverage');
    expect(() => ref.qualify()).toThrow();
  });

  it('should support duplicate classification', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect());
    ref.classifyDuplicate(DuplicateClassification.EXACT, 'original-1');
    expect(ref.duplicateClassification).toBe(DuplicateClassification.EXACT);
    expect(ref.duplicateOfReferralId).toBe('original-1');
  });

  it('should link subscription and commission', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect());
    ref.linkSubscription('sub-1');
    expect(ref.subscriptionId).toBe('sub-1');
    ref.linkCommission('comm-1');
    expect(ref.commissionId).toBe('comm-1');
  });

  it('should have timeline entries for each transition', () => {
    const ref = new Referral('t-1', 'referrer-1', makeProspect());
    ref.contact('actor-1');
    ref.qualify('actor-1');
    expect(ref.timeline.length).toBe(3); // created + contacted + qualified
    expect(ref.timeline[1].event).toBe('CONTACTED');
    expect(ref.timeline[1].actorId).toBe('actor-1');
  });
});
