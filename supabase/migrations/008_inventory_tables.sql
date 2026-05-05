-- ============================================
-- MIGRATION 008: Inventory Tables for Network Management Platform
-- ============================================

-- 1. LOCATIONS
CREATE TABLE IF NOT EXISTS public.inventory_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  country_name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  site_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  alert_count INTEGER NOT NULL DEFAULT 0,
  open_tickets INTEGER NOT NULL DEFAULT 0,
  active_services INTEGER NOT NULL DEFAULT 0,
  current_spend NUMERIC(10,2) NOT NULL DEFAULT 0,
  provider TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.inventory_locations IS 'Network inventory: physical locations/sites';

-- 2. SERVICES
CREATE TABLE IF NOT EXISTS public.inventory_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'cancelled')),
  expected_monthly_spend NUMERIC(10,2) NOT NULL DEFAULT 0,
  site_id TEXT NOT NULL,
  location_id UUID REFERENCES public.inventory_locations(id) ON DELETE SET NULL,
  location_name TEXT,
  country TEXT,
  bandwidth TEXT,
  circuit_id TEXT,
  cpe_make_model TEXT,
  demarc_details TEXT,
  fiber_connector_type TEXT,
  ip_details JSONB DEFAULT '{}',
  last_mile TEXT,
  managed_inventory BOOLEAN NOT NULL DEFAULT false,
  agent_inventory BOOLEAN NOT NULL DEFAULT true,
  billing_account TEXT,
  service_provider_id TEXT,
  bill_activation_date DATE,
  complete_date DATE,
  expiration_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.inventory_services IS 'Network inventory: active and pending services';

-- 3. CONTRACTS
CREATE TABLE IF NOT EXISTS public.inventory_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Fixed Term', 'Month-to-Month')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  auto_renew BOOLEAN NOT NULL DEFAULT false,
  mrc NUMERIC(10,2) NOT NULL DEFAULT 0,
  services INTEGER NOT NULL DEFAULT 0,
  locations INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.inventory_contracts IS 'Network inventory: service contracts and agreements';

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS public.inventory_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  provisioner JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'on-hold')),
  deal_type TEXT,
  created_date DATE NOT NULL,
  expected_mrc NUMERIC(10,2) NOT NULL DEFAULT 0,
  services INTEGER NOT NULL DEFAULT 0,
  created_by TEXT,
  description JSONB NOT NULL DEFAULT '{}',
  locations JSONB NOT NULL DEFAULT '[]',
  sidebar JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.inventory_orders IS 'Network inventory: service orders and installations';

-- 5. TICKETS
CREATE TABLE IF NOT EXISTS public.inventory_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'in-progress')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  service_id TEXT,
  service_name TEXT,
  location_id TEXT,
  location_name TEXT,
  created_date DATE NOT NULL,
  last_updated DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.inventory_tickets IS 'Network inventory: support tickets';

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.inventory_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_tickets ENABLE ROW LEVEL SECURITY;

-- Public read access (for demo/inventory platform)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_locations' AND policyname = 'Public read locations'
  ) THEN
    CREATE POLICY "Public read locations" ON public.inventory_locations FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_services' AND policyname = 'Public read services'
  ) THEN
    CREATE POLICY "Public read services" ON public.inventory_services FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_contracts' AND policyname = 'Public read contracts'
  ) THEN
    CREATE POLICY "Public read contracts" ON public.inventory_contracts FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_orders' AND policyname = 'Public read orders'
  ) THEN
    CREATE POLICY "Public read orders" ON public.inventory_orders FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_tickets' AND policyname = 'Public read tickets'
  ) THEN
    CREATE POLICY "Public read tickets" ON public.inventory_tickets FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

-- Authenticated write access (for admin imports)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_locations' AND policyname = 'Authenticated write locations'
  ) THEN
    CREATE POLICY "Authenticated write locations" ON public.inventory_locations FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_services' AND policyname = 'Authenticated write services'
  ) THEN
    CREATE POLICY "Authenticated write services" ON public.inventory_services FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_contracts' AND policyname = 'Authenticated write contracts'
  ) THEN
    CREATE POLICY "Authenticated write contracts" ON public.inventory_contracts FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_orders' AND policyname = 'Authenticated write orders'
  ) THEN
    CREATE POLICY "Authenticated write orders" ON public.inventory_orders FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inventory_tickets' AND policyname = 'Authenticated write tickets'
  ) THEN
    CREATE POLICY "Authenticated write tickets" ON public.inventory_tickets FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_inventory_services_location ON public.inventory_services(location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_services_status ON public.inventory_services(status);
CREATE INDEX IF NOT EXISTS idx_inventory_services_provider ON public.inventory_services(provider);
CREATE INDEX IF NOT EXISTS idx_inventory_contracts_status ON public.inventory_contracts(status);
CREATE INDEX IF NOT EXISTS idx_inventory_contracts_end_date ON public.inventory_contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_inventory_orders_status ON public.inventory_orders(status);
CREATE INDEX IF NOT EXISTS idx_inventory_tickets_status ON public.inventory_tickets(status);
CREATE INDEX IF NOT EXISTS idx_inventory_locations_country ON public.inventory_locations(country);
CREATE INDEX IF NOT EXISTS idx_inventory_locations_status ON public.inventory_locations(status);
