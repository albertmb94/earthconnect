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
  // ADMIN PORTAL: STATS + LEADS
  // ================================================================

  async getAdminStats(): Promise<AdminStats> {
    if (!useReal || !supabase) {
      return { total_nodes: 0, cities_covered: 0, provider_bids: 0, total_leads: 0, pending_requests: 0, total_carriers: 0, quoted_requests: 0 };
    }
    const { data, error } = await supabase
      .from('admin_stats')
      .select('*')
      .single();
    if (error) {
      console.error('getAdminStats error:', error);
      return { total_nodes: 0, cities_covered: 0, provider_bids: 0, total_leads: 0, pending_requests: 0, total_carriers: 0, quoted_requests: 0 };
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
