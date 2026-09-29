import React, { useState } from 'react';
import { Eye, Code, ExternalLink, ShieldAlert, AlertTriangle } from 'lucide-react';

export const EmailBodyViewer = ({ bodyText = '', bodyHtml = '', urls = [] }) => {
  const [viewMode, setViewMode] = useState(bodyHtml ? 'html' : 'text');

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Email Message Content
          </h4>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800">
          {bodyHtml && (
            <button
              onClick={() => setViewMode('html')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'html' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rendered HTML
            </button>
          )}
          <button
            onClick={() => setViewMode('text')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'text' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Decoded Text
          </button>
          <button
            onClick={() => setViewMode('urls')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'urls' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Extracted Links ({urls.length})
          </button>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Sandboxed forensic preview: Scripts and active external web beacon tracking are disabled for investigator protection.</span>
      </div>

      {/* Body Content */}
      {viewMode === 'html' && bodyHtml ? (
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 min-h-[220px] max-h-[450px] overflow-y-auto">
          <div
            className="prose prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: bodyHtml
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            }}
          />
        </div>
      ) : viewMode === 'text' ? (
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 min-h-[220px] max-h-[450px] overflow-y-auto">
          <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {bodyText || 'No plain text body content found.'}
          </pre>
        </div>
      ) : (
        <div className="space-y-2 max-h-[450px] overflow-y-auto">
          {urls.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No hyperlinks embedded in this email.</div>
          ) : (
            urls.map((u, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-mono text-slate-200 truncate">{u}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase shrink-0">
                  Suspicious Target
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EmailBodyViewer;
