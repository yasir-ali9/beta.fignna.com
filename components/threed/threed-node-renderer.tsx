"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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
      return () => {
        // Clean up on unmount
        if ((window as any).__current3DModel === modelRef.current) {
          delete (window as any).__current3DModel;
        }
      };
    }, [modelRef.current]);

    const [isRotating, setIsRotating] = useState(false);
    const [rotationStart, setRotationStart] = useState({
      x: 0,
      y: 0,
      rotation: 0,
    });

    // Use useCallback to prevent recreation on every render
    const handleRotateStart = useCallback(
      (e: { clientX: number }) => {
        setIsRotating(true);
        setRotationStart({
          x: e.clientX,
          y: 0,
          rotation: modelState.modelRotationY,
        });
      },
      [modelState.modelRotationY]
    );

    // Store rotation handler globally so canvas can access it
    useEffect(() => {
      (window as any)[`__rotateHandler_${node.id}`] = handleRotateStart;
      return () => {
        delete (window as any)[`__rotateHandler_${node.id}`];
      };
    }, [node.id, handleRotateStart]);

    useEffect(() => {
      if (!isRotating) return;

      let rafId: number | null = null;
      let lastRotation = rotationStart.rotation;

      const handleRotateMove = (e: MouseEvent) => {
        const deltaX = e.clientX - rotationStart.x;
        const newRotation = rotationStart.rotation + (deltaX * Math.PI) / 180;
        lastRotation = newRotation;

        // Cancel previous frame if it hasn't executed yet
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        // Use requestAnimationFrame for smooth 60fps updates
        rafId = requestAnimationFrame(() => {
          // Use optimized rotation update method
          editorEngine.threed.updateRotation(node.id, lastRotation);
          rafId = null;
        });
      };

      const handleRotateEnd = () => {
        // Cancel any pending animation frame
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        // Apply final rotation value
        editorEngine.threed.updateRotation(node.id, lastRotation);
        setIsRotating(false);
      };

      // Use capture phase to ensure we catch the events
      document.addEventListener("mousemove", handleRotateMove, true);
      document.addEventListener("mouseup", handleRotateEnd, true);

      return () => {
        // Clean up listeners and cancel any pending animation frame
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        document.removeEventListener("mousemove", handleRotateMove, true);
        document.removeEventListener("mouseup", handleRotateEnd, true);
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
          useEnvironment={modelState.useEnvironment}
          environmentPreset={modelState.environmentPreset}
          customHdriUrl={modelState.customHdriUrl || undefined}
        />
      </>
    );
  }
);

ThreeDNodeRenderer.displayName = "ThreeDNodeRenderer";
