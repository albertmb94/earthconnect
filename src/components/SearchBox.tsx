import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { searchPhotonAddress, GeocodingResult } from '../lib/photon';
import { cn } from '../utils/cn';

interface SearchBoxProps {
  onSelectAddress: (result: GeocodingResult) => void;
  className?: string;
  initialValue?: string;
  autoFocus?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSelectAddress,
  className,
  initialValue = '',
  autoFocus = false
}) => {
  const { t } = useI18n();
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // 800ms debounce as requested
    debounceTimerRef.current = setTimeout(async () => {
      const photonResults = await searchPhotonAddress(value, 6);
      setResults(photonResults);
      setLoading(false);
    }, 800);
  };

  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.formattedAddress);
    setIsOpen(false);
    setResults([]);
    onSelectAddress(result);
  };

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto z-40", className)} ref={dropdownRef}>
      <div className="relative flex items-center bg-white/10 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl rounded-full shadow-lg transition-all duration-300 focus-within:shadow-2xl focus-within:border-zinc-400 dark:focus-within:border-zinc-700 focus-within:ring-4 focus-within:ring-zinc-100 dark:focus-within:ring-zinc-900 overflow-hidden">
        <div className="pl-6 text-zinc-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={t.placeholder}
          autoFocus={autoFocus}
          className="w-full py-4 px-4 bg-transparent outline-none text-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
        />
        <div className="pr-6 flex items-center">
          {loading && <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />}
        </div>
      </div>

      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-h-72 overflow-y-auto z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-900">
          {loading && results.length === 0 ? (
            <div className="p-4 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching addresses...
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full px-6 py-4 flex items-start gap-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group"
              >
                <div className="mt-1 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {item.name}
                  </div>
                  <div className="text-sm text-zinc-400 truncate mt-0.5">
                    {[item.city, item.state, item.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
