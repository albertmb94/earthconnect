import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Eye, EyeOff, Building2, MapPin, Mail, Phone, Globe,
  Wifi, Router, Cable, Network
} from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { useInventoryData, formatCurrencyFull } from '../data/useInventoryData';

const subNavItems = [
  { label: 'Overview', key: 'overview' },
  { label: 'Contracts', key: 'contracts' },
  { label: 'Cost Centers', key: 'cost-centers' },
  { label: 'Documents', key: 'documents' },
  { label: 'Orders', key: 'orders' },
  { label: 'Related Services', key: 'related' },
  { label: 'Tickets', key: 'tickets' },
  { label: 'Timeline', key: 'timeline' },
];

export const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { services, locations } = useInventoryData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEmptyValues, setShowEmptyValues] = useState(false);

  const service = services.find(s => s.id === serviceId);
  const location = locations.find(l => l.id === service?.locationId);

  if (!service) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-slate-700">Service not found</h2>
        <Link to="/inventory/services" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Back to services
        </Link>
      </div>
    );
  }

  const milestones = [
    { name: 'Order Accepted', projected: service.billActivationDate, actual: service.billActivationDate },
    { name: 'Delivery Date (FOC)', projected: service.completeDate, actual: service.completeDate },
    { name: 'Billing Activated', projected: service.billActivationDate, actual: service.billActivationDate },
    { name: 'Completed', projected: service.completeDate, actual: service.completeDate },
  ];

  const productAttributes = [
    { label: 'Bandwidth-Port', value: service.bandwidth },
    { label: 'Circuit ID', value: service.circuitId },
    { label: 'CPE Make/Model', value: service.cpeMakeModel },
    { label: 'Demarc Details', value: service.demarcDetails },
    { label: 'Fiber Connector Type', value: service.fiberConnectorType },
    { label: 'DNS Primary', value: service.ipDetails.dnsPrimary },
    { label: 'DNS Secondary', value: service.ipDetails.dnsSecondary },
    { label: 'Gateway', value: service.ipDetails.gateway },
    { label: 'Subnet', value: service.ipDetails.subnet },
    { label: 'Subnet Type', value: service.ipDetails.subnetType },
    { label: 'Address Qty', value: String(service.ipDetails.addressQty) },
    { label: 'Useable Range', value: service.ipDetails.useableRange },
    { label: 'Additional Info', value: service.ipDetails.additionalInfo },
    { label: 'Last Mile', value: service.lastMile },
  ];

  const visibleAttributes = showEmptyValues
    ? productAttributes
    : productAttributes.filter(a => a.value && String(a.value).trim() !== '');

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Header */}
      <div>
        <Link to="/inventory/services" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Services
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900">{service.name}</h1>
          <StatusBadge status={service.status} />
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{service.serviceId} — {service.provider}</p>
      </div>

      <div className="flex gap-5 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Service Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Service Details</h3>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-slate-500 mb-0.5">Service Name</dt>
                <dd className="font-medium text-slate-800">{service.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-0.5">Service Type</dt>
                <dd className="font-medium text-slate-800">{service.type}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-0.5">Billing Account</dt>
                <dd className="font-medium text-slate-800">{service.billingAccount}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-0.5">Service Provider ID</dt>
                <dd className="font-medium text-slate-800">{service.serviceProviderId}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-0.5">Agent Inventory</dt>
                <dd className="font-medium text-slate-800">{service.agentInventory ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-0.5">Managed Inventory</dt>
                <dd className="font-medium text-slate-800">{service.managedInventory ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-0.5">Site ID</dt>
                <dd className="font-medium text-slate-800">{service.siteId}</dd>
              </div>
            </dl>
          </div>

          {/* Sub-nav */}
          <div className="border-b border-slate-200">
            <div className="flex gap-1 overflow-x-auto">
              {subNavItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === item.key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Product Attributes */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Product Attributes</h3>
                  <button
                    onClick={() => setShowEmptyValues(!showEmptyValues)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {showEmptyValues ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showEmptyValues ? 'Hide empty' : 'Show empty values'}
                  </button>
                </div>
                <div className="p-5">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    {visibleAttributes.map((attr, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-slate-50">
                        <dt className="text-slate-500">{attr.label}</dt>
                        <dd className="font-medium text-slate-800 text-right max-w-[200px] truncate">{attr.value || '-'}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-sm font-semibold text-slate-800">Milestones</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3 font-semibold text-left">Name</th>
                        <th className="px-5 py-3 font-semibold text-left">Projected Date</th>
                        <th className="px-5 py-3 font-semibold text-left">Actual Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {milestones.map((m, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-800">{m.name}</td>
                          <td className="px-5 py-3 text-slate-600">{m.projected || '-'}</td>
                          <td className="px-5 py-3 text-slate-600">{m.actual || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <p className="text-sm">{activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} view coming soon.</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-72 shrink-0 space-y-4 hidden xl:block">
          {/* Provider */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-3">
              <Network className="w-3.5 h-3.5" />
              Provider
            </div>
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-slate-800">{service.provider}</div>
              <div className="text-slate-500">Global HQ</div>
              <div className="text-slate-500">support@gatewayglobal.com</div>
              <div className="text-slate-500">+1 800 555 0199</div>
            </div>
          </div>

          {/* Location */}
          {location && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-3">
                <MapPin className="w-3.5 h-3.5" />
                Location
              </div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-slate-800">{location.name}</div>
                <div className="text-slate-500">{location.address}</div>
                <div className="text-slate-500">{location.city}, {location.countryName}</div>
                <div className="text-slate-500 font-mono text-xs">{location.siteId}</div>
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Contact Details
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-1.5 text-blue-600 hover:underline cursor-pointer">
                <Mail className="w-3 h-3" />
                noc@gatewayglobal.com
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Phone className="w-3 h-3" />
                +1 800 555 0200
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 hover:underline cursor-pointer">
                <Globe className="w-3 h-3" />
                portal.gatewayglobal.com
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-3">
              <Wifi className="w-3.5 h-3.5" />
              Key Dates
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Bill Activation</dt>
                <dd className="font-medium text-slate-800">{service.billActivationDate || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Complete Date</dt>
                <dd className="font-medium text-slate-800">{service.completeDate || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Expiration</dt>
                <dd className="font-medium text-slate-800">{service.expirationDate || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
