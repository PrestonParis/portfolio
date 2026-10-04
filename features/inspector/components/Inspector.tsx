"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useStore } from "@/store/useStore"
import ModeSelector from "./ModeSelector"
import LivePreview from "./LivePreview"
import ArchitectureMode from "../modes/ArchitectureMode"
import { RightPanel } from "./RightPanel"
import type { Project } from "@/data/projects"

function ProjectLinks({ project }: { project: Project }) {
  return (
    <>
      <a
        href={project.repositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden rounded-md border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white/35 transition-colors hover:border-white/20 hover:text-white/70 sm:block"
      >
        GitHub
      </a>
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-md px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-black sm:block"
          style={{ background: project.color }}
        >
          Open live
        </a>
      )}
    </>
  )
}

export default function Inspector() {
  const activeProject = useStore((s) => s.activeProject)
  const setActiveProject = useStore((s) => s.setActiveProject)
  const activeMode = useStore((s) => s.activeMode)
  const setActiveMode = useStore((s) => s.setActiveMode)
  const isArchMode = activeMode === "architecture"

  return (
    <AnimatePresence>
      {activeProject && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveProject(null)}
          />

          <motion.div
            layoutId={`tile-${activeProject.id}`}
            className="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#080810]/95 backdrop-blur-2xl"
            style={{ inset: "3%", maxHeight: "94vh" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 10%, ${activeProject.color} 50%, transparent 90%)`,
              }}
            />

            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                    {activeProject.id}
                  </p>
                  <h2 className="text-sm font-semibold leading-tight text-white">
                    {activeProject.title}
                  </h2>
                </div>
                <span className="hidden h-4 w-px bg-white/10 sm:block" />
                <p
                  className="hidden text-xs sm:block"
                  style={{ color: `${activeProject.color}cc` }}
                >
                  {activeProject.focus}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ProjectLinks project={activeProject} />
                <ModeSelector
                  active={activeMode}
                  project={activeProject}
                  onChange={setActiveMode}
                />
                <button
                  onClick={() => setActiveProject(null)}
                  className="ml-1 text-xs text-white/20 transition-colors hover:text-white/60"
                  aria-label="Close inspector"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              {isArchMode ? (
                <ArchitectureMode project={activeProject} />
              ) : (
                <div className="flex h-full">
                  <div className="min-w-0 flex-[7] border-r border-white/[0.04]">
                    <LivePreview key={activeProject.id} project={activeProject} />
                  </div>

                  <div className="min-w-0 flex-[3] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeMode}
                        className="h-full overflow-auto"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        <RightPanel />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
