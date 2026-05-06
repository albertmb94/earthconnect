import type {
  InventoryLocation, InventoryService, InventoryContract,
  InventoryOrder, InventoryTicket, KPIData, SpendByProvider,
  ServiceTypeSpend, MonthlyTrend
} from './types';

const GATEWAY_GLOBAL = 'Gateway Global';

// ===== LOCATIONS (67) =====
// Poland cities (45)
const plCities = [
  { city: 'Warsaw', lat: 52.2297, lng: 21.0122 },
  { city: 'Krakow', lat: 50.0647, lng: 19.9450 },
  { city: 'Gdansk', lat: 54.3520, lng: 18.6466 },
  { city: 'Wroclaw', lat: 51.1079, lng: 17.0385 },
  { city: 'Poznan', lat: 52.4064, lng: 16.9252 },
  { city: 'Lodz', lat: 51.7592, lng: 19.4560 },
  { city: 'Katowice', lat: 50.2649, lng: 19.0238 },
  { city: 'Szczecin', lat: 53.4285, lng: 14.5528 },
  { city: 'Bydgoszcz', lat: 53.1235, lng: 18.0084 },
  { city: 'Lublin', lat: 51.2465, lng: 22.5684 },
  { city: 'Bialystok', lat: 53.1325, lng: 23.1688 },
  { city: 'Gdynia', lat: 54.5189, lng: 18.5305 },
  { city: 'Sopot', lat: 54.4416, lng: 18.5601 },
  { city: 'Czestochowa', lat: 50.8118, lng: 19.1203 },
  { city: 'Radom', lat: 51.4027, lng: 21.1471 },
];

// Fill remaining PL cities by reusing with slight offsets
function generatePLLocations(): InventoryLocation[] {
  const locations: InventoryLocation[] = [];
  const streets = ['ul. Marszalkowska', 'ul. Pulawska', 'ul. Grochowska', 'ul. Modlinska', 'al. Jerozolimskie', 'ul. Swietokrzyska', 'ul. Wspolna', 'ul. Targowa', 'ul. Krakowska', 'ul. Grunwaldzka', 'ul. Wita Stwosza', 'ul. Dluga', 'ul. Podwale', 'ul. Rynek', 'ul. Piotrkowska'];
  
  for (let i = 0; i < 45; i++) {
    const base = plCities[i % plCities.length];
    const street = streets[i % streets.length];
    const num = 10 + (i * 7) % 190;
    locations.push({
      id: `loc-pl-${i + 1}`,
      name: `Office ${i + 1} — ${base.city}`,
      address: `${street} ${num}, ${base.city}`,
      city: base.city,
      country: 'PL',
      countryName: 'Poland',
      lat: base.lat + (Math.random() - 0.5) * 0.02,
      lng: base.lng + (Math.random() - 0.5) * 0.02,
      siteId: `PL-${String(i + 1).padStart(3, '0')}`,
      status: 'active',
      alertCount: i < 3 ? 1 : 0,
      openTickets: i === 0 ? 1 : 0,
      activeServices: 1 + (i % 3),
      currentSpend: 180 + (i * 17) % 220,
      provider: GATEWAY_GLOBAL,
      createdAt: `202${2 + (i % 3)}-0${1 + (i % 9)}-15T10:00:00Z`,
    });
  }
  return locations;
}

