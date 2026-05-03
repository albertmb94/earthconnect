import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataClient } from '../lib/dataClient';

export const AdminQuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const data = await dataClient.getAllQuotes();
    setQuotes(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 pb-24 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/en/admin" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">All Quotes</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Review every quote submitted by carriers across all requests.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading quotes...
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Carrier</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Request</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Location</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Monthly</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Setup</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">SLA</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Install</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-zinc-100 dark:border-zinc-900 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium">{q.carriers?.company_name || '—'}</div>
                      <div className="text-xs text-zinc-500">{q.carriers?.contact_email || '—'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{q.buyer_requests?.service || '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                      {q.buyer_requests ? `${q.buyer_requests.city}, ${q.buyer_requests.country}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {q.monthly_price ? `$${q.monthly_price.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                      {q.setup_fee ? `$${q.setup_fee.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                      {q.sla_uptime || '—'}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                      {q.installation_weeks ? `${q.installation_weeks}w` : '—'}
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-500">
                      {q.submitted_at ? new Date(q.submitted_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-zinc-400">
                      No quotes submitted yet.
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
