// Favicon utility for theme-aware favicon management using static files
"use client";

// Update favicon based on system theme using static SVG files
export const updateFavicon = () => {
  if (typeof window === "undefined") return;

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const faviconPath = isDark
    ? "/icons/favicon-dark.svg"
    : "/icons/favicon-light.svg";

  // Find existing favicon or create new one
  let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/svg+xml";
    document.head.appendChild(favicon);
  }

  favicon.href = faviconPath;
};

// Initialize favicon with theme detection
export const initializeFavicon = () => {
  if (typeof window === "undefined") return;

  // Set initial favicon
  updateFavicon();

  // Listen for theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", updateFavicon);

  // Cleanup function
  return () => {
    mediaQuery.removeEventListener("change", updateFavicon);
  };
};
