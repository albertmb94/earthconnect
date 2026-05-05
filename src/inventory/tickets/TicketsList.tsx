import React from 'react';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { useInventoryData } from '../data/useInventoryData';
import type { InventoryTicket } from '../data/types';

export const TicketsList: React.FC = () => {
  const { tickets } = useInventoryData();

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
      <div>
        <h1 className="text-xl font-bold text-slate-900">Support Tickets</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track and manage network support issues</p>
      </div>

      <DataTable
        data={tickets}
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
