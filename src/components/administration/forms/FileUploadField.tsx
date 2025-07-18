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
    <div className="flex relative flex-col gap-1.5 items-start self-stretch">
      <label className="flex relative flex-col items-start self-stretch">
        <span className="relative self-stretch text-xs leading-5 text-gray-700 max-sm:text-xs">
          {label}
        </span>
      </label>
      <div
        className={`flex relative flex-col items-start self-stretch px-2.5 pt-2.5 pb-2.5 bg-white rounded-md border-gray-300 border-solid border-[0.839px] cursor-pointer hover:bg-gray-50 transition-colors ${selectedFile ? 'border-green-500 bg-green-50' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex relative flex-col items-start self-stretch w-full">
          {selectedFile ? (
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <span className="text-xs font-medium text-green-700">
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
                className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="relative self-stretch text-xs text-neutral-500 max-sm:text-xs">
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
