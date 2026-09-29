import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import RiskScoreGauge from '../components/RiskScoreGauge';
import DocumentViewer from '../components/DocumentViewer';
import DuplicateAlertBanner from '../components/DuplicateAlertBanner';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  ArrowLeft,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Sparkles,
  Lock,
  UserCheck,
  Cpu,
  Fingerprint,
  Sliders,
  Send,
  Building2,
  Calendar,
  CreditCard,
  GraduationCap
} from 'lucide-react';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reverifying, setReverifying] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('caste_certificate');

  // Active AI Tab: 'extraction' | 'cross_check' | 'duplicates' | 'eligibility' | 'summary'
  const [activeTab, setActiveTab] = useState('extraction');

  // Officer Decision Form
  const [decisionType, setDecisionType] = useState('APPROVED');
  const [officerComment, setOfficerComment] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [decisionError, setDecisionError] = useState('');
  const [decisionSuccess, setDecisionSuccess] = useState('');

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/${id}`);
      if (res.data?.success) {
        setApplication(res.data.application);
        setDocuments(res.data.documents || []);
        setReport(res.data.report || null);
        if (res.data.documents?.length > 0) {
          setSelectedDocType(res.data.documents[0].documentType);
        }
      }
    } catch (err) {
      console.error('Failed to load application:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const handleReverify = async () => {
    if (application?.isLocked) {
      alert('This application is locked from reprocessing because an officer decision has been finalized.');
      return;
    }
    setReverifying(true);
    try {
      const res = await api.post(`/applications/${id}/verify`);
      if (res.data?.success) {
        setApplication(res.data.application);
        setReport(res.data.report);
        alert('Verification pipeline re-executed successfully.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setReverifying(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open(`${api.defaults.baseURL}/applications/${id}/report/pdf`, '_blank');
  };

  const handleRecordDecision = async (e) => {
    e.preventDefault();
    setDecisionError('');
    setDecisionSuccess('');

    if (!officerComment || officerComment.trim().length < 5) {
      setDecisionError('Please enter a justification comment (minimum 5 characters).');
      return;
    }

    setSubmittingDecision(true);
    try {
      const res = await api.post(`/applications/${id}/decision`, {
        decision: decisionType,
        comment: officerComment
      });
      if (res.data?.success) {
        setDecisionSuccess(`Decision '${decisionType}' recorded successfully! Application is now locked.`);
        setApplication(res.data.application);
      }
    } catch (err) {
      setDecisionError(err.response?.data?.message || 'Failed to submit decision');
    } finally {
      setSubmittingDecision(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] text-slate-400 p-4 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
        <p className="text-sm font-semibold text-slate-300">Loading Official Verification Dossier...</p>
        <p className="text-xs text-slate-400 mt-1">Decrypting signed document tokens and AI extraction matrices</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6 sm:p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-base sm:text-lg font-bold text-white">Application Record Not Found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">The requested application ID does not exist.</p>
        <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const activeDoc = documents.find(d => d.documentType === selectedDocType);

  return (
    <div className="space-y-5 sm:space-y-6 pb-12">
      {/* Back link & Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications List</span>
        </Link>

        {/* Locked Badge */}
        {application.isLocked && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold font-mono self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Decision Locked &bull; Immutable Audit Record
          </span>
        )}
      </div>

      {/* Top Application Snapshot Dossier Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black font-mono">
              {application.applicationNumber}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {application.applicantName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              {application.category} &bull; {application.subTribe || 'ST Community'}
            </span>
          </div>

          {/* Key Info Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">DOB / Age</span>
                <span className="font-semibold">{application.dob}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Fingerprint className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Aadhaar (Masked)</span>
                <span className="font-mono font-semibold">{application.aadhaarNumberMasked}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Course &amp; College</span>
                <span className="font-semibold truncate block" title={`${application.course} - ${application.institution}`}>
                  {application.course}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Declared Income</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{application.income?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Risk Score & Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-end gap-3 shrink-0">
          <RiskScoreGauge score={application.riskScore} level={application.riskLevel} />

          <div className="flex items-center gap-2 w-full">
            <button
              onClick={handleDownloadPdf}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export PDF Dossier</span>
            </button>
            <button
              onClick={handleReverify}
              disabled={reverifying || application.isLocked}
              className="flex-1 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reverifying ? 'animate-spin' : ''}`} />
              <span>Re-run AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Duplicate & Fraud High-Visibility Warnings */}
      {report?.duplicateFlags && report.duplicateFlags.length > 0 && (
        <DuplicateAlertBanner duplicateFlags={report.duplicateFlags} />
      )}

      {/* Flagged Summary Reasons Alert */}
      {report?.summaryReasons && report.summaryReasons.length > 0 && report.riskScore > 30 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Key Flagged Discrepancies Requiring Officer Review
          </div>
          <ul className="space-y-1.5 pl-5 sm:pl-6 list-disc text-xs text-slate-200">
            {report.summaryReasons.map((reason, idx) => (
              <li key={idx} className="leading-relaxed">{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Dual-Pane Side-by-Side Reviewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 min-h-[500px]">
        {/* Left Pane (6 cols): Document Inspection Viewer */}
        <div className="lg:col-span-6 flex flex-col h-full min-h-[420px]">
          <DocumentViewer
            documents={documents}
            selectedType={selectedDocType}
            onSelectType={setSelectedDocType}
          />
        </div>

        {/* Right Pane (6 cols): Tabbed AI Cross-Examination Intelligence */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden min-h-[420px]">
          {/* Analysis Tab Bar */}
          <div className="bg-slate-950 px-2 sm:px-3 py-2 border-b border-slate-800 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('extraction')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg transition whitespace-nowrap text-xs ${
                activeTab === 'extraction'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>1. OCR Extracted</span>
            </button>

            <button
              onClick={() => setActiveTab('cross_check')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg transition whitespace-nowrap text-xs ${
                activeTab === 'cross_check'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. Cross-Doc ({report?.crossDocumentChecks?.consistencyScore ?? 100}%)</span>
            </button>

            <button
              onClick={() => setActiveTab('eligibility')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg transition whitespace-nowrap text-xs ${
                activeTab === 'eligibility'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>3. Scheme Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('duplicates')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg transition whitespace-nowrap text-xs ${
                activeTab === 'duplicates'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>4. Duplicate Check</span>
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            {/* TAB 1: OCR EXTRACTION & VALIDATION */}
            {activeTab === 'extraction' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider truncate">
                    {selectedDocType.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    OCR: {Math.round((activeDoc?.ocrConfidence || 0.85) * 100)}%
                  </span>
                </div>

                {activeDoc?.extractedFields && Object.keys(activeDoc.extractedFields).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {Object.entries(activeDoc.extractedFields).map(([k, v]) => (
                      <div key={k} className="p-2.5 sm:p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          {k.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-semibold text-slate-100 font-mono break-all">
                          {typeof v === 'number' ? (k.includes('income') ? `₹${v.toLocaleString('en-IN')}` : v) : String(v || '—')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No fields extracted for this document. Run automated verification to extract.
                  </p>
                )}

                {/* Validation Warnings */}
                {activeDoc?.validationFlags && activeDoc.validationFlags.length > 0 && (
                  <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      Document Validation Flags
                    </span>
                    {activeDoc.validationFlags.map((vf, i) => (
                      <div key={i} className="text-xs text-amber-200 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{vf.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CROSS-DOCUMENT CONSISTENCY MATRIX */}
            {activeTab === 'cross_check' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Cross-Document Similarity Matrix
                  </span>
                  <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                    (report?.crossDocumentChecks?.consistencyScore ?? 100) > 80
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    Score: {report?.crossDocumentChecks?.consistencyScore ?? 100}%
                  </span>
                </div>

                {/* Name Comparisons Matrix */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Applicant Name Equivalence Check</span>
                  <div className="space-y-2">
                    {report?.crossDocumentChecks?.nameComparisons?.map((c, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          c.isMatch ? 'bg-slate-950/60 border-slate-800' : 'bg-red-500/10 border-red-500/40 text-red-200'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">{c.documentType?.replace(/_/g, ' ')}</span>
                          <span className="font-semibold text-slate-100">{c.extractedName}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-bold ${c.isMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                            {c.similarityScore}% {c.isMatch ? 'Match' : 'Mismatch'}
                          </span>
                        </div>
                      </div>
                    )) || <p className="text-xs text-slate-400">All names aligned across documents.</p>}
                  </div>
                </div>

                {/* Cross Check Flags */}
                {report?.crossDocumentChecks?.crossCheckFlags?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1.5">
                    <span className="text-xs font-bold text-red-400 uppercase block">Discrepancy Alerts</span>
                    {report.crossDocumentChecks.crossCheckFlags.map((f, i) => (
                      <div key={i} className="text-xs text-red-300 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{f.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SCHEME ELIGIBILITY EVALUATION */}
            {activeTab === 'eligibility' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Scheme Criteria Pass / Fail Matrix
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    report?.eligibilityResults?.isEligible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {report?.eligibilityResults?.overallStatus || 'ELIGIBLE'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {report?.eligibilityResults?.rulesEvaluated?.map((r, i) => {
                    const isPass = r.status === 'PASS';
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          isPass ? 'bg-slate-950/60 border-slate-800' : 'bg-red-500/10 border-red-500/40'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-200 block">{r.rule}</span>
                          <span className="text-[11px] text-slate-400">
                            Required: <span className="text-slate-300 font-mono">{r.required}</span> &bull; Actual: <span className="text-slate-300 font-mono">{r.actual}</span>
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                          isPass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: DUPLICATE & FRAUD DETECTION */}
            {activeTab === 'duplicates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Perceptual Hash &amp; Database Collision Scans
                  </span>
                  <span className="text-[11px] text-slate-400">dHash &bull; pHash &bull; Aadhaar Hash</span>
                </div>

                {report?.duplicateFlags && report.duplicateFlags.length > 0 ? (
                  <div className="space-y-3">
                    {report.duplicateFlags.map((flag, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 space-y-1">
                        <div className="flex items-center justify-between font-bold text-red-400">
                          <span>{flag.type}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 font-mono">{flag.severity}</span>
                        </div>
                        <p>{flag.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
                    <p className="font-bold">No Duplicates Detected</p>
                    <p className="text-[11px] text-slate-400">All document perceptual hashes and identity numbers are unique across the database.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Officer Action & Decision Panel */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Verification Officer Final Decision Authority
            </h3>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400">
            AI recommends &bull; Human Officer decides
          </span>
        </div>

        {application.isLocked ? (
          /* Locked Decision Sign-off Stamp */
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                  application.officerDecision?.decision === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : application.officerDecision?.decision === 'REJECTED'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  OFFICIAL DECISION: {application.officerDecision?.decision || 'FINALIZED'}
                </span>
                <span className="text-xs text-slate-400">
                  by {application.officerDecision?.officerName || 'Assigned Officer'}
                </span>
              </div>
              <p className="text-xs text-slate-300 italic pt-1">
                "{application.officerDecision?.comment || 'No justification entered.'}"
              </p>
            </div>

            <div className="text-left md:text-right text-[11px] text-slate-400 font-mono shrink-0">
              <span>Timestamp: {new Date(application.officerDecision?.decidedAt || Date.now()).toLocaleString('en-IN')}</span>
              <span className="block text-emerald-400 font-bold mt-0.5">&#10003; Tamper-Evident Audit Logged</span>
            </div>
          </div>
        ) : (
          /* Active Decision Submission Form */
          <form onSubmit={handleRecordDecision} className="space-y-4">
            {decisionError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{decisionError}</span>
              </div>
            )}
            {decisionSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{decisionSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setDecisionType('APPROVED')}
                className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                  decisionType === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>APPROVE SCHOLARSHIP</span>
              </button>

              <button
                type="button"
                onClick={() => setDecisionType('REJECTED')}
                className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                  decisionType === 'REJECTED'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>REJECT APPLICATION</span>
              </button>

              <button
                type="button"
                onClick={() => setDecisionType('RESUBMIT')}
                className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                  decisionType === 'RESUBMIT'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>REQUEST RESUBMISSION</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mandatory Officer Justification &amp; Examination Notes *
              </label>
              <textarea
                required
                rows={3}
                value={officerComment}
                onChange={(e) => setOfficerComment(e.target.value)}
                placeholder="Enter detailed reasons for decision (e.g., 'All certificates verified with Tahsildar seal. Name and income match central guidelines.')"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={submittingDecision}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingDecision ? 'Submitting & Locking...' : 'Submit Final Officer Decision'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
