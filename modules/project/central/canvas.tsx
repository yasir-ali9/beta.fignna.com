"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { reaction } from "mobx";
import { canvasManager } from "@/lib/canvas/manager";
import { interactionsManager } from "@/lib/canvas/interactions";
import { shortcutsManager } from "@/lib/shortcuts";
import { ThreeDNodeRenderer } from "@/components/threed";

const ZOOM_STEP = 0.05;
const PAN_SENSITIVITY = 1;

export const Canvas = observer(() => {
  const editorEngine = useEditorEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isLayerDragging, setIsLayerDragging] = useState(false);
  const [isLayerResizing, setIsLayerResizing] = useState(false);

  // Use ref to track current cursor to avoid unnecessary re-renders
  const currentCursorRef = useRef<string>("default");

  const { scale, position } = editorEngine.canvas;
  const { isHandToolActive, isMoveToolActive } = editorEngine.state;
  const { pendingNode, selectedNodeId } = editorEngine.nodes;

  // Initialize shortcuts manager
  useEffect(() => {
    shortcutsManager.setEditorEngine(editorEngine);
  }, [editorEngine]);

  const handleCanvasMouseDown = (
    event: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>
  ) => {
    // Allow interaction on both container and canvas
    if (
      event.target !== containerRef.current &&
      event.target !== canvasRef.current
    )
      return;

    // If there's a pending layer, drop it at cursor position
    if (pendingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      // Convert canvas coordinates to world coordinates
      const worldX = (canvasX - position.x) / scale;
      const worldY = (canvasY - position.y) / scale;

      editorEngine.nodes.addNode({
        type: pendingNode.type,
        x: worldX - pendingNode.width / 2, // Center on cursor
        y: worldY - pendingNode.height / 2,
        width: pendingNode.width,
        height: pendingNode.height,
      });

      // Switch back to move tool
      editorEngine.state.setCanvasTool(
        editorEngine.state.canvasTool === editorEngine.state.canvasTool
          ? ("MOVE" as any)
          : editorEngine.state.canvasTool
      );
      return;
    }

    if (isHandToolActive) {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
      document.body.style.userSelect = "none";
      return;
    }

    // Handle layer interactions with move tool
    if (isMoveToolActive && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      // Convert to world coordinates
      const worldX = (canvasX - position.x) / scale;
      const worldY = (canvasY - position.y) / scale;

      // Check if clicking on selected layer's edge/corner (Figma-like)
      if (selectedNodeId) {
        const selectedLayer = editorEngine.nodes.getNode(selectedNodeId);
        if (selectedLayer) {
          // Check if near edge or corner for resizing
          const resizeZone = interactionsManager.resizable.detectResizeZone(
            worldX,
            worldY,
            selectedLayer
          );

          if (resizeZone) {
            // Start resizing from edge/corner
            interactionsManager.resizable.startResize(
              selectedNodeId,
              resizeZone.handle,
              worldX,
              worldY,
              selectedLayer
            );
            setIsLayerResizing(true);
            document.body.style.cursor = resizeZone.cursor;
            return;
          }

          // Check if clicking inside selected layer (start dragging)
          if (
            interactionsManager.selectable.isPointInNode(
              worldX,
              worldY,
              selectedLayer
            )
          ) {
            interactionsManager.draggable.startDrag(
              selectedNodeId,
              worldX,
              worldY,
              selectedLayer
            );
            setIsLayerDragging(true);
            document.body.style.cursor = "move";
            return;
          }
        }
      }

      // Check if clicking on any layer (select it)
      const clickedLayer = interactionsManager.selectable.findLayerAtPoint(
        worldX,
        worldY,
        editorEngine.nodes.nodes
      );

      if (clickedLayer) {
        const multiSelect = event.ctrlKey || event.metaKey;
        editorEngine.nodes.selectNode(clickedLayer.id, multiSelect);

        // Only start dragging if not multi-selecting
        if (!multiSelect) {
          interactionsManager.draggable.startDrag(
            clickedLayer.id,
            worldX,
            worldY,
            clickedLayer
          );
          setIsLayerDragging(true);
          document.body.style.cursor = "move";
        }
        return;
      }

      // Clicked on empty space - deselect (unless Ctrl is held)
      if (!event.ctrlKey && !event.metaKey) {
        editorEngine.nodes.selectNode(null);
      }
    }

    editorEngine.clearUI();
  };

  const handleCanvasHover = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        // Convert to world coordinates
        const worldX = (canvasX - position.x) / scale;
        const worldY = (canvasY - position.y) / scale;

        setCursorPosition({ x: worldX, y: worldY });

        // Detect hovered layer (for visual feedback)
        if (isMoveToolActive && !isLayerDragging && !isLayerResizing) {
          const hoveredLayer = interactionsManager.selectable.findLayerAtPoint(
            worldX,
            worldY,
            editorEngine.nodes.nodes
          );
          editorEngine.nodes.setHoveredNode(hoveredLayer?.id || null);
        } else {
          editorEngine.nodes.setHoveredNode(null);
        }

        // Don't override cursor during interactions
        if (isLayerDragging || isLayerResizing) {
          return;
        }

        // Helper to set cursor only if it changed
        const setCursor = (cursor: string) => {
          if (currentCursorRef.current !== cursor && canvasRef.current) {
            currentCursorRef.current = cursor;
            canvasRef.current.style.cursor = cursor;
          }
        };

        // Hand tool cursor (priority)
        if (isHandToolActive) {
          setCursor(isDragging ? "grabbing" : "grab");
          return;
        }

        // Pending layer cursor
        if (pendingNode) {
          setCursor("crosshair");
          return;
        }

        // Update cursor based on hover position (Figma-like)
        if (isMoveToolActive && selectedNodeId) {
          const selectedLayer = editorEngine.nodes.getNode(selectedNodeId);
          if (selectedLayer) {
            const resizeZone = interactionsManager.resizable.detectResizeZone(
              worldX,
              worldY,
              selectedLayer
            );

            if (resizeZone) {
              setCursor(resizeZone.cursor);
              return;
            } else if (
              interactionsManager.selectable.isPointInNode(
                worldX,
                worldY,
                selectedLayer
              )
            ) {
              setCursor("move");
              return;
            }
          }
        }

        // Reset to default cursor
        setCursor("default");
      }
    },
    [
      position.x,
      position.y,
      scale,
      isMoveToolActive,
      isHandToolActive,
      isDragging,
      isLayerDragging,
      isLayerResizing,
      selectedNodeId,
      pendingNode,
    ]
  );

  const handleCanvasMouseMove = useCallback(
    (event: MouseEvent) => {
      // Handle canvas panning
      if (isDragging && isHandToolActive) {
        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;

        editorEngine.canvas.setPosition({
          x: position.x + deltaX,
          y: position.y + deltaY,
        });

        setDragStart({ x: event.clientX, y: event.clientY });
        return;
      }

      // Handle layer dragging
      if (isLayerDragging && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        const worldX = (canvasX - position.x) / scale;
        const worldY = (canvasY - position.y) / scale;

        const newPos = interactionsManager.draggable.updateDrag(worldX, worldY);
        if (newPos && interactionsManager.draggable.currentNodeId) {
          // Use requestAnimationFrame to batch updates
          requestAnimationFrame(() => {
            editorEngine.nodes.updateNode(
              interactionsManager.draggable.currentNodeId!,
              newPos
            );
          });
        }
        return;
      }

      // Handle layer resizing
      if (isLayerResizing && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        const worldX = (canvasX - position.x) / scale;
        const worldY = (canvasY - position.y) / scale;

        const newBounds = interactionsManager.resizable.updateResize(
          worldX,
          worldY
        );
        if (newBounds && interactionsManager.resizable.currentNodeId) {
          // Use requestAnimationFrame to batch updates
          requestAnimationFrame(() => {
            editorEngine.nodes.updateNode(
              interactionsManager.resizable.currentNodeId!,
              newBounds
            );
          });
        }
        return;
      }
    },
    [
      isDragging,
      isHandToolActive,
      isLayerDragging,
      isLayerResizing,
      dragStart,
      position,
      scale,
      editorEngine,
    ]
  );

  const handleCanvasMouseUp = useCallback(() => {
    if (isDragging) {
      document.body.style.userSelect = "";
    }
    setIsDragging(false);

    // End layer dragging
    if (isLayerDragging) {
      interactionsManager.draggable.endDrag();
      setIsLayerDragging(false);
      document.body.style.cursor = "";
    }

    // End layer resizing
    if (isLayerResizing) {
      interactionsManager.resizable.endResize();
      setIsLayerResizing(false);
      document.body.style.cursor = "";
    }
  }, [isDragging, isLayerDragging, isLayerResizing]);

  const handleZoom = useCallback(
    (event: WheelEvent) => {
      if (!containerRef.current) return;

      event.preventDefault();

      const normalizedDelta = Math.sign(event.deltaY);
      const zoomDirection = normalizedDelta > 0 ? -1 : 1;
      const newScale = scale * (1 + ZOOM_STEP * zoomDirection);

      const clampedScale = Math.min(
        Math.max(newScale, editorEngine.canvas.MIN_ZOOM),
        editorEngine.canvas.MAX_ZOOM
      );

      if (Math.abs(clampedScale - scale) < 0.001) return;

      const rect = containerRef.current.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;

      const zoomFactor = (clampedScale - scale) / scale;
      const deltaX = (cursorX - position.x) * zoomFactor;
      const deltaY = (cursorY - position.y) * zoomFactor;

      editorEngine.canvas.setScale(clampedScale);
      editorEngine.canvas.setPosition({
        x: position.x - deltaX,
        y: position.y - deltaY,
      });
    },
    [scale, position, editorEngine.canvas]
  );

  const handlePan = useCallback(
    (event: WheelEvent) => {
      const deltaX =
        (event.deltaX + (event.shiftKey ? event.deltaY : 0)) * PAN_SENSITIVITY;
      const deltaY = (event.shiftKey ? 0 : event.deltaY) * PAN_SENSITIVITY;

      editorEngine.canvas.setPosition({
        x: position.x - deltaX,
        y: position.y - deltaY,
      });
    },
    [position, editorEngine.canvas]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isWithinCanvas =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isWithinCanvas) return;

      event.preventDefault();
      event.stopPropagation();

      editorEngine.state.setCanvasScrolling(true);

      if (event.ctrlKey || event.metaKey) {
        handleZoom(event);
      } else {
        handlePan(event);
      }

      setTimeout(() => {
        editorEngine.state.setCanvasScrolling(false);
      }, 100);
    },
    [handleZoom, handlePan, editorEngine.state]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Handle space key for temporary hand tool
      if (event.code === "Space" && !event.repeat) {
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName.toLowerCase() === "input" ||
            activeElement.tagName.toLowerCase() === "textarea" ||
            activeElement.getAttribute("contenteditable") === "true");

        if (!isInputFocused) {
          event.preventDefault();
          editorEngine.state.setSpacePressed(true);
          return;
        }
      }

      // Handle other shortcuts
      shortcutsManager.handleKeyDown(event);
    },
    [editorEngine.state]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName.toLowerCase() === "input" ||
            activeElement.tagName.toLowerCase() === "textarea" ||
            activeElement.getAttribute("contenteditable") === "true");

        if (!isInputFocused) {
          event.preventDefault();
          editorEngine.state.setSpacePressed(false);
          if (isDragging) {
            document.body.style.userSelect = "";
          }
          setIsDragging(false);
        }
      }
    },
    [editorEngine.state, isDragging]
  );

  const getCursor = () => {
    if (isDragging) return "grabbing";
    if (isHandToolActive) return "grab";
    return "default";
  };

  // Initialize canvas manager
  useEffect(() => {
    if (canvasRef.current) {
      canvasManager.initialize(canvasRef.current);
    }

    return () => {
      canvasManager.destroy();
    };
  }, []);

  // Canvas resize handling - simplified and professional
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout | null = null;
    let lastSize = { width: 0, height: 0 };

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.round(rect.width);
      const newHeight = Math.round(rect.height);

      // Skip if size hasn't actually changed
      if (newWidth === lastSize.width && newHeight === lastSize.height) return;

      lastSize = { width: newWidth, height: newHeight };

      // Update canvas size immediately to prevent flicker
      canvasRef.current.style.width = newWidth + "px";
      canvasRef.current.style.height = newHeight + "px";

      // Update canvas state and re-render
      editorEngine.canvas.initializeCanvas(newWidth, newHeight);
      canvasManager.resize();

      console.log(`Canvas resized: ${newWidth}×${newHeight}`);
    };

    const debouncedResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 50);
    };

    // Initial setup
    handleResize();

    // Use ResizeObserver - the modern, efficient way
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(debouncedResize);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [editorEngine.canvas]);

  // Render canvas content when state changes - using MobX reaction for instant updates
  useEffect(() => {
    const renderCanvas = () => {
      const currentFile = editorEngine.files.currentFile;
      const svgContent =
        currentFile?.type === "svg" ? currentFile.content : undefined;

      canvasManager.render(
        position.x,
        position.y,
        scale,
        svgContent,
        editorEngine.nodes.nodes,
        pendingNode ? { ...pendingNode, ...cursorPosition } : null,
        editorEngine.nodes.selectedNodeIds,
        editorEngine.nodes.hoveredNodeId
      );
    };

    // Initial render
    renderCanvas();

    // Set up MobX reaction for instant updates when nodes change
    const dispose = reaction(
      () => ({
        nodes: editorEngine.nodes.nodes.map((n) => ({ ...n })), // Track node changes
        selectedIds: editorEngine.nodes.selectedNodeIds.slice(),
        hoveredId: editorEngine.nodes.hoveredNodeId,
      }),
      () => {
        renderCanvas();
      },
      { fireImmediately: false }
    );

    return () => dispose();
  }, [
    position.x,
    position.y,
    scale,
    editorEngine.files.currentFile,
    pendingNode,
    cursorPosition,
    editorEngine,
  ]);

  useEffect(() => {
    const div = containerRef.current;
    if (div) {
      div.addEventListener("wheel", handleWheel, { passive: false });
      document.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        div.removeEventListener("wheel", handleWheel);
        document.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleCanvasMouseMove);
    document.addEventListener("mouseup", handleCanvasMouseUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleCanvasMouseMove);
      document.removeEventListener("mouseup", handleCanvasMouseUp);
    };
  }, [handleKeyDown, handleKeyUp, handleCanvasMouseMove, handleCanvasMouseUp]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden bg-bk-60 relative w-full h-full"
    >
      {/* HTML5 Canvas for rendering */}
      <canvas
        ref={canvasRef}
        id="main-canvas"
        className="absolute inset-0 w-full h-full"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasHover}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          contain: "content",
          cursor: pendingNode ? "crosshair" : getCursor(),
        }}
      />

      {/* 3D Nodes Overlay - rendered as React components */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {editorEngine.nodes.nodes
          .filter((node) => node.type === "3d")
          .map((node) => (
            <div
              key={node.id}
              className="pointer-events-auto"
              style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
              }}
            >
              <ThreeDNodeRenderer node={node} />
            </div>
          ))}
      </div>
    </div>
  );
});
