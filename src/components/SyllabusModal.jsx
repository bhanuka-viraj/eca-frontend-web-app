import React from 'react';
import {
  X,
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  PlayCircle,
  FileText,
  User,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function SyllabusModal({ course, isOpen, onClose, onEnroll, isEnrolled }) {
  if (!isOpen || !course) return null;

  // Default syllabus modules
  const syllabusModules = course.syllabus && Array.isArray(course.syllabus) && course.syllabus.length > 0
    ? course.syllabus
    : [
        {
          title: 'Module 1: Foundations & Core Architecture Concepts',
          duration: '2.5 Hours',
          lessons: [
            'Introduction & Learning Objectives Overview',
            'Core Principles, Frameworks and Modern Paradigms',
            'Setting Up Your Professional Development Environment'
          ]
        },
        {
          title: 'Module 2: Practical Implementation & Guided Labs',
          duration: '3.5 Hours',
          lessons: [
            'Building Scalable Components and Business Logic',
            'Integration with Backend RESTful APIs & Data Stores',
            'State Management, Security and Error Handling Best Practices'
          ]
        },
        {
          title: 'Module 3: Advanced Optimization & Production Deployment',
          duration: '4.0 Hours',
          lessons: [
            'Performance Profiling & Bottleneck Optimization',
            'Containerization and Automated CI/CD Pipelines',
            'Zero-Downtime Releases and Production Monitoring'
          ]
        },
        {
          title: 'Module 4: Capstone Enterprise Project & Case Study',
          duration: '3.0 Hours',
          lessons: [
            'Capstone Architecture Blueprint Review',
            'End-to-End Enterprise Solution Implementation',
            'Final Assessment, Code Review & Certificate Issuance'
          ]
        }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {course.category || 'Professional Course'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-lg bg-slate-200 text-slate-700">
                  {course.level || 'Intermediate'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">{course.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {course.description || 'Master in-demand competencies through interactive modules, practical coding labs, and expert feedback.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-200/80 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="font-medium">{course.duration || '14 Hours on-demand video'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Instructor: <strong className="text-slate-800 font-semibold">{course.instructor || 'Academy Faculty'}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Official Certificate of Completion</span>
            </div>
          </div>
        </div>

        {/* Syllabus Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Curriculum & Module Breakdown</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {syllabusModules.length} Modules • Lifetime Access
            </span>
          </div>

          <div className="space-y-3">
            {syllabusModules.map((mod, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {typeof mod === 'string' ? mod : mod.title}
                    </span>
                  </div>
                  {mod.duration && (
                    <span className="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {mod.duration}
                    </span>
                  )}
                </div>

                {mod.lessons && Array.isArray(mod.lessons) && (
                  <div className="pl-10 space-y-2 pt-1">
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        className="flex items-center space-x-2.5 text-xs text-slate-600"
                      >
                        <PlayCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
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
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Key Skills & Competencies Taught
              </div>
              <div className="flex flex-wrap gap-1.5">
                {course.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
          >
            Close
          </button>

          <button
            onClick={() => {
              onEnroll?.(course);
              onClose();
            }}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition ${
              isEnrolled
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isEnrolled ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Enrolled • Continue in My Learning</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Enroll in Course</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
