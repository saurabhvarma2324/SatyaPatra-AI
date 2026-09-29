import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderLock,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Upload,
  Calendar,
  User,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  FileText
} from 'lucide-react';
import { casesAPI } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

export const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await casesAPI.getCases({
        search: search || undefined,
        risk: riskFilter,
        status: statusFilter,
        priority: priorityFilter
      });
      if (res.data?.data) {
        setCases(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [search, riskFilter, statusFilter, priorityFilter]);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await casesAPI.createCase({
        title: newTitle.trim(),
        description: newDesc.trim(),
        priority: newPriority
      });
      setIsCreating(false);
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDesc('');
      if (res.data?.data?.caseId) {
        navigate(`/cases/${res.data.data.caseId}`);
      } else {
        fetchCases();
      }
    } catch (err) {
      setIsCreating(false);
      alert('Failed to create case: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-cyan-400" />
            <span>Forensic Case Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, and manage all security investigation dossiers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Case</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Case ID, title, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase font-bold text-slate-400 shrink-0">Risk:</label>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full py-2 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Threat Levels</option>
            <option value="SAFE">Safe / Low</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="HIGH">High Threat</option>
            <option value="CRITICAL">Critical Incident</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase font-bold text-slate-400 shrink-0">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="CONFIRMED_THREAT">Confirmed Threat</option>
            <option value="FALSE_POSITIVE">False Positive</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase font-bold text-slate-400 shrink-0">Priority:</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full py-2 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-3.5 pl-4">Case ID</th>
                <th className="py-3.5">Investigation Title</th>
                <th className="py-3.5">Priority</th>
                <th className="py-3.5">Threat Classification</th>
                <th className="py-3.5">AI Risk Score</th>
                <th className="py-3.5">Investigator Status</th>
                <th className="py-3.5">Lead Analyst</th>
                <th className="py-3.5">Date</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500 animate-pulse">
                    Querying forensic case database...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500">
                    No cases match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr
                    key={c.caseId}
                    onClick={() => navigate(`/cases/${c.caseId}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 pl-4 font-mono font-bold text-sky-400">
                      {c.caseId}
                    </td>
                    <td className="py-3.5 max-w-xs">
                      <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate block">
                        {c.title}
                      </span>
                      {c.description && (
                        <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                          {c.description}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        c.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        c.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        c.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-300">
                      {c.threatType || 'Pending'}
                    </td>
                    <td className="py-3.5">
                      <RiskBadge level={c.threatLevel} score={c.riskScore} size="sm" />
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 text-slate-400 font-medium">
                      {c.investigatorName || 'Dr. Alok Verma'}
                    </td>
                    <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cases/${c.caseId}`);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Case Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Initialize New Investigation Case"
        subtitle="Create an official forensic dossier to ingest and correlate email threat telemetry."
      >
        <form onSubmit={handleCreateCase} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Case Title / Incident Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Suspicious Account Password Reset Lure"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Description & Initial Triage Context
            </label>
            <textarea
              rows="3"
              placeholder="Provide background telemetry, reporting user, or target department..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Priority Level
            </label>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="CRITICAL">Critical (Active Exfiltration / Credential Phish)</option>
              <option value="HIGH">High (Targeted Spear-Phishing / Malware)</option>
              <option value="MEDIUM">Medium (Suspicious Unverified)</option>
              <option value="LOW">Low (Routine Triage)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isCreating ? 'Creating Case...' : 'Create Case & Proceed'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CasesPage;
