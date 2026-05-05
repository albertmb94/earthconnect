import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { FilterBar } from '../shared/FilterBar';
import { useInventoryData, formatCurrencyFull } from '../data/useInventoryData';
import type { InventoryService } from '../data/types';

export const ServicesList: React.FC = () => {
  const { services } = useInventoryData();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState('');

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Suspended', value: 'suspended' },
  ];

  const providerOptions = [...new Set(services.map(s => s.provider))].map(p => ({ label: p, value: p }));
  const typeOptions = [...new Set(services.map(s => s.type))].map(t => ({ label: t, value: t }));

  const filtered = services.filter(s => {
    if (filters.status?.length && !filters.status.includes(s.status)) return false;
    if (filters.provider?.length && !filters.provider.includes(s.provider)) return false;
    if (filters.type?.length && !filters.type.includes(s.type)) return false;
    if (search) {
      const term = search.toLowerCase();
      return (
        s.serviceId.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        s.provider.toLowerCase().includes(term) ||
        s.siteId.toLowerCase().includes(term) ||
        s.locationName.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const columns = [
    {
      key: 'serviceId', header: 'Service ID', sortable: true,
      render: (s: InventoryService) => (
        <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
          {s.serviceId}
        </span>
      ),
    },
    { key: 'name', header: 'Service Name', sortable: true },
    { key: 'provider', header: 'Provider', sortable: true },
    { key: 'type', header: 'Service Type', sortable: true },
    { key: 'status', header: 'Status', sortable: true, render: (s: InventoryService) => <StatusBadge status={s.status} /> },
    { key: 'expectedMonthlySpend', header: 'Monthly Spend', sortable: true, render: (s: InventoryService) => formatCurrencyFull(s.expectedMonthlySpend) },
    { key: 'siteId', header: 'Site ID', sortable: true },
    { key: 'locationName', header: 'Location', sortable: true },
    { key: 'country', header: 'Country', sortable: true },
    { key: 'billActivationDate', header: 'Bill Activation', sortable: true },
    { key: 'completeDate', header: 'Complete Date', sortable: true },
    { key: 'expirationDate', header: 'Expiration', sortable: true },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Services</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all active and pending network services</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <FilterBar
          filters={[
            { key: 'status', label: 'Status', options: statusOptions },
            { key: 'provider', label: 'Provider', options: providerOptions },
            { key: 'type', label: 'Service Type', options: typeOptions },
          ]}
          values={filters}
          onChange={(key, vals) => setFilters(prev => ({ ...prev, [key]: vals }))}
        />
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={s => s.id}
        defaultSortKey="expectedMonthlySpend"
        defaultSortDir="desc"
        pageSize={15}
        showExport
        exportFilename="services.csv"
        onRowClick={s => navigate(`/inventory/services/${s.id}`)}
      />
    </div>
  );
};
