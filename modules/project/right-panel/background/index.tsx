"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Slider } from "@/components/slider";
import { PlusIcon, MinusIcon } from "@/components/icons/common";

export const Background = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const editorEngine = useEditorEngine();
  const currentProject = editorEngine.projects.currentProject;

  const handleBackgroundUpdate = (field: string, value: string | number) => {
    if (!currentProject) return;

    editorEngine.projects.updateProject({
      background: {
        ...currentProject.background,
        [field]: value,
      },
    });
  };

  if (!currentProject) {
    return null;
  }

  return (
    <div className="border-b border-bd-50">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 transition-colors group"
      >
        <span
          className={`text-[11.5px] font-normal transition-colors ${
            isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
          }`}
        >
          Background
        </span>
        <span
          className={`transition-colors ${
            isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
          }`}
        >
          {isExpanded ? <MinusIcon size={12} /> : <PlusIcon size={12} />}
        </span>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          {/* Background Type */}
          <div className="flex items-center gap-3">
            <div className="w-16 flex-shrink-0">
              <span className="text-[11px] text-fg-60">Type</span>
            </div>
            <select
              value={currentProject.background.type}
              onChange={(e) => handleBackgroundUpdate("type", e.target.value)}
              className="flex-1 text-[11px] bg-bk-40 text-fg-50 rounded p-1 border border-bd-50"
            >
              <option>Solid Color</option>
              <option>Gradient</option>
              <option>Environment</option>
              <option>Transparent</option>
            </select>
          </div>

          {/* Color */}
          <div className="flex items-center gap-3">
            <div className="w-16 flex-shrink-0">
              <span className="text-[11px] text-fg-60">Color</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="color"
                value={currentProject.background.color}
                onChange={(e) =>
                  handleBackgroundUpdate("color", e.target.value)
                }
                className="w-6 h-6 bg-bk-40 rounded border border-bd-50 flex-shrink-0"
              />
              <span className="text-[11px] text-fg-50">
                {currentProject.background.color.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Opacity */}
          <Slider
            label="Opacity"
            value={currentProject.background.opacity * 100}
            min={0}
            max={100}
            onChange={(value) => handleBackgroundUpdate("opacity", value / 100)}
          />
        </div>
      )}
    </div>
  );
});
