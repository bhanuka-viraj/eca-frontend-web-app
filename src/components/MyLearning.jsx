import React, { useState } from 'react';
import {
  BookOpen,
  PlayCircle,
  Award,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Compass,
  Layers
} from 'lucide-react';
import CoursePlayerModal from './CoursePlayerModal';

export default function MyLearning({
  enrolledCourses,
  onNavigateToExplore,
  courseProgressMap,
  onUpdateProgress,
  onNotify
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'IN_PROGRESS' | 'COMPLETED'
  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Compute metrics
  const totalEnrolled = enrolledCourses.length;
  const completedCount = enrolledCourses.filter(
    (c) => (courseProgressMap[c.id || c._id || c.title] || 25) >= 100
  ).length;
  const inProgressCount = totalEnrolled - completedCount;

  // Filter list
  const filteredCourses = enrolledCourses.filter((course) => {
    const progress = courseProgressMap[course.id || course._id || course.title] || 25;
    if (filter === 'COMPLETED') return progress >= 100;
    if (filter === 'IN_PROGRESS') return progress < 100;
    return true;
  });

  const handleResume = (course) => {
    setSelectedCourseForPlayer(course);
    setIsPlayerOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student Learning Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            My Learning & Curriculum Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pick up right where you left off, track completed modules, and download your certifications.
          </p>
        </div>

        <button
          onClick={onNavigateToExplore}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition flex-shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Courses</span>
        </button>
      </div>

      {/* Learning Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrolled Courses</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono">{totalEnrolled}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Progress</span>
            <div className="text-xl font-extrabold text-blue-600 font-mono">{inProgressCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</span>
            <div className="text-xl font-extrabold text-emerald-600 font-mono">{completedCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Certificates Earned</span>
            <div className="text-xl font-extrabold text-amber-600 font-mono">{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === 'ALL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          All Enrolled ({totalEnrolled})
        </button>

        <button
          onClick={() => setFilter('IN_PROGRESS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === 'IN_PROGRESS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          In Progress ({inProgressCount})
        </button>

        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === 'COMPLETED'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Courses Grid / Empty State */}
      {enrolledCourses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Enrolled Courses Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Browse the course catalog to start expanding your professional skill set today!
            </p>
          </div>
          <button
            onClick={onNavigateToExplore}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Courses</span>
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-white border border-slate-200 shadow-sm text-slate-500 text-xs">
          No courses found matching this status filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const courseId = course.id || course._id || course.title;
            const progress = courseProgressMap[courseId] !== undefined ? courseProgressMap[courseId] : 35;
            const isFinished = progress >= 100;

            return (
              <div
                key={courseId}
                className="course-card rounded-2xl flex flex-col overflow-hidden bg-white shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-50 to-blue-100 flex items-center justify-center p-4 text-center">
                      <Layers className="w-10 h-10 text-indigo-300" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white/95 text-indigo-700 shadow-sm">
                      {course.category || 'General'}
                    </span>
                  </div>

                  {isFinished && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="truncate">{course.instructor || 'Academy Faculty'}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Course Progress</span>
                      <span className="text-indigo-600 font-mono">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFinished ? 'bg-emerald-600' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleResume(course)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2 ${
                      isFinished
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{isFinished ? 'Review Lessons & Certificate' : 'Resume Learning'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Lesson Player Modal */}
      <CoursePlayerModal
        course={selectedCourseForPlayer}
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setSelectedCourseForPlayer(null);
        }}
        courseProgress={
          selectedCourseForPlayer
            ? courseProgressMap[selectedCourseForPlayer.id || selectedCourseForPlayer._id || selectedCourseForPlayer.title] || 35
            : 35
        }
        onUpdateProgress={onUpdateProgress}
        onNotify={onNotify}
      />
    </div>
  );
}
