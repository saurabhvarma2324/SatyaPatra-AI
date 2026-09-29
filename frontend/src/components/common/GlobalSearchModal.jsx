import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Globe, Server, Link2, ShieldAlert, ArrowRight } from 'lucide-react';
import { casesAPI, iocsAPI } from '../../services/api';
import { useCase } from '../../context/CaseContext';
import { RiskBadge } from './RiskBadge';

export const GlobalSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen } = useCase();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ cases: [], iocs: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (!query.trim() || !isSearchOpen) {
      setResults({ cases: [], iocs: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [casesRes, iocsRes] = await Promise.all([
          casesAPI.getCases({ search: query }),
          iocsAPI.getIOCs({ search: query })
        ]);
        setResults({
          cases: casesRes.data?.data || [],
          iocs: iocsRes.data?.data || []
        });
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSelectCase = (caseId) => {
    setIsSearchOpen(false);
    navigate(`/cases/${caseId}`);
  };

  const handleSelectIOC = (caseId) => {
    setIsSearchOpen(false);
    navigate(`/cases/${caseId}?tab=iocs`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            placeholder="Search cases, senders, IPs, domains, hashes, or IOCs... (Press ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
              Searching forensic telemetry...
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="py-8 text-center text-xs text-slate-500">
              Type a Case ID (e.g. <span className="font-mono text-sky-400">CASE-2026-001</span>), IP address, domain, or sender to search.
            </div>
          )}

          {!loading && query.trim() && results.cases.length === 0 && results.iocs.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching forensic artifacts found for "{query}".
            </div>
          )}

          {/* Cases Results */}
          {results.cases.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                Investigation Cases ({results.cases.length})
              </div>
              <div className="space-y-1">
                {results.cases.map((c) => (
                  <button
                    key={c.caseId}
                    onClick={() => handleSelectCase(c.caseId)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-center justify-between group transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-sky-400">{c.caseId}</span>
                        <RiskBadge level={c.threatLevel} score={c.riskScore} size="sm" showScore={false} />
                      </div>
                      <p className="text-sm font-medium text-slate-200 truncate mt-0.5">{c.title}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* IOC Results */}
          {results.iocs.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Extracted IOCs ({results.iocs.length})
              </div>
              <div className="space-y-1">
                {results.iocs.map((ioc, idx) => (
                  <button
                    key={ioc.id || idx}
                    onClick={() => handleSelectIOC(ioc.caseId)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-center justify-between group transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {ioc.type}
                        </span>
                        <span className="font-mono text-xs text-slate-200 truncate">{ioc.value}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">Found in Case {ioc.caseId} &bull; {ioc.source}</p>
                    </div>
                    <RiskBadge level={ioc.risk} size="sm" showScore={false} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">↓</kbd> to navigate</span>
          <span className="font-mono text-cyan-400">MailDrishti Forensic Telemetry</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
