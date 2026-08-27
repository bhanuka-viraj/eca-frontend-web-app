import React, { useState, useRef } from 'react';
import {
  Video,
  PlusCircle,
  UploadCloud,
  HardDrive,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Tag,
  BookOpen,
  Clock,
  User,
  Layers,
  ArrowRight,
  Link2
} from 'lucide-react';
import { courseService, mediaService } from '../services/api';

export default function InstructorStudio({ onNotify, onCourseCreated }) {
  // Course Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cloud',
    description: '',
    tags: 'GCP, Docker, Spring Boot',
    instructor: 'J P Bhanuka Viraj Madhuranga',
    level: 'Intermediate',
    duration: '14 Hours',
    thumbnailUrl: ''
  });

  const [submittingCourse, setSubmittingCourse] = useState(false);

  // GCS Media Hub State
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastUploadedUrl, setLastUploadedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);
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
        instructor: formData.instructor,
        level: formData.level,
        duration: formData.duration,
        thumbnailUrl: formData.thumbnailUrl || null
      };

      await courseService.create(payload);
      onNotify?.({
        type: 'success',
        message: `Course "${formData.title}" published successfully to MongoDB Atlas!`
      });

      // Reset form
      setFormData({
        title: '',
        category: 'Cloud',
        description: '',
        tags: 'GCP, Docker, Spring Boot',
        instructor: 'J P Bhanuka Viraj Madhuranga',
        level: 'Intermediate',
        duration: '14 Hours',
        thumbnailUrl: ''
      });

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

  // GCS File Select
  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setLocalPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setLocalPreview(null);
    }
  };

  // GCS Upload Execution
  const handleUploadToGCS = async () => {
    if (!selectedFile) {
      onNotify?.({ type: 'warning', message: 'Please select a file to upload to GCS.' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await mediaService.upload(selectedFile, (pct) => {
        setUploadProgress(pct);
      });

      const fileUrl = result.fileUrl || result.url || (typeof result === 'string' ? result : '');
      setLastUploadedUrl(fileUrl);

      // Auto bind to course thumbnail
      setFormData((prev) => ({ ...prev, thumbnailUrl: fileUrl }));

      const record = {
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(1) + ' KB',
        fileUrl,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setRecentUploads((prev) => [record, ...prev.slice(0, 4)]);

      onNotify?.({
        type: 'success',
        message: 'Binary asset uploaded to Google Cloud Storage & bound to Course Draft!'
      });
    } catch (error) {
      console.error('Upload to GCS failed:', error);
      onNotify?.({
        type: 'error',
        message: `GCS Upload Error: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify?.({ type: 'info', message: 'GCS Public URL copied to clipboard!' });
  };

  const handleAutoBind = (url) => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: url }));
    onNotify?.({ type: 'success', message: 'Bound GCS URL to Course Thumbnail!' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Studio Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>Course Creator & Media Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Instructor Studio & <span className="text-gradient">GCS Media Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Author and publish dynamic course curriculum directly into <span className="text-emerald-400 font-mono">MongoDB Atlas</span> and stream assets into <span className="text-amber-400 font-mono">Google Cloud Storage</span>.
          </p>
        </div>
      </div>

      {/* 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course Creation Wizard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handlePublishCourse}
            className="rounded-2xl glass-card p-6 border border-slate-800/90 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Course Metadata & Curriculum Specification</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                MongoDB Document Schema
              </span>
            </div>

            {/* Course Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Course Title <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Master Microservices Architecture on Google Cloud Run"
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Category, Level & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Cloud">Cloud</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Java">Java</option>
                  <option value="AI">AI & Data</option>
                  <option value="Microservices">Microservices</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Difficulty Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 14 Hours"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Course Syllabus Summary</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Comprehensive overview of learning outcomes, architectural patterns, and practical labs covered in this curriculum..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Instructor & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Instructor Name</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g. Bhanuka Viraj"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="GCP, Docker, Spring, MySQL"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Thumbnail URL binding */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Link2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Thumbnail Image URL (Google Cloud Storage)</span>
                </label>
                {formData.thumbnailUrl && (
                  <span className="text-[10px] text-emerald-400 font-mono">Bound to Media Asset ✓</span>
                )}
              </div>
              <input
                type="text"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                placeholder="https://storage.googleapis.com/... or upload via Media Hub ->"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={submittingCourse}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submittingCourse ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                <span>Publish Course to MongoDB Atlas</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    category: 'Cloud',
                    description: '',
                    tags: 'GCP, Docker, Spring Boot',
                    instructor: 'J P Bhanuka Viraj Madhuranga',
                    level: 'Intermediate',
                    duration: '14 Hours',
                    thumbnailUrl: ''
                  });
                }}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview & Cloud Storage Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Card Preview */}
          <div className="rounded-2xl glass-card p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Course Card Preview</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Student View</span>
            </div>

            {/* Mini preview card */}
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden shadow-lg">
              <div className="relative h-32 w-full bg-slate-900">
                {formData.thumbnailUrl ? (
                  <img
                    src={formData.thumbnailUrl}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                    {formData.category || 'Cloud'}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-900/80 text-slate-300 border border-slate-700">
                    {formData.level}
                  </span>
                </div>
              </div>

              <div className="p-3.5 space-y-2">
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                  {formData.title || 'Course Title Preview'}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {formData.description || 'Course description will appear here as you type in the studio form...'}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate">{formData.instructor}</span>
                  <span className="font-mono text-cyan-400">{formData.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* GCS Media Hub (Drag & Drop Uploader) */}
          <div className="rounded-2xl glass-card p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>Cloud Storage Media Hub</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                GCS Object Store
              </span>
            </div>

            {/* Drag and Drop Zone */}
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
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                isDragOver
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-slate-700/80 bg-slate-950/40 hover:border-amber-500/40 hover:bg-slate-900/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
                accept="image/*,.pdf,.mp4"
              />

              <div className="p-2.5 rounded-full bg-slate-900 text-amber-400 border border-slate-800">
                <UploadCloud className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to select or drag thumbnail image'}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP up to 25MB
                </p>
              </div>

              {selectedFile && (
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>

            {/* Local Preview before upload */}
            {localPreview && !lastUploadedUrl && (
              <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <img
                  src={localPreview}
                  alt="Preview"
                  className="max-h-24 mx-auto rounded-lg border border-slate-700 object-contain"
                />
              </div>
            )}

            {/* Live Upload Progress */}
            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Streaming binary to GCS Bucket...</span>
                  <span className="text-amber-400 font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Upload Action Button */}
            <button
              type="button"
              onClick={handleUploadToGCS}
              disabled={!selectedFile || uploading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-40 flex items-center justify-center space-x-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? 'Uploading to GCS...' : 'Upload to Google Cloud Storage'}</span>
            </button>

            {/* Upload Result & Binding */}
            {lastUploadedUrl && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Asset Uploaded & Auto-Bound to Draft!</span>
                </div>

                <div className="font-mono text-[10px] text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-slate-800 break-all select-all">
                  {lastUploadedUrl}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(lastUploadedUrl)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                  </button>

                  <a
                    href={lastUploadedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
                    title="Open in GCS"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Session Upload History */}
            {recentUploads.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Session GCS Uploads
                </div>
                {recentUploads.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition"
                  >
                    <div className="flex items-center space-x-2 truncate mr-2">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate text-slate-300 text-[11px]">{item.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAutoBind(item.fileUrl)}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-0.5 rounded bg-slate-800 transition"
                    >
                      Bind
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
