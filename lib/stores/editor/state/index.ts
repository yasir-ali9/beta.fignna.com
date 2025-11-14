import { makeAutoObservable } from "mobx";

export enum CanvasTool {
  MOVE = "MOVE",
  HAND = "HAND",
  FRAME = "FRAME",
  THREE_D = "THREE_D",
  CODE = "CODE",
  IMAGE = "IMAGE",
  COMMENT = "COMMENT",
}

export class StateManager {
  // Canvas tool states
  canvasTool: CanvasTool = CanvasTool.MOVE; // Default to move tool
  isSpacePressed: boolean = false;

  // Canvas interaction states
  canvasScrolling: boolean = false;
  canvasPanning: boolean = false;

  // UI states
  isLoading: boolean = false;
  isChatPanelOpen: boolean = false;
  isPromptFloating: boolean = false;

  // Project states
  projectName: string = "Untitled Project";
  isEditingProjectName: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Canvas state management
  setCanvasScrolling(scrolling: boolean) {
    this.canvasScrolling = scrolling;
  }

  setCanvasPanning(panning: boolean) {
    this.canvasPanning = panning;
  }

  // Tool management
  setCanvasTool(tool: CanvasTool) {
    this.canvasTool = tool;
  }

  setSpacePressed(pressed: boolean) {
    this.isSpacePressed = pressed;
  }

  // Loading state
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  // Chat panel management
  setChatPanelOpen(open: boolean) {
    this.isChatPanelOpen = open;
  }

  toggleChatPanel() {
    this.isChatPanelOpen = !this.isChatPanelOpen;
  }

  setPromptFloating(floating: boolean) {
    this.isPromptFloating = floating;
  }

  togglePromptLocation() {
    this.isPromptFloating = !this.isPromptFloating;
  }

  // Project management
  setProjectName(name: string) {
    this.projectName = name.trim() || "Untitled Project";
  }

  setEditingProjectName(editing: boolean) {
    this.isEditingProjectName = editing;
  }

  // Tool state getters
  get activeCanvasTool(): CanvasTool {
    // Space key overrides current tool to hand
    return this.isSpacePressed ? CanvasTool.HAND : this.canvasTool;
  }

  get isHandToolActive(): boolean {
    return this.activeCanvasTool === CanvasTool.HAND;
  }

  get isMoveToolActive(): boolean {
    return this.activeCanvasTool === CanvasTool.MOVE;
  }

  get isFrameToolActive(): boolean {
    return this.activeCanvasTool === CanvasTool.FRAME;
  }

  get isThreeDToolActive(): boolean {
    return this.activeCanvasTool === CanvasTool.THREE_D;
  }

  get isImageToolActive(): boolean {
    return this.activeCanvasTool === CanvasTool.IMAGE;
  }

  get isCommentToolActive(): boolean {
    return this.activeCanvasTool === CanvasTool.COMMENT;
  }

  get isCodeToolActive(): boolean {
    return this.activeCanvasTool === CanvasTool.CODE;
  }
}
