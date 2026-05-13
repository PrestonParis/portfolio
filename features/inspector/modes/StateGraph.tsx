import type { StateNode, StateEdge } from "@/data/stateGraphs"

function getPos(nodes: StateNode[], id: string) {
  return nodes.find((n) => n.id === id) ?? { x: 0, y: 0 }
}

export function StateGraph({
  nodes,
  edges,
  color,
}: {
  nodes: StateNode[]
  edges: StateEdge[]
  color: string
}) {
  const W = 380
  const H = 360

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      <defs>
        <marker id="state-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="rgba(255,255,255,0.2)" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edges.map((edge, i) => {
        const a = getPos(nodes, edge.from)
        const b = getPos(nodes, edge.to)
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        return (
          <g key={i}>
            <line
              x1={a.x} y1={a.y + 18} x2={b.x} y2={b.y - 18}
              stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"
              markerEnd="url(#state-arrow)"
            />
            <text x={mx + 8} y={my} fill="rgba(255,255,255,0.25)" fontSize="8"
              textAnchor="start" dominantBaseline="middle">
              {edge.label}
            </text>
            <circle r="2.5" fill={color} filter="url(#glow)" opacity="0.9">
              <animateMotion
                dur="2.4s" begin={`${edge.delay}s`} repeatCount="indefinite"
                path={`M${a.x},${a.y + 18} L${b.x},${b.y - 18}`}
              />
            </circle>
          </g>
        )
      })}

      {nodes.map((node) => (
        <g key={node.id}>
          <rect
            x={node.x - 46} y={node.y - 14} width={92} height={28} rx={6}
            fill={`${color}12`} stroke={`${color}35`} strokeWidth="1"
          />
          <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.75)" fontSize="9">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
