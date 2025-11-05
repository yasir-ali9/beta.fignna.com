import { makeAutoObservable } from "mobx";
import type { EditorEngine } from "../index";

export interface FileInfo {
  name: string;
  content: string;
  type: "svg" | "image" | "other";
  size: number;
  lastModified: Date;
}

export class FilesManager {
  private engine: EditorEngine;

  // File management
  files: Record<string, FileInfo> = {};
  currentFile: FileInfo | null = null;
  recentFiles: string[] = [];

  // Loading states
  isLoading: boolean = false;
  error: string | null = null;

  constructor(engine: EditorEngine) {
    this.engine = engine;
    makeAutoObservable(this);
  }

  // Add file to the project
  addFile(file: File): Promise<FileInfo> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        const fileInfo: FileInfo = {
          name: file.name,
          content,
          type: this.getFileType(file),
          size: file.size,
          lastModified: new Date(file.lastModified),
        };

        this.files[file.name] = fileInfo;
        this.currentFile = fileInfo;

        // Add to recent files
        this.addToRecentFiles(file.name);

        // If it's an SVG, update the current project
        if (fileInfo.type === "svg" && this.engine.projects.currentProject) {
          this.engine.projects.updateProject({
            svgContent: content,
          });
        }

        resolve(fileInfo);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  }

  // Remove file
  removeFile(fileName: string) {
    delete this.files[fileName];

    if (this.currentFile?.name === fileName) {
      this.currentFile = null;
    }

    this.removeFromRecentFiles(fileName);
  }

  // Set current file
  setCurrentFile(fileName: string) {
    const file = this.files[fileName];
    if (file) {
      this.currentFile = file;
      this.addToRecentFiles(fileName);
    }
  }

  // Get file type based on file extension and MIME type
  private getFileType(file: File): "svg" | "image" | "other" {
    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      return "svg";
    } else if (file.type.startsWith("image/")) {
      return "image";
    }
    return "other";
  }

  // Add to recent files
  private addToRecentFiles(fileName: string) {
    this.recentFiles = this.recentFiles.filter((name) => name !== fileName);
    this.recentFiles.unshift(fileName);

    // Keep only last 10 recent files
    if (this.recentFiles.length > 10) {
      this.recentFiles = this.recentFiles.slice(0, 10);
    }
  }

  // Remove from recent files
  private removeFromRecentFiles(fileName: string) {
    this.recentFiles = this.recentFiles.filter((name) => name !== fileName);
  }

  // Get all SVG files
  get svgFiles(): FileInfo[] {
    return Object.values(this.files).filter((file) => file.type === "svg");
  }

  // Get all image files
  get imageFiles(): FileInfo[] {
    return Object.values(this.files).filter((file) => file.type === "image");
  }

  // Get recent file infos
  get recentFileInfos(): FileInfo[] {
    return this.recentFiles.map((name) => this.files[name]).filter(Boolean);
  }

  // Clear all files
  clearFiles() {
    this.files = {};
    this.currentFile = null;
    this.recentFiles = [];
  }

  // Cleanup
  dispose() {
    this.clearFiles();
  }
}
