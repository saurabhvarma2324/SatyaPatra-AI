import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import {
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Fingerprint,
  Layers,
  FileCheck2,
  FileText,
  Eye,
  RefreshCw,
  Clock
} from 'lucide-react';

const TEST_SCENARIOS = [
  {
    id: 'case_clean',
    title: 'Scenario 1: Clean ST Application (Genuine)',
    applicant: 'Birsa Munda',
    scheme: 'NFST-2026 (National Fellowship)',
    expectedRisk: 'LOW RISK (Score: 10/100)',
    riskColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    description: 'All 6 ST documents (Caste, Income, Aadhaar, Marksheet, Passbook, Admission) are sharp, fully consistent in names & DOB, within income limits, and have unique perceptual hashes.',
    keyFlags: ['✔ Name 100% consistent across 6 documents', '✔ Income ₹1,20,000 < ₹6,00,000 limit', '✔ Caste verified as Munda (ST)', '✔ No duplicate image hash found'],
    targetAppSearch: 'Birsa Munda'
  },
  {
    id: 'case_mismatch',
    title: 'Scenario 2: Name Mismatch & Exceeded Income',
    applicant: 'Rani Kerketta',
    scheme: 'PMS-ST-2026 (Post-Matric Scholarship)',
    expectedRisk: 'HIGH RISK (Score: 85/100)',
    riskColor: 'text-red-400 border-red-500/30 bg-red-500/10',
    description: 'Applicant declared ₹6,50,000 family income exceeding PMS-ST ₹2,50,000 ceiling. Mark sheet has candidate name "Rani Kumari Soren" (42% similarity mismatch).',
    keyFlags: ['❌ Income ₹6,50,000 EXCEEDS ₹2,50,000 ceiling', '❌ Name Mismatch on Mark Sheet (42% sim)', '⚠ Flagged for mandatory officer investigation'],
    targetAppSearch: 'Rani Kerketta'
  },
  {
    id: 'case_duplicate',
    title: 'Scenario 3: Perceptual Hash Duplicate Fraud',
    applicant: 'Kalyan Soren',
    scheme: 'NFST-2026 (National Fellowship)',
    expectedRisk: 'HIGH RISK (Score: 95/100)',
    riskColor: 'text-red-400 border-red-500/30 bg-red-500/10',
    description: 'Re-uses identical Caste Certificate image file from Birsa Munda (detected via imagehash dHash/pHash collision) + Duplicate Aadhaar & Bank Account.',
    keyFlags: ['❌ CRITICAL: Duplicate Caste Certificate hash match', '❌ CRITICAL: Duplicate Aadhaar identity collision', '❌ Shared Bank Account with another applicant'],
    targetAppSearch: 'Kalyan Soren'
  }
];

const DemoTesterPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const res = await api.get('/applications');
        if (res.data?.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, []);

  const handleOpenScenario = (applicantName) => {
    const matchedApp = applications.find(a => a.applicantName.toLowerCase().includes(applicantName.toLowerCase()));
    if (matchedApp) {
      navigate(`/applications/${matchedApp._id}`);
    } else {
      navigate('/applications/new');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          AI Verification Sandbox
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Live Verification &amp; Fraud Detection Test Scenarios
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Click any pre-configured test scenario to jump directly into the full Officer Verification Dossier 
          and observe real-time OCR extraction, fuzzy matching, and duplicate detection.
        </p>
      </div>

      {/* Scenarios List */}
      <div className="space-y-4 sm:space-y-5">
        {TEST_SCENARIOS.map((scenario) => {
          const matchedApp = applications.find(a => a.applicantName.toLowerCase().includes(scenario.targetAppSearch.toLowerCase()));
          return (
            <div
              key={scenario.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:border-indigo-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6"
            >
              <div className="space-y-2.5 sm:space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="text-sm sm:text-base font-bold text-white">{scenario.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${scenario.riskColor}`}>
                    {scenario.expectedRisk}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {scenario.description}
                </p>

                {/* Key Flag Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {scenario.keyFlags.map((flag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 font-medium"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex flex-col items-stretch md:items-end gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleOpenScenario(scenario.targetAppSearch)}
                  className="w-full md:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>Examine {scenario.applicant}'s Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {matchedApp && (
                  <span className="text-[10px] font-mono text-slate-400 text-center md:text-right">
                    App #{matchedApp.applicationNumber} &bull; Status: {matchedApp.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Custom Test Run Callout */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Want to test a custom document bundle?</h4>
          <p className="text-xs text-slate-400 mt-0.5">Use the application submission wizard to upload your own test files.</p>
        </div>
        <Link
          to="/applications/new"
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition text-center"
        >
          Submit Custom Application
        </Link>
      </div>
    </div>
  );
};

export default DemoTesterPage;
