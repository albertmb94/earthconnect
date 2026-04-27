import { useState, useEffect } from 'react';

const MAX_ANON_SEARCHES = 3;
const MAX_VERIFIED_SEARCHES = 50;
const COOKIE_NAME = 'ec_anon_token';
const STORAGE_COUNT_KEY = 'ec_searches_count';
const STORAGE_VERIFIED_KEY = 'ec_user_verified';

// Helper to check if email is corporate
export function isCorporateEmail(email: string): boolean {
  const freeDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 
    'icloud.com', 'aol.com', 'mail.com', 'protonmail.com', 'yandex.com', 
    'zoho.com', 'gmx.com', 'msn.com', 'comcast.net'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return !freeDomains.includes(domain);
}

// Simple cookie helper
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name: string, value: string, days = 365) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
}

export function useQuota() {
  const [anonSearches, setAnonSearches] = useState<number>(0);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [verifiedSearches, setVerifiedSearches] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize quota from cookies and localStorage
  useEffect(() => {
    // 1. Initialize anonymous token cookie if missing
    let anonToken = getCookie(COOKIE_NAME);
    if (!anonToken) {
      anonToken = 'anon_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      setCookie(COOKIE_NAME, anonToken, 365);
    }

    // 2. Get search count
    const countStr = localStorage.getItem(STORAGE_COUNT_KEY);
    const count = countStr ? parseInt(countStr, 10) : 0;
    setAnonSearches(count);

    // 3. Get verification status
    const verifiedData = localStorage.getItem(STORAGE_VERIFIED_KEY);
    if (verifiedData) {
      const parsed = JSON.parse(verifiedData);
      if (parsed && parsed.email && parsed.unlockedAt) {
        setIsVerified(true);
        setVerifiedEmail(parsed.email);
        setVerifiedSearches(parsed.count || 0);
      }
    }

    setLoading(false);
  }, []);

  const incrementSearchCount = () => {
    if (isVerified) {
      const newCount = verifiedSearches + 1;
      setVerifiedSearches(newCount);
      const verifiedData = localStorage.getItem(STORAGE_VERIFIED_KEY);
      if (verifiedData) {
        const parsed = JSON.parse(verifiedData);
        localStorage.setItem(STORAGE_VERIFIED_KEY, JSON.stringify({
          ...parsed,
          count: newCount
        }));
      }
      return true;
    } else {
      const newCount = anonSearches + 1;
      setAnonSearches(newCount);
      localStorage.setItem(STORAGE_COUNT_KEY, newCount.toString());
      
      // Update cookie with latest search count for server visibility
      setCookie('ec_anon_count', newCount.toString(), 30);
      
      return newCount <= MAX_ANON_SEARCHES;
    }
  };

  const verifyCorporateEmail = (email: string) => {
    if (!isCorporateEmail(email)) return false;

    setIsVerified(true);
    setVerifiedEmail(email);
    setVerifiedSearches(0);

    localStorage.setItem(STORAGE_VERIFIED_KEY, JSON.stringify({
      email,
      unlockedAt: new Date().toISOString(),
      count: 0
    }));

    // Reset cookie/storage for anon, move to verified
    setCookie('ec_is_verified', 'true', 365);
    setCookie('ec_verified_email', btoa(email), 365); // simple obfuscation
    
    return true;
  };

  const resetQuota = () => {
    localStorage.removeItem(STORAGE_COUNT_KEY);
    localStorage.removeItem(STORAGE_VERIFIED_KEY);
    setCookie('ec_anon_count', '0', -1);
    setCookie('ec_is_verified', 'false', -1);
    setCookie('ec_verified_email', '', -1);
    setAnonSearches(0);
    setIsVerified(false);
    setVerifiedEmail(null);
    setVerifiedSearches(0);
  };

  const isBlocked = !loading && !isVerified && anonSearches >= MAX_ANON_SEARCHES;
  const quotaExceeded = isVerified && verifiedSearches >= MAX_VERIFIED_SEARCHES;

  return {
    anonSearches,
    isVerified,
    verifiedEmail,
    verifiedSearches,
    loading,
    isBlocked: isBlocked || quotaExceeded,
    maxAnon: MAX_ANON_SEARCHES,
    maxVerified: MAX_VERIFIED_SEARCHES,
    incrementSearchCount,
    verifyCorporateEmail,
    resetQuota
  };
}
