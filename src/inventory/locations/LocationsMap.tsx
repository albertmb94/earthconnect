import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Ticket, FileText, ShoppingCart, Wifi, DollarSign, Building2,
  AlertTriangle, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { useInventoryData, formatCurrencyFull, formatNumber } from '../data/useInventoryData';
import type { InventoryLocation } from '../data/types';

// Fix Leaflet default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const activeIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'hue-rotate-180', // blue tint via CSS filter
});

const alertIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'hue-rotate-270', // red tint
});

interface MapBoundsProps {
  locations: InventoryLocation[];
}

const MapBounds: React.FC<MapBoundsProps> = ({ locations }) => {
  const map = useMap();
  React.useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, locations]);
  return null;
};

export const LocationsMap: React.FC = () => {
  const { locations, tickets, orders, services, contracts } = useInventoryData();
  const [filterOpen, setFilterOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const stats = useMemo(() => ({
    activeLocations: locations.filter(l => l.status === 'active').length,
    supportTickets: tickets.filter(t => t.status === 'open').length,
    expiringContracts: contracts.filter(c => c.status === 'active').length, // simplified
    openOrders: orders.filter(o => o.status === 'in-progress').length,
    activeServices: services.filter(s => s.status === 'active').length,
    currentSpend: services.reduce((s, svc) => s + svc.expectedMonthlySpend, 0),
    providers: new Set(services.map(s => s.provider)).size,
    alerts: locations.reduce((s, l) => s + l.alertCount, 0),
  }), [locations, tickets, contracts, orders, services]);

  const filteredLocations = useMemo(() => {
    if (!activeFilter) return locations;
    switch (activeFilter) {
      case 'tickets': return locations.filter(l => l.openTickets > 0);
      case 'alerts': return locations.filter(l => l.alertCount > 0);
      case 'orders': return locations.filter(l => orders.some(o => o.locations.some(ol => ol.address.includes(l.city)) && o.status === 'in-progress'));
      default: return locations;
    }
  }, [locations, activeFilter, orders]);

  const center = useMemo(() => {
    const lats = filteredLocations.map(l => l.lat);
    const lngs = filteredLocations.map(l => l.lng);
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
    ] as [number, number];
  }, [filteredLocations]);

  const filterItems = [
    { key: 'locations', label: 'Active Locations', value: stats.activeLocations, icon: <MapPin className="w-4 h-4" />, color: 'text-blue-600' },
    { key: 'tickets', label: 'Support Tickets', value: stats.supportTickets, icon: <Ticket className="w-4 h-4" />, color: 'text-red-600' },
    { key: 'contracts', label: 'Expiring Contracts', value: stats.expiringContracts, icon: <FileText className="w-4 h-4" />, color: 'text-amber-600' },
    { key: 'orders', label: 'Open Orders', value: stats.openOrders, icon: <ShoppingCart className="w-4 h-4" />, color: 'text-blue-600' },
    { key: 'services', label: 'Active Services', value: stats.activeServices, icon: <Wifi className="w-4 h-4" />, color: 'text-emerald-600' },
    { key: 'spend', label: 'Current Spend', value: `$${formatCurrencyFull(stats.currentSpend).replace('$', '')}`, icon: <DollarSign className="w-4 h-4" />, color: 'text-slate-700' },
    { key: 'providers', label: 'Providers', value: stats.providers, icon: <Building2 className="w-4 h-4" />, color: 'text-purple-600' },
    { key: 'alerts', label: 'Alerts', value: stats.alerts, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600' },
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] -m-6 relative">
      {/* Filter toggle */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      {/* Left panel */}
      {filterOpen && (
        <div className="absolute top-14 left-4 z-[1000] w-64 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-800">Location Filters</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {filterItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveFilter(activeFilter === item.key ? null : item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  activeFilter === item.key ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className={item.color}>{item.icon}</span>
                <span className="flex-1 text-left text-slate-700">{item.label}</span>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </button>
            ))}
          </div>
          {activeFilter && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setActiveFilter(null)}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds locations={filteredLocations} />
        {filteredLocations.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={loc.alertCount > 0 ? alertIcon : activeIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-slate-800 text-sm">{loc.name}</h4>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-full ring-1 ring-emerald-600/20">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{loc.address}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  {loc.alertCount > 0 && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                      {loc.alertCount} alert{loc.alertCount > 1 ? 's' : ''}
                    </div>
                  )}
                  {loc.openTickets > 0 && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Ticket className="w-3 h-3" />
                      {loc.openTickets} ticket{loc.openTickets > 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-slate-600">
                    <Wifi className="w-3 h-3" />
                    {loc.activeServices} services
                  </div>
                </div>
                <Link
                  to={`/inventory/services`}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  View Location Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
