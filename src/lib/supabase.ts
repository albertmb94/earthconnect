// Supabase SQL Scripts and Mock Client
export const SQL_SCHEMA = `
-- ==========================================================
-- EARTHCONNECT: POSTGRESQL + POSTGIS SCHEMA & RPC
-- ==========================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create Node-based Services Table (DIA, FTTX, MPLS, Dark Fiber)
CREATE TABLE IF NOT EXISTS node_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requested_tech TEXT NOT NULL,
    requested_country TEXT NOT NULL,
    city TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    price_monthly NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    location GEOGRAPHY(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a spatial index for high-performance proximity queries
CREATE INDEX IF NOT EXISTS idx_node_services_location 
ON node_services USING GIST (location);

-- 3. Create Coverage-based Services Table (5G, Satellite LEO/MEO/GEO)
CREATE TABLE IF NOT EXISTS coverage_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL, -- e.g., "Spain", "United States" (Matches photon API country field)
    service TEXT NOT NULL, -- "5G", "LEO", "MEO", "GEO"
    max_bandwidth TEXT NOT NULL, -- e.g., "1 Gbps", "500 Mbps"
    provider_name TEXT NOT NULL, -- e.g., "Starlink", "OneWeb", "Vodafone"
    provider_scope TEXT NOT NULL, -- "National", "Regional", "Global"
    languages_supported TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coverage_services_country_service 
ON coverage_services(country, service);

-- 4. RPC Function for PostGIS Spatial Percentiles
-- Finds the 10 closest nodes for a technology and calculates P10 and P60 prices
CREATE OR REPLACE FUNCTION get_service_insights(
    in_lat FLOAT8,
    in_lng FLOAT8,
    in_tech TEXT
)
RETURNS TABLE (
    p10_price NUMERIC,
    p60_price NUMERIC,
    nodes_found INTEGER,
    min_distance_km FLOAT8,
    max_distance_km FLOAT8,
    currency_code TEXT
) AS $$
DECLARE
    center_point GEOGRAPHY(Point, 4326);
BEGIN
    -- Construct PostGIS Geography Point from longitude and latitude
    center_point := ST_SetSRID(ST_Point(in_lng, in_lat), 4326)::GEOGRAPHY;

    RETURN QUERY
    WITH closest_nodes AS (
        SELECT 
            price_monthly,
            -- Calculate distance in meters, convert to kilometers
            (ST_Distance(location, center_point) / 1000.0) AS distance_km
        FROM node_services
        WHERE requested_tech = in_tech
        ORDER BY location <-> center_point -- Using KNN GiST index operator
        LIMIT 10
    ),
    stats AS (
        SELECT 
            -- Calculate 10th and 60th percentiles using continuous distribution
            percentile_cont(0.10) WITHIN GROUP (ORDER BY price_monthly) AS p10,
            percentile_cont(0.60) WITHIN GROUP (ORDER BY price_monthly) AS p60,
            COUNT(*)::INTEGER as count_found,
            MIN(distance_km) as min_dist,
            MAX(distance_km) as max_dist
        FROM closest_nodes
    )
    SELECT 
        COALESCE(p10::NUMERIC(10, 2), 0.00) as p10_price,
        COALESCE(p60::NUMERIC(10, 2), 0.00) as p60_price,
        count_found as nodes_found,
        COALESCE(min_dist, 0.00) as min_distance_km,
        COALESCE(max_dist, 0.00) as max_distance_km,
        'USD'::TEXT as currency_code
    FROM stats;
END;
$$ LANGUAGE plpgsql STABLE;

-- Example Seed Data for Testing
/*
INSERT INTO coverage_services (country, service, max_bandwidth, provider_name, provider_scope, languages_supported) VALUES
('Spain', '5G', '1 Gbps', 'Telefónica', 'National', ARRAY['Spanish', 'English']),
('Spain', 'LEO', '500 Mbps', 'Starlink', 'Global', ARRAY['English', 'Spanish', 'French']),
('United States', 'LEO', '500 Mbps', 'Starlink', 'Global', ARRAY['English']),
('France', 'FTTX', '10 Gbps', 'Orange', 'National', ARRAY['French', 'English']);
*/
`;

// Types matching database schema
export interface NodeService {
  id: string;
  requested_tech: string;
  requested_country: string;
  city: string;
  provider_id: string;
  price_monthly: number;
  currency: string;
  lat: number;
  lng: number;
}

export interface CoverageService {
  id: string;
  country: string;
  service: string;
  max_bandwidth: string;
  provider_name: string;
  provider_scope: 'National' | 'Regional' | 'Global';
  languages_supported: string[];
}

