import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { PathOptions } from 'leaflet';
import { allCountries, getCountrySlug } from '../data/countries';

interface WorldMapProps {
  lang: string;
}

const GEOJSON_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

const WORLD_CENTER: [number, number] = [20, 0];
const WORLD_ZOOM = 2;

function getFeatureCode(feature: Feature<Geometry, any> | undefined): string {
  return feature?.properties?.['ISO3166-1-Alpha-2'] || feature?.properties?.ISO_A2 || '';
}

function getFeatureName(feature: Feature<Geometry, any> | undefined): string {
  return feature?.properties?.name || feature?.properties?.ADMIN || feature?.properties?.NAME || '';
}

export const WorldMap: React.FC<WorldMapProps> = ({ lang }) => {
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const coveredCodes = new Set(allCountries.map(c => c.code));

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

  const getCountryStyle = useCallback((feature: Feature<Geometry, any> | undefined): PathOptions => {
    const code = getFeatureCode(feature);
    const isCovered = coveredCodes.has(code);
    const isHovered = hoveredCountry === code;

    if (isHovered && isCovered) {
      return {
        fillColor: '#2563eb',
        weight: 2,
        opacity: 1,
        color: '#1d4ed8',
        fillOpacity: 0.7,
      };
    }

    if (isCovered) {
      return {
        fillColor: '#3b82f6',
        weight: 1,
        opacity: 1,
        color: '#93c5fd',
        fillOpacity: 0.4,
      };
    }

    return {
      fillColor: '#e2e8f0',
      weight: 0.5,
      opacity: 1,
      color: '#cbd5e1',
      fillOpacity: 0.3,
    };
  }, [hoveredCountry, coveredCodes]);

  const onEachFeature = useCallback((feature: Feature<Geometry, any>, layer: L.Layer) => {
    const code = getFeatureCode(feature);
    const name = getFeatureName(feature);
    const country = allCountries.find(c => c.code === code);
    const isCovered = coveredCodes.has(code);

    if (isCovered && country) {
      layer.bindTooltip(
        `<div style="text-align:center;padding:4px 8px;">
          <div style="font-size:20px;margin-bottom:4px;">${country.flag}</div>
          <div style="font-weight:600;font-size:13px;">${lang === 'es' ? country.nameEs : country.name}</div>
          <div style="font-size:11px;color:#64748b;">${country.services.filter(s => s.available).length}/6 services</div>
        </div>`,
        { sticky: true }
      );

      layer.on('mouseover', function(this: L.Layer) {
        setHoveredCountry(code);
        (this as any).setStyle({ fillOpacity: 0.7, weight: 2 });
      });
      layer.on('mouseout', function(this: L.Layer) {
        setHoveredCountry(null);
        (this as any).setStyle({ fillOpacity: 0.4, weight: 1 });
      });
      layer.on('click', () => {
        navigate(`/${lang || 'en'}/coverage/${getCountrySlug(country)}`);
      });
    } else {
      layer.bindTooltip(
        `<div style="padding:4px 8px;">
          <div style="font-weight:600;font-size:13px;">${name}</div>
          <div style="font-size:11px;color:#94a3b8;">No coverage data</div>
        </div>`,
        { sticky: true }
      );
    }
  }, [lang, navigate, coveredCodes]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <MapContainer
        center={WORLD_CENTER}
        zoom={WORLD_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        minZoom={2}
        maxZoom={6}
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {geoData && (
          <GeoJSON
            key={hoveredCountry || 'default'}
            data={geoData}
            style={getCountryStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 shadow-lg z-[1000]">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500 opacity-60" />
            <span className="text-zinc-600 dark:text-zinc-400">
              {lang === 'es' ? 'Con cobertura' : 'With coverage'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-zinc-300 dark:bg-zinc-600 opacity-40" />
            <span className="text-zinc-600 dark:text-zinc-400">
              {lang === 'es' ? 'Sin datos' : 'No data'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 shadow-lg z-[1000]">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-bold text-blue-600">{allCountries.length}</span> {lang === 'es' ? 'países con cobertura' : 'countries covered'}
        </div>
      </div>
    </div>
  );
};
