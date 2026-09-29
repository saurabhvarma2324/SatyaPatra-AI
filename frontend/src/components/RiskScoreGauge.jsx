import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const RiskScoreGauge = ({ score = 0, level = 'LOW', size = 'md' }) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine color theme
  let color = '#10b981'; // green
  let bgColor = 'bg-emerald-500/10';
  let textColor = 'text-emerald-400';
  let borderColor = 'border-emerald-500/30';
  let Icon = ShieldCheck;
  let levelLabel = 'LOW RISK';

  if (clampedScore >= 70 || level === 'HIGH') {
    color = '#ef4444'; // red
    bgColor = 'bg-rose-500/10';
    textColor = 'text-rose-400';
    borderColor = 'border-rose-500/30';
    Icon = ShieldAlert;
    levelLabel = 'HIGH RISK';
  } else if (clampedScore >= 35 || level === 'MEDIUM') {
    color = '#f59e0b'; // amber
    bgColor = 'bg-amber-500/10';
    textColor = 'text-amber-400';
    borderColor = 'border-amber-500/30';
    Icon = AlertTriangle;
    levelLabel = 'MEDIUM RISK';
  }

  // Calculate SVG arc parameters
  const radius = size === 'sm' ? 32 : 48;
  const strokeWidth = size === 'sm' ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  // Use 75% arc (semi-circle + curve)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className={`flex items-center gap-4 p-3.5 rounded-2xl ${bgColor} border ${borderColor}`}>
      {/* Radial SVG Gauge */}
      <div className="relative flex items-center justify-center">
        <svg width={svgSize} height={svgSize} className="transform -rotate-135">
          {/* Background Arc */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="transparent"
            stroke="#334155"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-black ${size === 'sm' ? 'text-base' : 'text-2xl'} ${textColor}`}>
            {clampedScore}
          </span>
          <span className="text-[9px] uppercase font-bold text-slate-400 -mt-1">/ 100</span>
        </div>
      </div>

      {/* Level description */}
      <div>
        <div className="flex items-center gap-1.5">
          <Icon className={`w-4 h-4 ${textColor}`} />
          <span className={`text-xs font-extrabold tracking-wider uppercase ${textColor}`}>
            {levelLabel}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {clampedScore < 35
            ? 'Documents match criteria with low fraud probability.'
            : clampedScore < 70
            ? 'Moderate flags detected. Officer cross-examination advised.'
            : 'Critical discrepancies or duplicate flags require strict review.'}
        </p>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
