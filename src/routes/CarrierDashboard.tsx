import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Clock, DollarSign, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { getCarrierAuth, logout } from '../lib/auth';
import { useI18n } from '../lib/i18n';

interface Opportunity {
  id: string;
  service: string;
  location: string;
  country: string;
  deadline: string;
  estimatedBudget: string;
  bandwidth: string;
  daysUntilDeadline: number;
}

const mockOpportunities: Opportunity[] = [
  { id: 'OPP-2024-042', service: 'DIA', location: 'Madrid', country: 'Spain', deadline: '2024-05-15', estimatedBudget: '$2,400/mo', bandwidth: '500 Mbps', daysUntilDeadline: 15 },
  { id: 'OPP-2024-043', service: 'MPLS', location: 'Barcelona', country: 'Spain', deadline: '2024-05-20', estimatedBudget: '$8,500/mo', bandwidth: '1 Gbps', daysUntilDeadline: 20 },
  { id: 'OPP-2024-044', service: 'Dark Fiber', location: 'Sevilla', country: 'Spain', deadline: '2024-05-28', estimatedBudget: '$15,000/mo', bandwidth: '10 Gbps', daysUntilDeadline: 28 },
  { id: 'OPP-2024-045', service: 'Broadband FTTH', location: 'Valencia', country: 'Spain', deadline: '2024-06-01', estimatedBudget: '$450/mo', bandwidth: '300 Mbps', daysUntilDeadline: 32 },
];

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType; accent?: string }> = ({ label, value, icon: Icon, accent }) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : accent === 'red' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase">{label}</div>
        <div className="text-2xl font-black text-zinc-900 dark:text-white">{value}</div>
      </div>
    </div>
  </div>
);

export const CarrierDashboard: React.FC = () => {
  const { t, lang } = useI18n();
  const [auth] = useState(getCarrierAuth());
  const [submittingQuote, setSubmittingQuote] = useState<string | null>(null);
  const [submittedQuotes, setSubmittedQuotes] = useState<Set<string>>(new Set());

  const handleLogout = () => {
    logout();
    window.location.href = `/${lang === 'es' ? 'es' : 'en'}`;
  };

  const handleQuickQuote = async (oppId: string) => {
    setSubmittingQuote(oppId);
    // Simulate quote submission - <2min flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmittingQuote(null);
    setSubmittedQuotes(prev => new Set([...prev, oppId]));
  };

  if (!auth) {
    window.location.href = `/${lang === 'es' ? 'es' : 'en'}/carrier-login`;
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-1">Carrier Portal</div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back{auth.name ? `, ${auth.name}` : ''}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage opportunities and submit quotes in under 2 minutes.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Deal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Deals Won" value="12" icon={TrendingUp} accent="emerald" />
          <StatCard label="Deals Lost" value="5" icon={TrendingDown} accent="red" />
          <StatCard label="Active Opportunities" value={mockOpportunities.length} icon={Target} />
        </div>

        {/* New Opportunities */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">New Opportunities</h2>
          <div className="space-y-4">
            {mockOpportunities.map((opp) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{opp.service}</span>
                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-2xs font-medium text-zinc-500">
                          {opp.bandwidth}
                        </span>
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{opp.location}, {opp.country}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {opp.daysUntilDeadline} days left
                        </span>
                        <span className="font-mono">{opp.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:flex-row flex-col">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <DollarSign className="w-4 h-4" />
                        {opp.estimatedBudget}
                      </div>
                      <div className="text-xs text-zinc-400">Estimated budget</div>
                    </div>

                    {submittedQuotes.has(opp.id) ? (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Quote Submitted
                      </div>
                    ) : (
                      <button
                        onClick={() => handleQuickQuote(opp.id)}
                        disabled={submittingQuote === opp.id}
                        className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {submittingQuote === opp.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Submit Quote <2min'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Note */}
        <div className="mt-12 p-6 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">Quick Quote Tip</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Carriers who respond to opportunities within 48 hours have a 3x higher chance of winning the deal.
            Our quick quote flow lets you submit preliminary pricing in under 2 minutes without full RFP documentation.
          </p>
        </div>
      </div>
    </div>
  );
};