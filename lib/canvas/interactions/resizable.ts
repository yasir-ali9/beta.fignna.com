import { CanvasNode } from "@/lib/stores/editor/layers";

export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export interface ResizeState {
  isResizing: boolean;
  nodeId: string | null;
  handle: ResizeHandle | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLayerX: number;
  startLayerY: number;
}

export class ResizableManager {
  private resizeState: ResizeState = {
    isResizing: false,
    nodeId: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLayerX: 0,
    startLayerY: 0,
  };

  private readonly HANDLE_SIZE = 8;
  private readonly MIN_SIZE = 20;

  startResize(
    nodeId: string,
    handle: ResizeHandle,
    mouseX: number,
    mouseY: number,
    node: CanvasNode
  ) {
    this.resizeState = {
      isResizing: true,
      nodeId,
      handle,
      startX: mouseX,
      startY: mouseY,
      startWidth: node.width,
      startHeight: node.height,
      startLayerX: node.x,
      startLayerY: node.y,
    };
  }

  updateResize(
    mouseX: number,
    mouseY: number
  ): { x: number; y: number; width: number; height: number } | null {
    if (!this.resizeState.isResizing || !this.resizeState.handle) return null;

    const deltaX = mouseX - this.resizeState.startX;
    const deltaY = mouseY - this.resizeState.startY;

    let newX = this.resizeState.startLayerX;
    let newY = this.resizeState.startLayerY;
    let newWidth = this.resizeState.startWidth;
    let newHeight = this.resizeState.startHeight;

    const handle = this.resizeState.handle;

    // Handle horizontal resizing
    if (handle.includes("e")) {
      newWidth = Math.max(this.MIN_SIZE, this.resizeState.startWidth + deltaX);
    } else if (handle.includes("w")) {
      const proposedWidth = this.resizeState.startWidth - deltaX;
      if (proposedWidth >= this.MIN_SIZE) {
        newWidth = proposedWidth;
        newX = this.resizeState.startLayerX + deltaX;
      }
    }

    // Handle vertical resizing
    if (handle.includes("s")) {
      newHeight = Math.max(
        this.MIN_SIZE,
        this.resizeState.startHeight + deltaY
      );
    } else if (handle.includes("n")) {
      const proposedHeight = this.resizeState.startHeight - deltaY;
      if (proposedHeight >= this.MIN_SIZE) {
        newHeight = proposedHeight;
        newY = this.resizeState.startLayerY + deltaY;
      }
    }

    return { x: newX, y: newY, width: newWidth, height: newHeight };
  }

  endResize() {
    this.resizeState = {
      isResizing: false,
      nodeId: null,
      handle: null,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startLayerX: 0,
      startLayerY: 0,
    };
  }

  getResizeHandles(node: CanvasNode): Array<{
    handle: ResizeHandle;
    x: number;
    y: number;
    cursor: string;
  }> {
    const halfHandle = this.HANDLE_SIZE / 2;

    // Only corner handles (Figma-like)
    return [
      {
        handle: "nw",
        x: node.x - halfHandle,
        y: node.y - halfHandle,
        cursor: "nwse-resize",
      },
      {
        handle: "ne",
        x: node.x + node.width - halfHandle,
        y: node.y - halfHandle,
        cursor: "nesw-resize",
      },
      {
        handle: "se",
        x: node.x + node.width - halfHandle,
        y: node.y + node.height - halfHandle,
        cursor: "nwse-resize",
      },
      {
        handle: "sw",
        x: node.x - halfHandle,
        y: node.y + node.height - halfHandle,
        cursor: "nesw-resize",
      },
    ];
  }

  // Detect which edge/corner user is hovering (Figma-like edge detection)
  detectResizeZone(
    x: number,
    y: number,
    node: CanvasNode
  ): { handle: ResizeHandle; cursor: string } | null {
    const edgeThreshold = 8; // Distance from edge to detect resize

    const isNearLeft =
      x >= node.x - edgeThreshold && x <= node.x + edgeThreshold;
    const isNearRight =
      x >= node.x + node.width - edgeThreshold &&
      x <= node.x + node.width + edgeThreshold;
    const isNearTop =
      y >= node.y - edgeThreshold && y <= node.y + edgeThreshold;
    const isNearBottom =
      y >= node.y + node.height - edgeThreshold &&
      y <= node.y + node.height + edgeThreshold;

    const isInHorizontalBounds = x >= node.x && x <= node.x + node.width;
    const isInVerticalBounds = y >= node.y && y <= node.y + node.height;

    // Check corners first (priority)
    if (isNearTop && isNearLeft) {
      return { handle: "nw", cursor: "nwse-resize" };
    }
    if (isNearTop && isNearRight) {
      return { handle: "ne", cursor: "nesw-resize" };
    }
    if (isNearBottom && isNearRight) {
      return { handle: "se", cursor: "nwse-resize" };
    }
    if (isNearBottom && isNearLeft) {
      return { handle: "sw", cursor: "nesw-resize" };
    }

    // Check edges
    if (isNearTop && isInHorizontalBounds) {
      return { handle: "n", cursor: "ns-resize" };
    }
    if (isNearBottom && isInHorizontalBounds) {
      return { handle: "s", cursor: "ns-resize" };
    }
    if (isNearLeft && isInVerticalBounds) {
      return { handle: "w", cursor: "ew-resize" };
    }
    if (isNearRight && isInVerticalBounds) {
      return { handle: "e", cursor: "ew-resize" };
    }

    return null;
  }

  isPointInHandle(
    x: number,
    y: number,
    handleX: number,
    handleY: number
  ): boolean {
    return (
      x >= handleX &&
      x <= handleX + this.HANDLE_SIZE &&
      y >= handleY &&
      y <= handleY + this.HANDLE_SIZE
    );
  }

  get isResizing() {
    return this.resizeState.isResizing;
  }

  get currentNodeId() {
    return this.resizeState.nodeId;
  }

  get handleSize() {
    return this.HANDLE_SIZE;
  }
}
