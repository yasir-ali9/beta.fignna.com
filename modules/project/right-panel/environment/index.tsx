"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useState, useRef } from "react";
import { Slider } from "@/components/slider";
import { PlusIcon, MinusIcon } from "@/components/icons/common";
import { ENVIRONMENT_PRESETS } from "@/lib/stores/editor/threed";

export const Environment = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const editorEngine = useEditorEngine();
  const selectedNodeId = editorEngine.nodes.selectedNodeId;
  const selectedNode = selectedNodeId
    ? editorEngine.nodes.getNode(selectedNodeId)
    : null;

  const hdriFileInputRef = useRef<HTMLInputElement>(null);

  const is3DNode = selectedNode?.type === "3d";
  const modelState = is3DNode
    ? editorEngine.threed.getModelState(selectedNode.id)
    : null;

  // Only show for 3D nodes - return after all hooks
  if (!is3DNode || !selectedNode || !modelState) {
    return null;
  }

  const handleHdriFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type.toLowerCase();
    const isJpg = fileType === "image/jpeg" || fileType === "image/jpg";
    const isPng = fileType === "image/png";

    if (!isJpg && !isPng) {
      alert("Only JPG and PNG files are supported");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large: Image must be smaller than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        editorEngine.threed.updateModelState(selectedNode.id, {
          customHdriUrl: event.target.result as string,
          environmentPreset: "custom",
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleVibeMode = () => {
    const newValue = !modelState.useBloom;

    if (newValue) {
      // Enable vibe mode
      editorEngine.threed.updateModelState(selectedNode.id, {
        useBloom: true,
        backgroundColor: "#000000",
        userSelectedBackground: true,
        solidColorPreset: "custom",
        autoRotate: false,
      });

      // Set custom color to black if using custom color
      if (modelState.useCustomColor) {
        editorEngine.threed.updateModelState(selectedNode.id, {
          customColor: "#000000",
        });
      }
    } else {
      // Disable vibe mode
      editorEngine.threed.updateModelState(selectedNode.id, {
        useBloom: false,
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
          Environment
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
          {/* Info Alert */}
          <div className="bg-bk-40 border border-bd-50 rounded p-2">
            <p className="text-[10px] text-fg-60 leading-relaxed">
              ℹ️ Environment settings are for preview only and will not affect
              the exported 3D model.
            </p>
          </div>

          {/* Use Environment Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useEnvironment"
              checked={modelState.useEnvironment}
              onChange={(e) =>
                editorEngine.threed.updateModelState(selectedNode.id, {
                  useEnvironment: e.target.checked,
                })
              }
              className="w-3 h-3 rounded"
            />
            <label htmlFor="useEnvironment" className="text-[11px] text-fg-60">
              Use Environment Lighting
            </label>
          </div>

          {modelState.useEnvironment && (
            <>
              {/* Environment Presets - Visual Buttons */}
              <div className="space-y-2">
                <label className="text-[11px] text-fg-60">
                  Environment Preset
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ENVIRONMENT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() =>
                        editorEngine.threed.updateModelState(selectedNode.id, {
                          environmentPreset: preset.name,
                        })
                      }
                      className={`
                        flex flex-col items-center p-2 rounded transition-colors
                        ${
                          modelState.environmentPreset === preset.name
                            ? "bg-bk-20 ring-1 ring-fg-40"
                            : "bg-bk-40 hover:bg-bk-30"
                        }
                      `}
                    >
                      <div
                        className="w-10 h-10 rounded-full mb-1"
                        style={{
                          background: preset.color,
                          boxShadow: "0 0 8px rgba(0,0,0,0.15) inset",
                        }}
                      />
                      <span className="text-[9px] text-fg-60 text-center leading-tight">
                        {preset.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}

                  {/* Custom HDRI Button */}
                  <button
                    onClick={() => {
                      if (modelState.customHdriUrl) {
                        editorEngine.threed.updateModelState(selectedNode.id, {
                          environmentPreset: "custom",
                        });
                      } else {
                        hdriFileInputRef.current?.click();
                      }
                    }}
                    className={`
                      flex flex-col items-center p-2 rounded transition-colors
                      ${
                        modelState.environmentPreset === "custom"
                          ? "bg-bk-20 ring-1 ring-fg-40"
                          : "bg-bk-40 hover:bg-bk-30"
                      }
                    `}
                  >
                    <input
                      ref={hdriFileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={handleHdriFileChange}
                    />

                    {modelState.customHdriUrl ? (
                      <>
                        <div
                          className="w-10 h-10 rounded-full mb-1"
                          style={{
                            backgroundImage: `url(${modelState.customHdriUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <span className="text-[9px] text-fg-60">Custom</span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full mb-1 flex items-center justify-center bg-bk-30">
                          <span className="text-xl font-semibold text-fg-50">
                            +
                          </span>
                        </div>
                        <span className="text-[9px] text-fg-60">Custom</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Custom HDRI Info */}
              {modelState.environmentPreset === "custom" &&
                modelState.customHdriUrl && (
                  <div className="bg-bk-40 border border-bd-50 rounded p-2">
                    <p className="text-[10px] text-fg-60 mb-2">
                      Your image will be used for reflections in the 3D model
                    </p>
                    <button
                      onClick={() => hdriFileInputRef.current?.click()}
                      className="text-[10px] bg-bk-30 text-fg-50 rounded px-2 py-1 hover:bg-bk-20 transition-colors"
                    >
                      Change Image
                    </button>
                  </div>
                )}

              {/* Vibe Mode Section */}
              <div className="space-y-3 pt-3 border-t border-bd-50">
                <button
                  onClick={toggleVibeMode}
                  disabled={
                    modelState.environmentPreset === "custom" &&
                    !!modelState.customHdriUrl
                  }
                  className={`
                    w-full py-2.5 rounded text-[11px] font-medium transition-all
                    ${
                      modelState.environmentPreset === "custom" &&
                      modelState.customHdriUrl
                        ? "bg-bk-40 text-fg-70 cursor-not-allowed"
                        : modelState.useBloom
                        ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white"
                        : "bg-bk-30 text-fg-50 hover:bg-bk-20"
                    }
                  `}
                >
                  {modelState.environmentPreset === "custom" &&
                  modelState.customHdriUrl
                    ? "Vibe Mode Not Available with Custom Images"
                    : modelState.useBloom
                    ? "✨ Disable Vibe Mode"
                    : "✨ Enable Vibe Mode"}
                </button>

                {/* Vibe Mode Controls */}
                {modelState.useBloom && (
                  <div className="space-y-3 p-3 bg-bk-40 border border-bd-50 rounded">
                    <Slider
                      label={`Bloom Intensity: ${modelState.bloomIntensity.toFixed(
                        1
                      )}`}
                      value={modelState.bloomIntensity * 10}
                      min={1}
                      max={20}
                      step={1}
                      onChange={(value) =>
                        editorEngine.threed.updateModelState(selectedNode.id, {
                          bloomIntensity: value / 10,
                        })
                      }
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="bloomMipmapBlur"
                        checked={modelState.bloomMipmapBlur}
                        onChange={(e) =>
                          editorEngine.threed.updateModelState(
                            selectedNode.id,
                            {
                              bloomMipmapBlur: e.target.checked,
                            }
                          )
                        }
                        className="w-3 h-3 rounded"
                      />
                      <label
                        htmlFor="bloomMipmapBlur"
                        className="text-[11px] text-fg-60"
                      >
                        Smooth Bloom (Better Quality)
                      </label>
                    </div>

                    <div className="pt-2 border-t border-bd-50">
                      <Slider
                        label={`Model Rotation: ${(
                          modelState.modelRotationY *
                          (180 / Math.PI)
                        ).toFixed(0)}°`}
                        value={modelState.modelRotationY * (180 / Math.PI)}
                        min={0}
                        max={360}
                        step={15}
                        onChange={(value) =>
                          editorEngine.threed.updateModelState(
                            selectedNode.id,
                            {
                              modelRotationY: value * (Math.PI / 180),
                            }
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});
