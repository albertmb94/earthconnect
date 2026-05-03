import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { setCarrierAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';

export const CarrierLogin: React.FC = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication - in production this would call Supabase Auth
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email && password) {
      setCarrierAuth({
        role: 'carrier',
        email,
        name: email.split('@')[0],
        company: 'Telecom Corp'
      });
      const prefix = lang === 'es' ? '/es' : '/en';
      navigate(`${prefix}/carrier`);
    } else {
      setError('Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-bold text-xl mx-auto mb-4">
              C
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Carrier Portal</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to manage opportunities and quotes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                Corporate Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="carrier@operator.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold rounded-xl text-sm transition-all shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Carrier Portal'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-400">
              Want to buy connectivity?{' '}
              <Link to={`${lang === 'es' ? '/es' : '/en'}/buyer-login`} className="text-zinc-600 dark:text-zinc-300 hover:underline">
                Go to Buyer Portal
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};