import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, statsRes, schemeRes] = await Promise.all([
        api.get('/applications', {
          params: {
            search,
            riskLevel: riskFilter !== 'all' ? riskFilter : undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            schemeId: schemeFilter !== 'all' ? schemeFilter : undefined
          }
        }),
        api.get('/applications/stats/summary'),
        api.get('/schemes')
      ]);

      if (appRes.data?.success) setApplications(appRes.data.applications);
      if (statsRes.data?.success) setStats(statsRes.data.stats);
      if (schemeRes.data?.success) setSchemes(schemeRes.data.schemes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [riskFilter, statusFilter, schemeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const getRiskBadge = (score, level) => {
    if (level === 'HIGH' || score >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold font-mono whitespace-nowrap">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          {score} &bull; HIGH
        </span>
      );
    }
    if (level === 'MEDIUM' || score >= 35) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {score} &bull; MEDIUM
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono whitespace-nowrap">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        {score} &bull; LOW
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 text-xs font-semibold whitespace-nowrap">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/15 text-red-300 text-xs font-semibold whitespace-nowrap">
            <XCircle className="w-3.5 h-3.5 shrink-0" /> Rejected
          </span>
        );
      case 'resubmission_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 text-xs font-semibold whitespace-nowrap">
            <RefreshCw className="w-3.5 h-3.5 shrink-0" /> Resubmit Requested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-300 text-xs font-semibold whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 shrink-0" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Officer Verification Portal</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Scheduled Tribe Scholarship &bull; Automated Document Cross-Examination &amp; Triage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/demo-tester"
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Test Sandbox</span>
          </Link>
          <button
            onClick={fetchData}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition shrink-0"
            title="Refresh Records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Ingested */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">Total Ingested</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white mt-1.5 sm:mt-2 font-mono">
            {stats?.total || applications.length}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Active ST schemes</span>
        </div>

        {/* Pending Review */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1.5 sm:mt-2 font-mono">
            {stats?.pending ?? applications.filter(a => ['submitted', 'under_review'].includes(a.status)).length}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Awaiting sign-off</span>
        </div>

        {/* High Risk Flags */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-red-500/30 shadow-md bg-red-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-red-300">High Risk Flags</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-red-400 mt-1.5 sm:mt-2 font-mono">
            {stats?.riskDistribution?.high ?? applications.filter(a => a.riskLevel === 'HIGH').length}
          </p>
          <span className="text-[10px] text-red-400/80 mt-0.5 block truncate">Critical fraud / mismatch</span>
        </div>

        {/* Approved Dossiers */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-md bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-emerald-300">Verified &amp; Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1.5 sm:mt-2 font-mono">
            {stats?.approved ?? applications.filter(a => a.status === 'approved').length}
          </p>
          <span className="text-[10px] text-emerald-400/80 mt-0.5 block truncate">Approved disbursements</span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by applicant name, app # or college..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition"
          />
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full"
          >
            <option value="all">All Risk Levels</option>
            <option value="HIGH">High Risk (70-100)</option>
            <option value="MEDIUM">Medium Risk (35-69)</option>
            <option value="LOW">Low Risk (0-34)</option>
          </select>

          {/* Scheme Filter */}
          <select
            value={schemeFilter}
            onChange={(e) => setSchemeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full truncate"
          >
            <option value="all">All Schemes</option>
            {schemes.map(s => (
              <option key={s._id} value={s._id}>{s.code} - {s.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="resubmission_requested">Resubmit Requested</option>
          </select>
        </div>
      </div>

      {/* Applications Table with Mobile Card Fallback */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 sm:px-5 py-3.5">Application No.</th>
                <th className="px-4 sm:px-5 py-3.5">Applicant &amp; Tribe</th>
                <th className="px-4 sm:px-5 py-3.5">Scheme</th>
                <th className="px-4 sm:px-5 py-3.5">Declared Income</th>
                <th className="px-4 sm:px-5 py-3.5">AI Risk Score</th>
                <th className="px-4 sm:px-5 py-3.5">Status</th>
                <th className="px-4 sm:px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    Loading scholarship verification records...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-slate-300">No applications match current filters.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the filter criteria or submitting a test case.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 sm:px-5 py-3.5 sm:py-4 font-mono font-bold text-slate-200 whitespace-nowrap">
                      {app.applicationNumber}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                      <div className="font-semibold text-slate-100">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-400">
                        {app.subTribe || 'ST'} &bull; {app.course}
                      </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                      <span className="font-medium text-slate-300">{app.schemeId?.name || 'ST Higher Education Scheme'}</span>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{app.institution}</div>
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 sm:py-4 font-mono font-medium text-slate-200 whitespace-nowrap">
                      ₹{app.income?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                      {getRiskBadge(app.riskScore, app.riskLevel)}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 sm:py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/applications/${app._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Examine Dossier</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
