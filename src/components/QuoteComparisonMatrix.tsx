import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

export interface QuoteData {
  id: string;
  provider: string;
  technology: string;
  bandwidth: string;
  monthlyPrice: string;
  setupFee: string;
  sla: {
    uptime: string;
    latency: string;
    mttc: string;
  };
  installationWeeks: number;
  notes?: string;
}

interface QuoteComparisonMatrixProps {
  quotes: QuoteData[];
  onSelectQuote?: (quoteId: string) => void;
}

const getTechnologyIcon = (tech: string) => {
  const icons: Record<string, string> = {
    'DIA': 'bg-blue-500/10 text-blue-500',
    'MPLS': 'bg-purple-500/10 text-purple-500',
    'Dark Fiber': 'bg-amber-500/10 text-amber-500',
    'Broadband': 'bg-emerald-500/10 text-emerald-500',
    '5G/LTE': 'bg-cyan-500/10 text-cyan-500',
    'Satellite': 'bg-indigo-500/10 text-indigo-500',
    'SD-WAN': 'bg-pink-500/10 text-pink-500',
  };
  return icons[tech] || 'bg-zinc-500/10 text-zinc-500';
};

export const QuoteComparisonMatrix: React.FC<QuoteComparisonMatrixProps> = ({ quotes, onSelectQuote }) => {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400 dark:text-zinc-600">
        <p className="text-sm">No quotes to compare yet.</p>
        <p className="text-xs mt-1">Quotes will appear here once carriers submit their proposals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Row with Providers */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="text-left py-3 pr-4 font-bold text-zinc-400 text-2xs uppercase tracking-wider w-48">Provider</th>
              {quotes.map((quote) => (
                <th key={quote.id} className="text-left py-3 px-4 min-w-[160px]">
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-100">{quote.provider}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-2xs font-medium ${getTechnologyIcon(quote.technology)}`}>
                      {quote.technology}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {/* Bandwidth Row */}
            <tr>
              <td className="py-4 pr-4 text-2xs font-bold text-zinc-400 uppercase tracking-wider">Bandwidth</td>
              {quotes.map((quote) => (
                <td key={quote.id} className="py-4 px-4">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{quote.bandwidth}</span>
                </td>
              ))}
            </tr>
            {/* Monthly Price Row */}
            <tr className="bg-zinc-50 dark:bg-zinc-900/50">
              <td className="py-4 pr-4 text-2xs font-bold text-zinc-400 uppercase tracking-wider">Monthly Price</td>
              {quotes.map((quote) => (
                <td key={quote.id} className="py-4 px-4">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{quote.monthlyPrice}</span>
                </td>
              ))}
            </tr>
            {/* Setup Fee Row */}
            <tr>
              <td className="py-4 pr-4 text-2xs font-bold text-zinc-400 uppercase tracking-wider">Setup Fee</td>
              {quotes.map((quote) => (
                <td key={quote.id} className="py-4 px-4 text-zinc-600 dark:text-zinc-400">
                  {quote.setupFee}
                </td>
              ))}
            </tr>
            {/* SLA - Uptime Row */}
            <tr className="bg-zinc-50 dark:bg-zinc-900/50">
              <td className="py-4 pr-4 text-2xs font-bold text-zinc-400 uppercase tracking-wider">SLA Uptime</td>
              {quotes.map((quote) => (
                <td key={quote.id} className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
                    quote.sla.uptime === '99.99%' || quote.sla.uptime === '99.999%'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : quote.sla.uptime === '99.9%'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                    {quote.sla.uptime}
                  </span>
                </td>
              ))}
            </tr>
            {/* SLA - Latency Row */}
            <tr>
              <td className="py-4 pr-4 text-2xs font-bold text-zinc-400 uppercase tracking-wider">Latency Guarantee</td>
              {quotes.map((quote) => (
                <td key={quote.id} className="py-4 px-4 text-zinc-600 dark:text-zinc-400">
                  {quote.sla.latency}
                </td>
              ))}
            </tr>
            {/* SLA - MTTC Row */}
            <tr className="bg-zinc-50 dark:bg-zinc-900/50">
              <td className="py-4 pr-4 text-2xs font-bold text-zinc-400 uppercase tracking-wider">MTTR / MTTC</td>
              {quotes.map((quote) => (
                <td key={quote.id} className="py-4 px-4 text-zinc-600 dark:text-zinc-400">
                  {quote.sla.mttc}
                </td>
              ))}
            </tr>
            {/* Installation Time Row */}
            <tr>
              <td className="py-4 pr-4 text-2xs font-bold text-zinc-400 uppercase tracking-wider">Installation</td>
              {quotes.map((quote) => (
                <td key={quote.id} className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
                    quote.installationWeeks <= 2
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : quote.installationWeeks <= 4
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {quote.installationWeeks} weeks
                  </span>
                </td>
              ))}
            </tr>
            {/* Notes Row */}
            {quotes.some(q => q.notes) && (
              <tr>
                <td className="py-4 pr-4 text-2xs font-bold text-zinc-400 uppercase tracking-wider">Notes</td>
                {quotes.map((quote) => (
                  <td key={quote.id} className="py-4 px-4 text-xs text-zinc-500 dark:text-zinc-400">
                    {quote.notes || '-'}
                  </td>
                ))}
              </tr>
            )}
            {/* Action Row */}
            <tr>
              <td className="py-6 pr-4"></td>
              {quotes.map((quote) => (
                <td key={quote.id} className="py-6 px-4">
                  <button
                    onClick={() => onSelectQuote?.(quote.id)}
                    className="w-full px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-lg text-xs hover:opacity-90 transition-all cursor-pointer"
                  >
                    Select Quote
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comparison Legend */}
      <div className="flex flex-wrap gap-4 text-2xs text-zinc-400 dark:text-zinc-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30"></span>
          Best in class
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30"></span>
          Good option
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></span>
          Longer lead time
        </span>
      </div>
    </div>
  );
};

// Demo data for testing
export const mockQuotes: QuoteData[] = [
  {
    id: 'Q-001',
    provider: 'Zayo',
    technology: 'DIA',
    bandwidth: '500 Mbps',
    monthlyPrice: '$2,400',
    setupFee: '$500',
    sla: { uptime: '99.99%', latency: '<5ms', mttc: '<4 hours' },
    installationWeeks: 2,
    notes: 'Includes BGP routing'
  },
  {
    id: 'Q-002',
    provider: 'Colt',
    technology: 'DIA',
    bandwidth: '500 Mbps',
    monthlyPrice: '$2,650',
    setupFee: '$0',
    sla: { uptime: '99.999%', latency: '<3ms', mttc: '<2 hours' },
    installationWeeks: 3,
    notes: 'Premium SLA with dedicated NOC'
  },
  {
    id: 'Q-003',
    provider: 'Vodafone',
    technology: 'Broadband FTTH',
    bandwidth: '500 Mbps',
    monthlyPrice: '$890',
    setupFee: '$150',
    sla: { uptime: '99.9%', latency: '<15ms', mttc: '<24 hours' },
    installationWeeks: 1,
    notes: 'Best effort SLA, no BGP'
  }
];