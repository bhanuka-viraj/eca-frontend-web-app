import React, { useState } from 'react';
import {
  Compass,
  Video,
  Users,
  Activity,
  Server,
  Info,
  ChevronDown,
  Sparkles,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEFAULT_GATEWAY_URLS } from '../services/api';

export default function Navbar({
  activeTab,
  onSelectTab,
  gatewayStatus,
  latency,
  currentGatewayUrl,
  onSwitchGateway,
  onOpenSystemInfo
}) {
  const [showGatewayMenu, setShowGatewayMenu] = useState(false);

  const tabs = [
    { id: 'explore', label: 'Explore Courses', icon: Compass },
    { id: 'studio', label: 'Instructor Studio', icon: Video },
    { id: 'members', label: 'Member Directory', icon: Users },
    { id: 'infra', label: 'Cloud Infrastructure', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onSelectTab('explore')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
                  <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition" />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold tracking-tight text-slate-100 font-sans">
                    EduCloud<span className="text-indigo-400 font-normal">SaaS</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Cloud-Native Course & Learning Management Platform
                </p>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools & Status */}
          <div className="flex items-center space-x-3">
            {/* Gateway Quick Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowGatewayMenu(!showGatewayMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 text-xs text-slate-300 transition"
                title="Switch API Gateway Target"
              >
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
                <span className="font-mono text-[11px] hidden lg:inline">
                  {gatewayStatus === 'online' ? 'Gateway Online' : gatewayStatus === 'offline' ? 'Gateway Offline' : 'Connecting...'}
                </span>
                {latency !== null && gatewayStatus === 'online' && (
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    {latency}ms
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showGatewayMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl glass-dropdown p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800/80 mb-1">
                    Select API Gateway Target
                  </div>
                  {DEFAULT_GATEWAY_URLS.map((preset, idx) => {
                    const isSelected = currentGatewayUrl === preset.url;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          onSwitchGateway(preset.url);
                          setShowGatewayMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex flex-col space-y-0.5 ${
                          isSelected ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30' : 'hover:bg-slate-800/70 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[11px]">{preset.label}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {preset.env}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 truncate">
                          {preset.url}
                        </span>
                      </button>
                    );
                  })}
                  <div className="pt-1.5 mt-1 border-t border-slate-800/80 px-2">
                    <button
                      onClick={() => {
                        onSelectTab('infra');
                        setShowGatewayMenu(false);
                      }}
                      className="w-full text-center py-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                    >
                      Configure custom gateway & telemetry →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* System Info / Specs Modal Trigger */}
            <button
              onClick={onOpenSystemInfo}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 text-slate-300 text-xs font-medium transition hover:border-indigo-500/40"
              title="System Info & GCP Cloud Architecture"
            >
              <Info className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">System Info</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
