import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
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

  useEffect(() => {
    if (selectedFile && selectedFile.type?.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    onFileSelect(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
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
          className={`cursor-pointer flex flex-col items-center justify-center p-10 sm:p-12 border-2 border-dashed rounded-2xl transition-all duration-200 ${
            isDragOver
              ? "border-zinc-900 bg-zinc-50 dark:border-zinc-400 dark:bg-zinc-900/60 scale-[0.99]"
              : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50/30 dark:bg-zinc-950/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Click to upload {mediaType} or drag and drop
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Supports standard {accept.replace(/\/\*/g, '').toUpperCase()} files up to 50 MB
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-14 h-14 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                <File className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{selectedFile.name}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {formatBytes(selectedFile.size)} • Ready for check
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
            className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
