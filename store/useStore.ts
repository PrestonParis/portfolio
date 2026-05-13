"use client"

import { create } from "zustand"
import type { Project } from "@/data/projects"

export type DemoMode =
  | "runtime"
  | "state"
  | "infrastructure"
  | "codepath"
  | "architecture"

interface Store {
  activeProject: Project | null
  setActiveProject: (project: Project | null) => void
  activeMode: DemoMode
  setActiveMode: (mode: DemoMode) => void
  highlightedFunction: string | null
  setHighlightedFunction: (fn: string | null) => void
}

export const useStore = create<Store>((set) => ({
  activeProject: null,
  setActiveProject: (project) =>
    set({ activeProject: project, activeMode: "runtime", highlightedFunction: null }),
  activeMode: "runtime",
  setActiveMode: (mode) => set({ activeMode: mode }),
  highlightedFunction: null,
  setHighlightedFunction: (fn) => set({ highlightedFunction: fn }),
}))
