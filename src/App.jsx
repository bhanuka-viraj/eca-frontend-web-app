import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import GatewayConfig from './components/GatewayConfig';
import UserManagement from './components/UserManagement';
import CourseCatalog from './components/CourseCatalog';
import MediaUploader from './components/MediaUploader';
import ArchitectureModal from './components/ArchitectureModal';
import { getGatewayUrl, checkGatewayHealth } from './services/api';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export default function App() {
  const [gatewayUrl, setGatewayUrlState] = useState(getGatewayUrl());
  const [gatewayStatus, setGatewayStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [latency, setLatency] = useState(null);
  const [healthResult, setHealthResult] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [sharedThumbnailUrl, setSharedThumbnailUrl] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const addNotification = useCallback(({ type = 'info', message }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Perform Health Check
  const runHealthCheck = useCallback(async (urlToTest = null) => {
    setIsTesting(true);
    setGatewayStatus('checking');
    try {
      const result = await checkGatewayHealth(urlToTest || gatewayUrl);
      setHealthResult(result);
      if (result.success) {
        setGatewayStatus('online');
        setLatency(result.latency);
      } else {
        setGatewayStatus('offline');
        setLatency(result.latency);
      }
      return result;
    } catch (error) {
      setGatewayStatus('offline');
      setHealthResult({ success: false, error: error.message });
    } finally {
      setIsTesting(false);
    }
  }, [gatewayUrl]);

  // Initial check on mount
  useEffect(() => {
    runHealthCheck();
    // Heartbeat check every 30 seconds
    const interval = setInterval(() => {
      runHealthCheck();
    }, 30000);
    return () => clearInterval(interval);
  }, [runHealthCheck]);

  // Handle URL change
  const handleUrlChange = (newUrl) => {
    setGatewayUrlState(newUrl);
    runHealthCheck(newUrl).then((res) => {
      if (res?.success) {
        addNotification({
          type: 'success',
          message: `Gateway URL updated to: ${newUrl}`
        });
        // Trigger data sync
        setRefreshKey((prev) => prev + 1);
      } else {
        addNotification({
          type: 'warning',
          message: `Updated to ${newUrl}, but gateway seems unreachable.`
        });
      }
    });
  };

  // Refresh all services
  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    runHealthCheck();
    addNotification({
      type: 'info',
      message: 'Synchronizing all microservices via API Gateway...'
    });
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-900">
      {/* Top Navigation */}
      <Navbar
        gatewayStatus={gatewayStatus}
        latency={latency}
        onOpenArchModal={() => setIsArchModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Dynamic Gateway Configuration Header */}
        <GatewayConfig
          currentUrl={gatewayUrl}
          onUrlChange={handleUrlChange}
          onRefreshAll={handleRefreshAll}
          onTestHealth={runHealthCheck}
          isRefreshing={isRefreshing}
          isTesting={isTesting}
          healthResult={healthResult}
        />

        {/* 3-Tier Microservices Section */}
        <div key={refreshKey} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Microservice 1: User Service (Cloud SQL) */}
          <UserManagement onNotify={addNotification} />

          {/* Microservice 2: Course Service (MongoDB Atlas) */}
          <CourseCatalog
            onNotify={addNotification}
            sharedThumbnailUrl={sharedThumbnailUrl}
          />

          {/* Microservice 3: Media Service (GCS Cloud Storage) */}
          <MediaUploader
            onNotify={addNotification}
            onThumbnailUploaded={(url) => setSharedThumbnailUrl(url)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-300">
            EduCloud Enterprise Course Portal • Cloud Computing & Distributed Systems
          </p>
          <p className="text-slate-400 font-mono text-[11px]">
            Student: J P Bhanuka Viraj Madhuranga (241711105) | Project: enterprise-cloud-module-503705
          </p>
        </div>
      </footer>

      {/* Interactive Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Floating Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-md w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-2xl border flex items-start space-x-3 transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-slate-900 border-rose-500/50 text-rose-300 shadow-rose-950/40'
                : toast.type === 'warning'
                ? 'bg-slate-900 border-amber-500/50 text-amber-300 shadow-amber-950/40'
                : 'bg-slate-900 border-cyan-500/50 text-cyan-300 shadow-cyan-950/40'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
            </div>

            <div className="flex-1 text-xs text-slate-200">{toast.message}</div>

            <button
              onClick={() => removeNotification(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
