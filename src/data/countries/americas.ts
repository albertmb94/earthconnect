import type { CountryData } from './types';

export const americasCountries: CountryData[] = [
  {
    code: 'US',
    name: 'United States',
    nameEs: 'Estados Unidos',
    region: 'americas',
    subregion: 'northern-america',
    flag: '🇺🇸',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `The United States has the world's largest and most diverse telecommunications market. Enterprise connectivity is served by a mix of Tier 1 carriers (AT&T, Verizon, Lumen), cable operators (Comcast Business, Spectrum Enterprise), and a thriving ecosystem of competitive carriers, regional providers, and fiber builders. The market offers exceptional depth and competition in major metros, with more limited options in rural areas.

Major interconnection hubs include Ashburn (Northern Virginia) — the world's largest data center market — New York, Chicago, Dallas, Los Angeles, and Silicon Valley. These metros host dense ecosystems of carriers, cloud providers, and content networks, creating highly competitive markets for enterprise DIA and interconnection services.

The US market is characterized by a mix of technologies: fiber-based DIA is widely available in urban areas, while cable (DOCSIS 3.1), fixed wireless (5G/CBRS), and emerging LEO satellite services (Starlink Business, OneWeb) serve as alternatives in underserved areas. The FCC's broadband initiatives are driving fiber expansion into rural markets.`,
      competitors: ['AT&T Business', 'Verizon Business', 'Lumen Technologies', 'Comcast Business', 'Spectrum Enterprise', 'Zayo Group', 'Crown Castle Fiber', 'Consolidated Communications', 'Cogent Communications', 'GTT Communications'],
      lastMileTechnologies: ['Ethernet over Fiber (EoF)', 'FTTH/FTTP', 'DOCSIS 3.1 (Cable)', '5G FWA / CBRS', 'Dark Fiber', 'SONET/SDH (legacy)', 'T1/T3 (legacy)'],
      averageBandwidth: '100 Mbps–10 Gbps (enterprise DIA), 25–1000 Mbps (SME)',
      regulatoryNotes: 'FCC regulates interstate telecommunications. State PUCs regulate intrastate services. Net neutrality rules vary by administration. BEAD program funding rural fiber deployment.',
      keyInsights: [
        'World\'s largest data center market (Ashburn, VA) with 300+ facilities',
        'Deep carrier competition in top 50 metros — 10+ DIA providers typical',
        'Cable operators (Comcast, Spectrum) compete aggressively on SMB DIA',
        '5G FWA and CBRS emerging as viable enterprise connectivity options',
        'Starlink Business and OneWeb expanding satellite enterprise connectivity',
      ],
    },
  },
  {
    code: 'CA',
    name: 'Canada',
    nameEs: 'Canadá',
    region: 'americas',
    subregion: 'northern-america',
    flag: '🇨🇦',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Canada's telecommunications market is dominated by three national carriers — Bell, Rogers, and Telus — who operate both wireless and wireline infrastructure. The enterprise connectivity market is well-developed in major metros (Toronto, Montreal, Vancouver, Calgary) but faces significant challenges in serving the country's vast rural and northern territories.

Toronto is Canada's primary connectivity hub, hosting the TORIX internet exchange and serving as the main interconnection point with US networks. The city's proximity to New York and Ashburn makes it a natural extension of the US Northeast data center corridor. Montreal and Vancouver also serve as important regional hubs with growing data center markets.

The Canadian enterprise market offers strong fiber-based DIA in urban centers, with increasing competition from cable operators (Rogers, Shaw) and alternative carriers. The CRTC's regulatory framework promotes wholesale access to incumbent infrastructure, though the market remains more concentrated than the US.`,
      competitors: ['Bell Business', 'Rogers Business', 'Telus Business', 'Cogeco Business', 'Shaw Business', 'Zayo Group', 'Lumen Technologies', 'Allstream', 'Beanfield'],
      lastMileTechnologies: ['FTTH/FTTP', 'Ethernet over Fiber', 'DOCSIS 3.1 (Cable)', '5G FWA', 'Dark Fiber', 'Leased Lines'],
      averageBandwidth: '100 Mbps–10 Gbps (enterprise DIA), 50–500 Mbps (SME)',
      regulatoryNotes: 'CRTC regulates telecommunications and promotes wholesale access. Broadband fund targets rural connectivity improvement. 5G spectrum allocated across multiple bands.',
      keyInsights: [
        'Toronto (TORIX) is the primary Canadian interconnection hub',
        'Three national carriers dominate — Bell, Rogers, Telus',
        'Strong fiber availability in Toronto, Montreal, Vancouver, Calgary',
        'Growing cable operator competition from Rogers and Shaw',
        'Northern and rural territories rely on satellite and fixed wireless',
      ],
    },
  },
  {
    code: 'BR',
    name: 'Brazil',
    nameEs: 'Brasil',
    region: 'americas',
    subregion: 'south-america',
    flag: '🇧🇷',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Brazil is Latin America's largest telecommunications market, with a rapidly growing enterprise connectivity segment. The market is led by Claro (América Móvil), Vivo (Telefônica Brasil), and Oi, with TIM Brasil as the fourth mobile operator. São Paulo is the primary connectivity hub, hosting the PTT.br (PTTMetro) internet exchange — one of the largest in the Southern Hemisphere.

The Brazilian enterprise market is characterized by strong demand for cloud connectivity, driven by the expansion of AWS, Azure, and Google Cloud regions in São Paulo. Fiber deployment has accelerated dramatically, with hundreds of regional ISPs (provedores regionais) competing with national carriers in smaller cities. Brazil's 5G rollout is one of the most ambitious in Latin America, with standalone networks launching in major cities.

The country's geographic size creates unique challenges for nationwide connectivity. Submarine cables connecting São Paulo to Miami, Fortaleza to Lisbon, and multiple Caribbean routes provide international bandwidth, but domestic long-haul fiber routes face capacity constraints in some regions.`,
      competitors: ['Claro Empresas', 'Vivo Empresas (Telefônica)', 'Oi Empresas', 'TIM Brasil', 'Algar Telecom', 'Ascenty (Data Center)', 'Lumen Technologies', 'GlobeNet', 'Sparkle'],
      lastMileTechnologies: ['FTTH (expanding rapidly)', 'FTTC/VDSL2', '5G SA/NSA', 'DOCSIS 3.1 (Cable)', 'Microwave PTP', 'Satellite (Starlink growing)'],
      averageBandwidth: '100–500 Mbps (urban enterprise), 50–200 Mbps (SME)',
      regulatoryNotes: 'Anatel regulates telecommunications. 5G auction completed with coverage obligations. Fiber deployment regulated with open access requirements in subsidized areas.',
      keyInsights: [
        'São Paulo (PTT.br) is the largest internet exchange in Latin America',
        'Hundreds of regional ISPs compete with national carriers on fiber',
        'AWS, Azure, Google Cloud all have São Paulo regions — driving interconnection demand',
        '5G standalone rollout advancing rapidly in major cities',
        'Submarine cables connect to Miami, Lisbon, and Caribbean hubs',
      ],
    },
  },
  {
    code: 'MX',
    name: 'Mexico',
    nameEs: 'México',
    region: 'americas',
    subregion: 'central-america',
    flag: '🇲🇽',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Mexico's telecommunications market has been transformed by regulatory reforms that broke up the historic monopoly of Telmex/Telcel (Carlos Slim's América Móvil empire). The market now features competition from AT&T Mexico, Telefónica Mexico (sold to AT&T), and a growing number of alternative carriers and fiber builders. Mexico City is the primary connectivity hub, hosting the CIX (CABASE) internet exchange.

