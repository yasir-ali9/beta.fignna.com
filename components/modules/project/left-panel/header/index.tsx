"use client";

import { useState, useRef, useEffect } from "react";
import { Logo } from "@/components/reusables/logo";
import {
  ContextMenu,
  useContextMenu,
} from "@/components/reusables/menu/context-menu";
import { useTheme } from "@/lib/providers/theme-provider";

export function Header() {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  const [projectName, setProjectName] = useState("Fignna");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  const contextMenuItems = [
    {
      label: "New project",
      onClick: () => {
        window.location.href = "/";
      },
    },
    {
      label: "Save project",
      onClick: () => {
        console.log("Save project");
      },
    },
    {
      label: "Export",
      onClick: () => {
        console.log("Export");
      },
    },
    {
      label: theme === "dark" ? "Light theme" : "Dark theme",
      onClick: () => {
        toggleTheme();
      },
    },
    {
      label: "Settings",
      onClick: () => {
        console.log("Settings");
      },
    },
  ];

  // Auto-focus and select text when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleInputClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (!projectName.trim()) {
      setProjectName("Fignna");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setProjectName("Fignna");
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <div className="p-2 flex items-center gap-0.5">
        {/* Logo - clickable for context menu */}
        <button
          onContextMenu={showContextMenu}
          onClick={showContextMenu}
          className="flex items-center justify-center hover:bg-bk-40 rounded p-1 shrink-0 text-fg-60 hover:text-fg-50 transition-colors"
        >
          <Logo className="w-5 h-5" />
        </button>

        {/* Project Name Input */}
        <input
          ref={inputRef}
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onClick={handleInputClick}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="flex-1 text-[11.5px] font-normal text-fg-50 bg-transparent px-1 py-0.5 rounded cursor-text border border-transparent hover:border-bd-50 focus:border-ac-01 outline-none"
          style={{ minWidth: 0 }}
        />
      </div>

      <ContextMenu
        items={contextMenuItems}
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={hideContextMenu}
      />
    </>
  );
}
