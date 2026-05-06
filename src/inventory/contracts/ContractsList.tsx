import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { FilterBar } from '../shared/FilterBar';
import { useInventoryData, formatCurrencyFull } from '../data/useInventoryData';
import type { InventoryContract } from '../data/types';

export const ContractsList: React.FC = () => {
  const { contracts } = useInventoryData();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useMemo(() => {
    const f: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === 'expiring' || key === 'autoRenew') continue;
      f[key] = value.split(',');
    }
    return f;
  }, [searchParams]);

  const [filters, setFilters] = useState<Record<string, string[]>>(initialFilters);

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Expired', value: 'expired' },
    { label: 'Pending', value: 'pending' },
  ];

  const typeOptions = [
    { label: 'Fixed Term', value: 'Fixed Term' },
    { label: 'Month-to-Month', value: 'Month-to-Month' },
  ];

  const providerOptions = [...new Set(contracts.map(c => c.provider))].map(p => ({ label: p, value: p }));

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

  // Special params
  const expiringDays = searchParams.get('expiring');
  const autoRenew = searchParams.get('autoRenew');

  const filtered = contracts.filter(c => {
    if (filters.status?.length && !filters.status.includes(c.status)) return false;
    if (filters.type?.length && !filters.type.includes(c.type)) return false;
    if (filters.provider?.length && !filters.provider.includes(c.provider)) return false;

    if (expiringDays) {
      const days = parseInt(expiringDays);
      const end = new Date(c.endDate);
      const limit = new Date(); limit.setDate(limit.getDate() + days);
      if (end > limit || c.status !== 'active') return false;
    }

    if (autoRenew === 'true' && !c.autoRenew) return false;

    return true;
  });

  const columns = [
    {
      key: 'contractId', header: 'Contract ID', sortable: true,
      render: (c: InventoryContract) => (
        <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
          {c.contractId}
        </span>
      ),
    },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'provider', header: 'Provider', sortable: true },
    { key: 'type', header: 'Type', sortable: true, render: (c: InventoryContract) => <StatusBadge status={c.type.toLowerCase().replace(' ', '-')} label={c.type} /> },
    { key: 'status', header: 'Status', sortable: true, render: (c: InventoryContract) => <StatusBadge status={c.status} /> },
    { key: 'startDate', header: 'Start Date', sortable: true },
    { key: 'endDate', header: 'End Date', sortable: true },
    { key: 'autoRenew', header: 'Auto Renew', sortable: true, render: (c: InventoryContract) => (
      <span className={`text-xs font-medium ${c.autoRenew ? 'text-emerald-600' : 'text-slate-500'}`}>
        {c.autoRenew ? 'Yes' : 'No'}
      </span>
    )},
    { key: 'mrc', header: 'MRC', sortable: true, render: (c: InventoryContract) => formatCurrencyFull(c.mrc) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Contracts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage service agreements and renewals</p>
          {expiringDays && (
            <p className="text-sm text-blue-600 mt-1">
              Showing contracts expiring within {expiringDays} days ({filtered.length} results)
            </p>
          )}
          {autoRenew && (
            <p className="text-sm text-blue-600 mt-1">
              Showing auto-renew contracts ({filtered.length} results)
            </p>
          )}
        </div>
      </div>

      <FilterBar
        filters={[
          { key: 'status', label: 'Status', options: statusOptions },
          { key: 'type', label: 'Type', options: typeOptions },
          { key: 'provider', label: 'Provider', options: providerOptions },
        ]}
        values={filters}
        onChange={handleFilterChange}
      />

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={c => c.id}
        defaultSortKey="endDate"
        defaultSortDir="asc"
        pageSize={15}
        searchable
        searchKeys={['contractId', 'name', 'provider']}
        showExport
        exportFilename="contracts.csv"
      />
    </div>
  );
};
