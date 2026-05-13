"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"

export function NodeSphere({
  position,
  color,
  label,
  isSelected,
  onClick,
}: {
  position: [number, number, number]
  color: string
  label: string
  isSelected: boolean
  onClick: () => void
}) {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const scale = useRef(1)

  useFrame((_, dt) => {
    if (!ref.current) return
    const target = isSelected ? 1.35 : hovered ? 1.15 : 1
    scale.current += (target - scale.current) * (1 - Math.pow(0.001, dt))
    ref.current.scale.setScalar(scale.current)
  })

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isSelected ? 0.7 : hovered ? 0.4 : 0.15}
        roughness={0.45}
        metalness={0.15}
      />
      <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "var(--font-geist-mono, monospace)",
            fontSize: 9,
            color: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
            whiteSpace: "nowrap",
            marginTop: 32,
            textShadow: "0 1px 6px rgba(0,0,0,1)",
            transition: "color 0.2s",
          }}
        >
          {label}
        </div>
      </Html>
    </mesh>
  )
}
