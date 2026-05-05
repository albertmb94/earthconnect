import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { InventorySidebar } from './InventorySidebar';
import { cn } from '@/utils/cn';

export const InventoryLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <InventorySidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
          {/* Global search */}
          <div className="flex-1 max-w-xl relative">
            <div className={cn(
              'flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 transition-all',
              searchOpen && 'ring-2 ring-blue-500 border-transparent bg-white'
            )}>
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search orders, services, locations, contracts..."
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User */}
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden md:block">Admin User</span>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
