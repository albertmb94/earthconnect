import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ChartCard } from '../shared/ChartCard';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { useInventoryData, formatCurrencyFull, formatNumber } from '../data/useInventoryData';
import type { InventoryService } from '../data/types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ServicesOverview: React.FC = () => {
  const { services, locations } = useInventoryData();

  const providerData = React.useMemo(() => {
    const map = new Map<string, { spend: number; count: number }>();
    services.forEach(s => {
      const existing = map.get(s.provider) || { spend: 0, count: 0 };
      existing.spend += s.expectedMonthlySpend;
      existing.count += 1;
      map.set(s.provider, existing);
    });
    return Array.from(map.entries()).map(([provider, data]) => ({
      provider, spend: data.spend, count: data.count
    }));
  }, [services]);

  const totalSpend = providerData.reduce((s, p) => s + p.spend, 0);
  const totalCount = providerData.reduce((s, p) => s + p.count, 0);

  const serviceColumns = [
    { key: 'serviceId', header: 'Service ID', sortable: true },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Services Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">All network services across your locations</p>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Total Spend by Provider">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerData}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={75}
                  paddingAngle={4}
                  dataKey="spend"
                  nameKey="provider"
                >
                  {providerData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(v: number) => `$${formatNumber(v)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-2">
            <div className="text-base font-bold text-slate-900">${formatCurrencyFull(totalSpend).replace('$', '')}</div>
          </div>
        </ChartCard>

        <ChartCard title="Spend per Provider">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerData} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="provider" fontSize={10} />
                <YAxis tickFormatter={v => `$${formatCurrencyFull(Number(v)).replace('$', '')}`} fontSize={10} />
                <ReTooltip formatter={(v: number) => `$${formatNumber(v)}`} />
                <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Service Count per Provider">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerData}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="provider"
                >
                  {providerData.map((_, i) => (
                    <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-2">
            <div className="text-base font-bold text-slate-900">{totalCount}</div>
            <div className="text-xs text-slate-500">Total Services</div>
          </div>
        </ChartCard>
      </div>

      {/* Services table */}
      <DataTable
        data={services}
        columns={serviceColumns}
        keyExtractor={s => s.id}
        defaultSortKey="expectedMonthlySpend"
        defaultSortDir="desc"
        pageSize={15}
        searchable
        searchKeys={['serviceId', 'name', 'provider', 'type', 'siteId', 'locationName', 'country']}
        showExport
        exportFilename="services.csv"
      />
    </div>
  );
};
