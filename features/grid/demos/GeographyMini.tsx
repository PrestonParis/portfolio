export function GeographyMini() {
  const dots = Array.from({ length: 80 }, (_, i) => ({
    x: 8 + (i % 16) * 14 + (Math.floor(i / 16) % 2 === 0 ? 0 : 7),
    y: 15 + Math.floor(i / 16) * 20,
    active: [3, 4, 5, 18, 19, 20, 21, 35, 36, 37, 52, 53, 66, 67].includes(i),
    delay: (i % 7) * 0.15,
  }))

  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 240 120" className="h-full w-auto max-w-full">
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.active ? 2.5 : 1.5}
            fill={dot.active ? "#06b6d4" : "rgba(255,255,255,0.1)"}
            opacity={dot.active ? undefined : 0.5}
          >
            {dot.active && (
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2.4s"
                begin={`${dot.delay}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
      </svg>
    </div>
  )
}
