import React, { useState } from 'react';
import { Server, RefreshCw, CheckCircle2, XCircle, Zap, Globe, Sparkles } from 'lucide-react';
import { DEFAULT_GATEWAY_URLS, setGatewayUrl } from '../services/api';

export default function GatewayConfig({
  currentUrl,
  onUrlChange,
  onRefreshAll,
  onTestHealth,
  isRefreshing,
  isTesting,
  healthResult
}) {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [showPresets, setShowPresets] = useState(false);

  const handleApplyUrl = (e) => {
    e?.preventDefault();
    if (!inputUrl.trim()) return;
    const sanitized = setGatewayUrl(inputUrl.trim());
    setInputUrl(sanitized);
    onUrlChange(sanitized);
  };

  const handleSelectPreset = (url) => {
    setInputUrl(url);
    const sanitized = setGatewayUrl(url);
    onUrlChange(sanitized);
    setShowPresets(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/20 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* URL Input Form */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Spring Cloud API Gateway URL</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-medium transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Select Preset</span>
              </button>

              {showPresets && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Environment Presets
                  </div>
                  {DEFAULT_GATEWAY_URLS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset.url)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-700/80 transition flex flex-col space-y-0.5 group"
                    >
                      <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
                        {preset.label}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 truncate">
                        {preset.url}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleApplyUrl} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://localhost:8080 or https://<GATEWAY_HOST>"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold uppercase tracking-wider transition hover:border-cyan-500/50"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2 lg:pt-0">
          <button
            onClick={() => onTestHealth(inputUrl)}
            disabled={isTesting}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition hover:border-cyan-500/50 disabled:opacity-50"
            title="Test connection to Gateway"
          >
            <Zap className={`w-4 h-4 text-amber-400 ${isTesting ? 'animate-bounce' : ''}`} />
            <span>{isTesting ? 'Pinging...' : 'Test Connection'}</span>
          </button>

          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Services'}</span>
          </button>
        </div>
      </div>

      {/* Gateway Health Indicator Strip */}
      {healthResult && (
        <div
          className={`mt-3.5 px-3.5 py-2 rounded-xl border flex items-center justify-between text-xs transition ${
            healthResult.success
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800/50 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2 truncate">
            {healthResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="truncate">
              {healthResult.success
                ? `Gateway reachable at ${healthResult.url}`
                : `Gateway connection failed: ${healthResult.error}`}
            </span>
          </div>
          {healthResult.latency !== undefined && (
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/50 ml-2 flex-shrink-0">
              {healthResult.latency} ms
            </span>
          )}
        </div>
      )}
    </div>
  );
}
