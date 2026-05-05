import React from 'react';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { useInventoryData, formatCurrencyFull } from '../data/useInventoryData';
import type { InventoryContract } from '../data/types';

export const ContractsList: React.FC = () => {
  const { contracts } = useInventoryData();

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
      <div>
        <h1 className="text-xl font-bold text-slate-900">Contracts</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage service agreements and renewals</p>
      </div>

      <DataTable
        data={contracts}
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
