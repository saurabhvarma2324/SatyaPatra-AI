import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Copy, AlertOctagon } from 'lucide-react';

const DuplicateAlertBanner = ({ duplicateFlags = [] }) => {
  if (!duplicateFlags || duplicateFlags.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {duplicateFlags.map((flag, idx) => {
        const isCritical = flag.severity === 'CRITICAL';
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              isCritical
                ? 'bg-red-500/10 border-red-500/40 text-red-300'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'} shrink-0 mt-0.5`}>
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30">
                    {flag.type?.replace(/_/g, ' ') || 'POTENTIAL DUPLICATE FRAUD'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    Severity: {flag.severity || 'HIGH'}
                  </span>
                </div>
                <p className="text-xs mt-1 font-medium text-slate-200">
                  {flag.message}
                </p>
              </div>
            </div>

            {/* Link to Conflicting Application */}
            {flag.conflictingApplicationId && (
              <Link
                to={`/applications/${flag.conflictingApplicationId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0 whitespace-nowrap self-start md:self-center"
              >
                <span>View Conflict (App #{flag.conflictingApplicationNumber || 'Dossier'})</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DuplicateAlertBanner;
