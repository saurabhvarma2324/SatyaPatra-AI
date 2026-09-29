import React, { useState } from 'react';
import { Network, Search, Filter, ShieldAlert, Sparkles, AlertTriangle, Layers, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import NetworkGraph from '../components/graph/NetworkGraph';

export const NetworkAnalysisPage = () => {
  const { accounts } = useData();
  const [selectedAccountId, setSelectedAccountId] = useState('ACC-10082');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Network & Graph Intelligence</h2>
          <p className="text-xs text-slate-500 mt-1">
            Detect complex layering structures, rapid fund dispersal, and directed circular loops across accounts.
          </p>
        </div>

        {/* Account Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Focus Account:</span>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-brand-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="ACC-10082">ACC-10082 (Apex Global Logistics - Flagship Cycle)</option>
            <option value="ACC-10145">ACC-10145 (Rapid Flow Financials - Structuring)</option>
            <option value="ACC-10332">ACC-10332 (Devendra Kumar - Reactivation)</option>
            <option value="ACC-10021">ACC-10021 (Enterprise #21 - Fan-out)</option>
          </select>
        </div>
      </div>

      {/* Main Graph Component */}
      <NetworkGraph primaryAccountId={selectedAccountId} />

      {/* Methodological Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>Layer 1: Centrality Metrics</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Evaluates in-degree and out-degree ratios to distinguish between legitimate merchant clearing and rapid pass-through conduit behavior.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Layer 2: Cycle Detection</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Applies NetworkX Johnson's and Tarjan's algorithms to uncover directed fund loops returning to originating beneficial entities.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Layer 3: Temporal Velocity</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Correlates inter-hop timestamp deltas to identify automated bot sweeps versus natural business processing schedules.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkAnalysisPage;
