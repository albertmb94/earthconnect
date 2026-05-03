-- ============================================
-- MIGRATION 006: Admin RPC Functions
-- ============================================

-- Función RPC: sugerir carriers para un buyer request
-- Basado en cobertura geográfica + servicio + stats históricas
CREATE OR REPLACE FUNCTION public.suggest_carriers_for_request(request_id UUID)
RETURNS TABLE(
  carrier_id UUID,
  company_name TEXT,
  contact_email TEXT,
  tier TEXT,
  avg_response_hours NUMERIC,
  avg_monthly_price NUMERIC,
  total_quotes BIGINT,
  last_quote_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  WITH req AS (
    SELECT br.country, br.service
    FROM public.buyer_requests br
    WHERE br.id = request_id
  ),
  coverage_match AS (
    SELECT cc.carrier_id, cc.country, cc.service
    FROM public.carrier_coverage cc
    JOIN req ON req.country = cc.country AND req.service = cc.service
    WHERE cc.active = true
  ),
  stats AS (
    SELECT
      q.carrier_id,
      AVG(EXTRACT(EPOCH FROM (q.submitted_at - ra.created_at)) / 3600) AS avg_response_hours,
      AVG(q.monthly_price) AS avg_monthly_price,
      COUNT(*)::BIGINT AS total_quotes,
      MAX(q.submitted_at) AS last_quote_at
    FROM public.quotes q
    LEFT JOIN public.request_assignments ra 
      ON ra.carrier_id = q.carrier_id AND ra.buyer_request_id = q.buyer_request_id
    GROUP BY q.carrier_id
  )
  SELECT
    c.id AS carrier_id,
    c.company_name,
    c.contact_email,
    c.tier,
    COALESCE(s.avg_response_hours, 0)::NUMERIC,
    COALESCE(s.avg_monthly_price, 0)::NUMERIC,
    COALESCE(s.total_quotes, 0)::BIGINT,
    s.last_quote_at
  FROM public.carriers c
  JOIN coverage_match cm ON cm.carrier_id = c.id
  LEFT JOIN stats s ON s.carrier_id = c.id
  WHERE c.active = true
  ORDER BY
    CASE c.tier
      WHEN 'premium' THEN 1
      WHEN 'standard' THEN 2
      WHEN 'basic' THEN 3
    END,
    COALESCE(s.avg_monthly_price, 0) ASC,
    c.company_name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.suggest_carriers_for_request IS 'Suggests carriers for a buyer request based on geographic coverage and service match. Includes historical performance stats.';

-- Función RPC: obtener requests asignadas a un carrier (por email)
-- Esto facilita el query desde el frontend sin joins complejos
CREATE OR REPLACE FUNCTION public.get_carrier_assignments(carrier_email TEXT)
RETURNS TABLE(
  assignment_id UUID,
  assignment_status TEXT,
  request_id UUID,
  buyer_email TEXT,
  service TEXT,
  city TEXT,
  country TEXT,
  bandwidth TEXT,
  estimated_budget TEXT,
  deadline DATE,
  notes TEXT,
  request_status TEXT,
  quotes_count INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ra.id AS assignment_id,
    ra.status AS assignment_status,
    br.id AS request_id,
    br.buyer_email,
    br.service,
    br.city,
    br.country,
    br.bandwidth,
    br.estimated_budget,
    br.deadline,
    br.notes,
    br.status AS request_status,
    br.quotes_count,
    br.created_at
  FROM public.request_assignments ra
  JOIN public.carriers c ON c.id = ra.carrier_id
  JOIN public.buyer_requests br ON br.id = ra.buyer_request_id
  WHERE c.contact_email = carrier_email
    AND ra.status IN ('invited', 'viewed', 'quoted')
  ORDER BY br.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_carrier_assignments IS 'Returns all active assignments for a carrier identified by contact_email';

-- Función RPC: obtener quotes de un buyer request con info de carrier
CREATE OR REPLACE FUNCTION public.get_quotes_for_request(req_id UUID)
RETURNS TABLE(
  quote_id UUID,
  carrier_id UUID,
  company_name TEXT,
  contact_email TEXT,
  monthly_price NUMERIC,
  setup_fee NUMERIC,
  sla_uptime TEXT,
  sla_latency TEXT,
  installation_weeks INTEGER,
  notes TEXT,
  submitted_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.id AS quote_id,
    c.id AS carrier_id,
    c.company_name,
    c.contact_email,
    q.monthly_price,
    q.setup_fee,
    q.sla_uptime,
    q.sla_latency,
    q.installation_weeks,
    q.notes,
    q.submitted_at
  FROM public.quotes q
  JOIN public.carriers c ON c.id = q.carrier_id
  WHERE q.buyer_request_id = req_id
  ORDER BY q.monthly_price ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_quotes_for_request IS 'Returns all quotes for a buyer request with carrier details';

-- Actualizar la vista admin_stats para reflejar el nuevo modelo
DROP VIEW IF EXISTS public.admin_stats;
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
  (SELECT COUNT(*)::INTEGER FROM public.node_services) AS total_nodes,
  (SELECT COUNT(DISTINCT city)::INTEGER FROM public.node_services) AS cities_covered,
  (SELECT COUNT(*)::INTEGER FROM public.quotes) AS provider_bids,
  (SELECT COUNT(*)::INTEGER FROM public.leads) AS total_leads,
  (SELECT COUNT(*)::INTEGER FROM public.buyer_requests WHERE status = 'pending') AS pending_requests,
  (SELECT COUNT(*)::INTEGER FROM public.carriers WHERE active = true) AS total_carriers,
  (SELECT COUNT(*)::INTEGER FROM public.buyer_requests WHERE status = 'quoted') AS quoted_requests;

COMMENT ON VIEW public.admin_stats IS 'Admin dashboard aggregated statistics';
