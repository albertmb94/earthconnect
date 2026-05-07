import type { CountryData } from './types';

export const asiaCountries: CountryData[] = [
  {
    code: 'JP',
    name: 'Japan',
    nameEs: 'Japón',
    region: 'asia',
    subregion: 'eastern-asia',
    flag: '🇯🇵',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Japan has one of the world's most advanced telecommunications infrastructures, with near-universal fiber-to-the-home coverage and some of the highest broadband speeds globally. The market is led by NTT (Nippon Telegraph and Telephone) as the dominant incumbent, with competition from KDDI, SoftBank, and Rakuten. Tokyo is the primary connectivity hub in Asia-Pacific, hosting the JPNAP and JPIX internet exchanges.

The Japanese enterprise connectivity market is characterized by extreme reliability requirements, ultra-low latency demands, and growing cloud interconnection needs. Tokyo's data center market is one of the largest in the world, serving as the primary gateway between Asia and North America through transpacific submarine cables. Osaka serves as a secondary hub for western Japan.

Japan's 5G deployment is among the most advanced globally, with all four mobile operators (NTT Docomo, KDDI, SoftBank, Rakuten) offering commercial 5G services. The country is also a leader in edge computing deployment, driven by manufacturing automation and IoT requirements.`,
      competitors: ['NTT Communications', 'KDDI', 'SoftBank', 'Rakuten Mobile', 'COLT Technology Services', 'Lumen Technologies', 'Equinix (Japan)', 'ARTERIA Networks', 'Internet Initiative Japan (IIJ)'],
      lastMileTechnologies: ['FTTH (90%+ coverage)', '5G SA/NSA', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines (NTT FLET\'S)', '10GbE/25GbE/100GbE'],
      averageBandwidth: '1–10 Gbps (residential FTTH), 100 Mbps–100 Gbps (enterprise DIA)',
      regulatoryNotes: 'MIC (Ministry of Internal Affairs and Communications) regulates telecommunications. NTT required to provide wholesale access. 5G spectrum allocated across multiple bands.',
      keyInsights: [
        'Near-universal FTTH coverage with 10 Gbps residential services available',
        'Tokyo is the primary Asia-Pacific gateway to North America',
        'JPNAP and JPIX are major Asian internet exchanges',
        'Four 5G operators with advanced standalone deployments',
        'Leading edge computing deployment for manufacturing and IoT',
      ],
    },
  },
  {
    code: 'SG',
    name: 'Singapore',
    nameEs: 'Singapur',
    region: 'asia',
    subregion: 'south-eastern-asia',
    flag: '🇸🇬',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Singapore is one of the world's most connected cities-states and serves as the primary connectivity hub for Southeast Asia. Despite its small geographic size, Singapore hosts an extraordinary concentration of data centers, submarine cables, and carrier points of presence. The market is served by Singtel, StarHub, and M1, with strong competition from international carriers and cloud providers.

The Singaporean enterprise market benefits from the country's position as a regional headquarters for multinational corporations, its business-friendly regulatory environment, and its extensive submarine cable connectivity to Asia-Pacific, Middle East, and Europe. Singapore is home to Equinix's largest facility in Southeast Asia and serves as a major peering point for regional traffic.

Singapore's Smart Nation initiative drives continuous investment in digital infrastructure, including nationwide 5G coverage and fiber-to-every-room deployment in commercial buildings. The country's compact geography means that enterprise DIA services are available virtually everywhere with consistently high quality.`,
      competitors: ['Singtel', 'StarHub Business', 'M1', 'Colt Technology Services', 'Lumen Technologies', 'PCCW Global', 'Telin Singapore', 'RETN', 'Superloop'],
      lastMileTechnologies: ['FTTH (nationwide)', '5G SA (full coverage)', 'Ethernet over Fiber', 'Dark Fiber', '10GbE/100GbE', 'Leased Lines'],
      averageBandwidth: '1–10 Gbps (enterprise DIA), 100 Mbps–1 Gbps (SME)',
      regulatoryNotes: 'IMDA (Infocomm Media Development Authority) regulates telecommunications. Nationwide 5G awarded to Singtel and a joint StarHub-M1 venture. Open access requirements for building fiber.',
      keyInsights: [
        'Primary connectivity hub for Southeast Asia',
        'Extraordinary concentration of data centers and submarine cables',
        'Equinix SG1 is the largest carrier-neutral facility in Southeast Asia',
        'Nationwide 5G standalone coverage from two network operators',
        'Gateway between Asia-Pacific, Middle East, and Europe via submarine cables',
      ],
    },
  },
  {
    code: 'IN',
    name: 'India',
    nameEs: 'India',
    region: 'asia',
    subregion: 'southern-asia',
    flag: '🇮🇳',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `India is one of the world's fastest-growing telecommunications markets, with over 1.2 billion mobile subscribers and rapidly expanding fixed broadband infrastructure. The enterprise connectivity market is led by Airtel Business, Reliance Jio, and Tata Communications, with BSNL serving as the government-owned incumbent. Mumbai and Chennai are the primary connectivity hubs, hosting major internet exchanges (NIXI) and submarine cable landings.

The Indian enterprise market is experiencing explosive growth driven by digital transformation, cloud adoption, and the expansion of global capability centers (GCCs) by multinational corporations. Cities like Mumbai, Delhi NCR, Bangalore, Chennai, Hyderabad, and Pune have well-developed enterprise connectivity ecosystems, while tier-2 and tier-3 cities are rapidly catching up.

India's 5G rollout is one of the largest globally, with Reliance Jio and Airtel deploying standalone 5G networks across major cities. The country's massive scale creates unique challenges for nationwide connectivity, but the competitive market dynamics keep prices among the lowest in the world.`,
      competitors: ['Airtel Business', 'Reliance Jio', 'Tata Communications', 'Vodafone Idea (Vi)', 'BSNL', 'Sify Technologies', 'STT GDC', 'CtrlS', 'Lumen Technologies'],
      lastMileTechnologies: ['FTTH (expanding rapidly)', '5G SA (Jio and Airtel)', 'Leased Lines', 'Ethernet over Fiber', 'DOCSIS 3.1 (Cable)', 'Microwave PTP'],
      averageBandwidth: '100 Mbps–1 Gbps (enterprise DIA), 50–300 Mbps (SME)',
      regulatoryNotes: 'TRAI (Telecom Regulatory Authority of India) and DoT (Department of Telecommunications) regulate the market. Right of Way rules simplified for fiber deployment. 5G spectrum auction completed.',
      keyInsights: [
        'Mumbai and Chennai are primary submarine cable landing points',
        'Fastest-growing enterprise connectivity market globally',
        'Jio and Airtel deploying massive 5G standalone networks',
        'GCC expansion driving enterprise DIA demand in tier-1 cities',
        'Tata Communications provides extensive global MPLS network',
      ],
    },
  },
  {
    code: 'KR',
    name: 'South Korea',
    nameEs: 'Corea del Sur',
    region: 'asia',
    subregion: 'eastern-asia',
    flag: '🇰🇷',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `South Korea has one of the world's most advanced telecommunications infrastructures, consistently ranking at the top globally for broadband speed and penetration. The market is dominated by three major carriers — KT (Korea Telecom), SK Broadband (SK Telecom), and LG U+ — who compete aggressively on both speed and price. Seoul is the primary connectivity hub, hosting the KINX (Korea Internet Neutral Exchange) internet exchange.

The Korean enterprise market benefits from the country's position as a global technology leader, with dense fiber infrastructure, advanced 5G deployments, and growing demand for edge computing and AI-related connectivity. The government's digital New Deal initiative has accelerated investment in data centers and cloud infrastructure.

South Korea's strategic position in Northeast Asia makes it an important connectivity hub between Japan, China, and Southeast Asia. Multiple submarine cables land in Seoul and Busan, providing diverse international connectivity options for enterprises with pan-Asian operations.`,
      competitors: ['KT Enterprise', 'SK Broadband', 'LG U+', 'SK Telecom', 'Colt Technology Services', 'Lumen Technologies', 'Sejong Telecom', 'Dreamline', 'Dacom'],
      lastMileTechnologies: ['FTTH (95%+ coverage)', '10GbE FTTH (available)', '5G SA', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines'],
      averageBandwidth: '1–10 Gbps (residential), 100 Mbps–100 Gbps (enterprise DIA)',
      regulatoryNotes: 'MSIT (Ministry of Science and ICT) regulates telecommunications. KCC (Korea Communications Commission) oversees market competition. 5G spectrum allocated across 3.5 GHz and 28 GHz bands.',
      keyInsights: [
        'World\'s highest broadband speeds — 10GbE residential FTTH available',
        'KINX is a major Northeast Asian internet exchange',
        'Three aggressive national carriers compete on enterprise connectivity',
        'Advanced 5G standalone deployments with enterprise network slicing',
        'Gateway between Japan, China, and Southeast Asia',
      ],
    },
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    nameEs: 'Emiratos Árabes Unidos',
    region: 'asia',
    subregion: 'western-asia',
    flag: '🇦🇪',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `The United Arab Emirates has positioned itself as the premier connectivity hub for the Middle East and North Africa region. Dubai and Abu Dhabi host world-class data center facilities and serve as landing points for multiple submarine cables connecting Europe, Asia, and Africa. The market is served by du and Etisalat (e&), who compete on enterprise services while maintaining a cooperative wholesale framework.

The UAE enterprise market benefits from the country's strategic location between Europe and Asia, its business-friendly free zones (Dubai Internet City, Abu Dhabi Global Market), and its ambitious smart city initiatives. The concentration of multinational regional headquarters in Dubai drives strong demand for enterprise DIA, cloud connectivity, and managed network services.

The UAE's 5G deployment is among the most advanced in the Middle East, with both operators offering commercial 5G services across major urban areas. The government's digital transformation agenda continues to drive investment in fiber infrastructure and edge computing capabilities.`,
      competitors: ['Etisalat (e&)', 'du', 'Equinix Dubai', 'Khazna Data Centers', 'Gulf Data Hub', 'Colt Technology Services', 'Lumen Technologies', 'GTT Communications'],
      lastMileTechnologies: ['FTTH (high coverage)', '5G SA/NSA', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines', 'Microwave PTP'],
      averageBandwidth: '100 Mbps–10 Gbps (enterprise DIA), 50–500 Mbps (SME)',
      regulatoryNotes: 'TDRA (Telecommunications and Digital Government Regulatory Authority) regulates the market. du and Etisalat operate under a duopoly framework. Free zones have separate telecom licensing.',
      keyInsights: [
        'Primary connectivity hub for Middle East and North Africa',
        'Dubai hosts major submarine cable landing stations',
        'Duopoly market with Etisalat (e&) and du',
        'Advanced 5G deployment across major urban areas',
        'Free zones (DIC, ADGM) attract multinational regional headquarters',
      ],
    },
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    nameEs: 'Arabia Saudita',
    region: 'asia',
    subregion: 'western-asia',
    flag: '🇸🇦',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Saudi Arabia is the largest telecommunications market in the Middle East, undergoing rapid transformation driven by the Vision 2030 economic diversification plan. The market is served by STC (Saudi Telecom Company) as the dominant incumbent, with Mobily (Etisalat) and Zain KSA as competitors. Riyadh and Jeddah are the primary connectivity hubs, with growing data center markets.

The Saudi enterprise connectivity market is experiencing unprecedented growth, driven by mega-projects like NEOM, The Line, and the Red Sea development, as well as the expansion of cloud provider regions (AWS, Microsoft, Google all announced Saudi cloud regions). The government's focus on digital transformation is driving massive investment in fiber infrastructure and 5G networks.

Saudi Arabia's geographic position makes it a natural bridge between Europe, Asia, and Africa. The country is connected to multiple submarine cable systems landing in Jeddah (Red Sea) and Dammam (Arabian Gulf), providing diverse international connectivity options.`,
      competitors: ['STC Solutions', 'Mobily Business (Etisalat)', 'Zain KSA', 'Salam (ITC)', 'Equinix Riyadh', 'Mena Digital Hub', 'Lumen Technologies', 'GTT Communications'],
      lastMileTechnologies: ['FTTH (expanding under Vision 2030)', '5G SA/NSA', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines', 'Microwave PTP'],
      averageBandwidth: '100 Mbps–10 Gbps (enterprise DIA), 50–500 Mbps (SME)',
      regulatoryNotes: 'CST (Communications, Space and Technology Commission) regulates the market. Vision 2030 drives massive infrastructure investment. Cloud regions announced by AWS, Microsoft, Google.',
      keyInsights: [
        'Largest telecom market in the Middle East by revenue',
        'Vision 2030 driving massive fiber and 5G investment',
        'AWS, Microsoft, Google all launching Saudi cloud regions',
        'STC dominates with 70%+ market share',
        'Red Sea (Jeddah) and Arabian Gulf (Dammam) submarine cable landings',
      ],
    },
  },
];
