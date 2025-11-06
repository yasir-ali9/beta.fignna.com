"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { ThreeDScene } from "./threed-scene";
import type { CanvasNode } from "@/lib/stores/editor/nodes";

interface ThreeDNodeRendererProps {
  node: CanvasNode;
}

export const ThreeDNodeRenderer = observer(
  ({ node }: ThreeDNodeRendererProps) => {
    const editorEngine = useEditorEngine();
    const modelState = editorEngine.threed.getModelState(node.id);
    const modelRef = useRef<THREE.Group | null>(null);

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

    const handleRotateStart = (e: { clientX: number }) => {
      setIsRotating(true);
      setRotationStart({
        x: e.clientX,
        y: 0,
        rotation: modelState.modelRotationY,
      });
    };

    // Store rotation handler globally so canvas can access it
    useEffect(() => {
      (window as any)[`__rotateHandler_${node.id}`] = handleRotateStart;
      return () => {
        delete (window as any)[`__rotateHandler_${node.id}`];
      };
    }, [node.id, modelState.modelRotationY]);

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

    if (!modelState.svgData) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-bk-50 border border-bd-50 rounded">
          <div className="text-fg-60 text-[11px] text-center">
            {modelState.isModelLoading
              ? "Loading..."
              : "Select SVG in Geometry panel"}
          </div>
        </div>
      );
    }

    return (
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
      </>
    );
  }
);

ThreeDNodeRenderer.displayName = "ThreeDNodeRenderer";
