import type { CountryData } from './types';

// Helper to generate detailed SEO content based on country characteristics
function generateSEO(
  name: string,
  region: string,
  subregion: string,
  competitors: string[],
  tech: string[],
  svc: Partial<Record<string, boolean>>,
  extra?: {
    hub?: string;
    submarine?: string;
    population?: string;
    gdpRank?: string;
    special?: string;
  }
): { marketOverview: string; competitors: string[]; lastMileTechnologies: string[]; averageBandwidth: string; regulatoryNotes: string; keyInsights: string[] } {
  const hub = extra?.hub || `${name} major cities`;
  const has5g = svc['5g'] ?? false;
  const hasFiber = svc['dark-fiber'] ?? false;
  const hasMpls = svc.mpls ?? true;

  const marketAdj = competitors.length >= 5 ? 'highly competitive' : competitors.length >= 3 ? 'competitive' : 'consolidated';
  const techLevel = has5g && hasFiber ? 'advanced' : has5g || hasFiber ? 'developing' : 'emerging';

  const overview = `${name} has a ${marketAdj} telecommunications market in ${subregion.replace(/-/g, ' ')}. The market is served by ${competitors.slice(0, 3).join(', ')}${competitors.length > 3 ? ` and ${competitors.length - 3} additional operators` : ''}. ${hub} serves as the primary enterprise connectivity hub, hosting internet exchange points and data center facilities that serve both domestic and international customers.\n\nThe enterprise connectivity segment in ${name} is characterized by ${techLevel} infrastructure with ${has5g ? 'commercial 5G services available in major urban areas' : '4G LTE as the primary mobile broadband technology'}${hasFiber ? ' and growing dark fiber availability for enterprise customers' : ''}. ${hasMpls ? 'MPLS and SD-WAN services are widely available from multiple providers, enabling multinational enterprises to build private wide area networks across the country.' : 'Enterprise WAN services are available from select providers.'} ${extra?.submarine ? `International connectivity is provided through ${extra.submarine}.` : 'International connectivity is provided through regional submarine cable systems.'}\n\n${extra?.special || `The regulatory environment in ${name} promotes competition and infrastructure investment, with the national telecom regulator overseeing market liberalization and spectrum allocation. ${has5g ? '5G spectrum has been allocated to mobile operators, enabling deployment of next-generation mobile broadband services.' : 'Spectrum planning for 5G services is underway.'}`}`;

  const bandwidth = svc['5g'] && svc['dark-fiber']
    ? '100 Mbps–10 Gbps (enterprise DIA), 50–500 Mbps (SME)'
    : svc['5g'] || svc['dark-fiber']
    ? '50–500 Mbps (enterprise DIA), 20–200 Mbps (SME)'
    : svc.dia
    ? '20–200 Mbps (enterprise DIA), 10–100 Mbps (SME)'
    : '10–100 Mbps (enterprise), 5–50 Mbps (SME)';

  const regulatory = `The national telecommunications authority regulates the ${name} market, enforcing competition rules and wholesale access requirements. ${has5g ? '5G licenses have been awarded to mobile operators with coverage obligations.' : 'Spectrum planning for advanced mobile services is in progress.'} Infrastructure sharing frameworks are in place to promote efficient network deployment.`;

  const insights = [
    `${marketAdj.charAt(0).toUpperCase() + marketAdj.slice(1)} market with ${competitors.length} major operators competing for enterprise customers`,
    `${hub} is the primary interconnection and data center hub`,
    `${has5g ? '5G services available' : '4G LTE services available'} in major urban areas with expanding coverage`,
    `${hasFiber ? 'Dark fiber available' : 'Fiber infrastructure expanding'} for high-bandwidth enterprise requirements`,
    extra?.submarine ? `International connectivity through ${extra.submarine}` : 'Regional submarine cable connectivity',
  ];

  return {
    marketOverview: overview,
    competitors,
    lastMileTechnologies: tech,
    averageBandwidth: bandwidth,
    regulatoryNotes: regulatory,
    keyInsights: insights,
  };
}

function c(
  code: string, name: string, nameEs: string, region: string, subregion: string, flag: string,
  svc: Partial<Record<string, boolean>>, competitors: string[], tech: string[],
  extra?: { hub?: string; submarine?: string; special?: string }
): CountryData {
  return {
    code, name, nameEs, region, subregion, flag,
    services: [
      { key: 'dia', available: svc.dia ?? true },
      { key: 'broadband', available: svc.broadband ?? true },
      { key: 'mpls', available: svc.mpls ?? true },
      { key: 'dark-fiber', available: svc['dark-fiber'] ?? false },
      { key: '5g', available: svc['5g'] ?? false },
      { key: 'satellite', available: svc.satellite ?? true },
    ],
    seo: generateSEO(name, region, subregion, competitors, tech, svc, extra),
  };
}

