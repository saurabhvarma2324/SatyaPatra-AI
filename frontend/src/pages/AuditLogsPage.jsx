import React, { useState } from 'react';
import { History, Search, Download, ShieldCheck, UserCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AuditLogsPage = () => {
  const { auditLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Log ID,Timestamp,Investigator,Action,Case ID,IP Address,Details\n" +
      auditLogs.map(l => `${l.id},${l.timestamp},"${l.user}","${l.action}",${l.caseId},${l.ipAddress},"${l.details}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ArthaDrishti_AuditLogs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Investigator Audit Trail</h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable chronological record of analyst examinations, exports, and status transitions for judicial accountability.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, investigator, Case ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">{filteredLogs.length} logged events</span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Investigator / User</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Target Dossier</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}{' '}
                    <span className="text-slate-400 text-[10px]">({new Date(log.timestamp).toLocaleDateString()})</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {log.user.split('(')[0].trim()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-800 font-medium font-mono text-[11px] border border-brand-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {log.caseId}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
