import React from 'react';
import { Filter, Check } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { cn } from '../utils/cn';

export interface ServiceFilterItem {
  key: string;
  label: string;
  category: 'node' | 'coverage';
  color: string; // tailwind text-* class
}

interface ServiceFilterProps {
  items: ServiceFilterItem[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}

export const ServiceFilter: React.FC<ServiceFilterProps> = ({ items, selected, onChange }) => {
  const { t } = useI18n();

  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    onChange(next);
  };

  const selectAll = () => onChange(new Set(items.map(i => i.key)));
  const clearAll = () => onChange(new Set());

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Filter className="w-4 h-4 text-zinc-400" />
          {t.filterServices}
          <span className="text-2xs font-normal text-zinc-400">
            ({selected.size}/{items.length})
          </span>
        </div>
        <div className="flex items-center gap-1 text-2xs">
          <button
            onClick={selectAll}
            className="px-2 py-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            {t.selectAll}
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <button
            onClick={clearAll}
            className="px-2 py-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            {t.clearAll}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const isActive = selected.has(item.key);
          return (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              className={cn(
                "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                isActive
                  ? "bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900 shadow-sm"
                  : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <span className={cn(
                "w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all",
                isActive 
                  ? "bg-white dark:bg-zinc-900 border-white dark:border-zinc-900" 
                  : "border-zinc-300 dark:border-zinc-700"
              )}>
                {isActive && <Check className="w-2.5 h-2.5 text-zinc-900 dark:text-white" strokeWidth={3} />}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
