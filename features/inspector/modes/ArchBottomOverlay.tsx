"use client"

import { AnimatePresence, motion } from "framer-motion"
import type { Project } from "@/data/projects"
import type { CodeSnippet } from "@/data/codeSnippets"
import { TIER_COLOR, type ArchNode, type ArchData } from "@/data/architectures"

export function ArchBottomOverlay({
  arch,
  project,
  selectedNode,
  snippet,
  onClose,
}: {
  arch: ArchData
  project: Project
  selectedNode: ArchNode | undefined
  snippet: CodeSnippet | null
  onClose: () => void
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
      <AnimatePresence mode="wait">
        {selectedNode && snippet ? (
          <motion.div
            key="code"
            className="pointer-events-auto border-t border-white/[0.07] bg-[#06060f]/95 backdrop-blur-xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 38 }}
          >
            <div className="flex items-start gap-5 p-4">
              <div className="flex-1 min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: TIER_COLOR[selectedNode.tier] }}
                  >
                    {selectedNode.tier}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="font-mono text-[10px] text-white/60">{selectedNode.label}</span>
                  <span className="text-white/20">·</span>
                  <span className="font-mono text-[9px]" style={{ color: `${project.color}80` }}>
                    {snippet.label}
                  </span>
                </div>
                <pre className="overflow-x-auto font-mono text-[10px] leading-relaxed text-white/50">
                  {snippet.code}
                </pre>
              </div>

              <div className="w-52 shrink-0">
                <p className="font-mono text-[9px] leading-relaxed text-white/30">
                  {snippet.explanation}
                </p>
              </div>

              <button
                className="shrink-0 font-mono text-[11px] text-white/20 transition-colors hover:text-white/50"
                onClick={onClose}
              >
                ✕
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="desc"
            className="pointer-events-none px-5 py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between gap-6">
              <p className="text-xs leading-relaxed text-white/25">{arch.description}</p>
              <div className="flex shrink-0 flex-wrap justify-end gap-x-3 gap-y-1">
                {Object.entries(TIER_COLOR).map(([tier, color]) => (
                  <div key={tier} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                    <span className="font-mono text-[9px] capitalize text-white/25">{tier}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