export interface ServiceInsights {
  p10_price: number;
  p60_price: number;
  nodes_found: number;
  min_distance_km: number;
  max_distance_km: number;
  currency_code: string;
  nodes_details: Array<{
    provider: string;
    distance: number;
    price: number;
  }>;
}

// ------------------------------------------------------------------
// MOCK DATA LAYER
// ------------------------------------------------------------------
// In a production environment, you would use the Supabase client:
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(URL, KEY)
// ------------------------------------------------------------------

const TECH_PROVIDERS: Record<string, string[]> = {
  DIA: ['Lumen', 'Zayo', 'Colt', 'Cogent', 'GTT', 'Verizon Business'],
  Broadband: ['Comcast Business', 'AT&T Business', 'BT Business', 'Telefónica Empresas', 'Orange Business'],
  MPLS: ['Tata Communications', 'Orange Business', 'Telstra', 'NTT Communications'],
  'Dark Fiber': ['Zayo', 'Euclid', 'CenturyLink', 'Equinix Connect', 'Interxion'],
  '5G': ['Verizon', 'T-Mobile Business', 'Vodafone', 'Movistar', 'Orange', 'Deutsche Telekom'],
  LEO: ['Starlink', 'OneWeb', 'Amazon Project Kuiper'],
  MEO: ['SES O3b mPOWER'],
  GEO: ['HughesNet', 'Viasat', 'Eutelsat']
};

// Country -> primary 5G operators (national) for SEO accuracy
const COUNTRY_5G_OPERATORS: Record<string, string[]> = {
  'Spain': ['Movistar', 'Vodafone'],
  'United States': ['Verizon', 'T-Mobile Business'],
  'United Kingdom': ['Vodafone', 'BT EE'],
  'Germany': ['Deutsche Telekom', 'Vodafone'],
  'France': ['Orange', 'SFR Business'],
  'Mexico': ['Telcel', 'Movistar'],
  'Japan': ['NTT Docomo', 'SoftBank'],
  'Australia': ['Telstra', 'Optus'],
  'Singapore': ['Singtel', 'StarHub'],
  'Canada': ['Bell', 'Rogers']
};

// Country -> language map for SEO/SLA accuracy
const COUNTRY_LANGUAGES: Record<string, string[]> = {
  'Spain': ['Spanish', 'English'],
  'United States': ['English'],
  'United Kingdom': ['English'],
  'Germany': ['German', 'English'],
  'France': ['French', 'English'],
  'Mexico': ['Spanish', 'English'],
  'Japan': ['Japanese', 'English'],
  'Australia': ['English'],
  'Singapore': ['English', 'Mandarin'],
  'Canada': ['English', 'French']
};

const BASE_PRICES: Record<string, { min: number; max: number }> = {
  DIA: { min: 180, max: 2400 },
  Broadband: { min: 45, max: 350 },
  MPLS: { min: 250, max: 3000 },
  'Dark Fiber': { min: 600, max: 4500 },
  '5G': { min: 35, max: 150 },
  LEO: { min: 99, max: 500 },
  MEO: { min: 400, max: 2500 },
  GEO: { min: 80, max: 600 }
};

