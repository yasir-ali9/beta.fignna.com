"use client";

import { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { AttachIcon, SendIcon } from "@/components/reusables/icons/common";

interface PromptInputProps {
  isFloating?: boolean;
  onSubmit?: (message: string) => void;
}

export const PromptInput = observer(
  ({ isFloating = false, onSubmit }: PromptInputProps) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [message]);

    // Prevent canvas zoom/scroll and browser zoom when hovering or interacting with floating prompt
    useEffect(() => {
      if (!isFloating || !containerRef.current) return;

      const handleWheel = (e: WheelEvent) => {
        // Prevent browser zoom (Ctrl+scroll)
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
        }
        // Prevent canvas zoom/scroll
        e.stopPropagation();
      };

      const container = containerRef.current;
      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, [isFloating]);

    const handleSubmit = () => {
      if (!message.trim()) return;

      if (onSubmit) {
        onSubmit(message);
      }

      // TODO: Send message to agent
      console.log("Message:", message);

      setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleAttachment = () => {
      // TODO: Handle file attachment
      console.log("Attachment clicked");
    };

    return (
      <div
        ref={containerRef}
        className={`
        ${
          isFloating
            ? "fixed bottom-0 left-1/2 -translate-x-1/2 w-[500px] bg-bk-50"
            : "w-full bg-bk-40"
        }
        rounded-lg
      `}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="w-full bg-transparent text-fg-50 rounded-t-lg px-3 pt-2.5 pb-1 focus:outline-none resize-none min-h-[42px] max-h-[180px] placeholder:text-fg-70"
          style={{ fontSize: "12px" }}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          rows={1}
        />

        {/* Action Row */}
        <div className="flex items-center justify-between px-2 pb-1.5 pt-0.5">
          {/* Left: Attachment */}
          <button
            onClick={handleAttachment}
            className="w-6 h-6 flex items-center justify-center text-fg-60 hover:text-fg-50 hover:bg-bk-30 rounded transition-colors"
            title="Attach file"
          >
            <AttachIcon size={14} />
          </button>

          {/* Right: Send */}
          <button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="w-6 h-6 flex items-center justify-center text-fg-60 hover:text-fg-50 hover:bg-bk-30 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send message"
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>
    );
  }
);
