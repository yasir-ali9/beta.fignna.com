import { makeAutoObservable } from "mobx";
import type { EditorEngine } from "../index";

export interface Project {
  id: string;
  name: string;
  description?: string;
  svgContent?: string;
  geometry: {
    depth: number;
    bevel: number;
    scale: number;
    position: { x: number; y: number; z: number };
  };
  material: {
    type: string;
    color: string;
    opacity: number;
    roughness: number;
    metalness: number;
  };
  environment: {
    lighting: string;
    intensity: number;
    shadows: boolean;
    shadowSoftness: number;
  };
  background: {
    type: string;
    color: string;
    opacity: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export class ProjectsManager {
  private engine: EditorEngine;

  // Project list and current project
  projects: Project[] = [];
  currentProject: Project | null = null;

  // Loading states
  isLoading: boolean = false;
  isSaving: boolean = false;
  isCreating: boolean = false;
  error: string | null = null;

  constructor(engine: EditorEngine) {
    this.engine = engine;
    makeAutoObservable(this);
  }

  // Create a new project with default settings
  createProject(data: CreateProjectRequest): Project {
    const newProject: Project = {
      id: this.generateProjectId(),
      name: data.name,
      description: data.description,
      geometry: {
        depth: 10,
        bevel: 2,
        scale: 1,
        position: { x: 0, y: 0, z: 0 },
      },
      material: {
        type: "Standard",
        color: "#ffffff",
        opacity: 1,
        roughness: 0.5,
        metalness: 0,
      },
      environment: {
        lighting: "Studio",
        intensity: 1,
        shadows: true,
        shadowSoftness: 0.3,
      },
      background: {
        type: "Solid Color",
        color: "#1a1a1a",
        opacity: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects.unshift(newProject);
    this.currentProject = newProject;
    this.engine.state.setProjectName(newProject.name);

    // Store in localStorage for persistence
    this.saveToLocalStorage();

    return newProject;
  }

  // Load project by ID
  loadProject(projectId: string) {
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      this.currentProject = project;
      this.engine.state.setProjectName(project.name);
    } else {
      // Try to load from localStorage
      this.loadFromLocalStorage();
      const foundProject = this.projects.find((p) => p.id === projectId);
      if (foundProject) {
        this.currentProject = foundProject;
        this.engine.state.setProjectName(foundProject.name);
      }
    }
  }

  // Update current project
  updateProject(updates: Partial<Project>) {
    if (!this.currentProject) return;

    this.currentProject = {
      ...this.currentProject,
      ...updates,
      updatedAt: new Date(),
    };

    // Update in projects list
    const index = this.projects.findIndex(
      (p) => p.id === this.currentProject!.id
    );
    if (index !== -1) {
      this.projects[index] = this.currentProject;
    }

    this.saveToLocalStorage();
  }

  // Generate a random project ID (10 characters, numbers + uppercase letters)
  private generateProjectId(): string {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Save to localStorage
  private saveToLocalStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("vecto3d_projects", JSON.stringify(this.projects));
    }
  }

  // Load from localStorage
  private loadFromLocalStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vecto3d_projects");
      if (stored) {
        try {
          const projects = JSON.parse(stored);
          this.projects = projects.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          }));
        } catch (error) {
          console.error("Failed to load projects from localStorage:", error);
        }
      }
    }
  }

  // Initialize - load projects from localStorage
  initialize() {
    this.loadFromLocalStorage();
  }

  // Cleanup
  dispose() {
    // No cleanup needed for localStorage-based storage
  }
}
