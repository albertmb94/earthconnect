import type { CountryData } from './types';

function generateSEO(
  name: string, region: string, subregion: string, competitors: string[], tech: string[],
  svc: Partial<Record<string, boolean>>, extra?: { hub?: string; submarine?: string; special?: string }
) {
  const hub = extra?.hub || `${name} major cities`;
  const has5g = svc['5g'] ?? false;
  const hasFiber = svc['dark-fiber'] ?? false;
  const marketAdj = competitors.length >= 5 ? 'highly competitive' : competitors.length >= 3 ? 'competitive' : 'consolidated';

  return {
    marketOverview: `${name} has a ${marketAdj} telecommunications market in ${subregion.replace(/-/g, ' ')}. The market is served by ${competitors.slice(0, 3).join(', ')}${competitors.length > 3 ? ` and ${competitors.length - 3} additional operators` : ''}. ${hub} serves as the primary enterprise connectivity hub.\n\nThe enterprise connectivity segment features ${has5g ? 'commercial 5G services in major urban areas' : '4G LTE as the primary mobile technology'}${hasFiber ? ' and growing dark fiber availability' : ''}. ${extra?.submarine || 'International connectivity is provided through regional submarine cable systems.'}\n\n${extra?.special || `The national telecom regulator enforces competition and wholesale access requirements. ${has5g ? '5G spectrum has been allocated enabling next-generation mobile broadband.' : 'Spectrum planning for advanced services is underway.'}`}`,
    competitors,
    lastMileTechnologies: tech,
    averageBandwidth: svc['5g'] && svc['dark-fiber'] ? '100 Mbps–10 Gbps (enterprise), 50–500 Mbps (SME)' :
      svc['5g'] || svc['dark-fiber'] ? '50–500 Mbps (enterprise), 20–200 Mbps (SME)' :
      svc.dia ? '20–200 Mbps (enterprise), 10–100 Mbps (SME)' : '10–100 Mbps (enterprise), 5–50 Mbps (SME)',
    regulatoryNotes: `National telecom regulator enforces competition and wholesale access requirements. ${has5g ? '5G licenses awarded with coverage obligations.' : 'Spectrum planning underway.'}`,
    keyInsights: [
      `${marketAdj.charAt(0).toUpperCase() + marketAdj.slice(1)} market with ${competitors.length} major operators`,
      `${hub} is the primary interconnection hub`,
      `${has5g ? '5G services available' : '4G LTE services available'} in major urban areas`,
      `${hasFiber ? 'Dark fiber available' : 'Fiber infrastructure expanding'} for enterprise`,
      extra?.submarine ? 'Submarine cable connectivity' : 'Regional connectivity',
    ],
  };
}

function c(code: string, name: string, nameEs: string, subregion: string, flag: string,
  svc: Partial<Record<string, boolean>>, competitors: string[], tech: string[],
  extra?: { hub?: string; submarine?: string; special?: string }): CountryData {
  return {
    code, name, nameEs, region: 'oceania', subregion, flag,
    services: [
      { key: 'dia', available: svc.dia ?? true },
      { key: 'broadband', available: svc.broadband ?? true },
      { key: 'mpls', available: svc.mpls ?? true },
      { key: 'dark-fiber', available: svc['dark-fiber'] ?? false },
      { key: '5g', available: svc['5g'] ?? false },
      { key: 'satellite', available: svc.satellite ?? true },
    ],
    seo: generateSEO(name, 'oceania', subregion, competitors, tech, svc, extra),
  };
}

