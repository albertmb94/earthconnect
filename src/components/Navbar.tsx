import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../lib/i18n';

const navGroups = [
  { label: 'Product', items: [['Procurement', 'product/procurement'], ['Network Inventory Manager', 'product/network-inventory-manager'], ['Expense Manager', 'product/expense-manager']] },
  { label: 'Solutions', items: [['DIA', 'solutions/dia'], ['Broadband', 'solutions/broadband'], ['MPLS', 'solutions/mpls'], ['5G', 'solutions/5g'], ['Satellite LEO/MEO/GEO', 'solutions/satellite'], ['Dark Fiber', 'solutions/dark-fiber']] },
  { label: 'Company', items: [['About Us', 'company/about-us'], ['Contact Us', 'company/contact-us'], ['EarthConnect FAQ', 'company/earthconnect-faq'], ['Telecom FAQ', 'company/telecom-faq']] },
  { label: 'Resources', items: [['Case Studies', 'resources/case-studies'], ['Events', 'resources/events'], ['Blog', 'resources/blog'], ['Webinars', 'resources/webinars']] }
];

export const Navbar: React.FC = () => {
  const { lang, setLanguage } = useI18n();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const prefix = lang === 'es' ? '/es' : '/en';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-5">
        <Link to={lang === 'es' ? '/es' : '/en'} className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-bold text-lg group-hover:scale-105 transition-transform border border-zinc-700/50">
            E
          </div>
          <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:opacity-80 transition-opacity">
            Earth<span className="font-normal text-zinc-500">Connect</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navGroups.map((group) => (
            <div key={group.label} className="relative" onMouseEnter={() => setOpenGroup(group.label)} onMouseLeave={() => setOpenGroup(null)}>
              <button className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                {group.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {openGroup === group.label && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64">
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl shadow-zinc-950/10 p-2">
                    {group.items.map(([label, href]) => (
                      <Link key={href} to={`${prefix}/${href}`} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to={`${prefix}/company/contact-us`} className="hidden md:inline-flex text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
            Contact
          </Link>
          <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                lang === 'es'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
