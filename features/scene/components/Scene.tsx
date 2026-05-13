"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"
import { PROJECTS } from "@/data/projects"

// R3F uses THREE.Clock internally, which Three.js r168+ marks deprecated.
// Suppress until @react-three/fiber migrates to THREE.Timer.
if (typeof window !== "undefined") {
  const _warn = console.warn.bind(console)
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return
    _warn(...args)
  }
}

const ORB_POSITIONS: [number, number, number][] = [
  [-5.5, 0.8, -5],
  [-2, -1.2, -7],
  [0.8, 1.2, -6],
  [3.2, -0.8, -5],
  [5.8, 0.5, -7],
]

function Orb({
  position,
  color,
  index,
}: {
  position: [number, number, number]
  color: string
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.4 + index * 1.3) * 0.3
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  )
}

function BackgroundScene() {
  return (
    <>
      <color attach="background" args={["#03040c"]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 6, 0]} intensity={0.3} color="#5577ff" />
      <Stars
        radius={100}
        depth={60}
        count={4000}
        factor={4}
        saturation={0.2}
        fade
        speed={0.3}
      />
      {PROJECTS.map((project, i) => (
        <Orb
          key={project.id}
          position={ORB_POSITIONS[i]}
          color={project.color}
          index={i}
        />
      ))}
    </>
  )
}

export default function Scene() {
  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 10], fov: 55 }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  )
}
