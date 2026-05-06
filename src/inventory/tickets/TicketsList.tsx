import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { FilterBar } from '../shared/FilterBar';
import { useInventoryData } from '../data/useInventoryData';
import type { InventoryTicket } from '../data/types';

export const TicketsList: React.FC = () => {
  const { tickets } = useInventoryData();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useMemo(() => {
    const f: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      f[key] = value.split(',');
    }
    return f;
  }, [searchParams]);

  const [filters, setFilters] = useState<Record<string, string[]>>(initialFilters);

  const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'Closed', value: 'closed' },
    { label: 'In Progress', value: 'in-progress' },
  ];

  const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

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

  const filtered = tickets.filter(t => {
    if (filters.status?.length && !filters.status.includes(t.status)) return false;
    if (filters.priority?.length && !filters.priority.includes(t.priority)) return false;
    return true;
  });

  const columns = [
    {
      key: 'ticketId', header: 'Ticket ID', sortable: true,
      render: (t: InventoryTicket) => (
        <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
          {t.ticketId}
        </span>
      ),
    },
    { key: 'subject', header: 'Subject', sortable: true },
    { key: 'status', header: 'Status', sortable: true, render: (t: InventoryTicket) => <StatusBadge status={t.status} /> },
    { key: 'priority', header: 'Priority', sortable: true, render: (t: InventoryTicket) => <StatusBadge status={t.priority} /> },
    { key: 'serviceName', header: 'Service', sortable: true },
    { key: 'locationName', header: 'Location', sortable: true },
    { key: 'createdDate', header: 'Created', sortable: true },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track and manage network support issues</p>
          {filters.status?.length && (
            <p className="text-sm text-blue-600 mt-1">
              Showing {filters.status.join(', ')} tickets ({filtered.length} results)
            </p>
          )}
        </div>
      </div>

      <FilterBar
        filters={[
          { key: 'status', label: 'Status', options: statusOptions },
          { key: 'priority', label: 'Priority', options: priorityOptions },
        ]}
        values={filters}
        onChange={handleFilterChange}
      />

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={t => t.id}
        defaultSortKey="createdDate"
        defaultSortDir="desc"
        pageSize={15}
        searchable
        searchKeys={['ticketId', 'subject', 'serviceName', 'locationName']}
        showExport
        exportFilename="tickets.csv"
      />
    </div>
  );
};