The enterprise connectivity market is growing rapidly, driven by nearshoring trends that are bringing manufacturing and technology operations from Asia to Mexico. Cities like Monterrey, Guadalajara, Querétaro, and Ciudad Juárez are experiencing surging demand for enterprise DIA and cloud connectivity. Querétaro has emerged as a major data center hub, attracting AWS, Microsoft, and Google.

Mexico's proximity to the United States creates natural connectivity corridors, with multiple fiber crossings at the border (Laredo, El Paso, Nogales, Tijuana). This makes Mexico an attractive location for enterprises requiring low-latency connectivity to US networks.`,
      competitors: ['Telmex Empresas (América Móvil)', 'AT&T Mexico', 'Totalplay Empresas', 'Megacable', 'IZZI Business', 'Marcatel', 'Cablevisión', 'Lumen Technologies'],
      lastMileTechnologies: ['FTTH (expanding)', 'HFC (Cable)', '5G (limited deployment)', 'Ethernet over Fiber', 'Microwave PTP', 'Leased Lines'],
      averageBandwidth: '50–300 Mbps (enterprise DIA), 20–100 Mbps (SME)',
      regulatoryNotes: 'IFT (Federal Institute of Telecommunications) regulates the market. Preponderant operator (América Móvil) subject to asymmetric regulation. 5G spectrum auction held.',
      keyInsights: [
        'Nearshoring trend driving massive enterprise connectivity demand',
        'Querétaro emerging as Mexico\'s data center capital',
        'Multiple fiber crossings at US-Mexico border for low-latency connectivity',
        'Regulatory reforms created genuine competition after Telmex breakup',
        'Guadalajara and Monterrey are secondary connectivity hubs',
      ],
    },
  },
  {
    code: 'CO',
    name: 'Colombia',
    nameEs: 'Colombia',
    region: 'americas',
    subregion: 'south-america',
    flag: '🇨🇴',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: false, note: 'Limited availability in major cities' },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Colombia's telecommunications market is one of the most competitive in Latin America, with four major mobile operators (Claro, Movistar, Tigo, WOM) and a growing fixed-line enterprise segment. Bogotá is the primary connectivity hub, hosting the NAP Colombia (NAP of the Americas) internet exchange and serving as the country's data center capital.

