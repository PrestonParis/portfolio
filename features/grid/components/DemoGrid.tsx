"use client"

import { PROJECTS } from "@/data/projects"
import Image from "next/image"
import ProjectTile from "./ProjectTile"

const GRID_AREAS: Record<string, string> = {
  webwidgets: "ww",
  everychurch: "ec",
  ductmap: "dm",
  geography: "ge",
  worldview: "wv",
}

export default function DemoGrid() {
  return (
    <div
      className="h-full w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gridTemplateAreas: `"ww ww ec" "ww ww wv" "ge dm ab"`,
        gap: 8,
      }}
    >
      {PROJECTS.map((project) => (
        <div
          key={project.id}
          style={{ gridArea: GRID_AREAS[project.id] }}
        >
          <ProjectTile project={project} />
        </div>
      ))}

      {/* About tile */}
      <div style={{ gridArea: "ab" }}>
        <AboutTile />
      </div>
    </div>
  )
}

function AboutTile() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/[0.07] bg-black/50 p-5 backdrop-blur-sm">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
        }}
      />

      <div>
        <div className="mb-3 flex items-center gap-3">
          <Image
            src="/Linkedinpfp.jpeg"
            alt="Preston Paris"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
          />
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
            Engineer
          </p>
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-white leading-tight">
          Preston Paris
        </h2>
        <p className="mt-1 font-mono text-[10px] text-white/25">
          B.S. CS · Georgia State · &rsquo;27
        </p>
        <p className="mt-3 text-xs leading-relaxed text-white/40">
          Full-stack platforms, native computation, and data infrastructure.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {["Next.js", "Rust", "Python", "Spring Boot", "AWS"].map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/[0.07] px-1.5 py-0.5 font-mono text-[9px] text-white/35"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <a
            href="https://github.com/PrestonParis/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-white/25 transition-colors hover:text-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            GitHub
          </a>
          <span className="text-white/10">·</span>
          <a
            href="https://www.linkedin.com/in/preston-paris-gsu/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-white/25 transition-colors hover:text-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}
