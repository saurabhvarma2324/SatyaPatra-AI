import React from 'react';
import { Paperclip, FileWarning, ShieldAlert, CheckCircle, Copy, Hash } from 'lucide-react';

export const AttachmentList = ({ attachments = [] }) => {
  if (!attachments || attachments.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-500">
        <Paperclip className="w-6 h-6 mx-auto text-slate-600 mb-2 opacity-60" />
        No binary files or MIME attachments extracted from this email artifact.
      </div>
    );
  }

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <div className="space-y-3">
      {attachments.map((att, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl border transition-all ${
            att.is_suspicious 
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' 
              : 'bg-slate-900/60 border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2.5 rounded-lg shrink-0 ${
                att.is_suspicious ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {att.is_suspicious ? <FileWarning className="w-5 h-5" /> : <Paperclip className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-sm text-white block truncate">{att.filename}</span>
                <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                  {formatBytes(att.size)} &bull; {att.content_type || 'application/octet-stream'}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              {att.is_suspicious ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>High-Risk Executable</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Standard Media</span>
                </span>
              )}
            </div>
          </div>

          {/* Cryptographic Hashes */}
          {(att.sha256 || att.md5) && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {att.sha256 && (
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">SHA256:</span>
                  <span className="font-mono text-[11px] text-slate-300 truncate flex-1">{att.sha256}</span>
                  <button
                    onClick={() => copyHash(att.sha256)}
                    title="Copy SHA256"
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
              {att.md5 && (
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">MD5:</span>
                  <span className="font-mono text-[11px] text-slate-300 truncate flex-1">{att.md5}</span>
                  <button
                    onClick={() => copyHash(att.md5)}
                    title="Copy MD5"
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;
