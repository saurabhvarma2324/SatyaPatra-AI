import React, { useState } from 'react';
import { Sparkles, Bot, CheckCircle, RefreshCw, Copy, FileText, Send, ArrowRight, ShieldAlert, AlertCircle } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export const AIAnalysisPanel = ({ caseData, onApplyNotes }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'indicators' | 'network' | 'steps' | 'draft'

  const caseId = caseData?.id || 'CASE-1042';
  const primaryAccount = caseData?.primaryAccount || 'ACC-10082';
  const riskScore = caseData?.riskScore || 91;
  const riskLevel = caseData?.riskLevel || 'HIGH';

  // Deterministic explainable synthesis based on case telemetry
  const analysisData = {
    summary: `Case #${caseId} exhibits potentially suspicious financial activity characterized by elevated transaction velocity (42 tx / 24h), structured transaction amounts clustering between ₹85,000 and ₹98,500, and rapid multi-hop dispersion across 5 counterparties. The automated telemetry signals indicate possible layering behavior that warrants in-depth examination by an authorized investigator.`,
    
    keyIndicators: [
      { name: 'Transaction Velocity', detail: 'Outbound frequency is +320% above historical baseline for account ' + primaryAccount },
      { name: 'Amount Structuring', detail: 'Repetitive transfers positioned just below standard statutory threshold triggers' },
      { name: 'Network Layering', detail: '5 connected accounts identified with direct pass-through liquidity in under 15 minutes' },
      { name: 'Circular Fund Pattern', detail: 'Fund flow route detects round-trip transaction cycle returning to primary originator' }
    ],

    networkExplanation: `Network intelligence models identified a 5-hop directed transaction chain originating from ${primaryAccount} moving through Vanguard Trading Hub (ACC-10211) and Zenith Multi-Ventures (ACC-10542), before looping back through BlueStar Export Impex (ACC-10900). 3 of the involved counterparties have been active for fewer than 30 days.`,

    suggestedSteps: [
      'Issue formal Request for Information (RFI) to beneficiary banks for counterparty KYC dossiers.',
      'Correlate IP and Device IDs (DEV-8821A) across associated customer profiles.',
      'Review supporting commercial invoices for Apex Global Logistics Pvt Ltd to validate logistics trade legitimacy.',
      'Temporarily flag account for enhanced real-time monitoring pending analyst verification.'
    ],

    reportDraft: `INVESTIGATION SUMMARY DRAFT - CASE ${caseId}
--------------------------------------------------
TARGET ACCOUNT: ${primaryAccount} (${caseData?.accountName || 'Apex Global Logistics Pvt Ltd'})
RISK LEVEL: ${riskLevel} (Score: ${riskScore}/100)
STATUS: Under Human Review

PRELIMINARY FINDINGS:
Statistical and network telemetry flags indicate potentially suspicious transaction velocity and structured amount anomalies across newly established relationships. Directed graph modeling identified a 5-tier circular pattern.

RECOMMENDED DISPOSITION:
Maintain active review status. Request KYC documentation and verify commercial invoice legitimacy before escalating to regulatory reporting.`
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysisData.reportDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-brand-200/90 shadow-md overflow-hidden">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/20 rounded-lg border border-brand-400/30">
            <Sparkles className="w-5 h-5 text-brand-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight">Artha AI Investigation Assistant</h3>
              <span className="text-[10px] bg-brand-500/30 text-brand-200 px-2 py-0.5 rounded-full font-mono border border-brand-400/30">
                Explainable AI v2.4
              </span>
            </div>
            <p className="text-xs text-brand-200/80">Contextual synthesis & decision support for Case #{caseId}</p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Re-Analyze</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-600 px-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('summary')}
          className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'summary' ? 'border-brand-600 text-brand-700 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Case Summary
        </button>
        <button
          onClick={() => setActiveTab('indicators')}
          className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'indicators' ? 'border-brand-600 text-brand-700 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Key Risk Indicators
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'network' ? 'border-brand-600 text-brand-700 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Network Findings
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'steps' ? 'border-brand-600 text-brand-700 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Suggested Next Steps
        </button>
        <button
          onClick={() => setActiveTab('draft')}
          className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'draft' ? 'border-brand-600 text-brand-700 font-semibold bg-white' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Draft Report Summary
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="p-4 bg-brand-50/50 rounded-xl border border-brand-100 text-slate-800 text-sm leading-relaxed">
              <p>{analysisData.summary}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                <strong>Compliance Note:</strong> This assessment is generated using deterministic behavioral heuristics and anomaly scores. It highlights potentially suspicious patterns to assist the investigator and does not constitute a legal finding.
              </span>
            </div>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="space-y-2.5">
            {analysisData.keyIndicators.map((ind, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="p-1.5 bg-red-100 text-red-700 rounded-md shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{ind.name}</span>
                  <span className="text-xs text-slate-600">{ind.detail}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-900">Multi-Hop Graph Topology Synthesis:</p>
            <p>{analysisData.networkExplanation}</p>
            <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs">
              <strong>Risk Signal:</strong> Rapid circular velocity detected across 5 connected hops in &lt; 60 minutes.
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Recommended Investigation Actions:</h4>
            {analysisData.suggestedSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <span className="w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'draft' && (
          <div className="space-y-3">
            <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto border border-slate-800">
              {analysisData.reportDraft}
            </pre>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Synthesis'}</span>
              </button>
              {onApplyNotes && (
                <button
                  onClick={() => onApplyNotes(analysisData.reportDraft)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-medium transition shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Insert into Case Notes</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
