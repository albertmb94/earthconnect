export interface InventoryLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string; // 'PL' | 'DK' | 'LT'
  countryName: string;
  lat: number;
  lng: number;
  siteId: string;
  status: 'active' | 'inactive';
  alertCount: number;
  openTickets: number;
  activeServices: number;
  currentSpend: number; // monthly
  provider: string;
  createdAt: string;
}

export interface InventoryService {
  id: string;
  serviceId: string; // displayed ID like "SVC-001"
  name: string;
  provider: string;
  type: string; // 'Dedicated Internet Access' | 'DIA' | etc.
  status: 'active' | 'pending' | 'suspended' | 'cancelled';
  expectedMonthlySpend: number;
  siteId: string;
  locationId: string;
  locationName: string;
  country: string;
  billActivationDate: string | null;
  completeDate: string | null;
  expirationDate: string | null;
  bandwidth: string;
  circuitId: string;
  cpeMakeModel: string;
  demarcDetails: string;
  fiberConnectorType: string;
  ipDetails: {
    dnsPrimary: string;
    dnsSecondary: string;
    gateway: string;
    subnet: string;
    subnetType: string;
    addressQty: number;
    useableRange: string;
    additionalInfo: string;
  };
  lastMile: string;
  managedInventory: boolean;
  agentInventory: boolean;
  billingAccount: string;
  serviceProviderId: string;
}

export interface InventoryContract {
  id: string;
  contractId: string;
  name: string;
  provider: string;
  type: 'Fixed Term' | 'Month-to-Month';
  status: 'active' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  mrc: number;
  services: number;
  locations: number;
}

export interface InventoryOrder {
  id: string;
  orderId: string;
  name: string;
  company: string;
  provisioner: {
    name: string;
    role: string;
    email: string;
    phone: string;
    initials: string;
  };
  status: 'completed' | 'in-progress' | 'on-hold';
  dealType: string;
  createdDate: string;
  expectedMrc: number;
  services: number;
  createdBy: string;
  description: {
    orderType: string;
    prNumber: string;
    hubspotLink: string;
    client: string;
    provider: string;
    serviceDetails: string;
    term: string;
    handoffConnector: string;
    ipRequirements: string;
    orderDescription: string;
  };
  locations: InventoryOrderLocation[];
  sidebar: {
    customerName: string;
    customerAddress: string;
    customerWebsite: string;
    createdDate: string;
    estimatedStartDate: string;
    estimatedEndDate: string;
    completedDate: string | null;
  };
}

export interface InventoryOrderLocation {
  id: string;
  name: string;
  address: string;
  lconEmail: string;
  mrc: number;
  nrc: number;
  lastMile: string;
  globalServiceDesk: string;
}

export interface InventoryTicket {
  id: string;
  ticketId: string;
  subject: string;
  status: 'open' | 'closed' | 'in-progress';
  priority: 'low' | 'medium' | 'high' | 'critical';
  serviceId: string;
  serviceName: string;
  locationId: string;
  locationName: string;
  createdDate: string;
  lastUpdated: string;
  description: string;
}

export interface KPIData {
  activeLocations: number;
  activeLocationsWithServices: number;
  monthlySpend: number;
  activeServices: number;
  openTickets: number;
  openOrders: number;
  activeContracts: number;
  monthToMonthContracts: number;
  contractsExpiring90Days: number;
  ordersWithPendingIssues: number;
  autoRenewContracts: number;
  expiredContracts: number;
  contractsExpiring180Days: number;
  servicesExpiring120Days: number;
}

export interface SpendByProvider {
  provider: string;
  spend: number;
  color: string;
}

export interface ServiceTypeSpend {
  type: string;
  spend: number;
}

export interface MonthlyTrend {
  month: string;
  ticketsClosed: number;
  ordersCompleted: number;
}

export interface InventoryCommission {
  id: string;
  carrierId: string;
  carrierName: string;
  commissionRate: number; // percentage (e.g., 10 = 10%)
  activeDeals: number;
  totalMonthlyRevenue: number;
  monthlyCommission: number;
  projectedAnnual: number;
}

export interface CommissionByCarrier {
  carrier: string;
  commission: number;
  revenue: number;
  deals: number;
}
