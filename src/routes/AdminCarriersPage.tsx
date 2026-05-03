import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Loader2, X, Power, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataClient, Carrier, CarrierCoverage } from '../lib/dataClient';

const SERVICES = [
  'DIA', 'Broadband', 'MPLS', 'SD-WAN', 'Dark Fiber',
  '5G', 'LEO', 'MEO', 'GEO', 'Cloud', 'Managed Mobility', 'Managed Services',
];

const COUNTRIES = [
  'Spain', 'United States', 'United Kingdom', 'Germany', 'France',
  'Italy', 'Portugal', 'Netherlands', 'Belgium', 'Switzerland',
  'Ireland', 'Canada', 'Mexico', 'Brazil', 'Australia',
  'Japan', 'Singapore', 'United Arab Emirates', 'South Africa', 'India',
];

export const AdminCarriersPage: React.FC = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [coverageMap, setCoverageMap] = useState<Record<string, CarrierCoverage[]>>({});

  // Add form state
  const [addForm, setAddForm] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    tier: 'standard' as const,
  });

  // Coverage form state (for editing carrier)
  const [coverageForm, setCoverageForm] = useState({ country: '', service: '' });

  useEffect(() => {
    fetchCarriers();
  }, []);

  const fetchCarriers = async () => {
    setLoading(true);
    const data = await dataClient.getCarriers();
    setCarriers(data);
    // Load coverage for each
    const cov: Record<string, CarrierCoverage[]> = {};
    for (const c of data) {
      cov[c.id] = await dataClient.getCarrierCoverage(c.id);
    }
    setCoverageMap(cov);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!addForm.company_name || !addForm.contact_email) return;
    const result = await dataClient.createCarrier({
      company_name: addForm.company_name,
      contact_email: addForm.contact_email,
      contact_phone: addForm.contact_phone || null,
      tier: addForm.tier,
      verified: false,
      active: true,
    });
    if (result.data) {
      setShowAddModal(false);
      setAddForm({ company_name: '', contact_email: '', contact_phone: '', tier: 'standard' });
      fetchCarriers();
    }
  };

  const toggleActive = async (carrier: Carrier) => {
    await dataClient.updateCarrier(carrier.id, { active: !carrier.active });
    fetchCarriers();
  };

  const addCoverage = async (carrierId: string) => {
    if (!coverageForm.country || !coverageForm.service) return;
    await dataClient.addCarrierCoverage({
      carrier_id: carrierId,
      country: coverageForm.country,
      region: null,
      service: coverageForm.service,
      active: true,
    });
    setCoverageForm({ country: '', service: '' });
    // Refresh coverage for this carrier
    const updated = await dataClient.getCarrierCoverage(carrierId);
    setCoverageMap(prev => ({ ...prev, [carrierId]: updated }));
  };

  const removeCoverage = async (carrierId: string, coverageId: string) => {
    await dataClient.removeCarrierCoverage(coverageId);
    const updated = await dataClient.getCarrierCoverage(carrierId);
    setCoverageMap(prev => ({ ...prev, [carrierId]: updated }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 pb-24 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/en/admin" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Carrier Management</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage carriers, coverage areas, and verification status.</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-zinc-500">{carriers.length} carriers registered</div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Carrier
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading carriers...
          </div>
        ) : (
          <div className="space-y-4">
            {carriers.map((carrier) => (
              <motion.div
                key={carrier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{carrier.company_name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ${
                        carrier.tier === 'premium' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        carrier.tier === 'standard' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' :
                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      }`}>
                        {carrier.tier}
                      </span>
                      {carrier.verified && (
                        <span className="px-2 py-0.5 rounded-full text-2xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Verified
                        </span>
                      )}
                      {!carrier.active && (
                        <span className="px-2 py-0.5 rounded-full text-2xs font-medium bg-red-500/10 text-red-600 dark:text-red-400">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-zinc-500 mb-3">{carrier.contact_email} {carrier.contact_phone && `· ${carrier.contact_phone}`}</div>

                    {/* Coverage Chips */}
                    <div className="flex flex-wrap gap-2">
                      {(coverageMap[carrier.id] || []).map((cov) => (
                        <span
                          key={cov.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400"
                        >
                          <Globe className="w-3 h-3" />
                          {cov.country} — {cov.service}
                          <button
                            onClick={() => removeCoverage(carrier.id, cov.id)}
                            className="ml-1 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {/* Add coverage inline */}
                      <div className="inline-flex items-center gap-1">
                        <select
                          value={coverageForm.country}
                          onChange={e => setCoverageForm({ ...coverageForm, country: e.target.value })}
                          className="text-xs px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent"
                        >
                          <option value="">Country</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                          value={coverageForm.service}
                          onChange={e => setCoverageForm({ ...coverageForm, service: e.target.value })}
                          className="text-xs px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent"
                        >
                          <option value="">Service</option>
                          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                          onClick={() => addCoverage(carrier.id)}
                          disabled={!coverageForm.country || !coverageForm.service}
                          className="p-1 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(carrier)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        carrier.active
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                      title={carrier.active ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {carriers.length === 0 && (
              <div className="text-center py-12 text-sm text-zinc-400">
                No carriers found. Add your first carrier to get started.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Carrier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">Add New Carrier</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Company Name</label>
                <input
                  type="text"
                  value={addForm.company_name}
                  onChange={e => setAddForm({ ...addForm, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                  placeholder="e.g. Lumen Technologies"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={addForm.contact_email}
                  onChange={e => setAddForm({ ...addForm, contact_email: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                  placeholder="e.g. quotes@lumen.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={addForm.contact_phone}
                  onChange={e => setAddForm({ ...addForm, contact_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Tier</label>
                <select
                  value={addForm.tier}
                  onChange={e => setAddForm({ ...addForm, tier: e.target.value as any })}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
                >
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                  <option value="basic">Basic</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all cursor-pointer"
                >
                  Create Carrier
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
