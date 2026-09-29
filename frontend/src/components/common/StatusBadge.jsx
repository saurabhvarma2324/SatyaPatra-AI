import React from 'react';

export const StatusBadge = ({ status = 'UNDER_INVESTIGATION' }) => {
  const norm = String(status).toUpperCase();

  const configs = {
    UNDER_INVESTIGATION: {
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      dot: 'bg-sky-400 animate-pulse',
      label: 'Under Investigation'
    },
    CONFIRMED_THREAT: {
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-500',
      label: 'Confirmed Threat'
    },
    FALSE_POSITIVE: {
      bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
      dot: 'bg-slate-400',
      label: 'False Positive'
    },
    RESOLVED: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      label: 'Resolved'
    }
  };

  const current = configs[norm] || configs.UNDER_INVESTIGATION;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      <span>{current.label}</span>
    </span>
  );
};

export default StatusBadge;
