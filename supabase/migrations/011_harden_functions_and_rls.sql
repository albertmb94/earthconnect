-- ==========================================================
-- MIGRATION 011: Harden functions (search_path + EXECUTE) and RLS
-- ==========================================================
-- Fixes three categories of Supabase linter warnings:
--
-- A. function_search_path_mutable  — 7 functions missing fixed search_path.
--    Without it an attacker who can create objects in any schema earlier
--    in the search_path can intercept function calls (schema confusion).
--    Fix: add SET search_path = '' and use fully-qualified names.
--
-- B. anon_security_definer_function_executable — 5 custom SECURITY DEFINER
--    RPCs callable by the anon role that return sensitive data (carrier
--    assignments, buyer quotes, carrier details). Revoke EXECUTE from anon.
--    Exception: get_service_insights is the public pricing feature and
--    must stay accessible to unauthenticated visitors.
--    PostGIS st_estimatedextent is a built-in; handled separately.
--
-- C. rls_policy_always_true — write policies with USING/WITH CHECK (true).
--    Drops or tightens the most dangerous ones. Full enforcement requires
--    proper Supabase Auth (see migration 009 notes).
-- ==========================================================


-- ══════════════════════════════════════════════════════════════
-- A. FIX MUTABLE search_path ON ALL CUSTOM FUNCTIONS
-- ══════════════════════════════════════════════════════════════

-- A1. set_updated_at  (trigger helper, no table refs)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- A2. increment_quotes_count  (trigger, writes public.buyer_requests)
CREATE OR REPLACE FUNCTION public.increment_quotes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.buyer_requests
  SET quotes_count = quotes_count + 1,
      status       = CASE WHEN status = 'pending' THEN 'quoted' ELSE status END,
      updated_at   = NOW()
  WHERE id = NEW.buyer_request_id;
  RETURN NEW;
END;
$$;

