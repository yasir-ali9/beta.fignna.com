"use client";

import { useEffect, useRef, useState } from "react";

interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  position?: "top" | "bottom";
  align?: "left" | "right";
}

export function Dropdown({
  items,
  trigger,
  isOpen,
  onToggle,
  onClose,
  position = "bottom",
  align = "left",
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Calculate position classes
  const getPositionClasses = () => {
    const positionClass =
      position === "top" ? "bottom-full mb-1" : "top-full mt-1";
    const alignClass = align === "right" ? "right-0" : "left-0";
    return `${positionClass} ${alignClass}`;
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <div ref={triggerRef} onClick={onToggle}>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 bg-bk-40 border border-bd-50 rounded-lg shadow-lg py-1 px-1 w-max min-w-[120px] ${getPositionClasses()}`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  onClose();
                }
              }}
              disabled={item.disabled}
              className={`
                w-full px-3 py-1.5 text-left flex items-center tracking-tight whitespace-nowrap rounded-md transition-all
                ${
                  item.disabled
                    ? "text-fg-60 cursor-not-allowed"
                    : "text-fg-30 hover:bg-bk-30 hover:text-fg-50 focus:bg-bk-30 focus:text-fg-50 focus:outline-none cursor-pointer"
                }
              `}
              style={{ fontSize: "11px" }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface UseDropdownReturn {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export function useDropdown(): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    toggle,
    close,
  };
}