export const africaCountries: CountryData[] = [
  // NORTHERN AFRICA
  c('DZ', 'Algeria', 'Argelia', 'africa', 'northern-africa', '🇩🇿', {},
    ['Algérie Télécom', 'Djezzy (OTA)', 'Ooredoo Algeria', 'Lacom'],
    ['ADSL2+', 'FTTH (limited)', '4G LTE', 'VSAT', 'Microwave'],
    { hub: 'Algiers and Oran', submarine: 'the SEA-ME-WE-4 and IMEWE submarine cables landing at Annaba', special: 'Algeria\'s telecom market is dominated by state-owned Algérie Télécom, which controls both fixed-line and backbone infrastructure. The mobile market features three operators competing for subscribers, though enterprise connectivity options remain limited outside major cities. Government investment in digital infrastructure is accelerating, with fiber deployment expanding in Algiers and Oran.' }),
  c('EG', 'Egypt', 'Egipto', 'africa', 'northern-africa', '🇪🇬', { 'dark-fiber': true, '5g': true },
    ['Telecom Egypt', 'Vodafone Egypt', 'Orange Egypt', 'Etisalat Misr', 'Raya Telecom', 'LinkDotNet'],
    ['FTTH', '5G', '4G LTE', 'Dark Fiber', 'Microwave', 'Leased Lines'],
    { hub: 'Cairo and Alexandria', submarine: 'multiple submarine cables including SEA-ME-WE-4, IMEWE, EIG, AAE-1, and 2Africa landing at Alexandria and Suez', special: 'Egypt is a major global connectivity hub with multiple submarine cables landing at Alexandria and Suez, making it a critical junction between Europe, Africa, and Asia. Cairo hosts the MEIX (Middle East Internet Exchange) and a growing data center market. The enterprise segment is served by four mobile operators and multiple fixed-line providers, with strong demand for cloud connectivity driven by expanding cloud provider presence.' }),
  c('LY', 'Libya', 'Libia', 'africa', 'northern-africa', '🇱🇾', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['Libyana', 'Al-Madar', 'Libya Telecom & Technology'],
    ['4G LTE (limited)', 'ADSL', 'VSAT', 'Microwave'],
    { hub: 'Tripoli and Benghazi', special: 'Libya\'s telecom infrastructure has been significantly impacted by years of political instability and conflict. Enterprise connectivity options are extremely limited, with satellite (VSAT) being the primary reliable option for businesses requiring connectivity outside major cities. LTE coverage exists in Tripoli and Benghazi but is unreliable. Reconstruction efforts are gradually improving infrastructure, but the market remains severely constrained.' }),
  c('MA', 'Morocco', 'Marruecos', 'africa', 'northern-africa', '🇲🇦', { 'dark-fiber': true, '5g': true },
    ['Maroc Telecom', 'Orange Morocco', 'inwi', 'Meditelecom', 'Nortel'],
    ['FTTH', 'VDSL2', '5G', '4G LTE', 'DOCSIS 3.0', 'Dark Fiber'],
    { hub: 'Casablanca and Rabat', submarine: 'the ACE, WACS, SEA-ME-WE-3, and SEACOM submarine cables', special: 'Morocco has one of the most advanced telecommunications markets in Africa, with three major mobile operators competing aggressively. Casablanca is the business and financial hub with extensive fiber infrastructure and growing data center capacity. The country\'s strategic position at the crossroads of Europe, Africa, and the Atlantic makes it an attractive connectivity hub, with multiple submarine cable landings providing diverse international routing.' }),
  c('TN', 'Tunisia', 'Túnez', 'africa', 'northern-africa', '🇹🇳', {},
    ['Tunisie Telecom', 'Ooredoo Tunisia', 'Orange Tunisia'],
    ['FTTH (expanding)', 'VDSL2', '4G LTE', 'ADSL2+', 'Microwave'],
    { hub: 'Tunis and Sfax', submarine: 'the SEA-ME-WE-4, HANNIBAL, and Tunisia-IX submarine cables', special: 'Tunisia has a competitive telecom market with three mobile operators. Tunis serves as the primary enterprise hub with growing fiber infrastructure. The country benefits from Mediterranean submarine cable connectivity, providing good international bandwidth to European markets. The IT outsourcing sector is growing, driving demand for enterprise connectivity.' }),
  c('SD', 'Sudan', 'Sudán', 'africa', 'northern-africa', '🇸🇩', { mpls: false },
    ['Sudatel', 'Zain Sudan', 'MTN Sudan', 'Canar Telecom'],
    ['4G LTE', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Khartoum', special: 'Sudan\'s telecom market faces significant challenges due to political instability and economic sanctions. Three mobile operators compete in the market, but enterprise connectivity is limited outside Khartoum. The country has limited international bandwidth through overland fiber connections to neighboring countries and satellite services.' }),
  c('SS', 'South Sudan', 'Sudán del Sur', 'africa', 'northern-africa', '🇸🇸', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['MTN South Sudan', 'Zain South Sudan', 'Vivacell'],
    ['2G/3G', 'VSAT', 'Microwave'],
    { hub: 'Juba', special: 'South Sudan is the world\'s youngest nation and has extremely limited telecommunications infrastructure. The market is mobile-only with 2G/3G services in Juba and a few other towns. Satellite connectivity is critical for any enterprise requirements. The ongoing conflict severely limits infrastructure investment and development.' }),

  // WESTERN AFRICA
  c('NG', 'Nigeria', 'Nigeria', 'africa', 'western-africa', '🇳🇬', { '5g': true },
    ['MTN Nigeria', 'Airtel Nigeria', 'Globacom', '9mobile', 'MainOne (Equinix)', 'Rack Centre', 'Tizeti'],
    ['FTTH', '5G FWA', '4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Lagos and Abuja', submarine: 'the 2Africa, WACS, ACE, and MainOne submarine cables landing at Lagos', special: 'Nigeria is Africa\'s largest economy and most populous country, with a rapidly growing telecommunications market. Lagos is the primary connectivity hub, hosting the IXPN (Internet Exchange Point of Nigeria) and the country\'s largest data center market. The enterprise segment is driven by the booming fintech, e-commerce, and technology sectors. The 2Africa submarine cable landing in Lagos has significantly increased international bandwidth capacity.' }),
  c('GH', 'Ghana', 'Ghana', 'africa', 'western-africa', '🇬🇭', {},
    ['MTN Ghana', 'Vodafone Ghana', 'AirtelTigo', 'Glo Ghana', 'Surfline Communications'],
    ['FTTH (Accra)', '4G LTE', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Accra and Kumasi', submarine: 'the WACS, ACE, and MainOne submarine cables', special: 'Ghana has a competitive telecom market with four mobile operators. Accra is the enterprise hub with growing fiber infrastructure and data center capacity. The country benefits from multiple submarine cable landings providing good international connectivity. Ghana\'s stable political environment and growing economy make it an attractive market for enterprise connectivity investment.' }),
  c('CI', 'Ivory Coast', 'Costa de Marfil', 'africa', 'western-africa', '🇨🇮', {},
    ['Orange CI', 'MTN CI', 'Moov CI', 'Comium CI'],
    ['4G LTE', 'FTTH (Abidjan)', 'Microwave', 'ADSL'],
    { hub: 'Abidjan', submarine: 'the ACE and SAT-3 submarine cables', special: 'Ivory Coast is the economic hub of Francophone West Africa. Abidjan serves as the regional headquarters for many multinational corporations and international organizations. The market is served by three major mobile operators, with growing fiber infrastructure in Abidjan. The ACE submarine cable provides good international connectivity.' }),
  c('SN', 'Senegal', 'Senegal', 'africa', 'western-africa', '🇸🇳', {},
    ['Orange Senegal', 'Free Senegal', 'Expresso Telecom'],
    ['4G LTE', 'FTTH (Dakar)', 'Microwave', 'ADSL'],
    { hub: 'Dakar', submarine: 'the ACE, SAT-3/WASC, and Atlantis-2 submarine cables', special: 'Senegal has a stable and competitive telecom market. Dakar is the primary enterprise hub with growing fiber infrastructure. The country benefits from multiple submarine cable landings, providing diverse international connectivity. The government\'s Digital Senegal 2025 strategy is driving infrastructure investment and digital adoption.' }),
  c('ML', 'Mali', 'Malí', 'africa', 'western-africa', '🇲🇱', { mpls: false },
    ['Orange Mali', 'Malitel', 'Telecel Mali'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Bamako', special: 'Mali is a landlocked country with limited telecommunications infrastructure. Two main mobile operators serve the market, with enterprise connectivity concentrated in Bamako. The country relies on overland fiber connections to neighboring coastal nations for international bandwidth. Satellite connectivity is important for remote areas.' }),
  c('BF', 'Burkina Faso', 'Burkina Faso', 'africa', 'western-africa', '🇧🇫', { mpls: false },
    ['Orange BF', 'Moov BF', 'Onatel'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Ouagadougou and Bobo-Dioulasso', special: 'Burkina Faso is a landlocked country in West Africa with a growing mobile market. Three operators compete, with enterprise connectivity concentrated in Ouagadougou. The country relies on terrestrial fiber connections to coastal neighbors for international bandwidth. Political instability has impacted infrastructure investment in recent years.' }),
  c('NE', 'Niger', 'Níger', 'africa', 'western-africa', '🇳🇪', { mpls: false },
    ['Orange Niger', 'Airtel Niger', 'Moov Niger', 'SahelCom'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Niamey', special: 'Niger is one of the world\'s least connected countries, with very limited telecommunications infrastructure. Three mobile operators serve the market, but coverage is concentrated in Niamey and a few other cities. The country is landlocked and relies on overland fiber to neighboring countries. Satellite connectivity is critical for enterprise requirements outside the capital.' }),
  c('TG', 'Togo', 'Togo', 'africa', 'western-africa', '🇹🇬', { mpls: false },
    ['Togocel', 'Moov Togo'],
    ['4G LTE', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Lomé', submarine: 'the WACS and ACE submarine cables', special: 'Togo is a small West African country with two mobile operators. Lomé is the primary hub with limited but growing fiber infrastructure. The country benefits from submarine cable connectivity through the WACS and ACE systems. Enterprise connectivity options are limited but improving.' }),
  c('BJ', 'Benin', 'Benín', 'africa', 'western-africa', '🇧🇯', { mpls: false },
    ['MTN Benin', 'Moov Benin', 'Libercom', 'SBIN'],
    ['4G LTE', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Cotonou and Porto-Novo', submarine: 'the WACS and ACE submarine cables', special: 'Benin is a small West African country with a growing mobile market. Three operators compete, with Cotonou as the primary business hub. The country benefits from submarine cable connectivity and is positioning itself as a digital hub for the region.' }),
  c('MR', 'Mauritania', 'Mauritania', 'africa', 'western-africa', '🇲🇷', { mpls: false, '5g': false },
    ['Mauritel', 'Chinguitel', 'Mattel'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Nouakchott', submarine: 'the ACE submarine cable', special: 'Mauritania has a small but growing telecom market. Three mobile operators serve the population, with enterprise connectivity concentrated in Nouakchott. The ACE submarine cable provides international connectivity. The market is limited by low population density and challenging geography.' }),
  c('LR', 'Liberia', 'Liberia', 'africa', 'western-africa', '🇱🇷', { mpls: false },
    ['Lonestar Cell MTN', 'Orange Liberia', 'Novafone'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Monrovia', submarine: 'the ACE submarine cable', special: 'Liberia is rebuilding its telecom infrastructure after years of civil conflict. Two main mobile operators serve the market, with enterprise connectivity limited to Monrovia. The ACE submarine cable provides international bandwidth. Infrastructure investment is gradually improving connectivity.' }),
  c('SL', 'Sierra Leone', 'Sierra Leona', 'africa', 'western-africa', '🇸🇱', { mpls: false },
    ['Africell', 'Orange SL', 'Sierratel', 'QCell'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Freetown', submarine: 'the ACE submarine cable', special: 'Sierra Leone has a developing telecom market recovering from civil conflict and the Ebola crisis. Three mobile operators compete, with enterprise connectivity concentrated in Freetown. The ACE submarine cable provides international bandwidth. The market is growing but remains constrained by limited infrastructure.' }),
  c('GM', 'Gambia', 'Gambia', 'africa', 'western-africa', '🇬🇲', { mpls: false },
    ['Africell', 'QCell', 'Gamcel', 'Comium'],
    ['4G LTE', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Banjul and Serekunda', special: 'Gambia is one of Africa\'s smallest countries with a compact telecom market. Four mobile operators compete for a relatively small subscriber base. The country is surrounded by Senegal except for its coastline. Enterprise connectivity is limited but improving with 4G deployment.' }),
  c('GN', 'Guinea', 'Guinea', 'africa', 'western-africa', '🇬🇳', { mpls: false },
    ['MTN Guinea', 'Orange Guinea', 'Cellcom Guinea', 'Intercel'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Conakry', submarine: 'the ACE submarine cable', special: 'Guinea has a growing telecom market with four mobile operators. Conakry is the primary hub with limited but expanding fiber infrastructure. The country has significant mineral resources driving some enterprise connectivity demand. The ACE submarine cable provides international bandwidth.' }),

  // EASTERN AFRICA
  c('KE', 'Kenya', 'Kenia', 'africa', 'eastern-africa', '🇰🇪', { 'dark-fiber': true, '5g': true },
    ['Safaricom', 'Airtel Kenya', 'Telkom Kenya', 'Wananchi Group', 'Liquid Intelligent Technologies', 'Jamii Telecom'],
    ['FTTH', '5G', '4G LTE', 'Microwave', 'Dark Fiber', 'Leased Lines'],
    { hub: 'Nairobi and Mombasa', submarine: 'the Seacom, TEAMS, LION2, and EASSy submarine cables landing at Mombasa', special: 'Kenya is East Africa\'s most advanced telecommunications market and a regional technology hub. Nairobi hosts the KIXP (Kenya Internet Exchange Point) and serves as the headquarters for many African tech companies. Safaricom dominates the market with M-Pesa mobile money driving digital adoption. The country has extensive fiber infrastructure and multiple submarine cable connections at Mombasa.' }),
  c('TZ', 'Tanzania', 'Tanzania', 'africa', 'eastern-africa', '🇹🇿', {},
    ['Vodacom Tanzania', 'Airtel Tanzania', 'Tigo Tanzania', 'Halotel', 'TTCL'],
    ['4G LTE', 'FTTH (Dar es Salaam)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Dar es Salaam', submarine: 'the Seacom, EASSy, and EIG submarine cables', special: 'Tanzania has a competitive mobile market with five operators. Dar es Salaam is the enterprise hub with growing fiber infrastructure. The NICTBB (National ICT Broadband Backbone) connects major cities. The country benefits from multiple submarine cable landings providing international connectivity.' }),
  c('ET', 'Ethiopia', 'Etiopía', 'africa', 'eastern-africa', '🇪🇹', {},
    ['Ethio Telecom', 'Safaricom Ethiopia'],
    ['4G LTE', 'FTTH (Addis Ababa)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Addis Ababa', special: 'Ethiopia is liberalizing its telecom market, ending the state monopoly with the entry of Safaricom Ethiopia. Addis Ababa is the political and business capital, hosting the African Union and numerous international organizations. The market offers significant growth potential with a population of over 120 million. Enterprise connectivity is concentrated in Addis Ababa with limited options elsewhere.' }),
  c('UG', 'Uganda', 'Uganda', 'africa', 'eastern-africa', '🇺🇬', {},
    ['MTN Uganda', 'Airtel Uganda', 'Uganda Telecom', 'Roke Telkom', 'Liquid Intelligent Technologies'],
    ['4G LTE', 'FTTH (Kampala)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Kampala', special: 'Uganda has a competitive mobile market with three major operators. Kampala is the enterprise hub with growing fiber infrastructure through ISPs like Roke Telkom and Liquid Intelligent Technologies. Mobile money adoption is very high, driving digital economy growth. The country is landlocked, relying on fiber connections to Kenya and Tanzania for international bandwidth.' }),
  c('RW', 'Rwanda', 'Ruanda', 'africa', 'eastern-africa', '🇷🇼', { 'dark-fiber': true, '5g': true },
    ['MTN Rwanda', 'Airtel Rwanda', 'KT Rwanda Networks', 'Liquid Intelligent Technologies'],
    ['FTTH', '5G', '4G LTE', 'Microwave', 'Dark Fiber'],
    { hub: 'Kigali', special: 'Rwanda is one of Africa\'s most digitally advanced nations, with the government\'s Smart Rwanda initiative driving aggressive infrastructure deployment. Kigali has extensive fiber infrastructure and is positioning itself as a regional tech hub. The country has deployed 5G in partnership with KT Rwanda Networks. Despite being small and landlocked, Rwanda has achieved remarkable digital progress.' }),
  c('MZ', 'Mozambique', 'Mozambique', 'africa', 'eastern-africa', '🇲🇿', {},
    ['Vodacom Mozambique', 'Movitel', 'Tmcel'],
    ['4G LTE', 'FTTH (Maputo)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Maputo and Beira', submarine: 'the Seacom, EASSy, and WACS submarine cables', special: 'Mozambique has a growing telecom market with three mobile operators. Maputo is the primary enterprise hub, with Beira serving as a secondary market. The country benefits from multiple submarine cable landings, including at Maputo and Beira, providing diverse international connectivity routes.' }),
  c('MG', 'Madagascar', 'Madagascar', 'africa', 'eastern-africa', '🇲🇬', { mpls: false },
    ['Telma', 'Airtel Madagascar', 'Orange Madagascar'],
    ['4G LTE', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Antananarivo', submarine: 'the EASSy, LION2, and METISS submarine cables', special: 'Madagascar is a large island nation with a developing telecom market. Three mobile operators compete, with enterprise connectivity concentrated in Antananarivo. The country has several submarine cable connections providing international bandwidth. The IT outsourcing sector is growing, particularly in Antananarivo.' }),
  c('MU', 'Mauritius', 'Mauricio', 'africa', 'eastern-africa', '🇲🇺', { 'dark-fiber': true, '5g': true },
    ['Emtel', 'Mauritius Telecom', 'MTML', 'Cellplus'],
    ['FTTH', '5G', '4G LTE', 'Dark Fiber', 'Ethernet over Fiber'],
    { hub: 'Port Louis', submarine: 'the SAFE, LION2, and METISS submarine cables', special: 'Mauritius has one of the most advanced telecom markets in Africa. The island nation has three mobile operators and extensive fiber infrastructure. Port Louis is a financial services hub with strong demand for enterprise connectivity. 5G services are available, and the country has multiple submarine cable connections.' }),
  c('SC', 'Seychelles', 'Seychelles', 'africa', 'eastern-africa', '🇸🇨', {},
    ['Cable & Wireless Seychelles', 'Airtel Seychelles'],
    ['4G LTE', 'FTTH', 'VSAT'],
    { hub: 'Victoria', submarine: 'the SAFE submarine cable', special: 'Seychelles is a small island nation with two mobile operators. Victoria is the primary hub with limited but adequate enterprise connectivity for the tourism-driven economy. The SAFE submarine cable provides international bandwidth. The market is small but relatively well-connected for its size.' }),
  c('DJ', 'Djibouti', 'Djibouti', 'africa', 'eastern-africa', '🇩🇯', { mpls: false },
    ['Djibouti Telecom'],
    ['4G LTE', 'Fiber', 'Microwave', 'VSAT'],
    { hub: 'Djibouti City', submarine: 'the SEA-ME-WE-3, SEA-ME-WE-5, EASSy, AAE-1, and DARE submarine cables', special: 'Djibouti is a strategic connectivity hub at the crossroads of Africa, the Middle East, and Asia. Despite being a small country, it hosts an extraordinary number of submarine cable landings, making it one of the most connected points in the region. Djibouti Telecom holds a monopoly, but the submarine cable infrastructure makes it an important transit point.' }),
  c('SO', 'Somalia', 'Somalia', 'africa', 'eastern-africa', '🇸🇴', { mpls: false, '5g': false },
    ['Hormuud Telecom', 'Telesom', 'Golis Telecom', 'Nationlink'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Mogadishu and Hargeisa', special: 'Somalia has a recovering telecom market with multiple private operators competing. Mobile-first market with 4G LTE in Mogadishu and other major cities. The market is fragmented with different operators in different regions. Enterprise connectivity is limited but improving. Satellite is critical for many areas.' }),
  c('ER', 'Eritrea', 'Eritrea', 'africa', 'eastern-africa', '🇪🇷', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['EriTel'],
    ['2G/3G', 'VSAT', 'Microwave'],
    { hub: 'Asmara', special: 'Eritrea has one of the most restricted telecom markets in Africa, with a single state-owned operator. Enterprise connectivity is extremely limited. The country has minimal international bandwidth and relies heavily on satellite for any connectivity needs. Internet penetration is among the lowest in the world.' }),

  // SOUTHERN AFRICA
  c('ZA', 'South Africa', 'Sudáfrica', 'africa', 'southern-africa', '🇿🇦', { 'dark-fiber': true, '5g': true },
    ['Vodacom Business', 'MTN Business', 'Telkom Business', 'Rain', 'Seacom', 'Liquid Intelligent Technologies', 'Dimension Data', 'Lumen Technologies'],
    ['FTTH', '5G', 'FTTB', 'Ethernet over Fiber', 'Dark Fiber', 'Leased Lines'],
    { hub: 'Johannesburg, Cape Town, and Durban', submarine: 'the 2Africa, Equiano, WACS, EASSy, Seacom, and ACE submarine cables', special: 'South Africa has the most developed telecommunications market in Africa. Johannesburg hosts NAPAfrica (Teraco), the continent\'s largest internet exchange. The data center ecosystem in Johannesburg is the largest in Africa, attracting international carriers, cloud providers, and content networks. Four mobile operators compete aggressively, and the enterprise DIA market is well-served by multiple fiber-based providers.' }),
  c('BW', 'Botswana', 'Botsuana', 'africa', 'southern-africa', '🇧🇼', {},
    ['Mascom (MTN)', 'Orange Botswana', 'Botswana Telecommunications Corporation (BTC)'],
    ['4G LTE', 'FTTH (Gaborone)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Gaborone and Francistown', special: 'Botswana has a stable and growing telecom market with three mobile operators. Gaborone is the enterprise hub with expanding fiber infrastructure. The country\'s stable political environment and relatively high GDP per capita make it an attractive market for enterprise connectivity investment. Good connectivity to South Africa provides international bandwidth.' }),
  c('NA', 'Namibia', 'Namibia', 'africa', 'southern-africa', '🇳🇦', {},
    ['MTC', 'TN Mobile', 'Telecom Namibia', 'Paratus Telecom'],
    ['4G LTE', 'FTTH (Windhoek)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Windhoek and Walvis Bay', submarine: 'the WACS submarine cable landing at Swakopmund', special: 'Namibia has a small but growing telecom market with two main mobile operators. Windhoek is the enterprise hub with developing fiber infrastructure. The country benefits from the WACS submarine cable landing at Swakopmund, providing international connectivity. Low population density means coverage gaps outside major cities.' }),
  c('ZM', 'Zambia', 'Zambia', 'africa', 'southern-africa', '🇿🇲', {},
    ['MTN Zambia', 'Airtel Zambia', 'Zamtel'],
    ['4G LTE', 'FTTH (Lusaka)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Lusaka and Kitwe', special: 'Zambia has a competitive mobile market with three operators. Lusaka is the primary enterprise hub with growing fiber infrastructure. The country is landlocked, relying on fiber connections to neighboring countries for international bandwidth. The mining sector drives some enterprise connectivity demand.' }),
  c('ZW', 'Zimbabwe', 'Zimbabwe', 'africa', 'southern-africa', '🇿🇼', {},
    ['Econet', 'NetOne', 'Telecel'],
    ['4G LTE', 'FTTH (Harare)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Harare and Bulawayo', special: 'Zimbabwe has a challenging economic environment but a competitive mobile market with three operators. Harare is the enterprise hub with limited but growing fiber infrastructure. Economic volatility has impacted infrastructure investment, but mobile money adoption is very high. International connectivity is through fiber links to South Africa and Mozambique.' }),
  c('MW', 'Malawi', 'Malawi', 'africa', 'southern-africa', '🇲🇼', { mpls: false },
    ['Airtel Malawi', 'TNM'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Lilongwe and Blantyre', special: 'Malawi is a small, landlocked country with two mobile operators. Enterprise connectivity is very limited, concentrated in Lilongwe and Blantyre. The country relies on fiber connections to Mozambique and Tanzania for international bandwidth. The economy is agriculture-based with limited enterprise demand.' }),
  c('SZ', 'Eswatini', 'Eswatini', 'africa', 'southern-africa', '🇸🇿', { mpls: false },
    ['MTN Eswatini', 'Eswatini Mobile'],
    ['4G LTE', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Mbabane and Manzini', special: 'Eswatini (formerly Swaziland) is a small, landlocked kingdom with two mobile operators. Enterprise connectivity is very limited, with the economy dominated by agriculture and manufacturing. Good connectivity to South Africa provides international bandwidth.' }),
  c('LS', 'Lesotho', 'Lesotho', 'africa', 'southern-africa', '🇱🇸', { mpls: false },
    ['Vodacom Lesotho', 'Econet Telecom Lesotho'],
    ['4G LTE', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Maseru', special: 'Lesotho is a small, landlocked kingdom surrounded entirely by South Africa. Two mobile operators serve the market. Enterprise connectivity is very limited, but the country benefits from its proximity to South Africa\'s advanced telecom infrastructure.' }),

  // MIDDLE AFRICA
  c('CM', 'Cameroon', 'Camerún', 'africa', 'middle-africa', '🇨🇲', {},
    ['MTN Cameroon', 'Orange Cameroon', 'Camtel', 'Nexttel', 'YooMee'],
    ['4G LTE', 'FTTH (Douala, Yaoundé)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Douala and Yaoundé', submarine: 'the SAIL and WACS submarine cables landing at Douala', special: 'Cameroon is the largest economy in Central Africa with a growing telecom market. Douala and Yaoundé are the primary enterprise hubs with developing fiber infrastructure. Four mobile operators compete, with MTN and Orange dominating. The SAIL submarine cable landing at Douala provides international connectivity.' }),
  c('CD', 'DR Congo', 'RD Congo', 'africa', 'middle-africa', '🇨🇩', { mpls: false },
    ['Vodacom DRC', 'Airtel DRC', 'Orange DRC', 'Africell'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'Kinshasa and Lubumbashi', special: 'DR Congo has a large but severely underserved telecom market. Four mobile operators compete in major cities, but coverage outside urban areas is minimal. Kinshasa is the primary hub with limited enterprise connectivity options. The country\'s vast geography and infrastructure challenges make nationwide coverage extremely difficult. Satellite is critical for remote areas.' }),
  c('AO', 'Angola', 'Angola', 'africa', 'middle-africa', '🇦🇴', {},
    ['Unitel', 'Angola Telecom', 'Movicel', 'Africell Angola'],
    ['4G LTE', 'FTTH (Luanda)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Luanda', submarine: 'the SACS submarine cable connecting to Brazil and the WACS cable', special: 'Angola has a growing telecom market driven by oil revenues. Luanda is the primary enterprise hub with developing fiber infrastructure. The SACS submarine cable connects Angola directly to Brazil, making it a strategic gateway between Africa and South America. Unitel dominates the mobile market.' }),
  c('CG', 'Republic of Congo', 'Congo', 'africa', 'middle-africa', '🇨🇬', { mpls: false },
    ['MTN Congo', 'Airtel Congo', 'Congo Telecom'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Brazzaville and Pointe-Noire', special: 'Republic of Congo has a small telecom market with three mobile operators. Brazzaville is the political capital and Pointe-Noire is the economic hub. The oil sector drives some enterprise connectivity demand. International connectivity is through fiber links to neighboring countries.' }),
  c('GA', 'Gabon', 'Gabón', 'africa', 'middle-africa', '🇬🇦', {},
    ['Airtel Gabon', 'Gabon Telecom', 'Moov Gabon'],
    ['4G LTE', 'FTTH (Libreville)', 'Microwave', 'ADSL', 'VSAT'],
    { hub: 'Libreville and Port-Gentil', submarine: 'the ACE and SAT-3 submarine cables', special: 'Gabon has a small but relatively well-developed telecom market for Central Africa. Three mobile operators compete, with Libreville as the primary enterprise hub. The oil sector drives enterprise connectivity demand. The ACE submarine cable provides international bandwidth.' }),
  c('GQ', 'Equatorial Guinea', 'Guinea Ecuatorial', 'africa', 'middle-africa', '🇬🇶', { mpls: false },
    ['GETESA', 'Orange GQ', 'Muni'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'Malabo and Bata', special: 'Equatorial Guinea has a small telecom market dominated by the oil sector. Two main operators serve the market, with enterprise connectivity concentrated in Malabo and Bata. The country has limited international bandwidth through regional submarine cables.' }),
  c('CF', 'Central African Republic', 'Rep. Centroafricana', 'africa', 'middle-africa', '🇨🇫', { dia: false, mpls: false, 'dark-fiber': false, '5g': false },
    ['Telecel CAR', 'Orange CAR'],
    ['2G/3G', 'VSAT', 'Microwave'],
    { hub: 'Bangui', special: 'Central African Republic has extremely limited telecommunications infrastructure due to ongoing conflict and instability. Two mobile operators provide basic 2G/3G services in Bangui. Enterprise connectivity is virtually non-existent outside the capital. Satellite is the only reliable option for most connectivity needs.' }),
  c('TD', 'Chad', 'Chad', 'africa', 'middle-africa', '🇹🇩', { mpls: false },
    ['Airtel Chad', 'Tigo Chad', 'Sotel Chad'],
    ['4G LTE', 'Microwave', 'VSAT', 'ADSL'],
    { hub: 'N\'Djamena', special: 'Chad is a landlocked country with limited telecom infrastructure. Three mobile operators serve the market, with enterprise connectivity concentrated in N\'Djamena. The country relies on fiber connections to neighboring countries for international bandwidth. The oil sector drives some enterprise demand.' }),
  c('ST', 'São Tomé and Príncipe', 'Santo Tomé y Príncipe', 'africa', 'middle-africa', '🇸🇹', { mpls: false, '5g': false },
    ['CST', 'Unitel STP'],
    ['4G LTE', 'Microwave', 'VSAT'],
    { hub: 'São Tomé', special: 'São Tomé and Príncipe is one of Africa\'s smallest countries with a very limited telecom market. Two mobile operators serve the population. Enterprise connectivity is minimal. The country is an island nation with limited international bandwidth through satellite and regional submarine cables.' }),
];
