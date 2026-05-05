import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { GridLayout, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
  MapPin, Wifi, Ticket, ShoppingCart, FileText, AlertTriangle, RefreshCw, Clock, Calendar, XCircle,
  DollarSign, TrendingUp, Package, Download, Settings, RotateCcw, Unlock
} from 'lucide-react';
import { KPICard } from '../shared/KPICard';
import { ChartCard } from '../shared/ChartCard';
import { FilterBar } from '../shared/FilterBar';
import { useFilteredInventoryData, formatCurrency, formatCurrencyFull, formatNumber } from '../data/useInventoryData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const LAYOUT_STORAGE_KEY = 'ec_inventory_dashboard_layout';

interface WidgetDef {
  id: string;
  title: string;
  component: React.ReactNode;
  defaultLayout: { x: number; y: number; w: number; h: number };
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(entries => {
      setWidth(Math.floor(entries[0].contentRect.width));
    });
    ro.observe(el);
    setWidth(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

function useDashboardLayout(widgets: WidgetDef[]) {
  const defaultLayout: Layout[] = widgets.map(w => ({ i: w.id, ...w.defaultLayout }));

  const [layout, setLayout] = useState<Layout[]>(() => {
    try {
      const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Layout[];
        if (parsed.length === widgets.length && widgets.every(w => parsed.some(p => p.i === w.id))) {
          return parsed;
        }
      }
    } catch { /* ignore */ }
    return defaultLayout;
  });

  const [isEditing, setIsEditing] = useState(false);

  const onLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(newLayout));
  }, []);

  const resetLayout = useCallback(() => {
    setLayout(defaultLayout);
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(defaultLayout));
  }, [defaultLayout]);

  return { layout, isEditing, setIsEditing, onLayoutChange, resetLayout };
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

  const { ref: gridContainerRef, width: gridWidth } = useContainerWidth();

  const providerOptions = [...new Set(raw.locations.map(l => l.provider))].map(p => ({ label: p, value: p }));
  const locationOptions = raw.locations.map(l => ({ label: l.name, value: l.id }));
  const siteOptions = raw.locations.map(l => ({ label: l.siteId, value: l.siteId }));

  const totalSpend = spendByProvider.reduce((sum, s) => sum + s.spend, 0);

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

  const widgets: WidgetDef[] = useMemo(() => [
    {
      id: 'kpis-primary',
      title: 'Primary KPIs',
      defaultLayout: { x: 0, y: 0, w: 12, h: 2 },
      component: (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 h-full content-center">
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
      defaultLayout: { x: 0, y: 2, w: 12, h: 2 },
      component: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-full content-center">
          <KPICard label="Monthly Commission" value={formatCurrency(commissionData.monthlyCommission).replace('$', '')} prefix="$" icon={<DollarSign className="w-4 h-4" />} trend="up" trendValue="+8.4%" />
          <KPICard label="Annual Projected" value={formatCurrency(commissionData.annualProjected).replace('$', '')} prefix="$" icon={<TrendingUp className="w-4 h-4" />} trend="up" trendValue="+12.1%" />
          <KPICard label="Active Deals" value={commissionData.activeDeals} icon={<Package className="w-4 h-4" />} trend="up" trendValue="+2" />
          <KPICard label="Total Revenue" value={formatCurrency(commissionData.totalRevenue).replace('$', '')} prefix="$" icon={<DollarSign className="w-4 h-4" />} trend="up" trendValue="+6.7%" />
        </div>
      ),
    },
    {
      id: 'chart-spend',
      title: 'Spend by Provider',
      defaultLayout: { x: 0, y: 4, w: 3, h: 5 },
      component: (
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendByProvider} cx="50%" cy="50%" innerRadius="40%" outerRadius="65%" paddingAngle={3} dataKey="spend" nameKey="provider">
                  {spendByProvider.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(value: number) => `$${formatNumber(value)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center shrink-0 pb-1">
            <div className="text-xs font-bold text-slate-900">${formatCurrency(totalSpend)}</div>
            <div className="text-[9px] text-slate-500">Total Monthly</div>
          </div>
        </div>
      ),
    },
    {
      id: 'chart-types',
      title: 'Service Types by Spend',
      defaultLayout: { x: 3, y: 4, w: 3, h: 5 },
      component: (
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceTypeSpend} layout="vertical" margin={{ left: 5, right: 5, top: 2, bottom: 2 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tickFormatter={v => `$${formatCurrency(Number(v))}`} fontSize={9} />
              <YAxis type="category" dataKey="type" width={80} fontSize={8} />
              <ReTooltip formatter={(value: number) => `$${formatNumber(value)}`} />
              <Bar dataKey="spend" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      id: 'chart-tickets',
      title: 'Closed Tickets',
      defaultLayout: { x: 6, y: 4, w: 3, h: 5 },
      component: (
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends} margin={{ left: 0, right: 5, top: 2, bottom: 2 }}>
              <defs>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" fontSize={9} />
              <YAxis fontSize={9} />
              <ReTooltip />
              <Area type="monotone" dataKey="ticketsClosed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTickets)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      id: 'chart-orders',
      title: 'Completed Orders',
      defaultLayout: { x: 9, y: 4, w: 3, h: 5 },
      component: (
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends} margin={{ left: 0, right: 5, top: 2, bottom: 2 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" fontSize={9} />
              <YAxis fontSize={9} />
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
      defaultLayout: { x: 0, y: 9, w: 6, h: 5 },
      component: (
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commissionData.commissionByCarrier} margin={{ left: 5, right: 5, top: 2, bottom: 2 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="carrier" fontSize={9} angle={-12} textAnchor="end" height={40} />
              <YAxis tickFormatter={v => `$${formatCurrency(Number(v))}`} fontSize={9} />
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
      defaultLayout: { x: 0, y: 14, w: 12, h: 2 },
      component: (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 h-full content-center">
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
  ], [kpiData, commissionData, spendByProvider, serviceTypeSpend, monthlyTrends, totalSpend]);

  const { layout, isEditing, setIsEditing, onLayoutChange, resetLayout } = useDashboardLayout(widgets);

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

      {/* Filters */}
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

      {/* Grid Layout — fills full container width */}
      <div ref={gridContainerRef} className="w-full">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={52}
          width={gridWidth}
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={onLayoutChange}
          margin={[12, 12]}
          containerPadding={[0, 0]}
          draggableHandle=".drag-handle"
          autoSize={true}
          verticalCompact={true}
        >
          {widgets.map(widget => (
            <div
              key={widget.id}
              className={`bg-white rounded-xl border shadow-sm flex flex-col h-full ${
                isEditing ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <div className={`px-3 py-1.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0 ${isEditing ? 'drag-handle cursor-move' : ''}`}>
                <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">{widget.title}</h3>
                {isEditing && <span className="text-[10px] text-blue-500 font-medium shrink-0 ml-2">Drag · Resize</span>}
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                {widget.component}
              </div>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};
