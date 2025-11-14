"use client";

import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { SparklesIcon } from "@/components/reusables/icons/right";

export const Header = observer(() => {
  const editorEngine = useEditorEngine();

  const handleChatToggle = () => {
    editorEngine.state.toggleChatPanel();
  };

  return (
    <div className="px-3 py-2 border-b border-bd-50 flex items-center justify-between">
      {/* Avatar placeholder */}
      <div className="w-4 h-4 bg-bk-40 rounded-full border border-bd-50 flex items-center justify-center">
        <span className="text-[8px] text-fg-60">U</span>
      </div>

      {/* Chat toggle icon */}
      <button
        onClick={handleChatToggle}
        className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
          editorEngine.state.isChatPanelOpen
            ? "text-fg-50 bg-bk-30"
            : "text-fg-60 hover:text-fg-50 hover:bg-bk-30"
        }`}
        title="Toggle AI chat"
      >
        <SparklesIcon size={12} />
      </button>
    </div>
  );
});
