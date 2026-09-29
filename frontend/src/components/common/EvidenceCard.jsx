import React from 'react';
import { AlertCircle, ShieldAlert, Link2, Server, Key, FileWarning, HelpCircle } from 'lucide-react';

export const EvidenceCard = ({ reason, index }) => {
  const getIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('url') || lower.includes('link')) return Link2;
    if (lower.includes('domain') || lower.includes('host') || lower.includes('asn') || lower.includes('ip')) return Server;
    if (lower.includes('auth') || lower.includes('spf') || lower.includes('dkim') || lower.includes('dmarc')) return Key;
    if (lower.includes('attachment') || lower.includes('executable') || lower.includes('scr') || lower.includes('macro')) return FileWarning;
    if (lower.includes('nlp') || lower.includes('phishing') || lower.includes('malware') || lower.includes('suspicious')) return ShieldAlert;
    return AlertCircle;
  };

  const cleanText = reason.replace(/^\[!\]\s*/, '');
  const isHighAlert = reason.startsWith('[!]') || reason.toLowerCase().includes('phishing') || reason.toLowerCase().includes('failed');
  const Icon = getIcon(cleanText);

  return (
    <div className={`flex items-start gap-3.5 p-3.5 rounded-lg border transition-all ${
      isHighAlert 
        ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
        : 'bg-slate-900/60 border-slate-800 text-slate-200'
    }`}>
      <div className={`p-2 rounded-md shrink-0 ${
        isHighAlert ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
      }`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Indicator #{index + 1}
          </span>
          {isHighAlert && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
              High Anomaly
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium leading-relaxed text-slate-200">
          {cleanText}
        </p>
      </div>
    </div>
  );
};

export default EvidenceCard;
