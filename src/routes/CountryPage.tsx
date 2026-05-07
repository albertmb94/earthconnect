import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X, Globe, Building2, Wifi, Shield, Zap, ExternalLink } from 'lucide-react';
import { getCountryBySlug, getCountrySlug, getCountriesBySubregion, regions } from '../data/countries';
import { SERVICE_LABELS } from '../data/countries/types';
import type { ServiceKey } from '../data/countries/types';
import { useI18n } from '../lib/i18n';

export const CountryPage: React.FC = () => {
  const { lang, country: countrySlug } = useParams<{ lang: string; country: string }>();
  const { t } = useI18n();
  const country = getCountryBySlug(countrySlug || '');

  useEffect(() => {
    if (!country) return;

    const titleEN = `${country.name} Internet & Connectivity | DIA, MPLS, 5G Providers | EarthConnect`;
    const titleES = `Internet y Conectividad en ${country.nameEs} | Proveedores DIA, MPLS, 5G | EarthConnect`;
    const descEN = `Enterprise connectivity in ${country.name}: DIA, Broadband, MPLS, Dark Fiber, 5G, Satellite. Compare providers, pricing, and coverage.`;
    const descES = `Conectividad empresarial en ${country.nameEs}: DIA, Banda Ancha, MPLS, Fibra Oscura, 5G, Satélite. Compara proveedores, precios y cobertura.`;

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

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    ['en', 'es'].forEach(l => {
      let hreflang = document.querySelector(`link[hreflang="${l}"]`) as HTMLLinkElement | null;
      if (!hreflang) {
        hreflang = document.createElement('link');
        hreflang.rel = 'alternate';
        hreflang.hreflang = l;
        document.head.appendChild(hreflang);
      }
      hreflang.href = window.location.origin + window.location.pathname.replace(/^\/(en|es)/, `/${l}`);
    });

    let jsonLd = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Country',
      name: country.name,
      description: lang === 'es' ? descES : descEN,
      url: window.location.href,
    });
  }, [country, lang]);

  if (!country) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Country not found</h1>
          <Link to={`/${lang || 'en'}/coverage`} className="text-blue-600 hover:underline">
            ← Back to Coverage
          </Link>
        </div>
      </div>
    );
  }

  const region = regions.find(r => r.key === country.region);
  const subregion = region?.subregions.find(s => s.key === country.subregion);
  const relatedCountries = getCountriesBySubregion(country.region, country.subregion)
    .filter(c => c.code !== country.code)
    .slice(0, 4);

  const name = lang === 'es' ? country.nameEs : country.name;
  const regionName = lang === 'es' ? region?.nameEs : region?.name;
  const subregionName = lang === 'es' ? subregion?.nameEs : subregion?.name;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8"
        >
          <Link to={`/${lang || 'en'}/coverage`} className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            {lang === 'es' ? 'Cobertura' : 'Coverage'}
          </Link>
          <span>/</span>
          <Link
            to={`/${lang || 'en'}/coverage?region=${country.region}`}
            className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            {regionName}
          </Link>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-200">{subregionName}</span>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">{name}</span>
        </motion.nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {lang === 'es' ? 'Conectividad Empresarial en' : 'Enterprise Connectivity in'} {name}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                {regionName} / {subregionName}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Service Boxes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            {lang === 'es' ? 'Servicios Disponibles' : 'Available Services'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {country.services.map((svc) => {
              const label = SERVICE_LABELS[svc.key];
              return (
                <div
                  key={svc.key}
                  className={`relative bg-white dark:bg-zinc-900 border rounded-xl p-5 transition-all ${
                    svc.available
                      ? 'border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md'
                      : 'border-zinc-100 dark:border-zinc-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{label.icon}</span>
                    {svc.available ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        {lang === 'es' ? 'Disponible' : 'Available'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        <X className="w-3 h-3" />
                        {lang === 'es' ? 'No disponible' : 'Unavailable'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {lang === 'es' ? label.es : label.en}
                  </h3>
                  {svc.note && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{svc.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Market Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            {lang === 'es' ? `Mercado de Internet en ${name}` : `Internet Market in ${name}`}
          </h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 md:p-8">
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {country.seo.marketOverview}
            </p>
          </div>
        </motion.section>

        {/* Competitors + Last Mile + Bandwidth + Regulatory */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Competitors */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {lang === 'es' ? 'Principales Competidores' : 'Key Competitors'}
                </h3>
              </div>
              <ul className="space-y-2">
                {country.seo.competitors.map((comp, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {comp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Last Mile Technologies */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wifi className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {lang === 'es' ? 'Tecnologías de Última Milla' : 'Last Mile Technologies'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {country.seo.lastMileTechnologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Average Bandwidth */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {lang === 'es' ? 'Ancho de Banda Promedio' : 'Average Bandwidth'}
                </h3>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">{country.seo.averageBandwidth}</p>
            </div>

            {/* Regulatory Notes */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {lang === 'es' ? 'Notas Regulatorias' : 'Regulatory Notes'}
                </h3>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm">{country.seo.regulatoryNotes}</p>
            </div>
          </div>
        </motion.section>

        {/* Key Insights */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            {lang === 'es' ? 'Insights Clave' : 'Key Insights'}
          </h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 md:p-8">
            <ul className="space-y-4">
              {country.seo.keyInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-700 dark:text-zinc-300">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {lang === 'es'
                ? `¿Necesitas conectividad empresarial en ${name}?`
                : `Need enterprise connectivity in ${name}?`}
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              {lang === 'es'
                ? 'Compara proveedores, obtén precios y configura tu red con inteligencia de mercado.'
                : 'Compare providers, get pricing, and configure your network with market intelligence.'}
            </p>
            <Link
              to={`/${lang || 'en'}/solutions`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
            >
              {lang === 'es' ? 'Solicitar una Cotización' : 'Request a Quote'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.section>

        {/* Related Countries */}
        {relatedCountries.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              {lang === 'es' ? 'Países Relacionados' : 'Related Countries'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedCountries.map((rc) => (
                <Link
                  key={rc.code}
                  to={`/${lang || 'en'}/coverage/${getCountrySlug(rc)}`}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
                >
                  <span className="text-3xl mb-2 block">{rc.flag}</span>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {lang === 'es' ? rc.nameEs : rc.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {rc.services.filter(s => s.available).length} {lang === 'es' ? 'servicios' : 'services'}
                  </p>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};
