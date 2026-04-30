import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, LogIn } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const prefix = lang === 'es' ? '/es' : '/en';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to={lang === 'es' ? '/es' : '/en'} className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-semibold text-sm">
            E
          </div>
          <span className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
            EarthConnect
          </span>
        </Link>

        <button
          className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenGroup(group.label)}
              onMouseLeave={() => setOpenGroup(null)}
            >
              <button className="inline-flex items-center gap-0.5 px-2.5 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                {group.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {openGroup === group.label && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 ${group.items.length > 6 ? 'w-[40rem]' : 'w-[22rem]'}`}>
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg p-1.5">
                    <div className={group.items.length > 6 ? 'grid grid-cols-2 gap-0.5' : ''}>
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          to={`${prefix}/${item.href}`}
                          className="block px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {item.label}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
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

        <div className="flex items-center gap-2 shrink-0">
          <Link to={`${prefix}/company/contact-us`} className="hidden md:inline-flex text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Contact
          </Link>

          {/* Login dropdown */}
          <div className="relative" ref={loginRef}>
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </button>
            {loginOpen && (
              <div className="absolute top-full right-0 pt-2 w-52">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg p-1.5">
                  <Link
                    to={`${prefix}/buyer-login`}
                    onClick={() => setLoginOpen(false)}
                    className="block px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Customer Portal</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Access your quotes & orders</div>
                  </Link>
                  <Link
                    to={`${prefix}/carrier-login`}
                    onClick={() => setLoginOpen(false)}
                    className="block px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Carrier Portal</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage opportunities & quotes</div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-md p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                lang === 'es'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-3">
            {navGroups.map((group) => (
              <div key={group.label}>
                <button
                  onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {group.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${openGroup === group.label ? 'rotate-180' : ''}`} />
                </button>
                {openGroup === group.label && (
                  <div className="mt-2 pl-3 space-y-2 border-l border-zinc-200 dark:border-zinc-800">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        to={`${prefix}/${item.href}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
              <Link
                to={`${prefix}/buyer-login`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Customer Portal
              </Link>
              <Link
                to={`${prefix}/carrier-login`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Carrier Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
