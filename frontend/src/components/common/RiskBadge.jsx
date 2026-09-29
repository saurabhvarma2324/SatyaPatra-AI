import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

export const RiskBadge = ({ level = 'LOW', score, size = 'md', showScore = true }) => {
  const normLevel = String(level).toUpperCase();

  const configs = {
    SAFE: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
      label: 'SAFE'
    },
    LOW: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
      label: 'LOW RISK'
    },
    SUSPICIOUS: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      label: 'SUSPICIOUS'
    },
    MEDIUM: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      label: 'MEDIUM RISK'
    },
    HIGH: {
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      icon: AlertOctagon,
      label: 'HIGH THREAT'
    },
    CRITICAL: {
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-950/50',
      icon: Flame,
      label: 'CRITICAL THREAT'
    }
  };

  const current = configs[normLevel] || configs.SUSPICIOUS;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${current.bg} ${sizeClasses[size] || sizeClasses.md}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
      {showScore && score !== undefined && score !== null && (
        <span className="opacity-80 font-mono text-[11px] ml-0.5">({score}/100)</span>
      )}
    </span>
  );
};

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

export default RiskBadge;
