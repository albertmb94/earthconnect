import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Building2, CalendarDays, Contact, Database, FileText, Globe2, Network, Radio, Satellite, Shield, WalletCards } from 'lucide-react';

type Page = {
  title: string;
  kicker: string;
  description: string;
  bullets: string[];
  metrics: string[];
  icon: React.ElementType;
};

const pageData: Record<string, Page> = {
  'procurement': {
    title: 'Procurement',
    kicker: 'Product',
    description: 'Source global enterprise connectivity faster with comparable quotes, normalized provider data, and pricing context by address.',
    bullets: ['Compare carrier availability per site', 'Shortlist DIA, MPLS, broadband, 5G and satellite providers', 'Track price ranges before requesting final quotes'],
    metrics: ['Address-first sourcing', 'P10-P60 price ranges', 'Multi-country procurement'],
    icon: WalletCards
  },
  'network-inventory-manager': {
    title: 'Network Inventory Manager',
    kicker: 'Product',
    description: 'Build a searchable inventory of enterprise locations, access types, carriers, SLAs, and renewal dates.',
    bullets: ['Centralize circuits by country and city', 'Track service type, bandwidth, provider and scope', 'Identify overlap, redundancy and missing coverage'],
    metrics: ['Circuit visibility', 'Provider rationalization', 'SLA mapping'],
    icon: Database
  },
  'expense-manager': {
    title: 'Expense Manager',
    kicker: 'Product',
    description: 'Benchmark telecom spend against expected local ranges and find savings opportunities across your footprint.',
    bullets: ['Validate invoices against market ranges', 'Detect sites paying above expected percentiles', 'Plan renewals with local currency context'],
    metrics: ['Spend benchmark', 'Renewal planning', 'Currency-aware pricing'],
    icon: WalletCards
  },
  'dia': {
    title: 'Dedicated Internet Access',
    kicker: 'Solution',
    description: 'Dedicated, uncontended enterprise internet with clear SLA, committed bandwidth, and predictable latency.',
    bullets: ['Symmetric bandwidth', 'Carrier-grade SLA', 'Cloud and data center handoff options'],
    metrics: ['10 Mbps to 10 Gbps', '99.9%+ SLA', 'Static IP support'],
    icon: Network
  },
  'broadband': {
    title: 'Broadband / FTTX',
    kicker: 'Solution',
    description: 'Cost-efficient business broadband for branch connectivity, SD-WAN underlay and backup links.',
    bullets: ['FTTH, FTTC and cable availability', 'Fast provisioning where coverage exists', 'Good fit for retail and distributed offices'],
    metrics: ['High availability coverage', 'Low entry cost', 'SD-WAN ready'],
    icon: Radio
  },
  'mpls': {
    title: 'MPLS',
    kicker: 'Solution',
    description: 'Private WAN connectivity for enterprises that need QoS, predictable routing and managed network operations.',
    bullets: ['Private routing domains', 'QoS for voice and critical apps', 'Hybrid migration path to SD-WAN'],
    metrics: ['Managed WAN', 'QoS enabled', 'Global carrier options'],
    icon: Shield
  },
  '5g': {
    title: '5G Business Connectivity',
    kicker: 'Solution',
    description: 'Cellular business connectivity for rapid deployment, backup resilience and sites without immediate fiber.',
    bullets: ['National operator coverage checks', 'Wireless failover for SD-WAN', 'Fast deployment for temporary sites'],
    metrics: ['Up to 1 Gbps', 'National scope', 'Rapid activation'],
    icon: Radio
  },
  'satellite': {
    title: 'Satellite LEO / MEO / GEO',
    kicker: 'Solution',
    description: 'Satellite connectivity for remote locations, maritime, energy, mining, emergency services and hard-to-reach markets.',
    bullets: ['LEO providers like Starlink and OneWeb', 'MEO high-capacity enterprise backhaul', 'GEO regional resilience'],
    metrics: ['Global scope', 'Remote site coverage', 'Failover ready'],
    icon: Satellite
  },
  'dark-fiber': {
    title: 'Dark Fiber',
    kicker: 'Solution',
    description: 'Unlit fiber access for enterprises needing full control, high capacity, privacy and long-term scale.',
    bullets: ['Metro and long-haul availability', 'DWDM-ready infrastructure', 'Data center and campus interconnects'],
    metrics: ['High capacity', 'Low latency', 'Carrier-neutral'],
    icon: Network
  },
  'about-us': {
    title: 'About Us',
    kicker: 'Company',
    description: 'EarthConnect helps enterprises make better telecom decisions by combining address intelligence, provider availability and pricing benchmarks.',
    bullets: ['Built for global IT and procurement teams', 'Focused on transparent B2B connectivity data', 'Designed for multi-country operations'],
    metrics: ['B2B first', 'Global coverage', 'SEO-ready intelligence'],
    icon: Building2
  },
  'contact-us': {
    title: 'Contact Us',
    kicker: 'Company',
    description: 'Talk to our connectivity specialists about site qualification, provider sourcing and global network transformation.',
    bullets: ['Enterprise connectivity sourcing', 'Multi-site quote projects', 'Network inventory and expense review'],
    metrics: ['2 hour response', 'Corporate email required', 'GDPR compliant'],
    icon: Contact
  },
  'earthconnect-faq': {
    title: 'EarthConnect FAQ',
    kicker: 'Company',
    description: 'Answers about how EarthConnect validates addresses, estimates prices, handles lead gating and prepares provider insights.',
    bullets: ['Photon geocoding normalizes global addresses', 'PostGIS ranks nearby infrastructure nodes', 'Coverage services are validated by country and provider scope'],
    metrics: ['Address-first', 'PostGIS RPC', 'Supabase-ready'],
    icon: BookOpen
  },
  'telecom-faq': {
    title: 'Telecom FAQ',
    kicker: 'Company',
    description: 'Practical explanations of DIA, broadband, MPLS, 5G, LEO satellite and dark fiber for enterprise buyers.',
    bullets: ['DIA is uncontended and SLA-backed', 'Broadband is cost-efficient but shared', 'Dark fiber provides the most control and scale'],
    metrics: ['Buyer education', 'SLA guidance', 'Service comparison'],
    icon: BookOpen
  },
  'case-studies': {
    title: 'Case Studies',
    kicker: 'Resources',
    description: 'Explore how global enterprises use address-level data to reduce sourcing time and uncover network savings.',
    bullets: ['Retail branch SD-WAN refresh', 'Data center interconnect sourcing', 'Satellite backup for remote operations'],
    metrics: ['Faster sourcing', 'Lower spend', 'Better resilience'],
    icon: FileText
  },
  'events': {
    title: 'Events',
    kicker: 'Resources',
    description: 'Join EarthConnect sessions on network procurement, telecom expense optimization and global connectivity trends.',
    bullets: ['Procurement workshops', 'Telecom roundtables', 'Provider ecosystem briefings'],
    metrics: ['Live sessions', 'Operator insights', 'B2B networking'],
    icon: CalendarDays
  },
  'blog': {
    title: 'Blog',
    kicker: 'Resources',
    description: 'Read analysis on carrier markets, price ranges, bandwidth planning, satellite adoption and enterprise connectivity strategy.',
    bullets: ['Market-by-market guides', 'Bandwidth cost models', 'Connectivity procurement playbooks'],
    metrics: ['Weekly insights', 'SEO research', 'Telecom analysis'],
    icon: FileText
  },
  'webinars': {
    title: 'Webinars',
    kicker: 'Resources',
    description: 'On-demand sessions for IT, procurement and finance teams managing global telecom infrastructure.',
    bullets: ['How to benchmark DIA pricing', 'When to use LEO satellite', 'Building a network inventory program'],
    metrics: ['On-demand', 'Expert-led', 'Practical templates'],
    icon: Globe2
  }
};

export const MarketingPage: React.FC = () => {
  const { slug = 'about-us', lang = 'en' } = useParams();
  const page = pageData[slug] || pageData['about-us'];
  const Icon = page.icon;

  useEffect(() => {
    document.title = `${page.title} | EarthConnect`;
    const description = `${page.description} Explore EarthConnect for enterprise connectivity procurement and network intelligence.`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [page]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 px-6 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-zinc-500 mb-6">
              <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" />
              {page.kicker}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
              {page.title}
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mb-8">
              {page.description}
            </p>
            <Link to={lang === 'es' ? '/es' : '/en'} className="inline-flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-5 py-3 text-sm font-bold hover:scale-[1.02] transition-transform">
              Check address availability
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-5 lg:pt-8">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-xl shadow-zinc-950/5">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center mb-6">
                <Icon className="w-7 h-7" />
              </div>
              <div className="space-y-4">
                {page.bullets.map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mt-16 pb-24">
          {page.metrics.map((metric, index) => (
            <motion.div key={metric} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index }} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/30 p-5">
              <div className="text-2xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">Signal {index + 1}</div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">{metric}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};