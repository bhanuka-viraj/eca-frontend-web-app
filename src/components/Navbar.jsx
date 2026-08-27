import React from 'react';
import { Cloud, Server, Database, Activity, Network, Layers, ShieldCheck } from 'lucide-react';

export default function Navbar({ gatewayStatus, latency, onOpenArchModal }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  EduCloud
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Cloud-Native Microservices Architecture • Google Cloud Platform
              </p>
            </div>
          </div>

          {/* Right Action Badges & Info */}
          <div className="flex items-center space-x-3">
            {/* Student & Project Badge */}
            <div className="hidden lg:flex flex-col items-end text-xs">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-200">J P Bhanuka Viraj Madhuranga</span>
                <span className="text-slate-500">(241711105)</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                GCP: <span className="text-sky-400">enterprise-cloud-module-503705</span>
              </span>
            </div>

            {/* Architecture Modal Button */}
            <button
              onClick={onOpenArchModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition shadow-sm hover:border-cyan-500/40"
              title="View Interactive System Architecture"
            >
              <Network className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Architecture</span>
            </button>

            {/* Live Gateway Status Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    gatewayStatus === 'online'
                      ? 'bg-emerald-400'
                      : gatewayStatus === 'offline'
                      ? 'bg-rose-400'
                      : 'bg-amber-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    gatewayStatus === 'online'
                      ? 'bg-emerald-500'
                      : gatewayStatus === 'offline'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span className="font-mono uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
                {gatewayStatus === 'online' ? 'Gateway Online' : gatewayStatus === 'offline' ? 'Gateway Offline' : 'Checking...'}
              </span>
              {latency !== null && gatewayStatus === 'online' && (
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  {latency}ms
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
