import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShieldAlert, Globe, Server, Link2, FileWarning, ArrowRight, Layers, ExternalLink } from 'lucide-react';
import { iocsAPI } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';

export const IOCIntelligencePage = () => {
  const [iocs, setIocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const navigate = useNavigate();

  const fetchIOCs = async () => {
    setLoading(true);
    try {
      const res = await iocsAPI.getIOCs({
        search: search || undefined,
        type: typeFilter,
        risk: riskFilter
      });
      if (res.data?.data) {
        setIocs(res.data.data);
      }
    } catch (err) {
      console.warn('Error loading IOCs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIOCs();
  }, [search, typeFilter, riskFilter]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          <span>Global IOC Threat Intelligence Hub</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Search, filter, and inspect forensic Indicators of Compromise extracted across all investigated email campaigns.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search indicator value, case ID, source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase font-bold text-slate-400 shrink-0">Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full py-2 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All IOC Types</option>
            <option value="ip">IP Addresses</option>
            <option value="domain">Domains</option>
            <option value="url">URLs</option>
            <option value="hash">File Hashes (SHA256/MD5)</option>
            <option value="email">Email Addresses</option>
            <option value="attachment">Attachments</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase font-bold text-slate-400 shrink-0">Severity:</label>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full py-2 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Threat Severities</option>
            <option value="SAFE">Safe / Clean</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="HIGH">High Threat</option>
            <option value="CRITICAL">Critical Malicious</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-3.5 pl-4">Type</th>
                <th className="py-3.5">Indicator Value</th>
                <th className="py-3.5">Extracted Source</th>
                <th className="py-3.5">Threat Severity</th>
                <th className="py-3.5">Status Description</th>
                <th className="py-3.5">Linked Case</th>
                <th className="py-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 animate-pulse font-sans">
                    Searching forensic IOC database...
                  </td>
                </tr>
              ) : iocs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 font-sans">
                    No IOCs found matching query.
                  </td>
                </tr>
              ) : (
                iocs.map((ioc, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                        {ioc.type}
                      </span>
                    </td>
                    <td className="py-3 text-white truncate max-w-sm font-semibold">
                      {ioc.value}
                    </td>
                    <td className="py-3 text-slate-400 font-sans text-xs">
                      {ioc.source}
                    </td>
                    <td className="py-3 font-sans">
                      <RiskBadge level={ioc.risk} size="sm" showScore={false} />
                    </td>
                    <td className="py-3 text-slate-300 font-sans text-xs">
                      {ioc.status}
                    </td>
                    <td className="py-3 text-sky-400 font-bold">
                      {ioc.caseId}
                    </td>
                    <td className="py-3 pr-4 text-right font-sans">
                      <button
                        onClick={() => navigate(`/cases/${ioc.caseId}?tab=iocs`)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                      >
                        <span>Case Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
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

export default IOCIntelligencePage;
