import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Server, Radio, Globe, Shield, Wifi, Database, CheckCircle2, Satellite, SignalHigh, ArrowRight } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { supabaseClientMock, ServiceInsights, CoverageService } from '../lib/supabase';
import { BandwidthSelector, formatBandwidth } from './BandwidthSelector';
import { ServiceFilter, ServiceFilterItem } from './ServiceFilter';

interface InsightsPanelProps {
  lat: number;
  lng: number;
  country: string;
  city: string;
  onRequestInfo: (ctx: { service: string; bandwidth: string; estimatedPrice?: string }) => void;
}

const NODE_TECHS = [
  { key: 'DIA', label: 'Dedicated Internet Access', label_es: 'Acceso Dedicado a Internet', icon: Server, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { key: 'Broadband', label: 'Broadband / FTTX', label_es: 'Banda Ancha / FTTX', icon: Wifi, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'MPLS', label: 'MPLS', label_es: 'MPLS', icon: SignalHigh, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { key: 'Dark Fiber', label: 'Dark Fiber', label_es: 'Fibra Oscura', icon: Radio, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' }
] as const;

const COVERAGE_TECHS = [
  { key: '5G', label: '5G', label_es: '5G', icon: SignalHigh, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { key: 'LEO', label: 'Satellite LEO', label_es: 'Satélite LEO', icon: Satellite, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { key: 'MEO', label: 'Satellite MEO', label_es: 'Satélite MEO', icon: Satellite, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { key: 'GEO', label: 'Satellite GEO', label_es: 'Satélite GEO', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10' }
] as const;

// Reference bandwidth used by mock prices (Mbps). Real Supabase data would carry this column per row.
const REFERENCE_BANDWIDTH_MBPS = 100;

// Per-tech price scaling rules (price elasticity by bandwidth doubling)
// Real-world enterprise pricing scales sub-linearly with bandwidth.
// Returns a multiplier vs the REFERENCE_BANDWIDTH_MBPS baseline.
function getBandwidthMultiplier(tech: string, mbps: number): number {
  const ratio = mbps / REFERENCE_BANDWIDTH_MBPS;
  // Sub-linear scaling exponents per technology
  const exp: Record<string, number> = {
    'DIA': 0.65,
    'Broadband': 0.55,
    'MPLS': 0.70,
    'Dark Fiber': 0.40 // dark fiber has weak price/bandwidth correlation (it's the medium itself)
  };
  return Math.pow(ratio, exp[tech] ?? 0.6);
}

function getCurrencyForCountry(country: string): { code: string; symbol: string; rate: number; noDecimals?: boolean } {
  const c = country.toLowerCase();
  const eurozone = ['spain', 'france', 'germany', 'italy', 'portugal', 'netherlands', 'belgium', 'ireland', 'austria', 'finland', 'greece'];
  if (eurozone.some(e => c.includes(e))) return { code: 'EUR', symbol: '€', rate: 0.93 };
  if (c.includes('united kingdom') || c.includes('uk') || c.includes('england')) return { code: 'GBP', symbol: '£', rate: 0.79 };
  if (c.includes('japan')) return { code: 'JPY', symbol: '¥', rate: 152, noDecimals: true };
  return { code: 'USD', symbol: '$', rate: 1 };
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ lat, lng, country, city, onRequestInfo }) => {
  const { t, lang } = useI18n();
  const [loading, setLoading] = useState(true);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const [nodeInsights, setNodeInsights] = useState<Record<string, ServiceInsights>>({});
  const [coverageData, setCoverageData] = useState<Record<string, CoverageService[]>>({});

  // Bandwidth selector state (defaults to 100 Mbps)
  const [bandwidth, setBandwidth] = useState<number>(100);

  // Service visibility filter (default: all visible)
  const allKeys = useMemo(
    () => [...NODE_TECHS.map(t => t.key), ...COVERAGE_TECHS.map(t => t.key)],
    []
  );
  const [visibleServices, setVisibleServices] = useState<Set<string>>(new Set(allKeys));

  const filterItems: ServiceFilterItem[] = useMemo(() => [
    ...NODE_TECHS.map(tech => ({
      key: tech.key,
      label: lang === 'es' ? tech.label_es : tech.label,
      category: 'node' as const,
      color: tech.color
    })),
    ...COVERAGE_TECHS.map(svc => ({
      key: svc.key,
      label: lang === 'es' ? svc.label_es : svc.label,
      category: 'coverage' as const,
      color: svc.color
    }))
  ], [lang]);

  const currency = getCurrencyForCountry(country);

  useEffect(() => {
    setLoading(true);
    setLoadingTextIndex(0);
    setNodeInsights({});
    setCoverageData({});

    const textInterval = setInterval(() => {
      setLoadingTextIndex(prev => (prev + 1) % t.loadingTexts.length);
    }, 400);

    const fetchData = async () => {
      try {
        const start = Date.now();

        const nodePromises = NODE_TECHS.map(async (tech) => {
          const { data } = await supabaseClientMock.rpc('get_service_insights', {
            in_lat: lat, in_lng: lng, in_tech: tech.key
          });
          return { tech: tech.key, data: data?.[0] };
        });

        const coveragePromises = COVERAGE_TECHS.map(async (svc) => {
          const { data } = await supabaseClientMock.queryCoverage(country, svc.key);
          return { service: svc.key, data: data || [] };
        });

        const nodeResults = await Promise.all(nodePromises);
        const coverageResults = await Promise.all(coveragePromises);

        const nodeMap: Record<string, ServiceInsights> = {};
        nodeResults.forEach(r => { if (r.data) nodeMap[r.tech] = r.data; });

        const coverageMap: Record<string, CoverageService[]> = {};
        coverageResults.forEach(r => { coverageMap[r.service] = r.data; });

        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 1500 - elapsed);

        setTimeout(() => {
          setNodeInsights(nodeMap);
          setCoverageData(coverageMap);
          setLoading(false);
          clearInterval(textInterval);
        }, remaining);
      } catch (error) {
        console.error("Error fetching connectivity data:", error);
        setLoading(false);
        clearInterval(textInterval);
      }
    };

    fetchData();
    return () => clearInterval(textInterval);
  }, [lat, lng, country, city, t.loadingTexts.length]);

  const formatPrice = (usdPrice: number) => {
    const localized = usdPrice * currency.rate;
    const formatted = new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(Math.round(localized));
    return `${currency.symbol}${formatted}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {t.resultsTitle}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">— {city}, {country}</p>
        </div>
        
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center min-h-72 flex-col gap-6">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 border-4 border-zinc-300 dark:border-zinc-700 rounded-full animate-ping opacity-25" />
            <div className="w-12 h-12 border-4 border-t-zinc-900 dark:border-t-zinc-100 border-zinc-200 dark:border-zinc-800 rounded-full animate-spin" />
          </div>
          <p className="text-zinc-600 dark:text-zinc-300 font-medium text-center">
            {t.loadingTexts[loadingTextIndex]}
          </p>
          <div className="w-full space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse rounded-xl w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compute which sections should render based on filter
  const visibleNodeTechs = NODE_TECHS.filter(tech => visibleServices.has(tech.key));
  const visibleCoverageTechs = COVERAGE_TECHS.filter(svc => visibleServices.has(svc.key));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {t.resultsTitle}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          — {city}, {country}
        </p>
      </motion.div>

      {/* Controls: Bandwidth + Service Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="space-y-4"
      >
        <BandwidthSelector value={bandwidth} onChange={setBandwidth} />
        <ServiceFilter
          items={filterItems}
          selected={visibleServices}
          onChange={setVisibleServices}
        />
      </motion.div>

      {/* ====================================== */}
      {/* SECTION 1: NODE-BASED SERVICES         */}
      {/* ====================================== */}
      {visibleNodeTechs.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase whitespace-nowrap">
              {lang === 'es' ? 'Servicios Basados en Nodos' : 'Node-Based Services'}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
          </div>

          <div className="space-y-4">
            {visibleNodeTechs.map((tech, idx) => {
              const data = nodeInsights[tech.key];
              if (!data) return null;

              const Icon = tech.icon;
              const uniqueProviders = new Set((data.nodes_details || []).map(n => n.provider)).size;
              const techLabel = lang === 'es' ? tech.label_es : tech.label;

              // Apply bandwidth-based scaling
              const multiplier = getBandwidthMultiplier(tech.key, bandwidth);
              const scaledP10 = data.p10_price * multiplier;
              const scaledP60 = data.p60_price * multiplier;
              const priceRangeStr = `${formatPrice(scaledP10)} – ${formatPrice(scaledP60)}/${lang === 'es' ? 'mes' : 'mo'}`;

              return (
                <motion.button
                  key={tech.key}
                  onClick={() => onRequestInfo({
                    service: `${techLabel} @ ${formatBandwidth(bandwidth)}`,
                    bandwidth: formatBandwidth(bandwidth),
                    estimatedPrice: priceRangeStr
                  })}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="group w-full text-left bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all relative overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${tech.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${tech.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
                        {techLabel}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                        {uniqueProviders} {lang === 'es' ? 'proveedores cercanos' : 'providers found nearby'}
                        {' · '}
                        {data.nodes_found} {lang === 'es' ? 'nodos en el rango' : 'infrastructure nodes within range'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                  </div>

                  {/* Highlighted Price Range */}
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl px-4 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-[10px] font-bold tracking-[0.18em] text-zinc-500 dark:text-zinc-500 uppercase">
                        {lang === 'es' ? 'Rango de Precio Esperado' : 'Expected Price Range'}
                      </div>
                      <div className="text-[10px] font-bold tracking-wider text-sky-500 dark:text-sky-400 uppercase tabular-nums">
                        @ {formatBandwidth(bandwidth)}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-zinc-500 dark:text-zinc-400 text-base font-medium">
                        {lang === 'es' ? 'desde' : 'from'}
                      </span>
                      <span className="text-2xl font-extrabold text-emerald-500 dark:text-emerald-400 tabular-nums tracking-tight">
                        {formatPrice(scaledP10)}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 text-base font-medium">
                        {lang === 'es' ? 'hasta' : 'to'}
                      </span>
                      <span className="text-2xl font-extrabold text-amber-500 dark:text-amber-400 tabular-nums tracking-tight">
                        {formatPrice(scaledP60)}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                        /{lang === 'es' ? 'mes' : 'mo'}
                      </span>
                    </div>
                  </div>

                  {/* Hover hint */}
                  <div className="mt-3 text-2xs text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 font-medium transition-colors flex items-center gap-1">
                    {t.requestInfo} →
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {/* ====================================== */}
      {/* SECTION 2: COVERAGE-BASED SERVICES     */}
      {/* ====================================== */}
      {visibleCoverageTechs.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase whitespace-nowrap">
              {lang === 'es' ? 'Servicios Basados en Cobertura' : 'Coverage-Based Services'}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
          </div>

          <div className="space-y-4">
            {visibleCoverageTechs.map((svc, idx) => {
              const data = coverageData[svc.key] || [];
              const Icon = svc.icon;
              const hasCoverage = data.length > 0;
              const svcLabel = lang === 'es' ? svc.label_es : svc.label;

              const providers = data.map(d => d.provider_name).join(' / ') || (lang === 'es' ? 'No disponible' : 'Not available');
              const maxBandwidth = data[0]?.max_bandwidth || '—';
              const scopes = Array.from(new Set(data.map(d => d.provider_scope)));
              const scope = scopes.length > 1 ? 'Mixed' : (scopes[0] || '—');
              const allLanguages = Array.from(new Set(data.flatMap(d => d.languages_supported)));
              const languagesDisplay = allLanguages.length === 0 
                ? '—'
                : allLanguages.length > 3 
                  ? (lang === 'es' ? 'Multi-idioma' : 'Multi-language')
                  : allLanguages.join(', ');

              return (
                <motion.button
                  key={svc.key}
                  disabled={!hasCoverage}
                  onClick={() => hasCoverage && onRequestInfo({
                    service: `${svcLabel} (${providers})`,
                    bandwidth: maxBandwidth
                  })}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="group w-full text-left bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 enabled:hover:border-zinc-400 enabled:dark:hover:border-zinc-600 enabled:hover:shadow-lg enabled:hover:-translate-y-0.5 enabled:cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Header row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${svc.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${svc.color}`} />
                    </div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex-1">
                      {svcLabel}
                    </h4>
                    {hasCoverage ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" strokeWidth={2.2} />
                    ) : (
                      <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium uppercase tracking-wider">
                        N/A
                      </span>
                    )}
                  </div>

                  {/* Key/Value rows */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-zinc-500 dark:text-zinc-400">{t.provider}</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right truncate">
                        {providers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-zinc-500 dark:text-zinc-400">{t.bandwidth}</span>
                      <span className="font-bold text-sky-600 dark:text-sky-400 text-right">{maxBandwidth}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-zinc-500 dark:text-zinc-400">{t.scope}</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right">
                        {scope === 'Global' && '🌍 '}
                        {scope === 'Regional' && '🌐 '}
                        {scope === 'National' && '📍 '}
                        {scope}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-zinc-500 dark:text-zinc-400">{t.languages}</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right">{languagesDisplay}</span>
                    </div>
                  </div>

                  {hasCoverage && (
                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-2xs text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 font-medium transition-colors flex items-center gap-1">
                      {t.requestInfo} →
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {visibleNodeTechs.length === 0 && visibleCoverageTechs.length === 0 && (
        <div className="text-center py-12 text-sm text-zinc-400">
          {lang === 'es' 
            ? 'No hay servicios seleccionados. Elige al menos uno arriba.' 
            : 'No services selected. Pick at least one above.'}
        </div>
      )}

      {/* SEO Footer Hint */}
      <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/40">
        <p className="text-2xs text-zinc-400 dark:text-zinc-600 leading-relaxed">
          <Database className="w-3 h-3 inline-block mr-1 opacity-50" />
          {lang === 'es'
            ? `Precios calculados con percentil P10–P60 de PostGIS sobre los 10 nodos más cercanos en ${city}, ${country}. Escalado por ancho de banda solicitado (${formatBandwidth(bandwidth)}). Moneda local: ${currency.code}.`
            : `Prices calculated using PostGIS P10–P60 percentiles over the 10 closest nodes in ${city}, ${country}. Scaled by requested bandwidth (${formatBandwidth(bandwidth)}). Local currency: ${currency.code}.`}
          <Shield className="w-3 h-3 inline-block ml-2 mr-1 opacity-50" />
          {lang === 'es' ? 'Datos B2B verificados por SLA.' : 'B2B data verified by SLA.'}
        </p>
      </div>
    </div>
  );
};
