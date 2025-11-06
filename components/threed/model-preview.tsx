"use client";

import { useRef, useEffect, Suspense, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SVGModel } from "./svg-model";
import { observer } from "mobx-react-lite";

interface ModelPreviewProps {
  svgData: string;
  depth: number;
  modelRotationY: number;
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  useCustomColor: boolean;
  customColor: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  transmission: number;
  envMapIntensity: number;
  backgroundColor: string;
  autoRotate: boolean;
  autoRotateSpeed: number;
  useBloom?: boolean;
  bloomIntensity?: number;
  bloomMipmapBlur?: boolean;
  modelRef?: React.RefObject<THREE.Group | null>;
}

export const ModelPreview = observer(
  ({
    svgData,
    depth,
    modelRotationY,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelSegments,
    useCustomColor,
    customColor,
    roughness,
    metalness,
    clearcoat,
    transmission,
    envMapIntensity,
    backgroundColor,
    autoRotate,
    autoRotateSpeed,
    useBloom = false,
    bloomIntensity = 1.0,
    bloomMipmapBlur = true,
    modelRef: externalModelRef,
  }: ModelPreviewProps) => {
    const modelGroupRef = useRef<THREE.Group | null>(null);
    const internalModelRef = useRef<THREE.Group | null>(null);
    const modelRef = externalModelRef || internalModelRef;

    if (!svgData) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-bk-50">
          <div className="text-fg-60 text-[11px] text-center">
            Upload an SVG to preview
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        <Canvas
          shadows
          camera={{ position: [0, 0, 150], fov: 50 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
        >
          <color attach="background" args={[backgroundColor]} />
          <ambientLight intensity={0.6 * Math.PI} />
          <directionalLight
            position={[50, 50, 100]}
            intensity={0.8 * Math.PI}
            castShadow={false}
          />

          <group ref={modelGroupRef} rotation={[0, modelRotationY, 0]}>
            <Suspense fallback={null}>
              <SVGModel
                svgData={svgData}
                depth={depth * 5}
                bevelEnabled={bevelEnabled}
                bevelThickness={bevelThickness}
                bevelSize={bevelSize}
                bevelSegments={bevelSegments}
                customColor={useCustomColor ? customColor : undefined}
                roughness={roughness}
                metalness={metalness}
                clearcoat={clearcoat}
                transmission={transmission}
                envMapIntensity={envMapIntensity}
                receiveShadow={false}
                castShadow={false}
                ref={modelRef}
              />
            </Suspense>
          </group>

          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            minDistance={50}
            maxDistance={400}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, 0, 0]}
          />

          {/* Bloom Post-Processing Effects */}
          {useBloom && (
            <EffectComposer>
              <Bloom
                intensity={bloomIntensity * 0.7}
                luminanceThreshold={0.4}
                luminanceSmoothing={0.95}
                mipmapBlur={bloomMipmapBlur}
                radius={0.9}
              />
            </EffectComposer>
          )}
        </Canvas>
      </div>
    );
  }
);

ModelPreview.displayName = "ModelPreview";
