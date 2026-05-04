import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataClient } from '../lib/dataClient';

export const AdminProposalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    const data = await dataClient.getAllProposals();
    setProposals(data);
    setLoading(false);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'sent': return <FileText className="w-4 h-4 text-sky-500" />;
      case 'accepted': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
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
            <h1 className="text-3xl font-extrabold tracking-tight">Proposals</h1>
            <p className="text-zinc-500 dark:text-zinc-400">View and manage buyer proposals.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading proposals...
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Title</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Buyer</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Options</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Sent</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Created</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-zinc-100 dark:border-zinc-900 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    onClick={() => p.buyer_request_id && navigate(`/en/admin/proposals/build/${p.buyer_request_id}`)}
                  >
                    <td className="py-3 px-4 font-medium">{p.title}</td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{p.agent_email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
                        {p.option_count || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-medium ${
                        p.status === 'draft' ? 'bg-amber-500/10 text-amber-600' :
                        p.status === 'sent' ? 'bg-sky-500/10 text-sky-600' :
                        p.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600' :
                        p.status === 'rejected' ? 'bg-red-500/10 text-red-600' :
                        'bg-zinc-100 text-zinc-500'
                      }`}>
                        {statusIcon(p.status)}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 text-xs">
                      {p.sent_at ? new Date(p.sent_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 text-xs">
                      {p.created_at?.split('T')[0]}
                    </td>
                  </tr>
                ))}
                {proposals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-zinc-400">
                      No proposals created yet. Go to the Sourcing Pipeline to build one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
