"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ProjectEditor } from "@/modules/project";
import { EditorProvider } from "@/lib/providers/editor-provider";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";

function ProjectPageInner() {
  const params = useParams();
  const projectId = params.id as string;
  const engine = useEditorEngine();

  useEffect(() => {
    // Load the project when the page loads
    engine.projects.loadProject(projectId);
  }, [projectId, engine.projects]);

  return (
    <div className="h-screen w-full max-w-full flex flex-col bg-bk-40 overflow-hidden">
      <ProjectEditor projectId={projectId} />
    </div>
  );
}

const ObservedProjectPageInner = observer(ProjectPageInner);

export default function ProjectPage() {
  return (
    <EditorProvider>
      <ObservedProjectPageInner />
    </EditorProvider>
  );
}
