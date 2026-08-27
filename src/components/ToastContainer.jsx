import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          icon: <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        };
      default:
        return {
          bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
          icon: <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
        };
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const { bg, icon } = getToastStyle(toast.type);
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start justify-between space-x-3 transition-all duration-200 animate-slide-up ${bg}`}
          >
            <div className="flex items-start space-x-2.5">
              <span className="mt-0.5">{icon}</span>
              <span className="text-xs font-medium leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
