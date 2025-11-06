// Utility functions for 3D operations

// Convert display rotation value (1-10) to actual rotation speed (2.5-7.5)
export function displayToActualRotation(displayValue: number): number {
  return displayValue + 1.5;
}

// Convert actual rotation speed (2.5-7.5) to display value (1-10)
export function actualToDisplayRotation(actualValue: number): number {
  return actualValue - 1.5;
}

// Validate SVG content
export function isValidSVG(content: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "image/svg+xml");
    const parserError = doc.querySelector("parsererror");
    return !parserError && !!doc.querySelector("svg");
  } catch {
    return false;
  }
}

// Clean SVG content (remove special characters that cause issues)
export function cleanSVGContent(svgData: string): string {
  return svgData
    .replace(/[™®©]/g, "") // Remove trademark, registered, and copyright symbols
    .replace(/&trade;|&reg;|&copy;/g, ""); // Remove HTML entities
}

// Get file extension
export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

// Generate download filename
export function generateDownloadFilename(
  originalName: string,
  format: string
): string {
  const baseName = originalName.replace(/\.(svg|png|jpg|jpeg)$/i, "");
  return `${baseName}.${format}`;
}
