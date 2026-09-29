import React from 'react';
import { Clock, ArrowUpRight, ArrowDownLeft, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import RiskBadge from './RiskBadge';

export const Timeline = ({ events = [] }) => {
  if (!events.length) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        No chronological timeline events recorded for this case.
      </div>
    );
  }

  const formatTime = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + d.toLocaleDateString() + ')';
    } catch (e) {
      return ts;
    }
  };

  return (
    <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 space-y-6">
      {events.map((event, idx) => {
        const isFlagged = event.status === 'Flagged' || event.riskScore >= 70;
        return (
          <div key={idx} className="relative group">
            {/* Timeline node icon */}
            <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
              isFlagged ? 'border-red-500 text-red-600 ring-4 ring-red-50' : 'border-brand-600 text-brand-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isFlagged ? 'bg-red-500' : 'bg-brand-600'}`} />
            </div>

            {/* Event content box */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm group-hover:border-brand-200 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">{event.id || `EVENT-${idx + 1}`}</span>
                  {event.riskScore && (
                    <RiskBadge level={event.riskScore >= 90 ? 'CRITICAL' : event.riskScore >= 70 ? 'HIGH' : event.riskScore >= 40 ? 'MEDIUM' : 'LOW'} score={event.riskScore} size="sm" />
                  )}
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(event.timestamp)}
                </span>
              </div>

              <div className="mt-2 text-sm text-slate-800">
                {event.senderAccount && event.receiverAccount ? (
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{event.senderAccount}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{event.receiverAccount}</span>
                    <span className="font-bold text-slate-900 ml-auto text-sm font-sans">
                      ₹{event.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : (
                  <p className="font-medium text-slate-900">{event.action || event.title}</p>
                )}
              </div>

              {event.description && (
                <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
