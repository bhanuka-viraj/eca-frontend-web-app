import React, { useState } from 'react';
import {
  Activity,
  Server,
  Zap,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Database,
  Layers,
  HardDrive,
  Cpu,
  Globe,
  Radio,
  Network,
  ShieldCheck,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { DEFAULT_GATEWAY_URLS, setGatewayUrl } from '../services/api';

export default function CloudInfrastructure({
  currentUrl,
  onUrlChange,
  onTestHealth,
  isTesting,
  healthResult,
  onNotify
}) {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [customTestingRoute, setCustomTestingRoute] = useState(null);

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
  };

  const handleTestRoute = async (route) => {
    setCustomTestingRoute(route);
    const target = `${currentUrl.replace(/\/+$/, '')}${route}`;
    try {
      const start = performance.now();
      const res = await fetch(target, { method: 'GET' });
      const lat = Math.round(performance.now() - start);
      onNotify?.({
        type: res.ok ? 'success' : 'info',
        message: `Route ${route} responded with HTTP ${res.status} in ${lat}ms`
      });
    } catch (err) {
      onNotify?.({
        type: 'warning',
        message: `Route ${route} ping attempt failed: ${err.message}`
      });
    } finally {
      setCustomTestingRoute(null);
    }
  };

  const microservices = [
    {
      name: 'Spring Cloud API Gateway',
      port: '8080',
      type: 'Reverse Proxy & CORS Router',
      tech: 'Spring Cloud Gateway (WebFlux)',
      database: 'N/A (Stateless Routing)',
      route: '/api/v1/**',
      status: healthResult?.success ? 'UP' : 'UNKNOWN',
      color: 'indigo'
    },
    {
      name: 'ECA User Service',
      port: '8081',
      type: 'IAM & RBAC Profiles',
      tech: 'Spring Boot 3 + JPA / Hibernate',
      database: 'Google Cloud SQL (MySQL 8.0)',
      route: '/api/v1/users',
      status: 'UP',
      color: 'blue'
    },
    {
      name: 'ECA Course Service',
      port: '8082',
      type: 'Curriculum & Catalog Document Store',
      tech: 'Spring Boot 3 + Spring Data MongoDB',
      database: 'MongoDB Atlas (Cluster NoSQL)',
      route: '/api/v1/courses',
      status: 'UP',
      color: 'emerald'
    },
    {
      name: 'ECA Media Service',
      port: '8083',
      type: 'Binary Asset Streaming & Storage',
      tech: 'Spring Boot 3 + Google Cloud Client',
      database: 'Google Cloud Storage (GCS Bucket)',
      route: '/api/v1/media/upload',
      status: 'UP',
      color: 'amber'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Infrastructure Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cloud Observability & Service Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Cloud Infrastructure & <span className="text-gradient">Telemetry</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time API Gateway monitoring, Eureka service registry discovery, and distributed microservices topology on <span className="text-cyan-400 font-mono">Google Cloud Platform</span>.
          </p>
        </div>
      </div>

      {/* Gateway Telemetry & URL Configuration Panel */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Spring Cloud API Gateway Configuration</h2>
              <p className="text-xs text-slate-400">Dynamic routing endpoint for all frontend HTTP / REST traffic</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTestHealth(inputUrl)}
              disabled={isTesting}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition disabled:opacity-50 hover:border-indigo-500/50"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-400 ${isTesting ? 'animate-bounce' : ''}`} />
              <span>{isTesting ? 'Pinging Gateway...' : 'Ping Actuator Health'}</span>
            </button>
          </div>
        </div>

        {/* URL Input and Presets */}
        <div className="space-y-3">
          <form onSubmit={handleApplyUrl} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://localhost:8080 or https://<GATEWAY_HOST>"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition"
            >
              Apply Gateway
            </button>
          </form>

          {/* Environment Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1" />
              Presets:
            </span>
            {DEFAULT_GATEWAY_URLS.map((preset, idx) => {
              const isSelected = currentUrl === preset.url;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Health Status Banner */}
        {healthResult && (
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition ${
              healthResult.success
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {healthResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <div>
                <span className="font-bold">
                  {healthResult.success ? 'Gateway Online & Operational' : 'Connection Unreachable'}
                </span>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Target: {healthResult.url}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {healthResult.latency !== undefined && (
                <div className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700">
                  Latency: <span className="text-emerald-400">{healthResult.latency} ms</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Telemetry Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Service Registry (Eureka)
            </span>
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">4 / 4</div>
          <span className="text-[10px] text-emerald-400 font-semibold block">All Microservices Healthy</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Gateway HTTP Engine
            </span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-300 font-mono">Netty</div>
          <span className="text-[10px] text-slate-400 block">Non-blocking Reactive Streams</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Polyglot Persistence
            </span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">3 Tiers</div>
          <span className="text-[10px] text-slate-400 block">MySQL + MongoDB + GCS</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Serverless Compute
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-300 font-mono">Cloud Run</div>
          <span className="text-[10px] text-slate-400 block">Auto-scaling 0 to N Instances</span>
        </div>
      </div>

      {/* Microservices Topology Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Network className="w-4 h-4 text-indigo-400" />
            <span>Microservices Architecture Topology</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">GCP Region: us-central1</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {microservices.map((svc, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/30 transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-100">{svc.name}</h3>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                      Port :{svc.port}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{svc.type}</p>
                </div>

                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{svc.status}</span>
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Framework:</span>
                  <span className="font-semibold text-slate-300">{svc.tech}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Persistence Store:</span>
                  <span className="font-semibold text-indigo-300 font-mono text-[11px]">
                    {svc.database}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">Exposed Route:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {svc.route}
                    </span>
                    {svc.route.startsWith('/api') && (
                      <button
                        onClick={() => handleTestRoute(svc.route.replace('/**', ''))}
                        disabled={customTestingRoute === svc.route.replace('/**', '')}
                        className="text-[10px] text-slate-400 hover:text-cyan-300 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 transition"
                      >
                        Ping
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REST API Routing Specification Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>API Gateway Reverse Proxy Routing Rules</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Gateway Path Pattern</th>
                <th className="py-2.5 px-3">Target Microservice URI</th>
                <th className="py-2.5 px-3">Filter Pipeline</th>
                <th className="py-2.5 px-3 text-right">Route Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-2.5 px-3 text-cyan-400 font-bold">/api/v1/users/**</td>
                <td className="py-2.5 px-3">lb://eca-user-service:8081</td>
                <td className="py-2.5 px-3 text-slate-400">CORS, CircuitBreaker, Auth</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleTestRoute('/api/v1/users')}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] transition"
                  >
                    Test Ping
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">/api/v1/courses/**</td>
                <td className="py-2.5 px-3">lb://eca-course-service:8082</td>
                <td className="py-2.5 px-3 text-slate-400">CORS, RequestRateLimiter</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleTestRoute('/api/v1/courses')}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] transition"
                  >
                    Test Ping
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-amber-400 font-bold">/api/v1/media/**</td>
                <td className="py-2.5 px-3">lb://eca-media-service:8083</td>
                <td className="py-2.5 px-3 text-slate-400">Multipart Streaming, MaxBodySize</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleTestRoute('/api/v1/media/upload')}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] transition"
                  >
                    Test Ping
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-indigo-400 font-bold">/actuator/health</td>
                <td className="py-2.5 px-3">Direct Gateway Health Indicator</td>
                <td className="py-2.5 px-3 text-slate-400">Liveness & Readiness Probes</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleTestRoute('/actuator/health')}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] transition"
                  >
                    Test Ping
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
