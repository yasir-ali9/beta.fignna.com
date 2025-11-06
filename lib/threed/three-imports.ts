// Lazy loading Three.js modules to reduce initial bundle size
// This pattern is from vecto3d for better performance

export async function loadThreeModules() {
  const [dreiMod, postprocessingMod, stlMod, gltfMod] = await Promise.all([
    import("@react-three/drei"),
    import("@react-three/postprocessing"),
    import("three/examples/jsm/exporters/STLExporter.js"),
    import("three/examples/jsm/exporters/GLTFExporter.js"),
  ]);

  return {
    OrbitControls: dreiMod.OrbitControls,
    EffectComposer: postprocessingMod.EffectComposer,
    Bloom: postprocessingMod.Bloom,
    BrightnessContrast: postprocessingMod.BrightnessContrast,
    SMAA: postprocessingMod.SMAA,
    ToneMapping: postprocessingMod.ToneMapping,
    STLExporter: stlMod.STLExporter,
    GLTFExporter: gltfMod.GLTFExporter,
  };
}
