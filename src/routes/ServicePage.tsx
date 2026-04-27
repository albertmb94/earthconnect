import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useQuota } from '../hooks/useQuota';
import { SearchBox } from '../components/SearchBox';
import { InsightsPanel } from '../components/InsightsPanel';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { SoftWall } from '../components/SoftWall';
import { RequestInfoModal } from '../components/RequestInfoModal';
import { searchPhotonAddress, GeocodingResult } from '../lib/photon';

interface LocationState {
  lat?: number;
  lng?: number;
  address?: string;
  rawCountry?: string;
  rawCity?: string;
}

export const ServicePage: React.FC = () => {
  const { lang, service, country, city } = useParams<{
    lang: string;
    service: string;
    country: string;
    city: string;
  }>();
  
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { incrementSearchCount, isBlocked, verifyCorporateEmail, resetQuota, verifiedEmail } = useQuota();

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [displayAddress, setDisplayAddress] = useState<string>('');
  const [loadingCoords, setLoadingCoords] = useState(false);
  
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Request Info Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<{
    service: string;
    bandwidth?: string;
    estimatedPrice?: string;
  } | null>(null);

  const handleRequestInfo = (ctx: { service: string; bandwidth: string; estimatedPrice?: string }) => {
    setModalContext(ctx);
    setModalOpen(true);
  };

  // Parse beautiful names from URL
  const niceCity = city ? city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
  const niceCountry = country ? country.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
  const niceService = service 
    ? service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Global Connectivity';

  // SEO-first: dynamically update document title, meta description, and canonical URL per country
  useEffect(() => {
    const titleEN = `${niceService || 'Connectivity'} in ${niceCity}, ${niceCountry} | Providers, Pricing & Coverage | EarthConnect`;
    const titleES = `${niceService || 'Conectividad'} en ${niceCity}, ${niceCountry} | Proveedores, Precios y Cobertura | EarthConnect`;
    const descEN = `Compare DIA, Broadband, MPLS, Dark Fiber, 5G and Satellite (LEO/MEO/GEO) connectivity providers in ${niceCity}, ${niceCountry}. Get B2B pricing ranges, SLA bandwidth, and coverage data instantly.`;
    const descES = `Compara proveedores de DIA, Banda Ancha, MPLS, Fibra Oscura, 5G y Satélite (LEO/MEO/GEO) en ${niceCity}, ${niceCountry}. Obtén rangos de precios B2B, SLA y datos de cobertura al instante.`;
    
    document.title = lang === 'es' ? titleES : titleEN;
    
    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    
    setMeta('description', lang === 'es' ? descES : descEN);
    setMeta('og:title', lang === 'es' ? titleES : titleEN, 'property');
    setMeta('og:description', lang === 'es' ? descES : descEN, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('keywords', `${niceService}, ${niceCity}, ${niceCountry}, DIA, MPLS, dark fiber, fiber optic, 5G, satellite LEO, Starlink business, OneWeb, B2B connectivity, enterprise internet`);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;
    
    // Hreflang for i18n SEO
    ['en', 'es'].forEach(l => {
      let hreflang = document.querySelector(`link[hreflang="${l}"]`) as HTMLLinkElement | null;
      if (!hreflang) {
        hreflang = document.createElement('link');
        hreflang.rel = 'alternate';
        hreflang.hreflang = l;
        document.head.appendChild(hreflang);
      }
      const path = window.location.pathname.replace(/^\/(en|es)/, `/${l}`);
      hreflang.href = window.location.origin + path;
    });
    
    // JSON-LD structured data for B2B SEO
    let jsonLd = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${niceService} in ${niceCity}`,
      description: lang === 'es' ? descES : descEN,
      areaServed: { '@type': 'City', name: niceCity, containedInPlace: { '@type': 'Country', name: niceCountry } },
      provider: { '@type': 'Organization', name: 'EarthConnect' }
    });
  }, [niceCity, niceCountry, niceService, lang]);

  useEffect(() => {
    const state = location.state as LocationState;
    
    if (state && state.lat && state.lng) {
      setCoords({ lat: state.lat, lng: state.lng });
      setDisplayAddress(state.address || `${niceCity}, ${niceCountry}`);
    } else if (city && country) {
      // Programmatic SEO: Fetch coordinates if missing (direct URL access)
      setLoadingCoords(true);
      const query = `${niceCity}, ${niceCountry}`;
      
      searchPhotonAddress(query, 1).then(results => {
        if (results && results.length > 0) {
          setCoords({ lat: results[0].lat, lng: results[0].lng });
          setDisplayAddress(results[0].formattedAddress);
        } else {
          // Fallback approximate coords
          setCoords({ lat: 40.0, lng: -3.0 }); // Default
          setDisplayAddress(`${niceCity}, ${niceCountry}`);
        }
        setLoadingCoords(false);
      });
    }
  }, [location.state, city, country, niceCity, niceCountry]);

  const handleSelectAddress = (result: GeocodingResult) => {
    const allowed = incrementSearchCount();
    if (!allowed) return;

    const newCountry = encodeURIComponent(result.country.toLowerCase().replace(/\s+/g, '-'));
    const newCity = encodeURIComponent(result.city.toLowerCase().replace(/\s+/g, '-'));
    const currentService = service || 'global-connectivity';
    const langPrefix = lang === 'es' ? '/es' : '/en';

    navigate(`${langPrefix}/${currentService}/${newCountry}/${newCity}`, {
      state: {
        lat: result.lat,
        lng: result.lng,
        address: result.formattedAddress,
        rawCountry: result.country,
        rawCity: result.city
      }
    });
  };

  // Dynamic FAQs for Programmatic SEO
  const faqs = [
    {
      q: lang === 'es' 
        ? `¿Qué proveedores de fibra oscura y DIA operan en ${niceCity}?`
        : `Which dark fiber and DIA providers operate in ${niceCity}?`,
      a: lang === 'es'
        ? `En ${niceCity} (${niceCountry}), los principales operadores de infraestructura mayorista incluyen a Colt Technology Services, Zayo Group, Cogent Communications y GTT. El mercado está altamente desarrollado, permitiendo el despliegue de redes Ethernet de ultra-baja latencia y circuitos DIA dedicados que conectan directamente con los puntos neutros regionales.`
        : `In ${niceCity} (${niceCountry}), the main wholesale infrastructure operators include Colt Technology Services, Zayo Group, Cogent Communications, and GTT. The market is highly developed, enabling the deployment of ultra-low latency Ethernet networks and dedicated DIA circuits connecting directly to regional internet exchange points.`
    },
    {
      q: lang === 'es'
        ? `¿Existe cobertura satelital de baja órbita (LEO) en esta región?`
        : `Is low-earth orbit (LEO) satellite coverage available in this region?`,
      a: lang === 'es'
        ? `Sí, ${niceCountry} cuenta con cobertura completa de la constelación Starlink Business (hasta 500 Mbps) y OneWeb (destinado a backhaul celular y redes gubernamentales). Estas tecnologías son ideales para sedes remotas, redundancia crítica (Failover BGP) o despliegues donde la fibra física es económicamente inviable.`
        : `Yes, ${niceCountry} features full coverage from the Starlink Business constellation (up to 500 Mbps) and OneWeb (targeted at cellular backhaul and government networks). These technologies are ideal for remote branches, critical redundancy (BGP Failover), or deployments where physical fiber is economically unviable.`
    },
    {
      q: lang === 'es'
        ? `¿Cuál es el tiempo promedio de provisión para un circuito DIA en ${niceCity}?`
        : `What is the average provisioning lead time for a DIA circuit in ${niceCity}?`,
      a: lang === 'es'
        ? `Para ubicaciones On-Net (edificios ya conectados a la red de fibra del operador), el tiempo de provisión en ${niceCity} oscila entre 15 y 30 días. Para ubicaciones Off-Net que requieran obra civil o construcción de fibra en la "última milla", el plazo puede extenderse de 45 a 90 días laborables, dependiendo de los permisos municipales.`
        : `For On-Net locations (buildings already connected to the operator's fiber network), provisioning time in ${niceCity} ranges between 15 and 30 days. For Off-Net locations requiring civil works or last-mile fiber construction, lead times can extend from 45 to 90 business days, depending on local municipal permits.`
    },
    {
      q: lang === 'es'
        ? `¿Cómo se garantiza el SLA en servicios empresariales de conectividad?`
        : `How is the SLA guaranteed in enterprise connectivity services?`,
      a: lang === 'es'
        ? `Todos los proveedores corporativos reflejados en EarthConnect ofrecen contratos SLA estandarizados. Para DIA y Fibra Oscura, la disponibilidad de red garantizada es del 99.99% o 99.999% (con doble acometida), MTTR (Tiempo Medio de Reparación) inferior a 4 horas, y latencias/jitter estrictamente garantizados hacia los principales hubs de nube (AWS, Azure, GCP).`
        : `All corporate providers displayed in EarthConnect offer standardized SLA contracts. For DIA and Dark Fiber, guaranteed network availability is 99.99% or 99.999% (with dual routing), MTTR (Mean Time To Repair) of less than 4 hours, and strictly guaranteed latency/jitter to major cloud hubs (AWS, Azure, GCP).`
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pt-16">
      {/* Gating blocker */}
      {isBlocked && (
        <SoftWall onVerify={verifyCorporateEmail} onReset={resetQuota} />
      )}

      {/* Hero Header with Animated Search Box */}
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 py-6 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(lang === 'es' ? '/es' : '/')}
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold flex items-center gap-1.5 leading-none">
                <MapPin className="w-4 h-4 text-zinc-400" />
                {niceCity}
                <span className="text-zinc-400 font-normal">, {niceCountry}</span>
              </h1>
              <p className="text-3xs text-zinc-400 font-mono mt-1 select-all truncate max-w-xs md:max-w-md">
                {displayAddress}
              </p>
            </div>
          </div>
          
          <motion.div 
            className="w-full md:w-[450px]"
            layoutId="search-box-container"
          >
            <SearchBox 
              onSelectAddress={handleSelectAddress} 
              initialValue={displayAddress}
            />
          </motion.div>
        </div>
      </div>

      {/* Split Screen Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Insights) */}
          <div className="lg:col-span-7 space-y-6">
            {loadingCoords ? (
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center min-h-64 flex-col gap-2">
                <div className="w-10 h-10 border-4 border-t-zinc-900 dark:border-t-zinc-100 border-zinc-200 dark:border-zinc-800 rounded-full animate-spin" />
                <p className="text-xs text-zinc-400 mt-2 font-mono">Resolving programmatic SEO coordinates...</p>
              </div>
            ) : coords ? (
              <InsightsPanel 
                lat={coords.lat} 
                lng={coords.lng} 
                country={niceCountry} 
                city={niceCity}
                onRequestInfo={handleRequestInfo}
              />
            ) : null}

            {/* FAQs Accordion Section (B2B SEO) */}
            <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-zinc-400" />
                {t.faqTitle}
              </h3>
              
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-5 py-4 text-left font-medium text-sm md:text-base flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer transition-colors"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                    </button>
                    
                    {openFaq === idx && (
                      <div className="px-5 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-900 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Lead Capture Sticky Form) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <LeadCaptureForm defaultEmail={verifiedEmail} />
          </div>

        </div>
      </div>

      {/* Service-specific Request Info Modal */}
      <RequestInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={modalContext?.service || ''}
        serviceContext={{
          city: niceCity,
          country: niceCountry,
          bandwidth: modalContext?.bandwidth,
          estimatedPrice: modalContext?.estimatedPrice
        }}
        defaultEmail={verifiedEmail}
      />
    </div>
  );
};
