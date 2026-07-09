/**
 * REF-CERE-002: Customer Experience Recommendation Engine v2
 * 
 * Asesor técnico inteligente. No vende megas — recomienda la mejor experiencia
 * para el cliente durante los próximos años.
 */

export type SupportRisk = 'MUY_BAJO' | 'BAJO' | 'MEDIO' | 'ALTO' | 'MUY_ALTO';
export type DemandLevel = 'BAJA' | 'MEDIA' | 'ALTA' | 'MUY_ALTA';
export type StreamingQuality = 'SD' | 'HD' | 'FULL_HD' | '4K';
export type GamingPlatform = 'PS5' | 'XBOX' | 'NINTENDO' | 'PC_GAMER' | 'NINGUNO';
export type CustomerPriority = 'PRECIO' | 'ESTABILIDAD' | 'VELOCIDAD' | 'GAMING' | 'STREAMING' | 'TRABAJO' | 'EMPRESA';

export interface HouseholdComposition {
  adults: number;
  children: number;
  teens: number;
  elderly: number;
}

export interface DeviceInventory {
  smartphones: number;
  tablets: number;
  smartTvs: number;
  computers: number;
  laptops: number;
  consoles: number;
  ipCameras: number;
  alexaGoogleHome: number;
  decoders: number;
  wifiPrinters: number;
  otherIot: number;
}

export interface SimultaneousUsage {
  smartphones: number;
  smartTvs: number;
  computers: number;
  laptops: number;
  consoles: number;
}

export interface StreamingServices {
  netflix: boolean;
  disneyPlus: boolean;
  primeVideo: boolean;
  max: boolean;
  youtube: boolean;
  iptv: boolean;
  quality: StreamingQuality;
}

export interface RemoteWork {
  people: number;
  usesVpn: boolean;
  videoCalls: boolean;
  platforms: string[];  // zoom, meet, teams
}

export interface Education {
  virtualClasses: boolean;
  university: boolean;
  onlineCourses: boolean;
  students: number;
}

export interface GamingProfile {
  platforms: GamingPlatform[];
  frequentGames: boolean;
  priorityLatency: boolean;
}

export interface CameraProfile {
  count: number;
  records24h: boolean;
  cloudUpload: boolean;
}

export interface BusinessProfile {
  isBusiness: boolean;
  employees: number;
  hasPos: boolean;
  electronicInvoicing: boolean;
  cameras: boolean;
  vpn: boolean;
  servers: boolean;
  clientWifi: boolean;
}

export interface GrowthHorizon {
  moreTvs: boolean;
  cameras: boolean;
  remoteWork: boolean;
  homeBusiness: boolean;
  moreDevices: boolean;
}

export interface CustomerDigitalProfile {
  composition: HouseholdComposition;
  devices: DeviceInventory;
  simultaneous: SimultaneousUsage;
  streaming: StreamingServices;
  remoteWork: RemoteWork;
  education: Education;
  gaming: GamingProfile;
  cameras: CameraProfile;
  business: BusinessProfile;
  growth: GrowthHorizon;
  priority: CustomerPriority;
}

export interface PlanEvaluation {
  planId: string;
  planName: string;
  price: number;
  downloadSpeed: number;
  uploadSpeed: number;
  isSymmetric: boolean;
  technology: string;
  demandScore: number;
  compatibility: number;        // 0-100%
  demandLevel: DemandLevel;
  supportRisk: SupportRisk;
  safetyMargin: number;         // % remaining bandwidth
  estimatedLifeYears: number;   // 1-5
  recommended: boolean;
  reasons: string[];
  warnings: string[];
}

export interface RecommendationV2 {
  recommended: PlanEvaluation;
  alternatives: PlanEvaluation[];
  oversellWarning: string | null;
  explanation: string;
  riskBlocked: boolean;
  blockReason: string | null;
}

export interface ICereV2 {
  buildProfile(data: Partial<CustomerDigitalProfile>): CustomerDigitalProfile;
  calculateDemandScore(profile: CustomerDigitalProfile): number;
  evaluatePlan(profile: CustomerDigitalProfile, plan: any): PlanEvaluation;
  recommend(profile: CustomerDigitalProfile, plans: any[]): RecommendationV2;
  explain(profile: CustomerDigitalProfile, eval: PlanEvaluation): string;
  predictSupportRisk(score: number, planSpeed: number): SupportRisk;
  estimateLifeYears(score: number, planSpeed: number): number;
  learn(feedback: { profile: CustomerDigitalProfile; planSold: string; supportTickets: number; upgraded: boolean }): void;
}
