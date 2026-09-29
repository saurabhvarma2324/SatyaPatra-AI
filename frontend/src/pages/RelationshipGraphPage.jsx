import React, { useState, useEffect } from 'react';
import { Network, Layers, Sparkles, FolderLock } from 'lucide-react';
import { casesAPI, graphAPI } from '../services/api';
import { GraphViewer } from '../components/graph/GraphViewer';

export const RelationshipGraphPage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('CASE-2026-001');
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    casesAPI.getCases().then(res => {
      if (res.data?.data) {
        setCases(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedCaseId(res.data.data[0].caseId);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedCaseId) return;
    setLoading(true);
    graphAPI.getGraphByCaseId(selectedCaseId)
      .then(res => {
        if (res.data?.graph) setGraphData(res.data.graph);
      })
      .catch(err => console.warn('Error loading graph:', err))
      .finally(() => setLoading(false));
  }, [selectedCaseId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Forensic Relationship Graph Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Network topology correlating Senders, Recipients, Embedded URLs, Resolving Domains, Origin IPs, and Attachments.
          </p>
        </div>

        {/* Case Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Case:</label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
          >
            {cases.map((c) => (
              <option key={c.caseId} value={c.caseId}>
                {c.caseId} - {c.title.substring(0, 30)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 animate-pulse font-mono">
          Generating NetworkX relationship graph...
        </div>
      ) : (
        <GraphViewer graphData={graphData} height="650px" />
      )}
    </div>
  );
};

export default RelationshipGraphPage;
