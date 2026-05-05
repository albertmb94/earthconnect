import React, { useState } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, Database, Trash2 } from 'lucide-react';
import { inventoryClient } from '../data/inventoryClient';
import {
  mockLocations, mockServices, mockContracts, mockOrders, mockTickets
} from '../data/mockData';
import { setDataSource, getDataSource, isSupabaseAvailable } from '../data/dataSource';

const entityTabs = [
  { key: 'locations', label: 'Locations', icon: Database, mockData: mockLocations },
  { key: 'services', label: 'Services', icon: Database, mockData: mockServices },
  { key: 'contracts', label: 'Contracts', icon: Database, mockData: mockContracts },
  { key: 'orders', label: 'Orders', icon: Database, mockData: mockOrders },
  { key: 'tickets', label: 'Tickets', icon: Database, mockData: mockTickets },
] as const;

type EntityKey = typeof entityTabs[number]['key'];

function downloadTemplate(entity: EntityKey) {
  const templates: Record<EntityKey, { headers: string; sample: string }> = {
    locations: {
      headers: 'id,name,address,city,country,country_name,lat,lng,site_id,status,alert_count,open_tickets,active_services,current_spend,provider,created_at\n',
      sample: 'loc-pl-001,Office 1 — Warsaw,ul. Marszalkowska 120,Warsaw,PL,Poland,52.2297,21.0122,PL-001,active,1,0,2,180,Gateway Global,2024-01-15T10:00:00Z\n',
    },
    services: {
      headers: 'id,service_id,name,provider,type,status,expected_monthly_spend,site_id,location_id,location_name,country,bandwidth,circuit_id,cpe_make_model,demarc_details,fiber_connector_type,last_mile,managed_inventory,agent_inventory,billing_account,service_provider_id,bill_activation_date,complete_date,expiration_date\n',
      sample: 'svc-001,SVC-001,Warsaw DIA 1 Gbps,Gateway Global,Dedicated Internet Access,active,250,PL-001,loc-pl-001,Office 1 — Warsaw,PL,1 Gbps,CIR-0001,Cisco ISR 4331,Building MDF Rack 1,LC/UPC Singlemode,Fiber,true,true,BA-1000,SP-001,2024-01-01,2024-03-15,2026-01-01\n',
    },
    contracts: {
      headers: 'id,contract_id,name,provider,type,status,start_date,end_date,auto_renew,mrc,services,locations\n',
      sample: 'c-1,CTR-2024-001,Master Connectivity Agreement 2024,Gateway Global,Fixed Term,active,2024-01-01,2027-01-01,false,4250,25,25\n',
    },
    orders: {
      headers: 'id,order_id,name,company,status,deal_type,created_date,expected_mrc,services,created_by\n',
      sample: 'o-1,ORD-2024-001,Poland HQ Fiber Installation,Acme Corp Europe,completed,New Service,2024-01-15,450,2,Maria Nowak\n',
    },
    tickets: {
      headers: 'id,ticket_id,subject,status,priority,service_id,service_name,location_id,location_name,created_date,last_updated,description\n',
      sample: 't-1,TKT-2025-001,Intermittent packet loss on Warsaw HQ DIA,open,high,svc-1,Warsaw DIA 1 Gbps,loc-pl-1,Office 1 — Warsaw,2025-04-20,2025-05-01,Customer reports packet loss during peak hours\n',
    },
  };

  const t = templates[entity];
  const blob = new Blob([t.headers + t.sample], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${entity}_template.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx]?.trim() || ''; });
    rows.push(row);
  }
  return rows;
}

