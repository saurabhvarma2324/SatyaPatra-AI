import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { History, Shield, Search, RefreshCw, ExternalLink, Filter, UserCheck, Lock } from 'lucide-react';

const ACTION_COLORS = {
  USER_LOGIN: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  USER_SIGNUP: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  APPLICATION_CREATED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  DOCUMENT_UPLOADED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  DOCUMENT_VIEWED: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  VERIFICATION_TRIGGERED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  OFFICER_DECISION: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  REPORT_EXPORTED_PDF: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  SCHEME_CREATED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
};

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/audit-logs', {
        params: { action: actionFilter !== 'all' ? actionFilter : undefined }
      });
      if (res.data?.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
            <span>Compliance Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of every document view, verification run, and officer decision
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1 sm:flex-none"
          >
            <option value="all">All Actions</option>
            <option value="OFFICER_DECISION">Officer Decisions</option>
            <option value="DOCUMENT_VIEWED">Document Views</option>
            <option value="VERIFICATION_TRIGGERED">Verification Runs</option>
            <option value="APPLICATION_CREATED">Application Created</option>
            <option value="USER_LOGIN">User Logins</option>
          </select>
          <button
            onClick={fetchLogs}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition shrink-0"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 sm:px-5 py-3.5">Timestamp</th>
                <th className="px-4 sm:px-5 py-3.5">Action</th>
                <th className="px-4 sm:px-5 py-3.5">Officer / Actor</th>
                <th className="px-4 sm:px-5 py-3.5">Target Application</th>
                <th className="px-4 sm:px-5 py-3.5">Event Metadata</th>
                <th className="px-4 sm:px-5 py-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <Shield className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-slate-300">No audit records found.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 sm:px-5 py-3 sm:py-3.5 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border whitespace-nowrap ${
                        ACTION_COLORS[log.action] || 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                      <span className="font-semibold text-slate-200 block">{log.userName || 'System'}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{log.role}</span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                      {log.targetApplicationId ? (
                        <Link
                          to={`/applications/${log.targetApplicationId._id || log.targetApplicationId}`}
                          className="inline-flex items-center gap-1 font-mono text-indigo-400 hover:text-indigo-300 font-bold whitespace-nowrap"
                        >
                          <span>{log.targetApplicationId.applicationNumber || 'View Dossier'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-3.5 max-w-xs truncate font-mono text-[11px] text-slate-300">
                      {JSON.stringify(log.details)}
                    </td>
                    <td className="px-4 sm:px-5 py-3 sm:py-3.5 font-mono text-slate-400 whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
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

export default AuditLogPage;
