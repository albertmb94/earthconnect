import { hasSupabaseConfig } from '@/lib/supabaseClient';

type DataSource = 'mock' | 'supabase';

const STORAGE_KEY = 'ec_inventory_data_source';

export function getDataSource(): DataSource {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'mock' || stored === 'supabase') return stored;
  return hasSupabaseConfig ? 'supabase' : 'mock';
}

export function setDataSource(source: DataSource): void {
  localStorage.setItem(STORAGE_KEY, source);
  window.dispatchEvent(new CustomEvent('ec-data-source-changed', { detail: source }));
}

export function isSupabaseAvailable(): boolean {
  return hasSupabaseConfig;
}

export function getDataSourceLabel(source: DataSource): string {
  return source === 'mock' ? 'Mock Data' : 'Supabase Data';
}