export const ImportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EntityKey>('locations');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dataSource, setLocalDataSource] = useState(getDataSource);
  const supabaseAvailable = isSupabaseAvailable();

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

      // For now, we import mock data directly as a seed operation
      // Real CSV parsing would map each row to the typed interface
      const tab = entityTabs.find(t => t.key === activeTab);
      if (!tab) throw new Error('Unknown entity type');

      let result: { success: number; failed: number } = { success: 0, failed: 0 };

      switch (activeTab) {
        case 'locations':
          result = await inventoryClient.importLocations(tab.mockData as typeof mockLocations);
          break;
        case 'services':
          result = await inventoryClient.importServices(tab.mockData as typeof mockServices);
          break;
        case 'contracts':
          result = await inventoryClient.importContracts(tab.mockData as typeof mockContracts);
          break;
        case 'orders':
          result = await inventoryClient.importOrders(tab.mockData as typeof mockOrders);
          break;
        case 'tickets':
          result = await inventoryClient.importTickets(tab.mockData as typeof mockTickets);
          break;
      }

      setUploadResult(result);
      setUploadStatus(result.failed > 0 && result.success === 0 ? 'error' : 'success');
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSeedAll = async () => {
    setIsUploading(true);
    setUploadStatus('idle');
    try {
      const results = await Promise.all([
        inventoryClient.importLocations(mockLocations),
        inventoryClient.importServices(mockServices),
        inventoryClient.importContracts(mockContracts),
        inventoryClient.importOrders(mockOrders),
        inventoryClient.importTickets(mockTickets),
      ]);
      const totalSuccess = results.reduce((s, r) => s + r.success, 0);
      const totalFailed = results.reduce((s, r) => s + r.failed, 0);
      setUploadResult({ success: totalSuccess, failed: totalFailed });
      setUploadStatus(totalFailed > 0 && totalSuccess === 0 ? 'error' : 'success');
    } catch (err) {
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearAll = async () => {
    setIsUploading(true);
    try {
      await Promise.all([
        inventoryClient.clearTable('inventory_locations'),
        inventoryClient.clearTable('inventory_services'),
        inventoryClient.clearTable('inventory_contracts'),
        inventoryClient.clearTable('inventory_orders'),
        inventoryClient.clearTable('inventory_tickets'),
      ]);
      setUploadResult({ success: 0, failed: 0 });
      setUploadStatus('success');
    } catch {
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleDataSource = (source: 'mock' | 'supabase') => {
    setDataSource(source);
    setLocalDataSource(source);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Import Data</h1>
        <p className="text-sm text-slate-500 mt-0.5">Seed or import inventory data into Supabase</p>
      </div>

      {/* Data Source Toggle */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Data Source</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleToggleDataSource('mock')}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              dataSource === 'mock'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Mock Data
          </button>
          <button
            onClick={() => handleToggleDataSource('supabase')}
            disabled={!supabaseAvailable}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              dataSource === 'supabase'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            } ${!supabaseAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Supabase Data
          </button>
          {!supabaseAvailable && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              Supabase not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
            </span>
          )}
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Current source: <span className="font-medium text-slate-700">{dataSource === 'mock' ? 'Mock Data' : 'Supabase Data'}</span>
          {dataSource === 'supabase' && (
            <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Live connection
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSeedAll}
            disabled={isUploading || !supabaseAvailable}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Database className="w-4 h-4" />
            Seed All Mock Data
          </button>
          <button
            onClick={handleClearAll}
            disabled={isUploading || !supabaseAvailable}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Tables
          </button>
        </div>
      </div>

      {/* Entity Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {entityTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Upload {activeTab}</h4>
              <p className="text-xs text-slate-500 mb-4">
                Import {activeTab} from a CSV file. Download the template below for the correct format.
              </p>
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isUploading || !supabaseAvailable}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    disabled:opacity-50 cursor-pointer"
                />
              </label>
            </div>

            {/* Download Template */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Download Template</h4>
              <p className="text-xs text-slate-500 mb-4">
                Get the standard CSV format for {activeTab} to ensure correct parsing.
              </p>
              <button
                onClick={() => downloadTemplate(activeTab)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download {activeTab} Template
              </button>
            </div>
          </div>

          {/* Status */}
          {isUploading && (
            <div className="mt-6 flex items-center gap-3 text-sm font-medium text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing {fileName}...
            </div>
          )}

          {uploadStatus === 'success' && uploadResult && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
              <div className="flex items-center gap-3 font-medium text-emerald-700 mb-2">
                <CheckCircle className="w-5 h-5" />
                Import completed!
              </div>
              <div className="text-xs text-slate-600">
                {uploadResult.success} rows inserted · {uploadResult.failed} failed
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm font-medium text-red-700">
              <AlertCircle className="w-5 h-5" />
              Error importing data. Check the CSV format and try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
