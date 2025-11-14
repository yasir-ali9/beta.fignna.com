"use client";

import { useEffect, useRef } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { Layout } from "./layout";
import { Geometry } from "./threed/geometry";
import { Material } from "./threed/material";
import { Environment } from "./threed/environment";
import { Background } from "./threed/background";
import { Export } from "./threed/export";
import { ChatPanel } from "./chat-panel";
import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";

export const RightPanel = observer(() => {
  const editorEngine = useEditorEngine();
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
    <div ref={panelRef} className="h-full flex flex-col border-l border-bd-50">
      {/* Header */}
      <Header />

      {/* Conditional content based on chat panel state */}
      {editorEngine.state.isChatPanelOpen ? (
        <ChatPanel />
      ) : (
        <>
          {/* Sections - No tabs, just stacked sections */}
          <div className="flex-1 overflow-auto">
            <Layout />
            <Geometry />
            <Material />
            <Environment />
            <Background />
            <Export />
          </div>

          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  );
});
