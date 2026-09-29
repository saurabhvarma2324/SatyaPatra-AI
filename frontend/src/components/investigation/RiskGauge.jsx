import React from 'react';

export const RiskGauge = ({ score = 0, level = 'LOW', confidence = 0.95, threatType = 'Phishing' }) => {
  const normScore = Math.max(0, Math.min(100, score));

  // Determine colors
  let strokeColor = '#10b981'; // safe
  let glowColor = 'rgba(16, 185, 129, 0.2)';
  if (normScore > 75) {
    strokeColor = '#ef4444'; // critical
    glowColor = 'rgba(239, 68, 68, 0.3)';
  } else if (normScore > 50) {
    strokeColor = '#f97316'; // high
    glowColor = 'rgba(249, 115, 22, 0.25)';
  } else if (normScore > 25) {
    strokeColor = '#f59e0b'; // medium
    glowColor = 'rgba(245, 158, 11, 0.2)';
  }

  // Circular gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normScore / 100) * circumference;

  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center text-center">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        AI Threat Assessment Score
      </span>

      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#1e293b"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
              filter: `drop-shadow(0 0 8px ${glowColor})`
            }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-3xl font-black text-white tracking-tight">
            {normScore}
          </span>
          <span className="text-[11px] font-mono uppercase text-slate-400">/ 100</span>
        </div>
      </div>

      <div className="w-full pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase text-slate-500 block">Threat Classification</span>
          <span className="font-bold text-white mt-0.5 block truncate">{threatType}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase text-slate-500 block">Model Confidence</span>
          <span className="font-mono font-bold text-cyan-400 mt-0.5 block">{Math.round(confidence * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
