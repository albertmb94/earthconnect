import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, Loader2, CheckCircle, RefreshCcw } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { isCorporateEmail } from '../hooks/useQuota';
import { sendMagicLink } from '../lib/supabaseClient';

interface SoftWallProps {
  onVerify: (email: string) => boolean;
  onReset?: () => void;
}

export const SoftWall: React.FC<SoftWallProps> = ({ onVerify, onReset }) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const schema = z.object({
    email: z
      .string()
      .email(t.errorRequired)
      .refine(isCorporateEmail, {
        message: t.errorCorpEmail,
      }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // Supabase Auth Magic Link when configured; mock success otherwise.
    await sendMagicLink(data.email);
    await new Promise((resolve) => setTimeout(resolve, 900));
    
    const verified = onVerify(data.email);
    if (verified) {
      setSuccess(true);
      // Give a moment for the user to see success before updating UI or allow a click
      setTimeout(() => {
        // Just let success render and the user can click or auto-reload
        window.location.reload();
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-zinc-700/20 rounded-full blur-3xl -z-10" />

        {!success ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
                <Lock className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-3">
              {t.gateTitle}
            </h2>
            
            <p className="text-zinc-400 text-center mb-8 max-w-md mx-auto text-sm md:text-base leading-relaxed">
              {t.gateSubtitle}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="gate-email" className="block text-sm font-medium text-zinc-300 mb-2">
                  {t.corpEmail}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="gate-email"
                    type="email"
                    {...register('email')}
                    placeholder={t.gateEmailPlaceholder}
                    disabled={loading}
                    className="block w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl outline-none text-white placeholder-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/10 transition-all disabled:opacity-50"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 leading-normal">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : (
                  t.gateBtn
                )}
              </button>

              {onReset && (
                <div className="text-center mt-4 pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    Reset Counter (Dev Tool)
                  </button>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-400">
                <CheckCircle className="w-10 h-10" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Email Verified
            </h2>
            
            <p className="text-green-400 font-medium mb-6">
              {t.gateSuccess}
            </p>

            <div className="text-sm text-zinc-400 animate-pulse mt-12">
              Reloading your enterprise workspace...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
