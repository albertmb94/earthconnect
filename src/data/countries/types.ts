export type ServiceKey = 'dia' | 'broadband' | 'mpls' | 'dark-fiber' | '5g' | 'satellite';

export interface ServiceAvailability {
  key: ServiceKey;
  available: boolean;
  note?: string;
}

export interface SEOContent {
  marketOverview: string;
  competitors: string[];
  lastMileTechnologies: string[];
  averageBandwidth: string;
  regulatoryNotes: string;
  keyInsights: string[];
}

export interface CountryData {
  code: string;           // ISO 3166-1 alpha-2
  name: string;
  nameEs: string;
  region: string;         // region key
  subregion: string;      // subregion key
  flag: string;           // emoji
  services: ServiceAvailability[];
  seo: SEOContent;
}

export interface Subregion {
  key: string;
  name: string;
  nameEs: string;
}

export interface Region {
  key: string;
  name: string;
  nameEs: string;
  subregions: Subregion[];
}

export const SERVICE_LABELS: Record<ServiceKey, { en: string; es: string; icon: string }> = {
  'dia': { en: 'Dedicated Internet (DIA)', es: 'Internet Dedicado (DIA)', icon: '🔌' },
  'broadband': { en: 'Broadband / FTTX', es: 'Banda Ancha / FTTX', icon: '📡' },
  'mpls': { en: 'MPLS & SD-WAN', es: 'MPLS & SD-WAN', icon: '🌐' },
  'dark-fiber': { en: 'Dark Fiber & EPL', es: 'Fibra Oscura & EPL', icon: '🔗' },
  '5g': { en: '5G Connectivity', es: 'Conectividad 5G', icon: '📶' },
  'satellite': { en: 'Satellite (LEO/MEO/GEO)', es: 'Satélite (LEO/MEO/GEO)', icon: '🛰️' },
};
