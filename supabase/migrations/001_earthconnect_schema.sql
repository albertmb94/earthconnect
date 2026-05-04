-- EarthConnect Supabase schema
-- Run in Supabase SQL Editor after enabling a project.

create extension if not exists postgis;
create extension if not exists pgcrypto;

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.node_services (
  id uuid primary key default gen_random_uuid(),
  requested_tech text not null check (requested_tech in ('DIA', 'Broadband', 'MPLS', 'Dark Fiber')),
  requested_country text not null,
  city text not null,
  provider_id text not null,
  price_monthly numeric(10, 2) not null,
  currency text not null default 'USD',
  bandwidth_mbps integer not null default 100,
  location geography(Point, 4326) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_node_services_location on public.node_services using gist (location);
create index if not exists idx_node_services_tech_country_city on public.node_services (requested_tech, requested_country, city);

create table if not exists public.coverage_services (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  service text not null check (service in ('5G', 'LEO', 'MEO', 'GEO')),
  max_bandwidth text not null,
  provider_name text not null,
  provider_scope text not null check (provider_scope in ('National', 'Regional', 'Global')),
  languages_supported text[] not null default array['English'],
  created_at timestamptz not null default now()
);

create index if not exists idx_coverage_services_country_service on public.coverage_services (country, service);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  role text not null,
  phone text not null,
  corporate_email text not null,
  privacy_accepted boolean not null default false,
  requested_service text,
  requested_city text,
  requested_country text,
  requested_bandwidth text,
  estimated_price_range text,
  source text not null default 'earthconnect-web',
  created_at timestamptz not null default now()
);

alter table public.node_services enable row level security;
alter table public.coverage_services enable row level security;
alter table public.leads enable row level security;

drop policy if exists "Public read node services" on public.node_services;
create policy "Public read node services" on public.node_services for select using (true);

drop policy if exists "Public read coverage services" on public.coverage_services;
create policy "Public read coverage services" on public.coverage_services for select using (true);

drop policy if exists "Public lead insert" on public.leads;
create policy "Public lead insert" on public.leads for insert with check (privacy_accepted = true);

create or replace function public.get_service_insights(
  in_lat double precision,
  in_lng double precision,
  in_tech text,
  in_bandwidth_mbps integer default 100
)
returns table (
  p10_price numeric,
  p60_price numeric,
  nodes_found integer,
  min_distance_km double precision,
  max_distance_km double precision,
  currency_code text
) as $$
declare
  center_point geography(Point, 4326);
begin
  center_point := st_setsrid(st_point(in_lng, in_lat), 4326)::geography;

  return query
  with closest_nodes as (
    select
      price_monthly * power(greatest(in_bandwidth_mbps, 1)::numeric / nullif(bandwidth_mbps, 0),
        case
          when requested_tech = 'DIA' then 0.65
          when requested_tech = 'Broadband' then 0.55
          when requested_tech = 'MPLS' then 0.70
          when requested_tech = 'Dark Fiber' then 0.40
          else 0.60
        end
      ) as adjusted_price,
      st_distance(location, center_point) / 1000.0 as distance_km,
      currency
    from public.node_services
    where requested_tech = in_tech
    order by location <-> center_point
    limit 10
  ), stats as (
    select
      percentile_cont(0.10) within group (order by adjusted_price) as p10,
      percentile_cont(0.60) within group (order by adjusted_price) as p60,
      count(*)::integer as count_found,
      min(distance_km) as min_dist,
      max(distance_km) as max_dist,
      coalesce((array_agg(currency order by currency))[1], 'USD') as currency_code
    from closest_nodes
  )
  select
    coalesce(p10::numeric(10, 2), 0.00),
    coalesce(p60::numeric(10, 2), 0.00),
    count_found,
    coalesce(min_dist, 0.00),
    coalesce(max_dist, 0.00),
    currency_code
  from stats;
end;
$$ language plpgsql stable security definer;

grant execute on function public.get_service_insights(double precision, double precision, text, integer) to anon, authenticated;

insert into public.coverage_services (country, service, max_bandwidth, provider_name, provider_scope, languages_supported) values
('Spain', '5G', '1 Gbps', 'Movistar', 'National', array['Spanish', 'English']),
('Spain', '5G', '1 Gbps', 'Vodafone', 'National', array['Spanish', 'English']),
('Spain', 'LEO', '300 Mbps', 'Starlink', 'Global', array['English', 'Spanish', 'French', 'German']),
('Spain', 'LEO', '300 Mbps', 'OneWeb', 'Global', array['English']),
('United States', '5G', '1 Gbps', 'Verizon', 'National', array['English']),
('United States', 'LEO', '300 Mbps', 'Starlink', 'Global', array['English', 'Spanish', 'French'])
on conflict do nothing;