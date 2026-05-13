"use client"

import { useEffect, useRef, useState } from "react"
import type { Project } from "@/data/projects"
import { useStore } from "@/store/useStore"

export default function LivePreview({ project }: { project: Project }) {
  const setHighlightedFunction = useStore((s) => s.setHighlightedFunction)
  const setActiveMode = useStore((s) => s.setActiveMode)
  const [loading, setLoading] = useState(true)
  const [errored, setErrored] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handler(e: MessageEvent) {
      if (e.data?.type === "observatory:highlight" && e.data.functionName) {
        setHighlightedFunction(e.data.functionName as string)
        setActiveMode("codepath")
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [setHighlightedFunction, setActiveMode])

  if (!project.url) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 bg-black/20 p-8">
        <div className="text-center">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/15">
            {project.status === "planned" ? "Not yet built" : "Not running"}
          </p>
          <h3 className="text-sm font-medium text-white/40">{project.title}</h3>
          <p className="mt-1 text-xs text-white/20">{project.tagline}</p>
        </div>

        {project.status !== "planned" && (
          <div className="w-full max-w-xs rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-white/20">
              To embed this project
            </p>
            <code className="block font-mono text-[10px] leading-relaxed text-white/35">
              NEXT_PUBLIC_{project.id.toUpperCase()}_URL=
              <br />
              http://localhost:PORT
            </code>
            <p className="mt-3 font-mono text-[9px] text-white/15">
              Add to .env.local and restart
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-black">
      {loading && !errored && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] text-white/20">Connecting…</span>
        </div>
      )}

      {errored && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">
            Could not connect
          </p>
          <code className="font-mono text-[10px] text-white/30">{project.url}</code>
          <button
            onClick={() => {
              setErrored(false)
              setLoading(true)
              if (iframeRef.current) iframeRef.current.src = project.url!
            }}
            className="mt-1 font-mono text-[9px] text-white/20 underline transition-colors hover:text-white/50"
          >
            Retry
          </button>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={project.url}
        title={`${project.title} live preview`}
        className="h-full w-full border-0"
        style={{ opacity: loading || errored ? 0 : 1, transition: "opacity 0.3s" }}
        onLoad={() => setLoading(false)}
        onError={() => { setErrored(true); setLoading(false) }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  )
}
