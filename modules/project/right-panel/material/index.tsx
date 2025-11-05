"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Slider } from "@/components/slider";
import { PlusIcon, MinusIcon } from "@/components/icons/common";

export const Material = observer(() => {
  const [isExpanded, setIsExpanded] = useState(true);
  const editorEngine = useEditorEngine();
  const currentProject = editorEngine.projects.currentProject;

  const handleMaterialUpdate = (field: string, value: string | number) => {
    if (!currentProject) return;

    editorEngine.projects.updateProject({
      material: {
        ...currentProject.material,
        [field]: value,
      },
    });
  };

  const handlePresetClick = (preset: string) => {
    if (!currentProject) return;

    const presets = {
      Gold: { color: "#FFD700", metalness: 1, roughness: 0.1 },
      Silver: { color: "#C0C0C0", metalness: 1, roughness: 0.1 },
      Copper: { color: "#B87333", metalness: 1, roughness: 0.2 },
      Chrome: { color: "#E5E5E5", metalness: 1, roughness: 0.05 },
    };

    const presetValues = presets[preset as keyof typeof presets];
    if (presetValues) {
      editorEngine.projects.updateProject({
        material: {
          ...currentProject.material,
          ...presetValues,
        },
      });
    }
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
          Material
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
          {/* Material Type */}
          <div className="flex items-center gap-3">
            <div className="w-16 flex-shrink-0">
              <span className="text-[11px] text-fg-60">Type</span>
            </div>
            <select
              value={currentProject.material.type}
              onChange={(e) => handleMaterialUpdate("type", e.target.value)}
              className="flex-1 text-[11px] bg-bk-40 text-fg-50 rounded p-1 border border-bd-50"
            >
              <option>Standard</option>
              <option>Metallic</option>
              <option>Glass</option>
              <option>Plastic</option>
              <option>Wood</option>
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
                value={currentProject.material.color}
                onChange={(e) => handleMaterialUpdate("color", e.target.value)}
                className="w-6 h-6 bg-bk-40 rounded border border-bd-50 flex-shrink-0"
              />
              <span className="text-[11px] text-fg-50">
                {currentProject.material.color.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Opacity */}
          <Slider
            label="Opacity"
            value={currentProject.material.opacity * 100}
            min={0}
            max={100}
            onChange={(value) => handleMaterialUpdate("opacity", value / 100)}
          />

          {/* Roughness */}
          <Slider
            label="Roughness"
            value={currentProject.material.roughness * 100}
            min={0}
            max={100}
            onChange={(value) => handleMaterialUpdate("roughness", value / 100)}
          />

          {/* Metalness */}
          <Slider
            label="Metalness"
            value={currentProject.material.metalness * 100}
            min={0}
            max={100}
            onChange={(value) => handleMaterialUpdate("metalness", value / 100)}
          />

          {/* Presets */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-16 flex-shrink-0">
              <span className="text-[11px] text-fg-60">Presets</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-1">
              {["Gold", "Silver", "Copper", "Chrome"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className="text-[11px] bg-bk-40 text-fg-50 rounded p-1 hover:bg-bk-30 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
