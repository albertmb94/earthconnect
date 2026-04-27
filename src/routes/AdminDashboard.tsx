import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, CheckCircle, AlertCircle, Loader2, FileSpreadsheet } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadStatus('idle');

      // Simulate parsing and database insertion
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('success');
      }, 2000);
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
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage infrastructure datasets, inventory, and pricing intelligence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Import Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
              <Upload className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <h2 className="text-xl font-bold mb-4">Import Nodes</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Upload your infrastructure nodes in bulk using a CSV or Excel-compatible file.
            </p>

            <label className="block">
              <span className="sr-only">Choose file</span>
              <input 
                type="file" 
                accept=".csv,.xlsx"
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

            {uploadStatus === 'success' && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                Nodes imported successfully!
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-sm font-medium text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                Error importing nodes. Please check the format.
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

        {/* Database Stats (Mock) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pb-24">
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
            <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Total Nodes</div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">1,248</div>
          </div>
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
            <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Cities Covered</div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">42</div>
          </div>
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
            <div className="text-2xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Provider Bids</div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">8,420</div>
          </div>
        </div>
      </div>
    </div>
  );
};
