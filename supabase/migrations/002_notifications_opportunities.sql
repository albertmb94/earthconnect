-- Migration 004: Add notification_preferences and make leads.phone/role nullable
-- Run in Supabase SQL Editor

-- Make phone and role nullable in leads table (for optional fields)
alter table public.leads alter column phone drop not null;
alter table public.leads alter column role drop not null;

-- Create notification_preferences table for multichannel carrier notifications
create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  carrier_id text not null,
  channel text not null check (channel in ('email', 'slack', 'teams', 'webhook')),
  webhook_url text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(carrier_id, channel)
);

-- Create opportunities table for carrier bidding
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  service text not null,
  location text not null,
  country text not null,
  bandwidth text not null,
  estimated_budget text,
  deadline date,
  status text not null default 'open' check (status in ('open', 'quoted', 'won', 'lost', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create quotes table for carrier responses
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  carrier_id text not null,
  monthly_price numeric(10, 2),
  setup_fee numeric(10, 2),
  sla_uptime text,
  sla_latency text,
  installation_weeks integer,
  notes text,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'accepted', 'rejected')),
  submitted_at timestamptz not null default now()
);

-- Create indexes
create index if not exists idx_notification_preferences_carrier on public.notification_preferences (carrier_id);
create index if not exists idx_opportunities_status on public.opportunities (status);
create index if not exists idx_quotes_opportunity on public.quotes (opportunity_id);
create index if not exists idx_quotes_carrier on public.quotes (carrier_id);

-- Enable RLS
alter table public.notification_preferences enable row level security;
alter table public.opportunities enable row level security;
alter table public.quotes enable row level security;

-- Policies
drop policy if exists "Carrier can manage own notifications" on public.notification_preferences;
create policy "Carrier can manage own notifications" on public.notification_preferences
  for all using (true);

drop policy if exists "Public read opportunities" on public.opportunities;
create policy "Public read opportunities" on public.opportunities for select using (true);

drop policy if exists "Carrier can insert opportunities" on public.opportunities;
create policy "Carrier can insert opportunities" on public.opportunities for insert with check (true);

drop policy if exists "Public read quotes for opportunities" on public.quotes;
create policy "Public read quotes for opportunities" on public.quotes for select using (true);

drop policy if exists "Carrier can insert quotes" on public.quotes;
create policy "Carrier can insert quotes" on public.quotes for insert with check (true);

-- Sample opportunities data
insert into public.opportunities (external_id, service, location, country, bandwidth, estimated_budget, deadline, status)
values
  ('OPP-2024-042', 'DIA', 'Madrid', 'Spain', '500 Mbps', '$2,400/mo', '2024-05-15', 'open'),
  ('OPP-2024-043', 'MPLS', 'Barcelona', 'Spain', '1 Gbps', '$8,500/mo', '2024-05-20', 'open'),
  ('OPP-2024-044', 'Dark Fiber', 'Sevilla', 'Spain', '10 Gbps', '$15,000/mo', '2024-05-28', 'open')
on conflict do nothing;