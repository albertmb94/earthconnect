import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { dataClient, BuyerRequest, Carrier } from '../lib/dataClient';
import { ProposalBuilder } from '../components/ProposalBuilder';

export const AdminProposalBuilder: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<BuyerRequest | null>(null);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requestId) return;
    const init = async () => {
      setLoading(true);
      const [req, carrs] = await Promise.all([
        dataClient.getBuyerRequestById(requestId),
        dataClient.getCarriers(),
      ]);
      setRequest(req);
      setCarriers(carrs.filter(c => c.active));
      setLoading(false);
    };
    init();
  }, [requestId]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 pb-24 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/en/admin/sourcing" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Build Proposal</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Create Silver / Gold / Platinum options for the buyer.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading request...
          </div>
        ) : !request ? (
          <div className="text-center py-12 text-sm text-zinc-400">
            Request not found.
          </div>
        ) : (
          <>
            {/* Request Context Banner */}
            <div className="bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span className="text-white font-bold text-lg">{request.service}</span>
                {request.bandwidth && (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-2xs font-medium">
                    {request.bandwidth}
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-sm">{request.city}, {request.country} · {request.buyer_email}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                {request.estimated_budget && <span>Budget: {request.estimated_budget}</span>}
                {request.deadline && <span>Deadline: {request.deadline}</span>}
              </div>
            </div>

            {/* ProposalBuilder compound component */}
            <ProposalBuilder.Provider requestId={requestId!} carriers={carriers}>
              <ProposalBuilder.Frame>
                <ProposalBuilder.Header />
                {[0, 1, 2].map((i) => (
                  <ProposalBuilder.OptionCard key={i} index={i} />
                ))}
                <ProposalBuilder.Actions />
              </ProposalBuilder.Frame>
              {/* CommissionPreview OUTSIDE Frame, INSIDE Provider */}
              <ProposalBuilder.CommissionPreview />
            </ProposalBuilder.Provider>
          </>
        )}
      </div>
    </div>
  );
};
