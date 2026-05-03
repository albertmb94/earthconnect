import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2, CheckCircle, DollarSign, Clock, StickyNote, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataClient, BuyerRequest } from '../lib/dataClient';

interface SuggestedCarrier {
  carrier_id: string;
  company_name: string;
  contact_email: string;
  tier: string;
  avg_response_hours: number;
  avg_monthly_price: number;
  total_quotes: number;
  last_quote_at: string | null;
}

export const AdminRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequest | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedCarrier[]>([]);
  const [selectedCarriers, setSelectedCarriers] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const data = await dataClient.getPendingRequests();
    setRequests(data);
    setLoading(false);
  };

  const openAssignModal = async (req: BuyerRequest) => {
    setSelectedRequest(req);
    setSelectedCarriers(new Set());
    setSent(false);
    const data = await dataClient.suggestCarriers(req.id);
    setSuggestions(data as SuggestedCarrier[]);
  };

  const toggleCarrier = (id: string) => {
    setSelectedCarriers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAssign = async () => {
    if (!selectedRequest || selectedCarriers.size === 0) return;
    setSending(true);
    const result = await dataClient.assignCarriersToRequest(
      selectedRequest.id,
      Array.from(selectedCarriers)
    );
    setSending(false);
    if (result.success) {
      setSent(true);
      setTimeout(() => {
        setSelectedRequest(null);
        fetchRequests();
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 pb-24 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/en/admin" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Pending Requests</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Review buyer requests and assign carriers to quote.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading requests...
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{req.service}</span>
                      {req.bandwidth && (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-2xs font-medium text-zinc-500">{req.bandwidth}</span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ${
                        req.priority === 'urgent' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                        req.priority === 'high' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      }`}>
                        {req.priority}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                      {req.city}, {req.country} · {req.buyer_email}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
                      {req.estimated_budget && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {req.estimated_budget}
                        </span>
                      )}
                      {req.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Deadline: {req.deadline}
                        </span>
                      )}
                      <span>Created: {req.created_at?.split('T')[0]}</span>
                    </div>
                    {req.notes && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-zinc-500">
                        <StickyNote className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{req.notes}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => openAssignModal(req)}
                    className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Assign Carriers
                  </button>
                </div>
              </motion.div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-12 text-sm text-zinc-400">
                No pending requests. All buyer requests have been assigned to carriers.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl p-6"
          >
            {sent ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Invitations Sent!</h4>
                <p className="text-sm text-zinc-500">Selected carriers have been invited to quote on this request.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Assign Carriers</h3>
                    <p className="text-sm text-zinc-500">{selectedRequest.service} — {selectedRequest.city}, {selectedRequest.country}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-xs text-sky-700 dark:text-sky-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Carriers are ranked by coverage match, tier, and historical pricing. Select the carriers you want to invite.</span>
                </div>

                <div className="space-y-2 mb-6">
                  {suggestions.map((carrier) => (
                    <label
                      key={carrier.carrier_id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedCarriers.has(carrier.carrier_id)
                          ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800/50'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCarriers.has(carrier.carrier_id)}
                        onChange={() => toggleCarrier(carrier.carrier_id)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{carrier.company_name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-2xs font-medium ${
                            carrier.tier === 'premium' ? 'bg-purple-500/10 text-purple-600' :
                            carrier.tier === 'standard' ? 'bg-sky-500/10 text-sky-600' :
                            'bg-zinc-100 text-zinc-500'
                          }`}>
                            {carrier.tier}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span>Avg response: {carrier.avg_response_hours > 0 ? `${Math.round(carrier.avg_response_hours)}h` : 'N/A'}</span>
                          <span>Avg price: {carrier.avg_monthly_price > 0 ? `$${Math.round(carrier.avg_monthly_price)}` : 'N/A'}</span>
                          <span>Total quotes: {carrier.total_quotes}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                  {suggestions.length === 0 && (
                    <div className="text-center py-8 text-sm text-zinc-400">
                      No carriers found with coverage for {selectedRequest.country} + {selectedRequest.service}.
                      <br />
                      <Link to="/en/admin/carriers" className="text-sky-600 dark:text-sky-400 underline mt-1 inline-block">
                        Add carrier coverage
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{selectedCarriers.size} selected</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssign}
                      disabled={sending || selectedCarriers.size === 0}
                      className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Invitations
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
