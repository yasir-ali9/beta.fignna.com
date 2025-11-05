import { CanvasNode } from "@/lib/stores/editor/layers";

export class SelectableManager {
  isPointInNode(x: number, y: number, node: CanvasNode): boolean {
    if (node.type === "comment") {
      // For circular comments, check distance from center
      const centerX = node.x + node.width / 2;
      const centerY = node.y + node.height / 2;
      const radius = node.width / 2;
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      return distance <= radius;
    } else {
      // For rectangular layers
      return (
        x >= node.x &&
        x <= node.x + node.width &&
        y >= node.y &&
        y <= node.y + node.height
      );
    }
  }

  findLayerAtPoint(
    x: number,
    y: number,
    layers: CanvasNode[]
  ): CanvasNode | null {
    // Check from top to bottom (reverse order)
    for (let i = layers.length - 1; i >= 0; i--) {
      if (this.isPointInNode(x, y, layers[i])) {
        return layers[i];
      }
    }
    return null;
  }
}
