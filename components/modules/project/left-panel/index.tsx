"use client";

import { useEffect, useRef } from "react";
import { Header } from "./header";
import { Toolbar } from "./toolbar";
import { NodesPanel } from "./nodes-panel";
import { observer } from "mobx-react-lite";

export const LeftPanel = observer(() => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Prevent Ctrl+scroll zoom in this panel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (panel) {
        panel.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div ref={panelRef} className="h-full flex flex-col border-r border-bd-50">
      {/* Header */}
      <Header />

      {/* Toolbar */}
      <Toolbar />

      {/* Nodes/Layers Panel */}
      <NodesPanel />
    </div>
  );
});
