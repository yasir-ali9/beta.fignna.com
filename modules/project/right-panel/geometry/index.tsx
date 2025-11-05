"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Slider } from "@/components/slider";
import { PlusIcon, MinusIcon } from "@/components/icons/common";

export const Geometry = observer(() => {
  const [isExpanded, setIsExpanded] = useState(true);
  const editorEngine = useEditorEngine();
  const currentProject = editorEngine.projects.currentProject;

  const handleGeometryUpdate = (field: string, value: number) => {
    if (!currentProject) return;

    editorEngine.projects.updateProject({
      geometry: {
        ...currentProject.geometry,
        [field]: value,
      },
    });
  };

  const handlePositionUpdate = (axis: "x" | "y" | "z", value: number) => {
    if (!currentProject) return;

    editorEngine.projects.updateProject({
      geometry: {
        ...currentProject.geometry,
        position: {
          ...currentProject.geometry.position,
          [axis]: value,
        },
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
          Geometry
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
          {/* Depth */}
          <Slider
            label="Depth"
            value={currentProject.geometry.depth}
            min={0}
            max={100}
            onChange={(value) => handleGeometryUpdate("depth", value)}
          />

          {/* Bevel */}
          <Slider
            label="Bevel"
            value={currentProject.geometry.bevel}
            min={0}
            max={10}
            onChange={(value) => handleGeometryUpdate("bevel", value)}
          />

          {/* Scale */}
          <Slider
            label="Scale"
            value={currentProject.geometry.scale}
            min={0.1}
            max={3}
            step={0.1}
            onChange={(value) => handleGeometryUpdate("scale", value)}
          />

          {/* Position */}
          <div className="space-y-1 pt-1">
            <label className="text-[11px] text-fg-60">Position</label>
            <div className="grid grid-cols-3 gap-1">
              <input
                type="number"
                placeholder="X"
                value={currentProject.geometry.position.x}
                onChange={(e) =>
                  handlePositionUpdate("x", Number(e.target.value) || 0)
                }
                className="text-[11px] bg-bk-40 text-fg-50 rounded p-1 border border-bd-50 text-center"
              />
              <input
                type="number"
                placeholder="Y"
                value={currentProject.geometry.position.y}
                onChange={(e) =>
                  handlePositionUpdate("y", Number(e.target.value) || 0)
                }
                className="text-[11px] bg-bk-40 text-fg-50 rounded p-1 border border-bd-50 text-center"
              />
              <input
                type="number"
                placeholder="Z"
                value={currentProject.geometry.position.z}
                onChange={(e) =>
                  handlePositionUpdate("z", Number(e.target.value) || 0)
                }
                className="text-[11px] bg-bk-40 text-fg-50 rounded p-1 border border-bd-50 text-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
