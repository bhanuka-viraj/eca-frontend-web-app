import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ExploreCourses from './components/ExploreCourses';
import MyLearning from './components/MyLearning';
import InstructorStudio from './components/InstructorStudio';
import MemberDirectory from './components/MemberDirectory';
import ConnectionSettingsModal from './components/ConnectionSettingsModal';
import ToastContainer from './components/ToastContainer';
import { getGatewayUrl, setGatewayUrl, checkGatewayHealth } from './services/api';
import { Sparkles, Shield, Heart, HelpCircle, Globe } from 'lucide-react';

const ENROLLED_STORAGE_KEY = 'edusphere_enrolled_courses';
const PROGRESS_STORAGE_KEY = 'edusphere_course_progress';

// Initial pre-enrolled course for immediate student dashboard preview
const INITIAL_ENROLLED_COURSES = [
  {
    id: 'course-1',
    title: 'Cloud Computing & Distributed Systems Architecture',
    category: 'Cloud Computing',
    description: 'Learn modern cloud architectures, serverless computing, microservice orchestration, and high-availability enterprise design principles.',
    tags: ['Cloud', 'Microservices', 'Distributed Systems', 'DevOps'],
    instructor: 'Prof. Viraj Madhuranga',
    level: 'Advanced',
    duration: '16 Hours',
    rating: 4.9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [gatewayUrl, setGatewayUrlState] = useState(getGatewayUrl());
  const [gatewayStatus, setGatewayStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [latency, setLatency] = useState(null);
  const [healthResult, setHealthResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Student Enrolled Courses State
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(ENROLLED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ENROLLED_COURSES;
    } catch {
      return INITIAL_ENROLLED_COURSES;
    }
  });

  // Course Progress Map { courseId: percentage }
  const [courseProgressMap, setCourseProgressMap] = useState(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { 'course-1': 45 };
    } catch {
      return { 'course-1': 45 };
    }
  });

  // Sync state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ENROLLED_STORAGE_KEY, JSON.stringify(enrolledCourses));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [enrolledCourses]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(courseProgressMap));
    } catch (e) {
      console.warn('Progress sync failed', e);
    }
  }, [courseProgressMap]);

  // Toast Notification System
  const addNotification = useCallback(({ type = 'info', message }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
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
          message: `Connected to API Server: ${sanitized}`
        });
      } else {
        addNotification({
          type: 'warning',
          message: `Switched API endpoint, but server health check failed.`
        });
      }
    });
  };

  // Handle Course Enrollment
  const handleEnrollCourse = (course) => {
    const courseId = course.id || course._id || course.title;
    const exists = enrolledCourses.some((c) => (c.id || c._id || c.title) === courseId);

    if (exists) {
      addNotification({
        type: 'info',
        message: `You are already enrolled in "${course.title}". Visit "My Learning" to resume.`
      });
      setActiveTab('mylearning');
      return;
    }

    const updated = [course, ...enrolledCourses];
    setEnrolledCourses(updated);
    setCourseProgressMap((prev) => ({ ...prev, [courseId]: 15 }));

    addNotification({
      type: 'success',
      message: `Enrolled in "${course.title}"! Course added to My Learning.`
    });
  };

  // Update Course Progress
  const handleUpdateProgress = (courseId, pct) => {
    setCourseProgressMap((prev) => ({ ...prev, [courseId]: pct }));
  };

  // Set of enrolled course IDs for quick lookup
  const enrolledCourseIdSet = new Set(
    enrolledCourses.map((c) => c.id || c._id || c.title)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* SaaS Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        gatewayStatus={gatewayStatus}
        latency={latency}
        enrolledCount={enrolledCourses.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'explore' && (
          <ExploreCourses
            onNotify={addNotification}
            onNavigateToStudio={() => setActiveTab('studio')}
            enrolledCourseIds={enrolledCourseIdSet}
            onEnroll={handleEnrollCourse}
          />
        )}

        {activeTab === 'mylearning' && (
          <MyLearning
            enrolledCourses={enrolledCourses}
            onNavigateToExplore={() => setActiveTab('explore')}
            courseProgressMap={courseProgressMap}
            onUpdateProgress={handleUpdateProgress}
            onNotify={addNotification}
          />
        )}

        {activeTab === 'studio' && (
          <InstructorStudio
            onNotify={addNotification}
            onCourseCreated={() => {
              setActiveTab('explore');
            }}
          />
        )}

        {activeTab === 'members' && (
          <MemberDirectory onNotify={addNotification} />
        )}
      </main>

      {/* Professional SaaS Light Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">EduSphere LMS</span>
            <span>•</span>
            <span>Enterprise Learning & Talent Development Platform</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition flex items-center space-x-1"
            >
              <span>API Connection</span>
              {latency !== null && (
                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {latency}ms
                </span>
              )}
            </button>

            <span className="text-slate-400">
              © {new Date().getFullYear()} EduSphere Academy. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* Subtle Connection Settings Modal */}
      <ConnectionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={gatewayUrl}
        onUrlChange={handleGatewayChange}
        onTestHealth={runHealthCheck}
        isTesting={isTesting}
        healthResult={healthResult}
        latency={latency}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeNotification} />
    </div>
  );
}
