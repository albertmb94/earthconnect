import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Settings, Download } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  hidden?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  defaultSortKey?: string;
  defaultSortDir?: 'asc' | 'desc';
  pageSize?: number;
  pageSizeOptions?: number[];
  searchable?: boolean;
  searchKeys?: string[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  showExport?: boolean;
  exportFilename?: string;
}

export function DataTable<T>({
  data, columns, keyExtractor, defaultSortKey, defaultSortDir = 'asc',
  pageSize: defaultPageSize = 15, pageSizeOptions = [10, 15, 25, 50],
  searchable = false, searchKeys = [], onRowClick, emptyMessage = 'No data available',
  className, showExport = false, exportFilename = 'export.csv'
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [search, setSearch] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const vis: Record<string, boolean> = {};
    columns.forEach(c => vis[c.key] = !c.hidden);
    return vis;
  });
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchable || !search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter(row => {
      return searchKeys.some(key => {
        const val = (row as Record<string, unknown>)[key];
        return val !== undefined && String(val).toLowerCase().includes(term);
      });
    });
  }, [data, search, searchable, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal === null || aVal === undefined) return sortDir === 'asc' ? 1 : -1;
      if (bVal === null || bVal === undefined) return sortDir === 'asc' ? -1 : 1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortDir === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginated = sortedData.slice(start, start + pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const visibleColumns = columns.filter(c => columnVisibility[c.key]);

  const handleExport = () => {
    const headers = visibleColumns.map(c => c.header).join(',');
    const rows = sortedData.map(row =>
      visibleColumns.map(c => {
        // Always extract raw value by key; render functions are UI-only
        const rawVal = (row as Record<string, unknown>)[c.key];
        const val = rawVal !== undefined && rawVal !== null ? String(rawVal) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
        {searchable && (
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {showExport && (
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Columns
            </button>
            {showColumnSettings && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-50 py-1">
                {columns.map(col => (
                  <button
                    key={col.key}
                    onClick={() => setColumnVisibility(prev => ({ ...prev, [col.key]: !prev[col.key] }))}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2',
                      columnVisibility[col.key] ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <span className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                      columnVisibility[col.key] ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                    )}>
                      {columnVisibility[col.key] && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </span>
                    {col.header}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              {visibleColumns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3 font-semibold whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-slate-700',
                    col.width
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-5 py-12 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map(row => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-slate-50 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-blue-50/50'
                  )}
                >
                  {visibleColumns.map(col => (
                    <td key={col.key} className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Showing <span className="font-medium">{start + 1}</span> to{' '}
            <span className="font-medium">{Math.min(start + pageSize, sortedData.length)}</span> of{' '}
            <span className="font-medium">{sortedData.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>{opt} / page</option>
              ))}
            </select>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="text-xs font-medium text-slate-600 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
