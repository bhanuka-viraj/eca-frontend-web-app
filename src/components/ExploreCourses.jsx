import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  RefreshCw,
  ExternalLink,
  Layers,
  Clock,
  User,
  Trash2,
  Sparkles,
  ArrowRight,
  Eye,
  PlusCircle,
  Database
} from 'lucide-react';
import { courseService } from '../services/api';
import SyllabusModal from './SyllabusModal';

// Sample enterprise courses if MongoDB is empty
const SEED_COURSES = [
  {
    id: 'seed-1',
    title: 'Enterprise Cloud Architecture on Google Cloud Platform',
    category: 'Cloud',
    description: 'Master Google Cloud Run serverless microservices, Cloud SQL MySQL, MongoDB Atlas integration, and Spring Cloud Gateway with reactive routing.',
    tags: ['GCP', 'Cloud Run', 'Microservices', 'Spring Boot'],
    instructor: 'Prof. Viraj Madhuranga',
    level: 'Advanced',
    duration: '16 Hours',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'seed-2',
    title: 'Production Kubernetes & Docker Multi-Stage Pipelines',
    category: 'DevOps',
    description: 'Containerize enterprise workloads with Docker multi-stage builds, Nginx SPA optimization, CI/CD Cloud Build pipelines, and zero-downtime rollouts.',
    tags: ['Docker', 'Nginx', 'Kubernetes', 'CI/CD'],
    instructor: 'Sarah Chen, SRE Lead',
    level: 'Intermediate',
    duration: '12 Hours',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'seed-3',
    title: 'Reactive Spring Boot 3 & Microservice Mesh Patterns',
    category: 'Java',
    description: 'Build enterprise-grade REST APIs, Eureka service discovery registries, circuit breakers with Resilience4j, and actuator telemetry metrics.',
    tags: ['Java 21', 'Spring Boot 3', 'Eureka', 'Cloud SQL'],
    instructor: 'Alex Rivera, Principal Architect',
    level: 'Advanced',
    duration: '14 Hours',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'seed-4',
    title: 'Cloud-Native GenAI & LLM Integration in Enterprise Apps',
    category: 'AI',
    description: 'Integrate Vertex AI, LangChain, and vector databases into Spring Boot & React distributed architectures for intelligent enterprise automation.',
    tags: ['GenAI', 'Vertex AI', 'Python', 'React'],
    instructor: 'Dr. Elena Rostova',
    level: 'Intermediate',
    duration: '10 Hours',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop'
  }
];

