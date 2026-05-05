import React, { useState, useMemo, useCallback } from 'react';
import { Responsive as ResponsiveGridLayout, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
  MapPin, Wifi, Ticket, ShoppingCart, FileText, AlertTriangle, RefreshCw, Clock, Calendar, XCircle,
  DollarSign, TrendingUp, Package, Download, Settings, RotateCcw, Lock, Unlock
} from 'lucide-react';
import { KPICard } from '../shared/KPICard';
import { ChartCard } from '../shared/ChartCard';
import { FilterBar } from '../shared/FilterBar';
import { useFilteredInventoryData, formatCurrency, formatCurrencyFull, formatNumber } from '../data/useInventoryData';



const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const COMMISSION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const LAYOUT_STORAGE_KEY = 'ec_inventory_dashboard_layout';

interface WidgetDef {
  id: string;
  title: string;
  component: React.ReactNode;
  defaultLayout: { x: number; y: number; w: number; h: number };
}

function useDashboardLayout(widgets: WidgetDef[]) {
  const defaultLayouts = {
    lg: widgets.map(w => ({ i: w.id, ...w.defaultLayout })),
    md: widgets.map(w => ({ i: w.id, ...w.defaultLayout, w: Math.min(w.defaultLayout.w, 6) })),
    sm: widgets.map(w => ({ i: w.id, x: 0, y: w.defaultLayout.y * 2, w: 12, h: w.defaultLayout.h })),
  };

  const [layouts, setLayouts] = useState(() => {
    try {
      const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return defaultLayouts;
  });

  const [isEditing, setIsEditing] = useState(false);

  const onLayoutChange = useCallback((_: Layout[], allLayouts: Record<string, Layout[]>) => {
    setLayouts(allLayouts);
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(allLayouts));
  }, []);

  const resetLayout = useCallback(() => {
    setLayouts(defaultLayouts);
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(defaultLayouts));
  }, [defaultLayouts]);

  return { layouts, isEditing, setIsEditing, onLayoutChange, resetLayout };
}

