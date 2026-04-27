# EarthConnect

EarthConnect is a B2B connectivity intelligence webapp for checking enterprise service availability by address across DIA, Broadband / FTTX, MPLS, 5G, Satellite LEO/MEO/GEO, and Dark Fiber.

The current implementation is a Vite + React + TypeScript + Tailwind CSS application prepared for Vercel deployment and Supabase integration.

## Product

### Procurement
Address-first carrier sourcing for enterprise buyers. Compare provider availability, expected local price ranges, SLA scope, bandwidth, and languages before requesting final quotes.

### Network Inventory Manager
Maintain a structured inventory of locations, technologies, providers, bandwidth requirements, SLA attributes, and commercial renewal context.

### Expense Manager
Benchmark telecom spend against market-based P10-P60 pricing ranges and identify sites that may be overpaying for connectivity.

## Solutions

### Dedicated Internet Access
Dedicated, uncontended enterprise internet circuits with committed bandwidth, SLA, static IPs, and cloud or data center handoff options.

### Broadband / FTTX
Business broadband and fiber-to-the-x services for branch connectivity, retail networks, and SD-WAN underlay.

### MPLS
Managed private WAN connectivity with QoS, routing control, and predictable performance for critical business applications.

### 5G
Business mobile connectivity for fast deployment, failover, temporary sites, and markets where fixed access is delayed.

### Satellite LEO / MEO / GEO
Global and regional satellite connectivity for remote locations, emergency backup, maritime, energy, mining, and hard-to-reach sites.

### Dark Fiber
Unlit fiber for enterprises requiring long-term scale, low latency, privacy, and full optical control.

## Company

### About Us
EarthConnect combines geocoding, PostGIS spatial analysis, provider datasets, and B2B lead capture to help global enterprises make better telecom decisions.

### Contact Us
Use the in-app Request Info flow or deploy the Supabase leads table to capture corporate requests with service, city, bandwidth, and estimated price context.

### EarthConnect FAQ
EarthConnect uses Photon for address geocoding, Supabase/PostGIS for proximity calculations, and coverage datasets for country-based availability checks.

### Telecom FAQ
DIA is dedicated and SLA-backed, broadband is cost-efficient but shared, MPLS is private WAN, 5G is wireless access, satellite extends coverage, and dark fiber gives maximum control.

## Resources

### Case Studies
Use cases include multi-site SD-WAN sourcing, data center interconnect projects, branch backup planning, and telecom expense reviews.

### Events
Host procurement workshops, telecom market roundtables, and provider ecosystem briefings.

### Blog
Publish local SEO content about connectivity options by country, city, service type, bandwidth, and provider category.

### Webinars
Educate IT, procurement, and finance teams about sourcing connectivity, benchmarking prices, and planning network inventory programs.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion
- React Hook Form + Zod
- Supabase Auth, PostgreSQL, PostGIS
- Photon geocoding API
- Vercel hosting

## Local Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase values:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

5. Run the app with `npm run dev`.

## Supabase Setup

1. Create a Supabase project at `https://supabase.com`.
2. Go to **Project Settings > API** and copy:
   - Project URL
   - `anon public` key
3. Go to **SQL Editor**.
4. Paste and run `supabase/migrations/001_earthconnect_schema.sql`.
5. Go to **Authentication > URL Configuration**.
6. Add your local development URL to Redirect URLs:
   - `http://localhost:5173/en`
7. After Vercel deploy, add your production URL:
   - `https://YOUR_DOMAIN.vercel.app/en`
   - `https://YOUR_CUSTOM_DOMAIN/en`
8. Go to **Authentication > Providers > Email** and enable Magic Link / OTP sign-in.

## Vercel Deploy From GitHub

1. Push this repository to GitHub.
2. Go to `https://vercel.com/new`.
3. Import the GitHub repository.
4. Vercel should detect **Vite** automatically.
5. Confirm build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Deploy**.
8. After the first deploy, copy the production URL and add it to Supabase Auth Redirect URLs.
9. Redeploy from Vercel if necessary.

The included `vercel.json` adds SPA rewrites so deep links like `/en/dia-connectivity/spain/madrid` and `/en/product/procurement` work after refresh.

## Important Production Notes

- This repository is currently a Vite SPA. It is Vercel-compatible, but it is not a Next.js App Router project.
- Programmatic route pages are client-rendered. For full static SEO generation with `generateStaticParams`, migrate the route layer to Next.js App Router.
- The Supabase SQL is production-ready for the core schema, PostGIS RPC, RLS read policies, and lead insertion policy.
- Add seed data for `node_services` with real provider nodes before using pricing results commercially.
- Keep Supabase service role keys out of the browser. Only use `VITE_SUPABASE_ANON_KEY` client-side.

## Geocoding Notes

Photon returns city-like data under multiple keys depending on the OpenStreetMap object. The app now prioritizes `city`, `town`, `village`, `hamlet`, `municipality`, `locality`, `suburb`, `district`, `county`, and `state` in that order to avoid losing the quoted city.