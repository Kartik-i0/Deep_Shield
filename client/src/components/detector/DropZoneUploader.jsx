import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/utils';

export function DropZoneUploader({
  accept = "image/*",
  mediaType = "image",
  selectedFile,
  onFileSelect,
  onClear,
  disabled = false,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file) => {
    onFileSelect(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {!selectedFile ? (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group cursor-pointer flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl transition-all duration-200 ${
            isDragOver
              ? "border-sky-500 bg-sky-500/10 scale-[1.01]"
              : "border-slate-700/80 hover:border-sky-500/60 bg-slate-900/40 hover:bg-slate-900/70"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800/50 text-sky-400 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-slate-200">
              Drag & drop your {mediaType} file here, or <span className="text-sky-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports {accept.replace(/\/\*/g, '').toUpperCase()} up to 50MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0">
                <File className="w-8 h-8" />
              </div>
            )}

            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-100 truncate">{selectedFile.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{formatBytes(selectedFile.size)} • {selectedFile.type || 'Media File'}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for deepfake scan</span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
            className="text-slate-400 hover:text-rose-400 shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

