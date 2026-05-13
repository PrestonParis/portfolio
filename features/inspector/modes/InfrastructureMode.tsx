"use client"

import type { Project } from "@/data/projects"
import { TRACES, SERVICE_COLORS } from "@/data/traceData"

export default function InfrastructureMode({ project }: { project: Project }) {
  const trace = TRACES[project.id]
  if (!trace) return null

  const { spans, totalMs, caption } = trace
  const BAR_H = 20
  const LABEL_W = 160
  const CHART_W = 200

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <div className="shrink-0 flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">
          Request Trace
        </p>
        <span className="font-mono text-[10px] text-white/30">{totalMs}ms</span>
      </div>

      <div className="flex-1 overflow-auto rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
        <div className="space-y-1.5">
          {spans.map((span) => {
            const left = (span.start / totalMs) * CHART_W
            const width = Math.max((span.duration / totalMs) * CHART_W, 2)
            const color = SERVICE_COLORS[span.service] ?? project.color

            return (
              <div key={span.id} className="flex items-center gap-2">
                <div
                  className="shrink-0 truncate font-mono text-[10px] text-white/50"
                  style={{ width: LABEL_W, paddingLeft: span.depth * 12 }}
                >
                  {span.label}
                </div>
                <div className="relative" style={{ width: CHART_W, height: BAR_H }}>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 rounded-sm"
                    style={{
                      left,
                      width,
                      height: 12,
                      background: `${color}50`,
                      border: `1px solid ${color}80`,
                    }}
                  >
                    <div
                      className="h-full rounded-sm"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${color}60 50%, transparent 100%)`,
                        backgroundSize: "200% 100%",
                        animation: `pulse 2s ease-in-out ${span.start / 500}s infinite`,
                      }}
                    />
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[9px]" style={{ color: `${color}80` }}>
                  {span.duration}ms
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <p className="shrink-0 text-xs leading-relaxed text-white/40">{caption}</p>
    </div>
  )
}
