import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  FolderLock,
  Mail,
  User,
  UserCheck,
  Link2,
  Globe,
  Server,
  MapPin,
  Paperclip,
  FileWarning,
  X,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

// Custom Nodes
const CaseNode = ({ data }) => (
  <div className="px-4 py-3 rounded-xl bg-slate-900 border-2 border-sky-500/80 shadow-lg shadow-sky-950/50 min-w-[170px] text-left">
    <Handle type="source" position={Position.Right} className="!bg-sky-400 !w-2.5 !h-2.5" />
    <div className="flex items-center gap-2 mb-1">
      <FolderLock className="w-4 h-4 text-sky-400" />
      <span className="font-mono text-xs font-bold text-sky-300">{data.label}</span>
    </div>
    <div className="text-[11px] text-slate-300 truncate">{data.title || 'Investigation Case'}</div>
  </div>
);

const EmailNode = ({ data }) => (
  <div className="px-4 py-3 rounded-xl bg-slate-900 border-2 border-amber-500/80 shadow-lg shadow-amber-950/50 min-w-[180px] text-left">
    <Handle type="target" position={Position.Left} className="!bg-amber-400 !w-2.5 !h-2.5" />
    <Handle type="source" position={Position.Right} className="!bg-amber-400 !w-2.5 !h-2.5" />
    <div className="flex items-center gap-2 mb-1">
      <Mail className="w-4 h-4 text-amber-400" />
      <span className="text-xs font-bold text-amber-300 truncate">Email Artifact</span>
    </div>
    <div className="text-[11px] text-slate-200 font-medium truncate">{data.subject || data.label}</div>
  </div>
);

const SenderNode = ({ data }) => (
  <div className="px-3.5 py-2.5 rounded-lg bg-slate-900 border border-amber-500/40 min-w-[160px] text-left">
    <Handle type="target" position={Position.Left} className="!bg-amber-400" />
    <div className="flex items-center gap-1.5 mb-0.5">
      <User className="w-3.5 h-3.5 text-amber-400" />
      <span className="text-[10px] uppercase font-bold text-slate-400">Sender (From)</span>
    </div>
    <div className="text-xs font-mono text-slate-200 truncate">{data.label}</div>
  </div>
);

const RecipientNode = ({ data }) => (
  <div className="px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 min-w-[160px] text-left">
    <Handle type="target" position={Position.Left} className="!bg-slate-400" />
    <div className="flex items-center gap-1.5 mb-0.5">
      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-[10px] uppercase font-bold text-slate-400">Recipient (To)</span>
    </div>
    <div className="text-xs font-mono text-slate-200 truncate">{data.label}</div>
  </div>
);

const UrlNode = ({ data }) => (
  <div className="px-3.5 py-2.5 rounded-lg bg-rose-950/30 border border-rose-500/50 min-w-[170px] text-left">
    <Handle type="target" position={Position.Left} className="!bg-rose-400" />
    <Handle type="source" position={Position.Right} className="!bg-rose-400" />
    <div className="flex items-center justify-between gap-1 mb-0.5">
      <div className="flex items-center gap-1">
        <Link2 className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-[10px] uppercase font-bold text-rose-400">Embedded Link</span>
      </div>
      <RiskBadge level={data.risk || 'HIGH'} size="sm" showScore={false} />
    </div>
    <div className="text-xs font-mono text-rose-200 truncate">{data.label}</div>
  </div>
);

const DomainNode = ({ data }) => (
  <div className="px-3.5 py-2.5 rounded-lg bg-orange-950/20 border border-orange-500/40 min-w-[160px] text-left">
    <Handle type="target" position={Position.Left} className="!bg-orange-400" />
    <Handle type="source" position={Position.Right} className="!bg-orange-400" />
    <div className="flex items-center gap-1.5 mb-0.5">
      <Globe className="w-3.5 h-3.5 text-orange-400" />
      <span className="text-[10px] uppercase font-bold text-orange-300">Domain</span>
    </div>
    <div className="text-xs font-mono text-slate-200 truncate">{data.label}</div>
  </div>
);

