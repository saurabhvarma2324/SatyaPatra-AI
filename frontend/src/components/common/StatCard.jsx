import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'sky', subtitle }) => {
  const colorSchemes = {
    sky: 'border-sky-500/20 bg-gradient-to-b from-sky-950/20 to-slate-900/40 text-sky-400',
    rose: 'border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-slate-900/40 text-rose-400',
    amber: 'border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-slate-900/40 text-amber-400',
    emerald: 'border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-900/40 text-emerald-400',
    purple: 'border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-slate-900/40 text-purple-400',
  };

  const iconBg = {
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className={`p-5 rounded-xl border ${colorSchemes[color] || colorSchemes.sky} backdrop-blur-sm transition-all duration-200 hover:border-opacity-50`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${iconBg[color] || iconBg.sky}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
        {trend && (
          <span className={`inline-flex items-center text-xs font-semibold ${trend > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      {(subtitle || trendLabel) && (
        <p className="mt-1 text-xs text-slate-400">{subtitle || trendLabel}</p>
      )}
    </div>
  );
};

export default StatCard;
