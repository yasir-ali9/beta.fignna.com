import { CanvasRenderer } from "./renderer";

export class CanvasManager {
  private renderer: CanvasRenderer | null = null;
  private animationFrameId: number | null = null;
  private needsRedraw = false;
  private lastRenderParams: {
    x: number;
    y: number;
    scale: number;
    svgContent?: string;
  } | null = null;

  initialize(canvas: HTMLCanvasElement) {
    this.renderer = new CanvasRenderer(canvas);
    this.startRenderLoop();
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.renderer = null;
    this.lastRenderParams = null;
  }

  requestRedraw() {
    this.needsRedraw = true;
  }

  resize() {
    if (this.renderer) {
      this.renderer.resize();
      // Re-render with last parameters after resize
      if (this.lastRenderParams) {
        requestAnimationFrame(() => {
          this.render(
            this.lastRenderParams!.x,
            this.lastRenderParams!.y,
            this.lastRenderParams!.scale,
            this.lastRenderParams!.svgContent
          );
        });
      }
    }
  }

  forceResize() {
    console.log("Manual resize triggered");
    this.resize();
  }

  render(
    x: number,
    y: number,
    scale: number,
    svgContent?: string,
    nodes?: any[],
    pendingNode?: any,
    selectedNodeIds?: string[],
    hoveredNodeId?: string | null
  ) {
    if (this.renderer) {
      this.lastRenderParams = { x, y, scale, svgContent };
      this.renderer.drawViewport(
        x,
        y,
        scale,
        svgContent,
        nodes,
        pendingNode,
        selectedNodeIds,
        hoveredNodeId
      );
    }
  }

  private startRenderLoop() {
    const loop = () => {
      if (this.needsRedraw && this.renderer) {
        this.needsRedraw = false;
        // Rendering will be triggered by React effects
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  getRenderer(): CanvasRenderer | null {
    return this.renderer;
  }
}

// Global canvas manager instance
export const canvasManager = new CanvasManager();

// Global resize function for debugging
(window as any).forceCanvasResize = () => {
  console.log("Manual canvas resize triggered");
  canvasManager.forceResize();
};
