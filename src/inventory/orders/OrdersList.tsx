import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { FilterBar } from '../shared/FilterBar';
import { useInventoryData, formatCurrencyFull } from '../data/useInventoryData';
import type { InventoryOrder } from '../data/types';

export const OrdersList: React.FC = () => {
  const { orders } = useInventoryData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const initialFilters = useMemo(() => {
    const f: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      f[key] = value.split(',');
    }
    return f;
  }, [searchParams]);

  const [filters, setFilters] = useState<Record<string, string[]>>(initialFilters);

  const statusOptions = [
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'On Hold', value: 'on-hold' },
  ];

  const companyOptions = [...new Set(orders.map(o => o.company))].map(c => ({ label: c, value: c }));
  const provisionerOptions = [...new Set(orders.map(o => o.provisioner.name))].map(p => ({ label: p, value: p }));

  const handleFilterChange = (key: string, vals: string[]) => {
    const next = { ...filters, [key]: vals };
    setFilters(next);
    const params = new URLSearchParams(searchParams);
    if (vals.length) {
      params.set(key, vals.join(','));
    } else {
      params.delete(key);
    }
    setSearchParams(params, { replace: true });
  };

  const filtered = orders.filter(o => {
    if (filters.status?.length && !filters.status.includes(o.status)) return false;
    if (filters.company?.length && !filters.company.includes(o.company)) return false;
    if (filters.provisioner?.length && !filters.provisioner.includes(o.provisioner.name)) return false;
    if (search) {
      const term = search.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(term) ||
        o.name.toLowerCase().includes(term) ||
        o.company.toLowerCase().includes(term) ||
        o.provisioner.name.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const columns = [
    {
      key: 'orderId', header: 'ID', sortable: true,
      render: (o: InventoryOrder) => (
        <Link
          to={`/inventory/orders/${o.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {o.orderId}
        </Link>
      ),
    },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'company', header: 'Company', sortable: true },
    { key: 'provisioner', header: 'Provisioner', sortable: true, render: (o: InventoryOrder) => o.provisioner.name },
    { key: 'status', header: 'Status', sortable: true, render: (o: InventoryOrder) => <StatusBadge status={o.status} /> },
    { key: 'dealType', header: 'Deal Type', sortable: true },
    { key: 'createdDate', header: 'Created Date', sortable: true },
    { key: 'expectedMrc', header: 'Expected MRC', sortable: true, render: (o: InventoryOrder) => formatCurrencyFull(o.expectedMrc) },
    { key: 'services', header: 'Services', sortable: true },
    { key: 'createdBy', header: 'Created By', sortable: true },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track all service orders and installations</p>
          {filters.status?.length && (
            <p className="text-sm text-blue-600 mt-1">
              Showing {filters.status.join(', ')} orders ({filtered.length} results)
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterBar
          filters={[
            { key: 'status', label: 'Status', options: statusOptions },
            { key: 'company', label: 'Company', options: companyOptions },
            { key: 'provisioner', label: 'Provisioner', options: provisionerOptions },
          ]}
          values={filters}
          onChange={handleFilterChange}
        />
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders..."
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
        keyExtractor={o => o.id}
        defaultSortKey="createdDate"
        defaultSortDir="desc"
        pageSize={15}
        showExport
        exportFilename="orders.csv"
        onRowClick={o => navigate(`/inventory/orders/${o.id}`)}
      />
    </div>
  );
};
