"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { Dropdown, useDropdown } from "@/components/reusables/dropdown";
import { observer } from "mobx-react-lite";

const ZOOM_STEP = 0.05;

export const Footer = observer(() => {
  const editorEngine = useEditorEngine();
  const { isOpen, toggle, close } = useDropdown();

  const currentZoom = Math.round(editorEngine.canvas.scale * 100);

  const handleZoomIn = () => {
    const newScale = editorEngine.canvas.scale * (1 + ZOOM_STEP);
    editorEngine.canvas.setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = editorEngine.canvas.scale * (1 - ZOOM_STEP);
    editorEngine.canvas.setScale(newScale);
  };

  const handleResetZoom = () => {
    // Reset zoom to 100% but keep current position (like Figma)
    editorEngine.canvas.setScale(1);
  };

  const handleFitToScreen = () => {
    // Get the canvas container dimensions for proper centering of viewport
    const canvasContainer =
      document.getElementById("canvas-container")?.parentElement;
    if (canvasContainer) {
      const rect = canvasContainer.getBoundingClientRect();
      // Center the viewport (400x400) in the canvas area
      const centerX = (rect.width - 400) / 2;
      const centerY = (rect.height - 400) / 2;
      editorEngine.canvas.setScale(1);
      editorEngine.canvas.setPosition({ x: centerX, y: centerY });
    } else {
      // Fallback: center in viewport
      editorEngine.canvas.setScale(1);
      editorEngine.canvas.setPosition({ x: 200, y: 200 });
    }
  };

  const dropdownItems = [
    {
      label: "Zoom in",
      onClick: handleZoomIn,
    },
    {
      label: "Zoom out",
      onClick: handleZoomOut,
    },
    {
      label: "Fit to screen",
      onClick: handleFitToScreen,
    },
    {
      label: "Reset to 100%",
      onClick: handleResetZoom,
    },
  ];

  const trigger = (
    <button className="px-2 py-1 text-fg-60 hover:text-fg-50 hover:bg-bk-40 rounded text-xs transition-colors">
      {currentZoom}%
    </button>
  );

  return (
    <div className="p-1 pb-2 pr-2 flex justify-end">
      <Dropdown
        items={dropdownItems}
        trigger={trigger}
        isOpen={isOpen}
        onToggle={toggle}
        onClose={close}
        position="top"
        align="right"
      />
    </div>
  );
});
