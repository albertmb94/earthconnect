-- ============================================
-- MIGRATION 004: Marketplace Carriers + Assignments
-- ============================================

-- 1. CARRIERS (registro oficial de proveedores)
CREATE TABLE IF NOT EXISTS public.carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL UNIQUE,
  contact_phone TEXT,
  tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('premium','standard','basic')),
  verified BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.carriers IS 'Official carrier/provider registry for the marketplace';

-- 2. CARRIER_COVERAGE (qué sirven, dónde)
CREATE TABLE IF NOT EXISTS public.carrier_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id UUID NOT NULL REFERENCES public.carriers(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  region TEXT, -- nullable, para granularidad futura
  service TEXT NOT NULL CHECK (service IN (
    'DIA','Broadband','MPLS','SD-WAN','Dark Fiber',
    '5G','LEO','MEO','GEO','Cloud','Managed Mobility','Managed Services'
  )),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(carrier_id, country, service) -- evitar duplicados
);

COMMENT ON TABLE public.carrier_coverage IS 'Carrier coverage by country and service type';

-- 3. REQUEST_ASSIGNMENTS (admin asigna carriers a buyer requests)
CREATE TABLE IF NOT EXISTS public.request_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_request_id UUID NOT NULL REFERENCES public.buyer_requests(id) ON DELETE CASCADE,
  carrier_id UUID NOT NULL REFERENCES public.carriers(id) ON DELETE CASCADE,
  assigned_by UUID, -- admin user id (para cuando tengamos auth real)
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','viewed','quoted','expired','declined')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  quoted_at TIMESTAMPTZ,
  UNIQUE(buyer_request_id, carrier_id) -- un carrier solo una vez por request
);

COMMENT ON TABLE public.request_assignments IS 'Tracks which carriers are invited to quote on a buyer request';

-- 4. ALTER QUOTES: make opportunity_id NULLABLE (new flow uses buyer_request_id)
ALTER TABLE public.quotes ALTER COLUMN opportunity_id DROP NOT NULL;

