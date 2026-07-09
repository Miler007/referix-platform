/**
 * REF-SALES-003: Customer Experience Recommendation Engine (CERE)
 * 
 * Interfaz para el motor de recomendación basado en experiencia del cliente.
 * Preparada para implementación actual con reglas y futura integración con IA.
 */

export type HouseholdSize = 1 | 2 | 3 | 4 | 5;
export type DemandLevel = 'BAJA' | 'MEDIA' | 'ALTA' | 'MUY_ALTA';
export type RiskLevel = 'EXCELENTE' | 'BUENO' | 'ACEPTABLE' | 'RIESGOSO' | 'NO_RECOMENDADO';
export type CustomerPriority = 'PRECIO' | 'ESTABILIDAD' | 'VELOCIDAD' | 'WIFI' | 'TRABAJO' | 'GAMING' | 'STREAMING';

export interface DeviceInventory {
  smartphones: number;
  smartTvs: number;
  computers: number;
  laptops: number;
  tablets: number;
  consoles: number;
  ipCameras: number;
  dvrNvr: number;
  wifiPrinters: number;
  smartSpeakers: number;
  iotDevices: number;
}

export interface UsageProfile {
  socialMedia: boolean;
  browsing: boolean;
  music: boolean;
  streamingHD: boolean;
  streaming4K: boolean;
  netflix: boolean;
  disneyPlus: boolean;
  primeVideo: boolean;
  youtube: boolean;
  twitch: boolean;
  remoteWork: boolean;
  virtualClasses: boolean;
  videoCalls: boolean;
  gaming: boolean;
  largeDownloads: boolean;
  cloudBackups: boolean;
  securityCameras: boolean;
}

export interface CustomerDigitalProfile {
  householdSize: HouseholdSize;
  devices: DeviceInventory;
  usage: UsageProfile;
  simultaneity: number;       // concurrent users
  priority: CustomerPriority;
  previousClient: boolean;
  previousPlan?: string;
  previousCancellations?: number;
  previousSupportTickets?: number;
}

export interface PlanCompatibility {
  planId: string;
  planName: string;
  price: number;
  downloadSpeed: number;
  uploadSpeed: number;
  isSymmetric: boolean;
  compatibility: number;       // 0-100%
  demandIndex: DemandLevel;
  riskLevel: RiskLevel;
  demandPercent: number;       // estimated bandwidth usage %
  recommended: boolean;
}

export interface RecommendationResult {
  recommended: PlanCompatibility;
  alternatives: PlanCompatibility[];
  explanation: string;
  warnings: string[];
  nextBestAction?: string;
}

export interface ICustomerExperienceRecommendationEngine {
  buildProfile(data: Partial<CustomerDigitalProfile>): CustomerDigitalProfile;
  calculateDemandIndex(profile: CustomerDigitalProfile, planSpeed: number): { percent: number; level: DemandLevel };
  calculateCompatibility(profile: CustomerDigitalProfile, plan: { downloadSpeed: number; uploadSpeed: number; price: number; isSymmetric: boolean }): number;
  recommend(profile: CustomerDigitalProfile, availablePlans: any[]): RecommendationResult;
  explain(profile: CustomerDigitalProfile, plan: PlanCompatibility): string;
  predictSupportRisk(profile: CustomerDigitalProfile, planSpeed: number): 'BAJO' | 'MEDIO' | 'ALTO';
  predictUpgradeNeed(profile: CustomerDigitalProfile, planSpeed: number): number;
}