The enterprise connectivity market is growing rapidly, driven by Colombia's expanding technology sector, digital transformation initiatives, and increasing foreign investment. Medellín has emerged as a secondary tech hub, attracting startups and multinational operations. The government's "Plan Vive Digital" has accelerated fiber deployment in secondary cities.

Colombia's Pacific coast location provides strategic connectivity to both the Atlantic and Pacific submarine cable systems. The country is connected to the South America-1 (SAm-1) cable and has new cables planned to improve international bandwidth redundancy.`,
      competitors: ['Claro Empresas (América Móvil)', 'Movistar Empresas (Telefónica)', 'Tigo Empresas (Millicom)', 'WOM', 'ETB (Empresa de Telecomunicaciones de Bogotá)', 'Azteca Comunicaciones', 'Lumen Technologies'],
      lastMileTechnologies: ['FTTH (expanding in urban areas)', 'HFC (Cable)', '5G (initial deployment)', 'Ethernet over Fiber', 'Microwave PTP', 'Satellite'],
      averageBandwidth: '50–300 Mbps (urban enterprise), 20–100 Mbps (SME)',
      regulatoryNotes: 'CRC (Comisión de Regulación de Comunicaciones) regulates the market. MinTIC sets digital policy. 5G auction completed with coverage targets.',
      keyInsights: [
        'NAP Colombia is a key interconnection point for the Andean region',
        'Bogotá and Medellín are primary enterprise connectivity markets',
        'Four mobile operators create strong competitive dynamics',
        'Pacific coast location provides dual ocean connectivity',
        'Growing data center market driven by cloud provider expansion',
      ],
    },
  },
  {
    code: 'AR',
    name: 'Argentina',
    nameEs: 'Argentina',
    region: 'americas',
    subregion: 'south-america',
    flag: '🇦🇷',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: false, note: 'Very limited availability' },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Argentina has a well-developed telecommunications market centered in Buenos Aires, which serves as the country's primary connectivity hub and hosts the CABASE internet exchange. The market is served by Telefónica (Movistar), Telecom Argentina (Personal/Fibertel), Claro, and a growing number of regional ISPs and alternative carriers.

