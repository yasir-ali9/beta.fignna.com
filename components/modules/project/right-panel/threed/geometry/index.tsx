"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { PlusIcon, MinusIcon } from "@/components/reusables/icons/common";
import { BEVEL_PRESETS } from "@/lib/stores/editor/threed";
import { PropertyInput } from "@/components/reusables/property-input";
import {
  DepthIcon,
  ThicknessIcon,
  RoundnessIcon,
  SmoothnessIcon,
} from "@/components/reusables/icons/right";
import { Tooltip } from "@/components/reusables/tooltip";

export const Geometry = observer(() => {
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

  // Load default logo on mount if no SVG is loaded
  useEffect(() => {
    if (!is3DNode || !selectedNode || !modelState) return;

    if (!modelState.svgData && !modelState.fileName) {
      fetch("/svgs/logo.svg")
        .then((res) => res.text())
        .then((svgData) => {
          editorEngine.threed.updateModelState(selectedNode.id, {
            svgData,
            fileName: "logo.svg",
            isModelLoading: false,
          });
          // Also update the node
          editorEngine.nodes.updateNode(selectedNode.id, {
            svgData,
            fileName: "logo.svg",
          });
        })
        .catch((err) => {
          console.error("Failed to load default logo:", err);
          editorEngine.threed.updateModelState(selectedNode.id, {
            isModelLoading: false,
          });
        });
    }
  }, [
    is3DNode,
    selectedNode?.id,
    modelState?.svgData,
    modelState?.fileName,
    editorEngine,
  ]);

  // Only show for 3D nodes - return after all hooks
  if (!is3DNode || !selectedNode || !modelState) {
    return null;
  }

  const handleSVGUpload = (svgData: string, fileName: string) => {
    editorEngine.threed.updateModelState(selectedNode.id, {
      svgData,
      fileName,
      isModelLoading: false,
      svgProcessingError: null,
    });
    // Also update the node
    editorEngine.nodes.updateNode(selectedNode.id, {
      svgData,
      fileName,
    });
  };

  const handleDepthChange = (value: number) => {
    editorEngine.threed.updateModelState(selectedNode.id, { depth: value });
  };

  const handleBevelPresetChange = (presetName: string) => {
    const preset = BEVEL_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      editorEngine.threed.updateModelState(selectedNode.id, {
        bevelPreset: preset.name,
        bevelThickness: preset.thickness,
        bevelSize: preset.size,
        bevelSegments: preset.segments,
        bevelEnabled: preset.name !== "none",
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
          Geometry
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
        <div className="px-3 pb-2 space-y-1">
          {/* SVG Upload - Minimal Design */}
          <div className="space-y-1">
            <label className="text-[10px] text-fg-60">Upload</label>
            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".svg,image/svg+xml";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;

                  if (file.type !== "image/svg+xml") {
                    alert("Please upload an SVG file");
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const svgData = event.target?.result as string;
                    if (svgData) {
                      handleSVGUpload(svgData, file.name);
                    }
                  };
                  reader.readAsText(file);
                };
                input.click();
              }}
              className="w-full h-[26px] flex items-center justify-between bg-bk-40 rounded border border-bd-50 hover:border-bd-55 px-2 transition-colors group"
            >
              <div className="flex items-center gap-2">
                {/* SVG Preview */}
                {modelState.svgData ? (
                  <div
                    className="w-[14px] h-[14px] flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-fg-50"
                    dangerouslySetInnerHTML={{ __html: modelState.svgData }}
                  />
                ) : (
                  <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0 bg-bk-50 rounded">
                    <span className="text-[8px] text-fg-60">?</span>
                  </div>
                )}
                <span className="text-[11px] text-fg-50">
                  {modelState.fileName?.replace(".svg", "") || "No file"}
                </span>
              </div>
              <span className="text-[10px] text-fg-60 group-hover:text-fg-50 transition-colors">
                Replace
              </span>
            </button>
          </div>

          {/* Depth and Presets in same row */}
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-1">
            {/* Depth Input - Showing "Thickness" as "Depth" to user */}
            <div className="space-y-1 min-w-0">
              <label className="text-[10px] text-fg-60">Depth</label>
              <PropertyInput
                icon={<DepthIcon size={16} />}
                value={modelState.depth}
                onChange={handleDepthChange}
                min={0.1}
                max={50}
                step={0.1}
              />
            </div>

            {/* Bevel Presets - Redesigned like Environment */}
            <div className="space-y-1 min-w-0">
              <label className="text-[10px] text-fg-60">Presets</label>
              <div className="grid grid-cols-4 gap-1 min-w-0">
                {BEVEL_PRESETS.filter((p) => p.name !== "custom").map(
                  (preset) => {
                    // Calculate border radius based on preset
                    const radiusMap: Record<string, string> = {
                      none: "0%",
                      light: "20%",
                      medium: "35%",
                      heavy: "50%",
                    };
                    const radius = radiusMap[preset.name] || "0%";

                    return (
                      <Tooltip
                        key={preset.name}
                        content={preset.label}
                        position="top"
                      >
                        <button
                          onClick={() => handleBevelPresetChange(preset.name)}
                          className={`
                            relative overflow-hidden rounded transition-all h-6 w-full
                            ${modelState.bevelPreset === preset.name
                              ? "bg-bk-30 ring-1 ring-bd-50"
                              : "bg-bk-40 hover:bg-bk-30"
                            }
                          `}
                        >
                          <div
                            className="absolute bottom-0 left-0 w-[70%] h-[70%] bg-fg-60"
                            style={{
                              borderTopRightRadius: radius,
                            }}
                          />
                        </button>
                      </Tooltip>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Thickness, Roundness, Smoothness in one row - Always show when bevel is enabled */}
          {modelState.bevelEnabled && (
            <div className="space-y-1">
              {/* Labels Row */}
              <div className="grid grid-cols-3 gap-1">
                <label className="text-[10px] text-fg-60">Thickness</label>
                <label className="text-[10px] text-fg-60">Roundness</label>
                <label className="text-[10px] text-fg-60">Smoothness</label>
              </div>

              {/* Inputs Row */}
              <div className="grid grid-cols-3 gap-1">
                {/* Thickness - Showing "Bevel Thickness" as "Thickness" to user */}
                <PropertyInput
                  icon={<ThicknessIcon size={14} />}
                  value={modelState.bevelThickness}
                  onChange={(value) =>
                    editorEngine.threed.updateModelState(selectedNode.id, {
                      bevelThickness: value,
                    })
                  }
                  min={0}
                  max={3}
                  step={0.1}
                />

                {/* Roundness - Showing "Bevel Size" as "Roundness" to user */}
                <PropertyInput
                  icon={<RoundnessIcon size={14} />}
                  value={modelState.bevelSize}
                  onChange={(value) =>
                    editorEngine.threed.updateModelState(selectedNode.id, {
                      bevelSize: value,
                    })
                  }
                  min={0}
                  max={2}
                  step={0.1}
                />

                {/* Smoothness - Showing "Bevel Quality" as "Smoothness" to user */}
                <PropertyInput
                  icon={<SmoothnessIcon size={14} />}
                  value={modelState.bevelSegments}
                  onChange={(value) =>
                    editorEngine.threed.updateModelState(selectedNode.id, {
                      bevelSegments: value,
                    })
                  }
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </div>
          )}

          {/* Auto-rotate */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="autoRotate"
              checked={modelState.autoRotate}
              onChange={(e) =>
                editorEngine.threed.updateModelState(selectedNode.id, {
                  autoRotate: e.target.checked,
                })
              }
              className="w-3.5 h-3.5 rounded accent-fg-50 cursor-pointer"
            />
            <label
              htmlFor="autoRotate"
              className="text-[11px] text-fg-60 cursor-pointer"
            >
              Auto-rotate model
            </label>
          </div>

          {modelState.autoRotate && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-fg-60 w-20 shrink-0">
                Speed
              </span>
              <div className="flex-1 flex items-center gap-2 bg-bk-40 rounded border border-bd-50 px-2 py-1">
                <div className="relative flex-1">
                  <div className="w-full h-1 bg-bk-50 rounded-lg relative">
                    <div
                      className="h-full bg-fg-50 rounded-lg transition-all duration-150"
                      style={{
                        width: `${((modelState.autoRotateSpeed - 1) / 9) * 100
                          }%`,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={modelState.autoRotateSpeed}
                    onChange={(e) =>
                      editorEngine.threed.updateModelState(selectedNode.id, {
                        autoRotateSpeed: parseFloat(e.target.value),
                      })
                    }
                    className="absolute top-0 w-full h-1 appearance-none cursor-pointer slider-custom bg-transparent"
                  />
                </div>
                <span className="text-[10px] text-fg-50 w-8 text-right">
                  {modelState.autoRotateSpeed.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 1px solid var(--bd-50);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        .slider-custom::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider-custom::-webkit-slider-thumb:active {
          transform: scale(1.15);
        }

        .slider-custom::-moz-range-thumb {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 1px solid var(--bd-50);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        .slider-custom::-moz-range-thumb:hover {
          transform: scale(1.1);
        }

        .slider-custom::-moz-range-thumb:active {
          transform: scale(1.15);
        }

        .slider-custom::-webkit-slider-track {
          height: 4px;
          background: transparent;
          border-radius: 2px;
        }

        .slider-custom::-moz-range-track {
          height: 4px;
          background: transparent;
          border-radius: 2px;
          border: none;
        }

        .slider-custom:focus {
          outline: none;
        }

        .slider-custom::-moz-focus-outer {
          border: 0;
        }
      `}</style>
    </div>
  );
});
