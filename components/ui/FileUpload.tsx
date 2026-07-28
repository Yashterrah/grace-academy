"use client";

import * as React from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  invalid?: boolean;
  onFilesSelected: (files: FileList | null) => void;
  registerProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export function FileUpload({
  id,
  label,
  accept = "image/png,image/jpeg,image/webp",
  invalid,
  onFilesSelected,
  registerProps,
}: FileUploadProps) {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    onFilesSelected(files);
    setFileName(files && files[0] ? files[0].name : null);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
        if (inputRef.current) inputRef.current.files = e.dataTransfer.files;
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
        isDragging ? "border-teal-500 bg-teal-50" : "border-ink/15 bg-cream-100/60",
        invalid && "border-red-400"
      )}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-describedby={`${id}-desc`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      {fileName ? (
        <>
          <FileCheck2 className="h-7 w-7 text-teal-600" aria-hidden />
          <p className="max-w-full truncate text-sm font-medium text-ink">{fileName}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFiles(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-ink-faint hover:text-red-600"
          >
            <X className="h-3.5 w-3.5" /> Remove
          </button>
        </>
      ) : (
        <>
          <UploadCloud className="h-7 w-7 text-teal-500" aria-hidden />
          <p className="text-sm font-medium text-ink">{label}</p>
          <p id={`${id}-desc`} className="text-xs text-ink-faint">
            Drag & drop, or click to browse — JPG, PNG or WEBP, up to 5MB
          </p>
        </>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        {...registerProps}
      />
    </div>
  );
}
