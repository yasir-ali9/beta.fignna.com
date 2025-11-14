"use client";

import React, { useState, useEffect, useRef } from "react";

interface PropertyInputProps {
  label?: string;
  value: number | string;
  onChange: (value: number) => void;
  unit?: "px" | "%" | "°" | "none";
  icon?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  value,
  onChange,
  unit = "none",
  icon,
  min,
  max,
  step = 1,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format display value with unit inline
  const formatDisplayValue = (val: number | string) => {
    const numVal = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(numVal)) return "";

    // Round to max 2 decimal places
    const rounded = Math.round(numVal * 100) / 100;

    if (unit === "°") return `${rounded}°`;
    if (unit === "%") return `${rounded}%`;
    return String(rounded);
  };

  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatDisplayValue(value));
    }
  }, [value, isFocused, unit]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Auto-select all text on focus
    e.target.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Remove unit symbols for parsing
    const cleanValue = inputValue.replace(/[°%]/g, "").trim();
    let numValue = parseFloat(cleanValue);

    if (isNaN(numValue)) {
      numValue = typeof value === "number" ? value : 0;
      setInputValue(formatDisplayValue(numValue));
      return;
    }

    if (min !== undefined && numValue < min) numValue = min;
    if (max !== undefined && numValue > max) numValue = max;

    setInputValue(formatDisplayValue(numValue));
    onChange(numValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const cleanValue = inputValue.replace(/[°%]/g, "").trim();
      const currentValue = parseFloat(cleanValue) || 0;
      const newValue = currentValue + step;
      const clampedValue =
        max !== undefined ? Math.min(newValue, max) : newValue;
      setInputValue(formatDisplayValue(clampedValue));
      onChange(clampedValue);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const cleanValue = inputValue.replace(/[°%]/g, "").trim();
      const currentValue = parseFloat(cleanValue) || 0;
      const newValue = currentValue - step;
      const clampedValue =
        min !== undefined ? Math.max(newValue, min) : newValue;
      setInputValue(formatDisplayValue(clampedValue));
      onChange(clampedValue);
    }
  };

  return (
    <div className="relative">
      <div className="relative flex items-center bg-bk-40 rounded border border-bd-50 hover:border-bd-55 focus-within:border-ac-01 h-[26px]">
        {/* Icon or Label */}
        {(icon || label) && (
          <div className="flex items-center justify-center shrink-0 pl-1.5 pr-1 pointer-events-none">
            {icon ? (
              <span className="text-fg-60 flex items-center justify-center w-[14px]">
                {icon}
              </span>
            ) : (
              <span className="text-fg-60 text-[11px] font-medium">
                {label}
              </span>
            )}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            flex-1 h-full min-w-0
            bg-transparent text-fg-50 
            text-[11px] font-normal
            transition-none!
            focus:outline-none
            ${icon || label ? "pl-0" : "pl-2"}
            pr-2
          `}
        />
      </div>
    </div>
  );
};
