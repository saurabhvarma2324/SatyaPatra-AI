import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Globe, Server, ShieldAlert, MapPin, Info } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

// Create custom leaflet marker icon
const createCustomIcon = (risk = 'SUSPICIOUS') => {
  let color = '#f59e0b'; // amber
  if (risk === 'CRITICAL') color = '#ef4444';
  else if (risk === 'HIGH') color = '#f97316';
  else if (risk === 'SAFE' || risk === 'LOW') color = '#10b981';

  return L.divIcon({
    className: 'custom-geo-marker',
    html: `
      <div style="
        position: relative;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          background-color: ${color}33;
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          background-color: ${color};
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px ${color};
          z-index: 2;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Center updater
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

export const GeoMap = ({ locations = [], height = '450px' }) => {
  const defaultCenter = locations.length > 0 && locations[0].lat && locations[0].lng
    ? [locations[0].lat, locations[0].lng]
    : [52.3676, 4.9041]; // Amsterdam default

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col" style={{ height }}>
      {/* Top Banner */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="font-bold uppercase tracking-wider text-slate-200">
            Network Geolocation Map ({locations.length} Hops Identified)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-500/20">
          <Info className="w-3 h-3" />
          <span>Approximate network/geographic location</span>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={defaultCenter}
          zoom={locations.length > 1 ? 3 : 5}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="dark-tiles"
          />
          <MapController center={defaultCenter} zoom={locations.length > 1 ? 3 : 5} />

          {locations.map((loc, idx) => {
            if (!loc.lat || !loc.lng) return null;
            return (
              <Marker
                key={idx}
                position={[loc.lat, loc.lng]}
                icon={createCustomIcon(loc.risk)}
              >
                <Popup className="cyber-popup">
                  <div className="p-1 space-y-2 min-w-[220px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                      <span className="font-mono text-xs font-bold text-sky-400">{loc.ip}</span>
                      <RiskBadge level={loc.risk} size="sm" showScore={false} />
                    </div>

                    <div className="text-xs space-y-1 text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{loc.city}, {loc.country}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Server className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{loc.isp || 'Hosting Provider'}</span>
                      </div>
                      {loc.asn && (
                        <div className="text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                          {loc.asn}
                        </div>
                      )}
                      {loc.caseId && (
                        <div className="text-[10px] text-slate-400 pt-1">
                          Related Case: <span className="font-mono text-sky-400">{loc.caseId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default GeoMap;
