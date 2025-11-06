export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private devicePixelRatio: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context from canvas");
    }
    this.ctx = ctx;
    this.devicePixelRatio = window.devicePixelRatio || 1;

    this.setupCanvas();
  }

  private setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();

    // Only resize if dimensions actually changed
    const newWidth = rect.width * this.devicePixelRatio;
    const newHeight = rect.height * this.devicePixelRatio;

    if (this.canvas.width !== newWidth || this.canvas.height !== newHeight) {
      // Set actual size in memory (scaled for high DPI)
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;

      // Reset and scale the drawing context
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
    }

    // Ensure CSS size matches
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";
  }

  resize() {
    this.setupCanvas();
  }

  clear() {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
  }

  drawViewport(
    x: number,
    y: number,
    scale: number,
    content?: string,
    nodes?: any[],
    pendingNode?: any,
    selectedNodeIds?: string[],
    hoveredNodeId?: string | null
  ) {
    this.clear();

    // Save context state
    this.ctx.save();

    // Apply transform
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);

    // Draw nodes/layers
    if (nodes && nodes.length > 0) {
      nodes.forEach((node) => {
        const isSelected = selectedNodeIds?.includes(node.id) || false;
        const isHovered = hoveredNodeId === node.id && !isSelected;
        this.drawNode(node, false, isSelected);

        // Draw selection box for selected nodes/layers
        if (isSelected) {
          this.drawSelectionBox(node, false, scale);
          // Only show resize handles for single selection
          if (selectedNodeIds?.length === 1) {
            this.drawResizeHandles(node, scale);
          }
        }
        // Draw hover box for hovered node/layer (no handles)
        else if (isHovered) {
          this.drawSelectionBox(node, true, scale);
        }
      });
    }

    // Draw pending node/layer following cursor
    if (pendingNode) {
      this.drawNode(
        {
          type: pendingNode.type,
          x: pendingNode.x - pendingNode.width / 2,
          y: pendingNode.y - pendingNode.height / 2,
          width: pendingNode.width,
          height: pendingNode.height,
        },
        true
      );
    }

    // Restore context state
    this.ctx.restore();
  }

  drawNode(node: any, isPending = false, isSelected = false) {
    this.ctx.save();

    // Set opacity for pending layers
    if (isPending) {
      this.ctx.globalAlpha = 0.5;
    }

    // Draw node based on type
    if (node.type === "3d") {
      // Don't draw anything for 3D nodes - they render as React components
      // Only draw a subtle outline if pending
      if (isPending) {
        this.ctx.strokeStyle = "#7a7aff";
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(node.x, node.y, node.width, node.height);
      }
      // No background, no placeholder - pure 3D object only
    } else if (node.type === "frame") {
      // Draw frame
      this.ctx.strokeStyle = isPending ? "#7a7aff" : "#6a6a6a";
      this.ctx.lineWidth = isPending ? 2 : 1;
      this.ctx.setLineDash(isPending ? [5, 5] : []);
      this.ctx.strokeRect(node.x, node.y, node.width, node.height);

      // Draw label
      this.ctx.fillStyle = "#888888";
      this.ctx.font = "12px system-ui, -apple-system, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(
        "Frame",
        node.x + node.width / 2,
        node.y + node.height / 2
      );
    } else if (node.type === "image") {
      // Draw image placeholder
      this.ctx.fillStyle = "#4a4a4a";
      this.ctx.strokeStyle = isPending ? "#7a7aff" : "#6a6a6a";
      this.ctx.lineWidth = isPending ? 2 : 1;
      this.ctx.setLineDash(isPending ? [5, 5] : []);

      this.ctx.fillRect(node.x, node.y, node.width, node.height);
      this.ctx.strokeRect(node.x, node.y, node.width, node.height);

      // Draw image icon
      this.ctx.fillStyle = "#888888";
      this.ctx.font = "14px system-ui, -apple-system, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(
        "Image",
        node.x + node.width / 2,
        node.y + node.height / 2
      );
    } else if (node.type === "comment") {
      // Draw comment bubble
      this.ctx.fillStyle = "#5a5a2a";
      this.ctx.strokeStyle = isPending ? "#7a7aff" : "#8a8a4a";
      this.ctx.lineWidth = isPending ? 2 : 1;
      this.ctx.setLineDash(isPending ? [5, 5] : []);

      this.ctx.beginPath();
      this.ctx.arc(
        node.x + node.width / 2,
        node.y + node.height / 2,
        node.width / 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.stroke();

      // Draw comment icon
      this.ctx.fillStyle = "#cccc88";
      this.ctx.font = "12px system-ui, -apple-system, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(
        "💬",
        node.x + node.width / 2,
        node.y + node.height / 2
      );
    }

    this.ctx.restore();
  }

  drawSelectionBox(node: any, isHover = false, scale = 1) {
    this.ctx.save();
    this.ctx.strokeStyle = "#4a9eff";
    // Fixed 1px line width regardless of zoom
    this.ctx.lineWidth = 1 / scale;
    this.ctx.setLineDash([]);

    // Slightly transparent for hover
    if (isHover) {
      this.ctx.globalAlpha = 0.6;
    }

    if (node.type === "comment") {
      // Draw circle selection for comments
      this.ctx.beginPath();
      this.ctx.arc(
        node.x + node.width / 2,
        node.y + node.height / 2,
        node.width / 2,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    } else {
      // Draw rectangle selection
      this.ctx.strokeRect(node.x, node.y, node.width, node.height);
    }

    this.ctx.restore();
  }

  drawResizeHandles(node: any, scale = 1) {
    this.ctx.save();

    // Fixed 8px handle size regardless of zoom
    const handleSize = 8 / scale;
    const halfHandle = handleSize / 2;

    // Only corner handles (Figma-like)
    const handles = [
      { x: node.x - halfHandle, y: node.y - halfHandle }, // nw
      { x: node.x + node.width - halfHandle, y: node.y - halfHandle }, // ne
      {
        x: node.x + node.width - halfHandle,
        y: node.y + node.height - halfHandle,
      }, // se
      { x: node.x - halfHandle, y: node.y + node.height - halfHandle }, // sw
    ];

    // Draw corner handles only
    handles.forEach((handle) => {
      this.ctx.fillStyle = "#ffffff";
      this.ctx.strokeStyle = "#4a9eff";
      // Fixed 1.5px border regardless of zoom
      this.ctx.lineWidth = 1.5 / scale;
      this.ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
      this.ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });

    this.ctx.restore();
  }

  private drawPlaceholder() {
    this.ctx.fillStyle = "#888888"; // text-fg-30 equivalent
    this.ctx.font = "14px system-ui, -apple-system, sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText("Import any SVG to get started", 192, 192);
  }

  private drawSVGContent(svgContent: string) {
    try {
      // Create an image from SVG content
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          // Calculate scaling to fit within viewport
          const maxSize = 320; // Leave some padding
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          const width = img.width * scale;
          const height = img.height * scale;

          // Center the image
          const x = (384 - width) / 2;
          const y = (384 - height) / 2;

          this.ctx.drawImage(img, x, y, width, height);
        } catch (error) {
          console.warn("Failed to draw SVG content:", error);
          this.drawPlaceholder();
        } finally {
          URL.revokeObjectURL(url);
        }
      };

      img.onerror = () => {
        console.warn("Failed to load SVG as image");
        this.drawPlaceholder();
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.warn("Failed to create SVG blob:", error);
      this.drawPlaceholder();
    }
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  // Debug method to check canvas dimensions
  getDebugInfo() {
    const rect = this.canvas.getBoundingClientRect();
    return {
      canvasSize: `${this.canvas.width}x${this.canvas.height}`,
      displaySize: `${rect.width}x${rect.height}`,
      devicePixelRatio: this.devicePixelRatio,
    };
  }
}
