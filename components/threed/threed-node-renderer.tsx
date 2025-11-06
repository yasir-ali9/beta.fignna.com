"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { ThreeDScene } from "./threed-scene";
import { RotateIcon } from "@/components/icons/canvas";
import type { CanvasNode } from "@/lib/stores/editor/nodes";

interface ThreeDNodeRendererProps {
  node: CanvasNode;
}

export const ThreeDNodeRenderer = observer(
  ({ node }: ThreeDNodeRendererProps) => {
    const editorEngine = useEditorEngine();
    const modelState = editorEngine.threed.getModelState(node.id);
    const modelRef = useRef<THREE.Group | null>(null);
    const canvasScale = editorEngine.canvas.scale;

    // Store model ref in a way that Export section can access it
    useEffect(() => {
      if (modelRef.current) {
        // Store ref globally for export (temporary solution)
        (window as any).__current3DModel = modelRef.current;
      }
    }, [modelRef.current]);

    const [isRotating, setIsRotating] = useState(false);
    const [rotationStart, setRotationStart] = useState({
      x: 0,
      y: 0,
      rotation: 0,
    });

    const handleRotateStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsRotating(true);
      setRotationStart({
        x: e.clientX,
        y: e.clientY,
        rotation: modelState.modelRotationY,
      });
    };

    useEffect(() => {
      if (!isRotating) return;

      const handleRotateMove = (e: MouseEvent) => {
        const deltaX = e.clientX - rotationStart.x;
        const newRotation = rotationStart.rotation + (deltaX * Math.PI) / 180;

        // Update rotation only - don't change frame size
        editorEngine.threed.updateModelState(node.id, {
          modelRotationY: newRotation,
        });
      };

      const handleRotateEnd = () => {
        setIsRotating(false);
      };

      document.addEventListener("mousemove", handleRotateMove);
      document.addEventListener("mouseup", handleRotateEnd);

      return () => {
        document.removeEventListener("mousemove", handleRotateMove);
        document.removeEventListener("mouseup", handleRotateEnd);
      };
    }, [isRotating, rotationStart, node.id, editorEngine]);

    const isSelected = editorEngine.nodes.selectedNodeIds.includes(node.id);

    return (
      <div
        className="w-full h-full relative"
        style={{
          transform: `rotate(${node.rotation || 0}deg)`,
          opacity: node.opacity || 1,
        }}
      >
        {modelState.svgData ? (
          <>
            <ThreeDScene
              svgData={modelState.svgData}
              depth={modelState.depth}
              modelRotationY={modelState.modelRotationY}
              bevelEnabled={modelState.bevelEnabled}
              bevelThickness={modelState.bevelThickness}
              bevelSize={modelState.bevelSize}
              bevelSegments={modelState.bevelSegments}
              useCustomColor={modelState.useCustomColor}
              customColor={modelState.customColor}
              roughness={modelState.roughness}
              metalness={modelState.metalness}
              clearcoat={modelState.clearcoat}
              transmission={modelState.transmission}
              envMapIntensity={modelState.envMapIntensity}
              backgroundColor="transparent"
              autoRotate={modelState.autoRotate}
              autoRotateSpeed={modelState.autoRotateSpeed}
              useBloom={modelState.useBloom}
              bloomIntensity={modelState.bloomIntensity}
              bloomMipmapBlur={modelState.bloomMipmapBlur}
              modelRef={modelRef}
              nodeWidth={node.width}
              nodeHeight={node.height}
            />
            {/* Rotation Handle - Only visible when selected */}
            {isSelected && (
              <div
                className="rotation-handle absolute bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                onMouseDown={handleRotateStart}
                style={{
                  pointerEvents: "auto",
                  zIndex: 1000,
                  // Counter-scale to maintain fixed size
                  transform: `scale(${1 / canvasScale})`,
                  transformOrigin: "center",
                  // Position adjusted for scale
                  top: `${8 * canvasScale}px`,
                  right: `${8 * canvasScale}px`,
                  width: "32px",
                  height: "32px",
                }}
              >
                <RotateIcon size={20} className="text-gray-700" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bk-50 border border-bd-50 rounded">
            <div className="text-fg-60 text-[11px] text-center">
              {modelState.isModelLoading
                ? "Loading..."
                : "Select SVG in Geometry panel"}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ThreeDNodeRenderer.displayName = "ThreeDNodeRenderer";
