import { makeAutoObservable } from "mobx";

export interface CanvasNode {
  id: string;
  type: "frame" | "3d" | "image" | "comment";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number; // 0 to 1
  data?: any;
  // 3D-specific data (when type is "3d")
  svgData?: string; // SVG content for 3D conversion
  fileName?: string; // Original file name
}

export class NodesManager {
  nodes: CanvasNode[] = [];
  selectedNodeIds: string[] = []; // Support multiple selections
  hoveredNodeId: string | null = null; // Track hovered node/layer
  pendingNode: {
    type: CanvasNode["type"];
    width: number;
    height: number;
  } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setHoveredNode(id: string | null) {
    this.hoveredNodeId = id;
  }

  // Backward compatibility
  get selectedNodeId(): string | null {
    return this.selectedNodeIds.length > 0 ? this.selectedNodeIds[0] : null;
  }

  set selectedNodeId(id: string | null) {
    this.selectedNodeIds = id ? [id] : [];
  }

  // Set pending node/layer that follows cursor
  setPendingNode(type: CanvasNode["type"] | null, width = 200, height = 200) {
    if (type) {
      this.pendingNode = { type, width, height };
    } else {
      this.pendingNode = null;
    }
  }

  // Add node/layer at specific position (when user clicks)
  addNode(node: Omit<CanvasNode, "id">) {
    const newNode: CanvasNode = {
      rotation: 180, // Default rotation
      ...node,
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.nodes.push(newNode);
    this.selectedNodeId = newNode.id;
    this.pendingNode = null; // Clear pending after adding
    return newNode;
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter((el) => el.id !== id);
    this.selectedNodeIds = this.selectedNodeIds.filter((sid) => sid !== id);
  }

  removeSelectedNodes() {
    this.nodes = this.nodes.filter(
      (node) => !this.selectedNodeIds.includes(node.id)
    );
    this.selectedNodeIds = [];
  }

  updateNode(id: string, updates: Partial<CanvasNode>) {
    const node = this.nodes.find((el) => el.id === id);
    if (node) {
      Object.assign(node, updates);
    }
  }

  selectNode(id: string | null, multiSelect = false) {
    if (!id) {
      this.selectedNodeIds = [];
      return;
    }

    if (multiSelect) {
      // Toggle selection
      if (this.selectedNodeIds.includes(id)) {
        this.selectedNodeIds = this.selectedNodeIds.filter((sid) => sid !== id);
      } else {
        this.selectedNodeIds.push(id);
      }
    } else {
      this.selectedNodeIds = [id];
    }
  }

  selectAllNodes() {
    this.selectedNodeIds = this.nodes.map((node) => node.id);
  }

  isNodeSelected(id: string): boolean {
    return this.selectedNodeIds.includes(id);
  }

  getNode(id: string): CanvasNode | undefined {
    return this.nodes.find((el) => el.id === id);
  }

  get selectedNodes(): CanvasNode[] {
    return this.nodes.filter((node) => this.selectedNodeIds.includes(node.id));
  }

  get selectedNode(): CanvasNode | null {
    if (this.selectedNodeIds.length === 0) return null;
    return this.getNode(this.selectedNodeIds[0]) || null;
  }

  duplicateSelectedNodes() {
    const newNodes: CanvasNode[] = [];

    this.selectedNodes.forEach((node) => {
      const newNode: CanvasNode = {
        ...node,
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: node.x + 20, // Offset slightly
        y: node.y + 20,
      };
      newNodes.push(newNode);
    });

    this.nodes.push(...newNodes);
    this.selectedNodeIds = newNodes.map((node) => node.id);

    return newNodes;
  }

  clearNodes() {
    this.nodes = [];
    this.selectedNodeIds = [];
    this.pendingNode = null;
  }
}
