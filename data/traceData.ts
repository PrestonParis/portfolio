export interface TraceSpan {
  id: string
  label: string
  service: string
  start: number
  duration: number
  depth: number
}

export interface TraceEntry {
  spans: TraceSpan[]
  totalMs: number
  caption: string
}

export const TRACES: Record<string, TraceEntry> = {
  webwidgets: {
    totalMs: 340,
    caption: "Widget save request traced end-to-end: API call, validation, write, and realtime broadcast.",
    spans: [
      { id: "1", label: "POST /api/widgets/:id", service: "Next.js", start: 0, duration: 340, depth: 0 },
      { id: "2", label: "validateDelta()", service: "Next.js", start: 10, duration: 12, depth: 1 },
      { id: "3", label: "persistMutation()", service: "FastAPI", start: 30, duration: 180, depth: 1 },
      { id: "4", label: "db.upsert()", service: "Postgres", start: 45, duration: 140, depth: 2 },
      { id: "5", label: "broadcast(widgetId)", service: "Realtime", start: 220, duration: 60, depth: 1 },
      { id: "6", label: "notifySubscribers()", service: "Realtime", start: 240, duration: 30, depth: 2 },
    ],
  },
  everychurch: {
    totalMs: 210,
    caption: "Church search request: RBAC check, search query, and recommendation score applied in parallel.",
    spans: [
      { id: "1", label: "GET /api/churches/search", service: "Gateway", start: 0, duration: 210, depth: 0 },
      { id: "2", label: "rbac.check()", service: "Auth", start: 5, duration: 18, depth: 1 },
      { id: "3", label: "search.execute()", service: "Church Svc", start: 28, duration: 120, depth: 1 },
      { id: "4", label: "db.fullTextSearch()", service: "Postgres", start: 35, duration: 90, depth: 2 },
      { id: "5", label: "rec.score(results)", service: "Recommender", start: 130, duration: 60, depth: 1 },
    ],
  },
  ductmap: {
    totalMs: 85,
    caption: "Node drag triggers WASM constraint resolution and geometry recomputation — all within a single animation frame budget.",
    spans: [
      { id: "1", label: "onNodeDrag()", service: "React", start: 0, duration: 85, depth: 0 },
      { id: "2", label: "wasm.moveNode()", service: "WASM", start: 2, duration: 78, depth: 1 },
      { id: "3", label: "resolve_constraints()", service: "Rust", start: 5, duration: 40, depth: 2 },
      { id: "4", label: "recompute_geometry()", service: "Rust", start: 48, duration: 28, depth: 2 },
      { id: "5", label: "updateMesh()", service: "R3F", start: 78, duration: 5, depth: 1 },
    ],
  },
  geography: {
    totalMs: 160,
    caption: "Viewport change triggers layer culling, async data fetch, and tessellation before the render pass.",
    spans: [
      { id: "1", label: "onViewportChange()", service: "React", start: 0, duration: 160, depth: 0 },
      { id: "2", label: "cull(layers)", service: "Renderer", start: 2, duration: 8, depth: 1 },
      { id: "3", label: "fetchTiles(bounds)", service: "GIS API", start: 12, duration: 90, depth: 1 },
      { id: "4", label: "transform(data)", service: "D3", start: 105, duration: 25, depth: 1 },
      { id: "5", label: "tesselate()", service: "Renderer", start: 132, duration: 22, depth: 1 },
    ],
  },
  clearspeak: {
    totalMs: 420,
    caption: "Statement ingestion through to contradiction scoring: normalization, embedding, and vector search are the critical path.",
    spans: [
      { id: "1", label: "ingest(statement)", service: "Worker", start: 0, duration: 420, depth: 0 },
      { id: "2", label: "normalize()", service: "Worker", start: 5, duration: 25, depth: 1 },
      { id: "3", label: "db.upsert()", service: "Postgres", start: 32, duration: 30, depth: 1 },
      { id: "4", label: "model.encode()", service: "Embedder", start: 65, duration: 180, depth: 1 },
      { id: "5", label: "vector_db.search()", service: "Qdrant", start: 248, duration: 80, depth: 1 },
      { id: "6", label: "detector.score()", service: "Detector", start: 330, duration: 75, depth: 1 },
    ],
  },
}

export const SERVICE_COLORS: Record<string, string> = {
  "Next.js": "#60a5fa",
  FastAPI: "#34d399",
  Postgres: "#fbbf24",
  Realtime: "#a78bfa",
  Gateway: "#60a5fa",
  Auth: "#f97316",
  "Church Svc": "#34d399",
  Recommender: "#a78bfa",
  React: "#60a5fa",
  WASM: "#f97316",
  Rust: "#f97316",
  R3F: "#34d399",
  Renderer: "#34d399",
  "GIS API": "#fbbf24",
  D3: "#a78bfa",
  Worker: "#60a5fa",
  Embedder: "#f97316",
  Qdrant: "#fbbf24",
  Detector: "#a78bfa",
}
