import React from 'react';
import { Activity, Network, TrendingUp, DollarSign, UserCheck, AlertCircle } from 'lucide-react';
import RiskBadge from './RiskBadge';

export const RiskIndicatorCard = ({ indicator }) => {
  const { type, severity, value, description } = indicator;

  const getIcon = (typeStr) => {
    const lower = (typeStr || '').toLowerCase();
    if (lower.includes('velocity')) return Activity;
    if (lower.includes('network') || lower.includes('connected')) return Network;
    if (lower.includes('behaviour') || lower.includes('deviation')) return TrendingUp;
    if (lower.includes('amount') || lower.includes('structuring')) return DollarSign;
    if (lower.includes('account') || lower.includes('relationship')) return UserCheck;
    return AlertCircle;
  };

  const Icon = getIcon(type);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-50 text-brand-700 rounded-lg border border-brand-100">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{type}</h4>
            <span className="text-xs text-slate-500 font-mono">{value}</span>
          </div>
        </div>
        <RiskBadge level={severity} size="sm" />
      </div>

      <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
        {description}
      </p>
    </div>
  );
};

export default RiskIndicatorCard;
