"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider } from "@/lib/providers/editor-provider";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";

function HomePageInner() {
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const router = useRouter();
  const editorEngine = useEditorEngine();

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    setIsCreating(true);
    try {
      const project = editorEngine.projects.createProject({
        name: projectName.trim(),
        description: "3D Vector/SVG Conversion Project",
      });

      // Navigate to the new project
      router.push(`/project/${project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && projectName.trim()) {
      handleCreateProject();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bk-60 font-sans">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fg-50 mb-2">Vecto3D</h1>
          <p className="text-fg-30 text-sm">
            Convert SVG/Vector graphics to 3D models
          </p>
        </div>

        <div className="bg-bk-50 rounded-lg p-6 border border-bd-50">
          <h2 className="text-lg font-medium text-fg-50 mb-4">
            Create New Project
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-fg-30 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter project name..."
                className="w-full px-3 py-2 bg-bk-40 text-fg-50 rounded border border-bd-50 focus:outline-none focus:border-blue-500"
                disabled={isCreating}
              />
            </div>

            <button
              onClick={handleCreateProject}
              disabled={!projectName.trim() || isCreating}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-fg-60">
            Import SVG files • Adjust 3D properties • Export as GLB/GLTF
          </p>
        </div>
      </div>
    </div>
  );
}

const ObservedHomePageInner = observer(HomePageInner);

export default function Home() {
  return (
    <EditorProvider>
      <ObservedHomePageInner />
    </EditorProvider>
  );
}
