import { z } from 'zod';

// ================================================================
// BRANDED TYPES — compile-time safety for IDs
// ================================================================

declare const CarrierIdBrand: unique symbol;
export type CarrierId = string & { readonly [CarrierIdBrand]: never };

declare const BuyerRequestIdBrand: unique symbol;
export type BuyerRequestId = string & { readonly [BuyerRequestIdBrand]: never };

declare const ProposalIdBrand: unique symbol;
export type ProposalId = string & { readonly [ProposalIdBrand]: never };

declare const DealIdBrand: unique symbol;
export type DealId = string & { readonly [DealIdBrand]: never };

export function asCarrierId(id: string): CarrierId { return id as CarrierId; }
export function asBuyerRequestId(id: string): BuyerRequestId { return id as BuyerRequestId; }
export function asProposalId(id: string): ProposalId { return id as ProposalId; }
export function asDealId(id: string): DealId { return id as DealId; }

// ================================================================
// ENUMS — Zod schemas for fixed string values
// ================================================================

export const ProposalStatus = z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']);
export type ProposalStatus = z.infer<typeof ProposalStatus>;

export const DealStatus = z.enum(['pending', 'active', 'renewed', 'terminated']);
export type DealStatus = z.infer<typeof DealStatus>;

export const ProposalTier = z.enum(['silver', 'gold', 'platinum']);
export type ProposalTier = z.infer<typeof ProposalTier>;

export const CarrierTier = z.enum(['premium', 'standard', 'basic']);
export type CarrierTier = z.infer<typeof CarrierTier>;

// ================================================================
// DOMAIN SCHEMAS — validation + type inference
// ================================================================

export const proposalOptionSchema = z.object({
  tier: ProposalTier,
  carrier_id: z.string().uuid(),
  monthly_price: z.number().positive('Monthly price must be positive'),
  setup_fee: z.number().min(0).default(0),
  sla_uptime: z.string().optional(),
  sla_latency: z.string().optional(),
  installation_weeks: z.number().int().positive().optional(),
  bandwidth: z.string().optional(),
  notes: z.string().optional(),
  sort_order: z.number().int().default(0),
});
export type ProposalOptionInput = z.input<typeof proposalOptionSchema>;
export type ProposalOptionOutput = z.infer<typeof proposalOptionSchema>;

export const createProposalSchema = z.object({
  buyer_request_id: z.string().uuid(),
  agent_email: z.string().email(),
  title: z.string().min(1, 'Title is required'),
});
export type CreateProposalInput = z.infer<typeof createProposalSchema>;

export const createDealSchema = z.object({
  buyer_request_id: z.string().uuid(),
  proposal_id: z.string().uuid(),
  option_id: z.string().uuid(),
  carrier_id: z.string().uuid(),
  monthly_revenue: z.number().positive(),
  carrier_cost: z.number().positive().optional(),
  commission_rate: z.number().min(0).max(100),
  contract_term_months: z.number().int().positive().default(12),
});
export type CreateDealInput = z.infer<typeof createDealSchema>;

export const sendProposalSchema = z.object({
  proposal_id: z.string().uuid(),
  expires_in_days: z.number().int().positive().default(30),
});
export type SendProposalInput = z.infer<typeof sendProposalSchema>;

// ================================================================
// CARRIER SEARCH FILTERS
// ================================================================

export const carrierSearchSchema = z.object({
  country: z.string().min(1),
  service: z.string().min(1),
  min_commission: z.number().min(0).max(100).optional(),
  tier: CarrierTier.optional(),
});
export type CarrierSearchInput = z.infer<typeof carrierSearchSchema>;
