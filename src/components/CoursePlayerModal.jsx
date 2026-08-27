import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Circle,
  Award,
  BookOpen,
  Volume2,
  Maximize2,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';

export default function CoursePlayerModal({
  course,
  isOpen,
  onClose,
  courseProgress,
  onUpdateProgress,
  onNotify
}) {
  if (!isOpen || !course) return null;

  const lessons = [
    { id: 1, title: 'Lesson 1: Introduction & Environment Setup', duration: '15 min' },
    { id: 2, title: 'Lesson 2: Core Fundamentals & Architectural Best Practices', duration: '28 min' },
    { id: 3, title: 'Lesson 3: Building Interactive Components & Services', duration: '35 min' },
    { id: 4, title: 'Lesson 4: Integration with Secure Enterprise APIs', duration: '40 min' },
    { id: 5, title: 'Lesson 5: Performance Tuning, Testing & CI/CD Deployment', duration: '32 min' },
    { id: 6, title: 'Lesson 6: Capstone Project Review & Certification', duration: '25 min' }
  ];

  const currentPercent = courseProgress || 25;
  const initialCompletedCount = Math.round((currentPercent / 100) * lessons.length);
  const [completedLessonIds, setCompletedLessonIds] = useState(
    new Set(lessons.slice(0, initialCompletedCount).map((l) => l.id))
  );
  const [activeLesson, setActiveLesson] = useState(lessons[0]);

  const toggleLesson = (id) => {
    const next = new Set(completedLessonIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCompletedLessonIds(next);

    const newPct = Math.round((next.size / lessons.length) * 100);
    onUpdateProgress?.(course.id || course._id || course.title, newPct);

    if (newPct === 100) {
      onNotify?.({
        type: 'success',
        message: `Congratulations! You have completed "${course.title}". Certificate is now unlocked!`
      });
    }
  };

  const isCompleted = completedLessonIds.size === lessons.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-slate-900 truncate">{course.title}</h3>
              <p className="text-[11px] text-slate-500">Instructor: {course.instructor || 'Academy Faculty'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((completedLessonIds.size / lessons.length) * 100)}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-indigo-700 font-mono">
                {Math.round((completedLessonIds.size / lessons.length) * 100)}%
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Player Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: Video Mock Player (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 text-white flex flex-col justify-between p-6 relative">
            {/* Simulated Video Canvas */}
            <div className="relative flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:scale-105 transition cursor-pointer">
                <Play className="w-7 h-7 fill-white ml-1" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{activeLesson.title}</h4>
                <p className="text-xs text-slate-400 mt-1">High-Definition Lecture Video • {activeLesson.duration}</p>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="bg-slate-950/80 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center space-x-3">
                <button className="text-white hover:text-indigo-400 transition">
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
                  <span>04:15</span>
                  <span>/</span>
                  <span>{activeLesson.duration}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleLesson(activeLesson.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    completedLessonIds.has(activeLesson.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedLessonIds.has(activeLesson.id) ? 'Completed ✓' : 'Mark as Complete'}</span>
                </button>

                <button className="text-slate-400 hover:text-white transition">
                  <Volume2 className="w-4 h-4" />
                </button>
                <button className="text-slate-400 hover:text-white transition">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Lessons Playlist & Certificate (4 cols) */}
          <div className="lg:col-span-4 bg-slate-50 border-l border-slate-200 flex flex-col justify-between overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Course Lessons</h4>
              <p className="text-[11px] text-slate-500">
                {completedLessonIds.size} of {lessons.length} completed
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {lessons.map((lesson) => {
                const isLessonDone = completedLessonIds.has(lesson.id);
                const isCurrent = activeLesson.id === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate mr-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLesson(lesson.id);
                        }}
                        className="text-slate-400 hover:text-indigo-600 transition"
                      >
                        {isLessonDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      <span className="text-xs font-medium truncate">{lesson.title}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                      {lesson.duration}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Certificate Box */}
            <div className="p-4 border-t border-slate-200 bg-white space-y-2">
              {isCompleted ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold">Course Completed!</span>
                      <p className="text-[10px] text-emerald-700">Certificate of Completion Issued</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onNotify?.({
                        type: 'success',
                        message: `Certificate downloaded for ${course.title}!`
                      });
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Certificate (PDF)</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px]">Complete all lessons to earn your official certificate.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
