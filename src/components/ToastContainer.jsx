import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-2xl shadow-2xl border flex items-start space-x-3 transition-all transform animate-in slide-in-from-bottom-5 duration-200 backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-slate-950/90 border-emerald-500/40 text-emerald-300 shadow-emerald-950/30'
              : toast.type === 'error'
              ? 'bg-slate-950/90 border-rose-500/40 text-rose-300 shadow-rose-950/30'
              : toast.type === 'warning'
              ? 'bg-slate-950/90 border-amber-500/40 text-amber-300 shadow-amber-950/30'
              : 'bg-slate-950/90 border-indigo-500/40 text-indigo-300 shadow-indigo-950/30'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400" />}
          </div>

          <div className="flex-1 text-xs text-slate-200 leading-relaxed">{toast.message}</div>

          <button
            onClick={() => onRemove(toast.id)}
            className="text-slate-500 hover:text-slate-300 transition flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
