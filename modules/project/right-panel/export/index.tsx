"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Tooltip } from "@/components/tooltip";
import { PlusIcon, MinusIcon } from "@/components/icons/common";

export const Export = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportFormat, setExportFormat] = useState("GLB");
  const [exportQuality, setExportQuality] = useState("High");
  const editorEngine = useEditorEngine();
  const currentProject = editorEngine.projects.currentProject;

  const handleExport = () => {
    if (!currentProject) return;

    console.log("Exporting project:", {
      project: currentProject,
      format: exportFormat,
      quality: exportQuality,
    });

    // TODO: Implement actual export functionality
    alert(`Exporting as ${exportFormat} with ${exportQuality} quality`);
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
          Export
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
        <div className="px-3 pb-3 space-y-3">
          {/* Format and Quality in single row */}
          <div className="grid grid-cols-2 gap-2">
            <Tooltip content="Export format" position="top">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full text-[11px] bg-bk-40 text-fg-50 rounded p-2 border border-bd-50"
              >
                <option>GLB</option>
                <option>GLTF</option>
                <option>OBJ</option>
                <option>STL</option>
                <option>PLY</option>
              </select>
            </Tooltip>

            <Tooltip content="Export quality" position="top">
              <select
                value={exportQuality}
                onChange={(e) => setExportQuality(e.target.value)}
                className="w-full text-[11px] bg-bk-40 text-fg-50 rounded p-2 border border-bd-50"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Ultra</option>
              </select>
            </Tooltip>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full py-2 px-3 bg-bk-30 text-fg-50 rounded text-[11px] hover:bg-bk-20 transition-colors border border-bd-50"
          >
            Export 3D Model
          </button>
        </div>
      )}
    </div>
  );
});
