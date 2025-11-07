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
        <div className="px-3 pb-2 space-y-2">
          {/* ℹ️ This sets the canvas background color for frames and other elements. */}

          {/* Color Picker - Integrated Design */}
          <div className="space-y-1">
            <label className="text-[10px] text-fg-60">Color</label>
            <div className="relative flex items-center bg-bk-40 rounded border border-bd-50 hover:border-bd-55 focus-within:border-ac-01 h-[26px]">
              {/* Color Picker as Icon */}
              <div className="relative flex items-center justify-center shrink-0 pl-1.5 pr-1">
                <input
                  type="color"
                  value={modelState.backgroundColor}
                  onChange={(e) =>
                    handleBackgroundChange(e.target.value, "custom")
                  }
                  className="w-[14px] h-[14px] rounded cursor-pointer"
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundColor: modelState.backgroundColor,
                    border: "none",
                    outline: "none",
                    padding: 0,
                  }}
                />
              </div>

              {/* Text Input */}
              <input
                type="text"
                value={modelState.backgroundColor}
                onChange={(e) =>
                  handleBackgroundChange(e.target.value, "custom")
                }
                className="flex-1 h-full min-w-0 bg-transparent text-fg-50 text-[11px] font-normal transition-none! focus:outline-none pr-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
