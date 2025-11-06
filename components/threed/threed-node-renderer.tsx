"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { observer } from "mobx-react-lite";
import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { ModelPreview } from "./model-preview";
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

    return (
      <div
        className="w-full h-full bg-bk-50 border border-bd-50 rounded overflow-hidden"
        style={{
          transform: `rotate(${node.rotation || 0}deg)`,
          opacity: node.opacity || 1,
        }}
      >
        {modelState.svgData ? (
          <ModelPreview
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
            backgroundColor={modelState.backgroundColor}
            autoRotate={modelState.autoRotate}
            autoRotateSpeed={modelState.autoRotateSpeed}
            useBloom={modelState.useBloom}
            bloomIntensity={modelState.bloomIntensity}
            bloomMipmapBlur={modelState.bloomMipmapBlur}
            modelRef={modelRef}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
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
