import React from 'react';
import { ShieldAlert, Mail, Search, Globe, Server, MapPin, ArrowRight } from 'lucide-react';

export const ConnectedIntelligenceFlow = ({ riskScore = 99, threatType = 'Phishing', iocCount = 7, domain = 'sample-login.test', ip = '203.0.113.10', location = 'Amsterdam, Netherlands' }) => {
  const steps = [
    {
      icon: ShieldAlert,
      title: `${riskScore}/100 Risk`,
      desc: threatType,
      color: riskScore > 75 ? 'rose' : (riskScore > 50 ? 'orange' : 'amber'),
      badge: 'AI Detection'
    },
    {
      icon: Mail,
      title: 'Email Parsed',
      desc: 'RFC 822 Forensic Decode',
      color: 'sky',
      badge: 'Ingestion'
    },
    {
      icon: Search,
      title: `${iocCount} Extracted IOCs`,
      desc: 'IPs, URLs, Hashes',
      color: 'amber',
      badge: 'Extraction'
    },
    {
      icon: Globe,
      title: domain || 'Domain Intel',
      desc: 'Typosquat & DNS',
      color: 'purple',
      badge: 'Enrichment'
    },
    {
      icon: Server,
      title: ip || 'Relay IP',
      desc: 'ASN & ISP Intel',
      color: 'indigo',
      badge: 'Network'
    },
    {
      icon: MapPin,
      title: location || 'Origin Location',
      desc: 'Approximate GeoIP',
      color: 'emerald',
      badge: 'Geolocation'
    }
  ];

  const colorStyles = {
    rose: 'border-rose-500/30 bg-rose-950/20 text-rose-400',
    orange: 'border-orange-500/30 bg-orange-950/20 text-orange-400',
    amber: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
    sky: 'border-sky-500/30 bg-sky-950/20 text-sky-400',
    purple: 'border-purple-500/30 bg-purple-950/20 text-purple-400',
    indigo: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-400',
    emerald: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400',
  };

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Connected Threat Intelligence Pipeline
          </h4>
        </div>
        <span className="text-[11px] font-mono text-cyan-400">
          "Don't just detect the threat &mdash; connect the evidence."
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative flex flex-col">
              <div className={`p-3 rounded-lg border ${colorStyles[step.color]} flex-1 flex flex-col justify-between transition-all hover:border-opacity-60`}>
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700/50 text-slate-300">
                      {step.badge}
                    </span>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-mono text-xs font-bold text-white truncate" title={step.title}>
                    {step.title}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectedIntelligenceFlow;
