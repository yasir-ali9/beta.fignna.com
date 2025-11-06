"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "@/components/icons/common";
import { BACKGROUND_COLOR_PRESETS } from "@/lib/stores/editor/threed";

const LIGHT_MODE_COLOR = "#f5f5f5";
const DARK_MODE_COLOR = "#121212";

export const Background = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handleBackgroundChange = (color: string, preset: string) => {
    editorEngine.threed.updateModelState(selectedNode.id, {
      userSelectedBackground: true,
      solidColorPreset: preset,
      backgroundColor: color,
    });
  };

  const handleResetToTheme = () => {
    // For now, default to light theme
    // In a real app, you'd check the actual theme
    const isLight = true; // TODO: Get from theme context

    editorEngine.threed.updateModelState(selectedNode.id, {
      userSelectedBackground: false,
      backgroundColor: isLight ? LIGHT_MODE_COLOR : DARK_MODE_COLOR,
      solidColorPreset: isLight ? "light" : "dark",
    });
  };

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
        <div className="px-3 pb-3 space-y-3">
          {/* Info */}
          <div className="bg-bk-40 border border-bd-50 rounded p-2">
            <p className="text-[10px] text-fg-60 leading-relaxed">
              ℹ️ This sets the canvas background color for frames and other
              elements.
            </p>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-[11px] text-fg-60">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={modelState.backgroundColor}
                onChange={(e) =>
                  handleBackgroundChange(e.target.value, "custom")
                }
                className="w-8 h-8 rounded cursor-pointer border border-bd-50"
              />
              <input
                type="text"
                value={modelState.backgroundColor}
                onChange={(e) =>
                  handleBackgroundChange(e.target.value, "custom")
                }
                className="flex-1 text-[11px] bg-bk-40 text-fg-50 rounded px-2 py-1.5 border border-bd-50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
