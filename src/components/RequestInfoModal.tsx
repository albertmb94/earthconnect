import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { LeadCaptureForm } from './LeadCaptureForm';

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  serviceContext?: {
    city: string;
    country: string;
    bandwidth?: string;
    estimatedPrice?: string;
  };
  defaultEmail?: string | null;
}

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  isOpen,
  onClose,
  serviceName,
  serviceContext,
  defaultEmail
}) => {
  const { t } = useI18n();

  // Lock body scroll while open + Escape to close
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg my-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label={t.closeModal}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:scale-105 cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Service context banner */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-t-2xl px-5 py-4 -mb-2">
              <div className="text-2xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-1">
                {t.requestInfoFor}
              </div>
              <div className="text-white font-bold text-lg leading-tight">
                {serviceName}
              </div>
              {serviceContext && (
                <div className="mt-2 flex flex-wrap gap-2 text-2xs">
                  <span className="bg-white/5 border border-white/10 text-zinc-300 px-2 py-1 rounded-md">
                    📍 {serviceContext.city}, {serviceContext.country}
                  </span>
                  {serviceContext.bandwidth && (
                    <span className="bg-sky-500/10 border border-sky-500/20 text-sky-300 px-2 py-1 rounded-md font-medium">
                      ⚡ {serviceContext.bandwidth}
                    </span>
                  )}
                  {serviceContext.estimatedPrice && (
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md font-medium">
                      💰 {serviceContext.estimatedPrice}
                    </span>
                  )}
                </div>
              )}
            </div>

            <LeadCaptureForm
              defaultEmail={defaultEmail}
              hiddenServiceContext={{
                service: serviceName,
                ...serviceContext
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
