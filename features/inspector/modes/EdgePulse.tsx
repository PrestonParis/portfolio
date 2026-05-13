"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function EdgePulse({
  from,
  to,
  color,
  speed,
  delay,
}: {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  speed: number
  delay: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(delay % 1)
  const fromVec = useRef(new THREE.Vector3(...from))
  const toVec = useRef(new THREE.Vector3(...to))

  useFrame((_, dt) => {
    t.current = (t.current + dt * speed) % 1
    ref.current?.position.lerpVectors(fromVec.current, toVec.current, t.current)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3.5}
        toneMapped={false}
      />
    </mesh>
  )
}