-- A3. handle_new_user  (auth trigger, writes public.profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- A4. get_service_insights  (public pricing RPC — anon access intentional)
CREATE OR REPLACE FUNCTION public.get_service_insights(
  in_lat            double precision,
  in_lng            double precision,
  in_tech           text,
  in_bandwidth_mbps integer DEFAULT 100
)
RETURNS TABLE (
  p10_price        numeric,
  p60_price        numeric,
  nodes_found      integer,
  min_distance_km  double precision,
  max_distance_km  double precision,
  currency_code    text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  center_point geography(Point, 4326);
BEGIN
  center_point := ST_SetSRID(ST_Point(in_lng, in_lat), 4326)::geography;

  RETURN QUERY
  WITH closest_nodes AS (
    SELECT
      price_monthly * POWER(
        GREATEST(in_bandwidth_mbps, 1)::numeric / NULLIF(bandwidth_mbps, 0),
        CASE
          WHEN requested_tech = 'DIA'        THEN 0.65
          WHEN requested_tech = 'Broadband'  THEN 0.55
          WHEN requested_tech = 'MPLS'       THEN 0.70
          WHEN requested_tech = 'Dark Fiber' THEN 0.40
          ELSE 0.60
        END
      ) AS adjusted_price,
      ST_Distance(location, center_point) / 1000.0 AS distance_km,
      currency
    FROM public.node_services
    WHERE requested_tech = in_tech
    ORDER BY location <-> center_point
    LIMIT 10
  ),
  stats AS (
    SELECT
      percentile_cont(0.10) WITHIN GROUP (ORDER BY adjusted_price) AS p10,
      percentile_cont(0.60) WITHIN GROUP (ORDER BY adjusted_price) AS p60,
      COUNT(*)::integer AS count_found,
      MIN(distance_km)   AS min_dist,
      MAX(distance_km)   AS max_dist,
      COALESCE((ARRAY_AGG(currency ORDER BY currency))[1], 'USD') AS currency_code
    FROM closest_nodes
  )
  SELECT
    COALESCE(p10::numeric(10,2), 0.00),
    COALESCE(p60::numeric(10,2), 0.00),
    count_found,
    COALESCE(min_dist, 0.00),
    COALESCE(max_dist, 0.00),
    currency_code
  FROM stats;
END;
$$;

-- A5. suggest_carriers_for_request  (admin RPC)
CREATE OR REPLACE FUNCTION public.suggest_carriers_for_request(request_id UUID)
RETURNS TABLE (
  carrier_id        UUID,
  company_name      TEXT,
  contact_email     TEXT,
  tier              TEXT,
  avg_response_hours NUMERIC,
  avg_monthly_price  NUMERIC,
  total_quotes       BIGINT,
  last_quote_at      TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
      AVG(q.monthly_price)  AS avg_monthly_price,
      COUNT(*)::BIGINT       AS total_quotes,
      MAX(q.submitted_at)   AS last_quote_at
    FROM public.quotes q
    GROUP BY q.carrier_id
  )
  SELECT
    c.id,
    c.company_name,
    c.contact_email,
    c.tier,
    0::NUMERIC,
    COALESCE(s.avg_monthly_price, 0)::NUMERIC,
    COALESCE(s.total_quotes, 0)::BIGINT,
    s.last_quote_at
  FROM public.carriers c
  JOIN coverage_match cm ON cm.carrier_id = c.id
  LEFT JOIN stats s ON s.carrier_id::text = c.id::text
  WHERE c.active = true
  ORDER BY
    CASE c.tier
      WHEN 'premium'  THEN 1
      WHEN 'standard' THEN 2
      WHEN 'basic'    THEN 3
    END,
    COALESCE(s.avg_monthly_price, 0) ASC,
    c.company_name ASC;
END;
$$;

-- A6. get_carrier_assignments  (carrier portal RPC — returns buyer PII)
CREATE OR REPLACE FUNCTION public.get_carrier_assignments(carrier_email TEXT)
RETURNS TABLE (
  assignment_id     UUID,
  assignment_status TEXT,
  request_id        UUID,
  buyer_email       TEXT,
  service           TEXT,
  city              TEXT,
  country           TEXT,
  bandwidth         TEXT,
  estimated_budget  TEXT,
  deadline          DATE,
  notes             TEXT,
  request_status    TEXT,
  quotes_count      INTEGER,
  created_at        TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ra.id,
    ra.status,
    br.id,
    br.buyer_email,
    br.service,
    br.city,
    br.country,
    br.bandwidth,
    br.estimated_budget,
    br.deadline,
    br.notes,
    br.status,
    br.quotes_count,
    br.created_at
  FROM public.request_assignments ra
  JOIN public.carriers c ON c.id = ra.carrier_id
  JOIN public.buyer_requests br ON br.id = ra.buyer_request_id
  WHERE c.contact_email = carrier_email
    AND ra.status IN ('invited', 'viewed', 'quoted')
  ORDER BY br.created_at DESC;
END;
$$;

-- A7. get_quotes_for_request  (buyer portal RPC — returns carrier contact details)
CREATE OR REPLACE FUNCTION public.get_quotes_for_request(req_id UUID)
RETURNS TABLE (
  quote_id           UUID,
  carrier_id         UUID,
  company_name       TEXT,
  contact_email      TEXT,
  monthly_price      NUMERIC,
  setup_fee          NUMERIC,
  sla_uptime         TEXT,
  sla_latency        TEXT,
  installation_weeks INTEGER,
  notes              TEXT,
  submitted_at       TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.id,
    c.id,
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
  JOIN public.carriers c ON c.id::text = q.carrier_id::text
  WHERE q.buyer_request_id = req_id
  ORDER BY q.monthly_price ASC;
END;
$$;


-- ══════════════════════════════════════════════════════════════
-- B. REVOKE anon EXECUTE ON SENSITIVE SECURITY DEFINER FUNCTIONS
-- ══════════════════════════════════════════════════════════════
-- get_service_insights intentionally stays anon-accessible.
-- The three PostGIS st_estimatedextent variants are system builtins;
-- to harden them move the postgis extension to a non-public schema
-- (see extension_in_public lint warning).

REVOKE EXECUTE ON FUNCTION public.get_carrier_assignments(text)        FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_quotes_for_request(uuid)         FROM anon;
REVOKE EXECUTE ON FUNCTION public.suggest_carriers_for_request(uuid)   FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                    FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_quotes_count()             FROM anon;

-- Confirm anon keeps access to the public search RPC
GRANT EXECUTE ON FUNCTION public.get_service_insights(double precision, double precision, text, integer) TO anon, authenticated;


-- ══════════════════════════════════════════════════════════════
-- C. TIGHTEN OVERLY-PERMISSIVE RLS WRITE POLICIES
-- ══════════════════════════════════════════════════════════════
-- Full row-level isolation requires Supabase Auth (migration 009).
-- This migration drops the most dangerous policies — unrestricted
-- UPDATE/DELETE that let any client modify or remove any row.

-- ── buyer_requests ──────────────────────────────────────────
-- Drop all legacy permissive UPDATE policies (both naming variants)
DROP POLICY IF EXISTS "Public update buyer requests"   ON public.buyer_requests;
DROP POLICY IF EXISTS "Public update buyer_requests"   ON public.buyer_requests;
-- INSERT remains open for the public lead-gen form (migration 009 already
-- added the restrictive version; this drop-if-exists is a safety net)
DROP POLICY IF EXISTS "Public insert buyer requests"   ON public.buyer_requests;
DROP POLICY IF EXISTS "Public insert buyer_requests"   ON public.buyer_requests;
-- Recreate INSERT-only public policy (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'buyer_requests' AND policyname = 'Public insert buyer_requests'
  ) THEN
    CREATE POLICY "Public insert buyer_requests"
      ON public.buyer_requests FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- ── notification_preferences ────────────────────────────────
-- The FOR ALL USING (true) policy lets anyone read/write/delete
-- any carrier's notification configuration.
DROP POLICY IF EXISTS "Carrier can manage own notifications" ON public.notification_preferences;
-- Replace with read-only for anon; writes require authenticated
CREATE POLICY "Public read notification_preferences"
  ON public.notification_preferences FOR SELECT USING (true);
-- Authenticated users may only manage their own carrier's prefs.
-- Without real auth we can't scope by carrier_id here, so we
-- allow authenticated INSERT/UPDATE and deny DELETE entirely.
CREATE POLICY "Authenticated write notification_preferences"
  ON public.notification_preferences FOR INSERT
  TO authenticated WITH CHECK (true);

-- ── proposals / proposal_options ────────────────────────────
-- These are admin-internal documents; the permissive UPDATE lets
-- any unauthenticated client overwrite proposal status/content.
DROP POLICY IF EXISTS "Authenticated update proposals"        ON public.proposals;
-- INSERT and SELECT policies remain (admin portal needs them)

DROP POLICY IF EXISTS "Authenticated delete proposal_options" ON public.proposal_options;
-- INSERT and SELECT policies remain

-- ── request_assignments ─────────────────────────────────────
-- Drop the permissive UPDATE; assignment status changes should
-- only happen server-side via service_role.
DROP POLICY IF EXISTS "Authenticated update assignments"      ON public.request_assignments;

-- ── carriers ────────────────────────────────────────────────
-- Drop open UPDATE; carrier records should only be edited by admins
-- via service_role, not by arbitrary authenticated REST clients.
DROP POLICY IF EXISTS "Authenticated update carriers"         ON public.carriers;
