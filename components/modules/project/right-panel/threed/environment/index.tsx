"use client";

import { useEditorEngine } from "@/lib/stores/editor/hooks";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { MinusIcon } from "@/components/reusables/icons/common";
import { CustomImageIcon } from "@/components/reusables/icons/right";
import { ENVIRONMENT_PRESETS } from "@/lib/stores/editor/threed";
import { Tooltip } from "@/components/reusables/tooltip";

export const Environment = observer(() => {
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

  // By default, environment is enabled when a 3D model is loaded
  const isEnvironmentEnabled = modelState.useEnvironment;

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
          useEnvironment: true,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleEnvironment = () => {
    editorEngine.threed.updateModelState(selectedNode.id, {
      useEnvironment: !isEnvironmentEnabled,
    });
  };

  const toggleMagicLight = () => {
    const newValue = !modelState.useBloom;

    if (newValue) {
      // Enable Magic Light
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
      // Disable Magic Light
      editorEngine.threed.updateModelState(selectedNode.id, {
        useBloom: false,
      });
    }
  };

  return (
    <div className="border-b border-bd-50">
      {/* ℹ️ Environment settings are for preview only and will not affect the exported 3D model. */}

      {/* Section Header - Clickable to enable/disable environment */}
      <button
        onClick={toggleEnvironment}
        className="w-full flex items-center justify-between px-3 py-2 transition-colors group"
      >
        <span
          className={`text-[11.5px] font-normal transition-colors ${isEnvironmentEnabled
            ? "text-fg-50"
            : "text-fg-60 group-hover:text-fg-50"
            }`}
        >
          Environment
        </span>
        <span
          className={`transition-colors ${isEnvironmentEnabled
            ? "text-fg-50"
            : "text-fg-60 group-hover:text-fg-50"
            }`}
        >
          {isEnvironmentEnabled ? (
            <MinusIcon size={12} />
          ) : (
            <span className="text-[16px] leading-none">+</span>
          )}
        </span>
      </button>

      {/* Section Content */}
      {isEnvironmentEnabled && (
        <div className="px-3 pb-3 space-y-3">
          {/* Environment Presets - Redesigned */}
          <div className="grid grid-cols-5 gap-2">
            {ENVIRONMENT_PRESETS.map((preset) => (
              <Tooltip key={preset.name} content={preset.label} position="top">
                <button
                  onClick={() =>
                    editorEngine.threed.updateModelState(selectedNode.id, {
                      environmentPreset: preset.name,
                    })
                  }
                  className={`
                    relative overflow-hidden rounded-md transition-all h-6 w-full
                    ${modelState.environmentPreset === preset.name
                      ? "bg-bk-30 ring-1 ring-bd-50"
                      : "bg-bk-40 hover:bg-bk-30"
                    }
                  `}
                >
                  <div
                    className="absolute bottom-0 left-0 w-[70%] h-[70%]"
                    style={{
                      background: preset.color,
                      borderTopRightRadius: "40%",
                    }}
                  />
                </button>
              </Tooltip>
            ))}

            {/* Custom HDRI Button */}
            <Tooltip content="Custom Image" position="top">
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
                  relative overflow-hidden rounded-md transition-all h-6 w-full
                  ${modelState.environmentPreset === "custom"
                    ? "bg-bk-30 ring-1 ring-bd-50"
                    : "bg-bk-40 hover:bg-bk-35"
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
                  <div
                    className="absolute bottom-0 left-0 w-[70%] h-[70%]"
                    style={{
                      backgroundImage: `url(${modelState.customHdriUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderTopRightRadius: "40%",
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CustomImageIcon size={18} className="text-fg-60" />
                  </div>
                )}
              </button>
            </Tooltip>
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

          {/* Magic Light Section */}
          <div className="space-y-2 pt-2 border-t border-bd-50">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="magicLight"
                checked={modelState.useBloom}
                onChange={toggleMagicLight}
                disabled={
                  modelState.environmentPreset === "custom" &&
                  !!modelState.customHdriUrl
                }
                className="w-3.5 h-3.5 rounded accent-fg-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label
                htmlFor="magicLight"
                className={`text-[11px] transition-colors ${modelState.environmentPreset === "custom" &&
                  modelState.customHdriUrl
                  ? "text-fg-70 cursor-not-allowed"
                  : "text-fg-60 cursor-pointer"
                  }`}
              >
                Magic Light
              </label>
            </div>

            {/* Magic Light Controls */}
            {modelState.useBloom && (
              <div className="space-y-2 pt-1">
                {/* Bloom Intensity */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-fg-60 w-20 shrink-0">
                    Intensity
                  </span>
                  <div className="flex-1 flex items-center gap-2 bg-bk-40 rounded border border-bd-50 px-2 py-1">
                    <div className="relative flex-1">
                      <div className="w-full h-1 bg-bk-50 rounded-lg relative">
                        <div
                          className="h-full bg-fg-50 rounded-lg transition-all duration-150"
                          style={{
                            width: `${((modelState.bloomIntensity * 10 - 1) / 19) * 100
                              }%`,
                          }}
                        />
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={20}
                        step={1}
                        value={modelState.bloomIntensity * 10}
                        onChange={(e) =>
                          editorEngine.threed.updateModelState(
                            selectedNode.id,
                            {
                              bloomIntensity: parseFloat(e.target.value) / 10,
                            }
                          )
                        }
                        className="absolute top-0 w-full h-1 appearance-none cursor-pointer slider-custom bg-transparent"
                      />
                    </div>
                    <span className="text-[10px] text-fg-50 w-6 text-right">
                      {modelState.bloomIntensity.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Smooth Bloom Checkbox */}
                <div className="flex items-center gap-2 pl-[84px]">
                  <input
                    type="checkbox"
                    id="bloomMipmapBlur"
                    checked={modelState.bloomMipmapBlur}
                    onChange={(e) =>
                      editorEngine.threed.updateModelState(selectedNode.id, {
                        bloomMipmapBlur: e.target.checked,
                      })
                    }
                    className="w-3 h-3 rounded accent-fg-50 cursor-pointer"
                  />
                  <label
                    htmlFor="bloomMipmapBlur"
                    className="text-[10px] text-fg-60 cursor-pointer"
                  >
                    Smooth Bloom
                  </label>
                </div>

                {/* Model Rotation */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-fg-60 w-20 shrink-0">
                    Rotation
                  </span>
                  <div className="flex-1 flex items-center gap-2 bg-bk-40 rounded border border-bd-50 px-2 py-1">
                    <div className="relative flex-1">
                      <div className="w-full h-1 bg-bk-50 rounded-lg relative">
                        <div
                          className="h-full bg-fg-50 rounded-lg transition-all duration-150"
                          style={{
                            width: `${((modelState.modelRotationY * (180 / Math.PI)) /
                              360) *
                              100
                              }%`,
                          }}
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        step={15}
                        value={modelState.modelRotationY * (180 / Math.PI)}
                        onChange={(e) =>
                          editorEngine.threed.updateModelState(
                            selectedNode.id,
                            {
                              modelRotationY:
                                parseFloat(e.target.value) * (Math.PI / 180),
                            }
                          )
                        }
                        className="absolute top-0 w-full h-1 appearance-none cursor-pointer slider-custom bg-transparent"
                      />
                    </div>
                    <span className="text-[10px] text-fg-50 w-8 text-right">
                      {(modelState.modelRotationY * (180 / Math.PI)).toFixed(0)}
                      °
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
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
