import React from 'react';
import { Printer, ShieldCheck, ShieldAlert, FileText, CheckCircle2, User, Clock, AlertOctagon } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';

export const ReportDossier = ({ caseData, threatData, emailData, iocs = [], timeline = [] }) => {
  const handlePrint = () => {
    window.print();
  };

  const caseId = caseData?.caseId || 'CASE-2026-001';
  const title = caseData?.title || 'Suspicious Email Investigation';
  const investigatorName = caseData?.investigatorName || 'Dr. Alok Verma';
  const riskScore = threatData?.riskScore ?? caseData?.riskScore ?? 0;
  const threatType = threatData?.threatType || caseData?.threatType || 'Phishing';
  const threatLevel = threatData?.riskLevel || caseData?.threatLevel || 'HIGH';
  const confidence = threatData?.confidence || caseData?.confidence || 0.95;
  const reasons = threatData?.reasons || [];
  const notes = caseData?.notes || [];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Official Forensic Investigation Report
          </h3>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Report Document Container */}
      <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl space-y-6 print:p-0 print:border-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b-2 border-slate-700 pb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xl tracking-tight text-white print:text-black">MAILDRISHTI AI</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 print:border print:border-black font-mono">
                FORENSIC REPORT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 italic print:text-slate-600">
              "From Suspicious Email to Explainable Forensic Intelligence" &bull; Financial & Cyber Forensic Intelligence
            </p>
          </div>

          <div className="text-right text-xs space-y-1 font-mono">
            <div>Case Dossier: <span className="font-bold text-cyan-400 print:text-black">{caseId}</span></div>
            <div className="text-slate-400 print:text-slate-600">Date: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Section 1: Case Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-slate-100 print:border-slate-300 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Case Subject</span>
            <span className="font-semibold text-white print:text-black block truncate">{title}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Lead Investigator</span>
            <span className="font-semibold text-white print:text-black block">{investigatorName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Threat Classification</span>
            <span className="font-bold text-rose-400 print:text-black block">{threatType}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Investigation Verdict</span>
            <StatusBadge status={caseData?.status || 'UNDER_INVESTIGATION'} />
          </div>
        </div>

        {/* Section 2: AI Threat Score & Assessment */}
        <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 pb-2">
            1. Automated AI Threat Assessment
          </h4>
          <div className="flex items-center gap-6">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Risk Score</span>
              <span className="font-mono text-2xl font-black text-rose-400 print:text-black">{riskScore}/100</span>
              <span className="text-[10px] uppercase text-rose-400 block font-bold font-mono mt-0.5">{threatLevel}</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Model: <strong className="text-white print:text-black">TF-IDF Vectorizer + Logistic Regression Classifier</strong></div>
              <div>Confidence: <strong className="text-cyan-400 print:text-black font-mono">{Math.round(confidence * 100)}%</strong></div>
              <div className="text-[11px] text-slate-400 italic">
                AI Assessment: The subject email was evaluated through NLP pattern classification and Isolation Forest anomaly analysis.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Explainable Evidence & Flags */}
        <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 pb-2">
            2. Primary Threat Evidence & Contributing Factors
          </h4>
          <ul className="space-y-1.5 text-xs">
            {reasons.length > 0 ? (
              reasons.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 print:text-black">
                  <span className="text-rose-400 font-bold">&bull;</span>
                  <span>{r.replace(/^\[!\]\s*/, '')}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400">No abnormal threat indicators flagged.</li>
            )}
          </ul>
        </div>

        {/* Section 4: Indicators of Compromise (IOC) */}
        <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 pb-2">
            3. Indicators of Compromise (IOC) Summary
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Indicator Value</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {iocs.slice(0, 8).map((ioc, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="py-2 text-slate-400 uppercase font-bold">{ioc.type}</td>
                    <td className="py-2 text-white print:text-black truncate max-w-xs">{ioc.value}</td>
                    <td className="py-2 text-slate-400">{ioc.source}</td>
                    <td className="py-2 font-bold text-rose-400">{ioc.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Investigator Notes & Conclusion */}
        <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-slate-800 pb-2">
            4. Investigator Triage Notes & Case Remarks
          </h4>
          {notes.length > 0 ? (
            <div className="space-y-2">
              {notes.map((n, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>{n.author}</span>
                    <span>{new Date(n.timestamp).toLocaleString()}</span>
                  </div>
                  <p>{n.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No custom investigator notes appended to this dossier.</p>
          )}
        </div>

        {/* Document Sign-off Block */}
        <div className="pt-6 border-t-2 border-slate-700 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-500 block">Official Evidentiary Status</span>
            <span className="font-bold text-white print:text-black">
              {caseData?.status?.replace('_', ' ') || 'UNDER INVESTIGATION'}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              AI-assisted assessment. Requires investigator verification.
            </p>
          </div>

          <div className="text-right border-t border-slate-600 pt-2 min-w-[200px]">
            <span className="text-[10px] uppercase text-slate-400 block">Authorized Forensic Sign-Off</span>
            <span className="font-bold text-cyan-400 print:text-black block mt-1">{investigatorName}</span>
            <span className="text-[10px] text-slate-400 block">SOC Cyber Forensic Division</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDossier;
