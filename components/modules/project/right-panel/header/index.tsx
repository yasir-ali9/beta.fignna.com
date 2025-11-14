"use client";

import { useState } from "react";

export function Header() {
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
    // TODO: Implement panel hiding logic
    console.log("Toggle preview mode:", !showPreview);
  };

  return (
    <div className="p-3 border-b border-bd-50 flex items-center justify-between">
      {/* Avatar placeholder */}
      <div className="w-4 h-4 bg-bk-40 rounded-full border border-bd-50 flex items-center justify-center">
        <span className="text-[8px] text-fg-60">U</span>
      </div>

      {/* Preview toggle icon */}
      <button
        onClick={handlePreviewToggle}
        className="w-4 h-4 flex items-center justify-center text-fg-50 hover:bg-bk-40 rounded transition-colors"
        title="Toggle preview mode"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-fg-50"
        >
          <path
            d="M6 2C3.5 2 1.5 3.5 1 6C1.5 8.5 3.5 10 6 10C8.5 10 10.5 8.5 11 6C10.5 3.5 8.5 2 6 2Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="6"
            cy="6"
            r="1.5"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </button>
    </div>
  );
}
