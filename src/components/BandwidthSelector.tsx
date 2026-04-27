import React from 'react';
import { Gauge } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface BandwidthSelectorProps {
  value: number; // in Mbps
  onChange: (mbps: number) => void;
}

// Common B2B bandwidth tiers (Mbps)
const TIERS = [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

export function formatBandwidth(mbps: number): string {
  if (mbps >= 1000) {
    const gbps = mbps / 1000;
    return `${gbps % 1 === 0 ? gbps : gbps.toFixed(1)} Gbps`;
  }
  return `${mbps} Mbps`;
}

export const BandwidthSelector: React.FC<BandwidthSelectorProps> = ({ value, onChange }) => {
  const { t } = useI18n();

  // Determine slider position from value (0 to TIERS.length - 1)
  const currentIndex = TIERS.indexOf(value);
  const sliderIndex = currentIndex === -1 
    ? TIERS.findIndex(t => t >= value) 
    : currentIndex;

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
            <Gauge className="w-5 h-5 text-sky-400" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm md:text-base">
              {t.bandwidthLabel}
            </h4>
            <p className="text-2xs text-zinc-500 dark:text-zinc-500 mt-0.5 leading-snug">
              {t.bandwidthHint}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl md:text-3xl font-extrabold text-sky-500 dark:text-sky-400 tabular-nums leading-none">
            {formatBandwidth(value)}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="px-1">
        <input
          type="range"
          min={0}
          max={TIERS.length - 1}
          step={1}
          value={sliderIndex >= 0 ? sliderIndex : 0}
          onChange={(e) => onChange(TIERS[parseInt(e.target.value, 10)])}
          className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-sky-500"
          style={{
            background: `linear-gradient(to right, rgb(14, 165, 233) 0%, rgb(14, 165, 233) ${(sliderIndex / (TIERS.length - 1)) * 100}%, rgb(228, 228, 231) ${(sliderIndex / (TIERS.length - 1)) * 100}%, rgb(228, 228, 231) 100%)`
          }}
        />

        {/* Tier marks */}
        <div className="flex justify-between mt-2 px-0.5">
          {TIERS.map((tier, i) => (
            <button
              key={tier}
              onClick={() => onChange(tier)}
              className={`text-[9px] md:text-2xs font-medium tabular-nums transition-colors cursor-pointer ${
                i === sliderIndex 
                  ? 'text-sky-500 dark:text-sky-400 font-bold' 
                  : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
              }`}
              title={formatBandwidth(tier)}
            >
              {tier >= 1000 ? `${tier / 1000}G` : `${tier}M`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
