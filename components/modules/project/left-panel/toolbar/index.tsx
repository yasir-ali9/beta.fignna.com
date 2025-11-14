"use client";

import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { CanvasTool } from "@/lib/stores/editor/state";
import { Tooltip } from "@/components/reusables/tooltip";
import {
  MoveToolIcon,
  HandToolIcon,
  FrameToolIcon,
  ThreeDToolIcon,
  ImageToolIcon,
  CommentToolIcon,
  SearchToolIcon,
} from "@/components/reusables/icons/tools";

const Toolbar = observer(() => {
  const editorEngine = useEditorEngine();

  const tools = [
    { id: CanvasTool.MOVE, icon: MoveToolIcon, label: "Move", shortcut: "V" },
    { id: CanvasTool.HAND, icon: HandToolIcon, label: "Hand", shortcut: "H" },
    {
      id: CanvasTool.FRAME,
      icon: FrameToolIcon,
      label: "Frame",
      shortcut: "F",
    },
    {
      id: CanvasTool.THREE_D,
      icon: ThreeDToolIcon,
      label: "3D Tool",
      shortcut: "",
    },
    {
      id: CanvasTool.IMAGE,
      icon: ImageToolIcon,
      label: "Image",
      shortcut: "I",
    },
    {
      id: CanvasTool.COMMENT,
      icon: CommentToolIcon,
      label: "Comment",
      shortcut: "C",
    },
  ];

  const handleToolClick = (toolId: CanvasTool) => {
    editorEngine.state.setCanvasTool(toolId);

    // Set pending layer based on tool (Figma-like behavior)
    switch (toolId) {
      case CanvasTool.THREE_D:
        editorEngine.nodes.setPendingNode("3d", 500, 500);
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
    <div className="px-1.5 pb-1.5">
      <div className="flex items-center justify-between px-0.5 py-0.5 bg-bk-40 rounded-full">
        {/* Tools */}
        <div className="flex items-center">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = editorEngine.state.activeCanvasTool === tool.id;
            const tooltipText = tool.shortcut
              ? `${tool.label} (${tool.shortcut})`
              : tool.label;

            return (
              <Tooltip key={tool.id} content={tooltipText} position="bottom">
                <button
                  onClick={() => handleToolClick(tool.id)}
                  className={`
                    w-9 h-7 flex items-center justify-center rounded-full
                    transition-colors
                    ${isActive
                      ? "bg-bk-20 text-fg-30"
                      : "text-fg-40 hover:bg-bk-30 hover:text-fg-30"
                    }
                  `}
                >
                  <Icon size={14} />
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Search */}
        <Tooltip content="Search" position="bottom">
          <button className="w-9 h-7 flex items-center justify-center rounded-full text-fg-40 hover:bg-bk-30 hover:text-fg-30 transition-colors">
            <SearchToolIcon size={14} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
});

export { Toolbar };
