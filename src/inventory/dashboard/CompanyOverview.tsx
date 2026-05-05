import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, Legend
} from 'recharts';
import {
  MapPin, Wifi, Ticket, ShoppingCart, FileText, AlertTriangle, RefreshCw, Clock, Calendar, XCircle
} from 'lucide-react';
import { KPICard } from '../shared/KPICard';
import { ChartCard } from '../shared/ChartCard';
import { FilterBar } from '../shared/FilterBar';
import { useInventoryData, formatCurrency, formatNumber } from '../data/useInventoryData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const CompanyOverview: React.FC = () => {
  const { kpiData, spendByProvider, serviceTypeSpend, monthlyTrends, locations } = useInventoryData();
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const providerOptions = [...new Set(locations.map(l => l.provider))].map(p => ({ label: p, value: p }));
  const locationOptions = locations.map(l => ({ label: l.name, value: l.id }));
  const siteOptions = locations.map(l => ({ label: l.siteId, value: l.siteId }));

  const totalSpend = spendByProvider.reduce((sum, s) => sum + s.spend, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Company Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time view of your network infrastructure</p>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={[
          { key: 'provider', label: 'Service Provider', options: providerOptions },
          { key: 'location', label: 'Location Name', options: locationOptions },
          { key: 'site', label: 'Site ID', options: siteOptions },
        ]}
        values={filters}
        onChange={(key, vals) => setFilters(prev => ({ ...prev, [key]: vals }))}
      />

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard label="Active Locations" value={kpiData.activeLocations} icon={<MapPin className="w-4 h-4" />} trend="up" trendValue="+3" />
        <KPICard label="Active w/ Services" value={kpiData.activeLocationsWithServices} icon={<Wifi className="w-4 h-4" />} trend="up" trendValue="+2" />
        <KPICard label="Monthly Spend" value={formatCurrency(kpiData.monthlySpend).replace('$', '')} prefix="$" icon={<ShoppingCart className="w-4 h-4" />} trend="up" trendValue="+5.2%" />
        <KPICard label="Active Services" value={kpiData.activeServices} icon={<Wifi className="w-4 h-4" />} trend="neutral" trendValue="0" />
        <KPICard label="Open Tickets" value={kpiData.openTickets} icon={<Ticket className="w-4 h-4" />} trend="up" trendValue="+1" />
        <KPICard label="Open Orders" value={kpiData.openOrders} icon={<ShoppingCart className="w-4 h-4" />} trend="down" trendValue="-1" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <ChartCard title="Expected Monthly Spend by Provider" className="xl:col-span-1">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendByProvider}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="spend"
                  nameKey="provider"
                >
                  {spendByProvider.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(value: number) => `$${formatNumber(value)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-4">
            <div className="text-lg font-bold text-slate-900">${formatCurrency(totalSpend)}</div>
            <div className="text-xs text-slate-500">Total Monthly</div>
          </div>
        </ChartCard>

        <ChartCard title="Top Service Types by Spend" className="xl:col-span-1">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceTypeSpend} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tickFormatter={v => `$${formatCurrency(Number(v))}`} fontSize={11} />
                <YAxis type="category" dataKey="type" width={100} fontSize={10} />
                <ReTooltip formatter={(value: number) => `$${formatNumber(value)}`} />
                <Bar dataKey="spend" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Closed Tickets (6 months)" className="xl:col-span-1">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ left: 0, right: 10 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <ReTooltip />
                <Area type="monotone" dataKey="ticketsClosed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTickets)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Completed Orders (6 months)" className="xl:col-span-1">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <ReTooltip />
                <Bar dataKey="ordersCompleted" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <KPICard label="Active Contracts" value={kpiData.activeContracts} icon={<FileText className="w-4 h-4" />} />
        <KPICard label="M2M Contracts" value={kpiData.monthToMonthContracts} icon={<RefreshCw className="w-4 h-4" />} />
        <KPICard label="Expiring ≤90d" value={kpiData.contractsExpiring90Days} icon={<AlertTriangle className="w-4 h-4" />} trend="up" trendValue="+1" />
        <KPICard label="Pending Issues" value={kpiData.ordersWithPendingIssues} icon={<AlertTriangle className="w-4 h-4" />} />
        <KPICard label="Auto Renew" value={kpiData.autoRenewContracts} icon={<RefreshCw className="w-4 h-4" />} />
        <KPICard label="Expired" value={kpiData.expiredContracts} icon={<XCircle className="w-4 h-4" />} />
        <KPICard label="Expiring ≤180d" value={kpiData.contractsExpiring180Days} icon={<Calendar className="w-4 h-4" />} />
        <KPICard label="Svcs Exp ≤120d" value={kpiData.servicesExpiring120Days} icon={<Clock className="w-4 h-4" />} trend="up" trendValue="+2" />
      </div>
    </div>
  );
};
