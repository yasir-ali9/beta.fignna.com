"use client";

import { Logo } from "@/components/logo";
import { ContextMenu, useContextMenu } from "@/components/menu/context-menu";

export function Header() {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const contextMenuItems = [
    {
      label: "New Project",
      onClick: () => {
        window.location.href = "/";
      },
    },
    {
      label: "Save Project",
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
      label: "Settings",
      onClick: () => {
        console.log("Settings");
      },
    },
  ];

  return (
    <>
      <div className="p-3 flex items-center justify-between">
        <button
          onContextMenu={showContextMenu}
          onClick={showContextMenu}
          className="flex items-center gap-2 hover:bg-bk-40 rounded p-1 -m-1 transition-colors"
        >
          <Logo className="w-4 h-4 text-fg-50" />
          <span className="text-[11.5px] font-normal text-fg-50">Vecto3D</span>
        </button>
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
