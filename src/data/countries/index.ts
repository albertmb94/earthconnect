import type { CountryData } from './types';
import { europeCountries } from './europe';
import { americasCountries } from './americas';
import { asiaCountries } from './asia';
import { africaCountries } from './africa';
import { oceaniaCountries } from './oceania';
import { regions } from './regions';

export type { CountryData, ServiceAvailability, SEOContent, ServiceKey, Region, Subregion } from './types';
export { regions, getRegionByKey, getSubregionByKey } from './regions';
export { SERVICE_LABELS } from './types';

export const allCountries: CountryData[] = [
  ...europeCountries,
  ...americasCountries,
  ...asiaCountries,
  ...africaCountries,
  ...oceaniaCountries,
];

export function getCountryByCode(code: string): CountryData | undefined {
  return allCountries.find(c => c.code.toUpperCase() === code.toUpperCase());
}

export function getCountryBySlug(slug: string): CountryData | undefined {
  const lower = slug.toLowerCase();
  return allCountries.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === lower);
}

export function getCountriesByRegion(regionKey: string): CountryData[] {
  return allCountries.filter(c => c.region === regionKey);
}

export function getCountriesBySubregion(regionKey: string, subregionKey: string): CountryData[] {
  return allCountries.filter(c => c.region === regionKey && c.subregion === subregionKey);
}

export function getCountrySlug(country: CountryData): string {
  return country.name.toLowerCase().replace(/\s+/g, '-');
}
