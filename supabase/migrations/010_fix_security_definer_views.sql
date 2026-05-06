-- ==========================================================
-- MIGRATION 010: Fix SECURITY DEFINER views
-- ==========================================================
-- Supabase linter flagged four views using SECURITY DEFINER (default)
-- instead of SECURITY INVOKER — they bypass RLS on the underlying tables,
-- allowing anon clients to read data regardless of row-level policies.
--
-- NOTE: spatial_ref_sys (PostGIS system table) is owned by the postgres
-- superuser and cannot be altered via user migrations. That warning must
-- be suppressed or handled at the Supabase project level.
-- ==========================================================

-- ── 1. Recreate views with security_invoker = true ──────────────
-- This makes each view execute with the caller's permissions,
-- so RLS policies on the underlying tables are respected.

-- agent_commission_dashboard
CREATE OR REPLACE VIEW public.agent_commission_dashboard
  WITH (security_invoker = true)
AS
SELECT
  c.company_name,
  c.commission_rate,
  COUNT(d.id) AS active_deals,
  COALESCE(SUM(d.monthly_commission), 0) AS total_monthly_commission,
  COALESCE(SUM(d.monthly_commission * 12), 0) AS projected_annual_commission,
  COALESCE(SUM(d.monthly_revenue), 0) AS total_monthly_revenue
FROM public.carriers c
LEFT JOIN public.deals d ON d.carrier_id = c.id AND d.status = 'active'
WHERE c.active = true
GROUP BY c.company_name, c.commission_rate
ORDER BY total_monthly_commission DESC;

-- admin_carrier_stats
CREATE OR REPLACE VIEW public.admin_carrier_stats
  WITH (security_invoker = true)
AS
SELECT
  c.id AS carrier_id,
  c.company_name,
  c.contact_email,
  c.tier,
  c.verified,
  c.active,
  COALESCE(q_stats.avg_monthly_price, 0) AS avg_monthly_price,
  COALESCE(q_stats.total_quotes, 0) AS total_quotes,
  COALESCE(q_stats.last_quote_at, null) AS last_quote_at
FROM public.carriers c
LEFT JOIN (
  SELECT
    q.carrier_id,
    AVG(q.monthly_price) AS avg_monthly_price,
    COUNT(*) AS total_quotes,
    MAX(q.submitted_at) AS last_quote_at
  FROM public.quotes q
  WHERE q.opportunity_id IS NULL
  GROUP BY q.carrier_id
) q_stats ON q_stats.carrier_id::text = c.id::text;

COMMENT ON VIEW public.admin_carrier_stats IS 'Aggregated carrier performance for admin assignment suggestions';

-- admin_stats
DROP VIEW IF EXISTS public.admin_stats;
CREATE VIEW public.admin_stats
  WITH (security_invoker = true)
AS
SELECT
  (SELECT COUNT(*)::INTEGER FROM public.node_services) AS total_nodes,
  (SELECT COUNT(DISTINCT city)::INTEGER FROM public.node_services) AS cities_covered,
  (SELECT COUNT(*)::INTEGER FROM public.quotes) AS provider_bids,
  (SELECT COUNT(*)::INTEGER FROM public.leads) AS total_leads,
  (SELECT COUNT(*)::INTEGER FROM public.buyer_requests WHERE status = 'pending') AS pending_requests,
  (SELECT COUNT(*)::INTEGER FROM public.carriers WHERE active = true) AS total_carriers,
  (SELECT COUNT(*)::INTEGER FROM public.buyer_requests WHERE status = 'quoted') AS quoted_requests,
  (SELECT COUNT(*)::INTEGER FROM public.deals WHERE status = 'active') AS active_deals,
  (SELECT COALESCE(SUM(monthly_commission), 0)::NUMERIC(10,2) FROM public.deals WHERE status = 'active') AS monthly_commission_total,
  (SELECT COUNT(*)::INTEGER FROM public.proposals WHERE status IN ('draft','sent')) AS active_proposals;

COMMENT ON VIEW public.admin_stats IS 'Admin dashboard aggregated statistics';

-- agent_pipeline
CREATE OR REPLACE VIEW public.agent_pipeline
  WITH (security_invoker = true)
AS
SELECT
  br.id AS request_id,
  br.buyer_email,
  br.service,
  br.city,
  br.country,
  br.bandwidth,
  br.estimated_budget,
  br.deadline,
  br.notes,
  br.priority,
  br.status AS request_status,
  p.id AS proposal_id,
  p.status AS proposal_status,
  p.title AS proposal_title,
  p.sent_at AS proposal_sent_at,
  COUNT(po.id) AS option_count
FROM public.buyer_requests br
LEFT JOIN public.proposals p ON p.buyer_request_id = br.id
LEFT JOIN public.proposal_options po ON po.proposal_id = p.id
GROUP BY br.id, br.buyer_email, br.service, br.city, br.country,
         br.bandwidth, br.estimated_budget, br.deadline, br.notes,
         br.priority, br.status, p.id, p.status, p.title, p.sent_at
ORDER BY br.created_at DESC;

