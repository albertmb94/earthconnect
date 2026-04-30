import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export async function sendMagicLink(email: string) {
  if (!supabase) {
    return { data: null, error: null };
  }

  const redirectTo = `${window.location.origin}/en`;
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo }
  });
}

export async function insertLead(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  privacyAccepted: boolean;
  context?: {
    service?: string;
    city?: string;
    country?: string;
    bandwidth?: string;
    estimatedPrice?: string;
  };
}) {
  if (!supabase) {
    return { data: null, error: null };
  }

  return supabase.from('leads').insert({
    first_name: payload.firstName,
    last_name: payload.lastName,
    corporate_email: payload.email,
    phone: payload.phone || null,
    role: payload.role || null,
    privacy_accepted: payload.privacyAccepted,
    requested_service: payload.context?.service,
    requested_city: payload.context?.city,
    requested_country: payload.context?.country,
    requested_bandwidth: payload.context?.bandwidth,
    estimated_price_range: payload.context?.estimatedPrice
  });
}