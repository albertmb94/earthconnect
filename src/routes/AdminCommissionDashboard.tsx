import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, TrendingUp, DollarSign, Building2, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataClient } from '../lib/dataClient';

interface CommissionRow {
  company_name: string;
  commission_rate: number;
  active_deals: number;
  total_monthly_commission: number;
  projected_annual_commission: number;
  total_monthly_revenue: number;
}

export const AdminCommissionDashboard: React.FC = () => {
  const [data, setData] = useState<CommissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const result = await dataClient.getCommissionDashboard();
    setData(result as CommissionRow[]);
    setLoading(false);
  };

  const totalMonthlyCommission = data.reduce((a, r) => a + (r.total_monthly_commission || 0), 0);
  const totalAnnualCommission = data.reduce((a, r) => a + (r.projected_annual_commission || 0), 0);
  const totalMonthlyRevenue = data.reduce((a, r) => a + (r.total_monthly_revenue || 0), 0);
  const totalActiveDeals = data.reduce((a, r) => a + (r.active_deals || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 pb-24 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/en/admin" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Commission Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Monthly recurring commissions by carrier partner.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase">Active Deals</div>
                <div className="text-2xl font-black">{totalActiveDeals}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase">Monthly Commission</div>
                <div className="text-2xl font-black">${totalMonthlyCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase">Annual Projected</div>
                <div className="text-2xl font-black">${totalAnnualCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase">Total MRR</div>
                <div className="text-2xl font-black">${totalMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Table */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading commission data...
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Carrier Partner</th>
                  <th className="text-right py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Comm Rate</th>
                  <th className="text-right py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Active Deals</th>
                  <th className="text-right py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Monthly Revenue</th>
                  <th className="text-right py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Monthly Commission</th>
                  <th className="text-right py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Annual Commission</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.company_name} className="border-b border-zinc-100 dark:border-zinc-900 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{row.company_name}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">{row.commission_rate}%</td>
                    <td className="py-3 px-4 text-right">{row.active_deals}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">${(row.total_monthly_revenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">${(row.total_monthly_commission || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="py-3 px-4 text-right font-mono text-purple-600 dark:text-purple-400">${(row.projected_annual_commission || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-zinc-400">
                      No deals closed yet. Close a deal from a buyer proposal to see commissions here.
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
