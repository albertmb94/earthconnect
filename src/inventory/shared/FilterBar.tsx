import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, string[]>;
  onChange: (key: string, values: string[]) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, values, onChange, className }) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCount = Object.values(values).flat().length;

  const clearAll = () => {
    filters.forEach(f => onChange(f.key, []));
  };

  return (
    <div ref={ref} className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span className="font-medium">Filters</span>
      </div>
      
      {filters.map(filter => {
        const selected = values[filter.key] || [];
        const isOpen = openFilter === filter.key;
        
        return (
          <div key={filter.key} className="relative">
            <button
              onClick={() => setOpenFilter(isOpen ? null : filter.key)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors',
                selected.length > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {filter.label}
              {selected.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                  {selected.length}
                </span>
              )}
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')} />
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg border border-slate-200 shadow-lg z-50 py-1">
                {filter.options.map(opt => {
                  const isSelected = selected.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        const next = isSelected
                          ? selected.filter(v => v !== opt.value)
                          : [...selected, opt.value];
                        onChange(filter.key, next);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2',
                        isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                      )}>
                        {isSelected && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );
};
