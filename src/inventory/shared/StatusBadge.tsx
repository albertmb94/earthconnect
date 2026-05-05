import React from 'react';
import { cn } from '@/utils/cn';

type StatusType = 'active' | 'pending' | 'suspended' | 'cancelled' |
  'completed' | 'in-progress' | 'on-hold' |
  'open' | 'closed' | 'expired' | 'fixed-term' | 'month-to-month' |
  'low' | 'medium' | 'high' | 'critical';

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  suspended: 'bg-red-50 text-red-700 ring-red-600/20',
  cancelled: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'in-progress': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'on-hold': 'bg-orange-50 text-orange-700 ring-orange-600/20',
  open: 'bg-red-50 text-red-700 ring-red-600/20',
  closed: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  expired: 'bg-gray-50 text-gray-500 ring-gray-500/20',
  'fixed-term': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'month-to-month': 'bg-purple-50 text-purple-700 ring-purple-600/20',
  low: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  medium: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  high: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  critical: 'bg-red-50 text-red-700 ring-red-600/20',
};

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const style = statusStyles[status.toLowerCase()] || statusStyles['pending'];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        style,
        className
      )}
    >
      {label || status}
    </span>
  );
};
