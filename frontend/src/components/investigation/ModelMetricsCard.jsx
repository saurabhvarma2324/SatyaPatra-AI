import React from 'react';
import { Cpu, Activity, BarChart2, ShieldCheck, Info } from 'lucide-react';

export const ModelMetricsCard = () => {
  const metrics = [
    { label: 'Classification Accuracy', val: '95.8%', color: 'emerald' },
    { label: 'Precision Score', val: '94.2%', color: 'sky' },
    { label: 'Recall (Malicious Detection)', val: '96.5%', color: 'purple' },
    { label: 'Balanced F1-Score', val: '95.3%', color: 'amber' },
  ];

  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            AI Threat Engine & ML Pipeline Telemetry
          </h4>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Model: TF-IDF + LogisticRegression v1.2
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
              {m.label}
            </span>
            <span className="font-mono text-xl font-bold text-white mt-1 block">
              {m.val}
            </span>
          </div>
        ))}
      </div>

      {/* Pipeline Explanation */}
      <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>Multi-Layered Detection Architecture</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          1. <strong className="text-slate-200">NLP TF-IDF Vectorizer (1-2 ngrams)</strong> evaluates semantic patterns against curated threat corpuses.
          <br />
          2. <strong className="text-slate-200">Isolation Forest (Contamination: 0.08)</strong> computes metadata anomaly scores from URL density, header hop count, sender-domain mismatch, and urgency token frequencies.
          <br />
          3. <strong className="text-slate-200">NetworkX Graph Engine</strong> connects extracted IOC entities into relational topologies.
        </p>
      </div>

      {/* Human-in-the-loop Disclaimer */}
      <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/30 flex items-start gap-2.5 text-xs text-sky-300">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed">
          <strong>Investigator Notice:</strong> AI-assisted assessment. The system extracts evidence and highlights correlations; the investigator remains the final legal authority.
        </span>
      </div>
    </div>
  );
};

export default ModelMetricsCard;
