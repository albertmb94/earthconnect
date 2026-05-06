-- ==========================================================
-- MIGRATION 009: Restrict overly-permissive RLS policies
-- ==========================================================
-- Previous migrations used USING (true) / WITH CHECK (true) on
-- buyer_requests and quotes, allowing any anonymous client to
-- SELECT all rows (exposing all buyer PII and budgets) and
-- UPDATE any row (allowing status manipulation).
--
-- This migration tightens those policies:
--   - INSERT remains open (public form submissions need it)
--   - SELECT is scoped to the authenticated user's own email
--     (requires Supabase Auth — anon clients get no rows)
--   - UPDATE is removed entirely from the anon/public role
--   - DELETE is explicitly denied
--
-- NOTE: The buyer portal currently uses client-side email
-- matching without Supabase Auth sessions. To fully enforce
-- these policies, implement Supabase magic-link auth so that
-- auth.email() is available in RLS expressions.
-- ==========================================================

-- ── buyer_requests ─────────────────────────────────────────

ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read buyer_requests"  ON public.buyer_requests;
DROP POLICY IF EXISTS "Public insert buyer_requests" ON public.buyer_requests;
DROP POLICY IF EXISTS "Public update buyer_requests" ON public.buyer_requests;
DROP POLICY IF EXISTS "Public read buyer requests"   ON public.buyer_requests;
DROP POLICY IF EXISTS "Public insert buyer requests" ON public.buyer_requests;
DROP POLICY IF EXISTS "Public update buyer requests" ON public.buyer_requests;

-- Authenticated buyers can only see their own requests
CREATE POLICY "Buyer reads own requests"
  ON public.buyer_requests
  FOR SELECT
  USING (auth.email() = buyer_email);

-- Anyone can submit a new request (public lead-gen form)
CREATE POLICY "Public insert buyer_requests"
  ON public.buyer_requests
  FOR INSERT
  WITH CHECK (true);

-- Only the service_role (backend/admin) may update requests
-- No anon/authenticated UPDATE policy = implicit DENY

-- ── quotes ─────────────────────────────────────────────────

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read quotes"  ON public.quotes;
DROP POLICY IF EXISTS "Public insert quotes" ON public.quotes;

-- Buyers can read quotes linked to their own requests
CREATE POLICY "Buyer reads own quotes"
  ON public.quotes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.buyer_requests br
      WHERE br.id = quotes.buyer_request_id
        AND br.buyer_email = auth.email()
    )
  );

-- Admin/service role inserts quotes — no anon INSERT policy
-- (quotes are created server-side by the admin portal)
