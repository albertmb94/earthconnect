import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, DollarSign, CheckCircle, Shield, Truck, StickyNote, Building2 } from 'lucide-react';
import { dataClient } from '../lib/dataClient';

interface BuyerProposalViewProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  requestService: string;
  requestLocation: string;
  onAcceptProposal: () => void;
}

export const BuyerProposalView: React.FC<BuyerProposalViewProps> = ({
  isOpen,
  onClose,
  requestId,
  requestService,
  requestLocation,
  onAcceptProposal,
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && requestId) {
      fetchProposal();
    }
  }, [isOpen, requestId]);

  const fetchProposal = async () => {
    if (!requestId) return;
    setLoading(true);
    const data = await dataClient.getProposalOptionsForRequest(requestId);
    setOptions(data || []);
    setLoading(false);
  };

  const handleAccept = async (optionId: string, carrierId: string, monthlyPrice: number, commissionRate: number) => {
    if (!requestId) return;
    setAccepting(optionId);
    await dataClient.createDeal({
      buyer_request_id: requestId,
      proposal_id: '', // will be set by the backend
      option_id: optionId,
      carrier_id: carrierId,
      monthly_revenue: monthlyPrice,
      commission_rate: commissionRate,
      contract_term_months: 12,
    });
    setAccepting(null);
    onAcceptProposal();
    onClose();
  };

  const tierConfig: Record<string, { color: string; border: string; bg: string; label: string }> = {
    silver: { color: 'text-zinc-600', border: 'border-zinc-400', bg: 'bg-zinc-500/10', label: 'Silver' },
    gold: { color: 'text-amber-600', border: 'border-amber-400', bg: 'bg-amber-500/10', label: 'Gold' },
    platinum: { color: 'text-purple-600', border: 'border-purple-400', bg: 'bg-purple-500/10', label: 'Platinum' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Your Proposal</h3>
                  <p className="text-sm text-zinc-500">{requestService} — {requestLocation}</p>
                </div>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loading ? (
                <div className="py-12 flex items-center justify-center gap-3 text-sm text-zinc-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading proposal...
                </div>
              ) : options.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-400">
                  No proposal ready yet. Our team is sourcing the best options for you.
                </div>
              ) : (
                <div className="space-y-4">
                  {options.map((option) => {
                    const config = tierConfig[option.tier] || tierConfig.silver;
                    return (
                      <div
                        key={option.id}
                        className={`border-2 rounded-xl p-5 ${config.border} hover:shadow-md transition-all`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-3 h-3 rounded-full ${config.color.replace('text', 'bg')}`} />
                          <span className={`font-bold text-sm ${config.color} uppercase tracking-wide`}>
                            {config.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                              ${(option.monthly_price || 0).toLocaleString()}/mo
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Setup: ${(option.setup_fee || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                            <Shield className="w-3.5 h-3.5 text-sky-500" />
                            <span>{option.sla_uptime || '—'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                            <Truck className="w-3.5 h-3.5 text-amber-500" />
                            <span>{option.installation_weeks ? `${option.installation_weeks} weeks` : '—'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
                          <Building2 className="w-3.5 h-3.5" />
                          <span className="font-medium">{option.carrier_name || 'Carrier Partner'}</span>
                          {option.bandwidth && <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">{option.bandwidth}</span>}
                        </div>

                        {option.notes && (
                          <div className="mb-3 flex items-start gap-2 text-xs text-zinc-500">
                            <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span>{option.notes}</span>
                          </div>
                        )}

                        <button
                          onClick={() => handleAccept(option.id, option.carrier_id, option.monthly_price, option.commission_rate || 15)}
                          disabled={accepting === option.id}
                          className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {accepting === option.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Select {config.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