// Generate mock static data for nodes in Major Cities across the world
const generateMockNodes = (): NodeService[] => {
  const techList = ['DIA', 'Broadband', 'MPLS', 'Dark Fiber'];
  const cities = [
    { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038 },
    { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
    { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
    { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    { name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
    { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 }
  ];

  const nodes: NodeService[] = [];
  let idCounter = 1;

  cities.forEach(c => {
    techList.forEach(tech => {
      const providers = TECH_PROVIDERS[tech] || ['Generic Provider'];
      const priceRange = BASE_PRICES[tech] || { min: 100, max: 1000 };
      
      // Generate 8-15 nodes per city/tech combination
      const nodesCount = Math.floor(Math.random() * 8) + 8;
      
      for (let i = 0; i < nodesCount; i++) {
        const provider = providers[Math.floor(Math.random() * providers.length)];
        
        // Jitter lat/lng slightly to simulate specific street addresses (within ~10km)
        const latJitter = (Math.random() - 0.5) * 0.15;
        const lngJitter = (Math.random() - 0.5) * 0.15;
        
        // Random price following log-normal distribution or uniform in range
        const price = Math.round(priceRange.min + Math.random() * (priceRange.max - priceRange.min));

        nodes.push({
          id: `node-${idCounter++}`,
          requested_tech: tech,
          requested_country: c.country,
          city: c.name,
          provider_id: provider,
          price_monthly: price,
          currency: 'USD',
          lat: c.lat + latJitter,
          lng: c.lng + lngJitter
        });
      }
    });
  });

  return nodes;
};

// Generate mock coverage services
const generateMockCoverage = (): CoverageService[] => {
  const coverage: CoverageService[] = [];
  const countries = Object.keys(COUNTRY_5G_OPERATORS);
  const satTechs = ['5G', 'LEO', 'MEO', 'GEO'];
  
  let idCounter = 1;
  countries.forEach(country => {
    satTechs.forEach(tech => {
      const langs = COUNTRY_LANGUAGES[country] || ['English'];
      
      if (tech === '5G') {
        // National 5G providers per country
        const nationals = COUNTRY_5G_OPERATORS[country] || ['Local Telco'];
        nationals.forEach(provider => {
          coverage.push({
            id: `cov-${idCounter++}`,
            country,
            service: '5G',
            max_bandwidth: '1 Gbps',
            provider_name: provider,
            provider_scope: 'National',
            languages_supported: langs
          });
        });
      } else if (tech === 'LEO') {
        // Global LEO providers
        ['Starlink', 'OneWeb'].forEach(provider => {
          coverage.push({
            id: `cov-${idCounter++}`,
            country,
            service: 'LEO',
            max_bandwidth: '300 Mbps',
            provider_name: provider,
            provider_scope: 'Global',
            languages_supported: ['English', 'Spanish', 'French', 'German']
          });
        });
      } else if (tech === 'MEO') {
        coverage.push({
          id: `cov-${idCounter++}`,
          country,
          service: 'MEO',
          max_bandwidth: '2 Gbps',
          provider_name: 'SES O3b mPOWER',
          provider_scope: 'Global',
          languages_supported: ['English', 'Spanish', 'French']
        });
      } else if (tech === 'GEO') {
        // Regional GEO providers
        const isAmericas = ['United States', 'Mexico', 'Canada'].includes(country);
        const isEurope = ['Spain', 'United Kingdom', 'Germany', 'France'].includes(country);
        
        if (isAmericas) {
          ['HughesNet', 'Viasat'].forEach(provider => {
            coverage.push({
              id: `cov-${idCounter++}`,
              country, service: 'GEO', max_bandwidth: '100 Mbps',
              provider_name: provider, provider_scope: 'Regional',
              languages_supported: langs
            });
          });
        } else if (isEurope) {
          coverage.push({
            id: `cov-${idCounter++}`,
            country, service: 'GEO', max_bandwidth: '100 Mbps',
            provider_name: 'Eutelsat', provider_scope: 'Regional',
            languages_supported: langs
          });
        }
      }
    });
  });

  return coverage;
};

// Pre-generated static data for testing
const MOCK_NODE_SERVICES = generateMockNodes();
const MOCK_COVERAGE_SERVICES = generateMockCoverage();

// Distance function in KM using Haversine formula
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ------------------------------------------------------------------
// SUPABASE RPC AND QUERY MOCK IMPLEMENTATION
// ------------------------------------------------------------------

export const supabaseClientMock = {
  /**
   * Mocks the PostGIS RPC call 'get_service_insights'
   */
  rpc: async (
    _functionName: 'get_service_insights', 
    params: { in_lat: number; in_lng: number; in_tech: string }
  ): Promise<{ data: ServiceInsights[]; error: any }> => {
    // Artificial latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { in_lat, in_lng, in_tech } = params;

    // Filter nodes by technology
    const sameTechNodes = MOCK_NODE_SERVICES.filter(node => node.requested_tech === in_tech);

    if (sameTechNodes.length === 0) {
      // Fallback: create dynamic nodes based on the coordinates if no static data is near
      const fallbackNodes: NodeService[] = [];
      const providers = TECH_PROVIDERS[in_tech] || ['Global Transit Ltd.'];
      const priceRange = BASE_PRICES[in_tech] || { min: 100, max: 1000 };

      for (let i = 0; i < 12; i++) {
        const jitterLat = (Math.random() - 0.5) * 0.1;
        const jitterLng = (Math.random() - 0.5) * 0.1;
        const price = Math.round(priceRange.min + Math.random() * (priceRange.max - priceRange.min));
        fallbackNodes.push({
          id: `fnode-${i}`,
          requested_tech: in_tech,
          requested_country: 'Global',
          city: 'Unknown',
          provider_id: providers[i % providers.length],
          price_monthly: price,
          currency: 'USD',
          lat: in_lat + jitterLat,
          lng: in_lng + jitterLng
        });
      }

      const calculatedNodes = fallbackNodes.map(node => ({
        ...node,
        distance: calculateHaversineDistance(in_lat, in_lng, node.lat, node.lng)
      })).sort((a, b) => a.distance - b.distance);

      const closest10 = calculatedNodes.slice(0, 10);
      const prices = closest10.map(n => n.price_monthly).sort((a, b) => a - b);
      
      const p10 = prices[Math.floor(prices.length * 0.10)];
      const p60 = prices[Math.floor(prices.length * 0.60)];

      return {
        data: [{
          p10_price: p10 || priceRange.min,
          p60_price: p60 || priceRange.min + (priceRange.max - priceRange.min) * 0.6,
          nodes_found: closest10.length,
          min_distance_km: closest10[0].distance,
          max_distance_km: closest10[closest10.length - 1].distance,
          currency_code: 'USD',
          nodes_details: closest10.map(n => ({ provider: n.provider_id, distance: n.distance, price: n.price_monthly }))
        }],
        error: null
      };
    }

    // Calculate distance for all nodes of the requested technology
    const nodesWithDistance = sameTechNodes.map(node => ({
      ...node,
      distance: calculateHaversineDistance(in_lat, in_lng, node.lat, node.lng)
    }));

    // Sort by distance (KNN GiST index simulation) and limit to 10
    const sortedNodes = nodesWithDistance.sort((a, b) => a.distance - b.distance);
    const closest10 = sortedNodes.slice(0, 10);

    // Calculate percentiles
    const prices = closest10.map(n => n.price_monthly).sort((a, b) => a - b);
    const p10Index = Math.max(0, Math.floor(prices.length * 0.1));
    const p60Index = Math.max(0, Math.floor(prices.length * 0.6));
    
    const p10 = prices[p10Index];
    const p60 = prices[p60Index];

    const result: ServiceInsights = {
      p10_price: p10,
      p60_price: p60,
      nodes_found: closest10.length,
      min_distance_km: closest10[0]?.distance || 0,
      max_distance_km: closest10[closest10.length - 1]?.distance || 0,
      currency_code: 'USD',
      nodes_details: closest10.map(n => ({
        provider: n.provider_id,
        distance: n.distance,
        price: n.price_monthly
      }))
    };

    return {
      data: [result],
      error: null
    };
  },

  /**
   * Mocks a coverage service table query
   */
  queryCoverage: async (
    country: string, 
    service: string
  ): Promise<{ data: CoverageService[]; error: any }> => {
    // Artificial latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowercaseCountry = country.toLowerCase();
    
    // Find providers for this service in this country
    // Let's broaden search slightly for countries that might have different naming (e.g., USA vs United States)
    let providers = MOCK_COVERAGE_SERVICES.filter(c => {
      const countryMatches = c.country.toLowerCase() === lowercaseCountry || 
                             (lowercaseCountry.includes('united states') && c.country === 'United States') ||
                             (lowercaseCountry.includes('uk') && c.country === 'United Kingdom') ||
                             (lowercaseCountry.includes('spain') && c.country === 'Spain');
      return countryMatches && c.service === service;
    });

    // If no provider is found for this specific country, provide sensible defaults
    if (providers.length === 0) {
      if (service === 'LEO') {
        providers = [
          { id: `def-leo-1`, country, service: 'LEO', max_bandwidth: '300 Mbps', provider_name: 'Starlink', provider_scope: 'Global', languages_supported: ['English', 'Spanish', 'French'] },
          { id: `def-leo-2`, country, service: 'LEO', max_bandwidth: '300 Mbps', provider_name: 'OneWeb', provider_scope: 'Global', languages_supported: ['English'] }
        ];
      } else if (service === 'MEO') {
        providers = [
          { id: `def-meo-1`, country, service: 'MEO', max_bandwidth: '2 Gbps', provider_name: 'SES O3b mPOWER', provider_scope: 'Global', languages_supported: ['English'] }
        ];
      } else if (service === 'GEO') {
        providers = [
          { id: `def-geo-1`, country, service: 'GEO', max_bandwidth: '100 Mbps', provider_name: 'Intelsat', provider_scope: 'Global', languages_supported: ['English'] }
        ];
      } else if (service === '5G') {
        // For unknown country, use a generic mention so we don't break programmatic SEO
        providers = [
          { id: `def-5g-1`, country, service: '5G', max_bandwidth: '1 Gbps', provider_name: 'Local Tier-1 Operators', provider_scope: 'National', languages_supported: ['English'] }
        ];
      }
    }

    return {
      data: providers,
      error: null
    };
  }
};
