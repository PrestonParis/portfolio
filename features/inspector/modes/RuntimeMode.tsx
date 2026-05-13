"use client"

import type { Project } from "@/data/projects"
import { RUNTIME_CONTENT, STATUS_BADGE } from "@/data/runtimeContent"

export default function RuntimeMode({ project }: { project: Project }) {
  const content = RUNTIME_CONTENT[project.id]
  if (!content) return null

  const badge = STATUS_BADGE[project.status]

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <div className="shrink-0 flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">
          Product Overview
        </p>
        <span className={`font-mono text-[10px] ${badge.style}`}>{badge.label}</span>
      </div>

      <div className="flex-1 overflow-auto rounded-lg bg-white/[0.02] border border-white/[0.06] p-4">
        <p className="mb-4 text-sm leading-relaxed text-white/60">{project.description}</p>

        <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-white/25">
          Key Interactions
        </p>
        <ul className="space-y-2">
          {content.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: project.color }}
              />
              <span className="text-xs leading-relaxed text-white/50">{feature}</span>
            </li>
          ))}
        </ul>

        <div
          className="mt-5 rounded-lg border p-3"
          style={{ borderColor: `${project.color}25` }}
        >
          <p className="text-xs leading-relaxed text-white/35 italic">{content.note}</p>
        </div>
      </div>

      <div className="shrink-0">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-white/25">Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/[0.08] px-2 py-0.5 font-mono text-[10px] text-white/40"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
