import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Users,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Send,
  Printer,
  ChevronRight,
  User,
  Clock,
  RotateCcw,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import RiskBadge from '../components/common/RiskBadge';
import RiskScoreCard from '../components/common/RiskScoreCard';
import RiskIndicatorCard from '../components/common/RiskIndicatorCard';
import TransactionTable from '../components/tables/TransactionTable';
import NetworkGraph from '../components/graph/NetworkGraph';
import Timeline from '../components/common/Timeline';
import AIAnalysisPanel from '../components/ai/AIAnalysisPanel';
import Toast from '../components/common/Toast';

export const CaseInvestigationPage = () => {
  const { caseId = 'CASE-1042' } = useParams();
  const navigate = useNavigate();
  const { getCaseById, getTransactionsForCase, updateCaseStatus, updateCaseNotes } = useData();

  const currentCase = getCaseById(caseId) || {
    id: caseId,
    caseNumber: caseId,
    primaryAccount: 'ACC-10082',
    accountName: 'Apex Global Logistics Pvt Ltd',
    riskScore: 91,
    riskLevel: 'HIGH',
    status: 'Under Investigation',
    assignedInvestigator: 'Demo Investigator',
    createdAt: new Date().toISOString(),
    transactionCount: 42,
    totalVolume: 4250000,
    description: 'High-frequency structured outbound transfers with rapid multi-hop dispersion and potential circular flow.',
    indicatorsCount: 5,
    notes: 'Initial graph analysis confirms rapid fan-out layering into ACC-10211 and ACC-10542. Account holder contacted for documentation verification.',
  };

  const caseTransactions = getTransactionsForCase(currentCase.id, currentCase.primaryAccount);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'network' | 'transactions' | 'timeline' | 'assistant'
  const [investigatorNotes, setInvestigatorNotes] = useState(currentCase.notes || '');
  const [toastMessage, setToastMessage] = useState(null);

  // Indicators for this case
  const indicators = currentCase.indicators || [
    { id: 'IND-1', type: 'Transaction Velocity', severity: 'HIGH', value: '42 tx / 24h (+320%)', description: 'Transaction frequency is significantly higher than historical baseline of 3 tx/day.' },
    { id: 'IND-2', type: 'Network Connectivity', severity: 'HIGH', value: '14 connected nodes', description: 'Multi-tier clustering with rapid pass-through dispersion.' },
    { id: 'IND-3', type: 'Behavioural Deviation', severity: 'HIGH', value: 'Z-Score +3.84', description: 'Multiple off-hours transfers executed between 01:00-04:00 AM.' },
    { id: 'IND-4', type: 'Amount Anomaly', severity: 'MEDIUM', value: '₹85K - ₹98.5K bands', description: 'Repetitive structured amounts clustering just below monitoring thresholds.' },
    { id: 'IND-5', type: 'New Account Relationship', severity: 'HIGH', value: '5 new links < 48h', description: 'Immediate fund transfers to counter-parties created within past 30 days.' },
  ];

  // Actions
  const handleStatusChange = (newStatus) => {
    updateCaseStatus(currentCase.id, newStatus);
    setToastMessage(`Case status updated to ${newStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveNotes = () => {
    updateCaseNotes(currentCase.id, investigatorNotes);
    setToastMessage('Investigation notes saved successfully');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Flagship Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                {currentCase.id}
              </span>
              <RiskBadge level={currentCase.riskLevel} score={currentCase.riskScore} size="lg" />
              <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded-md">
                Status: <strong className="text-white">{currentCase.status}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              {currentCase.accountName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">Primary Account:</span>
                <span className="font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {currentCase.primaryAccount}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-slate-400">Lead Investigator:</span>
                <span className="font-semibold text-white">{currentCase.assignedInvestigator}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleStatusChange('Under Investigation')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentCase.status === 'Under Investigation'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Start Investigation</span>
            </button>

            <button
              onClick={() => handleStatusChange('Escalated')}
              className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Escalate</span>
            </button>

            <button
              onClick={() => handleStatusChange('Resolved')}
              className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mark Reviewed</span>
            </button>

            <button
              onClick={() => navigate(`/reports/${currentCase.id}`)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-900/40 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: 'Case Dossier & Summary' },
            { id: 'network', label: 'Network Graph Studio' },
            { id: 'transactions', label: `Transactions (${caseTransactions.length})` },
            { id: 'timeline', label: 'Chronological Timeline' },
            { id: 'assistant', label: 'Artha AI Assistant' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* SECTION A: RISK SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RiskScoreCard
                score={currentCase.riskScore}
                level={currentCase.riskLevel}
                breakdown={{
                  behaviour: 85,
                  velocity: 95,
                  network: 92,
                  amount: 70,
                  historicalDeviation: 88,
                }}
                summaryText="Potentially suspicious activity detected across multiple connected accounts and off-hours velocity spikes."
              />
            </div>

            {/* Quick Context Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Investigation Synopsis</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Preliminary Assessment</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {currentCase.description}
                </p>
              </div>

              <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-brand-900 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" /> Key Investigation Trigger
                </span>
                <p className="text-brand-800 text-[11px]">
                  Immediate circular flow identified returning funds from ACC-10900 back to ACC-10082 within 58 minutes.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('assistant')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Open Artha AI Copilot</span>
              </button>
            </div>
          </div>

          {/* SECTION B: RISK INDICATORS */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Detected Risk Indicators</h3>
                <p className="text-xs text-slate-500">Heuristic and statistical triggers contributing to the composite risk score</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-mono font-medium">
                {indicators.length} Signals Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indicators.map((ind, i) => (
                <RiskIndicatorCard key={i} indicator={ind} />
              ))}
            </div>
          </div>

          {/* SECTION C: TRANSACTION SUMMARY METRICS */}
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">Transaction Volume Summary</h3>
              <p className="text-xs text-slate-500">Aggregated telemetry for connected counterparty flows</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Total Transactions</span>
                <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">42 txs</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Total Volume</span>
                <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">₹42.50L</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Incoming Volume</span>
                <span className="text-xl font-bold text-emerald-600 font-mono mt-1 block">₹16.50L</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Outgoing Volume</span>
                <span className="text-xl font-bold text-rose-600 font-mono mt-1 block">₹26.00L</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Avg. Transaction</span>
                <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">₹1.01L</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Unique Accounts</span>
                <span className="text-xl font-bold text-brand-600 font-mono mt-1 block">6 Nodes</span>
              </div>
            </div>
          </div>

          {/* Embedded Mini Graph & AI Teaser */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Network Flow Topology</h4>
                <button
                  onClick={() => setActiveTab('network')}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                >
                  Full Graph Studio &rarr;
                </button>
              </div>
              <NetworkGraph primaryAccountId={currentCase.primaryAccount} />
            </div>

            <div className="space-y-6">
              <AIAnalysisPanel
                caseData={currentCase}
                onApplyNotes={(draft) => {
                  setInvestigatorNotes(prev => prev ? `${prev}\n\n${draft}` : draft);
                  setToastMessage('Artha AI synthesis inserted into notes!');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
              />

              {/* Investigator Notes Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Human Investigator Notes</h4>
                  <span className="text-xs text-slate-400">Formal examination log</span>
                </div>
                <textarea
                  rows="4"
                  value={investigatorNotes}
                  onChange={(e) => setInvestigatorNotes(e.target.value)}
                  placeholder="Record your manual case findings, customer responses, or rationale..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Formal Notes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION D: TRANSACTION TABLE */}
          <TransactionTable
            transactions={caseTransactions}
            title="Associated Case Transactions"
            highlightAccountId={currentCase.primaryAccount}
          />
        </div>
      )}

      {/* TAB 2: NETWORK GRAPH STUDIO */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Multi-Hop Network Graph Analysis</h3>
              <p className="text-xs text-slate-500">Directed multi-entity transaction routing and circular loop detection</p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900"
            >
              &larr; Back to Dossier
            </button>
          </div>
          <NetworkGraph primaryAccountId={currentCase.primaryAccount} />
        </div>
      )}

      {/* TAB 3: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <TransactionTable
            transactions={caseTransactions}
            title={`Full Transaction History for Case ${currentCase.id}`}
            highlightAccountId={currentCase.primaryAccount}
          />
        </div>
      )}

      {/* TAB 4: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Chronological Event & Flow Timeline</h3>
            <p className="text-xs text-slate-500">Ordered sequence of fund movements, velocity bursts, and investigator actions</p>
          </div>
          <Timeline events={caseTransactions} />
        </div>
      )}

      {/* TAB 5: ARTHA AI ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="space-y-6">
          <AIAnalysisPanel
            caseData={currentCase}
            onApplyNotes={(draft) => {
              setInvestigatorNotes(prev => prev ? `${prev}\n\n${draft}` : draft);
              setToastMessage('Artha AI synthesis inserted into notes!');
              setTimeout(() => setToastMessage(null), 3000);
            }}
          />
        </div>
      )}

      {/* Toast feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default CaseInvestigationPage;
