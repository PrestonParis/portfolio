"use client"

import type { Project } from "@/data/projects"
import { STATE_GRAPHS } from "@/data/stateGraphs"
import { StateGraph } from "@/features/inspector/modes/StateGraph"

export default function StateMode({ project }: { project: Project }) {
  const graph = STATE_GRAPHS[project.id]
  if (!graph) return null

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <p className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-white/25">
        State Transition Graph
      </p>

      <div className="flex-1 overflow-hidden rounded-lg bg-white/[0.02] border border-white/[0.06]">
        <StateGraph nodes={graph.nodes} edges={graph.edges} color={project.color} />
      </div>

      <p className="shrink-0 text-xs leading-relaxed text-white/40">{graph.caption}</p>
    </div>
  )
}
