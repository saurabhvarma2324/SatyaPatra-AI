import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileSearch,
  CheckCircle2,
  Users,
  ArrowRight,
  Sparkles,
  Award,
  Fingerprint,
  Lock,
  SearchCheck,
  TrendingUp,
  AlertOctagon
} from 'lucide-react';

const LandingPage = () => {
  const { user, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoLaunch = async (role) => {
    try {
      await quickDemoLogin(role);
      navigate(role === 'applicant' ? '/applications/new' : '/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-60 sm:w-72 h-60 sm:h-72 bg-emerald-600/15 blur-[100px] rounded-full pointer-events-none" />

        {/* Ministry Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs text-slate-300 mb-6 sm:mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-emerald-400">MINISTRY OF TRIBAL AFFAIRS</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-300">Government of India</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          AI-Powered ST Scholarship <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
            Document Verification &amp; Cross-Examination
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
          Empowering government verification officers with automated OCR extraction, 
          fuzzy cross-document consistency checks, perceptual hash duplicate fraud detection, 
          and dynamic scheme eligibility evaluation &mdash; ensuring genuine tribal scholars receive swift financial aid.
        </p>

        {/* 1-Click Demo Launcher Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto text-left">
          {/* Officer Demo */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-indigo-500/40 hover:border-indigo-400 transition-all shadow-xl relative group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition">Verification Officer</h3>
              <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
                Review flagged applications, inspect side-by-side signed Cloudinary documents, check AI confidence scores, and make final decisions.
              </p>
            </div>
            <button
              onClick={() => handleDemoLaunch('officer')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <span>Launch Officer Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Admin Demo */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl relative group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition">Scheme Administrator</h3>
              <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
                Manage scheme eligibility thresholds (income caps, minimum %, approved colleges), monitor system KPIs, and audit trails.
              </p>
            </div>
            <button
              onClick={() => handleDemoLaunch('admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <span>Launch Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Applicant Demo */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all shadow-xl relative group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition">Applicant / Operator</h3>
              <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
                Submit scholarship details and upload all 6 required verification documents directly to Cloudinary with real-time feedback.
              </p>
            </div>
            <button
              onClick={() => handleDemoLaunch('applicant')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <span>Submit New Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sandbox Direct Link */}
        <div className="mt-8">
          <Link
            to="/demo-tester"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition shadow-lg shadow-emerald-500/10"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AI Verification Sandbox &bull; Run 3 Live Fraud &amp; Verification Test Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4 Pillars Architecture Breakdown */}
      <section className="py-12 sm:py-16 bg-slate-900/60 border-t border-b border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-white">4-Stage Intelligent Verification Pipeline</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every submitted application undergoes automated multi-modal examination before reaching the verification officer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 font-bold">1</div>
              <h4 className="text-sm font-bold text-slate-100">Modular OCR &amp; Blur Check</h4>
              <p className="text-xs text-slate-400 mt-2">
                Extracts fields from 6 ST document formats using Tesseract OCR, checks certificate numbers, and analyzes Laplacian blur variance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 font-bold">2</div>
              <h4 className="text-sm font-bold text-slate-100">Fuzzy Cross-Document Matching</h4>
              <p className="text-xs text-slate-400 mt-2">
                Levenshtein distance matrices cross-reference applicant name, DOB, Tribe category, and bank account across all 6 files.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mb-3 font-bold">3</div>
              <h4 className="text-sm font-bold text-slate-100">Perceptual Hash Duplicate Guard</h4>
              <p className="text-xs text-slate-400 mt-2">
                dHash and pHash image fingerprints detect recycled certificates and flag duplicate Aadhaar / bank account registrations across applications.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 font-bold">4</div>
              <h4 className="text-sm font-bold text-slate-100">Rule Engine &amp; Officer Dossier</h4>
              <p className="text-xs text-slate-400 mt-2">
                Evaluates scheme criteria (income limit, % cutoff) and computes a 0-100 weighted risk score with human-readable justifications for officer sign-off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 sm:py-8 px-4 text-center text-xs text-slate-400 border-t border-slate-800">
        <p>SatyaPatra AI &mdash; Ministry of Tribal Affairs, Government of India &bull; All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;
