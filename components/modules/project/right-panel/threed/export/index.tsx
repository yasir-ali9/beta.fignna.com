"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "@/components/reusables/icons/common";
import { handleExport, PNG_RESOLUTIONS } from "@/lib/threed/exporters";

export const Export = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const editorEngine = useEditorEngine();
  const selectedNodeId = editorEngine.nodes.selectedNodeId;
  const selectedNode = selectedNodeId
    ? editorEngine.nodes.getNode(selectedNodeId)
    : null;

  const is3DNode = selectedNode?.type === "3d";
  const modelState = is3DNode
    ? editorEngine.threed.getModelState(selectedNode.id)
    : null;

  // Only show for 3D nodes - return after all hooks
  if (!is3DNode || !selectedNode || !modelState) {
    return null;
  }

  const handleExportClick = async (
    format: "stl" | "gltf" | "glb" | "png",
    resolution: number = 1
  ) => {
    setIsExporting(true);
    try {
      // Get the model ref from window (temporary solution)
      const modelRef = { current: (window as any).__current3DModel || null };
      const fileName = modelState.fileName || "model";

      // For PNG, we need the canvas element
      let canvasElement: HTMLCanvasElement | null = null;
      if (format === "png") {
        canvasElement = document.querySelector("canvas");
      }

      await handleExport(format, modelRef, fileName, resolution, canvasElement);
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border-b border-bd-50">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 transition-colors group"
      >
        <span
          className={`text-[11.5px] font-normal transition-colors ${isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
            }`}
        >
          Export
        </span>
        <span
          className={`transition-colors ${isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
            }`}
        >
          {isExpanded ? <MinusIcon size={12} /> : <PlusIcon size={12} />}
        </span>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-3 pb-2 space-y-2">
          {/* 💡 Tip: Use STL for 3D printing, GLB for games/AR, PNG for presentations */}

          {/* Export 3D Models */}
          <div className="space-y-1">
            <label className="text-[10px] text-fg-60">3D Model</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleExportClick("stl")}
                disabled={isExporting}
                className="h-[26px] text-[11px] rounded transition-colors bg-bk-40 text-fg-50 hover:bg-bk-30 border border-bd-50 hover:border-bd-55 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? "..." : "STL"}
              </button>
              <button
                onClick={() => handleExportClick("glb")}
                disabled={isExporting}
                className="h-[26px] text-[11px] rounded transition-colors bg-bk-40 text-fg-50 hover:bg-bk-30 border border-bd-50 hover:border-bd-55 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? "..." : "GLB"}
              </button>
              <button
                onClick={() => handleExportClick("gltf")}
                disabled={isExporting}
                className="h-[26px] text-[11px] rounded transition-colors bg-bk-40 text-fg-50 hover:bg-bk-30 border border-bd-50 hover:border-bd-55 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? "..." : "GLTF"}
              </button>
            </div>
          </div>

          {/* Export Images */}
          <div className="space-y-1">
            <label className="text-[10px] text-fg-60">Image</label>
            <div className="grid grid-cols-3 gap-1">
              {PNG_RESOLUTIONS.map((resolution) => (
                <button
                  key={resolution.multiplier}
                  onClick={() =>
                    handleExportClick("png", resolution.multiplier)
                  }
                  disabled={isExporting}
                  className="h-[26px] text-[11px] rounded transition-colors bg-bk-40 text-fg-50 hover:bg-bk-30 border border-bd-50 hover:border-bd-55 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? "..." : resolution.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
