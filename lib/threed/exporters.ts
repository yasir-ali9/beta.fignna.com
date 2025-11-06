import * as THREE from "three";
import { loadThreeModules } from "./three-imports";

// PNG export resolutions
export const PNG_RESOLUTIONS = [
  { label: "Low Quality", multiplier: 1 },
  { label: "Medium Quality", multiplier: 2 },
  { label: "High Quality", multiplier: 3 },
];

// Prepare model for export
export function prepareModelForExport(
  model: THREE.Object3D,
  format?: "stl" | "gltf" | "glb"
): THREE.Object3D {
  const clonedModel = model.clone();

  clonedModel.matrixWorld.copy(model.matrixWorld);
  clonedModel.matrix.copy(model.matrix);

  if (format === "stl") {
    clonedModel.position.set(0, 0, 0);
    clonedModel.rotation.set(0, 0, 0);
    clonedModel.scale.set(1, 1, 1);
    clonedModel.rotation.x = THREE.MathUtils.degToRad(90);
  }

  clonedModel.updateMatrix();
  clonedModel.updateMatrixWorld(true);

  return clonedModel;
}

// Cleanup exported model
export function cleanupExportedModel(model: THREE.Object3D): void {
  model.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object.geometry) object.geometry.dispose();
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else if (object.material) {
        object.material.dispose();
      }
    }
  });
}

// Export to STL
export async function exportToSTL(
  model: THREE.Object3D,
  fileName: string
): Promise<boolean> {
  try {
    const exportModel = prepareModelForExport(model, "stl");
    const modules = await loadThreeModules();

    const exporter = new modules.STLExporter();
    const result = exporter.parse(exportModel, { binary: true });

    cleanupExportedModel(exportModel);

    const blob = new Blob([result], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error("Error exporting to STL:", error);
    return false;
  }
}

// Export to GLTF/GLB
export async function exportToGLTF(
  model: THREE.Object3D,
  fileName: string,
  format: "gltf" | "glb" = "glb"
): Promise<boolean> {
  try {
    const exportModel = prepareModelForExport(model, format);
    const modules = await loadThreeModules();

    const exporter = new modules.GLTFExporter();
    const options = {
      binary: format === "glb",
      trs: true,
      onlyVisible: true,
      embedImages: true,
    };

    const gltfData = await new Promise<ArrayBuffer | object>(
      (resolve, reject) => {
        exporter.parse(
          exportModel,
          (result: ArrayBuffer | object) => resolve(result),
          (error: Error) => reject(error),
          options
        );
      }
    );

    cleanupExportedModel(exportModel);

    let blob: Blob;
    if (format === "glb") {
      blob = new Blob([gltfData as ArrayBuffer], {
        type: "application/octet-stream",
      });
    } else {
      const jsonStr = JSON.stringify(gltfData, null, 2);
      blob = new Blob([jsonStr], { type: "application/json" });
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error(`Error exporting to ${format.toUpperCase()}:`, error);
    return false;
  }
}

// Export to PNG
export async function exportToPNG(
  canvasElement: HTMLCanvasElement | null,
  fileName: string,
  resolution: number = 1
): Promise<boolean> {
  if (!canvasElement) {
    console.error("Canvas element not found");
    return false;
  }

  try {
    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get 2D context");
    }

    exportCanvas.width = canvasElement.width * resolution;
    exportCanvas.height = canvasElement.height * resolution;

    ctx.drawImage(canvasElement, 0, 0, exportCanvas.width, exportCanvas.height);

    const dataURL = exportCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(dataURL);

    return true;
  } catch (error) {
    console.error("Error exporting PNG:", error);
    return false;
  }
}

// Main export handler
export async function handleExport(
  format: "stl" | "gltf" | "glb" | "png",
  modelRef: React.RefObject<THREE.Group | null>,
  fileName: string,
  resolution: number = 1,
  canvasElement?: HTMLCanvasElement | null
): Promise<void> {
  const baseName = fileName.replace(".svg", "");

  if (format === "png") {
    if (!canvasElement) {
      alert("Canvas not available for PNG export");
      return;
    }
    const success = await exportToPNG(canvasElement, baseName, resolution);
    if (success) {
      alert(`${baseName}.png downloaded successfully`);
    } else {
      alert("Failed to export PNG");
    }
    return;
  }

  if (!modelRef.current || !fileName) {
    alert("Model not loaded");
    return;
  }

  try {
    let success = false;
    const modelGroupClone = modelRef.current.clone();
    modelGroupClone.updateMatrixWorld(true);

    if (format === "stl") {
      success = await exportToSTL(modelGroupClone, `${baseName}.stl`);
    } else if (format === "glb" || format === "gltf") {
      success = await exportToGLTF(
        modelGroupClone,
        `${baseName}.${format}`,
        format
      );
    }

    cleanupExportedModel(modelGroupClone);

    if (success) {
      alert(`${baseName}.${format} downloaded successfully`);
    } else {
      alert(`Failed to export ${format.toUpperCase()}`);
    }
  } catch (error) {
    console.error("Export error:", error);
    alert(`Export failed: ${(error as Error).message || "Unknown error"}`);
  }
}
