"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState, useCallback } from "react";
import { PropertyInput } from "@/components/property-input";
import { PlusIcon, MinusIcon } from "@/components/icons/common";
import { OpacityIcon, AngleIcon } from "@/components/icons/right";

export const Layout = observer(() => {
  const [isExpanded, setIsExpanded] = useState(true);
  const editorEngine = useEditorEngine();
  const selectedNodeId = editorEngine.nodes.selectedNodeId;
  const selectedNode = selectedNodeId
    ? editorEngine.nodes.getNode(selectedNodeId)
    : null;

  const handleUpdate = useCallback(
    (field: string, value: number) => {
      if (!selectedNodeId) return;
      editorEngine.nodes.updateNode(selectedNodeId, { [field]: value });
    },
    [selectedNodeId, editorEngine.nodes]
  );

  // Don't show if no node is selected
  if (!selectedNode) {
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
          Layout
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
          {/* Row 1: X, Y, Rotation */}
          <div className="grid grid-cols-3 gap-2">
            <PropertyInput
              label="X"
              value={selectedNode.x}
              onChange={(value) => handleUpdate("x", value)}
            />
            <PropertyInput
              label="Y"
              value={selectedNode.y}
              onChange={(value) => handleUpdate("y", value)}
            />
            <PropertyInput
              icon={<AngleIcon size={14} />}
              value={
                selectedNode.rotation !== undefined
                  ? selectedNode.rotation
                  : 180
              }
              onChange={(value) => handleUpdate("rotation", value)}
              unit="°"
              min={0}
              max={360}
            />
          </div>

          {/* Row 2: Width, Height, Opacity */}
          <div className="grid grid-cols-3 gap-2">
            <PropertyInput
              label="W"
              value={selectedNode.width}
              onChange={(value) => handleUpdate("width", value)}
              min={1}
            />
            <PropertyInput
              label="H"
              value={selectedNode.height}
              onChange={(value) => handleUpdate("height", value)}
              min={1}
            />
            <PropertyInput
              icon={<OpacityIcon size={14} />}
              value={
                selectedNode.opacity !== undefined
                  ? selectedNode.opacity * 100
                  : 100
              }
              onChange={(value) => handleUpdate("opacity", value / 100)}
              unit="%"
              min={0}
              max={100}
            />
          </div>
        </div>
      )}
    </div>
  );
});
