"use client"

import { useState, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import type { Project } from "@/data/projects"
import { CODE_SNIPPETS } from "@/data/codeSnippets"
import { ARCHITECTURES } from "@/data/architectures"
import { ArchScene } from "@/features/inspector/modes/ArchScene"
import { ArchBottomOverlay } from "@/features/inspector/modes/ArchBottomOverlay"

export default function ArchitectureMode({ project }: { project: Project }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const arch = ARCHITECTURES[project.id]
  const selectedNode = arch?.nodes.find((n) => n.id === selectedNodeId)

  const snippet = useMemo(() => {
    const snippets = CODE_SNIPPETS[project.id] ?? []
    if (!selectedNode || snippets.length === 0) return null
    const byLabel = snippets.find((s) =>
      s.label.toLowerCase().includes(selectedNode.label.toLowerCase().split(" ")[0])
    )
    if (byLabel) return byLabel
    const tierIndex: Record<string, number> = { data: snippets.length - 1, compute: 1 }
    return snippets[tierIndex[selectedNode.tier] ?? 0] ?? null
  }, [selectedNode, project.id])

  if (!arch) return null

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 8], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ArchScene
          arch={arch}
          project={project}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
      </Canvas>

      {!selectedNodeId && (
        <div className="pointer-events-none absolute top-4 left-1/2 z-10 -translate-x-1/2">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/15">
            click a node to inspect
          </p>
        </div>
      )}

      <ArchBottomOverlay
        arch={arch}
        project={project}
        selectedNode={selectedNode}
        snippet={snippet}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  )
}
