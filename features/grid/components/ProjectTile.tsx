"use client"

import { motion } from "framer-motion"
import type { Project } from "@/data/projects"
import { useStore } from "@/store/useStore"
import { WebWidgetsMini } from "@/features/grid/demos/WebWidgetsMini"
import { EveryChurchMini } from "@/features/grid/demos/EveryChurchMini"
import { DuctmapMini } from "@/features/grid/demos/DuctmapMini"
import { GeographyMini } from "@/features/grid/demos/GeographyMini"
import { WorldviewMini } from "@/features/grid/demos/WorldviewMini"

function MiniDemo({ project }: { project: Project }) {
  switch (project.id) {
    case "webwidgets": return <WebWidgetsMini />
    case "everychurch": return <EveryChurchMini />
    case "ductmap": return <DuctmapMini />
    case "geography": return <GeographyMini />
    case "worldview": return <WorldviewMini />
    default: return null
  }
}

const STATUS_INDICATOR: Record<string, string> = {
  live: "● Live",
  "in-progress": "◐ In Progress",
  planned: "○ Planned",
}

export default function ProjectTile({ project }: { project: Project }) {
  const activeProject = useStore((s) => s.activeProject)
  const setActiveProject = useStore((s) => s.setActiveProject)
  const isActive = activeProject?.id === project.id

  return (
    <motion.div
      layoutId={`tile-${project.id}`}
      onClick={() => !isActive && setActiveProject(project)}
      className={`relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors duration-200 ${
        isActive
          ? "invisible pointer-events-none border-white/[0.08]"
          : "border-white/[0.07] bg-black/50 hover:border-white/15 hover:bg-white/[0.03]"
      } backdrop-blur-sm`}
      whileHover={isActive ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
      />

      <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-white">{project.title}</h3>
          <p className="font-mono text-[10px] text-white/35">{project.tagline}</p>
        </div>
        <span
          className="font-mono text-[9px] uppercase tracking-widest"
          style={{ color: `${project.color}80` }}
        >
          {STATUS_INDICATOR[project.status]}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <MiniDemo project={project} />
      </div>

      <div className="shrink-0 border-t border-white/[0.04] px-4 py-2">
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">
          {project.focus}
        </p>
      </div>
    </motion.div>
  )
}