export default function ExploreCourses({ onNotify, onNavigateToStudio }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState(null);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());

  const categories = ['All', 'Cloud', 'DevOps', 'Java', 'AI'];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
      } else {
        // Use seed courses as preview if backend is fresh
        setCourses(SEED_COURSES);
      }
    } catch (error) {
      console.warn('API error fetching courses, falling back to cached seed courses:', error);
      setCourses(SEED_COURSES);
      onNotify?.({
        type: 'warning',
        message: 'Could not reach Gateway Course Service. Showing cached catalog.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove course "${title}"?`)) return;

    try {
      await courseService.delete(id);
      onNotify?.({
        type: 'success',
        message: `Course "${title}" removed from MongoDB Atlas catalog.`
      });
      fetchCourses();
    } catch (error) {
      // Local fallback removal if it was seed
      setCourses((prev) => prev.filter((c) => (c.id || c._id) !== id));
      onNotify?.({
        type: 'info',
        message: `Course "${title}" removed.`
      });
    }
  };

  const handleEnroll = (course) => {
    setEnrolledCourseIds((prev) => new Set([...prev, course.id || course._id || course.title]));
    onNotify?.({
      type: 'success',
      message: `Enrolled in "${course.title}" successfully! Access granted.`
    });
  };

  const handleViewSyllabus = (course) => {
    setSelectedCourseForSyllabus(course);
    setIsSyllabusOpen(true);
  };

  // Filter courses by search and category
  const filteredCourses = courses.filter((c) => {
    const titleMatch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = Array.isArray(c.tags) && c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSearch = titleMatch || descMatch || tagMatch;

    const matchesCategory =
      selectedCategory === 'All' ||
      (c.category || '').toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SaaS Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-10 border border-slate-800/90">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Enterprise Learning & Cloud Engineering Academy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Build production-ready skills with <span className="text-gradient">Cloud-Native Architectures</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Explore curated curriculum spanning Spring Boot microservices, Google Cloud Platform, polyglot databases (MySQL & MongoDB), and containerized distributed systems.
          </p>

          {/* Search Bar & Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search courses by topic, technology (e.g. Docker, GCP, Spring)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition"
              />
            </div>

            <button
              onClick={onNavigateToStudio}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold tracking-wide shadow-lg shadow-indigo-500/20 transition flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Course</span>
            </button>

            <button
              onClick={fetchCourses}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition flex items-center justify-center disabled:opacity-50 flex-shrink-0"
              title="Refresh Catalog from MongoDB"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Categories:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-500'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Course Catalog Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Featured Course Library</h2>
          <p className="text-xs text-slate-400">
            Backed by <span className="text-emerald-400 font-mono">MongoDB Atlas</span> & <span className="text-amber-400 font-mono">GCS Media Storage</span>
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          Showing <span className="text-indigo-400 font-bold">{filteredCourses.length}</span> course{filteredCourses.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Courses Grid */}
      {loading && courses.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-indigo-400" />
          <p className="text-sm text-slate-400">Querying Course Service via API Gateway...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No courses match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or create a new course using the Instructor Studio wizard.
          </p>
          <button
            onClick={onNavigateToStudio}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Instructor Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const courseId = course.id || course._id || course.title;
            const isEnrolled = enrolledCourseIds.has(courseId);

            return (
              <div
                key={courseId}
                className="group relative rounded-2xl glass-card border border-slate-800/80 flex flex-col overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-950/30"
              >
                {/* Course Thumbnail */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden border-b border-slate-800/80">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback tech gradient placeholder
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 text-center">
                      <Layers className="w-10 h-10 text-indigo-400/40" />
                    </div>
                  )}

                  {/* Category Pill on Image */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                      {course.category || 'Cloud'}
                    </span>
                    {course.level && (
                      <span className="px-2 py-1 text-[10px] font-semibold rounded-md bg-slate-900/80 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Delete button (discreet top-right) */}
                  {(course.id || course._id) && (
                    <button
                      onClick={(e) => handleDeleteCourse(course.id || course._id, course.title, e)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition opacity-0 group-hover:opacity-100 backdrop-blur-md"
                      title="Delete Course from MongoDB"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-indigo-300 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description || 'Enterprise cloud architecture module covering microservices, storage, and serverless compute.'}
                    </p>
                  </div>

                  {/* Dynamic Tags */}
                  {Array.isArray(course.tags) && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-indigo-300/90 border border-indigo-500/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata Row */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5 truncate max-w-[150px]">
                      <User className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span className="truncate text-[11px]">{course.instructor || 'EduCloud Faculty'}</span>
                    </div>

                    <div className="flex items-center space-x-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{course.duration || '12h'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleViewSyllabus(course)}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition flex items-center justify-center space-x-1.5 hover:border-indigo-500/40"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Syllabus</span>
                    </button>

                    <button
                      onClick={() => handleEnroll(course)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
                        isEnrolled
                          ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {isEnrolled ? (
                        <span>Enrolled ✓</span>
                      ) : (
                        <>
                          <span>Enroll</span>
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

      {/* Interactive Syllabus Viewer Modal */}
      <SyllabusModal
        course={selectedCourseForSyllabus}
        isOpen={isSyllabusOpen}
        onClose={() => {
          setIsSyllabusOpen(false);
          setSelectedCourseForSyllabus(null);
        }}
        onEnroll={handleEnroll}
      />
    </div>
  );
}
