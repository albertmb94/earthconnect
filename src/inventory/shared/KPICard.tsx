import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatNumber } from '../data/useInventoryData';

interface KPICardProps {
  label: string;
  value: string | number;
  prefix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label, value, prefix = '', trend, trendValue, icon, className
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400';

  return (
    <div className={cn('bg-white rounded-lg border border-slate-100 p-3', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            {prefix && <span className="text-lg font-semibold text-slate-700">{prefix}</span>}
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {typeof value === 'number' ? formatNumber(value) : value}
            </span>
          </div>
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-3 p-2 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1.5">
          <TrendIcon className={cn('w-3.5 h-3.5', trendColor)} />
          <span className={cn('text-xs font-medium', trendColor)}>{trendValue}</span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
