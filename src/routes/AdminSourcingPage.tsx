import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Loader2, DollarSign, Clock, StickyNote, Building2, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataClient, BuyerRequest, Carrier } from '../lib/dataClient';

export const AdminSourcingPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [matchingCarriers, setMatchingCarriers] = useState<Carrier[]>([]);
  const [searchingCarriers, setSearchingCarriers] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [reqs] = await Promise.all([
        dataClient.getAllBuyerRequests(),
        dataClient.getCarriers(),
      ]);
      setRequests(reqs);
      setLoading(false);
    };
    init();
  }, []);

  const findPartners = async (request: BuyerRequest) => {
    if (expandedRequest === request.id) {
      setExpandedRequest(null);
      return;
    }
    setExpandedRequest(request.id);
    setSearchingCarriers(true);
    const result = await dataClient.searchCarrierPartners(request.country, request.service);
    setMatchingCarriers(result as Carrier[]);
    setSearchingCarriers(false);
  };

  const buildProposal = (request: BuyerRequest) => {
    navigate(`/en/admin/proposals/build/${request.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 pb-24 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/en/admin" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Sourcing Pipeline</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Find carrier partners and build proposals for buyer requests.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading pipeline...
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-lg font-bold">{req.service}</span>
                        {req.bandwidth && (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-2xs font-medium text-zinc-500">
                            {req.bandwidth}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ${
                          req.priority === 'urgent' ? 'bg-red-500/10 text-red-600' :
                          req.priority === 'high' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-zinc-100 text-zinc-500'
                        }`}>
                          {req.priority}
                        </span>
                      </div>
                      <div className="text-sm text-zinc-500 mb-2">
                        {req.city}, {req.country} · {req.buyer_email}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
                        {req.estimated_budget && (
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{req.estimated_budget}</span>
                        )}
                        {req.deadline && (
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Deadline: {req.deadline}</span>
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => findPartners(req)}
                        className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Search className="w-4 h-4" />
                        {expandedRequest === req.id ? 'Hide Partners' : 'Find Partners'}
                      </button>
                      <button
                        onClick={() => buildProposal(req)}
                        className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                        Build Proposal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded: Carrier Partners */}
                {expandedRequest === req.id && (
                  <div className="border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-800/30">
                    <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Carrier Partners covering {req.country} — {req.service}
                    </h3>
                    {searchingCarriers ? (
                      <div className="flex items-center gap-2 text-sm text-zinc-500 py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching partners...
                      </div>
                    ) : matchingCarriers.length === 0 ? (
                      <p className="text-sm text-zinc-400 py-4">
                        No carrier partners found with coverage for {req.service} in {req.country}.{' '}
                        <Link to="/en/admin/carriers" className="text-sky-600 underline">Add carrier coverage</Link>.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {matchingCarriers.map((c) => (
                          <div key={c.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <div>
                              <div className="font-medium text-sm">{c.company_name}</div>
                              <div className="text-xs text-zinc-500">
                                {c.tier} · {c.commission_rate}% commission
                              </div>
                            </div>
                            <button
                              onClick={() => buildProposal(req)}
                              className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
                            >
                              Include
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-12 text-sm text-zinc-400">
                No requests in the pipeline. New buyer requests will appear here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
