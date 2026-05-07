import type { CountryData } from './types';

export const europeCountries: CountryData[] = [
  {
    code: 'ES',
    name: 'Spain',
    nameEs: 'España',
    region: 'europe',
    subregion: 'southern-europe',
    flag: '🇪🇸',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Spain has one of the most competitive and advanced telecommunications markets in Europe. The country has achieved near-universal fiber-to-the-home (FTTH) coverage, reaching over 80% of households — one of the highest rates in the EU. The market is dominated by four major operators — Movistar (Telefónica), Vodafone, Orange, and MásMóvil — creating intense competition that drives competitive pricing and continuous infrastructure investment.

The Spanish enterprise connectivity market is characterized by high fiber penetration, growing 5G adoption, and increasing demand for cloud interconnection services. Madrid and Barcelona serve as major data center hubs, attracting international carriers and cloud providers. The regulatory framework enforced by CNMC (Comisión Nacional de los Mercados y la Competencia) ensures open access to wholesale fiber networks, enabling alternative operators to compete effectively.

For multinational enterprises, Spain offers excellent connectivity to both European and Latin American markets through submarine cable systems landing in Barcelona and Bilbao. The country's strategic position as a gateway between Europe, Africa, and the Americas makes it an attractive hub for regional network architecture.`,
      competitors: ['Movistar (Telefónica)', 'Vodafone Spain', 'Orange Spain', 'MásMóvil Group', 'Colt Technology Services', 'Lumen Technologies', 'Zayo Group', 'GTT Communications'],
      lastMileTechnologies: ['FTTH (Fiber to the Home)', '5G FWA (Fixed Wireless Access)', 'DOCSIS 3.1 (Cable)', 'VDSL2', 'Ethernet over Fiber', 'Leased Lines'],
      averageBandwidth: '300–1000 Mbps (urban residential), 100 Mbps–10 Gbps (enterprise DIA)',
      regulatoryNotes: 'CNMC regulates wholesale access to Telefónica\'s fiber network. Operators must provide open access to FTTH infrastructure at regulated prices. 5G spectrum auctions completed across 700 MHz, 3.5 GHz, and 26 GHz bands.',
      keyInsights: [
        'FTTH coverage exceeds 80% of households — among the highest in Europe',
        'Four major carriers compete aggressively on enterprise DIA pricing',
        'Madrid and Barcelona are key interconnection hubs with 20+ data centers',
        '5G standalone networks launching in major cities with enterprise slicing',
        'Submarine cables connect to Americas, Africa, and Mediterranean routes',
      ],
    },
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    nameEs: 'Reino Unido',
    region: 'europe',
    subregion: 'northern-europe',
    flag: '🇬🇧',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `The United Kingdom has one of the world's most mature and competitive enterprise connectivity markets. London is a global Tier 1 internet exchange point and a primary hub for transatlantic submarine cables, making the UK the gateway to Europe for many North American enterprises. The market features deep competition among national carriers, alternative network providers, and international operators.

Full fiber (FTTP) deployment has accelerated significantly, with coverage now exceeding 60% of premises and growing rapidly. The enterprise segment is well-served by multiple fiber-based DIA providers including BT, Virgin Media Business, Vodafone, and numerous alt-nets building independent fiber infrastructure. The UK's regulatory environment, overseen by Ofcom, promotes infrastructure competition and wholesale access.

The UK's exit from the EU has created some regulatory divergence, but the telecommunications market remains one of the most open and competitive globally. For enterprises with pan-European operations, the UK continues to serve as a primary connectivity hub with extensive peering relationships at LINX (London Internet Exchange).`,
      competitors: ['BT Group', 'Virgin Media O2', 'Vodafone UK', 'TalkTalk Business', 'Colt Technology Services', 'Lumen Technologies', 'Zayo Group', 'CityFibre', 'Hyperoptic'],
      lastMileTechnologies: ['FTTP (Fiber to the Premises)', 'FTTC (Fiber to the Cabinet)', 'Leased Lines (EAD)', '5G FWA', 'SoGEA (Single Order Generic Ethernet Access)', 'Dark Fiber'],
      averageBandwidth: '100–1000 Mbps (SME), 100 Mbps–10 Gbps (enterprise DIA)',
      regulatoryNotes: 'Ofcom regulates BT\'s Openreach wholesale access. Physical Infrastructure Access (PIA) allows competitors to use Openreach ducts and poles. 5G spectrum allocated across multiple bands.',
      keyInsights: [
        'London is a Tier 1 IXP and primary transatlantic cable landing point',
        'FTTP rollout accelerating with 60%+ coverage and growing',
        'Deep enterprise DIA competition with 10+ national providers',
        'LINX (London Internet Exchange) is one of world\'s largest peering points',
        'Strong regulatory framework ensures wholesale access and competition',
      ],
    },
  },
  {
    code: 'DE',
    name: 'Germany',
    nameEs: 'Alemania',
    region: 'europe',
    subregion: 'western-europe',
    flag: '🇩🇪',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Germany is Europe's largest economy and telecommunications market, with a highly developed enterprise connectivity landscape. The market is characterized by strong regional variation — major cities like Frankfurt, Munich, Berlin, and Hamburg have excellent fiber infrastructure, while rural areas still rely heavily on copper-based connections. Frankfurt is home to DE-CIX, the world's largest internet exchange by peak traffic.

The German enterprise DIA market is served by Deutsche Telekom as the dominant incumbent, alongside strong competition from Vodafone, Telefónica Deutschland, and numerous alternative carriers including Colt, Lumen, and Zayo. The country has been slower than some European peers in FTTH deployment, but investment has accelerated significantly with multiple fiber builders competing for coverage.

Germany's central European position makes it a critical transit corridor for east-west traffic. The DE-CIX exchange in Frankfurt processes over 10 terabits per second at peak, making it the most important interconnection point in continental Europe. For enterprises requiring ultra-low latency connectivity across Europe, Germany is an essential hub.`,
      competitors: ['Deutsche Telekom', 'Vodafone Germany', 'Telefónica Deutschland', 'Colt Technology Services', 'Lumen Technologies', 'Zayo Group', 'GTT Communications', '1&1 Versatel', 'M-net'],
      lastMileTechnologies: ['FTTH (expanding rapidly)', 'VDSL2 with vectoring', 'Cable (DOCSIS 3.1)', '5G FWA', 'Ethernet over Fiber', 'Leased Lines (MPLS)'],
      averageBandwidth: '100–500 Mbps (urban), 50–100 Mbps (enterprise DIA typical)',
      regulatoryNotes: 'BNetzA (Federal Network Agency) regulates telecommunications. Deutsche Telekom required to provide wholesale access. FTTH deployment targets set for nationwide coverage by 2030.',
      keyInsights: [
        'DE-CIX Frankfurt is the world\'s largest internet exchange by peak traffic',
        'FTTH deployment accelerating — still below EU average but improving fast',
        'Frankfurt is the primary interconnection hub for continental Europe',
        'Strong enterprise DIA market with 15+ competing carriers',
        'Strategic transit corridor for pan-European network architectures',
      ],
    },
  },
  {
    code: 'FR',
    name: 'France',
    nameEs: 'Francia',
    region: 'europe',
    subregion: 'western-europe',
    flag: '🇫🇷',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `France has one of the most advanced telecommunications infrastructures in Europe, with aggressive fiber-to-the-home deployment that now reaches over 80% of households. The enterprise connectivity market is highly competitive, with Orange as the dominant incumbent facing strong challenges from SFR Business, Bouygues Telecom, and numerous alternative operators including Colt, Lumen, and Zayo.

Paris serves as a major European interconnection hub, hosting France-IX and serving as a landing point for multiple transatlantic and African submarine cables. The French market benefits from strong regulatory oversight by ARCEP, which has enforced structural separation of Orange's wholesale operations and mandated open access to fiber infrastructure.

The French enterprise market is characterized by strong demand for cloud connectivity, driven by the presence of major cloud providers' European regions in the Paris area. The government's "France Très Haut Débit" program has accelerated fiber deployment nationwide, with the goal of achieving universal fiber coverage.`,
      competitors: ['Orange Business Services', 'SFR Business', 'Bouygues Telecom', 'Colt Technology Services', 'Lumen Technologies', 'Zayo Group', 'GTT Communications', 'Free Pro', 'Axione'],
      lastMileTechnologies: ['FTTH (80%+ coverage)', 'FTTLA (Fiber to the Last Amplifier)', '5G FWA', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines'],
      averageBandwidth: '200–1000 Mbps (residential FTTH), 100 Mbps–10 Gbps (enterprise DIA)',
      regulatoryNotes: 'ARCEP regulates wholesale access to Orange\'s infrastructure. Physical separation of Orange\'s wholesale arm (Orange Wholesale France). 5G deployment across 700 MHz, 3.5 GHz, and 26 GHz bands.',
      keyInsights: [
        'FTTH coverage exceeds 80% — among the highest globally',
        'Paris is a major European IXP and submarine cable landing hub',
        'Strong regulatory framework ensures competitive wholesale access',
        'Multiple cloud provider regions in Paris area drive interconnection demand',
        'France-IX and Equinix Paris are key peering points for European traffic',
      ],
    },
  },
  {
    code: 'IT',
    name: 'Italy',
    nameEs: 'Italia',
    region: 'europe',
    subregion: 'southern-europe',
    flag: '🇮🇹',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Italy's telecommunications market has undergone significant transformation in recent years, with accelerated fiber deployment and increasing competition. The market is led by TIM (Telecom Italia) as the incumbent, with strong competition from Vodafone Italia, WindTre, and Fastweb (Swisscom). Open Fiber, the wholesale-only operator, has dramatically expanded FTTH coverage, creating a dual-network infrastructure model.

Milan is Italy's primary connectivity hub, hosting the MIX (Milan Internet Exchange) and serving as a major interconnection point for Mediterranean traffic. The Italian enterprise market benefits from competitive pricing driven by infrastructure competition between TIM's fiber network and Open Fiber's wholesale-only approach.

Southern Italy still faces a digital divide, with lower fiber penetration compared to the north. However, government subsidies and EU funding are accelerating rural fiber deployment. For enterprises, Italy offers excellent connectivity to North Africa and the Middle East through submarine cables landing in Sicily and Bari.`,
      competitors: ['TIM Enterprise', 'Vodafone Italia', 'WindTre Business', 'Fastweb', 'Colt Technology Services', 'Lumen Technologies', 'Open Fiber', 'Retelit'],
      lastMileTechnologies: ['FTTH (expanding rapidly)', 'FTTS (Fiber to the Street)', 'VDSL2', '5G FWA', 'Ethernet over Fiber', 'Leased Lines'],
      averageBandwidth: '100–500 Mbps (urban), 100 Mbps–1 Gbps (enterprise DIA)',
      regulatoryNotes: 'AGCOM regulates the market. Open Fiber operates as a wholesale-only operator under regulated terms. TIM\'s network separation into NetCo creates a new wholesale access model.',
      keyInsights: [
        'Dual-network model (TIM + Open Fiber) drives fiber competition',
        'Milan (MIX) is the primary Italian interconnection hub',
        'FTTH coverage growing rapidly — 60%+ in urban areas',
        'Strategic Mediterranean hub connecting Europe to Africa and Middle East',
        'TIM network separation (NetCo) reshaping wholesale access dynamics',
      ],
    },
  },
  {
    code: 'NL',
    name: 'Netherlands',
    nameEs: 'Países Bajos',
    region: 'europe',
    subregion: 'western-europe',
    flag: '🇳🇱',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `The Netherlands has one of the most advanced and competitive telecommunications markets in Europe. With extremely high fiber penetration and a flat geography ideal for network deployment, the country offers exceptional connectivity for enterprises. Amsterdam is a global Tier 1 internet exchange hub, hosting AMS-IX — one of the world's largest internet exchanges.

The market features strong competition between KPN (incumbent), VodafoneZiggo, and numerous alternative fiber builders including Delta Fiber, T-Mobile Netherlands, and international carriers. The Dutch enterprise market is characterized by high bandwidth availability, competitive pricing, and excellent international connectivity through submarine cables connecting to the UK, Scandinavia, and North America.

The Netherlands' position as a digital gateway to Europe is reinforced by the concentration of data centers in the Amsterdam metro area, making it one of the most densely interconnected regions in the world.`,
      competitors: ['KPN', 'VodafoneZiggo', 'T-Mobile Netherlands', 'Delta Fiber', 'Colt Technology Services', 'Lumen Technologies', 'Zayo Group', 'Eurofiber', 'RETN'],
      lastMileTechnologies: ['FTTH (80%+ coverage)', 'DOCSIS 3.1 (Cable)', '5G FWA', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines'],
      averageBandwidth: '200–1000 Mbps (residential), 100 Mbps–10 Gbps (enterprise DIA)',
      regulatoryNotes: 'ACM (Authority for Consumers and Markets) regulates telecommunications. KPN required to provide wholesale access. Multiple fiber builders competing in same areas.',
      keyInsights: [
        'AMS-IX is one of the world\'s largest internet exchanges',
        'Amsterdam is a global Tier 1 interconnection hub',
        'FTTH coverage exceeds 80% with multiple competing networks',
        'Extremely high data center density in Amsterdam metro area',
        'Submarine cables connect to UK, Scandinavia, and North America',
      ],
    },
  },
  {
    code: 'PL',
    name: 'Poland',
    nameEs: 'Polonia',
    region: 'europe',
    subregion: 'eastern-europe',
    flag: '🇵🇱',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Poland is the largest telecommunications market in Central and Eastern Europe, with a rapidly modernizing infrastructure and growing enterprise connectivity demand. The market is served by Orange Polska (incumbent), Play (P4), Plus (Polkomtel), and T-Mobile Polska, creating a competitive quad-play environment. Warsaw is the primary connectivity hub, hosting the PL-IX exchange and attracting increasing international carrier presence.

Fiber deployment has accelerated significantly, with Orange Polska and local operators expanding FTTH coverage across major cities. The Polish enterprise market is growing rapidly, driven by the country's expanding IT sector, shared services centers, and increasing foreign direct investment. Warsaw, Kraków, and Wrocław are emerging as important data center markets.

Poland's strategic position between Western Europe and the CIS countries makes it an important transit corridor. The country benefits from multiple international fiber routes connecting Germany, the Czech Republic, Ukraine, and the Baltic states.`,
      competitors: ['Orange Polska', 'T-Mobile Polska', 'Play (P4)', 'Plus (Polkomtel)', 'Netia', 'Colt Technology Services', 'Lumen Technologies', 'Atman', 'GTS Poland'],
      lastMileTechnologies: ['FTTH (expanding)', 'VDSL2', '5G FWA', 'Ethernet over Fiber', 'Cable (DOCSIS 3.0/3.1)', 'Leased Lines'],
      averageBandwidth: '100–500 Mbps (urban), 50–200 Mbps (enterprise DIA)',
      regulatoryNotes: 'UKE (Office of Electronic Communications) regulates the market. Orange Polska required to provide wholesale access. 5G spectrum auction completed.',
      keyInsights: [
        'Largest telecom market in Central and Eastern Europe',
        'Warsaw (PL-IX) is the primary regional interconnection hub',
        'FTTH deployment accelerating across major cities',
        'Growing data center market in Warsaw, Kraków, and Wrocław',
        'Strategic transit corridor between Western Europe and CIS countries',
      ],
    },
  },
  {
    code: 'PT',
    name: 'Portugal',
    nameEs: 'Portugal',
    region: 'europe',
    subregion: 'southern-europe',
    flag: '🇵🇹',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Portugal has emerged as one of the most fiber-connected countries in Europe, with FTTH coverage exceeding 80% of households — driven by aggressive deployment by MEO (Portugal Telecom), NOS, and Vodafone Portugal. The small geographic size and high population density have enabled rapid fiber rollout, making Portugal one of the best-connected markets in Southern Europe.

Lisbon serves as an important connectivity hub, hosting the GigaPIX internet exchange and serving as a landing point for multiple submarine cables connecting Europe to Africa, South America, and North America. The Portuguese enterprise market benefits from competitive pricing and high service quality, with all three major operators offering comprehensive DIA and managed services.

Portugal's strategic Atlantic position makes it a natural gateway between Europe and the Americas. The Sines submarine cable hub, south of Lisbon, is becoming increasingly important for transatlantic connectivity, with new cables from Google and Meta landing there.`,
      competitors: ['MEO (Portugal Telecom)', 'NOS', 'Vodafone Portugal', 'Colt Technology Services', 'Lumen Technologies', 'Nowo', 'DSTelecom'],
      lastMileTechnologies: ['FTTH (80%+ coverage)', '5G FWA', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines', 'Cable (DOCSIS 3.1)'],
      averageBandwidth: '200–1000 Mbps (residential FTTH), 100 Mbps–10 Gbps (enterprise DIA)',
      regulatoryNotes: 'ANACOM regulates telecommunications. MEO required to provide wholesale fiber access. Government actively promoting digital infrastructure investment.',
      keyInsights: [
        'FTTH coverage exceeds 80% — among the highest in Europe',
        'Lisbon (GigaPIX) is a key Atlantic interconnection point',
        'Sines becoming a major submarine cable hub for transatlantic routes',
        'Three strong national carriers compete on enterprise connectivity',
        'Strategic gateway between Europe, Africa, and South America',
      ],
    },
  },
];
