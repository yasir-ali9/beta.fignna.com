"use client";

import { useState } from "react";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import {
  ThreeDToolIcon,
  FrameToolIcon,
  ImageToolIcon,
  CommentToolIcon,
} from "@/components/icons/tools";

export const NodesPanel = observer(() => {
  const [isExpanded, setIsExpanded] = useState(true);
  const editorEngine = useEditorEngine();

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    const multiSelect = event.ctrlKey || event.metaKey;
    editorEngine.nodes.selectNode(nodeId, multiSelect);
  };

  const handleNodeDelete = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    editorEngine.nodes.removeNode(nodeId);
  };

  const handleNodeHover = (nodeId: string | null) => {
    editorEngine.nodes.setHoveredNode(nodeId);
  };

  const allNodes = editorEngine.nodes.nodes;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "3d":
        return ThreeDToolIcon;
      case "frame":
        return FrameToolIcon;
      case "image":
        return ImageToolIcon;
      case "comment":
        return CommentToolIcon;
      default:
        return FrameToolIcon;
    }
  };

  const getNodeName = (node: any, index: number) => {
    const typeName = node.type.charAt(0).toUpperCase() + node.type.slice(1);
    return `${typeName} ${allNodes.length - index}`;
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 transition-colors group"
      >
        <div className="flex items-center gap-2">
          {/* Chevron Icon */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-all ${
              isExpanded
                ? "rotate-90 text-fg-50"
                : "text-fg-60 group-hover:text-fg-50"
            }`}
          >
            <path
              d="M4.5 2L8.5 6L4.5 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`text-[11.5px] font-normal transition-colors ${
              isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
            }`}
          >
            Nodes
          </span>
        </div>

        <span className="text-[10px] text-fg-60">{allNodes.length}</span>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-3 pb-3">
          {allNodes.length === 0 ? (
            <div className="text-[11px] text-fg-30 text-center py-4">
              No nodes yet
            </div>
          ) : (
            <div className="space-y-1">
              {allNodes.map((node, index) => {
                const NodeIcon = getNodeIcon(node.type);
                return (
                  <div
                    key={node.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors group ${
                      editorEngine.nodes.isNodeSelected(node.id)
                        ? "bg-bk-30"
                        : editorEngine.nodes.hoveredNodeId === node.id
                        ? "bg-bk-30"
                        : "hover:bg-bk-40"
                    }`}
                    onClick={(e) => handleNodeClick(node.id, e)}
                    onMouseEnter={() => handleNodeHover(node.id)}
                    onMouseLeave={() => handleNodeHover(null)}
                  >
                    {/* Node Icon */}
                    <div className="w-4 h-4 flex items-center justify-center text-fg-50 shrink-0">
                      <NodeIcon />
                    </div>

                    {/* Node Name */}
                    <span className="text-[11px] text-fg-50 truncate flex-1">
                      {getNodeName(node, index)}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleNodeDelete(node.id, e)}
                      className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center hover:bg-bk-20 rounded transition-opacity"
                      title="Delete node"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 2L8 8M8 2L2 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
