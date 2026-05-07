import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ChevronRight, MapPin, Wifi, ArrowRight } from 'lucide-react';
import { regions } from '../data/countries/regions';
import { allCountries, getCountriesByRegion, getCountrySlug } from '../data/countries';
import { useI18n } from '../lib/i18n';

export const CoverageOverview: React.FC = () => {
  const { lang } = useI18n();
  const [searchParams] = useSearchParams();
  const activeRegion = searchParams.get('region');

  useEffect(() => {
    const titleEN = 'Global Connectivity Coverage | Enterprise Internet by Country | EarthConnect';
    const titleES = 'Cobertura Global de Conectividad | Internet Empresarial por País | EarthConnect';
    const descEN = 'Explore enterprise connectivity coverage across 25+ countries. Compare DIA, MPLS, 5G, and satellite providers by region.';
    const descES = 'Explora la cobertura de conectividad empresarial en más de 25 países. Compara proveedores DIA, MPLS, 5G y satélite por región.';

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
  }, [lang]);

  const displayRegions = activeRegion
    ? regions.filter(r => r.key === activeRegion)
    : regions;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-4">
            <Globe className="w-3.5 h-3.5" />
            {allCountries.length}+ {lang === 'es' ? 'países cubiertos' : 'countries covered'}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
            {lang === 'es' ? 'Cobertura Global de Conectividad' : 'Global Connectivity Coverage'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            {lang === 'es'
              ? 'Explora la conectividad empresarial por país. Compara proveedores, precios y tecnologías de última milla en mercados clave.'
              : 'Explore enterprise connectivity by country. Compare providers, pricing, and last-mile technologies across key markets.'}
          </p>
        </motion.div>

        {/* Region filter */}
        {!activeRegion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {regions.map((region) => {
              const count = getCountriesByRegion(region.key).length;
              return (
                <Link
                  key={region.key}
                  to={`?region=${region.key}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {lang === 'es' ? region.nameEs : region.name}
                  <span className="text-xs text-zinc-400">({count})</span>
                </Link>
              );
            })}
          </motion.div>
        )}

        {activeRegion && (
          <div className="mb-8">
            <Link
              to={`/${lang || 'en'}/coverage`}
              className="text-sm text-blue-600 hover:underline"
            >
              ← {lang === 'es' ? 'Ver todas las regiones' : 'View all regions'}
            </Link>
          </div>
        )}

        {/* Regions */}
        <div className="space-y-12">
          {displayRegions.map((region, regionIdx) => {
            const regionCountries = getCountriesByRegion(region.key);
            return (
              <motion.section
                key={region.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + regionIdx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {lang === 'es' ? region.nameEs : region.name}
                  </h2>
                  <span className="text-sm text-zinc-500">
                    {regionCountries.length} {lang === 'es' ? 'países' : 'countries'}
                  </span>
                </div>

                {/* Subregions */}
                <div className="space-y-6">
                  {region.subregions.map((subregion) => {
                    const subregionCountries = regionCountries.filter(c => c.subregion === subregion.key);
                    if (subregionCountries.length === 0) return null;

                    return (
                      <div key={subregion.key}>
                        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                          {lang === 'es' ? subregion.nameEs : subregion.name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {subregionCountries.map((country) => {
                            const availableServices = country.services.filter(s => s.available).length;
                            return (
                              <Link
                                key={country.code}
                                to={`/${lang || 'en'}/coverage/${getCountrySlug(country)}`}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-3xl">{country.flag}</span>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                      {lang === 'es' ? country.nameEs : country.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                                        <Wifi className="w-3 h-3" />
                                        {availableServices}/6 {lang === 'es' ? 'servicios' : 'services'}
                                      </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                                      {country.seo.keyInsights[0]}
                                    </p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {lang === 'es' ? '¿No encuentras tu país?' : "Don't see your country?"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-xl mx-auto">
              {lang === 'es'
                ? 'Estamos expandiendo constantemente nuestra cobertura. Contáctanos para mercados personalizados.'
                : 'We\'re constantly expanding our coverage. Contact us for custom markets.'}
            </p>
            <Link
              to={`/${lang || 'en'}/company/contact-us`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              {lang === 'es' ? 'Contactar Ventas' : 'Contact Sales'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
