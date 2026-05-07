import type { Region } from './types';

export const regions: Region[] = [
  {
    key: 'africa',
    name: 'Africa',
    nameEs: 'África',
    subregions: [
      { key: 'eastern-africa', name: 'Eastern Africa', nameEs: 'África Oriental' },
      { key: 'middle-africa', name: 'Middle Africa', nameEs: 'África Central' },
      { key: 'northern-africa', name: 'Northern Africa', nameEs: 'África Septentrional' },
      { key: 'southern-africa', name: 'Southern Africa', nameEs: 'África Meridional' },
      { key: 'western-africa', name: 'Western Africa', nameEs: 'África Occidental' },
    ],
  },
  {
    key: 'americas',
    name: 'Americas',
    nameEs: 'Américas',
    subregions: [
      { key: 'caribbean', name: 'Caribbean', nameEs: 'Caribe' },
      { key: 'central-america', name: 'Central America', nameEs: 'América Central' },
      { key: 'northern-america', name: 'Northern America', nameEs: 'América del Norte' },
      { key: 'south-america', name: 'South America', nameEs: 'América del Sur' },
    ],
  },
  {
    key: 'asia',
    name: 'Asia',
    nameEs: 'Asia',
    subregions: [
      { key: 'central-asia', name: 'Central Asia', nameEs: 'Asia Central' },
      { key: 'eastern-asia', name: 'Eastern Asia', nameEs: 'Asia Oriental' },
      { key: 'south-eastern-asia', name: 'South-Eastern Asia', nameEs: 'Asia Sudoriental' },
      { key: 'southern-asia', name: 'Southern Asia', nameEs: 'Asia Meridional' },
      { key: 'western-asia', name: 'Western Asia', nameEs: 'Asia Occidental' },
    ],
  },
  {
    key: 'europe',
    name: 'Europe',
    nameEs: 'Europa',
    subregions: [
      { key: 'eastern-europe', name: 'Eastern Europe', nameEs: 'Europa Oriental' },
      { key: 'northern-europe', name: 'Northern Europe', nameEs: 'Europa Septentrional' },
      { key: 'southern-europe', name: 'Southern Europe', nameEs: 'Europa Meridional' },
      { key: 'western-europe', name: 'Western Europe', nameEs: 'Europa Occidental' },
    ],
  },
  {
    key: 'oceania',
    name: 'Oceania',
    nameEs: 'Oceanía',
    subregions: [
      { key: 'australia-nz', name: 'Australia and New Zealand', nameEs: 'Australia y Nueva Zelanda' },
      { key: 'melanesia', name: 'Melanesia', nameEs: 'Melanesia' },
      { key: 'micronesia', name: 'Micronesia', nameEs: 'Micronesia' },
      { key: 'polynesia', name: 'Polynesia', nameEs: 'Polinesia' },
    ],
  },
];

export function getRegionByKey(key: string): Region | undefined {
  return regions.find(r => r.key === key);
}

export function getSubregionByKey(regionKey: string, subregionKey: string) {
  const region = getRegionByKey(regionKey);
  return region?.subregions.find(s => s.key === subregionKey);
}
