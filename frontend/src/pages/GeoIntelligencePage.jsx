import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, Server, MapPin, ShieldAlert, ArrowRight, Info } from 'lucide-react';
import { geoAPI } from '../services/api';
import { GeoMap } from '../components/geo/GeoMap';
import { RiskBadge } from '../components/common/RiskBadge';

export const GeoIntelligencePage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    geoAPI.getAllGeo()
      .then(res => {
        if (res.data?.locations) setLocations(res.data.locations);
      })
      .catch(err => console.warn('Error loading geo data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-cyan-400" />
          <span>Global Network Geo Intelligence</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Geographic routing and Autonomous System (ASN) distribution of originating relays across investigated incidents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Leaflet Map (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <GeoMap locations={locations} height="600px" />
        </div>

        {/* Right Column: Identified Relay Hops List */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4 flex flex-col h-[600px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Identified Network Hops ({locations.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Autonomous Systems</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {locations.map((loc, idx) => (
              <div
                key={idx}
                onClick={() => loc.caseId && navigate(`/cases/${loc.caseId}?tab=geo`)}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-sky-400">{loc.ip}</span>
                  <RiskBadge level={loc.risk} size="sm" showScore={false} />
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium text-white">{loc.city}, {loc.country}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Server className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{loc.isp}</span>
                  </div>
                  {loc.asn && (
                    <div className="text-[10px] font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 mt-1">
                      {loc.asn}
                    </div>
                  )}
                  {loc.caseId && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Case: {loc.caseId}</span>
                      <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoIntelligencePage;