export const CompanyOverview: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const {
    locations, services, contracts, orders, tickets, kpiData,
    spendByProvider, serviceTypeSpend, monthlyTrends, commissionData, raw
  } = useFilteredInventoryData({
    provider: filters.provider,
    location: filters.location,
    site: filters.site,
    status: filters.status,
  });

  const providerOptions = [...new Set(raw.locations.map(l => l.provider))].map(p => ({ label: p, value: p }));
  const locationOptions = raw.locations.map(l => ({ label: l.name, value: l.id }));
  const siteOptions = raw.locations.map(l => ({ label: l.siteId, value: l.siteId }));

  const totalSpend = spendByProvider.reduce((sum, s) => sum + s.spend, 0);

  // Commission data
  const totalCommission = commissionData.monthlyCommission;

  // Dashboard export
  const handleExportDashboard = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Active Locations', String(kpiData.activeLocations)],
      ['Active w/ Services', String(kpiData.activeLocationsWithServices)],
      ['Monthly Spend', formatCurrencyFull(kpiData.monthlySpend)],
      ['Active Services', String(kpiData.activeServices)],
      ['Open Tickets', String(kpiData.openTickets)],
      ['Open Orders', String(kpiData.openOrders)],
      ['Active Contracts', String(kpiData.activeContracts)],
      ['Expiring Contracts ≤90d', String(kpiData.contractsExpiring90Days)],
      ['Monthly Commission', formatCurrencyFull(commissionData.monthlyCommission)],
      ['Annual Projected Commission', formatCurrencyFull(commissionData.annualProjected)],
      ['Active Deals', String(commissionData.activeDeals)],
      ['Total Revenue', formatCurrencyFull(commissionData.totalRevenue)],
      ['', ''],
      ['Spend by Provider', ''],
      ...spendByProvider.map(s => [s.provider, formatCurrencyFull(s.spend)]),
      ['', ''],
      ['Commission by Carrier', ''],
      ...commissionData.commissionByCarrier.map(c => [c.carrier, formatCurrencyFull(c.commission)]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Widget definitions
  const widgets: WidgetDef[] = useMemo(() => [
    {
      id: 'filters',
      title: 'Filters',
      defaultLayout: { x: 0, y: 0, w: 12, h: 2 },
      component: (
        <FilterBar
          filters={[
            { key: 'provider', label: 'Service Provider', options: providerOptions },
            { key: 'location', label: 'Location Name', options: locationOptions },
            { key: 'site', label: 'Site ID', options: siteOptions },
            { key: 'status', label: 'Status', options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Pending', value: 'pending' },
              { label: 'Suspended', value: 'suspended' },
            ]},
          ]}
          values={filters}
          onChange={(key, vals) => setFilters(prev => ({ ...prev, [key]: vals }))}
        />
      ),
    },
    {
      id: 'kpis-primary',
      title: 'Primary KPIs',
      defaultLayout: { x: 0, y: 2, w: 12, h: 3 },
      component: (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 h-full">
          <KPICard label="Active Locations" value={kpiData.activeLocations} icon={<MapPin className="w-4 h-4" />} trend="up" trendValue="+3" />
          <KPICard label="Active w/ Services" value={kpiData.activeLocationsWithServices} icon={<Wifi className="w-4 h-4" />} trend="up" trendValue="+2" />
          <KPICard label="Monthly Spend" value={formatCurrency(kpiData.monthlySpend).replace('$', '')} prefix="$" icon={<ShoppingCart className="w-4 h-4" />} trend="up" trendValue="+5.2%" />
          <KPICard label="Active Services" value={kpiData.activeServices} icon={<Wifi className="w-4 h-4" />} trend="neutral" trendValue="0" />
          <KPICard label="Open Tickets" value={kpiData.openTickets} icon={<Ticket className="w-4 h-4" />} trend="up" trendValue="+1" />
          <KPICard label="Open Orders" value={kpiData.openOrders} icon={<ShoppingCart className="w-4 h-4" />} trend="down" trendValue="-1" />
        </div>
      ),
    },
    {
      id: 'kpis-commission',
      title: 'Commission KPIs',
      defaultLayout: { x: 0, y: 5, w: 12, h: 3 },
      component: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full">
          <KPICard label="Monthly Commission" value={formatCurrency(commissionData.monthlyCommission).replace('$', '')} prefix="$" icon={<DollarSign className="w-4 h-4" />} trend="up" trendValue="+8.4%" />
          <KPICard label="Annual Projected" value={formatCurrency(commissionData.annualProjected).replace('$', '')} prefix="$" icon={<TrendingUp className="w-4 h-4" />} trend="up" trendValue="+12.1%" />
          <KPICard label="Active Deals" value={commissionData.activeDeals} icon={<Package className="w-4 h-4" />} trend="up" trendValue="+2" />
          <KPICard label="Total Revenue" value={formatCurrency(commissionData.totalRevenue).replace('$', '')} prefix="$" icon={<DollarSign className="w-4 h-4" />} trend="up" trendValue="+6.7%" />
        </div>
      ),
    },
    {
      id: 'chart-spend',
      title: 'Expected Monthly Spend by Provider',
      defaultLayout: { x: 0, y: 8, w: 3, h: 6 },
      component: (
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendByProvider} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="spend" nameKey="provider">
                  {spendByProvider.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(value: number) => `$${formatNumber(value)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center pt-2">
            <div className="text-lg font-bold text-slate-900">${formatCurrency(totalSpend)}</div>
            <div className="text-xs text-slate-500">Total Monthly</div>
          </div>
        </div>
      ),
    },
    {
      id: 'chart-types',
      title: 'Top Service Types by Spend',
      defaultLayout: { x: 3, y: 8, w: 3, h: 6 },
      component: (
        <div className="h-full min-h-0">
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
      ),
    },
    {
      id: 'chart-tickets',
      title: 'Closed Tickets (6 months)',
      defaultLayout: { x: 6, y: 8, w: 3, h: 6 },
      component: (
        <div className="h-full min-h-0">
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
      ),
    },
    {
      id: 'chart-orders',
      title: 'Completed Orders (6 months)',
      defaultLayout: { x: 9, y: 8, w: 3, h: 6 },
      component: (
        <div className="h-full min-h-0">
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
      ),
    },
    {
      id: 'chart-commission',
      title: 'Commission by Carrier',
      defaultLayout: { x: 0, y: 14, w: 6, h: 6 },
      component: (
        <div className="h-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commissionData.commissionByCarrier} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="carrier" fontSize={10} angle={-20} textAnchor="end" height={60} />
              <YAxis tickFormatter={v => `$${formatCurrency(Number(v))}`} fontSize={10} />
              <ReTooltip formatter={(value: number) => `$${formatNumber(value)}`} />
              <Bar dataKey="commission" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      id: 'kpis-secondary',
      title: 'Contract KPIs',
      defaultLayout: { x: 0, y: 20, w: 12, h: 3 },
      component: (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 h-full">
          <KPICard label="Active Contracts" value={kpiData.activeContracts} icon={<FileText className="w-4 h-4" />} />
          <KPICard label="M2M Contracts" value={kpiData.monthToMonthContracts} icon={<RefreshCw className="w-4 h-4" />} />
          <KPICard label="Expiring ≤90d" value={kpiData.contractsExpiring90Days} icon={<AlertTriangle className="w-4 h-4" />} trend="up" trendValue="+1" />
          <KPICard label="Pending Issues" value={kpiData.ordersWithPendingIssues} icon={<AlertTriangle className="w-4 h-4" />} />
          <KPICard label="Auto Renew" value={kpiData.autoRenewContracts} icon={<RefreshCw className="w-4 h-4" />} />
          <KPICard label="Expired" value={kpiData.expiredContracts} icon={<XCircle className="w-4 h-4" />} />
          <KPICard label="Expiring ≤180d" value={kpiData.contractsExpiring180Days} icon={<Calendar className="w-4 h-4" />} />
          <KPICard label="Svcs Exp ≤120d" value={kpiData.servicesExpiring120Days} icon={<Clock className="w-4 h-4" />} trend="up" trendValue="+2" />
        </div>
      ),
    },
  ], [kpiData, commissionData, spendByProvider, serviceTypeSpend, monthlyTrends, totalSpend, filters, providerOptions, locationOptions, siteOptions]);

  const { layouts, isEditing, setIsEditing, onLayoutChange, resetLayout } = useDashboardLayout(widgets);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Company Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time view of your network infrastructure</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              isEditing
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isEditing ? <Unlock className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
            {isEditing ? 'Done' : 'Customize'}
          </button>
          {isEditing && (
            <button
              onClick={resetLayout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 12, sm: 12 }}
        rowHeight={60}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={onLayoutChange}
        margin={[16, 16]}
        containerPadding={[0, 0]}
      >
        {widgets.map(widget => (
          <div
            key={widget.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-shadow ${
              isEditing ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
            }`}
          >
            {widget.id !== 'filters' && (
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{widget.title}</h3>
                {isEditing && <span className="text-[10px] text-blue-500 font-medium">Drag to move</span>}
              </div>
            )}
            <div className={`${widget.id === 'filters' ? 'p-4' : 'p-4'} h-[calc(100%-2rem)]`}>
              {widget.component}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};
