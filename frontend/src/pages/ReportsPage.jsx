import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Printer, ArrowRight, FolderLock, ShieldCheck } from 'lucide-react';
import { reportsAPI } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    reportsAPI.getAllReports()
      .then(res => {
        if (res.data?.data) setReports(res.data.data);
      })
      .catch(err => console.warn('Error loading reports:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>Forensic Investigation Reports Hub</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Exportable, audit-ready forensic intelligence dossiers with digital investigator sign-off blocks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 animate-pulse font-mono">
            Loading generated forensic dossiers...
          </div>
        ) : (
          reports.map((rep) => (
            <div
              key={rep.caseId}
              onClick={() => navigate(`/cases/${rep.caseId}?tab=report`)}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400">{rep.caseId}</span>
                  <RiskBadge level={rep.threatLevel || 'HIGH'} score={rep.riskScore} size="sm" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {rep.title}
                </h3>
                <div className="flex items-center gap-2 pt-1">
                  <StatusBadge status={rep.status} />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  {rep.generatedBy || 'Dr. Alok Verma'}
                </span>
                <span className="font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View & Export PDF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
