import { CanvasNode } from "@/lib/stores/editor/layers";

export interface DragState {
  isDragging: boolean;
  nodeId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

export class DraggableManager {
  private dragState: DragState = {
    isDragging: false,
    nodeId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  };

  startDrag(nodeId: string, mouseX: number, mouseY: number, node: CanvasNode) {
    this.dragState = {
      isDragging: true,
      nodeId,
      startX: mouseX,
      startY: mouseY,
      offsetX: mouseX - node.x,
      offsetY: mouseY - node.y,
    };
  }

  updateDrag(mouseX: number, mouseY: number): { x: number; y: number } | null {
    if (!this.dragState.isDragging) return null;

    return {
      x: mouseX - this.dragState.offsetX,
      y: mouseY - this.dragState.offsetY,
    };
  }

  endDrag() {
    this.dragState = {
      isDragging: false,
      nodeId: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
    };
  }

  get isDragging() {
    return this.dragState.isDragging;
  }

  get currentNodeId() {
    return this.dragState.nodeId;
  }
}
