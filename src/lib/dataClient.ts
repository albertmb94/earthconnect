import { supabase, hasSupabaseConfig } from './supabaseClient';
import { supabaseClientMock, ServiceInsights, CoverageService } from './supabase';

// ------------------------------------------------------------------
// UNIFIED DATA CLIENT
// ALL write operations go to REAL Supabase. No mock fallback.
// Read operations may use mock fallback only for public insights.
// ------------------------------------------------------------------

// ================================================================
// INTERFACES
// ================================================================

export interface BuyerRequest {
  id: string;
  lead_id: string | null;
  buyer_email: string;
  service: string;
  city: string;
  country: string;
  bandwidth: string | null;
  estimated_budget: string | null;
  deadline: string | null;
  notes: string | null;
  priority: string;
  status: 'pending' | 'quoted' | 'in_progress' | 'completed';
  quotes_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBuyerRequestPayload {
  buyer_email: string;
  service: string;
  city: string;
  country: string;
  bandwidth?: string | null;
  estimated_budget?: string | null;
  deadline?: string | null;
  notes?: string | null;
  priority?: string;
}

export interface Carrier {
  id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string | null;
  tier: 'premium' | 'standard' | 'basic';
  verified: boolean;
  active: boolean;
  commission_rate: number;
  agreement_type: string;
  created_at: string;
  updated_at: string;
}

export interface CarrierCoverage {
  id: string;
  carrier_id: string;
  country: string;
  region: string | null;
  service: string;
  active: boolean;
  created_at: string;
}

export interface RequestAssignment {
  id: string;
  buyer_request_id: string;
  carrier_id: string;
  assigned_by: string | null;
  status: 'invited' | 'viewed' | 'quoted' | 'expired' | 'declined';
  notes: string | null;
  created_at: string;
  updated_at: string;
  quoted_at: string | null;
}

export interface AssignedRequest {
  assignment_id: string;
  assignment_status: string;
  request_id: string;
  buyer_email: string;
  service: string;
  city: string;
  country: string;
  bandwidth: string | null;
  estimated_budget: string | null;
  deadline: string | null;
  notes: string | null;
  request_status: string;
  quotes_count: number;
  created_at: string;
}

export interface QuotePayload {
  buyer_request_id?: string | null;
  opportunity_id?: string | null;
  carrier_id: string;
  monthly_price?: number;
  setup_fee?: number;
  sla_uptime?: string;
  sla_latency?: string;
  installation_weeks?: number;
  notes?: string;
}

export interface QuoteWithCarrier {
  quote_id: string;
  carrier_id: string;
  company_name: string;
  contact_email: string;
  monthly_price: number | null;
  setup_fee: number | null;
  sla_uptime: string | null;
  sla_latency: string | null;
  installation_weeks: number | null;
  notes: string | null;
  submitted_at: string;
}

export interface AdminStats {
  total_nodes: number;
  cities_covered: number;
  provider_bids: number;
  total_leads: number;
  pending_requests: number;
  total_carriers: number;
  quoted_requests: number;
  active_deals: number;
  monthly_commission_total: number;
  active_proposals: number;
}

export interface LeadRecord {
  id: string;
  first_name: string;
  last_name: string;
  corporate_email: string;
  role: string | null;
  phone: string | null;
  requested_service: string | null;
  requested_city: string | null;
  requested_country: string | null;
  estimated_price_range: string | null;
  created_at: string;
}

export interface NodeImportRow {
  requested_tech: string;
  requested_country: string;
  city: string;
  provider_id: string;
  price_monthly: number;
  currency?: string;
  bandwidth_mbps?: number;
  lat: number;
  lng: number;
}

// ================================================================
// HELPERS
// ================================================================

const useReal = hasSupabaseConfig;

function ensureSupabase() {
  if (!useReal || !supabase) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

// ================================================================
// DATA CLIENT
// ================================================================

export const dataClient = {
  // ================================================================
  // BUYER PORTAL
  // ================================================================

  async createBuyerRequest(payload: CreateBuyerRequestPayload): Promise<{ data: BuyerRequest | null; error: any }> {
    const client = ensureSupabase();
    const { data, error } = await client
      .from('buyer_requests')
      .insert({
        buyer_email: payload.buyer_email,
        service: payload.service,
        city: payload.city,
        country: payload.country,
        bandwidth: payload.bandwidth || null,
        estimated_budget: payload.estimated_budget || null,
        deadline: payload.deadline || null,
        notes: payload.notes || null,
        priority: payload.priority || 'normal',
        status: 'pending',
        quotes_count: 0,
      })
      .select()
      .single();
    return { data: data as BuyerRequest | null, error };
  },

  async getBuyerRequests(email: string): Promise<BuyerRequest[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('buyer_requests')
      .select('*')
      .eq('buyer_email', email)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getBuyerRequests error:', error);
      return [];
    }
    return (data || []) as BuyerRequest[];
  },

  async getBuyerRequestById(id: string): Promise<BuyerRequest | null> {
    if (!useReal || !supabase) return null;
    const { data, error } = await supabase
      .from('buyer_requests')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('getBuyerRequestById error:', error);
      return null;
    }
    return data as BuyerRequest | null;
  },

