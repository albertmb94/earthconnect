export type UserRole = 'buyer' | 'carrier' | 'admin';

export interface AuthData {
  role: UserRole;
  email: string;
  company?: string;
  name?: string;
}

const BUYER_AUTH_KEY = 'ec_buyer_auth';
const CARRIER_AUTH_KEY = 'ec_carrier_auth';
const ADMIN_AUTH_KEY = 'ec_admin_auth';

export function getBuyerAuth(): AuthData | null {
  const data = localStorage.getItem(BUYER_AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

export function setBuyerAuth(data: AuthData): void {
  localStorage.setItem(BUYER_AUTH_KEY, JSON.stringify(data));
}

export function getCarrierAuth(): AuthData | null {
  const data = localStorage.getItem(CARRIER_AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCarrierAuth(data: AuthData): void {
  localStorage.setItem(CARRIER_AUTH_KEY, JSON.stringify(data));
}

export function getAdminAuth(): AuthData | null {
  const data = localStorage.getItem(ADMIN_AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

export function setAdminAuth(data: AuthData): void {
  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(data));
}

export function logout(): void {
  localStorage.removeItem(BUYER_AUTH_KEY);
  localStorage.removeItem(CARRIER_AUTH_KEY);
  localStorage.removeItem(ADMIN_AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return !!(getBuyerAuth() || getCarrierAuth() || getAdminAuth());
}