const IpNode = ({ data }) => (
  <div className="px-3.5 py-2.5 rounded-lg bg-purple-950/20 border border-purple-500/40 min-w-[160px] text-left">
    <Handle type="target" position={Position.Left} className="!bg-purple-400" />
    <Handle type="source" position={Position.Right} className="!bg-purple-400" />
    <div className="flex items-center justify-between gap-1 mb-0.5">
      <div className="flex items-center gap-1">
        <Server className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-[10px] uppercase font-bold text-purple-300">Resolved IP</span>
      </div>
    </div>
    <div className="text-xs font-mono text-purple-200 truncate">{data.label}</div>
  </div>
);

const GeoNode = ({ data }) => (
  <div className="px-3.5 py-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/40 min-w-[160px] text-left">
    <Handle type="target" position={Position.Left} className="!bg-emerald-400" />
    <div className="flex items-center gap-1.5 mb-0.5">
      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-[10px] uppercase font-bold text-emerald-300">GeoLocation</span>
    </div>
    <div className="text-xs font-medium text-emerald-200 truncate">{data.label}</div>
  </div>
);

const AttachmentNode = ({ data }) => (
  <div className="px-3.5 py-2.5 rounded-lg bg-rose-950/30 border border-rose-500/60 min-w-[160px] text-left">
    <Handle type="target" position={Position.Left} className="!bg-rose-400" />
    <div className="flex items-center gap-1.5 mb-0.5">
      <FileWarning className="w-3.5 h-3.5 text-rose-400" />
      <span className="text-[10px] uppercase font-bold text-rose-300">Attachment</span>
    </div>
    <div className="text-xs font-mono text-rose-200 truncate">{data.label}</div>
  </div>
);

const nodeTypes = {
  caseNode: CaseNode,
  emailNode: EmailNode,
  senderNode: SenderNode,
  recipientNode: RecipientNode,
  urlNode: UrlNode,
  domainNode: DomainNode,
  ipNode: IpNode,
  geoNode: GeoNode,
  attachmentNode: AttachmentNode
};

export const GraphViewer = ({ graphData, height = '550px' }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const initialNodes = useMemo(() => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
      return [
        { id: '1', type: 'caseNode', data: { label: 'CASE-2026-001', title: 'Phishing Case' }, position: { x: 50, y: 200 } },
        { id: '2', type: 'emailNode', data: { label: 'Urgent Security Alert' }, position: { x: 300, y: 200 } },
        { id: '3', type: 'urlNode', data: { label: 'sample-login.test', risk: 'CRITICAL' }, position: { x: 550, y: 200 } }
      ];
    }
    return graphData.nodes;
  }, [graphData]);

  const initialEdges = useMemo(() => {
    if (!graphData || !graphData.edges || graphData.edges.length === 0) {
      return [
        { id: 'e1-2', source: '1', target: '2', label: 'INVESTIGATES', animated: true },
        { id: 'e2-3', source: '2', target: '3', label: 'CONTAINS_URL' }
      ];
    }
    return graphData.edges.map(e => ({
      ...e,
      style: e.style || { stroke: '#64748b' },
      labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }
    }));
  }, [graphData]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col" style={{ height }}>
      {/* Top Banner */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold uppercase tracking-wider text-slate-200">
            Interactive Entity Relationship Graph ({nodes.length} Nodes &bull; {edges.length} Edges)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any node to inspect forensic attributes</span>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#1e293b" gap={20} size={1} />
          <Controls className="!bg-slate-900 !border-slate-800" />
        </ReactFlow>

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 w-80 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl p-4 backdrop-blur-md z-20 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Entity Inspector
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Node Type</span>
                <span className="font-mono text-cyan-400 font-semibold uppercase">{selectedNode.type || 'Entity'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Label / Value</span>
                <span className="font-mono text-white break-all block">{selectedNode.data?.label || selectedNode.id}</span>
              </div>
              {selectedNode.data?.fullUrl && (
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Full URL</span>
                  <span className="font-mono text-[11px] text-rose-300 break-all block">{selectedNode.data.fullUrl}</span>
                </div>
              )}
              {selectedNode.data?.risk && (
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Risk Rating</span>
                  <RiskBadge level={selectedNode.data.risk} size="sm" showScore={false} />
                </div>
              )}
              {selectedNode.data?.isp && (
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">ISP / ASN</span>
                  <span className="text-slate-300">{selectedNode.data.isp}</span>
                </div>
              )}
              {selectedNode.data?.lat && (
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Coordinates</span>
                  <span className="font-mono text-emerald-300">{selectedNode.data.lat.toFixed(4)}, {selectedNode.data.lng.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphViewer;