  async getQuotesForRequest(requestId: string): Promise<QuoteWithCarrier[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .rpc('get_quotes_for_request', { req_id: requestId });
    if (error) {
      console.error('getQuotesForRequest error:', error);
      return [];
    }
    return (data || []) as QuoteWithCarrier[];
  },

  async acceptQuoteAndProgressRequest(_quoteId: string, requestId: string): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    // Update request status to in_progress
    const { error: reqError } = await client
      .from('buyer_requests')
      .update({ status: 'in_progress' })
      .eq('id', requestId);
    if (reqError) {
      console.error('acceptQuote request update error:', reqError);
      return { success: false, error: reqError };
    }
    // Optionally update quote status to accepted (if we add that column later)
    return { success: true };
  },

  // ================================================================
  // CARRIER PORTAL
  // ================================================================

  async getCarrierByEmail(email: string): Promise<Carrier | null> {
    if (!useReal || !supabase) return null;
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .eq('contact_email', email)
      .single();
    if (error) {
      console.error('getCarrierByEmail error:', error);
      return null;
    }
    return data as Carrier | null;
  },

  async getAssignedRequests(carrierEmail: string): Promise<AssignedRequest[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .rpc('get_carrier_assignments', { carrier_email: carrierEmail });
    if (error) {
      console.error('getAssignedRequests error:', error);
      return [];
    }
    return (data || []) as AssignedRequest[];
  },

  async submitQuote(payload: QuotePayload): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const { error } = await client.from('quotes').insert({
      opportunity_id: payload.opportunity_id || null,
      buyer_request_id: payload.buyer_request_id || null,
      carrier_id: payload.carrier_id,
      monthly_price: payload.monthly_price || null,
      setup_fee: payload.setup_fee || null,
      sla_uptime: payload.sla_uptime || null,
      sla_latency: payload.sla_latency || null,
      installation_weeks: payload.installation_weeks || null,
      notes: payload.notes || null,
      status: 'submitted',
    });
    if (error) {
      console.error('submitQuote error:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async markAssignmentQuoted(assignmentId: string): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const { error } = await client
      .from('request_assignments')
      .update({ status: 'quoted', quoted_at: new Date().toISOString() })
      .eq('id', assignmentId);
    if (error) {
      console.error('markAssignmentQuoted error:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async markAssignmentViewed(assignmentId: string): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const { error } = await client
      .from('request_assignments')
      .update({ status: 'viewed' })
      .eq('id', assignmentId)
      .eq('status', 'invited'); // only if still invited
    if (error) {
      console.error('markAssignmentViewed error:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  // ================================================================
  // ADMIN PORTAL: CARRIERS
  // ================================================================

  async getCarriers(): Promise<Carrier[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .order('company_name', { ascending: true });
    if (error) {
      console.error('getCarriers error:', error);
      return [];
    }
    return (data || []) as Carrier[];
  },

  async createCarrier(payload: Omit<Carrier, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Carrier | null; error: any }> {
    const client = ensureSupabase();
    const { data, error } = await client
      .from('carriers')
      .insert(payload)
      .select()
      .single();
    return { data: data as Carrier | null, error };
  },

  async updateCarrier(id: string, payload: Partial<Carrier>): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const { error } = await client
      .from('carriers')
      .update(payload)
      .eq('id', id);
    if (error) return { success: false, error };
    return { success: true };
  },

  async getCarrierCoverage(carrierId: string): Promise<CarrierCoverage[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('carrier_coverage')
      .select('*')
      .eq('carrier_id', carrierId)
      .order('country', { ascending: true });
    if (error) {
      console.error('getCarrierCoverage error:', error);
      return [];
    }
    return (data || []) as CarrierCoverage[];
  },

  async addCarrierCoverage(payload: Omit<CarrierCoverage, 'id' | 'created_at'>): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const { error } = await client
      .from('carrier_coverage')
      .insert(payload);
    if (error) return { success: false, error };
    return { success: true };
  },

  async removeCarrierCoverage(coverageId: string): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const { error } = await client
      .from('carrier_coverage')
      .delete()
      .eq('id', coverageId);
    if (error) return { success: false, error };
    return { success: true };
  },

  // ================================================================
  // ADMIN PORTAL: REQUESTS + ASSIGNMENTS
  // ================================================================

  async getPendingRequests(): Promise<BuyerRequest[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('buyer_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getPendingRequests error:', error);
      return [];
    }
    return (data || []) as BuyerRequest[];
  },

  async getAllBuyerRequests(): Promise<BuyerRequest[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('buyer_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getAllBuyerRequests error:', error);
      return [];
    }
    return (data || []) as BuyerRequest[];
  },

  async suggestCarriers(requestId: string): Promise<any[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .rpc('suggest_carriers_for_request', { request_id: requestId });
    if (error) {
      console.error('suggestCarriers error:', error);
      return [];
    }
    return (data || []) as any[];
  },

  async assignCarriersToRequest(buyerRequestId: string, carrierIds: string[], assignedBy?: string): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const rows = carrierIds.map(carrierId => ({
      buyer_request_id: buyerRequestId,
      carrier_id: carrierId,
      assigned_by: assignedBy || null,
      status: 'invited',
    }));
    const { error } = await client
      .from('request_assignments')
      .insert(rows);
    if (error) {
      console.error('assignCarriersToRequest error:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async getRequestAssignments(requestId: string): Promise<RequestAssignment[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('request_assignments')
      .select('*, carriers(company_name)')
      .eq('buyer_request_id', requestId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getRequestAssignments error:', error);
      return [];
    }
    return (data || []) as RequestAssignment[];
  },

  // ================================================================
  // ADMIN PORTAL: QUOTES
  // ================================================================

  async getAllQuotes(): Promise<any[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('quotes')
      .select('*, carriers(company_name, contact_email), buyer_requests(service, city, country)')
      .order('submitted_at', { ascending: false })
      .limit(200);
    if (error) {
      console.error('getAllQuotes error:', error);
      return [];
    }
    return (data || []) as any[];
  },

  // ================================================================
  // MASTER AGENT: PROPOSALS + DEALS + COMMISSIONS
  // ================================================================

  async searchCarrierPartners(country: string, service: string): Promise<Carrier[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('carrier_coverage')
      .select('carrier_id')
      .eq('country', country)
      .eq('service', service)
      .eq('active', true);
    if (error || !data?.length) return [];
    const carrierIds = [...new Set(data.map((d: any) => d.carrier_id))];
    const { data: carriers } = await supabase
      .from('carriers')
      .select('*')
      .in('id', carrierIds)
      .eq('active', true)
      .order('commission_rate', { ascending: false });
    return (carriers || []) as Carrier[];
  },

  async createProposal(payload: { buyer_request_id: string; agent_email: string; title: string }): Promise<{ data: any; error: any }> {
    const client = ensureSupabase();
    const { data, error } = await client
      .from('proposals')
      .insert(payload)
      .select()
      .single();
    return { data, error };
  },

  async addProposalOption(payload: { proposal_id: string; tier: string; carrier_id: string; monthly_price: number; setup_fee?: number; sla_uptime?: string; sla_latency?: string; installation_weeks?: number; bandwidth?: string; notes?: string; sort_order?: number }): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const { error } = await client.from('proposal_options').insert(payload);
    if (error) return { success: false, error };
    return { success: true };
  },

  async removeAllProposalOptions(proposalId: string): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const { error } = await client.from('proposal_options').delete().eq('proposal_id', proposalId);
    if (error) return { success: false, error };
    return { success: true };
  },

  async sendProposal(proposalId: string, expiresInDays = 30): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    const { error } = await client
      .from('proposals')
      .update({ status: 'sent', sent_at: new Date().toISOString(), expires_at: expiresAt.toISOString() })
      .eq('id', proposalId);
    if (error) return { success: false, error };
    return { success: true };
  },

  async getAllProposals(): Promise<any[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('proposals')
      .select('*, proposal_options(count)')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((p: any) => ({
      ...p,
      option_count: p.proposal_options?.[0]?.count || 0,
    }));
  },

  async getProposalOptionsForRequest(requestId: string): Promise<any[]> {
    if (!useReal || !supabase) return [];
    // First find the proposal for this request
    const { data: proposals } = await supabase
      .from('proposals')
      .select('id')
      .eq('buyer_request_id', requestId)
      .order('created_at', { ascending: false })
      .limit(1);
    if (!proposals?.length) return [];

    const { data, error } = await supabase
      .from('proposal_options')
      .select('*, carriers(company_name, commission_rate)')
      .eq('proposal_id', proposals[0].id)
      .order('sort_order', { ascending: true });
    if (error) return [];
    return (data || []).map((opt: any) => ({
      ...opt,
      carrier_name: opt.carriers?.company_name || 'Unknown',
      commission_rate: opt.carriers?.commission_rate || 15,
    }));
  },

  async createDeal(payload: { buyer_request_id: string; proposal_id: string; option_id: string; carrier_id: string; monthly_revenue: number; commission_rate: number; contract_term_months?: number; carrier_cost?: number }): Promise<{ success: boolean; error?: any }> {
    const client = ensureSupabase();
    // Find the proposal_id from the option
    let proposalId = payload.proposal_id;
    if (!proposalId) {
      const { data: opt } = await client.from('proposal_options').select('proposal_id').eq('id', payload.option_id).single();
      proposalId = opt?.proposal_id || '';
    }
    const { error } = await client.from('deals').insert({
      buyer_request_id: payload.buyer_request_id,
      proposal_id: proposalId,
      carrier_id: payload.carrier_id,
      monthly_revenue: payload.monthly_revenue,
      carrier_cost: payload.carrier_cost || null,
      commission_rate: payload.commission_rate,
      contract_term_months: payload.contract_term_months || 12,
      status: 'active',
      signed_at: new Date().toISOString(),
    });
    if (error) return { success: false, error };
    // Mark the buyer request as in_progress
    await client.from('buyer_requests').update({ status: 'in_progress' }).eq('id', payload.buyer_request_id);
    return { success: true };
  },

  async getCommissionDashboard(): Promise<any[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('agent_commission_dashboard')
      .select('*');
    if (error) return [];
    return (data || []) as any[];
  },

  // ================================================================
  // ADMIN PORTAL: STATS + LEADS
  // ================================================================

  async getAdminStats(): Promise<AdminStats> {
    if (!useReal || !supabase) {
      return { total_nodes: 0, cities_covered: 0, provider_bids: 0, total_leads: 0, pending_requests: 0, total_carriers: 0, quoted_requests: 0, active_deals: 0, monthly_commission_total: 0, active_proposals: 0 };
    }
    const { data, error } = await supabase
      .from('admin_stats')
      .select('*')
      .single();
    if (error) {
      console.error('getAdminStats error:', error);
      return { total_nodes: 0, cities_covered: 0, provider_bids: 0, total_leads: 0, pending_requests: 0, total_carriers: 0, quoted_requests: 0, active_deals: 0, monthly_commission_total: 0, active_proposals: 0 };
    }
    return (data || {}) as AdminStats;
  },

  async getRecentLeads(limit = 50): Promise<LeadRecord[]> {
    if (!useReal || !supabase) return [];
    const { data, error } = await supabase
      .from('leads')
      .select('id, first_name, last_name, corporate_email, role, phone, requested_service, requested_city, requested_country, estimated_price_range, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('getRecentLeads error:', error);
      return [];
    }
    return (data || []) as LeadRecord[];
  },

  async insertNodeBulk(rows: NodeImportRow[]): Promise<{ success: number; failed: number; error?: any }> {
    if (!useReal || !supabase) {
      return { success: 0, failed: rows.length, error: new Error('Supabase not configured') };
    }
    const formatted = rows.map(r => ({
      requested_tech: r.requested_tech,
      requested_country: r.requested_country,
      city: r.city,
      provider_id: r.provider_id,
      price_monthly: r.price_monthly,
      currency: r.currency || 'USD',
      bandwidth_mbps: r.bandwidth_mbps || 100,
      location: `POINT(${r.lng} ${r.lat})`,
    }));

    let success = 0;
    let failed = 0;
    const batchSize = 100;
    for (let i = 0; i < formatted.length; i += batchSize) {
      const batch = formatted.slice(i, i + batchSize);
      const { error } = await supabase.from('node_services').insert(batch);
      if (error) {
        console.error('insertNodeBulk batch error:', error);
        failed += batch.length;
      } else {
        success += batch.length;
      }
    }
    return { success, failed };
  },

  // ================================================================
  // PUBLIC / MARKETING (may use mock fallback for offline dev)
  // ================================================================

  async getServiceInsights(lat: number, lng: number, tech: string): Promise<{ data: ServiceInsights[]; error: any }> {
    if (useReal && supabase) {
      const { data, error } = await supabase.rpc('get_service_insights', {
        in_lat: lat,
        in_lng: lng,
        in_tech: tech,
      });
      return { data: data || [], error };
    }
    return supabaseClientMock.rpc('get_service_insights', { in_lat: lat, in_lng: lng, in_tech: tech });
  },

  async queryCoverage(country: string, service: string): Promise<{ data: CoverageService[]; error: any }> {
    if (useReal && supabase) {
      const { data, error } = await supabase
        .from('coverage_services')
        .select('*')
        .eq('country', country)
        .eq('service', service);
      return { data: data || [], error };
    }
    return supabaseClientMock.queryCoverage(country, service);
  },
};
