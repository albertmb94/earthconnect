import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, User, Briefcase, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { isCorporateEmail } from '../hooks/useQuota';
import { insertLead } from '../lib/supabaseClient';

interface LeadCaptureFormProps {
  defaultEmail?: string | null;
  hiddenServiceContext?: {
    service?: string;
    city?: string;
    country?: string;
    bandwidth?: string;
    estimatedPrice?: string;
  };
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ defaultEmail, hiddenServiceContext }) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const schema = z.object({
    firstName: z.string().min(2, t.errorRequired),
    lastName: z.string().min(2, t.errorRequired),
    email: z
      .string()
      .email(t.errorRequired)
      .refine(isCorporateEmail, {
        message: t.errorCorpEmail,
      }),
    phone: z.string().min(6, t.errorRequired),
    role: z.string().min(2, t.errorRequired),
    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: t.errorRequired,
    }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: defaultEmail || '',
      privacyAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // Simulate Supabase/API insertion to a "leads" table
    const payload = { ...data, context: hiddenServiceContext };
    await insertLead(payload);
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log('Lead captured successfully:', payload);
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
            <CheckCircle className="w-10 h-10" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Request Received
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          {t.formSuccess}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl sticky top-6">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        {t.formTitle}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed mb-6">
        {t.formSubtitle}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              {t.firstName}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                {...register('firstName')}
                disabled={loading}
                className="block w-full pl-9 pr-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-2xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              {t.lastName}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                {...register('lastName')}
                disabled={loading}
                className="block w-full pl-9 pr-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-2xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
            {t.corpEmail}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              {...register('email')}
              disabled={loading}
              className="block w-full pl-9 pr-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-2xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
            {t.corpPhone}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              {...register('phone')}
              disabled={loading}
              className="block w-full pl-9 pr-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-2xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
            {t.role}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('role')}
              disabled={loading}
              placeholder={t.rolePlaceholder}
              className="block w-full pl-9 pr-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
            />
          </div>
          {errors.role && (
            <p className="mt-1 text-2xs text-red-500">{errors.role.message}</p>
          )}
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('privacyAccepted')}
              disabled={loading}
              className="mt-1 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-500 outline-none"
            />
            <span className="text-2xs text-zinc-500 dark:text-zinc-400 leading-normal select-none">
              {t.privacyCheck}
            </span>
          </label>
          {errors.privacyAccepted && (
            <p className="mt-1 text-2xs text-red-500">{errors.privacyAccepted.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold rounded-xl text-sm transition-all shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            t.submitForm
          )}
        </button>
      </form>
    </div>
  );
};
