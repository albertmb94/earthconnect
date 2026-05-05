import { supabase } from '@/lib/supabaseClient';
import type {
  InventoryLocation, InventoryService, InventoryContract,
  InventoryOrder, InventoryTicket
} from './types';

const BATCH_SIZE = 100;

async function insertBatch<T>(table: string, rows: T[]): Promise<{ success: number; failed: number }> {
  if (!supabase || rows.length === 0) return { success: 0, failed: rows.length };
  let success = 0;
  let failed = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      console.warn(`[inventoryClient] batch insert error in ${table}:`, error.message);
      failed += batch.length;
    } else {
      success += batch.length;
    }
  }
  return { success, failed };
}

function mapLocationToRow(loc: InventoryLocation) {
  return {
    id: loc.id,
    name: loc.name,
    address: loc.address,
    city: loc.city,
    country: loc.country,
    country_name: loc.countryName,
    lat: loc.lat,
    lng: loc.lng,
    site_id: loc.siteId,
    status: loc.status,
    alert_count: loc.alertCount,
    open_tickets: loc.openTickets,
    active_services: loc.activeServices,
    current_spend: loc.currentSpend,
    provider: loc.provider,
    created_at: loc.createdAt,
  };
}

function mapServiceToRow(svc: InventoryService) {
  return {
    id: svc.id,
    service_id: svc.serviceId,
    name: svc.name,
    provider: svc.provider,
    type: svc.type,
    status: svc.status,
    expected_monthly_spend: svc.expectedMonthlySpend,
    site_id: svc.siteId,
    location_id: svc.locationId,
    location_name: svc.locationName,
    country: svc.country,
    bandwidth: svc.bandwidth,
    circuit_id: svc.circuitId,
    cpe_make_model: svc.cpeMakeModel,
    demarc_details: svc.demarcDetails,
    fiber_connector_type: svc.fiberConnectorType,
    ip_details: svc.ipDetails,
    last_mile: svc.lastMile,
    managed_inventory: svc.managedInventory,
    agent_inventory: svc.agentInventory,
    billing_account: svc.billingAccount,
    service_provider_id: svc.serviceProviderId,
    bill_activation_date: svc.billActivationDate,
    complete_date: svc.completeDate,
    expiration_date: svc.expirationDate,
  };
}

function mapContractToRow(c: InventoryContract) {
  return {
    id: c.id,
    contract_id: c.contractId,
    name: c.name,
    provider: c.provider,
    type: c.type,
    status: c.status,
    start_date: c.startDate,
    end_date: c.endDate,
    auto_renew: c.autoRenew,
    mrc: c.mrc,
    services: c.services,
    locations: c.locations,
  };
}

function mapOrderToRow(o: InventoryOrder) {
  return {
    id: o.id,
    order_id: o.orderId,
    name: o.name,
    company: o.company,
    provisioner: o.provisioner,
    status: o.status,
    deal_type: o.dealType,
    created_date: o.createdDate,
    expected_mrc: o.expectedMrc,
    services: o.services,
    created_by: o.createdBy,
    description: o.description,
    locations: o.locations,
    sidebar: o.sidebar,
  };
}

function mapTicketToRow(t: InventoryTicket) {
  return {
    id: t.id,
    ticket_id: t.ticketId,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    service_id: t.serviceId,
    service_name: t.serviceName,
    location_id: t.locationId,
    location_name: t.locationName,
    created_date: t.createdDate,
    last_updated: t.lastUpdated,
    description: t.description,
  };
}

export const inventoryClient = {
  async importLocations(rows: InventoryLocation[]) {
    return insertBatch('inventory_locations', rows.map(mapLocationToRow));
  },
  async importServices(rows: InventoryService[]) {
    return insertBatch('inventory_services', rows.map(mapServiceToRow));
  },
  async importContracts(rows: InventoryContract[]) {
    return insertBatch('inventory_contracts', rows.map(mapContractToRow));
  },
  async importOrders(rows: InventoryOrder[]) {
    return insertBatch('inventory_orders', rows.map(mapOrderToRow));
  },
  async importTickets(rows: InventoryTicket[]) {
    return insertBatch('inventory_tickets', rows.map(mapTicketToRow));
  },

  async clearTable(table: 'inventory_locations' | 'inventory_services' | 'inventory_contracts' | 'inventory_orders' | 'inventory_tickets') {
    if (!supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    return { error: error?.message || null };
  },
};
