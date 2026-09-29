import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Analyzing investigation data...' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200">
    <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
    <p className="text-sm font-medium text-slate-700">{message}</p>
    <p className="text-xs text-slate-400 mt-1">Executing multi-layer telemetry & graph queries</p>
  </div>
);

export const EmptyState = ({ title = 'No records found', description = 'Try adjusting your filters or search terms.', icon: Icon, actionButton }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
    {Icon ? (
      <div className="p-3 bg-slate-100 rounded-full text-slate-500 mb-3">
        <Icon className="w-6 h-6" />
      </div>
    ) : null}
    <h4 className="text-sm font-bold text-slate-800">{title}</h4>
    <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
    {actionButton && <div className="mt-4">{actionButton}</div>}
  </div>
);
