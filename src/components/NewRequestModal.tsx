import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { dataClient } from '../lib/dataClient';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerEmail: string;
  onCreated: () => void;
}

const SERVICES = [
  'DIA',
  'Broadband',
  'MPLS',
  'SD-WAN',
  'Dark Fiber',
  '5G',
  'LEO',
  'MEO',
  'GEO',
  'Cloud',
  'Managed Mobility',
  'Managed Services',
];

const BANDWIDTHS = [
  '100 Mbps',
  '500 Mbps',
  '1 Gbps',
  '10 Gbps',
  '100 Gbps',
  'Custom',
];

const COUNTRIES = [
  'Spain',
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Italy',
  'Portugal',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Ireland',
  'Canada',
  'Mexico',
  'Brazil',
  'Australia',
  'Japan',
  'Singapore',
  'United Arab Emirates',
  'South Africa',
  'India',
];

export const NewRequestModal: React.FC<NewRequestModalProps> = ({ isOpen, onClose, buyerEmail, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    service: '',
    country: '',
    city: '',
    bandwidth: '',
    estimated_budget: '',
    deadline: '',
    notes: '',
    priority: 'normal',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.service || !form.country || !form.city) {
      setError('Service, Country and City are required.');
      return;
    }

    setLoading(true);
    try {
      const result = await dataClient.createBuyerRequest({
        buyer_email: buyerEmail,
        service: form.service,
        country: form.country,
        city: form.city,
        bandwidth: form.bandwidth || null,
        estimated_budget: form.estimated_budget || null,
        deadline: form.deadline || null,
        notes: form.notes || null,
        priority: form.priority,
      });

      if (result.error) {
        setError(result.error.message || 'Failed to create request. Please try again.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setForm({ service: '', country: '', city: '', bandwidth: '', estimated_budget: '', deadline: '', notes: '', priority: 'normal' });
          onCreated();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">New Connectivity Request</h3>
                  <p className="text-sm text-zinc-500">Describe your requirements and we will invite matching carriers.</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {success ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Request Created!</h4>
                  <p className="text-sm text-zinc-500">Your request has been submitted. Carriers will be invited shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Service *</label>
                      <select
                        value={form.service}
                        onChange={e => setForm({ ...form, service: e.target.value })}
                        className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                        required
                      >
                        <option value="">Select service...</option>
                        {SERVICES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Priority</label>
                      <select
                        value={form.priority}
                        onChange={e => setForm({ ...form, priority: e.target.value })}
                        className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Country *</label>
                      <select
                        value={form.country}
                        onChange={e => setForm({ ...form, country: e.target.value })}
                        className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                        required
                      >
                        <option value="">Select country...</option>
                        {COUNTRIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">City *</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                        placeholder="e.g. Madrid"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Bandwidth</label>
                      <select
                        value={form.bandwidth}
                        onChange={e => setForm({ ...form, bandwidth: e.target.value })}
                        className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                      >
                        <option value="">Select bandwidth...</option>
                        {BANDWIDTHS.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Estimated Budget</label>
                      <input
                        type="text"
                        value={form.estimated_budget}
                        onChange={e => setForm({ ...form, estimated_budget: e.target.value })}
                        className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                        placeholder="e.g. $2,000-4,000/mo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Deadline</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={e => setForm({ ...form, deadline: e.target.value })}
                      className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Notes & Requirements</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                      rows={3}
                      placeholder="SLA requirements, redundancy needs, special conditions..."
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Request'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
