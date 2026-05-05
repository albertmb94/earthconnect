import { supabase } from '@/lib/supabaseClient';
import type {
  InventoryLocation, InventoryService, InventoryContract,
  InventoryOrder, InventoryTicket
} from './types';

function safeSelect<T>(table: string): Promise<T[] | null> {
  if (!supabase) return Promise.resolve(null);
  return supabase
    .from(table)
    .select('*')
    .then(({ data, error }) => {
      if (error) {
        console.warn(`[inventorySupabase] ${table} fetch error:`, error.message);
        return null;
      }
      if (!data || data.length === 0) return null;
      return data as T[];
    });
}

export async function fetchLocations(): Promise<InventoryLocation[] | null> {
  const rows = await safeSelect<Record<string, unknown>>('inventory_locations');
  if (!rows) return null;
  return rows.map(r => ({
    id: String(r.id),
    name: String(r.name),
    address: String(r.address),
    city: String(r.city),
    country: String(r.country),
    countryName: String(r.country_name),
    lat: Number(r.lat),
    lng: Number(r.lng),
    siteId: String(r.site_id),
    status: (r.status as 'active' | 'inactive') || 'active',
    alertCount: Number(r.alert_count) || 0,
    openTickets: Number(r.open_tickets) || 0,
    activeServices: Number(r.active_services) || 0,
    currentSpend: Number(r.current_spend) || 0,
    provider: String(r.provider),
    createdAt: String(r.created_at),
  }));
}

export async function fetchServices(): Promise<InventoryService[] | null> {
  const rows = await safeSelect<Record<string, unknown>>('inventory_services');
  if (!rows) return null;
  return rows.map(r => {
    const ip = (r.ip_details as Record<string, unknown>) || {};
    return {
      id: String(r.id),
      serviceId: String(r.service_id),
      name: String(r.name),
      provider: String(r.provider),
      type: String(r.type),
      status: (r.status as 'active' | 'pending' | 'suspended' | 'cancelled') || 'active',
      expectedMonthlySpend: Number(r.expected_monthly_spend) || 0,
      siteId: String(r.site_id),
      locationId: String(r.location_id),
      locationName: String(r.location_name),
      country: String(r.country),
      billActivationDate: r.bill_activation_date ? String(r.bill_activation_date) : null,
      completeDate: r.complete_date ? String(r.complete_date) : null,
      expirationDate: r.expiration_date ? String(r.expiration_date) : null,
      bandwidth: String(r.bandwidth || ''),
      circuitId: String(r.circuit_id || ''),
      cpeMakeModel: String(r.cpe_make_model || ''),
      demarcDetails: String(r.demarc_details || ''),
      fiberConnectorType: String(r.fiber_connector_type || ''),
      ipDetails: {
        dnsPrimary: String(ip.dns_primary || ''),
        dnsSecondary: String(ip.dns_secondary || ''),
        gateway: String(ip.gateway || ''),
        subnet: String(ip.subnet || ''),
        subnetType: String(ip.subnet_type || ''),
        addressQty: Number(ip.address_qty) || 0,
        useableRange: String(ip.useable_range || ''),
        additionalInfo: String(ip.additional_info || ''),
      },
      lastMile: String(r.last_mile || ''),
      managedInventory: Boolean(r.managed_inventory),
      agentInventory: Boolean(r.agent_inventory),
      billingAccount: String(r.billing_account || ''),
      serviceProviderId: String(r.service_provider_id || ''),
    };
  });
}

export async function fetchContracts(): Promise<InventoryContract[] | null> {
  const rows = await safeSelect<Record<string, unknown>>('inventory_contracts');
  if (!rows) return null;
  return rows.map(r => ({
    id: String(r.id),
    contractId: String(r.contract_id),
    name: String(r.name),
    provider: String(r.provider),
    type: (r.type as 'Fixed Term' | 'Month-to-Month') || 'Fixed Term',
    status: (r.status as 'active' | 'expired' | 'pending') || 'active',
    startDate: String(r.start_date),
    endDate: String(r.end_date),
    autoRenew: Boolean(r.auto_renew),
    mrc: Number(r.mrc) || 0,
    services: Number(r.services) || 0,
    locations: Number(r.locations) || 0,
  }));
}

export async function fetchOrders(): Promise<InventoryOrder[] | null> {
  const rows = await safeSelect<Record<string, unknown>>('inventory_orders');
  if (!rows) return null;
  return rows.map(r => {
    const desc = (r.description as Record<string, unknown>) || {};
    const side = (r.sidebar as Record<string, unknown>) || {};
    const prov = (r.provisioner as Record<string, unknown>) || {};
    return {
      id: String(r.id),
      orderId: String(r.order_id),
      name: String(r.name),
      company: String(r.company),
      provisioner: {
        name: String(prov.name || ''),
        role: String(prov.role || ''),
        email: String(prov.email || ''),
        phone: String(prov.phone || ''),
        initials: String(prov.initials || ''),
      },
      status: (r.status as 'completed' | 'in-progress' | 'on-hold') || 'in-progress',
      dealType: String(r.deal_type || ''),
      createdDate: String(r.created_date),
      expectedMrc: Number(r.expected_mrc) || 0,
      services: Number(r.services) || 0,
      createdBy: String(r.created_by || ''),
      description: {
        orderType: String(desc.order_type || ''),
        prNumber: String(desc.pr_number || ''),
        hubspotLink: String(desc.hubspot_link || ''),
        client: String(desc.client || ''),
        provider: String(desc.provider || ''),
        serviceDetails: String(desc.service_details || ''),
        term: String(desc.term || ''),
        handoffConnector: String(desc.handoff_connector || ''),
        ipRequirements: String(desc.ip_requirements || ''),
        orderDescription: String(desc.order_description || ''),
      },
      locations: (r.locations as unknown[] || []).map((loc: Record<string, unknown>) => ({
        id: String(loc.id),
        name: String(loc.name),
        address: String(loc.address),
        lconEmail: String(loc.lcon_email),
        mrc: Number(loc.mrc) || 0,
        nrc: Number(loc.nrc) || 0,
        lastMile: String(loc.last_mile || ''),
        globalServiceDesk: String(loc.global_service_desk || ''),
      })),
      sidebar: {
        customerName: String(side.customer_name || ''),
        customerAddress: String(side.customer_address || ''),
        customerWebsite: String(side.customer_website || ''),
        createdDate: String(side.created_date || ''),
        estimatedStartDate: String(side.estimated_start_date || ''),
        estimatedEndDate: String(side.estimated_end_date || ''),
        completedDate: side.completed_date ? String(side.completed_date) : null,
      },
    };
  });
}

export async function fetchTickets(): Promise<InventoryTicket[] | null> {
  const rows = await safeSelect<Record<string, unknown>>('inventory_tickets');
  if (!rows) return null;
  return rows.map(r => ({
    id: String(r.id),
    ticketId: String(r.ticket_id),
    subject: String(r.subject),
    status: (r.status as 'open' | 'closed' | 'in-progress') || 'open',
    priority: (r.priority as 'low' | 'medium' | 'high' | 'critical') || 'medium',
    serviceId: String(r.service_id || ''),
    serviceName: String(r.service_name || ''),
    locationId: String(r.location_id || ''),
    locationName: String(r.location_name || ''),
    createdDate: String(r.created_date),
    lastUpdated: String(r.last_updated),
    description: String(r.description || ''),
  }));
}
