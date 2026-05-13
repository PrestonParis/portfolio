"use client"

import type { DemoMode } from "@/store/useStore"
import type { Project } from "@/data/projects"

const MODES: { id: DemoMode; label: string }[] = [
  { id: "runtime", label: "Runtime" },
  { id: "state", label: "State" },
  { id: "infrastructure", label: "Infra" },
  { id: "codepath", label: "Code" },
  { id: "architecture", label: "Arch" },
]

export default function ModeSelector({
  active,
  project,
  onChange,
}: {
  active: DemoMode
  project: Project
  onChange: (mode: DemoMode) => void
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-1">
      {MODES.map((mode) => {
        const isActive = mode.id === active
        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            className={`rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-all duration-150 ${
              isActive ? "text-black" : "text-white/30 hover:text-white/60"
            }`}
            style={
              isActive
                ? { background: project.color }
                : undefined
            }
          >
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}
