"use client";

import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { CanvasTool } from "@/lib/stores/editor/state";
import { Tooltip } from "@/components/reusables/tooltip";
import { Dropdown, useDropdown } from "@/components/reusables/dropdown";
import { ChevronDownIcon } from "@/components/reusables/icons/common";
import {
  MoveToolIcon,
  HandToolIcon,
  FrameToolIcon,
  ThreeDToolIcon,
  CodeToolIcon,
  ImageToolIcon,
  CommentToolIcon,
  SearchToolIcon,
} from "@/components/reusables/icons/tools";

const Toolbar = observer(() => {
  const editorEngine = useEditorEngine();
  const moveHandDropdown = useDropdown();

  // Other tools
  const tools = [
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
      id: CanvasTool.CODE,
      icon: CodeToolIcon,
      label: "Code",
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
      case CanvasTool.CODE:
        editorEngine.nodes.setPendingNode("code", 400, 300);
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

  // Get current active navigation tool (Move or Hand)
  const activeNavTool =
    editorEngine.state.activeCanvasTool === CanvasTool.MOVE ||
    editorEngine.state.activeCanvasTool === CanvasTool.HAND
      ? editorEngine.state.activeCanvasTool
      : CanvasTool.MOVE;

  const ActiveNavIcon =
    activeNavTool === CanvasTool.HAND ? HandToolIcon : MoveToolIcon;

  // Navigation dropdown items
  const navigationItems = [
    {
      label: "Move",
      icon: MoveToolIcon,
      shortcut: "V",
      active: editorEngine.state.canvasTool === CanvasTool.MOVE,
      onClick: () => handleToolClick(CanvasTool.MOVE),
    },
    {
      label: "Hand",
      icon: HandToolIcon,
      shortcut: "H",
      active: editorEngine.state.canvasTool === CanvasTool.HAND,
      onClick: () => handleToolClick(CanvasTool.HAND),
    },
  ];

  return (
    <div className="border-t border-b border-bd-50">
      <div className="flex items-center justify-between px-3 py-2">
        {/* Tools */}
        <div className="flex items-center">
          {/* Move/Hand Dropdown */}
          <Dropdown
            items={navigationItems}
            trigger={
              <Tooltip
                content={
                  activeNavTool === CanvasTool.HAND ? "Hand (H)" : "Move (V)"
                }
                position="bottom"
              >
                <button
                  className={`
                  w-11 h-7 flex items-center justify-center gap-0.5 rounded-lg
                  transition-colors
                  ${
                    editorEngine.state.activeCanvasTool === CanvasTool.MOVE ||
                    editorEngine.state.activeCanvasTool === CanvasTool.HAND
                      ? "bg-bk-30 text-fg-50"
                      : "text-fg-60 hover:text-fg-50 hover:bg-bk-40"
                  }
                `}
                >
                  <ActiveNavIcon size={14} />
                  <ChevronDownIcon
                    size={10}
                    className={`transition-transform ${
                      moveHandDropdown.isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </Tooltip>
            }
            isOpen={moveHandDropdown.isOpen}
            onToggle={moveHandDropdown.toggle}
            onClose={moveHandDropdown.close}
          />

          {/* Other Tools */}
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
                    w-9 h-7 flex items-center justify-center rounded-lg
                    transition-colors
                    ${
                      isActive
                        ? "bg-bk-30 text-fg-50"
                        : "text-fg-60 hover:text-fg-50 hover:bg-bk-40"
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
          <button className="w-9 h-7 flex items-center justify-center rounded-lg text-fg-60 hover:text-fg-50 hover:bg-bk-40 transition-colors">
            <SearchToolIcon size={14} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
});

export { Toolbar };
