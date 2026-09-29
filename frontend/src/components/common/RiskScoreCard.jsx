import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import RiskBadge from './RiskBadge';

export const RiskScoreCard = ({ 
  score = 91, 
  level = 'HIGH',
  breakdown = {
    behaviour: 85,
    velocity: 95,
    network: 92,
    amount: 70,
    historicalDeviation: 88,
  },
  showBreakdown = true,
  summaryText = 'Potentially suspicious transaction activity detected based on composite risk signals.'
}) => {
  // Circular gauge calculations
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 90) return '#991B1B'; // Critical dark red
    if (val >= 70) return '#EF4444'; // High red
    if (val >= 40) return '#F59E0B'; // Medium orange
    return '#10B981'; // Low green
  };

  const ringColor = getScoreColor(score);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Automated Risk Assessment</span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">Composite Risk Score</h3>
        </div>
        <RiskBadge level={level} size="lg" />
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 110 110">
            <circle
              cx="55"
              cy="55"
              r={radius}
              className="text-slate-100"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke={ringColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900">{score}</span>
            <span className="text-xs text-slate-500 font-medium">/ 100</span>
          </div>
        </div>

        {/* Textual summary & key flags */}
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {summaryText}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Velocity Spike
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Cyclic Routing
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <Info className="w-3.5 h-3.5 text-indigo-600" /> Multi-hop Layering
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 italic">
            *Final investigation determination remains with the authorized human investigator.
          </p>
        </div>
      </div>

      {/* Multi-Signal Breakdown Bars */}
      {showBreakdown && (
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Risk Signal Component</span>
            <span>Index / Score</span>
          </div>

          {[
            { label: 'Transaction Velocity (25%)', val: breakdown.velocity || 95, color: 'bg-red-500' },
            { label: 'Network Connectivity (20%)', val: breakdown.network || 92, color: 'bg-red-500' },
            { label: 'Behavioural Deviation (30%)', val: breakdown.behaviour || 85, color: 'bg-red-500' },
            { label: 'Amount Anomaly (15%)', val: breakdown.amount || 70, color: 'bg-amber-500' },
            { label: 'Historical Deviation (10%)', val: breakdown.historicalDeviation || 88, color: 'bg-red-500' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="font-medium">{item.label}</span>
                <span className="font-bold text-slate-800">{item.val}/100</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskScoreCard;
