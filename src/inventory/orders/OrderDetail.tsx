import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Wifi, DollarSign, ShoppingCart, ArrowLeft,
  Building2, User, Calendar, Mail, Phone, Globe
} from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { useInventoryData, formatCurrencyFull } from '../data/useInventoryData';

const subNavItems = [
  { label: 'Overview', key: 'overview' },
  { label: 'Contracts', key: 'contracts' },
  { label: 'Documents', key: 'documents' },
  { label: 'Locations', key: 'locations' },
  { label: 'Services', key: 'services' },
  { label: 'Timeline', key: 'timeline' },
];

export const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, services } = useInventoryData();
  const [activeTab, setActiveTab] = useState('overview');

  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-slate-700">Order not found</h2>
        <Link to="/inventory/orders" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Back to orders
        </Link>
      </div>
    );
  }

  const completedMrc = order.status === 'completed' ? order.expectedMrc : 0;

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Header */}
      <div>
        <Link to="/inventory/orders" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Orders
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900">{order.name}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{order.orderId} — {order.company}</p>
      </div>

      <div className="flex gap-5 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Locations
              </div>
              <div className="text-2xl font-bold text-slate-900">{order.locations.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
                <Wifi className="w-3.5 h-3.5" />
                Services
              </div>
              <div className="text-2xl font-bold text-slate-900">{order.services}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                Completed MRC
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrencyFull(completedMrc)}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
                <ShoppingCart className="w-3.5 h-3.5" />
                Total MRC
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrencyFull(order.expectedMrc)}</div>
            </div>
          </div>

          {/* Sub-nav */}
          <div className="border-b border-slate-200">
            <div className="flex gap-1">
              {subNavItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
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
              {/* Description */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-sm font-semibold text-slate-800">Order Description</h3>
                </div>
                <div className="p-5">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">Order Type</dt>
                      <dd className="font-medium text-slate-800">{order.description.orderType}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">PR #</dt>
                      <dd className="font-medium text-slate-800">{order.description.prNumber}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">HubSpot Deal</dt>
                      <dd className="font-medium text-blue-600 hover:underline cursor-pointer">{order.description.hubspotLink}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">Client</dt>
                      <dd className="font-medium text-slate-800">{order.description.client}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">Provider</dt>
                      <dd className="font-medium text-slate-800">{order.description.provider}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">Service Details</dt>
                      <dd className="font-medium text-slate-800">{order.description.serviceDetails}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">Term</dt>
                      <dd className="font-medium text-slate-800">{order.description.term}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">Handoff & Connector</dt>
                      <dd className="font-medium text-slate-800">{order.description.handoffConnector}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <dt className="text-slate-500">IP Requirements</dt>
                      <dd className="font-medium text-slate-800">{order.description.ipRequirements}</dd>
                    </div>
                    <div className="md:col-span-2 flex justify-between py-2">
                      <dt className="text-slate-500">Description</dt>
                      <dd className="font-medium text-slate-800 text-right max-w-md">{order.description.orderDescription}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Locations table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-sm font-semibold text-slate-800">Location Information</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Location Name</th>
                        <th className="px-5 py-3 font-semibold">Address</th>
                        <th className="px-5 py-3 font-semibold">LCON</th>
                        <th className="px-5 py-3 font-semibold text-right">MRC</th>
                        <th className="px-5 py-3 font-semibold text-right">NRC</th>
                        <th className="px-5 py-3 font-semibold">Last Mile</th>
                        <th className="px-5 py-3 font-semibold">GSD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.locations.map(loc => (
                        <tr key={loc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-800">{loc.name}</td>
                          <td className="px-5 py-3 text-slate-600">{loc.address}</td>
                          <td className="px-5 py-3 text-blue-600 hover:underline cursor-pointer">{loc.lconEmail}</td>
                          <td className="px-5 py-3 text-right font-medium text-slate-800">{formatCurrencyFull(loc.mrc)}</td>
                          <td className="px-5 py-3 text-right text-slate-600">{formatCurrencyFull(loc.nrc)}</td>
                          <td className="px-5 py-3 text-slate-600">{loc.lastMile}</td>
                          <td className="px-5 py-3 text-slate-500 font-mono text-xs">{loc.globalServiceDesk}</td>
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
              <p className="text-sm">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon.</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-72 shrink-0 space-y-4 hidden xl:block">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Customer
            </div>
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-slate-800">{order.sidebar.customerName}</div>
              <div className="text-slate-500">{order.sidebar.customerAddress}</div>
              <a href={order.sidebar.customerWebsite} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <Globe className="w-3 h-3" />
                Website
              </a>
            </div>
          </div>

          {/* Provisioner */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-3">
              <User className="w-3.5 h-3.5" />
              Provisioner
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                {order.provisioner.initials}
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-sm">{order.provisioner.name}</div>
                <div className="text-xs text-slate-500">{order.provisioner.role}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <a href={`mailto:${order.provisioner.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                <Mail className="w-3 h-3" />
                {order.provisioner.email}
              </a>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Phone className="w-3 h-3" />
                {order.provisioner.phone}
              </div>
            </div>
          </div>

          {/* Created By */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">
              <User className="w-3.5 h-3.5" />
              Created By
            </div>
            <div className="text-sm font-medium text-slate-800">{order.createdBy}</div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Dates
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Created</dt>
                <dd className="font-medium text-slate-800">{order.sidebar.createdDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Est. Start</dt>
                <dd className="font-medium text-slate-800">{order.sidebar.estimatedStartDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Est. End</dt>
                <dd className="font-medium text-slate-800">{order.sidebar.estimatedEndDate}</dd>
              </div>
              {order.sidebar.completedDate && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Completed</dt>
                  <dd className="font-medium text-emerald-700">{order.sidebar.completedDate}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
