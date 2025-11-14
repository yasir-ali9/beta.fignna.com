// Favicon component for theme-aware favicon management
"use client";

import { useEffect } from "react";
import { initializeFavicon } from "@/lib/favicon";

// Component to handle favicon initialization and theme changes
export const FaviconManager = () => {
  useEffect(() => {
    // Initialize favicon with theme detection
    const cleanup = initializeFavicon();

    // Cleanup on unmount
    return cleanup;
  }, []);

  // This component doesn't render anything
  return null;
};
