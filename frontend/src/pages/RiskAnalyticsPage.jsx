import React, { useState } from 'react';
import { Sliders, RotateCcw, AlertTriangle, ShieldCheck, Info, Check, Sparkles, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import RiskScoreCard from '../components/common/RiskScoreCard';
import RiskBadge from '../components/common/RiskBadge';

export const RiskAnalyticsPage = () => {
  const { riskWeights, setRiskWeights, calculateRiskScore } = useData();

  const [weights, setLocalWeights] = useState(riskWeights);
  const [sampleSignals, setSampleSignals] = useState({
    behaviour: 85,
    velocity: 95,
    network: 92,
    amount: 70,
    historicalDeviation: 88,
  });

  const totalWeight = weights.behaviour + weights.velocity + weights.network + weights.amount + weights.historicalDeviation;
  const simulatedScore = calculateRiskScore(sampleSignals, weights);

  const handleWeightChange = (key, val) => {
    const num = parseInt(val, 10) || 0;
    setLocalWeights(prev => ({ ...prev, [key]: num }));
  };

  const handleSignalChange = (key, val) => {
    const num = parseInt(val, 10) || 0;
    setSampleSignals(prev => ({ ...prev, [key]: num }));
  };

  const saveWeights = () => {
    setRiskWeights(weights);
  };

  const resetWeights = () => {
    const defaults = { behaviour: 30, velocity: 25, network: 20, amount: 15, historicalDeviation: 10 };
    setLocalWeights(defaults);
    setRiskWeights(defaults);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Risk Analytics & Heuristic Scoring Engine</h2>
          <p className="text-xs text-slate-500 mt-1">
            Explainable multi-signal fusion model with configurable weighting vectors.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetWeights}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>
          <button
            onClick={saveWeights}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply Weightings</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Simulation & Calculated Score */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Simulated Composite Output</h3>
              <RiskBadge level={simulatedScore >= 90 ? 'CRITICAL' : simulatedScore >= 70 ? 'HIGH' : simulatedScore >= 40 ? 'MEDIUM' : 'LOW'} score={simulatedScore} />
            </div>

            <div className="text-center py-4">
              <span className="text-5xl font-black text-slate-900 font-mono">{simulatedScore}</span>
              <span className="text-slate-400 text-sm font-bold ml-1">/ 100</span>
              <p className="text-xs text-slate-500 mt-2">
                Based on current normalized signal weights (Total: {totalWeight}%)
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 font-mono">
              <span className="font-bold text-slate-900 block font-sans">Scoring Formula Equation:</span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Risk Score = ({weights.behaviour}% &times; Behaviour) + ({weights.velocity}% &times; Velocity) + ({weights.network}% &times; Network) + ({weights.amount}% &times; Amount) + ({weights.historicalDeviation}% &times; Deviation)
              </p>
            </div>
          </div>

          {/* Ethical Disclaimer */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Prototype Scoring Disclaimer</span>
            </div>
            <p className="text-amber-800/90 text-[11px] leading-relaxed">
              These heuristic weights represent student prototype heuristics for demonstration and are not statutory banking regulations. Final fraud determinations must be performed by human compliance officers.
            </p>
          </div>
        </div>

        {/* Right: Interactive Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Configurable Weight Allocations</h3>
              <p className="text-xs text-slate-500">Adjust the relative influence of individual intelligence signals</p>
            </div>

            <div className="space-y-5">
              {[
                { key: 'behaviour', label: 'Behaviour Intelligence', desc: 'Sudden deviations from operational patterns and off-hours activity', defaultW: 30 },
                { key: 'velocity', label: 'Transaction Velocity', desc: 'Frequency spikes and rapid consecutive settlement bursts', defaultW: 25 },
                { key: 'network', label: 'Network Connectivity', desc: 'Multi-hop fan-out, conduit layering, and circular topologies', defaultW: 20 },
                { key: 'amount', label: 'Amount Anomaly & Structuring', desc: 'Amounts clustering just beneath regulatory reporting ceilings', defaultW: 15 },
                { key: 'historicalDeviation', label: 'Historical Baseline Deviation', desc: 'Statistical Z-score variance against 90-day moving averages', defaultW: 10 },
              ].map((item) => (
                <div key={item.key} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{item.label}</span>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="font-mono font-extrabold text-brand-700 text-sm">{weights[item.key]}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={weights[item.key]}
                    onChange={(e) => handleWeightChange(item.key, e.target.value)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalyticsPage;
