import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FolderLock,
  Mail,
  ShieldAlert,
  Search,
  Globe,
  Network,
  Clock,
  FileText,
  Cpu,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Send,
  Printer,
  ChevronLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { casesAPI, graphAPI, geoAPI, timelineAPI, reportsAPI } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConnectedIntelligenceFlow } from '../components/investigation/ConnectedIntelligenceFlow';
import { RiskGauge } from '../components/investigation/RiskGauge';
import { EvidenceCard } from '../components/common/EvidenceCard';
import { HeadersViewer } from '../components/investigation/HeadersViewer';
import { EmailBodyViewer } from '../components/investigation/EmailBodyViewer';
import { AttachmentList } from '../components/investigation/AttachmentList';
import { ModelMetricsCard } from '../components/investigation/ModelMetricsCard';
import { GeoMap } from '../components/geo/GeoMap';
import { GraphViewer } from '../components/graph/GraphViewer';
import { TimelineViewer } from '../components/timeline/TimelineViewer';
import { ReportDossier } from '../components/report/ReportDossier';

export const CaseDetailPage = () => {
  const { caseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [caseData, setCaseData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [geoLocations, setGeoLocations] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Investigator Note State
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const navigate = useNavigate();

  const loadCaseDetails = async () => {
    setLoading(true);
    try {
      const [caseRes, graphRes, geoRes, timelineRes, reportRes] = await Promise.allSettled([
        casesAPI.getCaseById(caseId),
        graphAPI.getGraphByCaseId(caseId),
        geoAPI.getGeoByCaseId(caseId),
        timelineAPI.getTimelineByCaseId(caseId),
        reportsAPI.getReportByCaseId(caseId)
      ]);

      if (caseRes.status === 'fulfilled' && caseRes.value.data?.data) {
        setCaseData(caseRes.value.data.data);
      }
      if (graphRes.status === 'fulfilled' && graphRes.value.data?.graph) {
        setGraphData(graphRes.value.data.graph);
      }
      if (geoRes.status === 'fulfilled' && geoRes.value.data?.locations) {
        setGeoLocations(geoRes.value.data.locations);
      }
      if (timelineRes.status === 'fulfilled' && timelineRes.value.data?.data) {
        setTimelineEvents(timelineRes.value.data.data);
      }
      if (reportRes.status === 'fulfilled' && reportRes.value.data?.data) {
        setReportData(reportRes.value.data.data);
      }
    } catch (err) {
      console.warn('Error loading case detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await casesAPI.updateCase(caseId, { status: newStatus });
      setCaseData(prev => ({ ...prev, status: newStatus }));
      // Reload timeline
      const tRes = await timelineAPI.getTimelineByCaseId(caseId);
      if (tRes.data?.data) setTimelineEvents(tRes.data.data);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      await casesAPI.addNote(caseId, newNote.trim());
      setNewNote('');
      loadCaseDetails();
    } catch (err) {
      alert('Failed to add note: ' + err.message);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400 font-mono">Loading case dossier {caseId}...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
        <h3 className="text-base font-bold text-white">Investigation Dossier Not Found</h3>
        <p className="text-xs text-slate-400">Case '{caseId}' does not exist or has been archived.</p>
        <button
          onClick={() => navigate('/cases')}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
        >
          Return to Cases
        </button>
      </div>
    );
  }

  const threat = caseData.threat || {};
  const email = caseData.email || {};
  const iocs = caseData.iocs || [];
  const reasons = threat.reasons || [];
  const notes = caseData.notes || [];

  const tabs = [
    { key: 'overview', label: 'Overview', icon: FolderLock },
    { key: 'email', label: 'Email Forensic', icon: Mail },
    { key: 'threat', label: 'Threat Analysis', icon: Cpu },
    { key: 'iocs', label: `IOCs (${iocs.length})`, icon: Search },
    { key: 'geo', label: 'Geo Intelligence', icon: Globe },
    { key: 'graph', label: 'Relationship Graph', icon: Network },
    { key: 'timeline', label: 'Timeline', icon: Clock },
    { key: 'report', label: 'Report', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button & Case Header Bar */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/cases')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Case Management</span>
        </button>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-base font-black text-cyan-400">
                {caseData.caseId}
              </span>
              <RiskBadge level={caseData.threatLevel} score={caseData.riskScore} size="md" />
              <StatusBadge status={caseData.status} />
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                Priority: {caseData.priority}
              </span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight break-words">
              {caseData.title}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Assigned: <strong className="text-slate-300">{caseData.investigatorName || 'Dr. Alok Verma'}</strong></span>
              <span>&bull;</span>
              <span>Opened: {new Date(caseData.createdAt).toLocaleString()}</span>
            </p>
          </div>

          {/* Status Decision Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                Investigator Verdict Decision
              </label>
              <select
                value={caseData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="UNDER_INVESTIGATION">Under Investigation</option>
                <option value="CONFIRMED_THREAT">Confirmed Threat</option>
                <option value="FALSE_POSITIVE">False Positive</option>
                <option value="RESOLVED">Resolved / Closed</option>
              </select>
            </div>

            <button
              onClick={() => handleTabChange('report')}
              className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors self-end"
            >
              <FileText className="w-4 h-4" />
              <span>Dossier Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Investigation Tab Navigation */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Connected Threat Intelligence Flow */}
            <ConnectedIntelligenceFlow
              riskScore={caseData.riskScore}
              threatType={caseData.threatType}
              iocCount={iocs.length}
              domain={iocs.find(i => i.type === 'domain')?.value}
              ip={iocs.find(i => i.type === 'ip')?.value}
              location={geoLocations[0] ? `${geoLocations[0].city}, ${geoLocations[0].country}` : 'Amsterdam, Netherlands'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Risk Gauge & Model Info */}
              <div className="space-y-6">
                <RiskGauge
                  score={caseData.riskScore}
                  level={caseData.threatLevel}
                  confidence={caseData.confidence || 0.95}
                  threatType={caseData.threatType}
                />

                {/* Behavioral Anomaly Box */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Behavioral Anomaly Score
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {threat.anomalyScore ? threat.anomalyScore.toFixed(2) : '0.56'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(threat.anomalyScore || 0.56) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Isolation Forest detected header entropy, unusual URL densities, and high-urgency psychological triggers.
                  </p>
                </div>
              </div>

              {/* Right Column (2 cols): Explainable Evidence & Notes */}
              <div className="lg:col-span-2 space-y-6">
                {/* Explainable AI Evidence Cards */}
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        WHY WAS THIS EMAIL FLAGGED? (Forensic Evidence)
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {reasons.length} Indicators Detected
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {reasons.length > 0 ? (
                      reasons.map((r, idx) => (
                        <EvidenceCard key={idx} reason={r} index={idx} />
                      ))
                    ) : (
                      <div className="p-4 rounded-lg bg-slate-950 text-center text-xs text-slate-500">
                        No critical threat indicators flagged.
                      </div>
                    )}
                  </div>
                </div>

                {/* Investigator Notes & Review */}
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Investigator Review & Case Notes ({notes.length})
                      </h3>
                    </div>
                  </div>

                  {/* Notes Feed */}
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {notes.length === 0 ? (
                      <div className="p-4 rounded-lg bg-slate-950 text-center text-xs text-slate-500">
                        No investigator notes logged yet.
                      </div>
                    ) : (
                      notes.map((n, idx) => (
                        <div key={n.id || idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="font-bold text-sky-400">{n.author}</span>
                            <span>{new Date(n.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Add an investigative finding or triage comment..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={submittingNote || !newNote.trim()}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingNote ? 'Saving...' : 'Post Note'}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL FORENSIC */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <HeadersViewer headers={email.headers || {
              subject: caseData.title,
              sender: email.sender,
              recipient: email.recipient,
              date: email.date
            }} />
            <EmailBodyViewer
              bodyText={email.bodyText}
              bodyHtml={email.bodyHtml}
              urls={email.urls || iocs.filter(i => i.type === 'url').map(i => i.value)}
            />
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Attachment Inspection & Payloads ({email.attachments?.length || 0})
              </h4>
              <AttachmentList attachments={email.attachments || []} />
            </div>
          </div>
        )}

        {/* TAB 3: THREAT ANALYSIS */}
        {activeTab === 'threat' && (
          <div className="space-y-6">
            <ModelMetricsCard />
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
                Explainable Multi-Signal Risk Decomposition
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-rose-400 block uppercase tracking-wider text-[10px]">Signal 1: NLP Classification (35% Weight)</span>
                  <p className="text-slate-300">Logistic regression classifier detected strong semantic proximity to phishing credential lure vectors.</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">Signal 2: Metadata Anomaly (25% Weight)</span>
                  <p className="text-slate-300">Isolation Forest identified anomalous ratio of urgency vocabulary and relay hop variance.</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-orange-400 block uppercase tracking-wider text-[10px]">Signal 3: Authentication & Header Flags (20% Weight)</span>
                  <p className="text-slate-300">SPF/DKIM alignment failed. Sender domain deviates from Reply-To return path.</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-purple-400 block uppercase tracking-wider text-[10px]">Signal 4: IOC Reputation (20% Weight)</span>
                  <p className="text-slate-300">Destination URLNet resolves to high-risk bulletproof hosting ASN AS49544.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IOC INTELLIGENCE */}
        {activeTab === 'iocs' && (
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Extracted Indicators of Compromise ({iocs.length} Artifacts)
                </h4>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                    <th className="pb-3 pl-3">Type</th>
                    <th className="pb-3">Indicator Value</th>
                    <th className="pb-3">Forensic Source</th>
                    <th className="pb-3">Threat Severity</th>
                    <th className="pb-3 pr-3">Status / Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {iocs.map((ioc, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-3 pl-3 font-bold uppercase text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {ioc.type}
                        </span>
                      </td>
                      <td className="py-3 text-white truncate max-w-md">
                        {ioc.value}
                      </td>
                      <td className="py-3 text-slate-400 font-sans">
                        {ioc.source}
                      </td>
                      <td className="py-3 font-sans">
                        <RiskBadge level={ioc.risk} size="sm" showScore={false} />
                      </td>
                      <td className="py-3 pr-3 text-slate-300 font-sans text-xs">
                        {ioc.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: GEO INTELLIGENCE */}
        {activeTab === 'geo' && (
          <div className="space-y-4">
            <GeoMap locations={geoLocations} height="520px" />
          </div>
        )}

        {/* TAB 6: RELATIONSHIP GRAPH */}
        {activeTab === 'graph' && (
          <div className="space-y-4">
            <GraphViewer graphData={graphData} height="580px" />
          </div>
        )}

        {/* TAB 7: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <TimelineViewer events={timelineEvents} />
          </div>
        )}

        {/* TAB 8: REPORT */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            <ReportDossier
              caseData={caseData}
              threatData={threat}
              emailData={email}
              iocs={iocs}
              timeline={timelineEvents}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDetailPage;
