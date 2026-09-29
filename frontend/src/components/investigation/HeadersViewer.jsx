import React, { useState } from 'react';
import { Key, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Layers, Copy, Check, FileCode } from 'lucide-react';
import { Modal } from '../common/Modal';

export const HeadersViewer = ({ headers = {} }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    subject = 'N/A',
    sender = 'N/A',
    recipient = 'N/A',
    cc = '',
    reply_to = '',
    date = 'N/A',
    message_id = 'N/A',
    spf = 'NEUTRAL',
    dkim = 'NEUTRAL',
    dmarc = 'NEUTRAL',
    sender_domain = '',
    reply_to_domain = '',
    received_chain = [],
    raw_headers = {}
  } = headers;

  const isMismatch = sender_domain && reply_to_domain && sender_domain.toLowerCase() !== reply_to_domain.toLowerCase();

  const handleCopyRaw = () => {
    const text = Object.entries(raw_headers).map(([k, v]) => `${k}: ${v}`).join('\n') || JSON.stringify(headers, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderAuthPill = (name, val) => {
    const isPass = val === 'PASS';
    const isFail = val === 'FAIL' || val === 'SOFTFAIL';
    
    return (
      <div className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
        isPass 
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
          : (isFail ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-slate-800/60 border-slate-700 text-slate-400')
      }`}>
        <span className="font-bold font-mono">{name}</span>
        <span className="inline-flex items-center gap-1 font-semibold uppercase text-[11px]">
          {isPass ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : (isFail ? <XCircle className="w-3.5 h-3.5 text-rose-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />)}
          {val}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Auth Status Bar */}
      <div className="grid grid-cols-3 gap-3">
        {renderAuthPill('SPF Auth', spf)}
        {renderAuthPill('DKIM Signature', dkim)}
        {renderAuthPill('DMARC Policy', dmarc)}
      </div>

      {/* Mismatch Warning */}
      {isMismatch && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-rose-300 uppercase tracking-wider block">Domain Mismatch Anomaly Detected</span>
            Sender domain (<span className="font-mono text-white underline">{sender_domain}</span>) does not match Reply-To destination domain (<span className="font-mono text-white underline">{reply_to_domain}</span>). High probability of email spoofing or credential lure.
          </div>
        </div>
      )}

      {/* Standard Header Table */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Forensic Email Envelope</span>
          <button
            onClick={() => setShowRaw(true)}
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>View Raw Headers</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 text-[11px] uppercase block">Subject</span>
            <span className="font-semibold text-white break-words block">{subject}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[11px] uppercase block">Timestamp</span>
            <span className="font-mono text-slate-300 block">{date}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[11px] uppercase block">Sender (From)</span>
            <span className="font-mono text-amber-300 break-words block">{sender}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[11px] uppercase block">Recipient (To)</span>
            <span className="font-mono text-slate-300 break-words block">{recipient}</span>
          </div>
          {reply_to && reply_to !== sender && (
            <div className="space-y-1 md:col-span-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-rose-400 text-[11px] uppercase font-bold block">Reply-To (Deviated)</span>
              <span className="font-mono text-rose-300 break-words block">{reply_to}</span>
            </div>
          )}
          <div className="space-y-1 md:col-span-2">
            <span className="text-slate-500 text-[11px] uppercase block">Message-ID</span>
            <span className="font-mono text-[11px] text-slate-400 break-all block">{message_id}</span>
          </div>
        </div>
      </div>

      {/* Received Hop Chain */}
      {received_chain.length > 0 && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              MTA Relay & Received Chain ({received_chain.length} Hops)
            </h4>
          </div>
          <div className="space-y-2">
            {received_chain.map((hop, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono text-[11px] text-slate-300 break-words leading-relaxed flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-bold shrink-0">Hop #{idx + 1}</span>
                <span className="text-slate-300">{hop}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Headers Modal */}
      <Modal
        isOpen={showRaw}
        onClose={() => setShowRaw(false)}
        title="Raw RFC 822 Email Headers"
        subtitle="Unsanitized message envelope headers decoded by MailDrishti parser"
        maxWidth="max-w-3xl"
      >
        <div className="relative">
          <button
            onClick={handleCopyRaw}
            className="absolute top-2 right-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 text-xs z-10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Headers'}</span>
          </button>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
            {Object.keys(raw_headers).length > 0
              ? Object.entries(raw_headers).map(([k, v]) => `${k}: ${v}`).join('\n')
              : `From: ${sender}\nTo: ${recipient}\nSubject: ${subject}\nDate: ${date}\nMessage-ID: ${message_id}\nSPF: ${spf}\nDKIM: ${dkim}`}
          </pre>
        </div>
      </Modal>
    </div>
  );
};

export default HeadersViewer;
