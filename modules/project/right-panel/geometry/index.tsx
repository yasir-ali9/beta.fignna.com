"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { Slider } from "@/components/slider";
import { PlusIcon, MinusIcon } from "@/components/icons/common";
import { SVGUpload } from "@/components/threed/svg-upload";
import { BEVEL_PRESETS } from "@/lib/stores/editor/threed";

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
          className={`text-[11.5px] font-normal transition-colors ${
            isExpanded ? "text-fg-50" : "text-fg-60 group-hover:text-fg-50"
          }`}
        >
          Geometry
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
          {/* SVG Upload */}
          <SVGUpload
            onUpload={handleSVGUpload}
            currentFileName={modelState.fileName}
          />

          {/* Depth/Thickness */}
          <Slider
            label="Thickness"
            value={modelState.depth}
            min={0.1}
            max={50}
            step={0.1}
            onChange={handleDepthChange}
          />

          {/* Bevel Presets */}
          <div className="space-y-2">
            <label className="text-[11px] text-fg-60">Bevel Style</label>
            <div className="grid grid-cols-5 gap-1">
              {BEVEL_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleBevelPresetChange(preset.name)}
                  className={`
                    text-[10px] py-1.5 rounded transition-colors
                    ${
                      modelState.bevelPreset === preset.name
                        ? "bg-bk-20 text-fg-30 border border-fg-40"
                        : "bg-bk-40 text-fg-60 hover:bg-bk-30 hover:text-fg-50"
                    }
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Bevel Controls - only show if custom preset */}
          {modelState.bevelEnabled && modelState.bevelPreset === "custom" && (
            <>
              <Slider
                label="Bevel Thickness"
                value={modelState.bevelThickness}
                min={0}
                max={3}
                step={0.1}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    bevelThickness: value,
                  })
                }
              />

              <Slider
                label="Bevel Size"
                value={modelState.bevelSize}
                min={0}
                max={2}
                step={0.1}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    bevelSize: value,
                  })
                }
              />

              <Slider
                label="Bevel Quality"
                value={modelState.bevelSegments}
                min={1}
                max={10}
                step={1}
                onChange={(value) =>
                  editorEngine.threed.updateModelState(selectedNode.id, {
                    bevelSegments: value,
                  })
                }
              />
            </>
          )}

          {/* Auto-rotate */}
          <div className="flex items-center gap-2 pt-2 border-t border-bd-50">
            <input
              type="checkbox"
              id="autoRotate"
              checked={modelState.autoRotate}
              onChange={(e) =>
                editorEngine.threed.updateModelState(selectedNode.id, {
                  autoRotate: e.target.checked,
                })
              }
              className="w-3 h-3 rounded"
            />
            <label htmlFor="autoRotate" className="text-[11px] text-fg-60">
              Auto-rotate model
            </label>
          </div>

          {modelState.autoRotate && (
            <Slider
              label="Rotation Speed"
              value={modelState.autoRotateSpeed}
              min={1}
              max={10}
              step={0.5}
              onChange={(value) =>
                editorEngine.threed.updateModelState(selectedNode.id, {
                  autoRotateSpeed: value,
                })
              }
            />
          )}
        </div>
      )}
    </div>
  );
});
