import React, { useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, AlertTriangle, ShieldAlert, Layers, Info, CheckCircle2, ChevronRight, X } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export const NetworkGraph = ({ 
  primaryAccountId = 'ACC-10082',
  onNodeSelect,
  highlightSuspiciousPath = true,
  customNodes = null,
  customEdges = null,
}) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCircularOnly, setShowCircularOnly] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Default graph topology for investigation demo (CASE-1042 / ACC-10082)
  const defaultNodes = useMemo(() => [
    { id: 'ACC-10082', name: 'Apex Global Logistics Pvt Ltd', type: 'primary', riskScore: 91, balance: '₹48.5L', inVol: '₹16.5L', outVol: '₹37.6L', conns: 5, firstSeen: '2023-03-12', lastActive: '2 min ago', x: 260, y: 180, isCycle: true },
    { id: 'ACC-10211', name: 'Vanguard Trading Hub', type: 'high-risk', riskScore: 84, balance: '₹14.2L', inVol: '₹9.8L', outVol: '₹9.5L', conns: 3, firstSeen: '2024-01-15', lastActive: '12 min ago', x: 490, y: 80, isCycle: true },
    { id: 'ACC-10542', name: 'Zenith Multi-Ventures', type: 'high-risk', riskScore: 87, balance: '₹8.9L', inVol: '₹9.5L', outVol: '₹9.2L', conns: 3, firstSeen: '2024-06-02', lastActive: '25 min ago', x: 700, y: 160, isCycle: true },
    { id: 'ACC-10881', name: 'Kavya Digital Solutions', type: 'new-account', riskScore: 89, balance: '₹3.2L', inVol: '₹9.2L', outVol: '₹8.8L', conns: 4, firstSeen: '2025-11-20', lastActive: '40 min ago', x: 620, y: 320, isCycle: true },
    { id: 'ACC-10900', name: 'BlueStar Export Impex', type: 'high-risk', riskScore: 78, balance: '₹6.5L', inVol: '₹8.8L', outVol: '₹8.5L', conns: 2, firstSeen: '2025-12-05', lastActive: '2h ago', x: 380, y: 350, isCycle: true },
    { id: 'ACC-10004', name: 'TechCraft Innovations LLP', type: 'connected', riskScore: 28, balance: '₹34.0L', inVol: '₹4.5L', outVol: '₹8.0L', conns: 2, firstSeen: '2022-09-01', lastActive: '10h ago', x: 120, y: 320, isCycle: false },
    { id: 'ACC-10002', name: 'Rahul Sharma', type: 'connected', riskScore: 18, balance: '₹92K', inVol: '₹50K', outVol: '₹12K', conns: 1, firstSeen: '2021-04-15', lastActive: '6h ago', x: 120, y: 70, isCycle: false },
  ], []);

  const defaultEdges = useMemo(() => [
    { from: 'ACC-10082', to: 'ACC-10211', amount: '₹98,500', time: '8m ago', type: 'NEFT', isSuspicious: true, isCycle: true },
    { from: 'ACC-10211', to: 'ACC-10542', amount: '₹95,000', time: '18m ago', type: 'RTGS', isSuspicious: true, isCycle: true },
    { from: 'ACC-10542', to: 'ACC-10881', amount: '₹92,000', time: '32m ago', type: 'IMPS', isSuspicious: true, isCycle: true },
    { from: 'ACC-10881', to: 'ACC-10900', amount: '₹88,000', time: '45m ago', type: 'NEFT', isSuspicious: true, isCycle: true },
    { from: 'ACC-10900', to: 'ACC-10082', amount: '₹85,000', time: '58m ago', type: 'RTGS', isSuspicious: true, isCycle: true },
    { from: 'ACC-10082', to: 'ACC-10004', amount: '₹4,50,000', time: '2h ago', type: 'RTGS', isSuspicious: false, isCycle: false },
    { from: 'ACC-10004', to: 'ACC-10082', amount: '₹8,00,000', time: '5h ago', type: 'RTGS', isSuspicious: false, isCycle: false },
    { from: 'ACC-10002', to: 'ACC-10082', amount: '₹50,000', time: '6h ago', type: 'UPI', isSuspicious: false, isCycle: false },
  ], []);

  const nodes = customNodes || defaultNodes;
  const edges = customEdges || defaultEdges;

  const filteredEdges = showCircularOnly ? edges.filter(e => e.isCycle) : edges;

  const getNodeColor = (type) => {
    switch (type) {
      case 'primary': return { bg: '#4C1D95', border: '#7C3AED', text: '#FFFFFF', label: 'Primary' }; // Deep Purple
      case 'high-risk': return { bg: '#991B1B', border: '#EF4444', text: '#FFFFFF', label: 'High Risk' }; // Red
      case 'new-account': return { bg: '#C2410C', border: '#F97316', text: '#FFFFFF', label: 'New Account' }; // Orange
      case 'connected':
      default:
        return { bg: '#1E40AF', border: '#3B82F6', text: '#FFFFFF', label: 'Connected' }; // Blue
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (onNodeSelect) onNodeSelect(node);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNode(null);
    setShowCircularOnly(false);
  };

  return (
    <div className="relative w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex flex-col min-h-[540px]">
      {/* Graph Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Layers className="w-4 h-4 text-brand-400" />
            <span>Interactive Network Flow Visualizer</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <button
            onClick={() => setShowCircularOnly(prev => !prev)}
            className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
              showCircularOnly 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {showCircularOnly ? 'Showing Circular Loop Only' : 'Highlight Circular Pattern'}
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 border border-slate-700">
          <button 
            onClick={() => setZoomLevel(z => Math.min(1.6, z + 0.15))}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="px-1 text-slate-400 font-mono text-[11px]">{Math.round(zoomLevel * 100)}%</span>
          <button 
            onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.15))}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={resetView}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden cursor-grab active:cursor-grabbing">
        <svg 
          className="w-full h-full min-h-[460px]"
          viewBox="0 0 850 480"
          style={{ transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`, transformOrigin: 'center' }}
        >
          <defs>
            {/* Arrow Marker */}
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
            </marker>
            <marker id="arrow-suspicious" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
            </marker>
            <marker id="arrow-cycle" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#F43F5E" />
            </marker>
          </defs>

          {/* Render Directed Edges */}
          {filteredEdges.map((edge, idx) => {
            const src = nodes.find(n => n.id === edge.from);
            const dst = nodes.find(n => n.id === edge.to);
            if (!src || !dst) return null;

            const isCycleEdge = edge.isCycle;
            const strokeColor = isCycleEdge ? '#F43F5E' : edge.isSuspicious ? '#EF4444' : '#64748B';
            const strokeWidth = isCycleEdge ? 2.5 : edge.isSuspicious ? 2 : 1.5;
            const marker = isCycleEdge ? 'url(#arrow-cycle)' : edge.isSuspicious ? 'url(#arrow-suspicious)' : 'url(#arrow)';

            // Compute midpoint for edge badge
            const midX = (src.x + dst.x) / 2;
            const midY = (src.y + dst.y) / 2;

            return (
              <g key={idx} className="transition-all">
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={dst.x}
                  y2={dst.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isCycleEdge ? '4 3' : 'none'}
                  markerEnd={marker}
                  className={isCycleEdge ? 'animate-pulse' : ''}
                />
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-40"
                    y="-12"
                    width="80"
                    height="24"
                    rx="4"
                    fill="#0F172A"
                    stroke={strokeColor}
                    strokeWidth="1"
                    className="shadow"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#F1F5F9"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {edge.amount}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const style = getNodeColor(node.type);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Outer halo when selected or high risk */}
                {isSelected && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    className="animate-spin"
                  />
                )}
                {node.isCycle && (
                  <circle
                    r="28"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}

                {/* Node circle */}
                <circle
                  r="24"
                  fill={style.bg}
                  stroke={style.border}
                  strokeWidth="2.5"
                  className="transition-transform duration-200 group-hover:scale-110 shadow-lg"
                />

                {/* Node Icon / Text */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={style.text}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {node.riskScore}
                </text>

                {/* Account Label Below */}
                <g transform="translate(0, 36)">
                  <rect
                    x="-48"
                    y="-9"
                    width="96"
                    height="18"
                    rx="3"
                    fill="#0F172A"
                    fillOpacity="0.85"
                    stroke="#334155"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#E2E8F0"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {node.id}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-sm border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 space-y-1.5 shadow-lg">
          <div className="font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-brand-400" /> Graph Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-900 border border-purple-400" />
            <span>Primary Account</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-900 border border-red-500" />
            <span>High-Risk Account</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-700 border border-orange-400" />
            <span>New Account (&lt;30d)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-900 border border-blue-400" />
            <span>Connected Counterparty</span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 w-80 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-slate-200 shadow-2xl z-20 animate-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider">Inspected Entity</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedNode.id}</h4>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">{selectedNode.name}</p>
              </div>
              <button 
                onClick={() => setSelectedNode(null)} 
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400">Risk Assessment:</span>
                <RiskBadge 
                  level={selectedNode.riskScore >= 90 ? 'CRITICAL' : selectedNode.riskScore >= 70 ? 'HIGH' : 'MEDIUM'} 
                  score={selectedNode.riskScore}
                  size="sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block">Total Inflow</span>
                  <span className="font-bold text-emerald-400 font-mono">{selectedNode.inVol || '₹18.4L'}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block">Total Outflow</span>
                  <span className="font-bold text-rose-400 font-mono">{selectedNode.outVol || '₹32.1L'}</span>
                </div>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="font-semibold text-white font-mono">{selectedNode.balance}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Connected Nodes:</span>
                  <span className="font-semibold text-white">{selectedNode.conns} accounts</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">First Seen:</span>
                  <span className="text-slate-300 font-mono">{selectedNode.firstSeen}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Last Activity:</span>
                  <span className="text-slate-300">{selectedNode.lastActive}</span>
                </div>
              </div>

              {selectedNode.isCycle && (
                <div className="bg-rose-950/40 border border-rose-500/40 p-2 rounded-lg text-rose-300 text-[11px] flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Participant in identified circular routing chain.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Network Insights Footer */}
      <div className="bg-slate-950 border-t border-slate-800 p-3.5">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-brand-400" />
          <span>Automated Network Insights</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-400">
          <div className="bg-slate-900/90 p-2 rounded border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span><strong>5</strong> connected accounts detected</span>
          </div>
          <div className="bg-slate-900/90 p-2 rounded border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span><strong>2</strong> high-risk relationships</span>
          </div>
          <div className="bg-slate-900/90 p-2 rounded border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span><strong>1</strong> circular pattern detected</span>
          </div>
          <div className="bg-slate-900/90 p-2 rounded border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span><strong>3</strong> newly established relationships</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 italic">
          *Network topology findings indicate potentially suspicious transaction patterns; require investigator verification.
        </p>
      </div>
    </div>
  );
};

export default NetworkGraph;
