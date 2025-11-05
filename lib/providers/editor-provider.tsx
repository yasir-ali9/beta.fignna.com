"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { EditorEngine } from "@/lib/stores/editor";
import { EditorEngineProvider } from "@/lib/stores/editor/hooks";

interface EditorProviderProps {
  children: React.ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [engine] = useState(() => new EditorEngine());

  useEffect(() => {
    // Initialize the engine
    engine.projects.initialize();

    // Cleanup on unmount
    return () => {
      engine.dispose();
    };
  }, [engine]);

  return <EditorEngineProvider value={engine}>{children}</EditorEngineProvider>;
}
