import React, { useState, useEffect } from 'react';
import { BookOpen, PlusCircle, Database, Search, Trash2, Tag, Image, Layers, RefreshCw, ExternalLink } from 'lucide-react';
import { courseService } from '../services/api';

export default function CourseCatalog({ onNotify, sharedThumbnailUrl }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cloud Computing',
    description: '',
    tags: 'GCP, Docker, Kubernetes',
    thumbnailUrl: ''
  });

  // Automatically update thumbnail if uploaded via Media Service
  useEffect(() => {
    if (sharedThumbnailUrl) {
      setFormData((prev) => ({ ...prev, thumbnailUrl: sharedThumbnailUrl }));
    }
  }, [sharedThumbnailUrl]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAll();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading courses:', error);
      onNotify?.({
        type: 'error',
        message: `Failed to fetch courses: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category.trim()) {
      onNotify?.({ type: 'warning', message: 'Title and Category are required.' });
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        tags: tagsArray,
        thumbnailUrl: formData.thumbnailUrl || null
      };

      await courseService.create(payload);
      onNotify?.({
        type: 'success',
        message: `Course '${formData.title}' published successfully to MongoDB!`
      });
      setFormData({
        title: '',
        category: 'Cloud Computing',
        description: '',
        tags: 'GCP, Docker, Kubernetes',
        thumbnailUrl: ''
      });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      onNotify?.({
        type: 'error',
        message: `Course creation failed: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"?`)) return;
    try {
      await courseService.delete(id);
      onNotify?.({ type: 'info', message: `Course "${title}" deleted.` });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      onNotify?.({
        type: 'error',
        message: `Delete failed: ${error.response?.data?.message || error.message}`
      });
    }
  };

  // Extract unique categories
  const categories = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));

  // Filtered list
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      (c.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full">
      {/* Service Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-100">2. Course Service</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MongoDB (NoSQL)
              </span>
            </div>
            <p className="text-xs text-slate-400">Document store for flexible course schemas & tags</p>
          </div>
        </div>

        <button
          onClick={fetchCourses}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
          title="Refresh Course Catalog"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Courses</div>
          <div className="text-lg font-bold text-slate-100 font-mono">{courses.length}</div>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Categories</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">{categories.length || 1}</div>
        </div>
      </div>

      {/* Create Course Form */}
      <form onSubmit={handleCreateCourse} className="space-y-3 mb-5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5 mb-1">
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Publish New Course</span>
        </div>

        <div>
          <input
            type="text"
            name="title"
            placeholder="Course Title (e.g. Master Google Cloud Platform)"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full bg-slate-950/70 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Cloud)"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full bg-slate-950/70 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full bg-slate-950/70 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div>
          <input
            type="text"
            name="thumbnailUrl"
            placeholder="Thumbnail URL (from GCS Media Uploader)"
            value={formData.thumbnailUrl}
            onChange={handleInputChange}
            className="w-full bg-slate-950/70 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-500/20 transition disabled:opacity-50 flex items-center justify-center space-x-1.5"
        >
          {submitting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <PlusCircle className="w-3.5 h-3.5" />
          )}
          <span>Publish Course</span>
        </button>
      </form>

      {/* Search & Filter */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by title or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950/50 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1">
        {loading && courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mb-2 text-cyan-400" />
            <span>Loading courses from MongoDB...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs bg-slate-900/20 rounded-xl border border-slate-800/40">
            <BookOpen className="w-6 h-6 mx-auto mb-1 opacity-40" />
            <span>No courses found. Create one above!</span>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id || course._id || course.title}
              className="group p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {course.title}
                    </span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {course.category}
                    </span>
                  </div>

                  {/* Tags */}
                  {Array.isArray(course.tags) && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {course.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Thumbnail Preview */}
                  {course.thumbnailUrl && (
                    <div className="mt-2 flex items-center space-x-2">
                      <img
                        src={course.thumbnailUrl}
                        alt="thumbnail"
                        className="h-10 w-16 object-cover rounded-lg border border-slate-700 bg-slate-950"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <a
                        href={course.thumbnailUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-cyan-400 hover:underline truncate max-w-[180px] flex items-center space-x-1"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span className="truncate">View GCS Asset</span>
                      </a>
                    </div>
                  )}
                </div>

                {(course.id || course._id) && (
                  <button
                    onClick={() => handleDeleteCourse(course.id || course._id, course.title)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
