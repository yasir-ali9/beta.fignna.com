"use client";

import { useRef, useState } from "react";
import { observer } from "mobx-react-lite";

interface SVGUploadProps {
  onUpload: (svgData: string, fileName: string) => void;
  currentFileName?: string;
}

export const SVGUpload = observer(
  ({ onUpload, currentFileName }: SVGUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (file: File) => {
      if (!file) return;

      if (file.type !== "image/svg+xml") {
        alert("Please upload an SVG file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const svgData = e.target?.result as string;
        if (svgData) {
          onUpload(svgData, file.name);
        }
      };
      reader.readAsText(file);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };

    return (
      <div className="space-y-2">
        <label className="text-[11px] text-fg-60">SVG File</label>

        <div
          className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors
          ${
            isDragging
              ? "border-fg-30 bg-bk-30"
              : currentFileName
              ? "border-bd-50 bg-bk-40"
              : "border-bd-50 bg-bk-50 hover:bg-bk-40 hover:border-fg-60"
          }
        `}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileInput}
            className="hidden"
          />

          {currentFileName ? (
            <div className="space-y-1">
              <div className="text-[11px] text-fg-50 font-medium">
                {currentFileName}
              </div>
              <div className="text-[10px] text-fg-60">Click to change</div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-[11px] text-fg-60">
                {isDragging ? "Drop SVG here" : "Click or drag SVG file"}
              </div>
              <div className="text-[10px] text-fg-70">Supports .svg files</div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SVGUpload.displayName = "SVGUpload";
