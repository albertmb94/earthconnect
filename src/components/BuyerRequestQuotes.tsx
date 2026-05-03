import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, DollarSign, CheckCircle, Clock, Shield, Truck, StickyNote } from 'lucide-react';
import { dataClient, QuoteWithCarrier } from '../lib/dataClient';

interface BuyerRequestQuotesProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  requestService: string;
  requestLocation: string;
  onAcceptQuote: () => void;
}

export const BuyerRequestQuotes: React.FC<BuyerRequestQuotesProps> = ({
  isOpen,
  onClose,
  requestId,
  requestService,
  requestLocation,
  onAcceptQuote,
}) => {
  const [quotes, setQuotes] = useState<QuoteWithCarrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && requestId) {
      fetchQuotes();
    }
  }, [isOpen, requestId]);

  const fetchQuotes = async () => {
    if (!requestId) return;
    setLoading(true);
    const data = await dataClient.getQuotesForRequest(requestId);
    setQuotes(data);
    setLoading(false);
  };

  const handleAccept = async (quoteId: string) => {
    if (!requestId) return;
    setAccepting(quoteId);
    await dataClient.acceptQuoteAndProgressRequest(quoteId, requestId);
    setAccepting(null);
    onAcceptQuote();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Quotes Received</h3>
                  <p className="text-sm text-zinc-500">
                    {requestService} — {requestLocation}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loading ? (
                <div className="py-12 flex items-center justify-center gap-3 text-sm text-zinc-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading quotes...
                </div>
              ) : quotes.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-400">
                  No quotes received yet. Carriers have been invited and will respond shortly.
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div
                      key={quote.quote_id}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                              {quote.company_name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-2xs font-medium text-zinc-500">
                              {quote.contact_email}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="font-bold">
                                {quote.monthly_price ? `$${quote.monthly_price.toLocaleString()}/mo` : '—'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                              <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                              <span>
                                Setup: {quote.setup_fee ? `$${quote.setup_fee.toLocaleString()}` : '—'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                              <Shield className="w-3.5 h-3.5 text-sky-500" />
                              <span>{quote.sla_uptime || '—'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                              <Truck className="w-3.5 h-3.5 text-amber-500" />
                              <span>{quote.installation_weeks ? `${quote.installation_weeks} weeks` : '—'}</span>
                            </div>
                          </div>

                          {quote.notes && (
                            <div className="mt-3 flex items-start gap-2 text-xs text-zinc-500">
                              <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span>{quote.notes}</span>
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-1.5 text-2xs text-zinc-400">
                            <Clock className="w-3 h-3" />
                            Submitted {new Date(quote.submitted_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center gap-2">
                          <button
                            onClick={() => handleAccept(quote.quote_id)}
                            disabled={accepting === quote.quote_id}
                            className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                          >
                            {accepting === quote.quote_id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