The Argentine enterprise connectivity market faces challenges from economic volatility and currency restrictions, but Buenos Aires remains a critical connectivity point for the Southern Cone region. The city has a growing data center market, with multiple facilities serving both domestic and international customers. Córdoba and Rosario are secondary enterprise markets.

Argentina's submarine cable connectivity includes the SAm-1 system (connecting to Brazil, Chile, and the US) and the new Malbec cable to Brazil. The country's Atlantic coast position provides strategic connectivity options for enterprises requiring diverse routing.`,
      competitors: ['Telecom Argentina (Personal/Fibertel)', 'Telefónica (Movistar)', 'Claro Argentina', 'Metrotel', 'Silica Networks', 'Nababis', 'Lumen Technologies'],
      lastMileTechnologies: ['FTTH (expanding)', 'HFC (Cable)', '5G (limited)', 'Ethernet over Fiber', 'Microwave PTP', 'Satellite'],
      averageBandwidth: '50–200 Mbps (urban enterprise), 20–100 Mbps (SME)',
      regulatoryNotes: 'ENACOM (Ente Nacional de Comunicaciones) regulates telecommunications. Economic volatility affects infrastructure investment. 5G spectrum allocation in progress.',
      keyInsights: [
        'Buenos Aires (CABASE) is the primary Southern Cone interconnection hub',
        'Economic volatility creates challenges for infrastructure investment',
        'Growing data center market in Buenos Aires metro area',
        'Malbec submarine cable improves connectivity to Brazil',
        'Córdoba and Rosario emerging as secondary enterprise markets',
      ],
    },
  },
  {
    code: 'CL',
    name: 'Chile',
    nameEs: 'Chile',
    region: 'americas',
    subregion: 'south-america',
    flag: '🇨🇱',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Chile has one of the most advanced telecommunications markets in Latin America, with high fiber penetration and strong regulatory oversight. The market is led by Movistar (Telefónica), Claro, Entel, and WOM, with Wom disrupting the mobile market. Santiago is the primary connectivity hub, hosting the PIT Chile (Internet Exchange) and multiple data center facilities.

The Chilean enterprise market benefits from the country's stable economy, strong institutional framework, and strategic Pacific coast location. Santiago's data center market is expanding rapidly, driven by AWS, Google, and Microsoft launching cloud regions in Chile. The country ranks among the highest in Latin America for fiber-to-the-home penetration.

Chile's Pacific coast position makes it a landing point for submarine cables connecting to Asia-Pacific (Curie cable to the US, Mist cable to Japan). This provides enterprises with diverse international routing options beyond traditional Atlantic routes.`,
      competitors: ['Movistar Empresas (Telefónica)', 'Claro Empresas', 'Entel Empresas', 'WOM', 'GTD', 'Telsur', 'Lumen Technologies', 'Internexa'],
      lastMileTechnologies: ['FTTH (high penetration)', '5G (deploying)', 'Ethernet over Fiber', 'Dark Fiber (available in Santiago)', 'Leased Lines', 'Microwave PTP'],
      averageBandwidth: '100–500 Mbps (urban enterprise), 50–200 Mbps (SME)',
      regulatoryNotes: 'Subtel (Subsecretaría de Telecomunicaciones) regulates the market. 5G auction completed. Open access requirements for fiber infrastructure.',
      keyInsights: [
        'Highest FTTH penetration in Latin America',
        'Santiago is a growing data center hub with AWS, Google, Microsoft regions',
        'Curie and Mist submarine cables provide Asia-Pacific connectivity',
        'Strong regulatory framework promotes competition',
        'Stable economy supports sustained infrastructure investment',
      ],
    },
  },
];
