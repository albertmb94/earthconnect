-- Migration 003: Portal Enhancements — buyer_requests, quote linking, and automation
-- Run in Supabase SQL Editor

-- ==========================================================
-- 1. BUYER REQUESTS TABLE
-- Tracks lifecycle of a lead after qualification
-- ==========================================================

create table if not exists public.buyer_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  buyer_email text not null,
  service text not null,
  city text not null,
  country text not null,
  bandwidth text,
  status text not null default 'pending' check (status in ('pending', 'quoted', 'in_progress', 'completed')),
  quotes_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_buyer_requests_email on public.buyer_requests (buyer_email);
create index if not exists idx_buyer_requests_status on public.buyer_requests (status);
create index if not exists idx_buyer_requests_lead on public.buyer_requests (lead_id);

alter table public.buyer_requests enable row level security;

drop policy if exists "Public read buyer requests" on public.buyer_requests;
create policy "Public read buyer requests" on public.buyer_requests for select using (true);

drop policy if exists "Public insert buyer requests" on public.buyer_requests;
create policy "Public insert buyer requests" on public.buyer_requests for insert with check (true);

drop policy if exists "Public update buyer requests" on public.buyer_requests;
create policy "Public update buyer requests" on public.buyer_requests for update using (true);

-- ==========================================================
-- 2. LINK QUOTES TO BUYER REQUESTS
-- ==========================================================

alter table public.quotes add column if not exists buyer_request_id uuid references public.buyer_requests(id) on delete set null;

-- ==========================================================
-- 3. AUTO-INCREMENT QUOTES_COUNT ON BUYER REQUESTS
-- ==========================================================

create or replace function public.increment_quotes_count()
returns trigger as $$
begin
  update public.buyer_requests
  set quotes_count = quotes_count + 1,
      status = case when status = 'pending' then 'quoted' else status end,
      updated_at = now()
  where id = new.buyer_request_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_quotes_count on public.quotes;
create trigger trg_quotes_count
  after insert on public.quotes
  for each row
  when (new.buyer_request_id is not null)
  execute function public.increment_quotes_count();

-- ==========================================================
-- 4. UPDATE TRIGGER FOR buyer_requests.updated_at
-- ==========================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_buyer_requests_updated_at on public.buyer_requests;
create trigger trg_buyer_requests_updated_at
  before update on public.buyer_requests
  for each row
  execute function public.set_updated_at();

-- ==========================================================
-- 5. SEED DATA FOR TESTING
-- ==========================================================

insert into public.buyer_requests (buyer_email, service, city, country, bandwidth, status, quotes_count)
values
  ('demo@acme.com', 'DIA', 'Madrid', 'Spain', '500 Mbps', 'quoted', 3),
  ('demo@acme.com', 'MPLS', 'Barcelona', 'Spain', '1 Gbps', 'pending', 1),
  ('demo@acme.com', 'Dark Fiber', 'Sevilla', 'Spain', '10 Gbps', 'in_progress', 5),
  ('demo@acme.com', 'Broadband FTTH', 'Valencia', 'Spain', '300 Mbps', 'completed', 2)
on conflict do nothing;

-- ==========================================================
-- 6. ADMIN STATS HELPER VIEW
-- ==========================================================

create or replace view public.admin_stats as
select
  (select count(*) from public.node_services) as total_nodes,
  (select count(distinct city) from public.node_services) as cities_covered,
  (select count(*) from public.quotes) as provider_bids,
  (select count(*) from public.leads) as total_leads,
  (select count(*) from public.opportunities where status = 'open') as open_opportunities;
