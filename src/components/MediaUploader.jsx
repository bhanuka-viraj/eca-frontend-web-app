import React, { useState, useRef } from 'react';
import { HardDrive, UploadCloud, CheckCircle2, Copy, ExternalLink, Image, FileText, Check, AlertCircle } from 'lucide-react';
import { mediaService } from '../services/api';

export default function MediaUploader({ onNotify, onThumbnailUploaded }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedResult, setUploadedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploadedResult(null);

    // Create local preview if image
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!file) {
      onNotify?.({ type: 'warning', message: 'Please select a file to upload first.' });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const data = await mediaService.upload(file, (percent) => {
        setProgress(percent);
      });

      const fileUrl = data.fileUrl || data.url || (typeof data === 'string' ? data : '');
      const resultObj = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        fileUrl,
        timestamp: new Date().toLocaleTimeString()
      };

      setUploadedResult(resultObj);
      setRecentUploads((prev) => [resultObj, ...prev.slice(0, 4)]);
      onThumbnailUploaded?.(fileUrl);

      onNotify?.({
        type: 'success',
        message: 'File successfully uploaded to Google Cloud Storage bucket!'
      });
    } catch (error) {
      console.error('Upload error:', error);
      onNotify?.({
        type: 'error',
        message: `GCS Upload failed: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify?.({ type: 'info', message: 'GCS URL copied to clipboard!' });
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full">
      {/* Service Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-100">3. Media Service</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GCS Cloud Storage
              </span>
            </div>
            <p className="text-xs text-slate-400">Direct binary object storage for course assets</p>
          </div>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 mb-4 ${
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
          accept="image/*,.pdf,.zip,.mp4"
        />

        <div className="p-3 rounded-full bg-slate-900 text-amber-400 border border-slate-800 shadow-inner">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-200">
            {file ? file.name : 'Click to browse or drag file here'}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">
            PNG, JPG, WebP, PDF or MP4 up to 50MB
          </p>
        </div>

        {file && (
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        )}
      </div>

      {/* Local Preview before upload */}
      {previewUrl && !uploadedResult && (
        <div className="mb-4 text-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
            Local Image Preview
          </span>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-24 mx-auto rounded-lg border border-slate-700 object-contain"
          />
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="mb-4 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-300">
            <span>Uploading to GCS Bucket...</span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Upload Action Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-40 flex items-center justify-center space-x-1.5 mb-4"
      >
        <UploadCloud className="w-4 h-4" />
        <span>{uploading ? 'Streaming to GCS...' : 'Upload to GCS Bucket'}</span>
      </button>

      {/* Uploaded Result View */}
      {uploadedResult && (
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 mb-4 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>GCS Cloud Object Stored</span>
          </div>

          <div className="font-mono text-[11px] text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-slate-800 break-all select-all">
            {uploadedResult.fileUrl}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(uploadedResult.fileUrl)}
              className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy URL'}</span>
            </button>

            <a
              href={uploadedResult.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
              title="Open Public GCS URL"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Recent Uploads Section */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Recent Cloud Uploads
        </div>
        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
          {recentUploads.length === 0 ? (
            <div className="text-[11px] text-slate-500 italic py-2 text-center">
              No files uploaded in this session.
            </div>
          ) : (
            recentUploads.map((item, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center space-x-2 truncate mr-2">
                  <Image className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate text-slate-300 text-[11px]">{item.name}</span>
                </div>
                <button
                  onClick={() => handleCopy(item.fileUrl)}
                  className="p-1 text-slate-400 hover:text-cyan-400 transition"
                  title="Copy URL"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
