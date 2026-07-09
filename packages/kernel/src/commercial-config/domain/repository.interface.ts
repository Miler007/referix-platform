import { CommercialProduct } from './commercial-product.entity';
import { ProductPlan } from './product-plan.entity';
import { Promotion, CommissionRule, BusinessRule, IncludedService } from './promotion.entity';

export const COMMERCIAL_PRODUCT_REPO = 'COMMERCIAL_PRODUCT_REPO';
export const PRODUCT_PLAN_REPO = 'PRODUCT_PLAN_REPO';
export const PROMOTION_REPO = 'PROMOTION_REPO';

export interface ICommercialProductRepository {
  save(product: CommercialProduct): Promise<void>;
  findById(tenantId: string, id: string): Promise<CommercialProduct | null>;
  findAll(tenantId: string): Promise<CommercialProduct[]>;
}

export interface IProductPlanRepository {
  save(plan: ProductPlan): Promise<void>;
  findById(tenantId: string, id: string): Promise<ProductPlan | null>;
  findByProduct(tenantId: string, productId: string): Promise<ProductPlan[]>;
  findPublished(tenantId: string): Promise<ProductPlan[]>;
  getVersion(tenantId: string, planId: string, version: number): Promise<ProductPlan | null>;
}

export interface IPromotionRepository {
  save(promotion: Promotion): Promise<void>;
  findById(tenantId: string, id: string): Promise<Promotion | null>;
  findAll(tenantId: string): Promise<Promotion[]>;
}

export interface ICommissionRuleRepository {
  save(rule: CommissionRule): Promise<void>;
  findById(tenantId: string, id: string): Promise<CommissionRule | null>;
  findAll(tenantId: string): Promise<CommissionRule[]>;
}

export interface IBusinessRuleRepository {
  save(rule: BusinessRule): Promise<void>;
  findById(tenantId: string, id: string): Promise<BusinessRule | null>;
  findByCategory(tenantId: string, category: string): Promise<BusinessRule[]>;
}

export interface IIncludedServiceRepository {
  save(service: IncludedService): Promise<void>;
  findById(tenantId: string, id: string): Promise<IncludedService | null>;
  findAll(tenantId: string): Promise<IncludedService[]>;
}
