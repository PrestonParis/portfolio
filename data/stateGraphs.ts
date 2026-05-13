export interface StateNode {
  id: string
  label: string
  x: number
  y: number
}

export interface StateEdge {
  from: string
  to: string
  label: string
  delay: number
}

export interface StateGraph {
  nodes: StateNode[]
  edges: StateEdge[]
  caption: string
}

export const STATE_GRAPHS: Record<string, StateGraph> = {
  webwidgets: {
    caption: "A user gesture triggers a local state mutation, debounces through the write pipeline, and propagates to all dependent widgets via subscription.",
    nodes: [
      { id: "gesture", label: "User Gesture", x: 190, y: 30 },
      { id: "local", label: "Local State", x: 190, y: 110 },
      { id: "debounce", label: "Debounce", x: 190, y: 190 },
      { id: "persist", label: "Persist", x: 310, y: 260 },
      { id: "broadcast", label: "Broadcast", x: 70, y: 260 },
      { id: "deps", label: "Dependents", x: 190, y: 320 },
    ],
    edges: [
      { from: "gesture", to: "local", label: "mutate(delta)", delay: 0 },
      { from: "local", to: "debounce", label: "stream", delay: 0.6 },
      { from: "debounce", to: "persist", label: "flush(150ms)", delay: 1.2 },
      { from: "debounce", to: "broadcast", label: "notify", delay: 1.2 },
      { from: "broadcast", to: "deps", label: "dispatch", delay: 1.8 },
    ],
  },
  everychurch: {
    caption: "A permission check gates every service call. Role resolution happens once per request and is cached for the session duration.",
    nodes: [
      { id: "req", label: "Request", x: 190, y: 30 },
      { id: "guard", label: "Security Guard", x: 190, y: 110 },
      { id: "roles", label: "Role Cache", x: 80, y: 190 },
      { id: "service", label: "Service", x: 300, y: 190 },
      { id: "db", label: "Database", x: 190, y: 290 },
    ],
    edges: [
      { from: "req", to: "guard", label: "intercept", delay: 0 },
      { from: "guard", to: "roles", label: "resolve", delay: 0.5 },
      { from: "roles", to: "guard", label: "roles[]", delay: 1.0 },
      { from: "guard", to: "service", label: "proceed", delay: 1.5 },
      { from: "service", to: "db", label: "query", delay: 2.0 },
    ],
  },
  ductmap: {
    caption: "Topology mutations invalidate downstream constraints. The engine recomputes in topological order — upstream confidence gates downstream geometry.",
    nodes: [
      { id: "edit", label: "Topology Edit", x: 190, y: 30 },
      { id: "graph", label: "Graph Mutation", x: 190, y: 110 },
      { id: "topo", label: "Toposort", x: 80, y: 190 },
      { id: "constraints", label: "Constraints", x: 300, y: 190 },
      { id: "geometry", label: "Geometry", x: 190, y: 290 },
    ],
    edges: [
      { from: "edit", to: "graph", label: "invalidate", delay: 0 },
      { from: "graph", to: "topo", label: "order", delay: 0.6 },
      { from: "topo", to: "constraints", label: "propagate", delay: 1.2 },
      { from: "constraints", to: "geometry", label: "recompute", delay: 1.8 },
    ],
  },
  geography: {
    caption: "Pan and zoom events trigger viewport recalculation. Only layers intersecting the new viewport are re-tessellated — culling minimizes GPU work.",
    nodes: [
      { id: "input", label: "Pan / Zoom", x: 190, y: 30 },
      { id: "viewport", label: "Viewport", x: 190, y: 110 },
      { id: "cull", label: "Cull Layers", x: 80, y: 200 },
      { id: "tess", label: "Tessellate", x: 300, y: 200 },
      { id: "render", label: "GPU Draw", x: 190, y: 290 },
    ],
    edges: [
      { from: "input", to: "viewport", label: "update", delay: 0 },
      { from: "viewport", to: "cull", label: "intersect", delay: 0.5 },
      { from: "cull", to: "tess", label: "visible layers", delay: 1.0 },
      { from: "tess", to: "render", label: "triangles", delay: 1.6 },
    ],
  },
  clearspeak: {
    caption: "New statements enter the ingestion queue, are normalized and embedded, then scored against a vector-narrowed candidate set of prior statements.",
    nodes: [
      { id: "raw", label: "Raw Statement", x: 190, y: 30 },
      { id: "norm", label: "Normalize", x: 190, y: 110 },
      { id: "embed", label: "Embed", x: 80, y: 200 },
      { id: "search", label: "Vector Search", x: 300, y: 200 },
      { id: "score", label: "Score", x: 190, y: 290 },
    ],
    edges: [
      { from: "raw", to: "norm", label: "ingest", delay: 0 },
      { from: "norm", to: "embed", label: "tokenize", delay: 0.6 },
      { from: "embed", to: "search", label: "query", delay: 1.2 },
      { from: "search", to: "score", label: "candidates", delay: 1.8 },
      { from: "embed", to: "score", label: "embedding", delay: 1.8 },
    ],
  },
}