// Denmark cities (12)
const dkCities = [
  { city: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
  { city: 'Aarhus', lat: 56.1629, lng: 10.2039 },
  { city: 'Odense', lat: 55.4038, lng: 10.4024 },
  { city: 'Aalborg', lat: 57.0488, lng: 9.9217 },
  { city: 'Esbjerg', lat: 55.4765, lng: 8.4594 },
  { city: 'Randers', lat: 56.4607, lng: 10.0364 },
];

function generateDKLocations(): InventoryLocation[] {
  const locations: InventoryLocation[] = [];
  const streets = ['Bredgade', 'Vesterbrogade', 'Norrebrogade', 'Osterbrogade', 'Amagerbrogade', 'Frederiksborggade'];
  
  for (let i = 0; i < 12; i++) {
    const base = dkCities[i % dkCities.length];
    const street = streets[i % streets.length];
    const num = 10 + (i * 13) % 190;
    locations.push({
      id: `loc-dk-${i + 1}`,
      name: `Branch ${i + 1} — ${base.city}`,
      address: `${street} ${num}, ${base.city}`,
      city: base.city,
      country: 'DK',
      countryName: 'Denmark',
      lat: base.lat + (Math.random() - 0.5) * 0.015,
      lng: base.lng + (Math.random() - 0.5) * 0.015,
      siteId: `DK-${String(i + 1).padStart(3, '0')}`,
      status: 'active',
      alertCount: 0,
      openTickets: 0,
      activeServices: 1 + (i % 2),
      currentSpend: 200 + (i * 23) % 250,
      provider: GATEWAY_GLOBAL,
      createdAt: `202${3 + (i % 2)}-0${1 + (i % 9)}-10T09:00:00Z`,
    });
  }
  return locations;
}

// Lithuania cities (10)
const ltCities = [
  { city: 'Vilnius', lat: 54.6872, lng: 25.2797 },
  { city: 'Kaunas', lat: 54.8985, lng: 23.9036 },
  { city: 'Klaipeda', lat: 55.7033, lng: 21.1443 },
  { city: 'Siauliai', lat: 55.9349, lng: 23.3137 },
  { city: 'Panevezys', lat: 55.7348, lng: 24.3575 },
];

function generateLTLocations(): InventoryLocation[] {
  const locations: InventoryLocation[] = [];
  const streets = ['Gedimino pr.', 'Konstitucijos pr.', 'Jasinskio g.', 'Pilaite', 'Zirmunai', 'Naujamiestis'];
  
  for (let i = 0; i < 10; i++) {
    const base = ltCities[i % ltCities.length];
    const street = streets[i % streets.length];
    const num = 5 + (i * 11) % 150;
    locations.push({
      id: `loc-lt-${i + 1}`,
      name: `Site ${i + 1} — ${base.city}`,
      address: `${street} ${num}, ${base.city}`,
      city: base.city,
      country: 'LT',
      countryName: 'Lithuania',
      lat: base.lat + (Math.random() - 0.5) * 0.012,
      lng: base.lng + (Math.random() - 0.5) * 0.012,
      siteId: `LT-${String(i + 1).padStart(3, '0')}`,
      status: 'active',
      alertCount: i === 2 ? 1 : 0,
      openTickets: 0,
      activeServices: 1,
      currentSpend: 160 + (i * 19) % 180,
      provider: GATEWAY_GLOBAL,
      createdAt: `202${3 + (i % 2)}-0${2 + (i % 8)}-20T11:00:00Z`,
    });
  }
  return locations;
}

export const mockLocations: InventoryLocation[] = [
  ...generatePLLocations(),
  ...generateDKLocations(),
  ...generateLTLocations(),
];

// ===== SERVICES (61) =====
function fmt(d: Date) { return d.toISOString().split('T')[0]; }
const now = new Date();

export const mockServices: InventoryService[] = (() => {
  const services: InventoryService[] = [];
  const activeLocations = mockLocations.filter(l => l.status === 'active');
  const bandwidths = ['100 Mbps', '200 Mbps', '500 Mbps', '1 Gbps', '2 Gbps'];
  
  for (let i = 0; i < 61; i++) {
    const loc = activeLocations[i % activeLocations.length];
    const bw = bandwidths[i % bandwidths.length];
    const spend = 150 + (i * 31) % 280;
    services.push({
      id: `svc-${i + 1}`,
      serviceId: `SVC-${String(i + 1).padStart(3, '0')}`,
      name: `${loc.city} DIA ${bw}`,
      provider: GATEWAY_GLOBAL,
      type: 'Dedicated Internet Access',
      status: i < 58 ? 'active' : i === 58 ? 'pending' : 'suspended',
      expectedMonthlySpend: spend,
      siteId: loc.siteId,
      locationId: loc.id,
      locationName: loc.name,
      country: loc.country,
      billActivationDate: `202${3 + (i % 2)}-0${1 + (i % 9)}-01`,
      completeDate: i < 55 ? `202${3 + (i % 2)}-0${3 + (i % 9)}-15` : null,
      expirationDate: i < 50
        ? fmt(i < 15
            ? new Date(now.getTime() + (30 + i * 6) * 86400000)   // 15 services expiring within ~120d
            : i < 35
              ? new Date(now.getTime() + (150 + (i - 15) * 20) * 86400000) // 20 services expiring 150-550d
              : new Date(now.getTime() + (600 + (i - 35) * 30) * 86400000)) // rest expiring 600d+
        : null,
      bandwidth: bw,
      circuitId: `CIR-${String(i + 1).padStart(4, '0')}`,
      cpeMakeModel: i % 3 === 0 ? 'Cisco ISR 4331' : i % 3 === 1 ? 'Juniper SRX 345' : 'Fortinet FortiGate 60F',
      demarcDetails: `Building MDF, Rack ${(i % 10) + 1}`,
      fiberConnectorType: 'LC/UPC Singlemode',
      ipDetails: {
        dnsPrimary: '8.8.8.8',
        dnsSecondary: '8.8.4.4',
        gateway: `10.${10 + (i % 50)}.${i % 256}.1`,
        subnet: `10.${10 + (i % 50)}.${i % 256}.0/24`,
        subnetType: 'Public Static',
        addressQty: 5 + (i % 10),
        useableRange: `10.${10 + (i % 50)}.${i % 256}.2 - 10.${10 + (i % 50)}.${i % 256}.254`,
        additionalInfo: i % 5 === 0 ? 'BGP session configured' : '',
      },
      lastMile: i % 4 === 0 ? 'Fiber' : i % 4 === 1 ? 'Ethernet' : i % 4 === 2 ? 'xDSL' : 'Wireless',
      managedInventory: i % 2 === 0,
      agentInventory: true,
      billingAccount: `BA-${1000 + i}`,
      serviceProviderId: `SP-${String(i + 1).padStart(3, '0')}`,
    });
  }
  return services;
})();

export const mockContracts: InventoryContract[] = [
  {
    id: 'c-1', contractId: 'CTR-2024-001', name: 'Master Connectivity Agreement 2024',
    provider: GATEWAY_GLOBAL, type: 'Fixed Term', status: 'active',
    startDate: '2024-01-01', endDate: fmt(new Date(now.getFullYear() + 1, 0, 15)), autoRenew: false, mrc: 4250, services: 25, locations: 25,
  },
  {
    id: 'c-2', contractId: 'CTR-2024-002', name: 'Poland Sites Bundle',
    provider: GATEWAY_GLOBAL, type: 'Fixed Term', status: 'active',
    startDate: '2024-03-01', endDate: fmt(new Date(now.getTime() + 45 * 86400000)), autoRenew: true, mrc: 3800, services: 20, locations: 20,
  },
  {
    id: 'c-3', contractId: 'CTR-2024-003', name: 'Nordic Extension',
    provider: GATEWAY_GLOBAL, type: 'Month-to-Month', status: 'active',
    startDate: '2024-06-01', endDate: fmt(new Date(now.getTime() + 130 * 86400000)), autoRenew: true, mrc: 2100, services: 12, locations: 12,
  },
  {
    id: 'c-4', contractId: 'CTR-2023-004', name: 'Baltic Legacy Agreement',
    provider: GATEWAY_GLOBAL, type: 'Fixed Term', status: 'expired',
    startDate: '2023-01-01', endDate: fmt(new Date(now.getTime() - 30 * 86400000)), autoRenew: false, mrc: 1500, services: 8, locations: 8,
  },
  {
    id: 'c-5', contractId: 'CTR-2024-005', name: 'Denmark Branch Rollout',
    provider: GATEWAY_GLOBAL, type: 'Fixed Term', status: 'active',
    startDate: '2024-08-01', endDate: fmt(new Date(now.getTime() + 60 * 86400000)), autoRenew: true, mrc: 2400, services: 10, locations: 10,
  },
  {
    id: 'c-6', contractId: 'CTR-2025-006', name: 'Enterprise Upgrade Plan',
    provider: GATEWAY_GLOBAL, type: 'Fixed Term', status: 'active',
    startDate: '2025-01-01', endDate: fmt(new Date(now.getTime() + 20 * 86400000)), autoRenew: false, mrc: 3100, services: 15, locations: 15,
  },
];

// ===== ORDERS (7) =====
export const mockOrders: InventoryOrder[] = [
  {
    id: 'o-1', orderId: 'ORD-2024-001', name: 'Poland HQ Fiber Installation', company: 'Acme Corp Europe',
    provisioner: { name: 'Jan Kowalski', role: 'Senior Provisioner', email: 'jan.kowalski@gatewayglobal.com', phone: '+48 123 456 789', initials: 'JK' },
    status: 'completed', dealType: 'New Service', createdDate: '2024-01-15', expectedMrc: 450, services: 2, createdBy: 'Maria Nowak',
    description: {
      orderType: 'New Installation', prNumber: 'PR-2024-101', hubspotLink: 'https://app.hubspot.com/deal/101',
      client: 'Acme Corp Europe', provider: GATEWAY_GLOBAL, serviceDetails: '2x DIA 1Gbps',
      term: '36 months', handoffConnector: 'LC/UPC Singlemode', ipRequirements: '/29 Public Static',
      orderDescription: 'Primary and backup DIA circuits for Poland HQ with diverse path routing.',
    },
    locations: [
      { id: 'ol-1', name: 'Warsaw HQ', address: 'ul. Marszalkowska 120, Warsaw', lconEmail: 'it@acme.pl', mrc: 250, nrc: 1200, lastMile: 'Fiber', globalServiceDesk: 'GSD-WAW-001' },
      { id: 'ol-2', name: 'Krakow DC', address: 'ul. Wita Stwosza 45, Krakow', lconEmail: 'dc@acme.pl', mrc: 200, nrc: 950, lastMile: 'Fiber', globalServiceDesk: 'GSD-KRK-001' },
    ],
    sidebar: {
      customerName: 'Acme Corp Europe', customerAddress: 'ul. Marszalkowska 120, Warsaw, Poland', customerWebsite: 'https://acme.eu',
      createdDate: '2024-01-15', estimatedStartDate: '2024-02-01', estimatedEndDate: '2024-04-15', completedDate: '2024-04-10',
    },
  },
  {
    id: 'o-2', orderId: 'ORD-2024-002', name: 'Denmark Office Expansion', company: 'Nordic Logistics A/S',
    provisioner: { name: 'Lars Nielsen', role: 'Provisioner', email: 'lars.nielsen@gatewayglobal.com', phone: '+45 234 567 890', initials: 'LN' },
    status: 'completed', dealType: 'New Service', createdDate: '2024-03-10', expectedMrc: 380, services: 1, createdBy: 'Peter Hansen',
    description: {
      orderType: 'New Installation', prNumber: 'PR-2024-205', hubspotLink: 'https://app.hubspot.com/deal/205',
      client: 'Nordic Logistics A/S', provider: GATEWAY_GLOBAL, serviceDetails: '1x DIA 500Mbps',
      term: '24 months', handoffConnector: 'RJ45 Copper', ipRequirements: '/28 Public Static',
      orderDescription: 'DIA circuit for new Copenhagen logistics hub.',
    },
    locations: [
      { id: 'ol-3', name: 'Copenhagen Hub', address: 'Bredgade 55, Copenhagen', lconEmail: 'it@nordiclogistics.dk', mrc: 380, nrc: 850, lastMile: 'Ethernet', globalServiceDesk: 'GSD-CPH-001' },
    ],
    sidebar: {
      customerName: 'Nordic Logistics A/S', customerAddress: 'Bredgade 55, Copenhagen, Denmark', customerWebsite: 'https://nordiclogistics.dk',
      createdDate: '2024-03-10', estimatedStartDate: '2024-04-01', estimatedEndDate: '2024-06-15', completedDate: '2024-06-01',
    },
  },
  {
    id: 'o-3', orderId: 'ORD-2024-003', name: 'Baltic Backup Circuits', company: 'Baltic Trade OU',
    provisioner: { name: 'Tomas Petrauskas', role: 'Provisioner', email: 'tomas.petrauskas@gatewayglobal.com', phone: '+370 345 678 901', initials: 'TP' },
    status: 'completed', dealType: 'New Service', createdDate: '2024-05-20', expectedMrc: 280, services: 1, createdBy: 'Anna Jankauskaite',
    description: {
      orderType: 'New Installation', prNumber: 'PR-2024-312', hubspotLink: 'https://app.hubspot.com/deal/312',
      client: 'Baltic Trade OU', provider: GATEWAY_GLOBAL, serviceDetails: '1x DIA 200Mbps',
      term: '12 months', handoffConnector: 'LC/UPC Singlemode', ipRequirements: '/30 Public Static',
      orderDescription: 'Backup internet for Vilnius trading floor.',
    },
    locations: [
      { id: 'ol-4', name: 'Vilnius Office', address: 'Gedimino pr. 27, Vilnius', lconEmail: 'ops@baltictrade.lt', mrc: 280, nrc: 600, lastMile: 'Fiber', globalServiceDesk: 'GSD-VNO-001' },
    ],
    sidebar: {
      customerName: 'Baltic Trade OU', customerAddress: 'Gedimino pr. 27, Vilnius, Lithuania', customerWebsite: 'https://baltictrade.lt',
      createdDate: '2024-05-20', estimatedStartDate: '2024-06-01', estimatedEndDate: '2024-08-01', completedDate: '2024-07-25',
    },
  },
  {
    id: 'o-4', orderId: 'ORD-2024-004', name: 'Poland Branch Rollout Q3', company: 'TechFlow Poland Sp. z o.o.',
    provisioner: { name: 'Anna Wojcik', role: 'Senior Provisioner', email: 'anna.wojcik@gatewayglobal.com', phone: '+48 456 789 012', initials: 'AW' },
    status: 'in-progress', dealType: 'New Service', createdDate: '2024-07-01', expectedMrc: 1200, services: 5, createdBy: 'Michal Zielinski',
    description: {
      orderType: 'Bulk Installation', prNumber: 'PR-2024-408', hubspotLink: 'https://app.hubspot.com/deal/408',
      client: 'TechFlow Poland Sp. z o.o.', provider: GATEWAY_GLOBAL, serviceDetails: '5x DIA 100-500Mbps',
      term: '24 months', handoffConnector: 'Mixed', ipRequirements: 'Mixed Static/DHCP',
      orderDescription: 'Rollout of DIA circuits to 5 new branch offices across Poland.',
    },
    locations: [
      { id: 'ol-5', name: 'Gdansk Branch', address: 'ul. Grunwaldzka 85, Gdansk', lconEmail: 'it@techflow.pl', mrc: 180, nrc: 500, lastMile: 'Fiber', globalServiceDesk: 'GSD-GDN-001' },
      { id: 'ol-6', name: 'Wroclaw Branch', address: 'ul. Krakowska 32, Wroclaw', lconEmail: 'it@techflow.pl', mrc: 220, nrc: 600, lastMile: 'Ethernet', globalServiceDesk: 'GSD-WRO-001' },
      { id: 'ol-7', name: 'Poznan Branch', address: 'ul. Piotrkowska 78, Poznan', lconEmail: 'it@techflow.pl', mrc: 200, nrc: 550, lastMile: 'Fiber', globalServiceDesk: 'GSD-POZ-001' },
      { id: 'ol-8', name: 'Katowice Branch', address: 'ul. Warszawska 15, Katowice', lconEmail: 'it@techflow.pl', mrc: 250, nrc: 700, lastMile: 'Fiber', globalServiceDesk: 'GSD-KAT-001' },
      { id: 'ol-9', name: 'Lublin Branch', address: 'ul. Lubelska 44, Lublin', lconEmail: 'it@techflow.pl', mrc: 350, nrc: 800, lastMile: 'Wireless', globalServiceDesk: 'GSD-LUB-001' },
    ],
    sidebar: {
      customerName: 'TechFlow Poland Sp. z o.o.', customerAddress: 'ul. Marszalkowska 10, Warsaw, Poland', customerWebsite: 'https://techflow.pl',
      createdDate: '2024-07-01', estimatedStartDate: '2024-08-01', estimatedEndDate: '2024-11-30', completedDate: null,
    },
  },
  {
    id: 'o-5', orderId: 'ORD-2024-005', name: 'Denmark Aarhus Upgrade', company: 'ScanMed Pharma A/S',
    provisioner: { name: 'Lars Nielsen', role: 'Provisioner', email: 'lars.nielsen@gatewayglobal.com', phone: '+45 234 567 890', initials: 'LN' },
    status: 'completed', dealType: 'Upgrade', createdDate: '2024-08-15', expectedMrc: 520, services: 1, createdBy: 'Soren Pedersen',
    description: {
      orderType: 'Upgrade', prNumber: 'PR-2024-509', hubspotLink: 'https://app.hubspot.com/deal/509',
      client: 'ScanMed Pharma A/S', provider: GATEWAY_GLOBAL, serviceDetails: '1x DIA 1Gbps (from 200Mbps)',
      term: '36 months', handoffConnector: 'LC/UPC Singlemode', ipRequirements: '/28 Public Static (existing)',
      orderDescription: 'Bandwidth upgrade for Aarhus R&D facility.',
    },
    locations: [
      { id: 'ol-10', name: 'Aarhus R&D', address: 'Vesterbrogade 12, Aarhus', lconEmail: 'net@scanmed.dk', mrc: 520, nrc: 400, lastMile: 'Fiber', globalServiceDesk: 'GSD-AAR-001' },
    ],
    sidebar: {
      customerName: 'ScanMed Pharma A/S', customerAddress: 'Vesterbrogade 12, Aarhus, Denmark', customerWebsite: 'https://scanmed.dk',
      createdDate: '2024-08-15', estimatedStartDate: '2024-09-01', estimatedEndDate: '2024-10-15', completedDate: '2024-10-05',
    },
  },
  {
    id: 'o-6', orderId: 'ORD-2024-006', name: 'Lithuania Kaunas New Office', company: 'Kaunas Manufacturing UAB',
    provisioner: { name: 'Tomas Petrauskas', role: 'Provisioner', email: 'tomas.petrauskas@gatewayglobal.com', phone: '+370 345 678 901', initials: 'TP' },
    status: 'in-progress', dealType: 'New Service', createdDate: '2024-09-10', expectedMrc: 310, services: 1, createdBy: 'Ruta Kazlauskas',
    description: {
      orderType: 'New Installation', prNumber: 'PR-2024-611', hubspotLink: 'https://app.hubspot.com/deal/611',
      client: 'Kaunas Manufacturing UAB', provider: GATEWAY_GLOBAL, serviceDetails: '1x DIA 500Mbps',
      term: '24 months', handoffConnector: 'RJ45 Copper', ipRequirements: '/29 Public Static',
      orderDescription: 'Primary internet for new Kaunas manufacturing plant.',
    },
    locations: [
      { id: 'ol-11', name: 'Kaunas Plant', address: 'Savanoriu pr. 88, Kaunas', lconEmail: 'it@kaunasmanuf.lt', mrc: 310, nrc: 750, lastMile: 'Ethernet', globalServiceDesk: 'GSD-KUN-001' },
    ],
    sidebar: {
      customerName: 'Kaunas Manufacturing UAB', customerAddress: 'Savanoriu pr. 88, Kaunas, Lithuania', customerWebsite: 'https://kaunasmanuf.lt',
      createdDate: '2024-09-10', estimatedStartDate: '2024-10-01', estimatedEndDate: '2024-12-15', completedDate: null,
    },
  },
  {
    id: 'o-7', orderId: 'ORD-2024-007', name: 'Poland Lodz & Szczecin', company: 'RetailNet Polska S.A.',
    provisioner: { name: 'Jan Kowalski', role: 'Senior Provisioner', email: 'jan.kowalski@gatewayglobal.com', phone: '+48 123 456 789', initials: 'JK' },
    status: 'completed', dealType: 'New Service', createdDate: '2024-10-01', expectedMrc: 560, services: 2, createdBy: 'Beata Kaminska',
    description: {
      orderType: 'New Installation', prNumber: 'PR-2024-714', hubspotLink: 'https://app.hubspot.com/deal/714',
      client: 'RetailNet Polska S.A.', provider: GATEWAY_GLOBAL, serviceDetails: '2x DIA 200Mbps',
      term: '12 months', handoffConnector: 'LC/UPC Singlemode', ipRequirements: '/30 Public Static each',
      orderDescription: 'Store connectivity for Lodz and Szczecin retail locations.',
    },
    locations: [
      { id: 'ol-12', name: 'Lodz Store', address: 'ul. Piotrkowska 112, Lodz', lconEmail: 'it@retailnet.pl', mrc: 260, nrc: 500, lastMile: 'Fiber', globalServiceDesk: 'GSD-LDZ-001' },
      { id: 'ol-13', name: 'Szczecin Store', address: 'ul. Grochowska 33, Szczecin', lconEmail: 'it@retailnet.pl', mrc: 300, nrc: 600, lastMile: 'Ethernet', globalServiceDesk: 'GSD-SZZ-001' },
    ],
    sidebar: {
      customerName: 'RetailNet Polska S.A.', customerAddress: 'ul. Marszalkowska 50, Warsaw, Poland', customerWebsite: 'https://retailnet.pl',
      createdDate: '2024-10-01', estimatedStartDate: '2024-10-15', estimatedEndDate: '2024-12-01', completedDate: '2024-11-20',
    },
  },
];

// ===== TICKETS (1 open) =====
export const mockTickets: InventoryTicket[] = [
  {
    id: 't-1', ticketId: 'TKT-2025-001', subject: 'Intermittent packet loss on Warsaw HQ DIA',
    status: 'open', priority: 'high', serviceId: 'svc-1', serviceName: 'Warsaw DIA 1 Gbps',
    locationId: 'loc-pl-1', locationName: 'Office 1 — Warsaw',
    createdDate: '2025-04-20', lastUpdated: '2025-05-01',
    description: 'Customer reports 2-3% packet loss during peak hours (9-11 AM CET). MTR traces show loss at third hop. Provider investigating upstream router.',
  },
];

// ===== COMPUTED KPI DATA =====
export const getKPIData = (
  locations?: InventoryLocation[],
  services?: InventoryService[],
  contracts?: InventoryContract[],
  orders?: InventoryOrder[],
  tickets?: InventoryTicket[]
): KPIData => {
  const locs = locations || mockLocations;
  const svcs = services || mockServices;
  const ctrs = contracts || mockContracts;
  const ords = orders || mockOrders;
  const tkts = tickets || mockTickets;

  const activeLocs = locs.filter(l => l.status === 'active');
  const activeLocsWithServices = activeLocs.filter(l => l.activeServices > 0);
  const totalSpend = svcs.reduce((sum, s) => sum + s.expectedMonthlySpend, 0);
  const activeSvcs = svcs.filter(s => s.status === 'active').length;
  const openTkts = tkts.filter(t => t.status === 'open').length;
  const openOrds = ords.filter(o => o.status === 'in-progress' || o.status === 'on-hold').length;
  const activeCtrs = ctrs.filter(c => c.status === 'active').length;
  const m2mCtrs = ctrs.filter(c => c.type === 'Month-to-Month' && c.status === 'active').length;

  const now = new Date();
  const d90 = new Date(now); d90.setDate(d90.getDate() + 90);
  const d180 = new Date(now); d180.setDate(d180.getDate() + 180);
  const d120 = new Date(now); d120.setDate(d120.getDate() + 120);

  const ctrsExp90 = ctrs.filter(c => c.status === 'active' && new Date(c.endDate) <= d90).length;
  const ctrsExp180 = ctrs.filter(c => c.status === 'active' && new Date(c.endDate) <= d180).length;
  const svcsExp120 = svcs.filter(s => s.expirationDate && new Date(s.expirationDate) <= d120).length;

  return {
    activeLocations: activeLocs.length,
    activeLocationsWithServices: activeLocsWithServices.length,
    monthlySpend: totalSpend,
    activeServices: activeSvcs,
    openTickets: openTkts,
    openOrders: openOrds,
    activeContracts: activeCtrs,
    monthToMonthContracts: m2mCtrs,
    contractsExpiring90Days: ctrsExp90,
    ordersWithPendingIssues: 1,
    autoRenewContracts: ctrs.filter(c => c.autoRenew && c.status === 'active').length,
    expiredContracts: ctrs.filter(c => c.status === 'expired').length,
    contractsExpiring180Days: ctrsExp180,
    servicesExpiring120Days: svcsExp120,
  };
};

// ===== CHART DATA =====
export const getSpendByProvider = (services?: InventoryService[]): SpendByProvider[] => {
  const providerMap = new Map<string, number>();
  (services || mockServices).forEach(s => {
    providerMap.set(s.provider, (providerMap.get(s.provider) || 0) + s.expectedMonthlySpend);
  });
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return Array.from(providerMap.entries()).map(([provider, spend], i) => ({
    provider, spend, color: colors[i % colors.length],
  }));
};

export const getServiceTypeSpend = (services?: InventoryService[]): ServiceTypeSpend[] => {
  const typeMap = new Map<string, number>();
  (services || mockServices).forEach(s => {
    typeMap.set(s.type, (typeMap.get(s.type) || 0) + s.expectedMonthlySpend);
  });
  return Array.from(typeMap.entries())
    .map(([type, spend]) => ({ type, spend }))
    .sort((a, b) => b.spend - a.spend);
};

export const getMonthlyTrends = (): MonthlyTrend[] => {
  const months = ['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025'];
  return months.map((month, i) => ({
    month,
    ticketsClosed: [3, 5, 2, 4, 6, 1][i],
    ordersCompleted: [2, 3, 1, 2, 1, 0][i],
  }));
};

// ===== COMMISSION DATA =====
export const mockCommissions = [
  {
    id: 'comm-1', carrierId: 'carr-1', carrierName: 'Gateway Global',
    commissionRate: 12, activeDeals: 4,
    totalMonthlyRevenue: 8450, monthlyCommission: 1014, projectedAnnual: 12168,
  },
  {
    id: 'comm-2', carrierId: 'carr-2', carrierName: 'Lumen Technologies',
    commissionRate: 8, activeDeals: 2,
    totalMonthlyRevenue: 3200, monthlyCommission: 256, projectedAnnual: 3072,
  },
  {
    id: 'comm-3', carrierId: 'carr-3', carrierName: 'Zayo Group',
    commissionRate: 10, activeDeals: 3,
    totalMonthlyRevenue: 5100, monthlyCommission: 510, projectedAnnual: 6120,
  },
  {
    id: 'comm-4', carrierId: 'carr-4', carrierName: 'Colt Technology',
    commissionRate: 15, activeDeals: 1,
    totalMonthlyRevenue: 1800, monthlyCommission: 270, projectedAnnual: 3240,
  },
  {
    id: 'comm-5', carrierId: 'carr-5', carrierName: 'Expereo',
    commissionRate: 7, activeDeals: 2,
    totalMonthlyRevenue: 2100, monthlyCommission: 147, projectedAnnual: 1764,
  },
  {
    id: 'comm-6', carrierId: 'carr-6', carrierName: 'Arelion',
    commissionRate: 9, activeDeals: 1,
    totalMonthlyRevenue: 1500, monthlyCommission: 135, projectedAnnual: 1620,
  },
];

export const getCommissionData = (commissions = mockCommissions) => {
  return {
    monthlyCommission: commissions.reduce((s, c) => s + c.monthlyCommission, 0),
    annualProjected: commissions.reduce((s, c) => s + c.projectedAnnual, 0),
    activeDeals: commissions.reduce((s, c) => s + c.activeDeals, 0),
    totalRevenue: commissions.reduce((s, c) => s + c.totalMonthlyRevenue, 0),
    commissionByCarrier: commissions.map(c => ({
      carrier: c.carrierName,
      commission: c.monthlyCommission,
      revenue: c.totalMonthlyRevenue,
      deals: c.activeDeals,
    })),
  };
};
