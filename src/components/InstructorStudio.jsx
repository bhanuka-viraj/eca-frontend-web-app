import React, { useState, useRef } from 'react';
import {
  Video,
  PlusCircle,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  BookOpen,
  User,
  Clock,
  Image as ImageIcon,
  Tag,
  RefreshCw,
  Layers,
  ArrowRight,
  Check,
  Link2
} from 'lucide-react';
import { courseService, mediaService } from '../services/api';

export default function InstructorStudio({ onNotify, onCourseCreated }) {
  // Course Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Software Engineering',
    description: '',
    tags: 'React, Cloud, System Design',
    instructor: 'Bhanuka Viraj',
    instructorId: 1,
    level: 'Intermediate',
    duration: '14 Hours',
    thumbnailUrl: ''
  });

  const [submittingCourse, setSubmittingCourse] = useState(false);

  // Cover Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Course Publish
  const handlePublishCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      onNotify?.({ type: 'warning', message: 'Course Title is required.' });
      return;
    }

    setSubmittingCourse(true);
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        tags: tagsArray,
        instructorId: Number(formData.instructorId) || 1,
        thumbnailUrl: formData.thumbnailUrl || null
      };

      await courseService.create(payload);
      onNotify?.({
        type: 'success',
        message: `Course "${formData.title}" published successfully to the Academy catalog!`
      });

      // Reset form
      setFormData({
        title: '',
        category: 'Software Engineering',
        description: '',
        tags: 'React, Cloud, System Design',
        instructor: 'Bhanuka Viraj',
        level: 'Intermediate',
        duration: '14 Hours',
        thumbnailUrl: ''
      });
      setSelectedFile(null);
      setLocalPreview(null);
      setUploadedUrl('');

      onCourseCreated?.();
    } catch (error) {
      console.error('Course publish error:', error);
      onNotify?.({
        type: 'error',
        message: `Publish failed: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setSubmittingCourse(false);
    }
  };

  // File Select and auto-upload
  const handleFileSelect = async (file) => {
    if (!file) return;
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setLocalPreview(e.target.result);
      reader.readAsDataURL(file);
    }

    // Auto upload to media service in background
    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await mediaService.upload(file, (pct) => {
        setUploadProgress(pct);
      });

      const fileUrl = result.fileUrl || result.url || (typeof result === 'string' ? result : '');
      if (fileUrl) {
        setUploadedUrl(fileUrl);
        setFormData((prev) => ({ ...prev, thumbnailUrl: fileUrl }));
        onNotify?.({
          type: 'success',
          message: 'Cover image uploaded and attached to course!'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      onNotify?.({
        type: 'warning',
        message: 'Could not upload to media service. You can provide an image URL directly.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Studio Header Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>Course Creator & Curriculum Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Instructor Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author and publish expert curriculum to the academy course directory with interactive lessons and cover media.
          </p>
        </div>
      </div>

      {/* 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course Publishing Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handlePublishCourse}
            className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Course Details & Syllabus Information</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                Draft
              </span>
            </div>

            {/* Course Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Course Title <span className="text-indigo-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Master Cloud Engineering & Microservices"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Category, Level & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Difficulty Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Estimated Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 14 Hours"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Course Description & Overview</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Comprehensive summary of what students will learn, architectural concepts, and practical projects..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Instructor & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Instructor Name</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g. Bhanuka Viraj"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Skill Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="React, Cloud, Python, DevOps"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Thumbnail URL input fallback */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Course Cover Image URL</span>
                {formData.thumbnailUrl && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Image Attached</span>
                  </span>
                )}
              </label>
              <input
                type="text"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/... or drop an image on the right"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={submittingCourse}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submittingCourse ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                <span>Publish Course to Academy</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    category: 'Software Engineering',
                    description: '',
                    tags: 'React, Cloud, System Design',
                    instructor: 'Bhanuka Viraj',
                    level: 'Intermediate',
                    duration: '14 Hours',
                    thumbnailUrl: ''
                  });
                  setSelectedFile(null);
                  setLocalPreview(null);
                  setUploadedUrl('');
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Card Preview & Cover Image Dropzone (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Cover Image Upload Dropzone */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <UploadCloud className="w-4 h-4 text-indigo-600" />
                <span>Upload Course Cover Image</span>
              </div>
              <span className="text-[10px] text-slate-400">Media Service</span>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
                accept="image/*"
              />

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag cover image'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  High resolution JPG, PNG or WebP (max 10MB)
                </p>
              </div>

              {uploading && (
                <div className="w-full space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-semibold text-indigo-700">
                    <span>Uploading media...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-200 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Card Preview */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Card Preview</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Student Perspective</span>
            </div>

            {/* Mini preview card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
              <div className="relative h-36 w-full bg-slate-100">
                {formData.thumbnailUrl || localPreview ? (
                  <img
                    src={formData.thumbnailUrl || localPreview}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 flex gap-1">
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-white/95 text-indigo-700 shadow-sm">
                    {formData.category || 'General'}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded-md bg-slate-900/80 text-white">
                    {formData.level}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {formData.title || 'Course Title Preview'}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {formData.description || 'Course overview and outcomes will appear here as you type in the form...'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate font-medium">{formData.instructor}</span>
                  <span className="text-indigo-600 font-semibold">{formData.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
