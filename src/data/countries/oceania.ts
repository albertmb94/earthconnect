import type { CountryData } from './types';

export const oceaniaCountries: CountryData[] = [
  {
    code: 'AU',
    name: 'Australia',
    nameEs: 'Australia',
    region: 'oceania',
    subregion: 'australia-nz',
    flag: '🇦🇺',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `Australia has a well-developed telecommunications market, though geographic challenges (vast distances, low population density) create unique infrastructure dynamics. The market is led by Telstra as the dominant incumbent, with Optus (Singtel) and TPG Telecom as the primary competitors. Sydney and Melbourne are the primary connectivity hubs, hosting the Equinix SY4/Melbourne data centers and the PIPE Networks/Superloop internet exchanges.

The Australian enterprise connectivity market benefits from strong demand for cloud connectivity, driven by AWS Sydney, Azure Melbourne, and Google Cloud Sydney regions. The NBN (National Broadband Network) provides wholesale broadband infrastructure, though enterprise DIA is typically served by carrier-grade fiber networks rather than NBN.

Australia's submarine cable connectivity has improved significantly with new cables to Asia (Indigo, ASC) and the US (Southern Cross NEXT, Jupiter), reducing historical dependence on the aging Southern Cross cable system. The country's position as a gateway between Asia-Pacific and the Americas makes it strategically important for multinational enterprises.`,
      competitors: ['Telstra Business', 'Optus Business (Singtel)', 'TPG Telecom', 'Vocus Group', 'Superloop', 'AAPT (TPG)', 'Lumen Technologies', 'Colt Technology Services', 'GTT Communications'],
      lastMileTechnologies: ['FTTP/FTTH (NBN and carriers)', 'FTTN (NBN)', '5G (Telstra, Optus, TPG)', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines'],
      averageBandwidth: '100 Mbps–10 Gbps (metro enterprise), 50–250 Mbps (SME)',
      regulatoryNotes: 'ACMA (Australian Communications and Media Authority) regulates telecommunications. NBN provides wholesale broadband infrastructure. 5G spectrum allocated across multiple bands.',
      keyInsights: [
        'Sydney and Melbourne are primary Asia-Pacific connectivity hubs',
        'AWS, Azure, Google Cloud all have Australian cloud regions',
        'New submarine cables (Indigo, ASC, Jupiter) improve Asia-Pacific connectivity',
        'Telstra dominates enterprise connectivity with 50%+ market share',
        'NBN provides wholesale broadband but enterprise DIA uses carrier fiber',
      ],
    },
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    nameEs: 'Nueva Zelanda',
    region: 'oceania',
    subregion: 'australia-nz',
    flag: '🇳🇿',
    services: [
      { key: 'dia', available: true },
      { key: 'broadband', available: true },
      { key: 'mpls', available: true },
      { key: 'dark-fiber', available: true },
      { key: '5g', available: true },
      { key: 'satellite', available: true },
    ],
    seo: {
      marketOverview: `New Zealand has a competitive telecommunications market served by Spark, Vodafone NZ (now One NZ), and 2degrees. The market is characterized by high urban fiber penetration through the UFB (Ultra-Fast Broadband) government initiative, which has delivered fiber-to-the-premises to 87% of the population. Auckland is the primary connectivity hub, hosting the NZIX (New Zealand Internet Exchange).

The New Zealand enterprise market benefits from the country's advanced digital infrastructure, strong regulatory framework, and growing demand for cloud connectivity. The Southern Cross NEXT submarine cable (2022) significantly increased international bandwidth to Australia and the US, complementing the older Southern Cross cable.

New Zealand's compact geography and high urbanization make enterprise DIA services widely available in major cities (Auckland, Wellington, Christchurch). The country's clean, green brand attracts technology companies and data center investments.`,
      competitors: ['Spark Business', 'One NZ (Vodafone)', '2degrees', 'Vocus NZ', 'Chorus (wholesale)', 'Lumen Technologies', 'Kordia', 'Trustpower'],
      lastMileTechnologies: ['FTTP/FTTH (UFB — 87% coverage)', '5G (Spark, One NZ)', 'HFC (Cable)', 'Ethernet over Fiber', 'Leased Lines', 'Satellite'],
      averageBandwidth: '100 Mbps–1 Gbps (enterprise DIA), 50–300 Mbps (SME)',
      regulatoryNotes: 'Commerce Commission regulates telecommunications. MBIE oversees UFB deployment. Chorus provides wholesale fiber access. 5G spectrum allocated.',
      keyInsights: [
        'UFB initiative delivers FTTH to 87% of population',
        'Auckland (NZIX) is the primary connectivity hub',
        'Southern Cross NEXT cable dramatically improved international bandwidth',
        'Spark and One NZ compete strongly on enterprise connectivity',
        'Compact geography ensures good DIA availability in major cities',
      ],
    },
  },
];
