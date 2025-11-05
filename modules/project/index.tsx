"use client";

import { LeftPanel } from "./left-panel";
import { RightPanel } from "./right-panel";
import { CentralArea } from "./central";
import { ResizablePanel } from "@/components/resizable";
import { observer } from "mobx-react-lite";

interface ProjectEditorProps {
  projectId: string;
}

export const ProjectEditor = observer(({ projectId }: ProjectEditorProps) => {
  return (
    <div className="flex h-full w-full">
      {/* Left Panel - Resizable */}
      <ResizablePanel
        defaultWidth={280}
        minWidth={200}
        maxWidth={400}
        position="left"
      >
        <LeftPanel />
      </ResizablePanel>

      {/* Central Canvas Area */}
      <div className="flex-1 h-full">
        <CentralArea />
      </div>

      {/* Right Panel - Resizable */}
      <ResizablePanel
        defaultWidth={280}
        minWidth={200}
        maxWidth={400}
        position="right"
      >
        <RightPanel />
      </ResizablePanel>
    </div>
  );
});
