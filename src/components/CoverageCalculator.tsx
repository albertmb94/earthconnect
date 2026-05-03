import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, MapPin, Zap, Globe, Loader2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface CoverageCalculatorProps {
  onCalculate?: (service: string, bandwidth: string) => void;
  prefillCity?: string;
}

const SERVICES = [
  { id: 'dia', label: 'DIA (Dedicated Internet)', icon: 'Zap' },
  { id: 'mpls', label: 'MPLS / Private WAN', icon: 'Globe' },
  { id: 'broadband', label: 'Broadband / FTTH', icon: 'MapPin' },
  { id: 'dark-fiber', label: 'Dark Fiber / EPL', icon: 'Zap' },
];

const BANDWIDTHS = ['50 Mbps', '100 Mbps', '200 Mbps', '500 Mbps', '1 Gbps', '10 Gbps'];

export const CoverageCalculator: React.FC<CoverageCalculatorProps> = ({ onCalculate }) => {
  const { lang } = useI18n();
  const [selectedService, setSelectedService] = useState('');
  const [selectedBandwidth, setSelectedBandwidth] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ min: string; max: string; currency: string } | null>(null);

  const handleCalculate = async () => {
    if (!selectedService || !selectedBandwidth) return;

    setLoading(true);

    // Simulate pricing calculation based on service and bandwidth
    await new Promise(resolve => setTimeout(resolve, 1200));

    const priceMap: Record<string, Record<string, { min: number; max: number }>> = {
      'dia': {
        '50 Mbps': { min: 300, max: 500 },
        '100 Mbps': { min: 450, max: 750 },
        '200 Mbps': { min: 700, max: 1100 },
        '500 Mbps': { min: 1200, max: 1800 },
        '1 Gbps': { min: 2000, max: 3500 },
        '10 Gbps': { min: 8000, max: 15000 },
      },
      'mpls': {
        '50 Mbps': { min: 500, max: 900 },
        '100 Mbps': { min: 800, max: 1400 },
        '200 Mbps': { min: 1200, max: 2000 },
        '500 Mbps': { min: 2500, max: 4000 },
        '1 Gbps': { min: 4500, max: 7000 },
        '10 Gbps': { min: 15000, max: 25000 },
      },
      'broadband': {
        '50 Mbps': { min: 80, max: 150 },
        '100 Mbps': { min: 120, max: 220 },
        '200 Mbps': { min: 200, max: 350 },
        '500 Mbps': { min: 400, max: 650 },
        '1 Gbps': { min: 700, max: 1200 },
        '10 Gbps': { min: 3000, max: 5500 },
      },
      'dark-fiber': {
        '1 Gbps': { min: 3000, max: 6000 },
        '10 Gbps': { min: 8000, max: 15000 },
      },
    };

    const pricing = priceMap[selectedService]?.[selectedBandwidth];
    if (pricing) {
      const currency = lang === 'es' ? '€' : '$';
      setResult({
        min: `${currency}${pricing.min}`,
        max: `${currency}${pricing.max}`,
        currency,
      });
    }

    setLoading(false);
    onCalculate?.(selectedService, selectedBandwidth);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'MapPin': return <MapPin className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
            {lang === 'es' ? 'Estimador de Precio' : 'Price Estimator'}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {lang === 'es' ? 'Obtén una estimación rápida sin registro' : 'Get a quick estimate without registration'}
          </p>
        </div>
      </div>

      {/* Service Selection */}
      <div className="space-y-3 mb-5">
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {lang === 'es' ? 'Tipo de Servicio' : 'Service Type'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(service.id);
                setResult(null);
              }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedService === service.id
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white'
                  : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              {getIcon(service.icon)}
              <span className="hidden sm:inline">{service.label}</span>
              <span className="sm:hidden">{service.id.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bandwidth Selection */}
      <div className="space-y-3 mb-6">
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {lang === 'es' ? 'Ancho de Banda' : 'Bandwidth'}
        </label>
        <div className="flex flex-wrap gap-2">
          {BANDWIDTHS.map((bw) => (
            <button
              key={bw}
              onClick={() => {
                setSelectedBandwidth(bw);
                setResult(null);
              }}
              disabled={selectedService === 'dark-fiber' && !bw.includes('Gbps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedBandwidth === bw
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              } ${
                selectedService === 'dark-fiber' && !bw.includes('Gbps')
                  ? 'opacity-30 cursor-not-allowed'
                  : ''
              }`}
            >
              {bw}
            </button>
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={!selectedService || !selectedBandwidth || loading}
        className="w-full py-3 px-4 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold rounded-xl text-sm transition-all shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {lang === 'es' ? 'Calculando...' : 'Calculating...'}
          </>
        ) : (
          <>
            <Calculator className="w-4 h-4" />
            {lang === 'es' ? 'Obtener Estimación' : 'Get Estimate'}
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
        >
          <div className="text-2xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-2">
            {lang === 'es' ? 'Rango de Precio Estimado' : 'Estimated Price Range'}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{result.min}</span>
            <span className="text-sm text-zinc-400 mx-1">—</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{result.max}</span>
            <span className="text-sm text-zinc-400 ml-1">/mo</span>
          </div>
          <p className="text-2xs text-zinc-500 dark:text-zinc-400 mt-2">
            {lang === 'es'
              ? 'Precio indicativo. Solicita una cotización formal para pricing exacto.'
              : 'Indicative pricing. Request a formal quote for exact pricing.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};