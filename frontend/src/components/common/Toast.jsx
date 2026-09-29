import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-brand-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all animate-bounce-short ${bgColors[type] || bgColors.info}`}>
      {icons[type] || icons.info}
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-md ml-2 transition">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
