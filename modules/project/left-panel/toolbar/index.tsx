"use client";

import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { CanvasTool } from "@/lib/stores/editor/state";
import {
  MoveToolIcon,
  HandToolIcon,
  FrameToolIcon,
  ThreeDToolIcon,
  ImageToolIcon,
  CommentToolIcon,
  SearchToolIcon,
} from "@/components/icons/tools";

const Toolbar = observer(() => {
  const editorEngine = useEditorEngine();

  const tools = [
    { id: CanvasTool.MOVE, icon: MoveToolIcon, label: "Move (V)" },
    { id: CanvasTool.HAND, icon: HandToolIcon, label: "Hand (H)" },
    { id: CanvasTool.FRAME, icon: FrameToolIcon, label: "Frame (F)" },
    { id: CanvasTool.THREE_D, icon: ThreeDToolIcon, label: "3D Tool" },
    { id: CanvasTool.IMAGE, icon: ImageToolIcon, label: "Image (I)" },
    { id: CanvasTool.COMMENT, icon: CommentToolIcon, label: "Comment (C)" },
  ];

  const handleToolClick = (toolId: CanvasTool) => {
    editorEngine.state.setCanvasTool(toolId);

    // Set pending layer based on tool (Figma-like behavior)
    switch (toolId) {
      case CanvasTool.THREE_D:
        editorEngine.nodes.setPendingNode("3d", 200, 200);
        break;
      case CanvasTool.FRAME:
        editorEngine.nodes.setPendingNode("frame", 300, 300);
        break;
      case CanvasTool.IMAGE:
        editorEngine.nodes.setPendingNode("image", 200, 200);
        break;
      case CanvasTool.COMMENT:
        editorEngine.nodes.setPendingNode("comment", 100, 100);
        break;
      default:
        editorEngine.nodes.setPendingNode(null);
        break;
    }
  };

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-bk-70 border-b border-bd-50">
      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = editorEngine.state.activeCanvasTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`
                w-8 h-8 flex items-center justify-center rounded
                transition-colors
                ${
                  isActive
                    ? "bg-bk-50 text-fg-50 border border-bd-50"
                    : "text-fg-40 hover:bg-bk-60 hover:text-fg-60"
                }
              `}
              title={tool.label}
            >
              <Icon />
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-bd-50 mx-1" />

      {/* Search */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded text-fg-40 hover:bg-bk-60 hover:text-fg-20 transition-colors ml-auto"
        title="Search"
      >
        <SearchToolIcon />
      </button>
    </div>
  );
});

export { Toolbar };
