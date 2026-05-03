import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchBox } from '../components/SearchBox';
import { useI18n } from '../lib/i18n';
import { GeocodingResult } from '../lib/photon';
import { useQuota } from '../hooks/useQuota';
import { SoftWall } from '../components/SoftWall';
import { RequestInfoModal } from '../components/RequestInfoModal';
import { Shield, Network, Globe2, Cpu, MapPin } from 'lucide-react';

function detectCountryFromBrowser(): string | null {
  try {
    const locale = navigator.language || 'en-US';
    const region = locale.split('-')[1];
    if (!region) return null;
    const regionMap: Record<string, string> = {
      ES: 'Spain', US: 'United States', GB: 'United Kingdom', DE: 'Germany',
      FR: 'France', IT: 'Italy', PT: 'Portugal', NL: 'Netherlands',
      BE: 'Belgium', AT: 'Austria', CH: 'Switzerland', IE: 'Ireland',
      CA: 'Canada', AU: 'Australia', JP: 'Japan', SG: 'Singapore',
      MX: 'Mexico', BR: 'Brazil', AR: 'Argentina', CL: 'Chile',
      CO: 'Colombia', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
      FI: 'Finland', PL: 'Poland', CZ: 'Czech Republic', HU: 'Hungary',
      RO: 'Romania', GR: 'Greece', TR: 'Turkey', IN: 'India',
      ZA: 'South Africa', AE: 'United Arab Emirates', SA: 'Saudi Arabia',
    };
    return regionMap[region.toUpperCase()] || null;
  } catch {
    return null;
  }
}

export const Landing: React.FC = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { incrementSearchCount, isBlocked, verifyCorporateEmail, resetQuota } = useQuota();
  const detectedCountry = detectCountryFromBrowser();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);

  const handleSelectAddress = (result: GeocodingResult) => {
    // 1. Increment search count
    const allowed = incrementSearchCount();
    
    if (!allowed) {
      // Re-trigger re-render, quota hook will handle blocking
      return;
    }

    // 2. Format URL parameters
    const country = encodeURIComponent(result.country.toLowerCase().replace(/\s+/g, '-'));
    const city = encodeURIComponent(result.city.toLowerCase().replace(/\s+/g, '-'));
    const service = 'global-connectivity'; // default service
    const langPrefix = lang === 'es' ? '/es' : '/en';
    
    // Pass coordinates via state so we don't pollute the SEO URL
    navigate(`${langPrefix}/${service}/${country}/${city}`, { 
      state: { 
        lat: result.lat, 
        lng: result.lng,
        address: result.formattedAddress,
        rawCountry: result.country,
        rawCity: result.city
      } 
    });
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 overflow-hidden pt-16">
      {/* Gating blocker */}
      {isBlocked && (
        <SoftWall onVerify={verifyCorporateEmail} onReset={resetQuota} />
      )}

      {/* Decorative background grid and blurred blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-400/10 dark:bg-zinc-800/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-300/10 dark:bg-zinc-700/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        {/* Floating badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 mb-6 shadow-sm"
        >
          <Network className="w-3.5 h-3.5" />
          <span>B2B Platform as a Service</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-3xl leading-none md:leading-tight mb-4"
        >
          {t.title}
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed mb-4"
        >
          {t.subtitle}
        </motion.p>

        {/* Contextual country badge */}
        {detectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-3 h-3" />
              {detectedCountry} features full coverage across DIA, Broadband, MPLS, and Satellite
            </span>
          </motion.div>
        )}

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            {t.heroCtaPrimary}
          </button>
          <button
            onClick={() => setShowVendorModal(true)}
            className="px-8 py-3.5 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
          >
            {t.heroCtaSecondary}
          </button>
        </motion.div>

        {/* Trust Signals Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs font-semibold text-zinc-400 dark:text-zinc-600 mb-12"
        >
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500" />
            {t.trustGdpr}
          </span>
          <span>{t.trustRegions}</span>
          <span>{t.trustCarriers}</span>
          <span>{t.trustIntegrations}</span>
        </motion.div>

        {/* Search Box with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full relative"
          layoutId="search-box-container"
        >
          <SearchBox onSelectAddress={handleSelectAddress} autoFocus={true} />
        </motion.div>

        {/* Core Value Props */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-3xl text-left border-t border-zinc-200/50 dark:border-zinc-800/50 pt-12"
        >
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-200/50 dark:border-zinc-800">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">Global Coverage</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Check infrastructure in 190+ countries using localized nodes and satellite arrays.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-200/50 dark:border-zinc-800">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">SLA Verification</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Direct mapping of cross-border SLAs, multi-lingual support, and enterprise transit routes.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-200/50 dark:border-zinc-800">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">PostGIS Percentiles</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Real-time KNN spatial queries to calculate 10th and 60th pricing percentiles instantly.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Request Quote Modal */}
      <RequestInfoModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        serviceName={t.heroCtaPrimary}
      />

      {/* Join as Vendor Modal */}
      <RequestInfoModal
        isOpen={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        serviceName={t.heroCtaSecondary}
        serviceContext={{ city: 'Global', country: 'Worldwide' }}
      />
    </div>
  );
};
