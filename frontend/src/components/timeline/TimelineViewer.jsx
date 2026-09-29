import React from 'react';
import { Clock, ShieldAlert, FileText, CheckCircle2, UserCheck, Search, Globe, AlertCircle } from 'lucide-react';

export const TimelineViewer = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-500">
        <Clock className="w-6 h-6 mx-auto text-slate-600 mb-2 opacity-60" />
        No timeline telemetry recorded for this case.
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'EMAIL_RECEIVED':
        return { icon: Clock, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' };
      case 'EMAIL_PARSED':
        return { icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' };
      case 'IOC_EXTRACTED':
        return { icon: Search, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
      case 'INTEL_ENRICHED':
        return { icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' };
      case 'THREAT_SCORED':
        return { icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
      case 'INVESTIGATOR_REVIEW':
      case 'INVESTIGATOR_NOTE':
        return { icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      default:
        return { icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' };
    }
  };

  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
        <Clock className="w-4 h-4 text-cyan-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Forensic Incident & Investigation Timeline ({events.length} Events)
        </h4>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((evt, idx) => {
          const config = getEventIcon(evt.eventType);
          const Icon = config.icon;

          return (
            <div key={evt.id || idx} className="relative group">
              {/* Dot Icon */}
              <div className={`absolute -left-6 top-0.5 p-1.5 rounded-full border ${config.bg} shadow-md z-10 transition-transform group-hover:scale-110`}>
                <Icon className={`w-3 h-3 ${config.color}`} />
              </div>

              {/* Event Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white font-mono">{evt.title || evt.eventType}</span>
                  <span className="text-[11px] font-mono text-slate-400">{evt.timestamp}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {evt.description}
                </p>
                {evt.source && (
                  <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Source: <span className="text-slate-400">{evt.source}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineViewer;
