import { EditorEngine } from "@/lib/stores/editor";
import { CanvasTool } from "@/lib/stores/editor/state";

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: (engine: EditorEngine) => void;
}

export class ShortcutsManager {
  private shortcuts: Map<string, Shortcut> = new Map();
  private editorEngine: EditorEngine | null = null;

  constructor() {
    this.registerDefaultShortcuts();
  }

  setEditorEngine(engine: EditorEngine) {
    this.editorEngine = engine;
  }

  private registerDefaultShortcuts() {
    // Tool shortcuts
    this.register({
      key: "v",
      description: "Move tool",
      action: (engine) => engine.state.setCanvasTool(CanvasTool.MOVE),
    });

    this.register({
      key: "h",
      description: "Hand tool",
      action: (engine) => engine.state.setCanvasTool(CanvasTool.HAND),
    });

    this.register({
      key: "f",
      description: "Frame tool",
      action: (engine) => {
        engine.state.setCanvasTool(CanvasTool.FRAME);
        engine.nodes.setPendingNode("frame", 300, 300);
      },
    });

    this.register({
      key: "3",
      description: "3D tool",
      action: (engine) => {
        engine.state.setCanvasTool(CanvasTool.THREE_D);
        engine.nodes.setPendingNode("3d", 200, 200);
      },
    });

    this.register({
      key: "i",
      description: "Image tool",
      action: (engine) => {
        engine.state.setCanvasTool(CanvasTool.IMAGE);
        engine.nodes.setPendingNode("image", 200, 200);
      },
    });

    this.register({
      key: "c",
      description: "Comment tool",
      action: (engine) => {
        engine.state.setCanvasTool(CanvasTool.COMMENT);
        engine.nodes.setPendingNode("comment", 100, 100);
      },
    });

    // Node/layer actions
    this.register({
      key: "Delete",
      description: "Delete selected nodes",
      action: (engine) => {
        if (engine.nodes.selectedNodeIds.length > 0) {
          engine.nodes.removeSelectedNodes();
        }
      },
    });

    this.register({
      key: "Backspace",
      description: "Delete selected nodes",
      action: (engine) => {
        if (engine.nodes.selectedNodeIds.length > 0) {
          engine.nodes.removeSelectedNodes();
        }
      },
    });

    // Select all
    this.register({
      key: "a",
      ctrl: true,
      description: "Select all nodes",
      action: (engine) => {
        engine.nodes.selectAllNodes();
      },
    });

    // Duplicate selected nodes/layers
    this.register({
      key: "d",
      ctrl: true,
      description: "Duplicate selected nodes",
      action: (engine) => {
        if (engine.nodes.selectedNodeIds.length > 0) {
          engine.nodes.duplicateSelectedNodes();
        }
      },
    });

    // Delete all (Ctrl+Delete)
    this.register({
      key: "Delete",
      ctrl: true,
      description: "Delete all nodes",
      action: (engine) => {
        engine.nodes.clearNodes();
      },
    });
  }

  register(shortcut: Shortcut) {
    const key = this.getShortcutKey(
      shortcut.key,
      shortcut.ctrl,
      shortcut.shift,
      shortcut.alt
    );
    this.shortcuts.set(key, shortcut);
  }

  unregister(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean) {
    const shortcutKey = this.getShortcutKey(key, ctrl, shift, alt);
    this.shortcuts.delete(shortcutKey);
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    // Don't handle shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.contentEditable === "true"
    ) {
      return false;
    }

    const key = this.getShortcutKey(
      event.key,
      event.ctrlKey || event.metaKey,
      event.shiftKey,
      event.altKey
    );

    const shortcut = this.shortcuts.get(key);
    if (shortcut && this.editorEngine) {
      event.preventDefault();
      shortcut.action(this.editorEngine);
      return true;
    }

    return false;
  }

  private getShortcutKey(
    key: string,
    ctrl?: boolean,
    shift?: boolean,
    alt?: boolean
  ): string {
    const parts: string[] = [];
    if (ctrl) parts.push("ctrl");
    if (shift) parts.push("shift");
    if (alt) parts.push("alt");
    parts.push(key.toLowerCase());
    return parts.join("+");
  }

  getAllShortcuts(): Shortcut[] {
    return Array.from(this.shortcuts.values());
  }

  getShortcutDescription(
    key: string,
    ctrl?: boolean,
    shift?: boolean,
    alt?: boolean
  ): string | null {
    const shortcutKey = this.getShortcutKey(key, ctrl, shift, alt);
    const shortcut = this.shortcuts.get(shortcutKey);
    return shortcut ? shortcut.description : null;
  }
}

// Global shortcuts manager instance
export const shortcutsManager = new ShortcutsManager();
