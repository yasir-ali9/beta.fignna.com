import { DraggableManager } from "./draggable";
import { ResizableManager } from "./resizable";
import { SelectableManager } from "./selectable";

export class InteractionsManager {
  draggable: DraggableManager;
  resizable: ResizableManager;
  selectable: SelectableManager;

  constructor() {
    this.draggable = new DraggableManager();
    this.resizable = new ResizableManager();
    this.selectable = new SelectableManager();
  }

  reset() {
    this.draggable.endDrag();
    this.resizable.endResize();
  }

  get isInteracting() {
    return this.draggable.isDragging || this.resizable.isResizing;
  }
}

export const interactionsManager = new InteractionsManager();

export * from "./draggable";
export * from "./resizable";
export * from "./selectable";
