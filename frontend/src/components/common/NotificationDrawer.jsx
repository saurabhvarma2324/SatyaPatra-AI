import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, ShieldAlert, CheckCircle2, FileText, ArrowRight, CheckCheck } from 'lucide-react';
import { useCase } from '../../context/CaseContext';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCase();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOpenCase = (notif) => {
    markNotificationRead(notif.id);
    onClose();
    if (notif.caseId) {
      navigate(`/cases/${notif.caseId}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'THREAT_ALERT':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'REPORT_READY':
        return <FileText className="w-4 h-4 text-sky-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Investigation Alerts</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No active security notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleOpenCase(n)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    n.read 
                      ? 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700' 
                      : 'bg-slate-800/60 border-sky-500/30 text-slate-200 shadow-sm hover:border-sky-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-sky-400 ring-4 ring-sky-400/20"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                      {n.caseId && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-sky-400 font-semibold">
                          <span>View {n.caseId}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center text-[11px] text-slate-500">
            MailDrishti Automated Incident Stream
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
