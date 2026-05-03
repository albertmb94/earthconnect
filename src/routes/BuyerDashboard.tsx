import React, { useState, useEffect } from 'react';
import { Package, FileText, Truck, Calendar, ChevronRight, LogOut, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { getBuyerAuth, logout } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import { dataClient, BuyerRequest } from '../lib/dataClient';
import { NewRequestModal } from '../components/NewRequestModal';
import { BuyerRequestQuotes } from '../components/BuyerRequestQuotes';

type RequestStatus = 'pending' | 'quoted' | 'in_progress' | 'completed';

interface Renewal {
  contract: string;
  provider: string;
  expires: string;
  daysLeft: number;
  monthlyCost: string;
}

const mockRenewals: Renewal[] = [
  { contract: 'Zayo - DIA 500Mbps', provider: 'Zayo', expires: '2024-06-15', daysLeft: 45, monthlyCost: '$2,400' },
  { contract: 'Colt - MPLS Primary', provider: 'Colt', expires: '2024-08-01', daysLeft: 92, monthlyCost: '$4,800' },
  { contract: 'Vodafone - Backup 100Mbps', provider: 'Vodafone', expires: '2024-05-20', daysLeft: 19, monthlyCost: '$890' },
];

const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const config = {
    pending: { icon: Clock, cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    quoted: { icon: FileText, cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    in_progress: { icon: Truck, cls: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    completed: { icon: CheckCircle, cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  };
  const { icon: Icon, cls } = config[status];
  const labels = {
    pending: 'Pending',
    quoted: 'Quotes Received',
    in_progress: 'In Progress',
    completed: 'Completed'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-medium border ${cls}`}>
      <Icon className="w-3 h-3" />
      {labels[status]}
    </span>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase">{label}</div>
        <div className="text-2xl font-black text-zinc-900 dark:text-white">{value}</div>
      </div>
    </div>
  </div>
);

export const BuyerDashboard: React.FC = () => {
  const { lang } = useI18n();
  const [auth] = useState(getBuyerAuth());
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequest | null>(null);

  const fetchRequests = async () => {
    if (!auth?.email) return;
    setLoading(true);
    const data = await dataClient.getBuyerRequests(auth.email);
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [auth?.email]);

  const handleLogout = () => {
    logout();
    window.location.href = `/${lang === 'es' ? 'es' : 'en'}`;
  };

  if (!auth) {
    window.location.href = `/${lang === 'es' ? 'es' : 'en'}/buyer-login`;
    return null;
  }

  const activeRequests = requests.filter(r => r.status !== 'completed').length;
  const totalQuotes = requests.reduce((sum, r) => sum + r.quotes_count, 0);
  const inProgress = requests.filter(r => r.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-1">Buyer Portal</div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back{auth.name ? `, ${auth.name}` : ''}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage your connectivity requests and track quotes from carriers.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Active Requests" value={activeRequests} icon={Package} />
          <StatCard label="Quotes Received" value={totalQuotes} icon={FileText} />
          <StatCard label="Orders in Progress" value={inProgress} icon={Truck} />
          <StatCard label="Upcoming Renewals" value="3" icon={Calendar} />
        </div>

        {/* Requests Table */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your Requests</h2>
            <button
              onClick={() => setShowNewRequest(true)}
              className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
            >
              + New Request
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 flex items-center justify-center gap-3 text-sm text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading your requests...
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-4 px-6 text-2xs font-bold tracking-widest text-zinc-400 uppercase">ID</th>
                    <th className="text-left py-4 px-6 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Service</th>
                    <th className="text-left py-4 px-6 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Location</th>
                    <th className="text-left py-4 px-6 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Bandwidth</th>
                    <th className="text-left py-4 px-6 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Status</th>
                    <th className="text-left py-4 px-6 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Quotes</th>
                    <th className="text-left py-4 px-6 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Created</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => {
                        if (req.status === 'quoted' || req.status === 'in_progress') {
                          setSelectedRequest(req);
                        }
                      }}
                      className={`border-b border-zinc-100 dark:border-zinc-900 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors ${req.status === 'quoted' || req.status === 'in_progress' ? 'cursor-pointer' : ''}`}
                    >
                      <td className="py-4 px-6 font-mono text-xs text-zinc-500">{req.id}</td>
                      <td className="py-4 px-6 font-medium">{req.service}</td>
                      <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">{req.city}, {req.country}</td>
                      <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">{req.bandwidth || '—'}</td>
                      <td className="py-4 px-6"><StatusBadge status={req.status} /></td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
                          {req.quotes_count}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-zinc-500 text-xs">{req.created_at?.split('T')[0]}</td>
                      <td className="py-4 px-6">
                        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-zinc-400">
                        No requests found. Start by creating your first request.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Upcoming Renewals</h2>
          <div className="space-y-3">
            {mockRenewals.map((renewal) => (
              <div
                key={renewal.contract}
                className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{renewal.contract}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">{renewal.provider} · {renewal.monthlyCost}/mo</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${renewal.daysLeft < 30 ? 'text-amber-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {renewal.daysLeft} days
                  </div>
                  <div className="text-xs text-zinc-400">Expires: {renewal.expires}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewRequestModal
        isOpen={showNewRequest}
        onClose={() => setShowNewRequest(false)}
        buyerEmail={auth.email}
        onCreated={fetchRequests}
      />

      <BuyerRequestQuotes
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        requestId={selectedRequest?.id || null}
        requestService={selectedRequest?.service || ''}
        requestLocation={selectedRequest ? `${selectedRequest.city}, ${selectedRequest.country}` : ''}
        onAcceptQuote={fetchRequests}
      />
    </div>
  );
};
