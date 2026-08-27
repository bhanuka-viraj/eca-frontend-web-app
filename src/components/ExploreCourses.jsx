import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  RefreshCw,
  Clock,
  User,
  Star,
  Users,
  Award,
  ArrowRight,
  Eye,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Trash2,
  Layers
} from 'lucide-react';
import { courseService } from '../services/api';
import SyllabusModal from './SyllabusModal';

export default function ExploreCourses({
  onNotify,
  onNavigateToStudio,
  enrolledCourseIds,
  onEnroll
}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState(null);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

  const categories = [
    'All',
    'Software Engineering',
    'Cloud Computing',
    'Data Science',
    'Design',
    'Business'
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAll();
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses from database:', error);
      onNotify?.({
        type: 'error',
        message: 'Could not load courses from database.'
      });
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove the course "${title}"?`)) return;

    try {
      await courseService.delete(id);
      onNotify?.({
        type: 'success',
        message: `Course "${title}" removed from catalog.`
      });
      fetchCourses();
    } catch (error) {
      setCourses((prev) => prev.filter((c) => (c.id || c._id) !== id));
      onNotify?.({
        type: 'info',
        message: `Course "${title}" removed.`
      });
    }
  };

  const handleViewSyllabus = (course) => {
    setSelectedCourseForSyllabus(course);
    setIsSyllabusOpen(true);
  };

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const titleMatch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const instMatch = (c.instructor || '').toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = Array.isArray(c.tags) && c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSearch = titleMatch || descMatch || instMatch || tagMatch;

    const matchesCategory =
      selectedCategory === 'All' ||
      (c.category || '').toLowerCase() === selectedCategory.toLowerCase() ||
      (c.category || '').toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Crisp Light Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 sm:p-12 overflow-hidden shadow-lg">
        {/* Background decorative soft shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Over 100+ Accredited Enterprise Courses</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Advance Your Career with Expert-Led Courses
          </h1>

          <p className="mt-4 text-indigo-100 text-sm sm:text-base leading-relaxed max-w-2xl">
            Explore industry-recognized curriculum taught by verified practitioners. Gain in-demand technical, design, and management competencies with hands-on projects.
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics (e.g. Cloud, React, Machine Learning)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-2xl pl-11 pr-4 py-3 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            <button
              onClick={onNavigateToStudio}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold shadow-md transition flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1.5" />
          Categories:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}

        <button
          onClick={fetchCourses}
          disabled={loading}
          className="ml-auto p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition disabled:opacity-50 flex items-center space-x-1"
          title="Refresh Course Catalog"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          <span className="text-xs hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Course Catalog Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Featured Courses</h2>
          <p className="text-xs text-slate-500">
            Learn at your own pace with lifetime curriculum access & certificate
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          Showing <span className="text-indigo-600 font-bold">{filteredCourses.length}</span> course{filteredCourses.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Courses Grid */}
      {loading && courses.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Loading course catalog...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No courses match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or create a new course using the Instructor Studio.
          </p>
          <button
            onClick={onNavigateToStudio}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const courseId = course.id || course._id || course.title;
            const isEnrolled = enrolledCourseIds?.has?.(courseId);
            const rating = course.rating || 4.8;
            const reviewsCount = course.reviewsCount || 340;
            const studentsCount = course.studentsCount || '1,200';

            return (
              <div
                key={courseId}
                className="course-card rounded-2xl flex flex-col overflow-hidden bg-white"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition duration-300 hover:scale-105"
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

                  {/* Category Pill on Image */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white/95 text-indigo-700 shadow-sm backdrop-blur-sm border border-slate-200/50">
                      {course.category || 'General'}
                    </span>
                    {course.level && (
                      <span className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-slate-900/80 text-white backdrop-blur-sm">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Delete button (discreet top-right) */}
                  {(course.id || course._id) && (
                    <button
                      onClick={(e) => handleDeleteCourse(course.id || course._id, course.title, e)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition shadow-sm"
                      title="Remove Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rating}</span>
                      <span className="text-slate-400 font-normal">({reviewsCount} reviews)</span>
                      <span className="text-slate-300 mx-1">•</span>
                      <span className="text-slate-500 font-normal">{studentsCount} students</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 transition cursor-pointer" onClick={() => handleViewSyllabus(course)}>
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description || 'Master modern professional competencies with hands-on projects and guided labs.'}
                    </p>
                  </div>

                  {/* Tags */}
                  {Array.isArray(course.tags) && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {course.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5 truncate max-w-[150px]">
                      <User className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span className="truncate text-[11px] font-medium">{course.instructor || 'Academy Faculty'}</span>
                    </div>

                    <div className="flex items-center space-x-1 font-medium text-[11px] text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.duration || '12 Hours'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleViewSyllabus(course)}
                      className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Syllabus</span>
                    </button>

                    <button
                      onClick={() => onEnroll(course)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm ${
                        isEnrolled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Enrolled</span>
                        </>
                      ) : (
                        <>
                          <span>Enroll Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Syllabus Modal */}
      <SyllabusModal
        course={selectedCourseForSyllabus}
        isOpen={isSyllabusOpen}
        onClose={() => {
          setIsSyllabusOpen(false);
          setSelectedCourseForSyllabus(null);
        }}
        onEnroll={onEnroll}
        isEnrolled={Boolean(
          selectedCourseForSyllabus &&
          enrolledCourseIds?.has?.(selectedCourseForSyllabus.id || selectedCourseForSyllabus._id || selectedCourseForSyllabus.title)
        )}
      />
    </div>
  );
}
