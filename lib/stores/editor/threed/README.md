# 3D Manager Store

This MobX store manages the state for 3D models in the editor. Each 3D node can have its own independent 3D model state.

## Architecture

- **ThreeDManager**: Main manager class that stores state for all 3D nodes
- **ThreeDModelState**: Interface defining all properties for a 3D model
- **Presets**: Material, bevel, environment, and color presets

## Usage

```typescript
// Get 3D state for a specific node
const modelState = editorEngine.threed.getModelState(nodeId);

// Update 3D state
editorEngine.threed.updateModelState(nodeId, {
  depth: 2.5,
  materialPreset: "glass",
  useCustomColor: true,
  customColor: "#ff0000",
});

// Remove state when node is deleted
editorEngine.threed.removeModelState(nodeId);
```

## State Properties

### SVG Data

- `svgData`: SVG content string
- `fileName`: Original file name
- `isModelLoading`: Loading state
- `svgProcessingError`: Error message if any

### Geometry

- `depth`: Extrusion depth (0.1 - 50)
- `isHollowSvg`: Whether SVG has holes
- `modelRotationY`: Y-axis rotation in radians

### Bevel

- `bevelEnabled`: Enable/disable bevel
- `bevelThickness`: Bevel thickness (0 - 3)
- `bevelSize`: Bevel size (0 - 2)
- `bevelSegments`: Bevel quality (1 - 10)
- `bevelPreset`: Preset name (none/light/medium/heavy/custom)

### Material

- `customColor`: Custom color hex
- `useCustomColor`: Override SVG colors
- `materialPreset`: Preset name (metallic/clay/plastic/glass/custom)
- `roughness`: Surface roughness (0 - 1)
- `metalness`: Metallic property (0 - 1)
- `clearcoat`: Clear coat layer (0 - 1)
- `envMapIntensity`: Environment reflection intensity
- `transmission`: Glass transparency (0 - 1)

### Environment

- `useEnvironment`: Enable environment lighting
- `environmentPreset`: Preset name (apartment/city/dawn/etc.)
- `customHdriUrl`: Custom HDRI image URL

### Background

- `userSelectedBackground`: User manually selected background
- `backgroundColor`: Background color hex
- `solidColorPreset`: Preset name (light/dark/blue/gray/green)

### Animation

- `autoRotate`: Enable auto-rotation
- `autoRotateSpeed`: Rotation speed (2.5 - 7.5)

### Display Effects

- `useBloom`: Enable bloom effect (vibe mode)
- `bloomIntensity`: Bloom intensity (0.1 - 2.0)
- `bloomMipmapBlur`: Smooth bloom quality

## Presets

All presets are exported as constants:

- `MATERIAL_PRESETS`: 5 material types
- `BEVEL_PRESETS`: 5 bevel styles
- `ENVIRONMENT_PRESETS`: 9 environment scenes
- `BACKGROUND_COLOR_PRESETS`: 5 background colors
