"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "@/components/reusables/icons/common";
import { MATERIAL_PRESETS } from "@/lib/stores/editor/threed";
import { PropertyInput } from "@/components/reusables/property-input";
import { Tooltip } from "@/components/reusables/tooltip";

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
          className={`text-[11.5px] font-normal transition-colors ${isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
            }`}
        >
          Material
        </span>
        <span
          className={`transition-colors ${isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
            }`}
        >
          {isExpanded ? <MinusIcon size={12} /> : <PlusIcon size={12} />}
        </span>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-3 pb-2 space-y-2">
          {/* Material Presets - Redesigned like Environment */}
          <div className="space-y-1">
            <label className="text-[10px] text-fg-60">Presets</label>
            <div className="grid grid-cols-5 gap-2">
              {MATERIAL_PRESETS.filter((p) => p.name !== "custom").map(
                (preset) => (
                  <Tooltip
                    key={preset.name}
                    content={preset.label}
                    position="top"
                  >
                    <button
                      onClick={() => handlePresetClick(preset.name)}
                      className={`
                        relative overflow-hidden rounded transition-all h-6 w-full
                        ${modelState.materialPreset === preset.name
                          ? "bg-bk-30 ring-1 ring-bd-50"
                          : "bg-bk-40 hover:bg-bk-30"
                        }
                      `}
                    >
                      <div
                        className="absolute bottom-0 left-0 w-[70%] h-[70%]"
                        style={{
                          background: `linear-gradient(135deg, 
                            hsl(210, ${100 - preset.roughness * 100}%, ${50 + preset.metalness * 30
                            }%), 
                            hsl(240, ${100 - preset.roughness * 80}%, ${20 + preset.metalness * 50
                            }%))`,
                          borderTopRightRadius: "40%",
                          boxShadow:
                            preset.clearcoat > 0
                              ? "0 0 8px rgba(255,255,255,0.3) inset"
                              : "none",
                          opacity: preset.transmission > 0 ? 0.7 : 1,
                        }}
                      />
                    </button>
                  </Tooltip>
                )
              )}
            </div>
          </div>

          {/* Material Properties - Always show */}
          <div className="space-y-1">
            {/* Labels Row */}
            <div className="grid grid-cols-4 gap-1">
              <label className="text-[10px] text-fg-60">Roughness</label>
              <label className="text-[10px] text-fg-60">Metalness</label>
              <label className="text-[10px] text-fg-60">Clearcoat</label>
              <label className="text-[10px] text-fg-60">Transmission</label>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-4 gap-1">
              <PropertyInput
                value={modelState.roughness}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    roughness: value,
                    materialPreset: "custom",
                  })
                }
                min={0}
                max={1}
                step={0.01}
              />

              <PropertyInput
                value={modelState.metalness}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    metalness: value,
                    materialPreset: "custom",
                  })
                }
                min={0}
                max={1}
                step={0.01}
              />

              <PropertyInput
                value={modelState.clearcoat}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    clearcoat: value,
                    materialPreset: "custom",
                  })
                }
                min={0}
                max={1}
                step={0.01}
              />

              <PropertyInput
                value={modelState.transmission}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    transmission: value,
                    materialPreset: "custom",
                  })
                }
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          </div>

          {/* Color Override */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="useCustomColor"
              checked={modelState.useCustomColor}
              onChange={(e) =>
                editorEngine.threed.updateModelState(selectedNode.id, {
                  useCustomColor: e.target.checked,
                })
              }
              className="w-3.5 h-3.5 rounded accent-fg-50 cursor-pointer"
            />
            <label
              htmlFor="useCustomColor"
              className="text-[11px] text-fg-60 cursor-pointer"
            >
              Override SVG colors
            </label>
          </div>

          {/* Custom Color Picker */}
          {modelState.useCustomColor && (
            <div className="relative flex items-center bg-bk-40 rounded border border-bd-50 hover:border-bd-55 focus-within:border-ac-01 h-[26px]">
              {/* Color Picker as Icon */}
              <div className="relative flex items-center justify-center shrink-0 pl-1.5 pr-1">
                <input
                  type="color"
                  value={modelState.customColor}
                  onChange={(e) =>
                    editorEngine.threed.updateModelState(selectedNode.id, {
                      customColor: e.target.value,
                    })
                  }
                  className="w-[14px] h-[14px] rounded cursor-pointer"
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundColor: modelState.customColor,
                    border: "none",
                    outline: "none",
                    padding: 0,
                  }}
                />
              </div>

              {/* Text Input */}
              <input
                type="text"
                value={modelState.customColor}
                onChange={(e) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    customColor: e.target.value,
                  })
                }
                className="flex-1 h-full min-w-0 bg-transparent text-fg-50 text-[11px] font-normal transition-none! focus:outline-none pr-2"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});
