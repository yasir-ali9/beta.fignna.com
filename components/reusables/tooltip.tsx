"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

export type TooltipPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = "top",
  delay = 500,
  disabled = false,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const updateTooltipPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.left,
      });
    }
  };

  const handleMouseEnter = () => {
    if (disabled) return;

    updateTooltipPosition();
    setIsVisible(true);
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setShowTooltip(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      updateTooltipPosition();
      const handleScroll = () => updateTooltipPosition();
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }
  }, [isVisible]);

  const getTooltipStyle = () => {
    if (!containerRef.current) return {};

    const rect = containerRef.current.getBoundingClientRect();
    const tooltipOffset = 6;
    const padding = 8; // Padding from viewport edges

    // Estimate tooltip dimensions (will be adjusted by browser)
    const estimatedTooltipWidth = content.length * 7; // Rough estimate
    const estimatedTooltipHeight = 32;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalPosition: TooltipPosition = position;

    // Smart positioning based on available space
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;

    // Auto-adjust position if tooltip would go off-screen
    if (
      position === "top" &&
      spaceAbove < estimatedTooltipHeight + tooltipOffset + padding
    ) {
      finalPosition = "bottom" as TooltipPosition;
    } else if (
      position === "bottom" &&
      spaceBelow < estimatedTooltipHeight + tooltipOffset + padding
    ) {
      finalPosition = "top" as TooltipPosition;
    } else if (
      position === "left" &&
      spaceLeft < estimatedTooltipWidth + tooltipOffset + padding
    ) {
      finalPosition = "right" as TooltipPosition;
    } else if (
      position === "right" &&
      spaceRight < estimatedTooltipWidth + tooltipOffset + padding
    ) {
      finalPosition = "left" as TooltipPosition;
    }

    const positions: Record<
      TooltipPosition,
      { top: number; left: number; transform: string }
    > = {
      top: {
        top: rect.top - tooltipOffset,
        left: Math.max(
          padding,
          Math.min(rect.left + rect.width / 2, viewportWidth - padding)
        ),
        transform: "translate(-50%, -100%)",
      },
      bottom: {
        top: rect.bottom + tooltipOffset,
        left: Math.max(
          padding,
          Math.min(rect.left + rect.width / 2, viewportWidth - padding)
        ),
        transform: "translate(-50%, 0)",
      },
      left: {
        top: rect.top + rect.height / 2,
        left: rect.left - tooltipOffset,
        transform: "translate(-100%, -50%)",
      },
      right: {
        top: rect.top + rect.height / 2,
        left: rect.right + tooltipOffset,
        transform: "translate(0, -50%)",
      },
      "top-left": {
        top: rect.top - tooltipOffset,
        left: rect.right,
        transform: "translate(0, -100%)",
      },
      "top-right": {
        top: rect.top - tooltipOffset,
        left: rect.left,
        transform: "translate(0, -100%)",
      },
      "bottom-left": {
        top: rect.bottom + tooltipOffset,
        left: rect.right,
        transform: "translate(0, 0)",
      },
      "bottom-right": {
        top: rect.bottom + tooltipOffset,
        left: rect.left,
        transform: "translate(0, 0)",
      },
    };

    const style = positions[finalPosition];

    // Additional horizontal constraint for centered tooltips
    if (finalPosition === "top" || finalPosition === "bottom") {
      const halfWidth = estimatedTooltipWidth / 2;
      if (style.left - halfWidth < padding) {
        style.left = halfWidth + padding;
      } else if (style.left + halfWidth > viewportWidth - padding) {
        style.left = viewportWidth - halfWidth - padding;
      }
    }

    return style;
  };

  const getTooltipClasses = () => {
    return `
      fixed z-[9999] px-2 py-1 text-[11px] font-normal text-fg-30 bg-bk-30 border border-bd-50 
      rounded-md shadow-sm backdrop-blur-sm pointer-events-none transition-opacity duration-200
      whitespace-nowrap ${showTooltip ? "opacity-100" : "opacity-0"}
    `;
  };

  if (disabled || !content) {
    return <>{children}</>;
  }

  const tooltipContent = isVisible && mounted && (
    <div className={getTooltipClasses()} style={getTooltipStyle()}>
      {content}
    </div>
  );

  return (
    <>
      <div
        ref={containerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {mounted && createPortal(tooltipContent, document.body)}
    </>
  );
}
