import { makeAutoObservable } from "mobx";
import { CanvasManager } from "./canvas";
import { StateManager } from "./state";
import { ProjectsManager } from "./projects";
import { FilesManager } from "./files";
import { NodesManager } from "./nodes";
import { ThreeDManager } from "./threed";

export class EditorEngine {
  canvas: CanvasManager;
  state: StateManager;
  projects: ProjectsManager;
  files: FilesManager;
  nodes: NodesManager;
  threed: ThreeDManager;

  constructor() {
    this.canvas = new CanvasManager();
    this.state = new StateManager();
    this.projects = new ProjectsManager(this);
    this.files = new FilesManager(this);
    this.nodes = new NodesManager();
    this.threed = new ThreeDManager();

    makeAutoObservable(this);
  }

  clearUI() {
    // Clear any UI selections or states
  }

  dispose() {
    // Cleanup resources when editor is unmounted
    this.projects.dispose();
    this.files.dispose();
    this.threed.clearAllStates();
  }
}
