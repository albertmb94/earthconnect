-- ============================================
-- MIGRATION 005: Profiles + Buyer Requests Enhancement
-- ============================================

-- 1. Ampliar buyer_requests con campos de negocio
ALTER TABLE public.buyer_requests
  ADD COLUMN IF NOT EXISTS estimated_budget TEXT,
  ADD COLUMN IF NOT EXISTS deadline DATE,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent'));

COMMENT ON COLUMN public.buyer_requests.estimated_budget IS 'Buyer estimated budget range (free text, e.g. $2,000-4,000/mo)';
COMMENT ON COLUMN public.buyer_requests.deadline IS 'Desired delivery/quote deadline';
COMMENT ON COLUMN public.buyer_requests.notes IS 'Free-text requirements, SLA needs, special conditions';
COMMENT ON COLUMN public.buyer_requests.priority IS 'Request priority level';

-- 2. PROFILES (vinculado a Supabase Auth — preparado para migración futura a auth real)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','carrier','admin')),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profiles linked to Supabase Auth. Ready for real auth migration.';

-- Trigger para auto-actualizar updated_at
CREATE TRIGGER IF NOT EXISTS trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. TRIGGER: auto-crear perfil cuando se crea un usuario en auth.users
-- (Este trigger funciona cuando usas Supabase Auth real. Con mockup no se dispara,
--  pero dejamos la tabla lista para la migración.)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Solo crear el trigger si no existe (para no romper en re-runs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_auth_user_created'
  ) THEN
    CREATE TRIGGER trg_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 4. RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5. VIEW: admin_carrier_stats (stats históricas para sugerencias)
CREATE OR REPLACE VIEW public.admin_carrier_stats AS
SELECT
  c.id AS carrier_id,
  c.company_name,
  c.contact_email,
  c.tier,
  c.verified,
  c.active,
  COALESCE(q_stats.avg_response_hours, 0) AS avg_response_hours,
  COALESCE(q_stats.avg_monthly_price, 0) AS avg_monthly_price,
  COALESCE(q_stats.total_quotes, 0) AS total_quotes,
  COALESCE(q_stats.last_quote_at, null) AS last_quote_at
FROM public.carriers c
LEFT JOIN (
  SELECT
    q.carrier_id,
    AVG(EXTRACT(EPOCH FROM (q.submitted_at - ra.created_at)) / 3600) AS avg_response_hours,
    AVG(q.monthly_price) AS avg_monthly_price,
    COUNT(*) AS total_quotes,
    MAX(q.submitted_at) AS last_quote_at
  FROM public.quotes q
  LEFT JOIN public.request_assignments ra ON ra.carrier_id = q.carrier_id AND ra.buyer_request_id = q.buyer_request_id
  GROUP BY q.carrier_id
) q_stats ON q_stats.carrier_id = c.id;

COMMENT ON VIEW public.admin_carrier_stats IS 'Aggregated carrier performance for admin assignment suggestions';

-- 6. Asegurar que buyer_requests tenga RLS adecuado
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read buyer_requests" ON public.buyer_requests;
DROP POLICY IF EXISTS "Public insert buyer_requests" ON public.buyer_requests;
DROP POLICY IF EXISTS "Public update buyer_requests" ON public.buyer_requests;

CREATE POLICY "Public read buyer_requests" ON public.buyer_requests FOR SELECT USING (true);
CREATE POLICY "Public insert buyer_requests" ON public.buyer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update buyer_requests" ON public.buyer_requests FOR UPDATE USING (true);

-- 7. Asegurar que quotes tenga RLS adecuado
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read quotes" ON public.quotes;
DROP POLICY IF EXISTS "Public insert quotes" ON public.quotes;

CREATE POLICY "Public read quotes" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Public insert quotes" ON public.quotes FOR INSERT WITH CHECK (true);
