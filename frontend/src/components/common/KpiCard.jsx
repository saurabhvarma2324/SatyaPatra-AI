import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export const KpiCard = ({ title, value, change, isPositive, subtext, icon: Icon, color = 'brand', onClick }) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  const iconBg = colorMap[color] || colorMap.brand;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-brand-300' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {change && (
          <span className={`inline-flex items-center text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
          {subtext}
        </p>
      )}
    </div>
  );
};

export default KpiCard;
