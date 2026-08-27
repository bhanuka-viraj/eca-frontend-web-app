import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ExploreCourses from './components/ExploreCourses';
import InstructorStudio from './components/InstructorStudio';
import MemberDirectory from './components/MemberDirectory';
import CloudInfrastructure from './components/CloudInfrastructure';
import SystemInfoModal from './components/SystemInfoModal';
import ToastContainer from './components/ToastContainer';
import { getGatewayUrl, setGatewayUrl, checkGatewayHealth } from './services/api';
import { Sparkles, ShieldCheck, Heart, Radio, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [gatewayUrl, setGatewayUrlState] = useState(getGatewayUrl());
  const [gatewayStatus, setGatewayStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [latency, setLatency] = useState(null);
  const [healthResult, setHealthResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Notification System
  const addNotification = useCallback(({ type = 'info', message }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

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

  // Initial and periodic heartbeat
  useEffect(() => {
    runHealthCheck();
    const interval = setInterval(() => {
      runHealthCheck();
    }, 30000);
    return () => clearInterval(interval);
  }, [runHealthCheck]);

  // Handle gateway URL change
  const handleGatewayChange = (newUrl) => {
    const sanitized = setGatewayUrl(newUrl);
    setGatewayUrlState(sanitized);
    runHealthCheck(sanitized).then((res) => {
      if (res?.success) {
        addNotification({
          type: 'success',
          message: `Switched API Gateway to: ${sanitized}`
        });
      } else {
        addNotification({
          type: 'warning',
          message: `Switched to ${sanitized}, but health probe failed.`
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top SaaS Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        gatewayStatus={gatewayStatus}
        latency={latency}
        currentGatewayUrl={gatewayUrl}
        onSwitchGateway={handleGatewayChange}
        onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
      />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'explore' && (
          <ExploreCourses
            onNotify={addNotification}
            onNavigateToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'studio' && (
          <InstructorStudio
            onNotify={addNotification}
            onCourseCreated={() => {
              // Optionally redirect or notify
            }}
          />
        )}

        {activeTab === 'members' && (
          <MemberDirectory onNotify={addNotification} />
        )}

        {activeTab === 'infra' && (
          <CloudInfrastructure
            currentUrl={gatewayUrl}
            onUrlChange={handleGatewayChange}
            onTestHealth={runHealthCheck}
            isTesting={isTesting}
            healthResult={healthResult}
            onNotify={addNotification}
          />
        )}
      </main>

      {/* Subtle, Professional SaaS Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-semibold text-slate-300">EduCloud Enterprise</span>
            <span>•</span>
            <span className="text-[11px]">Cloud-Native Course & Learning Management Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>GCP Region: us-central1</span>
            </div>

            <button
              onClick={() => setIsSystemInfoOpen(true)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-mono transition"
            >
              System Info (241711105)
            </button>
          </div>
        </div>
      </footer>

      {/* System Information Popover / Modal */}
      <SystemInfoModal
        isOpen={isSystemInfoOpen}
        onClose={() => setIsSystemInfoOpen(false)}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeNotification} />
    </div>
  );
}
