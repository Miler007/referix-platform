export enum PlanStatus { DRAFT = 'DRAFT', REVIEW = 'REVIEW', PUBLISHED = 'PUBLISHED', ARCHIVED = 'ARCHIVED' }
export enum PromotionType { FREE_MONTH = 'FREE_MONTH', FREE_INSTALL = 'FREE_INSTALL', FREE_EQUIPMENT = 'FREE_EQUIPMENT', DISCOUNT = 'DISCOUNT', DOUBLE_SPEED = 'DOUBLE_SPEED', CUSTOM = 'CUSTOM' }
export enum CommissionType { FIXED = 'FIXED', PERCENTAGE = 'PERCENTAGE', TIERED = 'TIERED', MUNICIPALITY = 'MUNICIPALITY', PLAN_BASED = 'PLAN_BASED' }
export enum RuleCategory { MIGRATION = 'MIGRATION', DOWNGRADE = 'DOWNGRADE', MINIMUM_TERM = 'MINIMUM_TERM', PERMANENCE = 'PERMANENCE', RECONNECTION = 'RECONNECTION', DOCUMENTS = 'DOCUMENTS', OTHER = 'OTHER' }

export interface PlanSpecs {
  downloadSpeed?: string;
  uploadSpeed?: string;
  symmetric?: boolean;
  technology?: string;
  [key: string]: unknown;
}

export interface InternalCosts {
  installation: number;
  equipment: number;
  monthly: number;
  support: number;
}

export interface PlanSla {
  maxInstallationHours: number;
  availability: number;
  responseTimeHours: number;
  repairTimeHours: number;
}
