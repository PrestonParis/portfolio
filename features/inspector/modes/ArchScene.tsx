"use client"

import { useMemo } from "react"
import { Line, OrbitControls } from "@react-three/drei"
import type { Project } from "@/data/projects"
import { TIER_Z, TIER_COLOR, type ArchData } from "@/data/architectures"
import { NodeSphere } from "./NodeSphere"
import { EdgePulse } from "./EdgePulse"

export function nodePos(node: { x: number; y: number; tier: string }): [number, number, number] {
  return [
    ((node.x - 190) / 190) * 3.5,
    -((node.y - 155) / 155) * 2.5,
    TIER_Z[node.tier] ?? 0,
  ]
}

export function ArchScene({
  arch,
  project,
  selectedNodeId,
  onSelectNode,
}: {
  arch: ArchData
  project: Project
  selectedNodeId: string | null
  onSelectNode: (id: string | null) => void
}) {
  const positions = useMemo(() => {
    const map = new Map<string, [number, number, number]>()
    for (const node of arch.nodes) {
      map.set(node.id, nodePos(node))
    }
    return map
  }, [arch])

  return (
    <>
      <color attach="background" args={["#03040a"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 4, 4]} intensity={0.9} color="#6677ff" />
      <pointLight position={[2, -3, -4]} intensity={0.3} color="#aabbff" />
      <OrbitControls
        makeDefault
        dampingFactor={0.08}
        rotateSpeed={0.5}
        minDistance={3}
        maxDistance={14}
      />

      {arch.edges.map((edge, i) => {
        const from = positions.get(edge.from)!
        const to = positions.get(edge.to)!
        return (
          <group key={`e-${i}`}>
            <Line
              points={[from, to]}
              color="#ffffff"
              lineWidth={0.8}
              transparent
              opacity={0.12}
            />
            {edge.pulse && (
              <EdgePulse
                from={from}
                to={to}
                color={project.color}
                speed={0.28 + (i % 4) * 0.07}
                delay={i * 0.19}
              />
            )}
          </group>
        )
      })}

      {arch.nodes.map((node) => {
        const pos = positions.get(node.id)!
        const color = TIER_COLOR[node.tier]
        return (
          <NodeSphere
            key={node.id}
            position={pos}
            color={color}
            label={node.label}
            isSelected={selectedNodeId === node.id}
            onClick={() => onSelectNode(selectedNodeId === node.id ? null : node.id)}
          />
        )
      })}
    </>
  )
}
