import React from 'react';
import {
  X,
  BookOpen,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  PlayCircle,
  FileText,
  User,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function SyllabusModal({ course, isOpen, onClose, onEnroll }) {
  if (!isOpen || !course) return null;

  // Default syllabus modules if none provided
  const syllabusModules = course.syllabus && Array.isArray(course.syllabus) && course.syllabus.length > 0
    ? course.syllabus
    : [
        {
          title: 'Module 1: Architecture Overview & Cloud Native Concepts',
          duration: '2.5 Hours',
          lessons: [
            'Enterprise Microservices Topology on GCP',
            'Spring Cloud Gateway & Non-blocking Reactive Routing',
            'Domain Decomposition & Microservice Boundaries'
          ]
        },
        {
          title: 'Module 2: Containerization & Serverless Compute',
          duration: '3.0 Hours',
          lessons: [
            'Multi-stage Docker Builds with Node & Nginx',
            'Deploying Microservices to Google Cloud Run',
            'Traffic Splitting, Auto-scaling & Resource Optimization'
          ]
        },
        {
          title: 'Module 3: Polyglot Persistence & Data Management',
          duration: '3.5 Hours',
          lessons: [
            'Relational User IAM on Google Cloud SQL (MySQL)',
            'Document-driven Course Cataloging with MongoDB Atlas',
            'Cloud Storage (GCS) for Scalable Media Assets'
          ]
        },
        {
          title: 'Module 4: Observability, Security & Production Hardening',
          duration: '2.0 Hours',
          lessons: [
            'Distributed Actuator Health Checks & Eureka Discovery',
            'GCP Secret Manager & Zero-Trust IAM Policies',
            'Continuous Integration & Deployment via Cloud Build'
          ]
        }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with thumbnail backdrop */}
        <div className="relative p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {course.category || 'Cloud Architecture'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {course.level || 'Intermediate'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">{course.title}</h2>
              <p className="text-xs text-slate-400 line-clamp-2">
                {course.description || 'Master modern cloud-native architectures with hands-on labs and real-world microservice topologies.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{course.duration || '12 Hours on-demand'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instructor: {course.instructor || 'EduCloud Master Faculty'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificate of Completion</span>
            </div>
          </div>
        </div>

        {/* Syllabus Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Curriculum & Module Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {syllabusModules.length} Modules • Comprehensive
            </span>
          </div>

          <div className="space-y-3">
            {syllabusModules.map((mod, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-semibold text-slate-200">
                      {typeof mod === 'string' ? mod : mod.title}
                    </span>
                  </div>
                  {mod.duration && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {mod.duration}
                    </span>
                  )}
                </div>

                {mod.lessons && Array.isArray(mod.lessons) && (
                  <div className="pl-8 space-y-1.5 pt-1">
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        className="flex items-center space-x-2 text-xs text-slate-400"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span>{lesson}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          {course.tags && Array.isArray(course.tags) && course.tags.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Technologies & Competencies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {course.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-indigo-300 border border-indigo-500/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Close
          </button>

          <button
            onClick={() => {
              onEnroll?.(course);
              onClose();
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enroll Now (Free Enterprise Access)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
