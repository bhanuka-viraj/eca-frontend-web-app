import React, { useState } from 'react';
import { X, Server, Database, Cloud, HardDrive, Shield, Cpu, ArrowRight, CheckCircle, Network, Layers, Sparkles } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('diagram');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                EduCloud Microservices Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Enterprise Cloud-Native Topology on Google Cloud Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('diagram')}
                className={`px-3 py-1 rounded-md transition ${
                  activeTab === 'diagram'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Architecture Map
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-3 py-1 rounded-md transition ${
                  activeTab === 'specs'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                GCP Services Specs
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'diagram' ? (
            <div className="space-y-6">
              {/* Architecture Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Client Layer */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="p-2.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-200">React 18 + Vite SPA</div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    Cloud Run (Nginx :8080)
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Single Page App with dynamic gateway switching
                  </p>
                </div>

                {/* Gateway Layer */}
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="p-2.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Server className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-indigo-200">Spring Cloud Gateway</div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                    Port 8080 • Non-blocking
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Reverse Proxy, CORS filters, Rate Limiting & Routing
                  </p>
                </div>

                {/* Microservices Tier */}
                <div className="md:col-span-2 space-y-3">
                  {/* Service 1 */}
                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-blue-200">User Service (Spring Boot)</div>
                        <span className="font-mono text-[10px] text-slate-400">/api/v1/users</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-700/50">
                        Cloud SQL (MySQL)
                      </span>
                    </div>
                  </div>

                  {/* Service 2 */}
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-200">Course Service (Spring Boot)</div>
                        <span className="font-mono text-[10px] text-slate-400">/api/v1/courses</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/50">
                        MongoDB Atlas (NoSQL)
                      </span>
                    </div>
                  </div>

                  {/* Service 3 */}
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-amber-200">Media Service (Spring Boot)</div>
                        <span className="font-mono text-[10px] text-slate-400">/api/v1/media/upload</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-700/50">
                        Google Cloud Storage (GCS)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Infrastructure Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 mb-1">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Serverless Compute</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Google Cloud Run automatically scales containers from 0 to N instances on demand with zero cold-start latency optimization.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 mb-1">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Zero-Trust Security</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Direct database credentials stored in GCP Secret Manager, with private VPC Access connectors and Cloud SQL Auth Proxy.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 mb-1">
                    <HardDrive className="w-4 h-4 text-amber-400" />
                    <span>Polyglot Persistence</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Relational data on MySQL Cloud SQL, flexible catalogs in MongoDB Atlas, and media assets in Google Cloud Storage Buckets.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-slate-200 mb-2">Project & Deployment Specification</h4>
                <div className="grid grid-cols-2 gap-y-2 text-slate-300 font-mono text-[11px]">
                  <div>GCP Project ID:</div>
                  <div className="text-cyan-400">enterprise-cloud-module-503705</div>
                  <div>Student Name:</div>
                  <div className="text-cyan-400">J P Bhanuka Viraj Madhuranga</div>
                  <div>Student ID:</div>
                  <div className="text-cyan-400">241711105</div>
                  <div>GCP Region:</div>
                  <div className="text-cyan-400">us-central1 (Iowa)</div>
                  <div>Frontend Cloud Run:</div>
                  <div className="text-cyan-400">eca-frontend-app</div>
                  <div>API Gateway Cloud Run:</div>
                  <div className="text-cyan-400">eca-api-gateway</div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-slate-200 mb-2">REST API Routing Table</h4>
                <table className="w-full text-left font-mono text-[11px] text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="py-1">Route</th>
                      <th className="py-1">Target Service</th>
                      <th className="py-1">Database</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="py-1.5 text-cyan-400">/api/v1/users/**</td>
                      <td>eca-user-service:8081</td>
                      <td>Cloud SQL (MySQL)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-emerald-400">/api/v1/courses/**</td>
                      <td>eca-course-service:8082</td>
                      <td>MongoDB Atlas</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-amber-400">/api/v1/media/**</td>
                      <td>eca-media-service:8083</td>
                      <td>Google Cloud Storage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Architecture Map
          </button>
        </div>
      </div>
    </div>
  );
}
