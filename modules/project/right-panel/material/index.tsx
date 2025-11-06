"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Slider } from "@/components/slider";
import { PlusIcon, MinusIcon } from "@/components/icons/common";
import { MATERIAL_PRESETS } from "@/lib/stores/editor/threed";

export const Material = observer(() => {
  const [isExpanded, setIsExpanded] = useState(true);
  const editorEngine = useEditorEngine();
  const selectedNodeId = editorEngine.nodes.selectedNodeId;
  const selectedNode = selectedNodeId
    ? editorEngine.nodes.getNode(selectedNodeId)
    : null;

  const is3DNode = selectedNode?.type === "3d";
  const modelState = is3DNode
    ? editorEngine.threed.getModelState(selectedNode.id)
    : null;

  // Only show for 3D nodes - return after all hooks
  if (!is3DNode || !selectedNode || !modelState) {
    return null;
  }

  const handlePresetClick = (presetName: string) => {
    const preset = MATERIAL_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      editorEngine.threed.updateModelState(selectedNode.id, {
        materialPreset: preset.name,
        roughness: preset.roughness,
        metalness: preset.metalness,
        clearcoat: preset.clearcoat,
        transmission: preset.transmission,
        envMapIntensity: preset.envMapIntensity,
      });
    }
  };

  return (
    <div className="border-b border-bd-50">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 transition-colors group"
      >
        <span
          className={`text-[11.5px] font-normal transition-colors ${
            isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
          }`}
        >
          Material
        </span>
        <span
          className={`transition-colors ${
            isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
          }`}
        >
          {isExpanded ? <MinusIcon size={12} /> : <PlusIcon size={12} />}
        </span>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Material Presets - Visual Buttons */}
          <div className="space-y-2">
            <label className="text-[11px] text-fg-60">Material Type</label>
            <div className="grid grid-cols-5 gap-2">
              {MATERIAL_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetClick(preset.name)}
                  className={`
                    flex flex-col items-center p-2 rounded transition-colors
                    ${
                      modelState.materialPreset === preset.name
                        ? "bg-bk-20 ring-1 ring-fg-40"
                        : "bg-bk-40 hover:bg-bk-30"
                    }
                  `}
                >
                  <div
                    className="w-10 h-10 rounded-full mb-1"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(210, ${100 - preset.roughness * 100}%, ${
                        50 + preset.metalness * 30
                      }%), 
                        hsl(240, ${100 - preset.roughness * 80}%, ${
                        20 + preset.metalness * 50
                      }%))`,
                      boxShadow:
                        preset.clearcoat > 0
                          ? "0 0 10px rgba(255,255,255,0.5) inset"
                          : "none",
                      opacity: preset.transmission > 0 ? 0.7 : 1,
                    }}
                  />
                  <span className="text-[9px] text-fg-60 text-center leading-tight">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Override */}
          <div className="flex items-center gap-2 pt-2 border-t border-bd-50">
            <input
              type="checkbox"
              id="useCustomColor"
              checked={modelState.useCustomColor}
              onChange={(e) =>
                editorEngine.threed.updateModelState(selectedNode.id, {
                  useCustomColor: e.target.checked,
                })
              }
              className="w-3 h-3 rounded"
            />
            <label htmlFor="useCustomColor" className="text-[11px] text-fg-60">
              Override SVG colors
            </label>
          </div>

          {/* Custom Color Picker */}
          {modelState.useCustomColor && (
            <div className="space-y-2">
              <label className="text-[11px] text-fg-60">Custom Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={modelState.customColor}
                  onChange={(e) =>
                    editorEngine.threed.updateModelState(selectedNode.id, {
                      customColor: e.target.value,
                    })
                  }
                  className="w-8 h-8 rounded cursor-pointer border border-bd-50"
                />
                <input
                  type="text"
                  value={modelState.customColor}
                  onChange={(e) =>
                    editorEngine.threed.updateModelState(selectedNode.id, {
                      customColor: e.target.value,
                    })
                  }
                  className="flex-1 text-[11px] bg-bk-40 text-fg-50 rounded px-2 py-1.5 border border-bd-50"
                />
              </div>
            </div>
          )}

          {/* Custom Material Controls - only show if custom preset */}
          {modelState.materialPreset === "custom" && (
            <>
              <Slider
                label={`Roughness: ${modelState.roughness.toFixed(2)}`}
                value={modelState.roughness * 100}
                min={0}
                max={100}
                step={1}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    roughness: value / 100,
                  })
                }
              />

              <Slider
                label={`Metalness: ${modelState.metalness.toFixed(2)}`}
                value={modelState.metalness * 100}
                min={0}
                max={100}
                step={1}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    metalness: value / 100,
                  })
                }
              />

              <Slider
                label={`Clearcoat: ${modelState.clearcoat.toFixed(2)}`}
                value={modelState.clearcoat * 100}
                min={0}
                max={100}
                step={1}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    clearcoat: value / 100,
                  })
                }
              />

              <Slider
                label={`Transmission: ${modelState.transmission.toFixed(2)}`}
                value={modelState.transmission * 100}
                min={0}
                max={100}
                step={1}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    transmission: value / 100,
                  })
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  );
});
