"use client";
import * as React from "react";

interface FileUploadFieldProps {
  label: string;
  placeholder?: string;
  onChange: (file: File | null) => void;
  accept?: string;
  selectedFile?: File | null;
}

export function FileUploadField({
  label,
  placeholder,
  onChange,
  accept,
  selectedFile,
}: FileUploadFieldProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    onChange(file);
  };

  return (
    <div>
      {label && (
        <label className="block mb-1 text-left text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <div
        className={`w-full h-10 px-3 py-2 bg-white border border-zinc-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${selectedFile ? 'border-green-500 bg-green-50' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-start w-full h-full">
          {selectedFile ? (
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-green-700">
                  ✓ {selectedFile.name}
                </span>
                <span className="block text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-500 text-left">
              {placeholder}
            </span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
