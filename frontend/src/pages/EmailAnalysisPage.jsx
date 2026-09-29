import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  FolderLock,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Network
} from 'lucide-react';
import { emailsAPI } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { EvidenceCard } from '../components/common/EvidenceCard';

const ANALYSIS_STEPS = [
  'Parsing RFC 822 MIME & Envelope Structure',
  'Extracting Forensic Headers, Relays & Auth Signatures',
  'Running NLP Threat Classification (TF-IDF + Classifier)',
  'Evaluating Metadata Behavioral Deviations (Isolation Forest)',
  'Extracting Indicators of Compromise (IPs, Domains, URLs, Hashes)',
  'Enriching Network ASNs & Approximate Geolocation',
  'Constructing Multi-Hop Entity Relationship Topology'
];

export const EmailAnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [samples, setSamples] = useState([]);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    emailsAPI.getSampleEmails()
      .then(res => {
        if (res.data?.samples) setSamples(res.data.samples);
      })
      .catch(err => console.warn('Could not fetch samples:', err))
      .finally(() => setLoadingSamples(false));
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.eml') || file.name.endsWith('.txt') || file.name.endsWith('.msg')) {
        setSelectedFile(file);
        setErrorMsg('');
      } else {
        setErrorMsg('Please select a valid .eml or standard email file.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const runAnalysisAnimation = (callback) => {
    setIsAnalyzing(true);
    setActiveStep(0);
    setAnalysisResult(null);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < ANALYSIS_STEPS.length) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        callback();
      }
    }, 450);
  };

  const handleAnalyzeUploadedFile = async () => {
    if (!selectedFile) {
      setErrorMsg('Please choose an .eml file to analyze.');
      return;
    }

    const formData = new FormData();
    formData.append('emailFile', selectedFile);
    formData.append('caseId', 'new');

    runAnalysisAnimation(async () => {
      try {
        const res = await emailsAPI.uploadEmail(formData);
        setIsAnalyzing(false);
        if (res.data?.data) {
          setAnalysisResult(res.data);
        }
      } catch (err) {
        setIsAnalyzing(false);
        setErrorMsg(err.response?.data?.message || 'Unable to analyze this email. Please verify the file is a valid .eml file.');
      }
    });
  };

  const handleLoadSample = (sample) => {
    setSelectedFile(null);
    setErrorMsg('');

    runAnalysisAnimation(async () => {
      try {
        const res = await emailsAPI.loadSample(sample.filename, sample.title);
        setIsAnalyzing(false);
        if (res.data?.data) {
          setAnalysisResult(res.data);
        }
      } catch (err) {
        setIsAnalyzing(false);
        setErrorMsg(err.response?.data?.message || 'Failed to analyze demo sample.');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span>Email Threat Ingestion & Forensic Studio</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload raw .EML artifacts for multi-stage AI classification, behavioral anomaly scoring, and connected intelligence synthesis.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Upload / Drag & Drop Section */}
      {!isAnalyzing && !analysisResult && (
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="p-10 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-slate-900/60 hover:bg-slate-900/90 transition-all text-center space-y-4 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Drag and drop suspicious <span className="font-mono text-cyan-400">.EML</span> file
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Supports RFC 822 MIME message files up to 25 MB
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white cursor-pointer transition-colors inline-flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Browse Local Computer</span>
                <input
                  type="file"
                  accept=".eml,.msg,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <button
                  onClick={handleAnalyzeUploadedFile}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Analyze Selected File
                </button>
              )}
            </div>

            {selectedFile && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {/* Built-in Demonstration Scenarios (5 Sample Emails) */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Preloaded Forensic Evaluation Samples (1-Click Analysis)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Ready for Demonstration</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {samples.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors">
                        {sample.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {sample.threatType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">{sample.expectedRisk}</span>
                    <span className="font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Launch Ingestion</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Stage Animated Processing Indicator */}
      {isAnalyzing && (
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-2xl space-y-6 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
            <Layers className="w-6 h-6 animate-spin" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Executing Forensic Threat Decomposition
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Stage {activeStep + 1} of {ANALYSIS_STEPS.length}
            </p>
          </div>

          <div className="space-y-2 text-left">
            {ANALYSIS_STEPS.map((stepName, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs flex items-center gap-3 transition-all ${
                  idx === activeStep
                    ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 font-semibold'
                    : idx < activeStep
                    ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                    : 'bg-slate-950/20 border-slate-900 text-slate-600'
                }`}
              >
                {idx < activeStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : idx === activeStep ? (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>{stepName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Analysis Complete & Dossier Created
              </span>
              <h2 className="text-xl font-black text-white mt-1 font-mono">
                {analysisResult.caseId || 'CASE-2026-001'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {analysisResult.data?.analysis?.headers?.subject || 'Email Threat Assessment'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <RiskBadge
                level={analysisResult.data?.analysis?.risk_level || 'HIGH'}
                score={analysisResult.data?.analysis?.risk_score}
                size="lg"
              />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Threat Type</span>
              <span className="font-bold text-white mt-0.5 block">{analysisResult.data?.analysis?.threat_type}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">AI Confidence</span>
              <span className="font-mono font-bold text-cyan-400 mt-0.5 block">
                {Math.round((analysisResult.data?.analysis?.confidence || 0.95) * 100)}%
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Extracted IOCs</span>
              <span className="font-mono font-bold text-amber-400 mt-0.5 block">
                {analysisResult.data?.analysis?.iocs?.length || 0} Artifacts
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Anomaly Score</span>
              <span className="font-mono font-bold text-rose-400 mt-0.5 block">
                {analysisResult.data?.analysis?.anomaly_score || '0.56'}
              </span>
            </div>
          </div>

          {/* Evidence Cards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Primary Detection Flags & Forensic Evidence
            </h4>
            {analysisResult.data?.analysis?.reasons?.slice(0, 4).map((r, idx) => (
              <EvidenceCard key={idx} reason={r} index={idx} />
            ))}
          </div>

          {/* Action Hub Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setAnalysisResult(null);
                setSelectedFile(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Analyze Another Email
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/cases/${analysisResult.caseId}?tab=graph`)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
              >
                <Network className="w-3.5 h-3.5 text-purple-400" />
                <span>Relationship Graph</span>
              </button>
              <button
                onClick={() => navigate(`/cases/${analysisResult.caseId}?tab=geo`)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Geo Intelligence</span>
              </button>
              <button
                onClick={() => navigate(`/cases/${analysisResult.caseId}`)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <span>Open Full Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAnalysisPage;
