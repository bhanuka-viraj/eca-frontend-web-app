import React from 'react';
import {
  X,
  ShieldCheck,
  Server,
  Cloud,
  Database,
  Cpu,
  Globe,
  Terminal,
  ExternalLink,
  Code,
  Layers,
  Sparkles
} from 'lucide-react';

export default function SystemInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                System Information & Platform Metadata
              </h3>
              <p className="text-xs text-slate-400">
                Cloud Architecture Environment & Author Specification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Engineering Lead & Project ID */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>Platform Developer & Academic Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[11px]">Primary Developer:</span>
                <span className="font-semibold text-slate-100 text-sm">
                  J P Bhanuka Viraj Madhuranga
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Student Registration ID:</span>
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  241711105
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Google Cloud Project ID:</span>
                <span className="font-mono text-cyan-400">
                  enterprise-cloud-module-503705
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Deployment Region:</span>
                <span className="font-mono text-slate-200">
                  us-central1 (Iowa, USA)
                </span>
              </div>
            </div>
          </div>

          {/* Cloud Native Technology Stack */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Cloud-Native Technology Infrastructure</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 font-mono text-[11px]">
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Frontend SPA:</span>
                <span className="text-slate-200">React 18 + Vite + Tailwind</span>
              </div>

              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Container Serving:</span>
                <span className="text-slate-200">Nginx 1.25 Alpine (:8080)</span>
              </div>

              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">API Gateway:</span>
                <span className="text-indigo-300">Spring Cloud Gateway (:8080)</span>
              </div>

              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">User Microservice:</span>
                <span className="text-blue-300">Spring Boot + Cloud SQL</span>
              </div>

              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Course Microservice:</span>
                <span className="text-emerald-300">Spring Boot + MongoDB</span>
              </div>

              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Media Microservice:</span>
                <span className="text-amber-300">Spring Boot + GCS Bucket</span>
              </div>
            </div>
          </div>

          {/* Docker & Deployment Spec */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Containerization & Deployment Strategy</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Multi-stage Dockerfile builds the static JavaScript bundle with Node 20 Alpine and copies production assets into an ultralight Nginx Alpine image listening on standard Cloud Run port 8080 with custom SPA fallback routing rules.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
