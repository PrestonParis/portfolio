"use client"

import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"
import { CODE_SNIPPETS } from "@/data/codeSnippets"
import type { Project } from "@/data/projects"

export default function CodePathMode({ project }: { project: Project }) {
  const snippets = CODE_SNIPPETS[project.id] ?? []
  const [active, setActive] = useState(0)
  const [html, setHtml] = useState("")

  useEffect(() => {
    const snippet = snippets[active]
    if (!snippet) return
    codeToHtml(snippet.code, {
      lang: snippet.language as "typescript" | "java" | "rust" | "python",
      theme: "github-dark-dimmed",
      structure: "inline",
    }).then(setHtml)
  }, [active, project.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const snippet = snippets[active]

  if (!snippet) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-xs text-white/20">No snippets for this project yet.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      {/* Snippet selector */}
      {snippets.length > 1 && (
        <div className="flex gap-2 shrink-0">
          {snippets.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                i === active
                  ? "text-white"
                  : "text-white/25 hover:text-white/50"
              }`}
              style={
                i === active
                  ? { color: project.color }
                  : undefined
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Code block */}
      <div className="flex-1 overflow-auto rounded-lg bg-[#1a1b26] p-4">
        {html ? (
          <div
            className="font-mono text-[13px] leading-6 [&_pre]:!bg-transparent [&_pre]:!p-0"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="h-full animate-pulse rounded bg-white/5" />
        )}
      </div>

      {/* Explanation */}
      <div
        className="shrink-0 rounded-lg border p-3"
        style={{ borderColor: `${project.color}30` }}
      >
        <p className="mb-1 font-mono text-[9px] uppercase tracking-widest" style={{ color: project.color }}>
          Why
        </p>
        <p className="text-xs leading-relaxed text-white/55">
          {snippet.explanation}
        </p>
      </div>
    </div>
  )
}
