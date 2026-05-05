import { useState, useMemo, useEffect, useCallback } from 'react';
import type {
  InventoryLocation, InventoryService, InventoryContract,
  InventoryOrder, InventoryTicket, KPIData, SpendByProvider,
  ServiceTypeSpend, MonthlyTrend, InventoryCommission, CommissionByCarrier
} from './types';
import {
  mockLocations, mockServices, mockContracts, mockOrders, mockTickets,
  getKPIData, getSpendByProvider, getServiceTypeSpend, getMonthlyTrends,
  mockCommissions, getCommissionData
} from './mockData';
import { getDataSource } from './dataSource';
import { fetchLocations, fetchServices, fetchContracts, fetchOrders, fetchTickets } from './inventorySupabase';

export type DataSource = 'mock' | 'supabase';

interface InventoryData {
  locations: InventoryLocation[];
  services: InventoryService[];
  contracts: InventoryContract[];
  orders: InventoryOrder[];
  tickets: InventoryTicket[];
  commissions: InventoryCommission[];
  kpiData: KPIData;
  spendByProvider: SpendByProvider[];
  serviceTypeSpend: ServiceTypeSpend[];
  monthlyTrends: MonthlyTrend[];
  commissionData: {
    monthlyCommission: number;
    annualProjected: number;
    activeDeals: number;
    totalRevenue: number;
    commissionByCarrier: CommissionByCarrier[];
  };
  loading: boolean;
  error: string | null;
  dataSource: DataSource;
  refresh: () => void;
}

export function useInventoryData(): InventoryData {
  const [dataSource, setDataSourceState] = useState<DataSource>(getDataSource);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseData, setSupabaseData] = useState<{
    locations: InventoryLocation[] | null;
    services: InventoryService[] | null;
    contracts: InventoryContract[] | null;
    orders: InventoryOrder[] | null;
    tickets: InventoryTicket[] | null;
  }>({ locations: null, services: null, contracts: null, orders: null, tickets: null });

  // Listen for data source changes from admin toggle
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as DataSource;
      setDataSourceState(detail);
    };
    window.addEventListener('ec-data-source-changed', handler);
    return () => window.removeEventListener('ec-data-source-changed', handler);
  }, []);

  const fetchSupabaseData = useCallback(async () => {
    if (dataSource !== 'supabase') return;
    setLoading(true);
    setError(null);
    try {
      const [loc, svc, ctr, ord, tkt] = await Promise.all([
        fetchLocations(),
        fetchServices(),
        fetchContracts(),
        fetchOrders(),
        fetchTickets(),
      ]);
      setSupabaseData({ locations: loc, services: svc, contracts: ctr, orders: ord, tickets: tkt });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch from Supabase');
    } finally {
      setLoading(false);
    }
  }, [dataSource]);

  // Fetch from Supabase when source changes to 'supabase'
  useEffect(() => {
    if (dataSource === 'supabase') {
      fetchSupabaseData();
    }
  }, [dataSource, fetchSupabaseData]);

  const locations = dataSource === 'supabase' && supabaseData.locations
    ? supabaseData.locations : mockLocations;
  const services = dataSource === 'supabase' && supabaseData.services
    ? supabaseData.services : mockServices;
  const contracts = dataSource === 'supabase' && supabaseData.contracts
    ? supabaseData.contracts : mockContracts;
  const orders = dataSource === 'supabase' && supabaseData.orders
    ? supabaseData.orders : mockOrders;
  const tickets = dataSource === 'supabase' && supabaseData.tickets
    ? supabaseData.tickets : mockTickets;

  const commissions = mockCommissions;

  const kpiData: KPIData = useMemo(() => getKPIData(locations, services, contracts, orders, tickets), [locations, services, contracts, orders, tickets]);
  const spendByProvider: SpendByProvider[] = useMemo(() => getSpendByProvider(services), [services]);
  const serviceTypeSpend: ServiceTypeSpend[] = useMemo(() => getServiceTypeSpend(services), [services]);
  const monthlyTrends: MonthlyTrend[] = useMemo(() => getMonthlyTrends(), []);
  const commissionData = useMemo(() => getCommissionData(commissions), [commissions]);

  const refresh = useCallback(() => {
    if (dataSource === 'supabase') {
      fetchSupabaseData();
    }
  }, [dataSource, fetchSupabaseData]);

  return {
    locations, services, contracts, orders, tickets, commissions,
    kpiData, spendByProvider, serviceTypeSpend, monthlyTrends, commissionData,
    loading, error, dataSource, refresh,
  };
}

// Helper to format currency
export function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

// Helper to format number with commas
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

// ===== FILTERED DATA HOOK =====
// Applies multi-select filters to inventory data and recomputes KPIs/charts
export interface InventoryFilters {
  provider?: string[];
  location?: string[];
  site?: string[];
  status?: string[];
  type?: string[];
}

export function useFilteredInventoryData(filters: InventoryFilters): InventoryData & { raw: InventoryData } {
  const raw = useInventoryData();

  const filteredLocations = useMemo(() => {
    let data = raw.locations;
    if (filters.provider?.length) data = data.filter(l => filters.provider!.includes(l.provider));
    if (filters.location?.length) data = data.filter(l => filters.location!.includes(l.id));
    if (filters.site?.length) data = data.filter(l => filters.site!.includes(l.siteId));
    if (filters.status?.length) data = data.filter(l => filters.status!.includes(l.status));
    return data;
  }, [raw.locations, filters]);

  const filteredServices = useMemo(() => {
    let data = raw.services;
    if (filters.provider?.length) data = data.filter(s => filters.provider!.includes(s.provider));
    if (filters.location?.length) data = data.filter(s => filters.location!.includes(s.locationId));
    if (filters.site?.length) data = data.filter(s => filters.site!.includes(s.siteId));
    if (filters.status?.length) data = data.filter(s => filters.status!.includes(s.status));
    if (filters.type?.length) data = data.filter(s => filters.type!.includes(s.type));
    return data;
  }, [raw.services, filters]);

  const filteredContracts = useMemo(() => {
    let data = raw.contracts;
    if (filters.provider?.length) data = data.filter(c => filters.provider!.includes(c.provider));
    return data;
  }, [raw.contracts, filters]);

  const filteredOrders = useMemo(() => {
    let data = raw.orders;
    if (filters.status?.length) data = data.filter(o => filters.status!.includes(o.status));
    return data;
  }, [raw.orders, filters]);

  const kpiData = useMemo(() => getKPIData(filteredLocations, filteredServices, filteredContracts, filteredOrders, raw.tickets), [filteredLocations, filteredServices, filteredContracts, filteredOrders, raw.tickets]);
  const spendByProvider = useMemo(() => getSpendByProvider(filteredServices), [filteredServices]);
  const serviceTypeSpend = useMemo(() => getServiceTypeSpend(filteredServices), [filteredServices]);

  return {
    ...raw,
    locations: filteredLocations,
    services: filteredServices,
    contracts: filteredContracts,
    orders: filteredOrders,
    kpiData,
    spendByProvider,
    serviceTypeSpend,
    raw,
  };
}
