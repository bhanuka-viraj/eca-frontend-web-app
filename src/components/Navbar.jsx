import React from 'react';
import {
  Compass,
  BookOpen,
  Video,
  Users,
  Server,
  ChevronDown,
  Sparkles,
  GraduationCap,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function Navbar({
  activeTab,
  onSelectTab,
  gatewayStatus,
  latency,
  enrolledCount,
  onOpenSettings
}) {
  const tabs = [
    { id: 'explore', label: 'Explore Courses', icon: Compass },
    { id: 'mylearning', label: 'My Learning', icon: BookOpen, badge: enrolledCount },
    { id: 'studio', label: 'Instructor Studio', icon: Video },
    { id: 'members', label: 'Faculty & Students', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onSelectTab('explore')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                    Edu<span className="text-indigo-600">Sphere</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Academy
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Enterprise Course & Learning Platform
                </p>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools & Profile */}
          <div className="flex items-center space-x-3">
            {/* Subtle Connection Status Button */}
            <button
              onClick={onOpenSettings}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition"
              title="Platform API Connection Settings"
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

              <span className="text-[11px] font-medium text-slate-600 hidden sm:inline">
                {gatewayStatus === 'online' ? 'API Connected' : gatewayStatus === 'offline' ? 'API Offline' : 'Connecting...'}
              </span>

              {latency !== null && gatewayStatus === 'online' && (
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 hidden md:inline">
                  {latency}ms
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                BV
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">Bhanuka Viraj</div>
                <div className="text-[10px] text-slate-500">Enterprise Scholar</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 overflow-x-auto space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="px-1 py-0.1 text-[9px] font-bold rounded-full bg-indigo-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
