"use client";

import { useState, useEffect } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  className = "",
}: SliderProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  // Update input value when prop value changes
  useEffect(() => {
    const displayValue =
      step < 1 ? value.toFixed(1) : Math.round(value).toString();
    setInputValue(displayValue);
  }, [value, step]);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    } else {
      // Reset to current value if invalid
      const displayValue =
        step < 1 ? value.toFixed(1) : Math.round(value).toString();
      setInputValue(displayValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  // Calculate fill percentage
  const fillPercentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Label */}
      <div className="w-16 flex-shrink-0">
        <span className="text-[11px] text-fg-60">{label}</span>
      </div>

      {/* Slider Container with Input-like Background */}
      <div className="flex-1 flex items-center gap-2 bg-bk-40 rounded border border-bd-50 px-2 py-1">
        {/* Slider Track Container */}
        <div className="relative flex-1">
          {/* Background track */}
          <div className="w-full h-1 bg-bk-50 rounded-lg relative">
            {/* Fill track */}
            <div
              className="h-full bg-fg-50 rounded-lg transition-all duration-150"
              style={{ width: `${fillPercentage}%` }}
            />
          </div>

          {/* Slider input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="absolute top-0 w-full h-1 appearance-none cursor-pointer slider-custom bg-transparent"
          />
        </div>

        {/* Value Input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="w-8 text-[11px] text-fg-50 bg-transparent text-right border-none outline-none"
        />
      </div>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 1px solid var(--bd-50);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        .slider-custom::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider-custom::-webkit-slider-thumb:active {
          transform: scale(1.2);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        .slider-custom::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 1px solid var(--bd-50);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        .slider-custom::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider-custom::-moz-range-thumb:active {
          transform: scale(1.2);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
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

        /* Remove focus outline */
        .slider-custom:focus {
          outline: none;
        }

        /* Firefox specific fixes */
        .slider-custom::-moz-focus-outer {
          border: 0;
        }
      `}</style>
    </div>
  );
}
