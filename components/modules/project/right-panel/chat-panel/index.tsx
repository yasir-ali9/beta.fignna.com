"use client";

import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { PromptInput } from "../../common/prompt-input";
import Image from "next/image";
import { useTheme } from "@/lib/providers/theme-provider";

export const ChatPanel = observer(() => {
  const editorEngine = useEditorEngine();
  const { theme } = useTheme();

  const handleMessageSubmit = (message: string) => {
    // TODO: Send message to AI agent
    console.log("Chat message:", message);
  };

  if (!editorEngine.state.isChatPanelOpen) {
    return null;
  }

  const logoSrc =
    theme === "dark"
      ? "/svgs/home/logo-outline-dark.svg"
      : "/svgs/home/logo-outline-light.svg";

  return (
    <div className="h-full flex flex-col">
      {/* Chat messages area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-center mt-8">
          <Image
            src={logoSrc}
            alt="Fignna Logo"
            width={150}
            height={150}
            priority
          />
        </div>
      </div>

      {/* Prompt input at bottom */}
      <div className="px-3 pt-2 pb-3">
        <PromptInput onSubmit={handleMessageSubmit} />
      </div>
    </div>
  );
});