-- Ensure buyer_request_id FK exists (should already from 003, but safety check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quotes' AND column_name = 'buyer_request_id'
  ) THEN
    ALTER TABLE public.quotes ADD COLUMN buyer_request_id UUID REFERENCES public.buyer_requests(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_carrier_coverage_carrier ON public.carrier_coverage(carrier_id);
CREATE INDEX IF NOT EXISTS idx_carrier_coverage_country_service ON public.carrier_coverage(country, service);
CREATE INDEX IF NOT EXISTS idx_request_assignments_request ON public.request_assignments(buyer_request_id);
CREATE INDEX IF NOT EXISTS idx_request_assignments_carrier ON public.request_assignments(carrier_id);
CREATE INDEX IF NOT EXISTS idx_request_assignments_status ON public.request_assignments(status);
CREATE INDEX IF NOT EXISTS idx_quotes_buyer_request ON public.quotes(buyer_request_id);

-- 6. TRIGGERS (updated_at)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trg_carriers_updated_at BEFORE UPDATE ON public.carriers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER IF NOT EXISTS trg_carrier_coverage_updated_at BEFORE UPDATE ON public.carrier_coverage
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER IF NOT EXISTS trg_request_assignments_updated_at BEFORE UPDATE ON public.request_assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. RLS (open for development — tighten before production)
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrier_coverage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Authenticated read carriers" ON public.carriers;
DROP POLICY IF EXISTS "Authenticated insert carriers" ON public.carriers;
DROP POLICY IF EXISTS "Authenticated update carriers" ON public.carriers;
DROP POLICY IF EXISTS "Authenticated read coverage" ON public.carrier_coverage;
DROP POLICY IF EXISTS "Authenticated insert coverage" ON public.carrier_coverage;
DROP POLICY IF EXISTS "Authenticated delete coverage" ON public.carrier_coverage;
DROP POLICY IF EXISTS "Authenticated read assignments" ON public.request_assignments;
DROP POLICY IF EXISTS "Authenticated insert assignments" ON public.request_assignments;
DROP POLICY IF EXISTS "Authenticated update assignments" ON public.request_assignments;

CREATE POLICY "Authenticated read carriers" ON public.carriers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert carriers" ON public.carriers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update carriers" ON public.carriers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read coverage" ON public.carrier_coverage FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert coverage" ON public.carrier_coverage FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated delete coverage" ON public.carrier_coverage FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated read assignments" ON public.request_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert assignments" ON public.request_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update assignments" ON public.request_assignments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 8. SEED DATA: sample carriers for development
INSERT INTO public.carriers (company_name, contact_email, contact_phone, tier, verified, active) VALUES
  ('Lumen Technologies', 'quotes@lumen.com', '+1-800-XXX-XXXX', 'premium', true, true),
  ('Zayo Group', 'bids@zayo.com', '+1-800-XXX-XXXX', 'premium', true, true),
  ('Colt Technology Services', 'enterprise@colt.net', '+44-20-XXXX-XXXX', 'premium', true, true),
  ('Telefónica Empresas', 'negocios@telefonica.es', '+34-91-XXX-XXXX', 'standard', true, true),
  ('BT Business', 'enterprise@bt.com', '+44-20-XXXX-XXXX', 'standard', true, true),
  ('Orange Business', 'quotes@orange.com', '+33-1-XXX-XXXX', 'standard', true, true),
  ('Starlink Business', 'enterprise@starlink.com', null, 'premium', true, true),
  ('OneWeb', 'enterprise@oneweb.net', null, 'standard', true, true)
ON CONFLICT (contact_email) DO NOTHING;

-- Seed carrier coverage (Spain + UK + USA as examples)
INSERT INTO public.carrier_coverage (carrier_id, country, service, active)
SELECT c.id, 'Spain', 'DIA', true FROM public.carriers c WHERE c.company_name = 'Lumen Technologies'
UNION ALL SELECT c.id, 'Spain', 'DIA', true FROM public.carriers c WHERE c.company_name = 'Zayo Group'
UNION ALL SELECT c.id, 'Spain', 'DIA', true FROM public.carriers c WHERE c.company_name = 'Colt Technology Services'
UNION ALL SELECT c.id, 'Spain', 'DIA', true FROM public.carriers c WHERE c.company_name = 'Telefónica Empresas'
UNION ALL SELECT c.id, 'Spain', 'Broadband', true FROM public.carriers c WHERE c.company_name = 'Telefónica Empresas'
UNION ALL SELECT c.id, 'Spain', 'MPLS', true FROM public.carriers c WHERE c.company_name = 'Telefónica Empresas'
UNION ALL SELECT c.id, 'Spain', 'MPLS', true FROM public.carriers c WHERE c.company_name = 'Colt Technology Services'
UNION ALL SELECT c.id, 'Spain', 'Dark Fiber', true FROM public.carriers c WHERE c.company_name = 'Zayo Group'
UNION ALL SELECT c.id, 'United Kingdom', 'DIA', true FROM public.carriers c WHERE c.company_name = 'BT Business'
UNION ALL SELECT c.id, 'United Kingdom', 'DIA', true FROM public.carriers c WHERE c.company_name = 'Colt Technology Services'
UNION ALL SELECT c.id, 'United Kingdom', 'MPLS', true FROM public.carriers c WHERE c.company_name = 'BT Business'
UNION ALL SELECT c.id, 'United States', 'DIA', true FROM public.carriers c WHERE c.company_name = 'Lumen Technologies'
UNION ALL SELECT c.id, 'United States', 'DIA', true FROM public.carriers c WHERE c.company_name = 'Zayo Group'
UNION ALL SELECT c.id, 'United States', 'Broadband', true FROM public.carriers c WHERE c.company_name = 'Zayo Group'
UNION ALL SELECT c.id, 'Spain', 'LEO', true FROM public.carriers c WHERE c.company_name = 'Starlink Business'
UNION ALL SELECT c.id, 'United Kingdom', 'LEO', true FROM public.carriers c WHERE c.company_name = 'Starlink Business'
UNION ALL SELECT c.id, 'United States', 'LEO', true FROM public.carriers c WHERE c.company_name = 'Starlink Business'
ON CONFLICT DO NOTHING;
