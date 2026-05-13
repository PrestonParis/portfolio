export function DuctmapMini() {
  const nodes = [
    { id: "a", x: 120, y: 30, label: "AHU" },
    { id: "b", x: 120, y: 90 },
    { id: "c", x: 60, y: 155 },
    { id: "d", x: 180, y: 155 },
    { id: "e", x: 30, y: 210, label: "T1" },
    { id: "f", x: 90, y: 210, label: "T2" },
    { id: "g", x: 150, y: 210, label: "T3" },
    { id: "h", x: 210, y: 210, label: "T4" },
  ]
  const edges = [
    ["a", "b"], ["b", "c"], ["b", "d"],
    ["c", "e"], ["c", "f"], ["d", "g"], ["d", "h"],
  ]

  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 240 240" className="h-full max-h-full w-auto">
        <defs>
          <filter id="dm-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {edges.map(([from, to], i) => {
          const a = nodes.find(n => n.id === from)!
          const b = nodes.find(n => n.id === to)!
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(251,191,36,0.25)" strokeWidth="3" />
              <circle r="3" fill="#fbbf24" opacity="0.9" filter="url(#dm-glow)">
                <animateMotion
                  dur={`${1.6 + i * 0.2}s`}
                  repeatCount="indefinite"
                  path={`M${a.x},${a.y} L${b.x},${b.y}`}
                />
              </circle>
            </g>
          )
        })}

        {nodes.map(node => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={node.label ? 14 : 8}
              fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" />
            {node.label && (
              <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="var(--font-geist-mono)">
                {node.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
