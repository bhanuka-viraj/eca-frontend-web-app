import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Zap, Globe, Shield } from 'lucide-react';
import { DEFAULT_GATEWAY_URLS, setGatewayUrl } from '../services/api';

export default function ConnectionSettingsModal({
  isOpen,
  onClose,
  currentUrl,
  onUrlChange,
  onTestHealth,
  isTesting,
  healthResult,
  latency
}) {
  const [customInput, setCustomInput] = useState(currentUrl);

  if (!isOpen) return null;

  const handleApply = (e) => {
    e?.preventDefault();
    if (!customInput.trim()) return;
    const sanitized = setGatewayUrl(customInput.trim());
    setCustomInput(sanitized);
    onUrlChange(sanitized);
  };

  const handleSelectPreset = (url) => {
    setCustomInput(url);
    const sanitized = setGatewayUrl(url);
    onUrlChange(sanitized);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">API Connection Settings</h3>
              <p className="text-xs text-slate-500">Configure your application's API server endpoint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Status Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition ${
              healthResult?.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : healthResult?.error || healthResult?.success === false
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {healthResult?.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : healthResult?.error || healthResult?.success === false ? (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              ) : (
                <Server className="w-4 h-4 text-slate-500 flex-shrink-0" />
              )}
              <div>
                <span className="font-semibold">
                  {healthResult?.success
                    ? 'Server Online & Responsive'
                    : healthResult?.error || healthResult?.success === false
                    ? 'Server Unreachable'
                    : 'Ready to Connect'}
                </span>
                {latency !== null && healthResult?.success && (
                  <span className="ml-2 font-mono text-[11px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                    {latency}ms
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onTestHealth(customInput)}
              disabled={isTesting}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition disabled:opacity-50 flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Available Server Endpoints</label>
            <div className="grid grid-cols-1 gap-2">
              {DEFAULT_GATEWAY_URLS.map((preset, idx) => {
                const isSelected = currentUrl === preset.url;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center space-x-1.5">
                        <span>{preset.label}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate max-w-xs">
                        {preset.url}
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {preset.env}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input */}
          <form onSubmit={handleApply} className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Custom Server URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="http://localhost:8080 or https://api.yourdomain.com"
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                Apply
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
