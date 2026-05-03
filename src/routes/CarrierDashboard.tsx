import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, DollarSign, MapPin, Loader2, CheckCircle, X, StickyNote } from 'lucide-react';
import { getCarrierAuth, logout } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import { dataClient, AssignedRequest, Carrier } from '../lib/dataClient';

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
  const { lang } = useI18n();
  const [auth] = useState(getCarrierAuth());
  const [carrier, setCarrier] = useState<Carrier | null>(null);
  const [assignments, setAssignments] = useState<AssignedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingQuote, setSubmittingQuote] = useState<string | null>(null);
  const [submittedQuotes, setSubmittedQuotes] = useState<Set<string>>(new Set());
  const [quoteModal, setQuoteModal] = useState<AssignedRequest | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    monthly_price: '',
    setup_fee: '',
    sla_uptime: '',
    sla_latency: '',
    installation_weeks: '',
    notes: ''
  });

  useEffect(() => {
    const init = async () => {
      if (!auth?.email) return;
      setLoading(true);
      // Get carrier UUID from email
      const c = await dataClient.getCarrierByEmail(auth.email);
      setCarrier(c);
      // Get assigned requests (RPC handles email→UUID internally)
      const data = await dataClient.getAssignedRequests(auth.email);
      setAssignments(data);
      setLoading(false);
    };
    init();
  }, [auth?.email]);

  const handleLogout = () => {
    logout();
    window.location.href = `/${lang === 'es' ? 'es' : 'en'}`;
  };

  const openQuoteModal = async (assignment: AssignedRequest) => {
    // Mark as viewed if currently invited
    if (assignment.assignment_status === 'invited') {
      await dataClient.markAssignmentViewed(assignment.assignment_id);
      // Optimistically update local state
      setAssignments(prev => prev.map(a =>
        a.assignment_id === assignment.assignment_id ? { ...a, assignment_status: 'viewed' } : a
      ));
    }
    setQuoteModal(assignment);
  };

  const handleSubmitQuote = async () => {
    if (!quoteModal || !carrier) return;
    setSubmittingQuote(quoteModal.assignment_id);

    // Submit quote linked to buyer_request_id
    const result = await dataClient.submitQuote({
      buyer_request_id: quoteModal.request_id,
      carrier_id: carrier.id,
      monthly_price: parseFloat(quoteForm.monthly_price) || undefined,
      setup_fee: parseFloat(quoteForm.setup_fee) || undefined,
      sla_uptime: quoteForm.sla_uptime || undefined,
      sla_latency: quoteForm.sla_latency || undefined,
      installation_weeks: parseInt(quoteForm.installation_weeks) || undefined,
      notes: quoteForm.notes || undefined,
    });

    if (result.success) {
      // Mark assignment as quoted
      await dataClient.markAssignmentQuoted(quoteModal.assignment_id);
      setSubmittedQuotes(prev => new Set([...prev, quoteModal.assignment_id]));
      setAssignments(prev => prev.map(a =>
        a.assignment_id === quoteModal.assignment_id ? { ...a, assignment_status: 'quoted' } : a
      ));
    }

    setSubmittingQuote(null);
    setQuoteModal(null);
    setQuoteForm({ monthly_price: '', setup_fee: '', sla_uptime: '', sla_latency: '', installation_weeks: '', notes: '' });
  };

  const daysUntil = (deadline: string | null) => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (!auth) {
    window.location.href = `/${lang === 'es' ? 'es' : 'en'}/carrier-login`;
    return null;
  }

  const invitedCount = assignments.filter(a => a.assignment_status === 'invited').length;
  const quotedCount = assignments.filter(a => a.assignment_status === 'quoted').length;

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
              View assigned requests and submit quotes from buyers.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Assigned Requests" value={assignments.length} icon={Target} />
          <StatCard label="New Invites" value={invitedCount} icon={TrendingUp} accent="emerald" />
          <StatCard label="Quotes Submitted" value={quotedCount} icon={CheckCircle} />
        </div>

        {/* Assigned Requests */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Assigned Requests</h2>
          {loading ? (
            <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-12">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading assignments...
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => {
                const daysLeft = daysUntil(assignment.deadline);
                const alreadyQuoted = submittedQuotes.has(assignment.assignment_id) || assignment.assignment_status === 'quoted';
                return (
                  <motion.div
                    key={assignment.assignment_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{assignment.service}</span>
                            {assignment.bandwidth && (
                              <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-2xs font-medium text-zinc-500">
                                {assignment.bandwidth}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ${
                              assignment.assignment_status === 'invited' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                              assignment.assignment_status === 'viewed' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' :
                              assignment.assignment_status === 'quoted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                              'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                            }`}>
                              {assignment.assignment_status.charAt(0).toUpperCase() + assignment.assignment_status.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">{assignment.city}, {assignment.country}</div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400 flex-wrap">
                            {daysLeft !== null && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {daysLeft} days left
                              </span>
                            )}
                            {assignment.estimated_budget && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                Budget: {assignment.estimated_budget}
                              </span>
                            )}
                            <span className="font-mono">{assignment.request_id.slice(0, 8)}</span>
                          </div>
                          {assignment.notes && (
                            <div className="mt-2 flex items-start gap-1.5 text-xs text-zinc-500">
                              <StickyNote className="w-3 h-3 mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{assignment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 md:flex-row flex-col">
                        {alreadyQuoted ? (
                          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Quote Submitted
                          </div>
                        ) : (
                          <button
                            onClick={() => openQuoteModal(assignment)}
                            disabled={submittingQuote === assignment.assignment_id}
                            className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                          >
                            Submit Quote
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {assignments.length === 0 && (
                <div className="text-center py-12 text-sm text-zinc-400">
                  No assigned requests at the moment. New invites will appear here when the admin assigns you to a buyer request.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tip */}
        <div className="mt-12 p-6 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">Quick Quote Tip</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Carriers who respond to requests within 48 hours have a 3x higher chance of winning the deal.
            Our quick quote flow lets you submit preliminary pricing in under 2 minutes.
          </p>
        </div>
      </div>

      {/* Quote Submission Modal */}
      {quoteModal && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Submit Quote</h3>
                <p className="text-sm text-zinc-500">{quoteModal.service} — {quoteModal.city}, {quoteModal.country}</p>
              </div>
              <button onClick={() => setQuoteModal(null)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Monthly Price (USD)</label>
                  <input
                    type="number"
                    value={quoteForm.monthly_price}
                    onChange={e => setQuoteForm({ ...quoteForm, monthly_price: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                    placeholder="e.g. 2400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Setup Fee (USD)</label>
                  <input
                    type="number"
                    value={quoteForm.setup_fee}
                    onChange={e => setQuoteForm({ ...quoteForm, setup_fee: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">SLA Uptime</label>
                  <input
                    type="text"
                    value={quoteForm.sla_uptime}
                    onChange={e => setQuoteForm({ ...quoteForm, sla_uptime: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                    placeholder="e.g. 99.99%"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">SLA Latency</label>
                  <input
                    type="text"
                    value={quoteForm.sla_latency}
                    onChange={e => setQuoteForm({ ...quoteForm, sla_latency: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                    placeholder="e.g. <10ms"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Install Weeks</label>
                <input
                  type="number"
                  value={quoteForm.installation_weeks}
                  onChange={e => setQuoteForm({ ...quoteForm, installation_weeks: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                  placeholder="e.g. 4"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Notes</label>
                <textarea
                  value={quoteForm.notes}
                  onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                  rows={3}
                  placeholder="Any special conditions or assumptions..."
                />
              </div>
              <button
                onClick={handleSubmitQuote}
                disabled={submittingQuote === quoteModal.assignment_id}
                className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submittingQuote === quoteModal.assignment_id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Quote'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
