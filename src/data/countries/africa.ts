import type { CountryData } from './types';

export const africaCountries: CountryData[] = [
  {
    code: 'ZA',
    name: 'South Africa',
    nameEs: 'Sudáfrica',
    region: 'africa',
    subregion: 'southern-africa',
    flag: '🇿🇦',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `South Africa has the most developed telecommunications market in Africa, serving as the continent's primary connectivity hub. The market is led by Vodacom, MTN, Telkom, and Rain, with strong competition in both mobile and fixed-line segments. Johannesburg and Cape Town are the primary connectivity points, hosting the NAPAfrica (Teraco) and CINX internet exchanges.

The South African enterprise market benefits from the country's position as the economic gateway to sub-Saharan Africa, with extensive fiber infrastructure in major metros and a growing data center market. Johannesburg's data center ecosystem is the largest in Africa, attracting international carriers, cloud providers, and content networks.

The country's submarine cable connectivity has improved dramatically with the 2Africa, Equiano, and WACS cables, providing massive bandwidth capacity to Europe, the Americas, and Asia. This has significantly reduced international transit costs and improved service quality for enterprise customers.`,
      competitors: ['Vodacom Business', 'MTN Business', 'Telkom Business', 'Rain', 'Seacom', 'Liquid Intelligent Technologies', 'Dimension Data', 'Lumen Technologies', 'GTT Communications'],
      lastMileTechnologies: ['FTTH (expanding in metros)', '5G (Vodacom, Rain, MTN)', 'FTTB (Fiber to the Building)', 'Ethernet over Fiber', 'Leased Lines', 'Satellite (VSAT)'],
      averageBandwidth: '50–500 Mbps (metro enterprise), 20–100 Mbps (SME)',
      regulatoryNotes: 'ICASA (Independent Communications Authority of South Africa) regulates telecommunications. Spectrum auction completed for 5G deployment. Open access requirements for fiber networks.',
      keyInsights: [
        'NAPAfrica (Teraco) is the largest internet exchange in Africa',
        'Johannesburg has the largest data center ecosystem in Africa',
        '2Africa, Equiano, and WACS cables dramatically improve international bandwidth',
        'Vodacom and MTN dominate with combined 80%+ mobile market share',
        'Gateway to sub-Saharan Africa for multinational enterprises',
      ],
    },
  },
  {
    code: 'NG',
    name: 'Nigeria',
    nameEs: 'Nigeria',
    region: 'africa',
    subregion: 'western-africa',
    flag: '🇳🇬',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: false, note: 'Limited availability in Lagos and Abuja' },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Nigeria is Africa's largest economy and most populous country, with a rapidly growing telecommunications market. The market is led by MTN Nigeria, Airtel Nigeria, Globacom, and 9mobile, with growing enterprise connectivity demand driven by the country's expanding fintech, e-commerce, and technology sectors. Lagos is the primary connectivity hub, hosting the IXPN (Internet Exchange Point of Nigeria) and the country's data center market.

The Nigerian enterprise connectivity market faces challenges from infrastructure gaps, power reliability, and regulatory complexity, but the growth trajectory is strong. Lagos and Abuja have developing fiber infrastructure, while other cities rely more on wireless connectivity. The 2Africa submarine cable landing in Lagos has significantly increased international bandwidth capacity.

Nigeria's tech ecosystem — centered in Lagos (often called "Silicon Lagoon") — drives strong demand for enterprise DIA and cloud connectivity. The country's young, digitally native population creates a large addressable market for digital services.`,
      competitors: ['MTN Nigeria Business', 'Airtel Nigeria', 'Globacom', '9mobile', 'MainOne (Equinix)', 'Rack Centre', 'CWG', 'Lumen Technologies', 'Tizeti'],
      lastMileTechnologies: ['FTTH (limited to Lagos/Abuja)', '4G LTE/5G FWA', 'Microwave PTP', 'VSAT (Satellite)', 'Leased Lines', 'Wimax (legacy)'],
      averageBandwidth: '20–100 Mbps (Lagos enterprise), 10–50 Mbps (SME)',
      regulatoryNotes: 'NCC (Nigerian Communications Commission) regulates telecommunications. National Broadband Plan targets 70% broadband penetration. Right of Way charges vary by state.',
      keyInsights: [
        'Lagos is the primary West African connectivity hub',
        '2Africa submarine cable provides massive international bandwidth',
        'Largest tech ecosystem in Africa (fintech, e-commerce)',
        'MTN and Airtel dominate enterprise connectivity',
        'Infrastructure challenges in tier-2/3 cities limit DIA availability',
      ],
    },
  },
];
