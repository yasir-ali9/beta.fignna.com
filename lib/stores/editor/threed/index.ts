import { makeAutoObservable } from "mobx";

// Material presets based on vecto3d
export interface MaterialPreset {
  name: string;
  label: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  transmission: number;
  envMapIntensity: number;
}

export const MATERIAL_PRESETS: MaterialPreset[] = [
  {
    name: "metallic",
    label: "Metallic",
    roughness: 0.2,
    metalness: 0.9,
    clearcoat: 1.0,
    transmission: 0,
    envMapIntensity: 1.8,
  },
  {
    name: "clay",
    label: "Clay/Matte",
    roughness: 1.0,
    metalness: 0.0,
    clearcoat: 0.0,
    transmission: 0,
    envMapIntensity: 0.3,
  },
  {
    name: "plastic",
    label: "Plastic",
    roughness: 0.4,
    metalness: 0.0,
    clearcoat: 0.6,
    transmission: 0,
    envMapIntensity: 0.8,
  },
  {
    name: "glass",
    label: "Glass",
    roughness: 0.05,
    metalness: 0.0,
    clearcoat: 1.0,
    transmission: 0.95,
    envMapIntensity: 3.5,
  },
  {
    name: "custom",
    label: "Custom",
    roughness: 0.3,
    metalness: 0.5,
    clearcoat: 0,
    transmission: 0,
    envMapIntensity: 1.0,
  },
];

// Bevel presets
export interface BevelPreset {
  name: string;
  label: string;
  thickness: number;
  size: number;
  segments: number;
}

export const BEVEL_PRESETS: BevelPreset[] = [
  { name: "none", label: "None", thickness: 0, size: 0, segments: 1 },
  { name: "light", label: "Light", thickness: 0.5, size: 0.3, segments: 2 },
  { name: "medium", label: "Medium", thickness: 1.0, size: 0.5, segments: 4 },
  { name: "heavy", label: "Heavy", thickness: 2.0, size: 1.0, segments: 8 },
  { name: "custom", label: "Custom", thickness: 1.0, size: 0.5, segments: 4 },
];

// Environment presets
export interface EnvironmentPreset {
  name: string;
  label: string;
  color: string;
}

export const ENVIRONMENT_PRESETS: EnvironmentPreset[] = [
  { name: "apartment", label: "Apartment (Indoor)", color: "#e0ccae" },
  { name: "city", label: "City (Urban)", color: "#b4bdc6" },
  { name: "dawn", label: "Dawn (Sunrise)", color: "#ffd0b0" },
  { name: "forest", label: "Forest (Natural)", color: "#a8c0a0" },
  { name: "lobby", label: "Lobby (Interior)", color: "#d8c8b8" },
  { name: "park", label: "Park (Daytime)", color: "#b3d9ff" },
  { name: "studio", label: "Studio (Neutral)", color: "#d9d9d9" },
  { name: "sunset", label: "Sunset (Warm)", color: "#ffb98c" },
  { name: "warehouse", label: "Warehouse (Industrial)", color: "#9ba3ad" },
];

// Background color presets
export interface ColorPreset {
  name: string;
  label: string;
  color: string;
}

export const BACKGROUND_COLOR_PRESETS: ColorPreset[] = [
  { name: "light", label: "Light", color: "#f5f5f5" },
  { name: "dark", label: "Dark", color: "#121212" },
  { name: "blue", label: "Blue", color: "#e6f7ff" },
  { name: "gray", label: "Gray", color: "#e0e0e0" },
  { name: "green", label: "Green", color: "#e6ffed" },
];

// 3D Model state for a specific node
export interface ThreeDModelState {
  // SVG Data
  svgData: string | null;
  fileName: string;
  isModelLoading: boolean;
  svgProcessingError: string | null;

  // Geometry
  depth: number;
  isHollowSvg: boolean;
  modelRotationY: number;

  // Bevel
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  bevelPreset: string;

  // Material
  customColor: string;
  useCustomColor: boolean;
  materialPreset: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  envMapIntensity: number;
  transmission: number;

  // Environment
  useEnvironment: boolean;
  environmentPreset: string;
  customHdriUrl: string | null;

  // Background
  userSelectedBackground: boolean;
  backgroundColor: string;
  solidColorPreset: string;

  // Animation
  autoRotate: boolean;
  autoRotateSpeed: number;

  // Display
  useBloom: boolean;
  bloomIntensity: number;
  bloomMipmapBlur: boolean;
}

// Manager for 3D model states
export class ThreeDManager {
  // Map of node ID to 3D model state
  private modelStates: Map<string, ThreeDModelState> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  // Get default state for a new 3D model
  private getDefaultState(): ThreeDModelState {
    const initialPreset =
      MATERIAL_PRESETS.find((p) => p.name === "metallic") ||
      MATERIAL_PRESETS[0];

    return {
      // SVG Data
      svgData: null,
      fileName: "",
      isModelLoading: true,
      svgProcessingError: null,

      // Geometry
      depth: 1,
      isHollowSvg: false,
      modelRotationY: 0,

      // Bevel
      bevelEnabled: true,
      bevelThickness: 1.0,
      bevelSize: 0.5,
      bevelSegments: 4,
      bevelPreset: "medium",

      // Material
      customColor: "#3498db",
      useCustomColor: false,
      materialPreset: "metallic",
      roughness: initialPreset.roughness,
      metalness: initialPreset.metalness,
      clearcoat: initialPreset.clearcoat,
      envMapIntensity: initialPreset.envMapIntensity,
      transmission: initialPreset.transmission,

      // Environment
      useEnvironment: true,
      environmentPreset: "apartment",
      customHdriUrl: null,

      // Background
      userSelectedBackground: false,
      backgroundColor: "#f5f5f5",
      solidColorPreset: "light",

      // Animation
      autoRotate: false,
      autoRotateSpeed: 3,

      // Display
      useBloom: false,
      bloomIntensity: 1.0,
      bloomMipmapBlur: true,
    };
  }

  // Get or create state for a node
  getModelState(nodeId: string): ThreeDModelState {
    if (!this.modelStates.has(nodeId)) {
      this.modelStates.set(nodeId, this.getDefaultState());
    }
    return this.modelStates.get(nodeId)!;
  }

  // Update state for a node
  updateModelState(nodeId: string, updates: Partial<ThreeDModelState>) {
    const currentState = this.getModelState(nodeId);
    this.modelStates.set(nodeId, { ...currentState, ...updates });
  }

  // Remove state when node is deleted
  removeModelState(nodeId: string) {
    this.modelStates.delete(nodeId);
  }

  // Clear all states
  clearAllStates() {
    this.modelStates.clear();
  }

  // Check if node has 3D state
  hasModelState(nodeId: string): boolean {
    return this.modelStates.has(nodeId);
  }

  // Get all node IDs with 3D states
  get nodeIds(): string[] {
    return Array.from(this.modelStates.keys());
  }
}
