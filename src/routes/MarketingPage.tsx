import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

/* ================================================================
   RICH PAGE DATA MODEL
   ================================================================ */
interface KPI { value: string; label: string; color?: string }
interface Capability { icon: string; title: string; description: string; bullets?: string[] }
interface UseCase { title: string; description: string; accent?: string }
interface Testimonial { quote: string; role: string; company: string }
interface ContentBlock { title: string; description: string; bullets?: string[] }
interface TableRow { label: string; value: string; accent?: boolean }

interface RichPage {
  kicker: string;
  title: string;
  titleAccent?: string;
  description: string;
  kpis: KPI[];
  capabilitiesTitle?: string;
  capabilitiesSubtitle?: string;
  capabilities: Capability[];
  contentTitle?: string;
  contentDescription?: string;
  contentBlocks?: ContentBlock[];
  useCasesTitle?: string;
  useCases?: UseCase[];
  sampleTable?: { title: string; rows: TableRow[] };
  testimonials?: Testimonial[];
}

/* ================================================================
   PAGE DEFINITIONS
   ================================================================ */
const pages: Record<string, RichPage> = {

  /* ─── PRODUCT ─────────────────────────────────────────────── */

  'procurement': {
    kicker: 'Product · Procurement',
    title: 'The Future of Telecom',
    titleAccent: 'Procurement',
    description: 'Transparent, efficient, and automated. Source enterprise connectivity globally with address-level intelligence, 1,200+ carrier access, and data-driven pricing benchmarks — without the RFP chaos.',
    kpis: [
      { value: '70%+', label: 'Time savings on RFP process', color: 'text-emerald-400' },
      { value: '20%+', label: 'Average cost savings', color: 'text-sky-400' },
      { value: '1,200+', label: 'Global carrier integrations', color: 'text-amber-400' },
      { value: '1M+', label: 'Price quote data points', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Everything you need to source smarter',
    capabilitiesSubtitle: 'From the first RFP to post-install lifecycle management — one platform, zero guesswork.',
    capabilities: [
      { icon: '⚡', title: 'Automated & Digitized RFP', description: 'Configure internet, WAN, colocation, or voice requests for one site or hundreds in seconds. Templatize network configurations for even faster RFP creation.' },
      { icon: '📊', title: 'Network & Pricing Intelligence', description: 'Leverage 1,200+ vendor integrations and the industry\'s most current pricing dataset to receive exhaustive bids at best prices — every time.' },
      { icon: '🔧', title: 'Engineering & Design Support', description: 'Evaluate route diversity with automated KMZ gathering and leverage telecom experts to ensure your network architecture is perfectly optimized.' },
      { icon: '📍', title: 'Implementation Tracking', description: 'Track every install milestone. Issues are immediately escalated via proprietary escalation paths to ensure delivery timelines are honored.' },
      { icon: '🔄', title: 'Lifecycle Management', description: 'Post-install, manage your full telecom service lifecycle — carrier workflows, renewals, MACDs, and expense — behind a single pane of glass.' },
      { icon: '🎯', title: 'Type-1 Sourcing Strategy', description: 'Our platform identifies the right type-1 provider per address — so you never overpay for type-2 access that inflates unit costs by 25%+.' }
    ],
    contentTitle: 'Bulk pricing ≠ best pricing',
    contentDescription: 'Most enterprises send one RFP to multiple carriers for all sites. But when carriers quote outside their own last mile footprint, they layer type-2 access costs on top — inflating per unit prices even when you think you\'ve negotiated a great discount.\n\nEarthConnect\'s address intelligence identifies the optimal type-1 provider per site, so each carrier only quotes services where they are truly the lowest-cost provider.',
    contentBlocks: [
      { title: '25%+ lower unit costs vs. type-2 blended pricing', description: '' },
      { title: 'Faster RFP response times — no secondary wholesale quoting', description: '' },
      { title: 'Cleaner implementations — direct carrier to end user', description: '' },
      { title: 'Accurate last-mile diversity — no hidden shared transport', description: '' }
    ],
    useCasesTitle: 'When to use Procurement',
    useCases: [
      { title: 'Type-1 Access (Optimal)', description: 'Same provider, end-to-end. The carrier owns the last-mile fiber AND the core network. Lowest cost, highest margin for negotiation, cleanest delivery.', accent: 'emerald' },
      { title: 'Type-2 Access (Costly)', description: 'ISP leases another carrier\'s fiber. Reseller marks up the underlying provider\'s cost. Implementation is slower, repair is slower, and true diversity is often invisible.', accent: 'red' }
    ],
    testimonials: [
      { quote: 'We cut our telecom RFP cycle from 3 months to under 2 weeks. The type-1 sourcing approach alone saved us over $400K annually across 80 sites.', role: 'VP of IT Infrastructure', company: 'Retail Group, 700+ locations' },
      { quote: 'Having an address-first platform means we don\'t waste time chasing quotes from carriers that aren\'t actually competitive at our sites. Game changer.', role: 'Global Network Manager', company: 'Financial Services, EU Operations' },
      { quote: 'EarthConnect gives our procurement team the pricing context they needed before even opening an RFP. Negotiations are completely different now.', role: 'Head of Telecom Sourcing', company: 'Logistics & Supply Chain Enterprise' }
    ]
  },

  'network-inventory-manager': {
    kicker: 'Product · Network Inventory Manager',
    title: "Your Network's",
    titleAccent: 'Digital System of Record',
    description: 'Capture, organize, and automate every service, vendor, circuit, and contract across your global footprint — with 30+ data points per service and zero spreadsheets.',
    kpis: [
      { value: '30+', label: 'Data points per service', color: 'text-emerald-400' },
      { value: '100%', label: 'Inventory accuracy', color: 'text-sky-400' },
      { value: '1-click', label: 'Custom report generation', color: 'text-amber-400' },
      { value: '0', label: 'Spreadsheets needed', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Visibility across your entire connectivity landscape',
    capabilitiesSubtitle: 'Comprehensive situational awareness including inventory, service, contract, and expense details across every site.',
    capabilities: [
      { icon: '📋', title: 'Digitize your system of record', description: 'Organize an accurate digital record for every network service, vendor, and cost — with fingertip access to carrier, circuit ID, IP address, bandwidth, and 30+ additional data points.' },
      { icon: '🔁', title: 'Automate contract renewal & rebid', description: 'Gain transparency into end dates, notice periods, and price escalations. Automated re-bidding fires before any contract expiration to drive continuous cost optimization.' },
      { icon: '🎫', title: 'Streamline MACD workflows', description: 'Open MACD, billing, issue, and SLA breach tickets across all vendors behind a single pane of glass. Build custom reports on costs, services, locations, and vendors in seconds.' },
      { icon: '💰', title: 'Achieve continuous ROI', description: 'Full network visibility, automated rebids, annual telecom expense audits, and streamlined issue resolution — continuously saving well in excess of industry price deflation.' }
    ],
    sampleTable: {
      title: 'Sample Inventory Record',
      rows: [
        { label: 'Site', value: 'Paseo de la Castellana 259, Madrid' },
        { label: 'Service Type', value: 'DIA — Dedicated Internet Access', accent: true },
        { label: 'Provider', value: 'Colt Technology Services' },
        { label: 'Bandwidth', value: '500 Mbps symmetric', accent: true },
        { label: 'Monthly Cost', value: '€946 / month' },
        { label: 'Contract End', value: 'March 2026' },
        { label: 'Notice Period', value: '90 days' },
        { label: 'Circuit ID', value: 'COLT-ES-MAD-00421' },
        { label: 'SLA Availability', value: '99.95%', accent: true },
        { label: 'Last-Mile Type', value: 'Type-1 (COLT fiber)' }
      ]
    },
    testimonials: [
      { quote: 'We went from managing 400 circuits in spreadsheets to having a live, searchable system of record in under three weeks. Renewals stopped falling through the cracks.', role: 'Director of Network Operations', company: 'Manufacturing, 120 sites globally' },
      { quote: 'The MACD workflow alone saves our team 15 hours a week. We used to track everything in email and shared drives.', role: 'IT Operations Lead', company: 'Healthcare Group, 60 clinics' }
    ]
  },

  'telecom-expense-management': {
    kicker: 'Product · Telecom Expense Management',
    title: 'AI-Native Telecom',
    titleAccent: 'Expense Management',
    description: 'The core problem in telecom billing: inaccessible, indigestible data. EarthConnect Expense Management solves this with AI-powered data extraction tied to a closed data lifecycle — eliminating the pain of telecom billing for your IT and Finance teams.',
    kpis: [
      { value: '100%', label: 'Granular cost visibility', color: 'text-emerald-400' },
      { value: '0', label: 'Outages from missed payments', color: 'text-sky-400' },
      { value: '80%+', label: 'Time savings on bill management', color: 'text-amber-400' },
      { value: '24h', label: 'Average invoice processing', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'End-to-end invoice automation',
    capabilitiesSubtitle: 'From receipt to audit to payment — no more manual data entry, no more mystery charges.',
    capabilities: [
      { icon: '📨', title: 'Global Invoice Receipt & Processing', description: 'Comprehensive invoice coverage across your global carrier ecosystem. Whether carriers deliver via PDF, EDI, Excel, API, or mail — we ingest and process everything.' },
      { icon: '🎯', title: '100% Accurate Cost Allocation', description: 'AI-powered data extraction ensures costs are fully allocated to validated inventory services only — no mystery charges. Each invoice undergoes human review for accuracy.' },
      { icon: '🔍', title: 'Automated Audit & Variance Analysis', description: 'Each invoice is audited against configurable variance rules: costs vs. contracted rates, disconnected services still billing, month-over-month anomalies.' },
      { icon: '📊', title: 'Rich Reporting & API', description: 'Access granular service, location, and line item data directly or through API. Natural language query system lets you build custom reports by simply asking questions.' },
      { icon: '💳', title: 'Tailored Bill Pay Options', description: 'Choose No Bill Pay (invoice data delivered in your format) or Bill Consolidation (single monthly bill, we pay carriers on time on your behalf).' }
    ],
    testimonials: [
      { quote: 'We eliminated $180K in annual billing errors within the first quarter. Charges for disconnected circuits were still hitting our accounts for months.', role: 'Finance Director', company: 'Retail Chain, 500+ locations' }
    ]
  },

  'api-integrations': {
    kicker: 'Product · API & Integrations',
    title: 'Connect Your',
    titleAccent: 'Enterprise Stack',
    description: 'Integrate EarthConnect data and workflows with your broader enterprise systems — ITSM, observability, network operations, CRM, and BI platforms.',
    kpis: [
      { value: 'REST', label: 'API architecture', color: 'text-emerald-400' },
      { value: 'Real-time', label: 'Data synchronization', color: 'text-sky-400' },
      { value: 'SSO', label: 'Enterprise auth support', color: 'text-amber-400' },
      { value: 'Webhook', label: 'Event-driven updates', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Built for enterprise integration',
    capabilities: [
      { icon: '🔗', title: 'ServiceNow Integration', description: 'Sync inventory records, MACD tickets, and incident data directly with your ServiceNow CMDB and ITSM workflows.' },
      { icon: '📡', title: 'Network Observability', description: 'Push circuit, provider, and SLA metadata to Splunk, Datadog, or Grafana for enriched network monitoring dashboards.' },
      { icon: '🏢', title: 'CRM & BI Connectors', description: 'Feed procurement, lead, and expense data into Salesforce, HubSpot, Power BI, or Tableau for cross-functional reporting.' },
      { icon: '🔒', title: 'SSO & Role-Based Access', description: 'Enterprise-grade authentication with SAML, OAuth, and role-based permissions for multi-team environments.' }
    ],
    testimonials: []
  },

  /* ─── SOLUTIONS ───────────────────────────────────────────── */

  'dia': {
    kicker: 'Solution · Dedicated Internet Access',
    title: 'Dedicated Internet',
    titleAccent: 'Access',
    description: 'Uncontended, symmetric enterprise internet with committed bandwidth, carrier-grade SLA, and direct cloud handoff. The gold standard for business-critical connectivity.',
    kpis: [
      { value: '10M–10G', label: 'Bandwidth range', color: 'text-emerald-400' },
      { value: '99.99%', label: 'SLA availability', color: 'text-sky-400' },
      { value: '<4h', label: 'MTTR SLA commitment', color: 'text-amber-400' },
      { value: 'Static IPs', label: 'Assigned per circuit', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'What is DIA?',
    capabilitiesSubtitle: 'Dedicated Internet Access (DIA) is a business-grade circuit where bandwidth is not shared with other customers. Unlike broadband, DIA delivers symmetric speeds — same download and upload — backed by a contractual SLA covering uptime, latency, and repair times.',
    capabilities: [
      { icon: '⬆️', title: 'Symmetric bandwidth', description: 'Same up and down speed — critical for cloud uploads, VoIP, video, and real-time applications.' },
      { icon: '🔒', title: 'Dedicated — not shared', description: 'Your bandwidth is reserved end-to-end. No contention ratios, no peak-hour degradation.' },
      { icon: '📜', title: 'Contractual SLA', description: 'Uptime, latency, jitter, MTTR — all contractually guaranteed with financial penalties for breach.' },
      { icon: '🌐', title: 'Static IP addressing', description: 'For servers, VPNs, SIP trunks, and any service requiring a fixed public address.' },
      { icon: '🔀', title: 'BGP routing support', description: 'Multi-homing capable for enterprises running their own AS number and IP space.' },
      { icon: '☁️', title: 'Cloud handoff', description: 'AWS Direct Connect, Azure ExpressRoute, and GCP Interconnect via carrier-neutral facilities.' }
    ],
    useCasesTitle: 'When to choose DIA',
    useCases: [
      { title: 'Primary WAN underlay', description: 'SD-WAN primary link requiring symmetric throughput and an SLA that can support failover logic.', accent: 'sky' },
      { title: 'Cloud direct connect', description: 'Latency-sensitive private peering to AWS, Azure, or GCP via carrier-neutral cross-connect.', accent: 'emerald' },
      { title: 'Mission-critical applications', description: 'ERP, unified communications, trading platforms, healthcare records — any app where downtime has a financial cost.', accent: 'amber' },
      { title: 'Data center uplinks', description: 'Carrier-neutral colo connectivity requiring multiple ASN options and full route control.', accent: 'fuchsia' }
    ],
    testimonials: [
      { quote: 'Switching from broadband to DIA at our top 20 sites reduced latency by 40% and eliminated peak-hour slowdowns entirely. The SLA gives us real accountability.', role: 'Network Engineering Lead', company: 'SaaS Platform, 3,000 employees' }
    ]
  },

  'broadband': {
    kicker: 'Solution · Broadband / FTTX',
    title: 'Business',
    titleAccent: 'Broadband & FTTX',
    description: 'Cost-efficient business broadband and fiber-to-the-premises for branch connectivity, SD-WAN underlay, backup links, and distributed retail networks.',
    kpis: [
      { value: '50–1G', label: 'Typical bandwidth', color: 'text-emerald-400' },
      { value: '95%+', label: 'Coverage in metro areas', color: 'text-sky-400' },
      { value: '2–4wk', label: 'Average provisioning', color: 'text-amber-400' },
      { value: 'Low', label: 'Monthly cost per site', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'When broadband makes sense',
    capabilities: [
      { icon: '🏪', title: 'Branch & Retail', description: 'Cost-effective access for locations where DIA is not justified by traffic volume or application criticality.' },
      { icon: '🔄', title: 'SD-WAN Underlay', description: 'Pair broadband with DIA or LTE to build a resilient, policy-driven hybrid WAN at lower total cost.' },
      { icon: '🛡️', title: 'Backup Circuits', description: 'Secondary path for business continuity when the primary DIA or MPLS link experiences an outage.' },
      { icon: '⚡', title: 'Fast Activation', description: 'Where fiber or cable infrastructure already exists, broadband can be provisioned significantly faster than DIA.' }
    ],
    testimonials: []
  },

  'mpls-sdwan': {
    kicker: 'Solution · MPLS & SD-WAN',
    title: 'MPLS &',
    titleAccent: 'SD-WAN',
    description: 'Design and source private WAN services for enterprises balancing QoS, traffic engineering, application policy, cloud access, and global branch consistency.',
    kpis: [
      { value: 'QoS', label: 'Traffic prioritization', color: 'text-emerald-400' },
      { value: 'Global', label: 'Multi-country reach', color: 'text-sky-400' },
      { value: 'Hybrid', label: 'MPLS + Internet transport', color: 'text-amber-400' },
      { value: 'SASE', label: 'Security overlay ready', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Private WAN evolution',
    capabilities: [
      { icon: '🔒', title: 'MPLS Private Routing', description: 'Strict QoS and private transport for regulated, latency-sensitive, or high-security environments.' },
      { icon: '🌐', title: 'SD-WAN Modernization', description: 'Policy-based routing across DIA, broadband, 5G, and MPLS — application-aware and cloud-optimized.' },
      { icon: '🛡️', title: 'SASE Integration', description: 'Combine SD-WAN with ZTNA, SWG, CASB, and FWaaS for unified network + security architecture.' },
      { icon: '🔀', title: 'Migration Planning', description: 'Phased migration from legacy MPLS to SD-WAN with hybrid coexistence during transition periods.' }
    ],
    testimonials: []
  },

  'dark-fiber-epl': {
    kicker: 'Solution · Dark Fiber & EPL',
    title: 'Dark Fiber &',
    titleAccent: 'Private Transport',
    description: 'High-capacity, low-latency private transport for enterprises needing long-term scale, optical control, and carrier-neutral connectivity between key locations.',
    kpis: [
      { value: '100G+', label: 'Capacity potential', color: 'text-emerald-400' },
      { value: '<1ms', label: 'Metro latency', color: 'text-sky-400' },
      { value: 'DWDM', label: 'Wavelength ready', color: 'text-amber-400' },
      { value: 'IRU', label: 'Long-term lease options', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'When to choose dark fiber',
    capabilities: [
      { icon: '🏢', title: 'Data Center Interconnects', description: 'Private fiber between colocation facilities, campus buildings, or disaster recovery sites.' },
      { icon: '🔬', title: 'Full Optical Control', description: 'Run your own DWDM or CWDM equipment for maximum capacity, security, and wavelength flexibility.' },
      { icon: '📈', title: 'Scalability', description: 'Bandwidth grows with your equipment — no recurring per-Mbps charges once the fiber is in place.' },
      { icon: '🛡️', title: 'Security & Privacy', description: 'No shared infrastructure, no multi-tenant risk, no third-party equipment in the optical path.' }
    ],
    testimonials: []
  },

  'satellite-connectivity': {
    kicker: 'Solution · Satellite LEO / MEO / GEO',
    title: 'Satellite',
    titleAccent: 'Connectivity',
    description: 'Global satellite connectivity for remote locations, maritime, energy, mining, emergency services, and any market where terrestrial infrastructure is impractical or unavailable.',
    kpis: [
      { value: 'Global', label: 'Worldwide coverage', color: 'text-emerald-400' },
      { value: '300M', label: 'LEO peak throughput', color: 'text-sky-400' },
      { value: '2 Gbps', label: 'MEO peak throughput', color: 'text-amber-400' },
      { value: '<20ms', label: 'LEO latency (Starlink NR)', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Three orbit classes, one platform',
    capabilities: [
      { icon: '🛰️', title: 'LEO — Low Earth Orbit', description: 'Constellations at 350–1,200 km altitude. Low latency (20–40ms), high throughput. Best for enterprise branch backup and remote offices.', bullets: ['Starlink Business (SpaceX)', 'OneWeb (Eutelsat)', 'Amazon Project Kuiper (Beta)'] },
      { icon: '🌍', title: 'MEO — Medium Earth Orbit', description: 'Constellations at 8,000–20,000 km. High-capacity enterprise and carrier backhaul. Ideal for government, offshore, and large enterprise WAN.', bullets: ['SES O3b mPOWER', '2 Gbps per beam capacity', 'Low-latency vs GEO'] },
      { icon: '📡', title: 'GEO — Geostationary Orbit', description: 'Fixed position at 35,786 km. Higher latency (600ms+) but proven, low-cost regional coverage. Best for broadcast, VSAT, and legacy remote.', bullets: ['Eutelsat (Europe)', 'Viasat (Americas)', 'Intelsat (Global)'] }
    ],
    useCasesTitle: 'Enterprise satellite use cases',
    useCases: [
      { title: 'Remote & Offshore Operations', description: 'Energy platforms, mining operations, maritime vessels, and remote government sites requiring 24/7 connectivity where no terrestrial option exists.', accent: 'sky' },
      { title: 'Emergency & Disaster Recovery', description: 'Satellite provides critical connectivity when terrestrial infrastructure is damaged. Rapidly deployable LEO terminals restore operations within hours.', accent: 'amber' }
    ],
    testimonials: []
  },

  'mobility-5g': {
    kicker: 'Solution · 5G / LTE / Managed Mobility',
    title: '5G, LTE &',
    titleAccent: 'Enterprise Mobility',
    description: 'Wireless access, managed mobility, and enterprise device programs for rapid activation, backup links, IoT, distributed workforces, and fleet management.',
    kpis: [
      { value: '1 Gbps', label: '5G peak throughput', color: 'text-emerald-400' },
      { value: '<24h', label: 'Rapid activation', color: 'text-sky-400' },
      { value: 'Global', label: 'Operator coverage checks', color: 'text-amber-400' },
      { value: 'MDM', label: 'Device management ready', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Wireless-first enterprise access',
    capabilities: [
      { icon: '📶', title: 'Primary Wireless Access', description: 'Use 5G/LTE as primary connectivity for pop-up sites, retail, events, and markets awaiting fiber builds.' },
      { icon: '🔄', title: 'SD-WAN Failover', description: 'Resilient secondary path for DIA or broadband. Policy-driven failover with automatic traffic steering.' },
      { icon: '📱', title: 'Managed Mobility (MMS)', description: 'Centralized mobile device procurement, logistics, inventory tracking, and help desk for distributed fleets.' },
      { icon: '💰', title: 'Mobile Spend Optimization', description: 'Automated usage audit, plan right-sizing, and carrier negotiation to reduce unnecessary mobile costs.' }
    ],
    testimonials: []
  },

  'voice-collaboration': {
    kicker: 'Solution · Voice & Collaboration',
    title: 'Voice &',
    titleAccent: 'Collaboration',
    description: 'Modernize enterprise communications with UCaaS, CCaaS, SIP trunking, hosted VoIP, and POTS replacement strategies for distributed organizations.',
    kpis: [
      { value: 'UCaaS', label: 'Unified communications', color: 'text-emerald-400' },
      { value: 'CCaaS', label: 'Contact center cloud', color: 'text-sky-400' },
      { value: 'SIP', label: 'Trunk consolidation', color: 'text-amber-400' },
      { value: 'POTS', label: 'Legacy replacement', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Communication technology areas',
    capabilities: [
      { icon: '☎️', title: 'UCaaS / Hosted VoIP', description: 'Cloud-delivered telephony, video, messaging, and presence for hybrid and distributed workforces.' },
      { icon: '🎧', title: 'CCaaS', description: 'Cloud contact center platforms with intelligent routing, analytics, and omni-channel engagement.' },
      { icon: '🔌', title: 'SIP & PRI', description: 'Consolidate voice trunking, reduce per-minute costs, and enable multi-site voice routing.' },
      { icon: '📞', title: 'POTS Replacement', description: 'Modernize legacy analog lines powering alarms, elevators, fax, and POS systems with LTE or VoIP alternatives. Reduce costs by up to 60%.' }
    ],
    testimonials: []
  },

  'sase-security': {
    kicker: 'Solution · SASE & Cloud Security',
    title: 'SASE &',
    titleAccent: 'Cloud Security',
    description: 'Unify networking and security into a single cloud-delivered architecture. SASE combines SD-WAN with ZTNA, SWG, CASB, and FWaaS for the modern enterprise edge.',
    kpis: [
      { value: 'ZTNA', label: 'Zero Trust access', color: 'text-emerald-400' },
      { value: 'SWG', label: 'Secure web gateway', color: 'text-sky-400' },
      { value: 'CASB', label: 'Cloud app security', color: 'text-amber-400' },
      { value: 'FWaaS', label: 'Firewall as a Service', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Converged network + security',
    capabilities: [
      { icon: '🛡️', title: 'Zero Trust Network Access', description: 'Verify every user, every device, every session. Replace VPN with identity-aware, least-privilege access.' },
      { icon: '🌐', title: 'Secure Web Gateway', description: 'Inspect and filter all internet-bound traffic for malware, phishing, and data exfiltration — regardless of user location.' },
      { icon: '☁️', title: 'Cloud Access Security Broker', description: 'Visibility and control over SaaS application usage, data sharing, and shadow IT across your organization.' },
      { icon: '🔥', title: 'Firewall as a Service', description: 'Cloud-delivered next-gen firewall capabilities applied consistently across all branch, remote, and mobile users.' }
    ],
    testimonials: []
  },

  'cybersecurity': {
    kicker: 'Solution · Cybersecurity Services',
    title: 'Enterprise',
    titleAccent: 'Cybersecurity',
    description: 'Proactively defend your enterprise with managed security operations, penetration testing, DDoS protection, and continuous vulnerability management.',
    kpis: [
      { value: '24/7', label: 'Managed SOC', color: 'text-emerald-400' },
      { value: 'PenTest', label: 'Regular assessments', color: 'text-sky-400' },
      { value: 'DDoS', label: 'Mitigation & monitoring', color: 'text-amber-400' },
      { value: 'SIEM', label: 'Log correlation', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Managed security services',
    capabilities: [
      { icon: '🔍', title: 'Vulnerability Assessments', description: 'Continuous scanning and prioritized remediation guidance for your infrastructure, applications, and endpoints.' },
      { icon: '🎯', title: 'Penetration Testing', description: 'Simulated attacks to identify exploitable weaknesses before adversaries find them. Compliance-ready reports.' },
      { icon: '🛡️', title: 'Managed SOC', description: '24/7 security operations center with real-time threat detection, incident response, and forensic analysis.' },
      { icon: '🌊', title: 'DDoS Protection', description: 'Always-on volumetric and application-layer DDoS monitoring and mitigation for critical internet-facing services.' }
    ],
    testimonials: []
  },

  'cloud-migration': {
    kicker: 'Solution · Cloud & Migration',
    title: 'Cloud',
    titleAccent: 'Infrastructure',
    description: 'Accelerate your cloud journey with expert sourcing and optimization across public, private, and hybrid cloud environments including AWS, Azure, and GCP.',
    kpis: [
      { value: 'AWS', label: 'Direct Connect', color: 'text-emerald-400' },
      { value: 'Azure', label: 'ExpressRoute', color: 'text-sky-400' },
      { value: 'GCP', label: 'Interconnect', color: 'text-amber-400' },
      { value: 'Hybrid', label: 'Multi-cloud ready', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Cloud connectivity services',
    capabilities: [
      { icon: '☁️', title: 'Cloud On-Ramps', description: 'Private, low-latency peering to hyperscale cloud providers through carrier-neutral data center cross-connects.' },
      { icon: '💰', title: 'Cloud Cost Optimization', description: 'Detailed usage analysis, right-sizing recommendations, and reserved instance planning to reduce cloud spend.' },
      { icon: '🔄', title: 'Migration Services', description: 'Plan and execute low-risk migrations from on-premise to cloud or hybrid models with structured runbooks.' },
      { icon: '🏗️', title: 'Hybrid Architecture', description: 'Design multi-cloud and hybrid-cloud topologies that balance performance, cost, compliance, and resilience requirements.' }
    ],
    testimonials: []
  },

  'managed-mobility': {
    kicker: 'Solution · Managed Mobility Services',
    title: 'Managed',
    titleAccent: 'Mobility',
    description: 'Centralize enterprise mobile device procurement, logistics, inventory tracking, help desk, and cost optimization for distributed workforces worldwide.',
    kpis: [
      { value: 'Global', label: 'Device logistics', color: 'text-emerald-400' },
      { value: 'MDM', label: 'Management integration', color: 'text-sky-400' },
      { value: '30%+', label: 'Typical spend reduction', color: 'text-amber-400' },
      { value: '24/7', label: 'Help desk coverage', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Enterprise mobility lifecycle',
    capabilities: [
      { icon: '📱', title: 'Device Procurement', description: 'Source, configure, and ship devices globally with standardized imaging and asset tagging.' },
      { icon: '📦', title: 'Logistics Management', description: 'Warehousing, kitting, shipping, and returns management for distributed enterprises.' },
      { icon: '📊', title: 'Inventory & Usage Audit', description: 'Real-time visibility into device status, carrier plans, usage patterns, and cost anomalies.' },
      { icon: '🎧', title: 'Help Desk & Support', description: 'Multi-tier support for device issues, carrier escalations, and user onboarding/offboarding.' }
    ],
    testimonials: []
  },

  'pots-replacement': {
    kicker: 'Solution · POTS Replacement',
    title: 'POTS',
    titleAccent: 'Replacement',
    description: 'Protect your network from critical outages by migrating legacy analog voice services (POTS) to modern, cost-effective LTE or VoIP-based digital solutions.',
    kpis: [
      { value: '60%', label: 'Cost reduction', color: 'text-emerald-400' },
      { value: 'LTE', label: 'Wireless alternative', color: 'text-sky-400' },
      { value: '0', label: 'Copper dependency', color: 'text-amber-400' },
      { value: 'E911', label: 'Life safety compliant', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Why replace POTS now?',
    capabilities: [
      { icon: '⚠️', title: 'Copper Sunset', description: 'Major carriers are actively decommissioning copper infrastructure. Reliability and repair times are degrading rapidly.' },
      { icon: '💰', title: 'Cost Escalation', description: 'Legacy POTS line prices have increased 100%+ in many markets. Modern alternatives offer the same function at 40-60% lower cost.' },
      { icon: '🏥', title: 'Life Safety Systems', description: 'Elevators, fire panels, alarms, and security systems require compliant migration paths that maintain E911 and monitoring services.' },
      { icon: '🔌', title: 'Zero Disruption Migration', description: 'Port existing numbers, maintain service continuity, and cutover with minimal downtime using certified POTS-in-a-Box devices.' }
    ],
    testimonials: []
  },

  'managed-services': {
    kicker: 'Solution · Managed Services (MSP)',
    title: 'Technology Lifecycle',
    titleAccent: 'Managed Services',
    description: 'Extend your IT team with a global managed service provider for network operations, carrier management, MACD coordination, and continuous optimization.',
    kpis: [
      { value: '24/7', label: 'Service desk', color: 'text-emerald-400' },
      { value: 'MACD', label: 'Moves, adds, changes', color: 'text-sky-400' },
      { value: 'Global', label: 'Multi-country ops', color: 'text-amber-400' },
      { value: 'SLA', label: 'Performance monitoring', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Full lifecycle support',
    capabilities: [
      { icon: '🎫', title: 'MACD Management', description: 'Centralized ticketing for all moves, adds, changes, and disconnects across carriers and locations.' },
      { icon: '📡', title: 'Carrier Management', description: 'Single point of contact for multi-carrier environments. Escalation management and vendor coordination.' },
      { icon: '📊', title: 'Performance Monitoring', description: 'Proactive circuit monitoring, SLA tracking, and outage notification with automated carrier escalation.' },
      { icon: '💳', title: 'Bill Pay & Expense Validation', description: 'Streamline technology expense payments, reduce overhead, and ensure uninterrupted services across your portfolio.' }
    ],
    testimonials: []
  },

  'colocation-data-center': {
    kicker: 'Solution · Colocation & Data Center',
    title: 'Colocation &',
    titleAccent: 'Data Center',
    description: 'Source colocation, cabinets, power, cross-connects, and cloud on-ramps while aligning facility selection with carrier density, metro, and redundancy strategy.',
    kpis: [
      { value: 'N+1', label: 'Power redundancy', color: 'text-emerald-400' },
      { value: 'Tier III', label: 'Facility standards', color: 'text-sky-400' },
      { value: '100+', label: 'Carrier-neutral options', color: 'text-amber-400' },
      { value: 'PUE', label: 'Efficiency metrics', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Data center services',
    capabilities: [
      { icon: '🏢', title: 'Colocation Sourcing', description: 'Evaluate carrier neutrality, provider density, cloud adjacency, and power capacity across global markets.' },
      { icon: '🔌', title: 'Cross-Connects', description: 'Physical and virtual cross-connect provisioning between carriers, cloud providers, and enterprise equipment.' },
      { icon: '☁️', title: 'Cloud On-Ramps', description: 'Direct, low-latency access to AWS, Azure, GCP, and Oracle Cloud via in-facility meet-me rooms.' },
      { icon: '🏗️', title: 'Hybrid Architecture', description: 'Balance on-prem, colo, and cloud footprints for performance, compliance, cost, and disaster recovery requirements.' }
    ],
    testimonials: []
  },

  /* ─── COMPANY ─────────────────────────────────────────────── */

  'about-us': {
    kicker: 'Company · About',
    title: 'About',
    titleAccent: 'EarthConnect',
    description: 'EarthConnect is built for enterprise IT, procurement, and finance teams that want a more transparent way to understand connectivity availability, pricing ranges, and provider fit by address — globally.',
    kpis: [
      { value: '190+', label: 'Countries covered', color: 'text-emerald-400' },
      { value: '1,200+', label: 'Carrier integrations', color: 'text-sky-400' },
      { value: 'Type-1', label: 'Address-first sourcing', color: 'text-amber-400' },
      { value: 'Neutral', label: 'Operator independent', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Our approach',
    capabilities: [
      { icon: '🌍', title: 'Address Intelligence', description: 'We combine geocoding, country-level coverage data, and node-based price benchmarking to give buyers real context before they engage carriers.' },
      { icon: '🤝', title: 'Operator Neutral', description: 'We are not a carrier, reseller, or aggregator. Our incentive is helping you find the best provider at the best price for each site.' },
      { icon: '🔄', title: 'Full Lifecycle', description: 'From sourcing through inventory, expense, and renewal — we support the entire telecom service lifecycle, not just the initial quote.' },
      { icon: '🔒', title: 'Enterprise Security', description: 'GDPR compliant, corporate-only access gating, and structured lead workflows designed for B2B procurement environments.' }
    ],
    testimonials: [
      { quote: 'EarthConnect changed how we approach multi-country telecom sourcing. Having pricing context before we even start negotiations is invaluable.', role: 'Chief Technology Officer', company: 'Global Manufacturing, 200+ sites' }
    ]
  },

  'contact-us': {
    kicker: 'Company · Contact',
    title: 'Talk to Our',
    titleAccent: 'Specialists',
    description: 'Reach out about sourcing telecom services, benchmarking incumbent spend, inventory clean-up, multi-site transformation, or any connectivity challenge.',
    kpis: [
      { value: '<2h', label: 'Response time', color: 'text-emerald-400' },
      { value: 'B2B', label: 'Corporate workflow', color: 'text-sky-400' },
      { value: 'GDPR', label: 'Compliant intake', color: 'text-amber-400' },
      { value: 'Global', label: 'Multi-language support', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'How we can help',
    capabilities: [
      { icon: '🔍', title: 'Site Qualification', description: 'Check provider availability and estimated pricing for any address worldwide before committing to a procurement cycle.' },
      { icon: '📊', title: 'Spend Benchmarking', description: 'Compare your current telecom costs against local market ranges to identify optimization opportunities.' },
      { icon: '🔄', title: 'Network Transformation', description: 'Plan multi-site migrations, technology upgrades, and carrier consolidation with lifecycle methodology support.' },
      { icon: '📋', title: 'Inventory Audit', description: 'Clean up your circuit inventory, reconcile contracts, and establish a digital system of record for ongoing governance.' }
    ],
    testimonials: []
  },

  'earthconnect-faq': {
    kicker: 'Company · Platform FAQ',
    title: 'EarthConnect',
    titleAccent: 'FAQ',
    description: 'Understand how EarthConnect geocodes addresses, estimates pricing ranges, handles coverage logic, validates corporate leads, and prepares deployment-ready insights.',
    kpis: [
      { value: 'Photon', label: 'OSM geocoding engine', color: 'text-emerald-400' },
      { value: 'PostGIS', label: 'Spatial pricing model', color: 'text-sky-400' },
      { value: 'P10–P60', label: 'Percentile price range', color: 'text-amber-400' },
      { value: 'KNN', label: 'Nearest-node algorithm', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'How it works',
    capabilities: [
      { icon: '📍', title: 'Address Resolution', description: 'Photon geocoding normalizes global addresses into coordinates, extracting city, country, and administrative boundary data.' },
      { icon: '📊', title: 'Spatial Pricing', description: 'PostGIS finds the 10 closest infrastructure nodes for each technology and calculates P10-P60 price percentiles for realistic market ranges.' },
      { icon: '🌍', title: 'Coverage Validation', description: 'Coverage-based services (5G, satellite) are validated by country, provider scope, and supported SLA languages.' },
      { icon: '🔒', title: 'Lead Gating', description: 'Magic-link and corporate email validation protect high-value B2B workflows. Free email domains are rejected.' }
    ],
    testimonials: []
  },

  'telecom-faq': {
    kicker: 'Company · Telecom FAQ',
    title: 'Telecom',
    titleAccent: 'Buyer Guide',
    description: 'Practical explanations of DIA, broadband, MPLS, SD-WAN, dark fiber, 5G, satellite, voice, colocation, and cybersecurity for enterprise buyers.',
    kpis: [
      { value: '12+', label: 'Service categories', color: 'text-emerald-400' },
      { value: 'B2B', label: 'Enterprise focus', color: 'text-sky-400' },
      { value: 'SLA', label: 'Contract guidance', color: 'text-amber-400' },
      { value: 'Global', label: 'Multi-country context', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Service comparison',
    capabilities: [
      { icon: '⬆️', title: 'DIA vs Broadband', description: 'DIA is uncontended and SLA-backed; broadband is cost-efficient but shared. Choose based on application criticality and budget.' },
      { icon: '🔄', title: 'MPLS vs SD-WAN', description: 'MPLS provides strict QoS and private routing; SD-WAN offers policy-based flexibility and internet transport. They often coexist.' },
      { icon: '🔌', title: 'Dark Fiber vs Wavelength', description: 'Dark fiber gives full optical control; wavelength services are managed and faster to deploy. Choice depends on scale and timeline.' },
      { icon: '🛰️', title: 'LEO vs GEO Satellite', description: 'LEO offers low latency and high throughput; GEO provides broader regional coverage at higher latency and lower cost.' }
    ],
    testimonials: []
  },

  'lifecycle-methodology': {
    kicker: 'Company · Methodology',
    title: 'Technology Lifecycle',
    titleAccent: 'Optimization',
    description: 'Our operating model follows a proven lifecycle: design, source, implement, operate, and optimize. Not just quote and forget — continuous improvement across your global connectivity estate.',
    kpis: [
      { value: 'Design', label: 'Architecture & fit', color: 'text-emerald-400' },
      { value: 'Source', label: 'Procurement & pricing', color: 'text-sky-400' },
      { value: 'Operate', label: 'Inventory & MACD', color: 'text-amber-400' },
      { value: 'Optimize', label: 'Expense & renewal', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Five-stage methodology',
    capabilities: [
      { icon: '📐', title: 'Design', description: 'Start with architecture, service fit, and technology selection aligned to business requirements and risk posture.' },
      { icon: '🔍', title: 'Source', description: 'Automated RFP, type-1 provider identification, pricing intelligence, and transparent carrier comparison per site.' },
      { icon: '🚀', title: 'Implement', description: 'Track implementation milestones, manage carrier escalations, and ensure delivery timelines are met.' },
      { icon: '🎫', title: 'Operate', description: 'Maintain inventory, process MACDs, manage carriers, and monitor SLA performance from a single platform.' },
      { icon: '💰', title: 'Optimize', description: 'Continuous expense validation, renewal rebidding, variance analysis, and market-rate benchmarking.' }
    ],
    testimonials: []
  },

  /* ─── RESOURCES ───────────────────────────────────────────── */

  'case-studies': {
    kicker: 'Resources · Case Studies',
    title: 'Customer',
    titleAccent: 'Stories',
    description: 'Explore real-world enterprise outcomes including multi-country provider consolidation, branch upgrades, wireless savings, and global bandwidth transformation.',
    kpis: [
      { value: '$2M+', label: 'Annual savings (Knauf)', color: 'text-emerald-400' },
      { value: '$3M', label: 'Cost reduction (Wiley)', color: 'text-sky-400' },
      { value: '40+', label: 'Sites transformed', color: 'text-amber-400' },
      { value: '90+', label: 'Providers consolidated', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Featured case studies',
    capabilities: [
      { icon: '🏭', title: 'Global Manufacturer', description: 'Achieved $2M+ in annual savings amid IT network enhancement across manufacturing facilities in Europe and North America.' },
      { icon: '📚', title: 'Publishing Enterprise', description: 'Global network transformation across 40 sites achieving dramatic bandwidth increases and $3M in cost reduction.' },
      { icon: '💊', title: 'Pharmaceutical Brand', description: 'Successfully consolidated a fragmented connectivity portfolio across 90+ international providers into a managed service model.' },
      { icon: '🏪', title: 'Multinational Retailer', description: 'Recovered over $19K in monthly network expenses by consolidating wireless services and optimizing mobile spend.' },
      { icon: '🚚', title: 'Supply Chain Logistics', description: 'Consolidated a multi-vendor network to streamline operational efficiencies for a Germany-based logistics company.' },
      { icon: '🏦', title: 'Investment Bank', description: 'Enhanced global connectivity and managed service support for multi-billion dollar financial operations worldwide.' }
    ],
    testimonials: [
      { quote: 'During quoting, the platform uses pricing data to negotiate down before I even see the quotes. On average, we saved 25% on circuit procurement across the board.', role: 'CEO', company: 'Campus Technologies Inc' }
    ]
  },

  'market-briefs': {
    kicker: 'Resources · Market Briefs',
    title: 'Market',
    titleAccent: 'Intelligence',
    description: 'Condensed advisory content on SD-WAN, SASE, AI-powered connectivity, private 5G, telecom lifecycle strategy, and enterprise digital transformation.',
    kpis: [
      { value: '10+', label: 'Published briefs', color: 'text-emerald-400' },
      { value: 'PDF', label: 'Downloadable format', color: 'text-sky-400' },
      { value: 'C-Suite', label: 'Executive audience', color: 'text-amber-400' },
      { value: 'Free', label: 'Open access', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Featured publications',
    capabilities: [
      { icon: '🤖', title: 'AI-Powered Connectivity', description: 'How to assess and harness AI within your technology stacks and worldwide network operations.' },
      { icon: '🏥', title: 'Private & Hybrid 5G Networks', description: 'Guide for healthcare IT decision-makers on new connectivity technologies and their enterprise use cases.' },
      { icon: '🔒', title: 'SASE Adoption Guide', description: 'Considerations for the next evolution in SD-WAN services and how SASE protects the corporate network.' },
      { icon: '🔄', title: 'Post-M&A Network Rationalization', description: 'Prepare for large-scale changes in communication technology environments after mergers and acquisitions.' }
    ],
    testimonials: []
  },

  'blog': {
    kicker: 'Resources · Blog',
    title: 'The',
    titleAccent: 'Connection',
    description: 'Telecom market analysis, buying guides, country-by-country connectivity insights, bandwidth pricing perspectives, and enterprise network strategy.',
    kpis: [
      { value: 'Weekly', label: 'New content', color: 'text-emerald-400' },
      { value: 'SEO', label: 'Search-optimized', color: 'text-sky-400' },
      { value: 'Global', label: 'Multi-market coverage', color: 'text-amber-400' },
      { value: 'Free', label: 'Open access', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Featured topics',
    capabilities: [
      { icon: '💰', title: 'DIA Pricing Guide 2025', description: 'Comprehensive guide to dedicated internet access pricing by market, bandwidth tier, and provider type.' },
      { icon: '🛰️', title: 'LEO Satellite for Enterprise', description: 'When Starlink Business makes sense, what to expect from OneWeb, and how to evaluate satellite backup strategies.' },
      { icon: '📊', title: 'Bulk Procurement Principles', description: 'Does bulk procurement of internet or WAN circuits yield savings? Sourcing principles and best practices.' },
      { icon: '🔄', title: 'SD-WAN Migration Playbook', description: 'Step-by-step methodology for transitioning from MPLS to SD-WAN with hybrid coexistence guidance.' }
    ],
    testimonials: []
  },

  'events': {
    kicker: 'Resources · Events',
    title: 'Industry',
    titleAccent: 'Events',
    description: 'Join enterprise connectivity sessions focused on sourcing strategy, telecom operations, technology lifecycle planning, and market trends.',
    kpis: [
      { value: 'Live', label: 'Interactive sessions', color: 'text-emerald-400' },
      { value: 'Virtual', label: 'Global access', color: 'text-sky-400' },
      { value: 'Expert', label: 'Industry speakers', color: 'text-amber-400' },
      { value: 'Free', label: 'Registration', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Event formats',
    capabilities: [
      { icon: '🎤', title: 'Procurement Workshops', description: 'Hands-on sessions covering RFP automation, type-1 sourcing strategy, and carrier negotiation tactics.' },
      { icon: '🤝', title: 'Customer Roundtables', description: 'Peer discussions with enterprise network leaders sharing sourcing experiences and operational improvements.' },
      { icon: '📡', title: 'Technology Briefings', description: 'Deep dives into SD-WAN, SASE, LEO satellite, 5G, and other evolving connectivity technologies.' },
      { icon: '🌍', title: 'Regional Market Updates', description: 'Country and region-specific connectivity landscape updates, carrier changes, and regulatory developments.' }
    ],
    testimonials: []
  },

  'webinars': {
    kicker: 'Resources · Webinars',
    title: 'On-Demand',
    titleAccent: 'Webinars',
    description: 'Training for network, procurement, operations, and finance teams managing telecom complexity across countries and providers.',
    kpis: [
      { value: '20+', label: 'Sessions available', color: 'text-emerald-400' },
      { value: '45min', label: 'Average duration', color: 'text-sky-400' },
      { value: 'On-demand', label: 'Watch anytime', color: 'text-amber-400' },
      { value: 'CPE', label: 'Credits available', color: 'text-fuchsia-400' }
    ],
    capabilitiesTitle: 'Featured webinars',
    capabilities: [
      { icon: '💰', title: 'How to Benchmark DIA Pricing', description: 'Learn to use spatial percentile data to evaluate whether your DIA circuits are priced competitively by market.' },
      { icon: '🛰️', title: 'When to Use LEO Satellite', description: 'Decision framework for evaluating Starlink Business, OneWeb, and traditional VSAT for enterprise backup and remote access.' },
      { icon: '📋', title: 'Building a Network Inventory Program', description: 'Step-by-step guide to establishing a digital system of record for your enterprise telecom services.' },
      { icon: '🔄', title: 'Telecom Expense Automation', description: 'Eliminate manual invoice processing, billing errors, and missed payments with AI-native expense management workflows.' }
    ],
    testimonials: []
  }
};

/* ================================================================
   COMPONENT
   ================================================================ */

const anim = (d: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: d } });

export const MarketingPage: React.FC = () => {
  const { slug = 'about-us', lang = 'en' } = useParams();
  const page = pages[slug] || pages['about-us'];
  const homePath = lang === 'es' ? '/es' : '/en';

  useEffect(() => {
    document.title = `${page.title} ${page.titleAccent || ''} | EarthConnect`.trim();
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = page.description;
    window.scrollTo(0, 0);
  }, [page, slug]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
        <motion.div {...anim(0)}>
          <div className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-8">
            <span className="h-px w-8 bg-zinc-700" />
            {page.kicker}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl" style={{ fontStyle: 'italic' }}>
            {page.title}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
              {page.titleAccent}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mb-10">
            {page.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={homePath} className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-transparent text-white px-6 py-3 text-sm font-bold hover:bg-zinc-900 transition-colors">
              Check site availability <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to={`${homePath}/company/contact-us`} className="inline-flex items-center gap-2 rounded-full border border-zinc-800 text-zinc-400 px-6 py-3 text-sm font-bold hover:text-white hover:border-zinc-700 transition-colors">
              Talk to an expert
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── KPI ROW ───────────────────────────────────────── */}
      <section className="border-y border-zinc-800/60 py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {page.kpis.map((kpi, i) => (
            <motion.div key={i} {...anim(0.05 * i)}>
              <div className={`text-4xl md:text-5xl font-black tracking-tight ${kpi.color || 'text-white'}`} style={{ fontStyle: 'italic' }}>
                {kpi.value}
              </div>
              <div className="text-xs text-zinc-500 mt-2 font-medium tracking-wide">{kpi.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CAPABILITIES ──────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div {...anim(0)} className="mb-12">
          {page.capabilitiesTitle && (
            <>
              <div className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-4">
                <span className="h-px w-8 bg-zinc-700" />
                Core Capabilities
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{page.capabilitiesTitle}</h2>
            </>
          )}
          {page.capabilitiesSubtitle && (
            <p className="text-zinc-500 max-w-3xl leading-relaxed">{page.capabilitiesSubtitle}</p>
          )}
        </motion.div>

        {/* Two-column layout if sampleTable exists */}
        {page.sampleTable ? (
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              {page.capabilities.map((cap, i) => (
                <motion.div key={i} {...anim(0.04 * i)} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg shrink-0">{cap.icon}</div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{cap.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{cap.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div {...anim(0.1)} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-4">{page.sampleTable.title}</div>
              <div className="space-y-0 divide-y divide-zinc-800/60">
                {page.sampleTable.rows.map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-3 gap-4">
                    <span className="text-xs text-zinc-500 shrink-0">{row.label}</span>
                    <span className={`text-sm font-medium text-right ${row.accent ? 'text-sky-400' : 'text-zinc-200'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.capabilities.map((cap, i) => (
              <motion.div
                key={i}
                {...anim(0.04 * i)}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-lg mb-4">{cap.icon}</div>
                <h3 className="font-bold text-white mb-2 text-sm">{cap.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{cap.description}</p>
                {cap.bullets && cap.bullets.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {cap.bullets.map((b, j) => (
                      <li key={j} className="text-xs text-sky-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-sky-400 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ─── CONTENT / WHY IT MATTERS ──────────────────────── */}
      {page.contentTitle && (
        <section className="py-20 px-6 border-t border-zinc-800/60">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            <motion.div {...anim(0)}>
              <div className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-4">
                <span className="h-px w-8 bg-zinc-700" />
                Why It Matters
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{page.contentTitle}</h2>
              {page.contentDescription?.split('\n\n').map((p, i) => (
                <p key={i} className="text-zinc-400 leading-relaxed mb-4 text-sm">{p}</p>
              ))}
              {page.contentBlocks && (
                <ul className="space-y-2 mt-6">
                  {page.contentBlocks.map((block, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      {block.title}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            {page.useCases && (
              <div className="space-y-4">
                {page.useCases.map((uc, i) => {
                  const accentMap: Record<string, string> = {
                    emerald: 'border-emerald-500/30 bg-emerald-500/5',
                    red: 'border-red-500/30 bg-red-500/5',
                    sky: 'border-sky-500/30 bg-sky-500/5',
                    amber: 'border-amber-500/30 bg-amber-500/5',
                    fuchsia: 'border-fuchsia-500/30 bg-fuchsia-500/5'
                  };
                  const accentLabel: Record<string, string> = {
                    emerald: 'text-emerald-400', red: 'text-red-400', sky: 'text-sky-400', amber: 'text-amber-400', fuchsia: 'text-fuchsia-400'
                  };
                  const cls = accentMap[uc.accent || 'sky'] || accentMap.sky;
                  const lblCls = accentLabel[uc.accent || 'sky'] || accentLabel.sky;
                  return (
                    <motion.div key={i} {...anim(0.06 * i)} className={`rounded-2xl border p-5 ${cls}`}>
                      <div className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 ${lblCls}`}>{uc.accent === 'emerald' ? 'Optimal' : uc.accent === 'red' ? 'Costly' : uc.title}</div>
                      <h3 className="font-bold text-white mb-2">{uc.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{uc.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── USE CASES (standalone, no contentTitle) ────────── */}
      {!page.contentTitle && page.useCases && page.useCases.length > 0 && (
        <section className="py-20 px-6 border-t border-zinc-800/60">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-4">
              <span className="h-px w-8 bg-zinc-700" />
              {page.useCasesTitle || 'Use Cases'}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {page.useCases.map((uc, i) => {
                const accentMap: Record<string, string> = { sky: 'border-sky-500/30 bg-sky-500/5', emerald: 'border-emerald-500/30 bg-emerald-500/5', amber: 'border-amber-500/30 bg-amber-500/5', fuchsia: 'border-fuchsia-500/30 bg-fuchsia-500/5', red: 'border-red-500/30 bg-red-500/5' };
                return (
                  <motion.div key={i} {...anim(0.06 * i)} className={`rounded-2xl border p-5 ${accentMap[uc.accent || 'sky']}`}>
                    <h3 className="font-bold text-white mb-2">{uc.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{uc.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ──────────────────────────────────── */}
      {page.testimonials && page.testimonials.length > 0 && (
        <section className="py-20 px-6 border-t border-zinc-800/60">
          <div className="max-w-6xl mx-auto">
            <motion.div {...anim(0)} className="mb-10">
              <div className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-4">
                <span className="h-px w-8 bg-zinc-700" />
                Customer Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Trusted by global enterprises
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-4">
              {page.testimonials.map((t, i) => (
                <motion.div key={i} {...anim(0.06 * i)} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <div className="text-3xl text-zinc-700 font-serif mb-3">"</div>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-6 italic">{t.quote}</p>
                  <div>
                    <div className="font-bold text-white text-sm">{t.role}</div>
                    <div className="text-xs text-zinc-500">{t.company}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA BANNER ────────────────────────────────────── */}
      <section className="mx-6 mb-16">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/40 py-16 px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to check connectivity at your site?
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Enter any address worldwide and instantly see available providers, price ranges, and coverage — DIA, MPLS, 5G, satellite and more.
          </p>
          <Link to={homePath} className="inline-flex items-center gap-2 rounded-full bg-white text-zinc-950 px-8 py-4 text-sm font-bold hover:scale-[1.02] transition-transform shadow-lg">
            Check Address Availability <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
