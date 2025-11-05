"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";

const Viewport = observer(() => {
  const editorEngine = useEditorEngine();
  const currentProject = editorEngine.projects.currentProject;
  const currentFile = editorEngine.files.currentFile;

  if (currentFile?.type === "svg") {
    return (
      <div className="w-96 h-96 bg-white rounded-lg shadow-lg border border-bd-50 flex items-center justify-center">
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: currentFile.content }}
        />
      </div>
    );
  }

  return (
    <div className="w-96 h-96 bg-bk-50 border border-bd-50 flex items-center justify-center">
      <div className="text-fg-30 text-center">
        <div className="text-sm">
          {currentProject
            ? "Import any SVG to get started"
            : "Create or load a project"}
        </div>
      </div>
    </div>
  );
});

export { Viewport };
