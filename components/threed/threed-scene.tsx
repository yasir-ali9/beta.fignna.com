"use client";

import { useRef, useEffect, Suspense, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SVGModel } from "./svg-model";
import { SimpleEnvironment } from "./environment-presets";
import { observer } from "mobx-react-lite";

interface ThreeDSceneProps {
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
  nodeWidth: number;
  nodeHeight: number;
  useEnvironment?: boolean;
  environmentPreset?: string;
  customHdriUrl?: string;
}

export const ThreeDScene = observer(
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
    nodeWidth,
    nodeHeight,
    useEnvironment = false,
    environmentPreset = "sunset",
    customHdriUrl,
  }: ThreeDSceneProps) => {
    const modelGroupRef = useRef<THREE.Group | null>(null);
    const internalModelRef = useRef<THREE.Group | null>(null);
    const modelRef = externalModelRef || internalModelRef;
    const cameraRef = useRef<THREE.Camera | null>(null);

    // Memoize environment to avoid unnecessary re-renders
    const environment = useMemo(() => {
      if (!useEnvironment) return null;

      return (
        <Suspense fallback={null}>
          <SimpleEnvironment
            environmentPreset={environmentPreset}
            customHdriUrl={customHdriUrl}
          />
        </Suspense>
      );
    }, [useEnvironment, environmentPreset, customHdriUrl]);

    if (!svgData) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-bk-50">
          <div className="text-fg-60 text-[11px] text-center">
            Upload an SVG to preview
          </div>
        </div>
      );
    }

    // Keep camera at fixed distance - model size stays consistent
    const cameraDistance = 150;

    return (
      <div className="w-full h-full overflow-hidden">
        <Canvas
          shadows
          camera={{ position: [0, 0, cameraDistance], fov: 50 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
          style={{
            background: "transparent",
            width: "100%",
            height: "100%",
            display: "block",
          }}
          onCreated={({ camera }) => {
            cameraRef.current = camera;
            (window as any).__current3DCamera = camera;
          }}
        >
          <ambientLight intensity={0.6 * Math.PI} />
          <directionalLight
            position={[50, 50, 100]}
            intensity={0.8 * Math.PI}
            castShadow={false}
          />

          {/* Environment Lighting */}
          {environment}

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
                envMapIntensity={useEnvironment ? envMapIntensity : 0.2}
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
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
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

ThreeDScene.displayName = "ThreeDScene";
