import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../lib/i18n';

type NavItem = {
  label: string;
  href: string;
  hint: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Product',
    items: [
      {
        label: 'Procurement',
        href: 'product/procurement',
        hint: 'Automated RFPs, quoting, pricing intelligence, and install tracking'
      },
      {
        label: 'Network Inventory Manager',
        href: 'product/network-inventory-manager',
        hint: 'Digital system of record for circuits, SLAs, contracts, and MACD workflows'
      },
      {
        label: 'Telecom Expense Management',
        href: 'product/telecom-expense-management',
        hint: 'AI-assisted invoice ingestion, audit, variance analysis, and bill pay'
      },
      {
        label: 'API & Integrations',
        href: 'product/api-integrations',
        hint: 'Connect with ServiceNow, NetBox, Splunk, Meraki, and internal systems'
      }
    ]
  },
  {
    label: 'Solutions',
    items: [
      {
        label: 'SASE & Cloud Security',
        href: 'solutions/sase-security',
        hint: 'Unified networking and security architecture for the modern edge'
      },
      {
        label: 'Cybersecurity Services',
        href: 'solutions/cybersecurity',
        hint: 'Managed SOC, penetration testing, and vulnerability management'
      },
      {
        label: 'Cloud & Migration',
        href: 'solutions/cloud-migration',
        hint: 'Public, private, and hybrid cloud sourcing and cost optimization'
      },
      {
        label: 'Managed Mobility (MMS)',
        href: 'solutions/managed-mobility',
        hint: 'Centralized mobile logistics, device lifecycle, and cost control'
      },
      {
        label: 'POTS Replacement',
        href: 'solutions/pots-replacement',
        hint: 'Modernize legacy analog lines with cost-effective digital alternatives'
      },
      {
        label: 'Managed Services (MSP)',
        href: 'solutions/managed-services',
        hint: 'Ongoing support for global network operations and MACD requests'
      },
      {
        label: 'Dedicated Internet (DIA)',
        href: 'solutions/dia',
        hint: 'Enterprise DIA with SLA-backed bandwidth and pricing visibility'
      },
      {
        label: 'Broadband / FTTX',
        href: 'solutions/broadband',
        hint: 'Business broadband and fiber access for branch and SD-WAN underlay'
      },
      {
        label: 'MPLS & SD-WAN',
        href: 'solutions/mpls-sdwan',
        hint: 'Private WAN, QoS, migration planning, and modern hybrid architecture'
      },
      {
        label: 'Dark Fiber & EPL',
        href: 'solutions/dark-fiber-epl',
        hint: 'High-capacity interconnects, wavelength-ready routes, and private transport'
      },
      {
        label: 'Satellite Connectivity',
        href: 'solutions/satellite-connectivity',
        hint: 'LEO, MEO, and GEO coverage for remote and resilient enterprise access'
      },
      {
        label: 'Voice & Collaboration',
        href: 'solutions/voice-collaboration',
        hint: 'UCaaS, CCaaS, SIP, VoIP, and modern collaboration tools'
      }
    ]
  },
  {
    label: 'Company',
    items: [
      {
        label: 'About EarthConnect',
        href: 'company/about-us',
        hint: 'Why we built an address-first telecom intelligence platform'
      },
      {
        label: 'Contact Us',
        href: 'company/contact-us',
        hint: 'Speak with a connectivity specialist about sourcing or optimization'
      },
      {
        label: 'EarthConnect FAQ',
        href: 'company/earthconnect-faq',
        hint: 'Platform, pricing logic, lead workflows, and product questions'
      },
      {
        label: 'Telecom FAQ',
        href: 'company/telecom-faq',
        hint: 'Clear explanations of DIA, MPLS, FTTX, 5G, satellite, and dark fiber'
      },
      {
        label: 'Lifecycle Methodology',
        href: 'company/lifecycle-methodology',
        hint: 'Design, source, implement, operate, and optimize connectivity globally'
      }
    ]
  },
  {
    label: 'Resources',
    items: [
      {
        label: 'Case Studies',
        href: 'resources/case-studies',
        hint: 'Examples of savings, performance upgrades, and multi-country rollouts'
      },
      {
        label: 'Market Briefs',
        href: 'resources/market-briefs',
        hint: 'Tactical guides on SD-WAN, 5G, AI-powered connectivity, and cost models'
      },
      {
        label: 'Blog',
        href: 'resources/blog',
        hint: 'Telecom market analysis, buying guides, and country-level insights'
      },
      {
        label: 'Events',
        href: 'resources/events',
        hint: 'Roundtables, launch sessions, and enterprise networking events'
      },
      {
        label: 'Webinars',
        href: 'resources/webinars',
        hint: 'On-demand sessions for IT, procurement, finance, and network teams'
      }
    ]
  }
];

export const Navbar: React.FC = () => {
  const { lang, setLanguage } = useI18n();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const prefix = lang === 'es' ? '/es' : '/en';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60">
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
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenGroup(group.label)}
              onMouseLeave={() => setOpenGroup(null)}
            >
              <button className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                {group.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {openGroup === group.label && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 ${group.items.length > 6 ? 'w-[44rem]' : 'w-[24rem]'}`}>
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl shadow-zinc-950/10 p-2">
                    <div className={group.items.length > 6 ? 'grid grid-cols-2 gap-0.5' : ''}>
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          to={`${prefix}/${item.href}`}
                          className="block px-3 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {item.label}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                            {item.hint}
                          </div>
                        </Link>
                      ))}
                    </div>
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
