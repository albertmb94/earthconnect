import { useState, useMemo } from 'react';
import type {
  InventoryLocation, InventoryService, InventoryContract,
  InventoryOrder, InventoryTicket, KPIData, SpendByProvider,
  ServiceTypeSpend, MonthlyTrend
} from './types';
import {
  mockLocations, mockServices, mockContracts, mockOrders, mockTickets,
  getKPIData, getSpendByProvider, getServiceTypeSpend, getMonthlyTrends
} from './mockData';

// Abstraction layer: all data access goes through this hook.
// To swap to Supabase, replace the mock imports with real Supabase calls.
export function useInventoryData() {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const locations: InventoryLocation[] = useMemo(() => mockLocations, []);
  const services: InventoryService[] = useMemo(() => mockServices, []);
  const contracts: InventoryContract[] = useMemo(() => mockContracts, []);
  const orders: InventoryOrder[] = useMemo(() => mockOrders, []);
  const tickets: InventoryTicket[] = useMemo(() => mockTickets, []);

  const kpiData: KPIData = useMemo(() => getKPIData(), []);
  const spendByProvider: SpendByProvider[] = useMemo(() => getSpendByProvider(), []);
  const serviceTypeSpend: ServiceTypeSpend[] = useMemo(() => getServiceTypeSpend(), []);
  const monthlyTrends: MonthlyTrend[] = useMemo(() => getMonthlyTrends(), []);

  return {
    locations, services, contracts, orders, tickets,
    kpiData, spendByProvider, serviceTypeSpend, monthlyTrends,
    loading, error,
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
