import React, { createContext, useContext, useState, useCallback } from 'react';
import { Plus, Save, Send, Loader2, DollarSign, Trash2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { dataClient, Carrier } from '../lib/dataClient';
import { ProposalTier, type ProposalOptionInput } from '../lib/schemas';

// ================================================================
// CONTEXT INTERFACE
// ================================================================

interface ProposalBuilderState {
  title: string;
  options: ProposalOptionInput[];
}

interface ProposalBuilderActions {
  setTitle: (title: string) => void;
  addOption: (tier: ProposalTier) => void;
  updateOption: (index: number, patch: Partial<ProposalOptionInput>) => void;
  removeOption: (index: number) => void;
  saveDraft: () => Promise<void>;
  sendToBuyer: () => Promise<void>;
}

interface ProposalBuilderMeta {
  requestId: string;
  carriers: Carrier[];
}

interface ProposalBuilderContextValue {
  state: ProposalBuilderState;
  actions: ProposalBuilderActions;
  meta: ProposalBuilderMeta;
}

const Ctx = createContext<ProposalBuilderContextValue | null>(null);
function useBuilder() {
  const c = useContext(Ctx);
  if (!c) throw new Error('ProposalBuilder.* must be used within ProposalBuilder.Provider');
  return c;
}

// ================================================================
// TIER CONFIG
// ================================================================

const TIER_CONFIG: Record<ProposalTier, { label: string; color: string; border: string; description: string }> = {
  silver: { label: 'Silver', color: 'bg-zinc-500', border: 'border-zinc-400 dark:border-zinc-600', description: 'Essential connectivity at the best value' },
  gold:   { label: 'Gold',   color: 'bg-amber-500', border: 'border-amber-400 dark:border-amber-600', description: 'Balanced performance and reliability' },
  platinum: { label: 'Platinum', color: 'bg-purple-500', border: 'border-purple-400 dark:border-purple-600', description: 'Maximum SLA, lowest latency, premium carrier' },
};

// ================================================================
// COMPOUND COMPONENTS
// ================================================================

function Provider({
  requestId,
  carriers,
  children,
}: {
  requestId: string;
  carriers: Carrier[];
  children: React.ReactNode;
}) {
  const { t: _t } = useI18n();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<ProposalOptionInput[]>([]);
  const [, setSaving] = useState(false);
  const [, setSending] = useState(false);
  const [proposalId, setProposalId] = useState<string | null>(null);

  const addOption = useCallback((tier: ProposalTier) => {
    setOptions((prev) => [
      ...prev,
      {
        tier,
        carrier_id: '',
        monthly_price: 0,
        setup_fee: 0,
        sort_order: prev.length,
      },
    ]);
  }, []);

  const updateOption = useCallback((index: number, patch: Partial<ProposalOptionInput>) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  }, []);

  const removeOption = useCallback((index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const saveDraft = useCallback(async () => {
    setSaving(true);
    try {
      if (!proposalId) {
        // Create proposal first
        const auth = JSON.parse(localStorage.getItem('ec_admin_auth') || '{}');
        const agentEmail = auth.email || 'admin@earthconnect.com';
        const result = await dataClient.createProposal({
          buyer_request_id: requestId,
          agent_email: agentEmail,
          title: title || 'Connectivity Proposal',
        });
        if (result.data) {
          setProposalId(result.data.id);
          // Add options
          for (const opt of options) {
            await dataClient.addProposalOption({
              ...opt,
              proposal_id: result.data.id,
            });
          }
        }
      } else {
        // Delete old options and re-add
        await dataClient.removeAllProposalOptions(proposalId);
        for (const opt of options) {
          await dataClient.addProposalOption({
            ...opt,
            proposal_id: proposalId,
          });
        }
      }
    } catch (err) {
      console.error('Save draft failed:', err);
    } finally {
      setSaving(false);
    }
  }, [proposalId, requestId, title, options]);

  const sendToBuyer = useCallback(async () => {
    setSending(true);
    try {
      await saveDraft();
      if (proposalId) {
        await dataClient.sendProposal(proposalId);
      }
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setSending(false);
    }
  }, [saveDraft, proposalId]);

  return (
    <Ctx.Provider
      value={{
        state: { title, options },
        actions: { setTitle, addOption, updateOption, removeOption, saveDraft, sendToBuyer },
        meta: { requestId, carriers },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl">
      {children}
    </div>
  );
}

function Header() {
  const { state: { title }, actions: { setTitle } } = useBuilder();
  return (
    <div className="mb-6">
      <label className="block text-xs font-medium text-zinc-500 mb-1">Proposal Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
        placeholder="e.g., Madrid DIA Connectivity — 3 Options"
      />
    </div>
  );
}

function OptionCard({ index }: { index: number }) {
  const { state: { options }, actions: { updateOption, removeOption }, meta: { carriers } } = useBuilder();
  const opt = options[index];
  if (!opt) return null;

  const tier = opt.tier || 'silver';
  const config = TIER_CONFIG[tier];

  return (
    <div className={`border-2 rounded-xl p-4 mb-4 ${config.border} bg-zinc-50 dark:bg-zinc-800/30`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${config.color}`} />
          <select
            value={opt.tier}
            onChange={(e) => updateOption(index, { tier: e.target.value as ProposalTier })}
            className="text-sm font-bold bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
          <span className="text-xs text-zinc-400">— {config.description}</span>
        </div>
        <button
          onClick={() => removeOption(index)}
          className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-2xs font-medium text-zinc-500 mb-1">Carrier Partner</label>
          <select
            value={opt.carrier_id}
            onChange={(e) => updateOption(index, { carrier_id: e.target.value })}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
          >
            <option value="">Select carrier...</option>
            {carriers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name} ({c.commission_rate}% com)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-2xs font-medium text-zinc-500 mb-1">Monthly Price (USD)</label>
            <input
              type="number"
              value={opt.monthly_price || ''}
              onChange={(e) => updateOption(index, { monthly_price: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
              placeholder="2,400"
            />
          </div>
          <div>
            <label className="block text-2xs font-medium text-zinc-500 mb-1">Setup Fee (USD)</label>
            <input
              type="number"
              value={opt.setup_fee || ''}
              onChange={(e) => updateOption(index, { setup_fee: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
              placeholder="500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-2xs font-medium text-zinc-500 mb-1">SLA Uptime</label>
            <input
              type="text"
              value={opt.sla_uptime || ''}
              onChange={(e) => updateOption(index, { sla_uptime: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
              placeholder="99.99%"
            />
          </div>
          <div>
            <label className="block text-2xs font-medium text-zinc-500 mb-1">SLA Latency</label>
            <input
              type="text"
              value={opt.sla_latency || ''}
              onChange={(e) => updateOption(index, { sla_latency: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
              placeholder="<10ms"
            />
          </div>
          <div>
            <label className="block text-2xs font-medium text-zinc-500 mb-1">Install Weeks</label>
            <input
              type="number"
              value={opt.installation_weeks || ''}
              onChange={(e) => updateOption(index, { installation_weeks: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
              placeholder="4"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-2xs font-medium text-zinc-500 mb-1">Bandwidth</label>
            <input
              type="text"
              value={opt.bandwidth || ''}
              onChange={(e) => updateOption(index, { bandwidth: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
              placeholder="500 Mbps"
            />
          </div>
          <div>
            <label className="block text-2xs font-medium text-zinc-500 mb-1">Notes</label>
            <input
              type="text"
              value={opt.notes || ''}
              onChange={(e) => updateOption(index, { notes: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm bg-transparent"
              placeholder="Includes 24/7 support"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Actions() {
  const { state: { options }, actions: { addOption, saveDraft, sendToBuyer } } = useBuilder();
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  return (
    <div className="mt-4 space-y-3">
      <button
        onClick={() => addOption(options.length === 0 ? 'silver' : options.length === 1 ? 'gold' : 'platinum')}
        disabled={options.length >= 3}
        className="w-full py-2.5 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 font-bold rounded-xl text-sm hover:border-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all disabled:opacity-30 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Option (Silver / Gold / Platinum)
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={async () => { setSaving(true); await saveDraft(); setSaving(false); }}
          disabled={options.length === 0}
          className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Draft
        </button>
        <button
          onClick={async () => { setSending(true); await sendToBuyer(); setSending(false); }}
          disabled={options.length === 0}
          className="flex-1 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send to Buyer
        </button>
      </div>
    </div>
  );
}

function CommissionPreview() {
  const { state: { options }, meta: { carriers } } = useBuilder();
  if (options.length === 0) return null;

  const totals = options.reduce(
    (acc, opt) => {
      const carrier = carriers.find((c) => c.id === opt.carrier_id);
      if (!carrier) return acc;
      const commission = (opt.monthly_price * carrier.commission_rate) / 100;
      acc.monthly += commission;
      acc.annual += commission * 12;
      acc.items.push({ carrier: carrier.company_name, rate: carrier.commission_rate, monthly: opt.monthly_price, commission });
      return acc;
    },
    { monthly: 0, annual: 0, items: [] as { carrier: string; rate: number; monthly: number; commission: number }[] }
  );

  return (
    <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
      <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        Estimated Commission
      </h4>
      {totals.items.map((item, i) => (
        <div key={i} className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1">
          <span>{item.carrier} ({item.rate}%)</span>
          <span className="font-mono">
            ${item.commission.toFixed(0)}/mo · ${(item.commission * 12).toFixed(0)}/yr
          </span>
        </div>
      ))}
      <div className="border-t border-emerald-500/20 mt-2 pt-2 flex items-center justify-between text-sm font-bold text-emerald-700 dark:text-emerald-400">
        <span>Total</span>
        <span className="font-mono">
          ${totals.monthly.toFixed(0)}/mo · ${totals.annual.toFixed(0)}/yr
        </span>
      </div>
    </div>
  );
}

// ================================================================
// EXPORT AS NAMESPACE
// ================================================================

export const ProposalBuilder = {
  Provider,
  Frame,
  Header,
  OptionCard,
  Actions,
  CommissionPreview,
};