export const oceaniaCountries: CountryData[] = [
  // AUSTRALIA AND NEW ZEALAND
  c('AU', 'Australia', 'Australia', 'australia-nz', '🇦🇺', { 'dark-fiber': true, '5g': true },
    ['Telstra Business', 'Optus Business', 'TPG Telecom', 'Vocus Group', 'Superloop', 'AAPT', 'Lumen Technologies', 'Colt Technology Services'],
    ['FTTP/FTTH', 'FTTN', '5G', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines'],
    { hub: 'Sydney, Melbourne, and Brisbane', submarine: 'the Southern Cross NEXT, ASC, Indigo, Jupiter, and Hawaiki cables connecting to Asia-Pacific and US', special: 'Australia has a well-developed telecom market with strong enterprise connectivity in major metros. Sydney and Melbourne are primary hubs hosting Equinix and NEXTDC data centers. AWS Sydney, Azure Melbourne, and Google Cloud Sydney regions drive cloud interconnection demand. Telstra dominates enterprise connectivity with 50%+ market share. New submarine cables have significantly improved Asia-Pacific and US connectivity.' }),
  c('NZ', 'New Zealand', 'Nueva Zelanda', 'australia-nz', '🇳🇿', { 'dark-fiber': true, '5g': true },
    ['Spark Business', 'One NZ (Vodafone)', '2degrees', 'Vocus NZ', 'Chorus', 'Kordia'],
    ['FTTP/FTTH (UFB 87%)', '5G', 'HFC', 'Dark Fiber', 'Ethernet over Fiber'],
    { hub: 'Auckland and Wellington', submarine: 'the Southern Cross NEXT, Hawaiki, and Tasman Global Access cables', special: 'New Zealand has a competitive telecom market with the UFB (Ultra-Fast Broadband) initiative delivering FTTH to 87% of the population. Auckland hosts the NZIX (New Zealand Internet Exchange). The Southern Cross NEXT cable dramatically improved international bandwidth. Compact geography ensures good enterprise DIA availability in major cities.' }),

  // MELANESIA
  c('PG', 'Papua New Guinea', 'Papúa Nueva Guinea', 'melanesia', '🇵🇬', { mpls: false, '5g': false },
    ['Digicel PNG', 'bmobile', 'Telikom PNG'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Port Moresby and Lae', submarine: 'the Kumul Submarine Cable and APNG-2', special: 'Papua New Guinea has a challenging telecom environment due to rugged geography and remote communities. Three operators serve the market with limited coverage outside major towns. Enterprise connectivity is concentrated in Port Moresby. Satellite is critical for remote areas.' }),
  c('FJ', 'Fiji', 'Fiyi', 'melanesia', '🇫🇮', {},
    ['Vodafone Fiji', 'Digicel Fiji', 'TFL', 'Inkk Mobile'],
    ['4G LTE', 'FTTH', 'VSAT', 'Microwave'],
    { hub: 'Suva and Nadi', submarine: 'the Southern Cross, ICN1, and Tui-Samoa cables', special: 'Fiji is the most developed telecom market in the Pacific Islands. Four operators serve the market. Suva is the regional hub for many Pacific Island nations. Tourism drives enterprise connectivity demand. Multiple submarine cables provide good international connectivity.' }),
  c('SB', 'Solomon Islands', 'Islas Salomón', 'melanesia', '🇸🇧', { mpls: false, '5g': false },
    ['Our Telekom', 'Bmobile', 'Digicel Solomon'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Honiara', submarine: 'the Coral Sea Cable System connecting to Australia', special: 'Solomon Islands have a developing telecom market with three operators. Honiara is the primary hub. The Coral Sea Cable System (funded by Australia) improved international connectivity. Island geography creates significant coverage challenges.' }),
  c('VU', 'Vanuatu', 'Vanuatu', 'melanesia', '🇻🇺', { mpls: false, '5g': false },
    ['Vodafone Vanuatu', 'Digicel Vanuatu', 'Telsat Pacific'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Port Vila and Luganville', submarine: 'the ICN2 and Tui-Samoa cables', special: 'Vanuatu has a small island telecom market with three operators. Port Vila is the primary hub. Tourism drives some enterprise connectivity demand. Submarine cable connectivity has improved in recent years.' }),
  c('NC', 'New Caledonia', 'Nueva Caledonia', 'melanesia', '🇳🇨', {},
    ['OPT-NC', 'Mobilis', 'Lonly'],
    ['4G LTE', 'FTTH', 'VSAT', 'Microwave'],
    { hub: 'Nouméa', submarine: 'the Gondwana-1 and Honotua cables connecting to Australia and French Polynesia', special: 'New Caledonia is a French territory with a small but well-connected telecom market. OPT-NC is the incumbent with Mobilis as mobile operator. Nouméa is the primary hub. Submarine cables connect to Australia and French Polynesia.' }),

  // MICRONESIA
  c('FM', 'Micronesia', 'Micronesia', 'micronesia', '🇫🇲', { mpls: false, '5g': false },
    ['FSM Telecom', 'IT&E'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Palikir and Weno', special: 'Micronesia is a federated island state with extremely limited telecom infrastructure. Two operators serve the scattered islands. Enterprise connectivity is minimal. Satellite is critical for many islands.' }),
  c('MH', 'Marshall Islands', 'Islas Marshall', 'micronesia', '🇲🇭', { mpls: false, '5g': false },
    ['TTC', 'Digicel Marshall'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Majuro', special: 'Marshall Islands have very limited telecom infrastructure. Two operators serve the atoll nation. Majuro is the only significant market. Satellite is critical for connectivity.' }),
  c('PW', 'Palau', 'Palau', 'micronesia', '🇵🇼', { mpls: false, '5g': false },
    ['PNCC', 'Palau Mobile'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Koror', submarine: 'the Belau Submarine Cable connecting to Guam', special: 'Palau is a small island nation with limited telecom infrastructure. Tourism drives enterprise connectivity demand in Koror. The Belau Submarine Cable provides international connectivity to Guam.' }),
  c('KI', 'Kiribati', 'Kiribati', 'micronesia', '🇰🇮', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['TSKL'],
    ['3G/4G LTE', 'VSAT'],
    { hub: 'Tarawa', special: 'Kiribati is one of the most remote and isolated nations with extremely limited telecom infrastructure. A single operator provides basic mobile services. Satellite is the only reliable connectivity option.' }),
  c('NR', 'Nauru', 'Nauru', 'micronesia', '🇳🇷', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['Digicel Nauru'],
    ['4G LTE', 'VSAT'],
    { hub: 'Yaren', special: 'Nauru is the world\'s smallest republic with extremely limited telecom infrastructure. A single operator provides basic services. Satellite is the primary connectivity option.' }),

  // POLYNESIA
  c('WS', 'Samoa', 'Samoa', 'polynesia', '🇼🇸', { mpls: false },
    ['Digicel Samoa', 'Bluesky Samoa'],
    ['4G LTE', 'FTTH', 'VSAT', 'Microwave'],
    { hub: 'Apia', submarine: 'the Tui-Samoa and Samoa-American Samoa cables', special: 'Samoa has a small island telecom market with two operators. Apia is the primary hub. Tourism drives some enterprise connectivity demand. Submarine cables connect to American Samoa and Fiji.' }),
  c('TO', 'Tonga', 'Tonga', 'polynesia', '🇹🇴', { mpls: false, '5g': false },
    ['Digicel Tonga', 'TCC'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Nuku\'alofa', submarine: 'the Tonga Cable and Tui-Samoa cables', special: 'Tonga has a small island telecom market with two operators. Nuku\'alofa is the primary hub. The Tonga Cable connects to Fiji. Limited enterprise connectivity options.' }),
  c('TV', 'Tuvalu', 'Tuvalu', 'polynesia', '🇹🇻', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['TTC'],
    ['3G/4G LTE', 'VSAT'],
    { hub: 'Funafuti', special: 'Tuvalu is one of the world\'s smallest and most remote nations. A single state-owned operator provides basic services. Satellite is the only connectivity option. One of the smallest telecom markets globally.' }),
  c('CK', 'Cook Islands', 'Islas Cook', 'polynesia', '🇨🇰', { mpls: false, '5g': false },
    ['Bluesky Cook Islands', 'Vodafone Cook Islands'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Avarua', submarine: 'the Manatua Cable connecting to Samoa, Niue, and French Polynesia', special: 'Cook Islands have a small island telecom market serving the tourism industry. Two operators provide services. The Manatuna Cable improved international connectivity.' }),
  c('NU', 'Niue', 'Niue', 'polynesia', '🇳🇺', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['Telecom Niue'],
    ['4G LTE', 'VSAT'],
    { hub: 'Alofi', special: 'Niue is one of the world\'s smallest nations with a single telecom operator. Very limited enterprise connectivity. Satellite is the primary option.' }),
  c('TK', 'Tokelau', 'Tokelau', 'polynesia', '🇹🇰', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['Teletok'],
    ['Satellite', 'VSAT'],
    { hub: 'Nukunonu', special: 'Tokelau is a New Zealand territory with extremely limited telecom infrastructure. A single operator provides satellite-based services. One of the most isolated markets globally.' }),
  c('WF', 'Wallis and Futuna', 'Wallis y Futuna', 'polynesia', '🇼🇫', { mpls: false, '5g': false },
    ['SPT Wallis'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Mata-Utu', special: 'Wallis and Futuna is a French territory with very limited telecom infrastructure. A single operator serves the small population. Satellite provides international connectivity.' }),
  c('AS', 'American Samoa', 'Samoa Americana', 'polynesia', '🇦🇸', {},
    ['Bluesky American Samoa', 'ASTCA'],
    ['4G LTE', 'FTTH', 'Microwave'],
    { hub: 'Pago Pago', submarine: 'the American Samoa-Hawaii cable and Samoa-American Samoa cable', special: 'American Samoa is a US territory with a small telecom market. Two operators serve the population. The Hawaii cable provides connectivity to the US mainland.' }),
  c('PF', 'French Polynesia', 'Polinesia Francesa', 'polynesia', '🇵🇫', {},
    ['Vini (OPT)', 'Vodafone French Polynesia', 'ONATi'],
    ['4G LTE', 'FTTH', 'VSAT', 'Microwave'],
    { hub: 'Papeete', submarine: 'the Honotua and Manatua cables connecting to Hawaii and other Pacific islands', special: 'French Polynesia has a small but well-connected island telecom market. Two operators serve the population. Tourism drives enterprise connectivity demand. The Honotua Cable connects to Hawaii.' }),
  c('NC', 'New Caledonia', 'Nueva Caledonia', 'melanesia', '🇳🇨', {},
    ['OPT-NC', 'Mobilis', 'Lonly'],
    ['4G LTE', 'FTTH', 'VSAT', 'Microwave'],
    { hub: 'Nouméa', submarine: 'the Gondwana-1 and Honotua cables connecting to Australia and French Polynesia', special: 'New Caledonia is a French territory with a small but well-connected telecom market. OPT-NC is the incumbent with Mobilis as mobile operator. Nouméa is the primary hub. Submarine cables connect to Australia and French Polynesia.' }),
];
