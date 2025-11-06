"use client";

import {
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { Center } from "@react-three/drei";

interface SVGModelProps {
  svgData: string;
  depth?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelSegments?: number;
  customColor?: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  envMapIntensity?: number;
  transmission?: number;
  receiveShadow?: boolean;
  castShadow?: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: (error: Error) => void;
}

const applySpread = (
  shape: THREE.Shape,
  isHole: boolean,
  amount: number
): THREE.Shape => {
  if (amount === 0) return shape;

  const pts = shape.getPoints();
  if (pts.length < 3) return shape;

  const center = new THREE.Vector2();
  pts.forEach((pt) => center.add(pt));
  center.divideScalar(pts.length);

  const newShape = new THREE.Shape();
  const scaleAmount = isHole ? 1 - amount / 100 : 1;

  const newPoints = pts.map((pt) => {
    const dir = new THREE.Vector2().subVectors(pt, center);
    const scaledDir = dir.multiplyScalar(scaleAmount);
    return center.clone().add(scaledDir);
  });

  newShape.setFromPoints(newPoints);

  if (shape.holes && shape.holes.length > 0) {
    newShape.holes = shape.holes.map((hole) => {
      const holePts = hole.getPoints();
      const holeCenter = new THREE.Vector2();
      holePts.forEach((pt) => holeCenter.add(pt));
      holeCenter.divideScalar(holePts.length);

      const newHole = new THREE.Path();
      const holeScaleAmount = 1 + amount / 200;

      const newHolePoints = holePts.map((pt) => {
        const dir = new THREE.Vector2().subVectors(pt, holeCenter);
        const scaledDir = dir.multiplyScalar(holeScaleAmount);
        return holeCenter.clone().add(scaledDir);
      });

      newHole.setFromPoints(newHolePoints);
      return newHole;
    });
  }

  return newShape;
};

export const SVGModel = forwardRef<THREE.Group, SVGModelProps>(
  (
    {
      svgData,
      depth = 20,
      bevelEnabled = true,
      bevelThickness = 1,
      bevelSize = 0.5,
      bevelSegments = 3,
      customColor,
      roughness = 0.3,
      metalness = 0.5,
      clearcoat = 0,
      envMapIntensity = 1,
      transmission = 0,
      receiveShadow = true,
      castShadow = true,
      onLoadStart,
      onLoadComplete,
      onError,
    },
    ref
  ) => {
    const [paths, setPaths] = useState<THREE.ShapePath[]>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const groupRef = useRef<THREE.Group>(null);
    const materialsCache = useRef<Map<string, THREE.Material>>(new Map());

    useImperativeHandle(ref, () => groupRef.current!, []);

    useEffect(() => {
      if (!svgData) return;
      const cache = materialsCache.current;

      onLoadStart?.();

      try {
        const processedSvgData = svgData
          .replace(/[™®©]/g, "")
          .replace(/&trade;|&reg;|&copy;/g, "");

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(
          processedSvgData,
          "image/svg+xml"
        );

        const parserError = svgDoc.querySelector("parsererror");
        if (parserError) {
          throw new Error("SVG parse error: " + parserError.textContent);
        }

        const svgElement = svgDoc.querySelector("svg");
        if (!svgElement) {
          throw new Error("Invalid SVG: No SVG element found");
        }

        const textElements = svgDoc.querySelectorAll("text");
        if (textElements.length > 0) {
          textElements.forEach((textEl) => {
            const text = textEl.textContent || "";
            if (/[™®©]|&trade;|&reg;|&copy;/.test(text)) {
              textEl.parentNode?.removeChild(textEl);
            }
          });
        }

        const svgString = new XMLSerializer().serializeToString(svgDoc);

        const viewBox = svgElement.getAttribute("viewBox");
        let width = Number.parseFloat(
          svgElement.getAttribute("width") || "100"
        );
        let height = Number.parseFloat(
          svgElement.getAttribute("height") || "100"
        );

        if (viewBox) {
          const [, , vbWidth, vbHeight] = viewBox
            .split(" ")
            .map(Number.parseFloat);
          width = vbWidth;
          height = vbHeight;
        }

        setDimensions({ width, height });

        const loader = new SVGLoader();
        const svgData2 = loader.parse(svgString);

        setPaths(svgData2.paths);

        setTimeout(() => {
          onLoadComplete?.();
        }, 300);
      } catch (error) {
        console.error("Error parsing SVG:", error);
        onError?.(
          error instanceof Error ? error : new Error("Failed to parse SVG")
        );
      }

      return () => {
        cache.clear();
      };
    }, [svgData, onLoadStart, onLoadComplete, onError]);

    const shapesWithMaterials = useMemo(() => {
      if (paths.length === 0) return [];

      return paths
        .map((path, index) => {
          try {
            const shapes = SVGLoader.createShapes(path);
            if (shapes.length === 0) return null;

            const processedShapes = shapes.map((shape) =>
              applySpread(shape, false, 0)
            );

            return {
              shapes: processedShapes,
              color: customColor || path.color,
              renderOrder: index,
              isHole: false,
            };
          } catch (error) {
            console.warn("Error creating shapes from path:", error);
            return null;
          }
        })
        .filter(Boolean) as Array<{
        shapes: THREE.Shape[];
        color: string | THREE.Color;
        renderOrder: number;
        isHole: boolean;
      }>;
    }, [paths, customColor]);

    const scale = useMemo(() => {
      if (dimensions.width === 0 || dimensions.height === 0) return 1;
      return 100 / Math.max(dimensions.width, dimensions.height);
    }, [dimensions]);

    const getMaterial = (color: string | THREE.Color, isHole: boolean) => {
      const colorString =
        color instanceof THREE.Color ? `#${color.getHexString()}` : color;
      const cacheKey = `${colorString}_${roughness}_${metalness}_${clearcoat}_${transmission}_${envMapIntensity}`;

      if (materialsCache.current.has(cacheKey)) {
        return materialsCache.current.get(cacheKey)!;
      }

      const threeColor =
        color instanceof THREE.Color ? color : new THREE.Color(color);
      const material = new THREE.MeshPhysicalMaterial({
        color: threeColor,
        roughness: Math.max(0.05, roughness),
        metalness,
        clearcoat: Math.max(clearcoat, 0.05),
        clearcoatRoughness: 0.05,
        reflectivity: 1,
        envMapIntensity,
        transmission,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: isHole ? -1 : 1,
        polygonOffsetUnits: isHole ? -1 : 1,
        flatShading: false,
        wireframe: false,
      });

      materialsCache.current.set(cacheKey, material);
      return material;
    };

    useEffect(() => {
      const cache = materialsCache.current;
      const group = groupRef.current;
      return () => {
        cache.forEach((material) => {
          if (material) material.dispose();
        });
        cache.clear();

        if (group) {
          group.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              if (object.geometry) object.geometry.dispose();
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => {
                  if (!cache.has(material.uuid)) material.dispose();
                });
              } else if (object.material && !cache.has(object.material.uuid)) {
                object.material.dispose();
              }
            }
          });
        }
      };
    }, []);

    if (shapesWithMaterials.length === 0) return null;

    // Scale bevel values to match the model's coordinate space
    // Since the group is scaled, bevel needs to be in the original SVG coordinate space
    const scaledBevelThickness = bevelThickness / scale;
    const scaledBevelSize = bevelSize / scale;

    const getExtrudeSettings = (isHole: boolean) => ({
      depth,
      bevelEnabled,
      bevelThickness: isHole
        ? scaledBevelThickness * 1.05
        : scaledBevelThickness,
      bevelSize: isHole ? scaledBevelSize * 1.05 : scaledBevelSize,
      bevelSegments: Math.max(4, bevelSegments),
      curveSegments: Math.max(8, bevelSegments * 2),
    });

    const box = new THREE.Box3();
    const tempGroup = new THREE.Group();

    shapesWithMaterials.forEach((shapeItem) => {
      shapeItem.shapes.forEach((shape) => {
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry);
        tempGroup.add(mesh);
      });
    });

    box.setFromObject(tempGroup);
    const size = new THREE.Vector3();
    box.getSize(size);

    const xOffset = size.x / -2;
    const yOffset = size.y / -2;

    return (
      <Center>
        <group
          ref={groupRef}
          scale={[scale, -scale, scale]}
          position={[0, 0, 0]}
          rotation={[0, Math.PI / 4, 0]}
        >
          {shapesWithMaterials.map((shapeItem, i) => (
            <group key={i} renderOrder={shapeItem.renderOrder}>
              {shapeItem.shapes.map((shape, j) => (
                <mesh
                  key={j}
                  castShadow={castShadow}
                  receiveShadow={receiveShadow}
                  renderOrder={shapeItem.renderOrder}
                  position={[
                    xOffset,
                    yOffset,
                    shapeItem.isHole ? -depth / 4 : -depth / 2,
                  ]}
                >
                  <extrudeGeometry
                    args={[shape, getExtrudeSettings(shapeItem.isHole)]}
                  />
                  <primitive
                    object={getMaterial(shapeItem.color, shapeItem.isHole)}
                    attach="material"
                  />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </Center>
    );
  }
);

SVGModel.displayName = "SVGModel";
