-- ============================================
-- MIGRATION 007: Master Agent — Proposals, Deals, Commissions
-- ============================================

-- 1. Add commission fields to carriers
ALTER TABLE public.carriers
  ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) 
    DEFAULT 15.00 CHECK (commission_rate >= 0 AND commission_rate <= 100);

ALTER TABLE public.carriers
  ADD COLUMN IF NOT EXISTS agreement_type TEXT 
    DEFAULT 'standard' CHECK (agreement_type IN ('preferred','standard','residual'));

-- 2. PROPOSALS table
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_request_id UUID NOT NULL REFERENCES public.buyer_requests(id) ON DELETE CASCADE,
  agent_email TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected','expired')),
  sent_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_proposals_updated_at') THEN
    CREATE TRIGGER trg_proposals_updated_at BEFORE UPDATE ON public.proposals
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- FK INDEX: buyer_request_id (CRITICAL — Postgres does NOT auto-index FKs)
CREATE INDEX IF NOT EXISTS idx_proposals_buyer_request ON public.proposals(buyer_request_id);
CREATE INDEX IF NOT EXISTS idx_proposals_agent_email ON public.proposals(agent_email);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);

-- 3. PROPOSAL_OPTIONS table (Silver / Gold / Platinum tiers)
CREATE TABLE IF NOT EXISTS public.proposal_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('silver','gold','platinum')),
  carrier_id UUID REFERENCES public.carriers(id) ON DELETE SET NULL,
  monthly_price NUMERIC(10,2) NOT NULL,
  setup_fee NUMERIC(10,2) DEFAULT 0,
  sla_uptime TEXT,
  sla_latency TEXT,
  installation_weeks INTEGER,
  bandwidth TEXT,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FK INDEXES (CRITICAL)
CREATE INDEX IF NOT EXISTS idx_proposal_options_proposal ON public.proposal_options(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_options_carrier ON public.proposal_options(carrier_id);

-- 4. DEALS table
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_request_id UUID REFERENCES public.buyer_requests(id) ON DELETE SET NULL,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  carrier_id UUID REFERENCES public.carriers(id) ON DELETE SET NULL,
  monthly_revenue NUMERIC(10,2) NOT NULL,
  carrier_cost NUMERIC(10,2),
  commission_rate NUMERIC(5,2) NOT NULL,
  monthly_commission NUMERIC(10,2) GENERATED ALWAYS AS (monthly_revenue * commission_rate / 100) STORED,
  contract_term_months INTEGER DEFAULT 12,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending','active','renewed','terminated')),
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_deals_updated_at') THEN
    CREATE TRIGGER trg_deals_updated_at BEFORE UPDATE ON public.deals
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- FK INDEXES (CRITICAL)
CREATE INDEX IF NOT EXISTS idx_deals_buyer_request ON public.deals(buyer_request_id);
CREATE INDEX IF NOT EXISTS idx_deals_proposal ON public.deals(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deals_carrier ON public.deals(carrier_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);

-- 5. COMMISSION DASHBOARD VIEW
CREATE OR REPLACE VIEW public.agent_commission_dashboard AS
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

-- 6. AGENT PIPELINE VIEW (combines buyer_requests with proposal status)
CREATE OR REPLACE VIEW public.agent_pipeline AS
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

-- 7. RLS (open for development)
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read proposals" ON public.proposals;
DROP POLICY IF EXISTS "Authenticated insert proposals" ON public.proposals;
DROP POLICY IF EXISTS "Authenticated update proposals" ON public.proposals;
DROP POLICY IF EXISTS "Authenticated read proposal_options" ON public.proposal_options;
DROP POLICY IF EXISTS "Authenticated insert proposal_options" ON public.proposal_options;
DROP POLICY IF EXISTS "Authenticated delete proposal_options" ON public.proposal_options;
DROP POLICY IF EXISTS "Authenticated read deals" ON public.deals;
DROP POLICY IF EXISTS "Authenticated insert deals" ON public.deals;

CREATE POLICY "Authenticated read proposals" ON public.proposals FOR SELECT USING (true);
CREATE POLICY "Authenticated insert proposals" ON public.proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update proposals" ON public.proposals FOR UPDATE USING (true);

CREATE POLICY "Authenticated read proposal_options" ON public.proposal_options FOR SELECT USING (true);
CREATE POLICY "Authenticated insert proposal_options" ON public.proposal_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated delete proposal_options" ON public.proposal_options FOR DELETE USING (true);

CREATE POLICY "Authenticated read deals" ON public.deals FOR SELECT USING (true);
CREATE POLICY "Authenticated insert deals" ON public.deals FOR INSERT WITH CHECK (true);

-- 8. Update admin_stats view to include master agent metrics
DROP VIEW IF EXISTS public.admin_stats;
CREATE OR REPLACE VIEW public.admin_stats AS
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
