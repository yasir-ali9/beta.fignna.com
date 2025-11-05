"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Slider } from "@/components/slider";
import { PlusIcon, MinusIcon } from "@/components/icons/common";

export const Environment = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const editorEngine = useEditorEngine();
  const currentProject = editorEngine.projects.currentProject;

  const handleEnvironmentUpdate = (
    field: string,
    value: string | number | boolean
  ) => {
    if (!currentProject) return;

    editorEngine.projects.updateProject({
      environment: {
        ...currentProject.environment,
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
          Environment
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
          {/* Lighting */}
          <div className="flex items-center gap-3">
            <div className="w-16 flex-shrink-0">
              <span className="text-[11px] text-fg-60">Lighting</span>
            </div>
            <select
              value={currentProject.environment.lighting}
              onChange={(e) =>
                handleEnvironmentUpdate("lighting", e.target.value)
              }
              className="flex-1 text-[11px] bg-bk-40 text-fg-50 rounded p-1 border border-bd-50"
            >
              <option>Studio</option>
              <option>Outdoor</option>
              <option>Indoor</option>
              <option>Sunset</option>
              <option>Night</option>
            </select>
          </div>

          {/* Intensity */}
          <Slider
            label="Intensity"
            value={currentProject.environment.intensity * 100}
            min={0}
            max={200}
            onChange={(value) =>
              handleEnvironmentUpdate("intensity", value / 100)
            }
          />

          {/* Shadows */}
          <div className="flex items-center gap-3">
            <div className="w-16 flex-shrink-0">
              <span className="text-[11px] text-fg-60">Shadows</span>
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentProject.environment.shadows}
                onChange={(e) =>
                  handleEnvironmentUpdate("shadows", e.target.checked)
                }
                className="rounded w-3 h-3"
              />
              <span className="text-[11px] text-fg-60">Enable</span>
            </label>
          </div>

          {/* Shadow Softness - only show if shadows are enabled */}
          {currentProject.environment.shadows && (
            <Slider
              label="Softness"
              value={currentProject.environment.shadowSoftness * 100}
              min={0}
              max={100}
              onChange={(value) =>
                handleEnvironmentUpdate("shadowSoftness", value / 100)
              }
            />
          )}
        </div>
      )}
    </div>
  );
});
