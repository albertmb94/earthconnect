import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, Users, Truck, FileText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataClient, AdminStats, LeadRecord, NodeImportRow } from '../lib/dataClient';

export const AdminDashboard: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);
  const [stats, setStats] = useState<AdminStats>({ total_nodes: 0, cities_covered: 0, provider_bids: 0, total_leads: 0, pending_requests: 0, total_carriers: 0, quoted_requests: 0 });
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const load = async () => {
      const s = await dataClient.getAdminStats();
      setStats(s);
      const l = await dataClient.getRecentLeads(20);
      setLeads(l);
      setLoadingStats(false);
    };
    load();
  }, []);

  const parseCSV = (text: string): NodeImportRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows: NodeImportRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < 8) continue;
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx]?.trim() || ''; });
      const lat = parseFloat(row.lat);
      const lng = parseFloat(row.lng);
      const price = parseFloat(row.price_monthly);
      if (isNaN(lat) || isNaN(lng) || isNaN(price)) continue;
      rows.push({
        requested_tech: row.requested_tech,
        requested_country: row.requested_country,
        city: row.city,
        provider_id: row.provider_id,
        price_monthly: price,
        currency: row.currency || 'USD',
        bandwidth_mbps: parseInt(row.bandwidth_mbps) || 100,
        lat,
        lng,
      });
    }
    return rows;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);
    setUploadStatus('idle');
    setUploadResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length === 0) throw new Error('No valid rows found');
      const result = await dataClient.insertNodeBulk(rows);
      setUploadResult(result);
      setUploadStatus(result.failed > 0 && result.success === 0 ? 'error' : 'success');
      const s = await dataClient.getAdminStats();
      setStats(s);
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "requested_tech,requested_country,city,provider_id,price_monthly,currency,bandwidth_mbps,lat,lng\n";
    const sampleData = "DIA,Spain,Madrid,Lumen,1200,EUR,100,40.4168,-3.7038\nMPLS,USA,New York,Zayo,2500,USD,1000,40.7128,-74.0060\nBroadband,UK,London,BT,150,GBP,500,51.5074,-0.1278";

    const blob = new Blob([headers + sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'earthconnect_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const navCards = [
    {
      label: 'Carriers',
      description: 'Manage providers, coverage, and verification',
      icon: Truck,
      href: '/en/admin/carriers',
      count: stats.total_carriers,
    },
    {
      label: 'Pending Requests',
      description: 'Assign buyer requests to carriers',
      icon: FileText,
      href: '/en/admin/requests',
      count: stats.pending_requests,
    },
    {
      label: 'Quotes',
      description: 'Review all carrier submissions',
      icon: Shield,
      href: '/en/admin/quotes',
      count: stats.provider_bids,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage infrastructure datasets, carriers, requests, and pricing intelligence.
          </p>
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {navCards.map((card) => (
            <Link
              key={card.label}
              to={card.href}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-zinc-900 dark:text-white">{card.count}</span>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{card.label}</h3>
              <p className="text-xs text-zinc-500">{card.description}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Import Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
              <Upload className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <h2 className="text-xl font-bold mb-4">Import Nodes</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Upload your infrastructure nodes in bulk using a CSV file.
            </p>

            <label className="block">
              <span className="sr-only">Choose file</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-zinc-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-bold
                  file:bg-zinc-900 file:text-white
                  dark:file:bg-white dark:file:text-zinc-900
                  hover:file:opacity-80 transition-all cursor-pointer
                  disabled:opacity-50"
              />
            </label>

            {isUploading && (
              <div className="mt-6 flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing {fileName}...
              </div>
            )}

            {uploadStatus === 'success' && uploadResult && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm">
                <div className="flex items-center gap-3 font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  Nodes imported successfully!
                </div>
                <div className="text-xs text-zinc-500">
                  {uploadResult.success} rows inserted · {uploadResult.failed} failed
                </div>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-sm font-medium text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                Error importing nodes. Please check the CSV format and required columns.
              </div>
            )}
          </div>

          {/* Download Template Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
              <Download className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <h2 className="text-xl font-bold mb-4">Download Template</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Get the standard format template to ensure your infrastructure data is parsed correctly by the system.
            </p>

            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download CSV Template
            </button>

            <div className="mt-8 space-y-4">
              <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Required Columns</div>
              <div className="grid grid-cols-2 gap-2 text-2xs font-mono text-zinc-500">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-950 rounded">requested_tech</div>
                <div className="p-2 bg-zinc-50 dark:bg-zinc-950 rounded">requested_country</div>
                <div className="p-2 bg-zinc-50 dark:bg-zinc-950 rounded">city</div>
                <div className="p-2 bg-zinc-50 dark:bg-zinc-950 rounded">provider_id</div>
                <div className="p-2 bg-zinc-50 dark:bg-zinc-950 rounded">price_monthly</div>
                <div className="p-2 bg-zinc-50 dark:bg-zinc-950 rounded">lat / lng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {loadingStats ? (
            <div className="md:col-span-4 flex items-center justify-center py-8 text-sm text-zinc-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading stats...
            </div>
          ) : (
            <>
              <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
                <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Total Nodes</div>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.total_nodes.toLocaleString()}</div>
              </div>
              <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
                <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Cities Covered</div>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.cities_covered.toLocaleString()}</div>
              </div>
              <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
                <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Total Carriers</div>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.total_carriers.toLocaleString()}</div>
              </div>
              <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
                <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Pending Requests</div>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.pending_requests.toLocaleString()}</div>
              </div>
            </>
          )}
        </div>

        {/* Recent Leads */}
        <div className="mt-12 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-zinc-400" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Recent Leads</h2>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Name</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Email</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Service</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Location</th>
                  <th className="text-left py-3 px-4 text-2xs font-bold tracking-widest text-zinc-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-zinc-100 dark:border-zinc-900 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{lead.first_name} {lead.last_name}</td>
                    <td className="py-3 px-4 text-zinc-500 text-xs">{lead.corporate_email}</td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{lead.requested_service || '—'}</td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{lead.requested_city ? `${lead.requested_city}, ${lead.requested_country}` : '—'}</td>
                    <td className="py-3 px-4 text-zinc-500 text-xs">{lead.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-zinc-400">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
