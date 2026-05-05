import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Network, MapPin, FileText, Ticket,
  ChevronLeft, ChevronRight, BarChart3, Settings, LogOut, Upload
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/inventory', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Orders', path: '/inventory/orders', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Services', path: '/inventory/services', icon: <Network className="w-4 h-4" /> },
  { label: 'Locations', path: '/inventory/locations', icon: <MapPin className="w-4 h-4" /> },
  { label: 'Contracts', path: '/inventory/contracts', icon: <FileText className="w-4 h-4" /> },
  { label: 'Tickets', path: '/inventory/tickets', icon: <Ticket className="w-4 h-4" />, badge: 1 },
  { label: 'Import Data', path: '/inventory/import', icon: <Upload className="w-4 h-4" /> },
];

const dashboardSubItems: NavItem[] = [
  { label: 'Company Overview', path: '/inventory', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Services Overview', path: '/inventory/services-overview', icon: <Network className="w-4 h-4" /> },
];

interface InventorySidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const InventorySidebar: React.FC<InventorySidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [dashboardOpen, setDashboardOpen] = useState(true);

  const isActive = (path: string) => {
    if (path === '/inventory') return location.pathname === '/inventory' || location.pathname === '/en/inventory' || location.pathname === '/es/inventory';
    return location.pathname.includes(path) || location.pathname.includes(path.replace('/inventory', ''));
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-[#0f172a] text-slate-300 transition-all duration-300 h-screen sticky top-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo area */}
      <div className="flex items-center h-14 px-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              E
            </div>
            <span className="font-semibold text-sm text-white truncate">Network Inventory</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm mx-auto">
            E
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 bg-[#0f172a] border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {/* Dashboard group */}
        <div>
          <button
            onClick={() => !collapsed && setDashboardOpen(!dashboardOpen)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              (isActive('/inventory') || isActive('/inventory/services-overview'))
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-slate-800/50 text-slate-300'
            )}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Dashboard</span>
                <ChevronLeft className={cn('w-3 h-3 transition-transform', dashboardOpen ? '-rotate-90' : '')} />
              </>
            )}
          </button>
          {!collapsed && dashboardOpen && (
            <div className="ml-6 mt-1 space-y-0.5">
              {dashboardSubItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                    isActive(item.path)
                      ? 'bg-blue-600/10 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Main nav items */}
        {navItems.slice(1).map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
              isActive(item.path)
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-slate-800/50 text-slate-300'
            )}
          >
            {item.icon}
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {collapsed && item.badge && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-slate-700/50 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
