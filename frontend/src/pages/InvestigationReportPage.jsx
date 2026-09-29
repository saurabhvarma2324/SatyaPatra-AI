import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, Download, ArrowLeft, Shield, FileText, CheckCircle2, AlertTriangle, User, Calendar, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import RiskBadge from '../components/common/RiskBadge';

export const InvestigationReportPage = () => {
  const { caseId = 'CASE-1042' } = useParams();
  const navigate = useNavigate();
  const { getCaseById, getTransactionsForCase } = useData();

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
    indicators: [
      { id: 'IND-1', type: 'Transaction Velocity', severity: 'HIGH', value: '42 tx / 24h (+320%)', description: 'Transaction frequency is significantly higher than historical baseline of 3 tx/day.' },
      { id: 'IND-2', type: 'Network Connectivity', severity: 'HIGH', value: '14 connected nodes', description: 'Multi-tier clustering with rapid pass-through dispersion.' },
      { id: 'IND-3', type: 'Behavioural Deviation', severity: 'HIGH', value: 'Z-Score +3.84', description: 'Multiple off-hours transfers executed between 01:00-04:00 AM.' },
      { id: 'IND-4', type: 'Amount Anomaly', severity: 'MEDIUM', value: '₹85K - ₹98.5K bands', description: 'Repetitive structured amounts clustering just below monitoring thresholds.' },
      { id: 'IND-5', type: 'New Account Relationship', severity: 'HIGH', value: '5 new links < 48h', description: 'Immediate fund transfers to counter-parties created within past 30 days.' },
    ],
    notes: 'Initial graph analysis confirms rapid fan-out layering into ACC-10211 and ACC-10542. Account holder contacted for documentation verification.',
  };

  const caseTx = getTransactionsForCase(currentCase.id, currentCase.primaryAccount);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    // Generate clean text export or trigger browser print-to-pdf
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Top action bar (hidden during print) */}
      <div className="flex items-center justify-between no-print border-b border-slate-200 pb-4">
        <button
          onClick={() => navigate(`/cases/${currentCase.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Investigation Dossier</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Official Printable Report Document */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm text-slate-900 space-y-8 print:border-0 print:p-0">
        
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-700 font-extrabold text-lg">
              <Shield className="w-6 h-6" />
              <span>ArthaDrishti AI &bull; Sentrix</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Financial Crime Investigation Summary
            </h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Autonomous Intelligence &bull; Human Review Advisory Dossier
            </p>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="font-mono font-bold text-slate-900">DOSSIER REF: {currentCase.id}</div>
            <div className="text-slate-500 font-mono">Date: {new Date().toLocaleDateString()}</div>
            <RiskBadge level={currentCase.riskLevel} score={currentCase.riskScore} size="md" />
          </div>
        </div>

        {/* 1. Case Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            1. Case & Target Entity Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans">
            <div>
              <span className="text-slate-500 block">Primary Account</span>
              <span className="font-mono font-bold text-slate-900">{currentCase.primaryAccount}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Entity Name</span>
              <span className="font-bold text-slate-900">{currentCase.accountName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Investigator</span>
              <span className="font-bold text-slate-900">{currentCase.assignedInvestigator}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Disposition Status</span>
              <span className="font-bold text-brand-700">{currentCase.status}</span>
            </div>
          </div>
        </div>

        {/* 2. Preliminary Risk Assessment & Indicators */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            2. Potentially Suspicious Activity Indicators
          </h3>
          <div className="space-y-2 text-xs">
            {currentCase.indicators?.map((ind, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">{ind.type}</span>
                  <p className="text-slate-600">{ind.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <RiskBadge level={ind.severity} size="sm" />
                  <span className="block text-[11px] font-mono text-slate-500 mt-1">{ind.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Transaction Summary & Volumes */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            3. Transaction Aggregation & Flows
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Total Volume Analyzed</span>
              <span className="font-bold text-slate-900 font-mono text-sm">₹42,50,000</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Inflow Aggregate</span>
              <span className="font-bold text-emerald-600 font-mono text-sm">₹16,50,000</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Outflow Aggregate</span>
              <span className="font-bold text-rose-600 font-mono text-sm">₹26,00,000</span>
            </div>
          </div>
        </div>

        {/* 4. Multi-hop Network Findings */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            4. Network & Graph Topology Findings
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            Automated graph intelligence detected a 5-hop circular funds flow starting at <strong>ACC-10082</strong> and routing through accounts <strong>ACC-10211</strong>, <strong>ACC-10542</strong>, <strong>ACC-10881</strong>, and <strong>ACC-10900</strong> before returning to the originator. Three counterparties in the loop were created within the past 30 days.
          </p>
        </div>

        {/* 5. AI-Assisted Explanation */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            5. Artha AI Explainable Synthesis
          </h3>
          <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-100 text-xs text-slate-800 leading-relaxed space-y-2">
            <p>
              "Case #{currentCase.id} shows potentially suspicious activity based on elevated transaction velocity, unusual amounts structured just beneath statutory thresholds, and multiple newly connected accounts. The system recommends reviewing counterparties and verifying underlying commercial invoices."
            </p>
            <p className="text-[11px] text-slate-500 italic">
              *Notice: This AI explanation assists the investigator and does not constitute a judicial conclusion.
            </p>
          </div>
        </div>

        {/* 6. Investigator Notes & Final Review */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            6. Human Investigator Examination & Notes
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 min-h-[70px]">
            {currentCase.notes || 'Preliminary examination underway. Account counterparties flagged for enhanced monitoring.'}
          </div>
        </div>

        {/* Document Footer Sign-off */}
        <div className="pt-8 border-t border-slate-300 flex justify-between items-end text-xs text-slate-500">
          <div>
            <p>Prepared by: <strong>{currentCase.assignedInvestigator}</strong></p>
            <p>Financial Intelligence & Analytics Unit &bull; Government of India</p>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-400 mb-1" />
            <p>Authorized Analyst Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationReportPage;
