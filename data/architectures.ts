export interface ArchNode {
  id: string
  label: string
  x: number
  y: number
  tier: "client" | "gateway" | "service" | "data" | "compute"
}

export interface ArchEdge {
  from: string
  to: string
  pulse?: boolean
}

export interface ArchData {
  nodes: ArchNode[]
  edges: ArchEdge[]
  description: string
}

export const TIER_Z: Record<string, number> = {
  client: 2.5,
  gateway: 1.0,
  service: -0.5,
  compute: -2.0,
  data: -3.5,
}

export const TIER_COLOR: Record<string, string> = {
  client: "#60a5fa",
  gateway: "#a78bfa",
  service: "#34d399",
  data: "#fbbf24",
  compute: "#f97316",
}

export const ARCHITECTURES: Record<string, ArchData> = {
  webwidgets: {
    description:
      "Reactive state flows from user interactions through a shared store, debounced to the persistence layer, and echoed back via realtime subscriptions.",
    nodes: [
      { id: "ui", label: "Widget UI", x: 190, y: 30, tier: "client" },
      { id: "next", label: "Next.js", x: 190, y: 100, tier: "gateway" },
      { id: "store", label: "Zustand", x: 80, y: 180, tier: "service" },
      { id: "api", label: "FastAPI", x: 300, y: 180, tier: "service" },
      { id: "db", label: "Postgres", x: 300, y: 260, tier: "data" },
      { id: "rt", label: "Realtime", x: 80, y: 260, tier: "service" },
    ],
    edges: [
      { from: "ui", to: "next" },
      { from: "next", to: "store", pulse: true },
      { from: "next", to: "api", pulse: true },
      { from: "api", to: "db" },
      { from: "db", to: "rt", pulse: true },
      { from: "rt", to: "store", pulse: true },
    ],
  },
  everychurch: {
    description:
      "Requests pass through method-level RBAC before reaching service logic. Recommendations and search are decoupled services sharing the same persistence layer.",
    nodes: [
      { id: "client", label: "Angular", x: 60, y: 30, tier: "client" },
      { id: "api", label: "API Gateway", x: 190, y: 30, tier: "gateway" },
      { id: "auth", label: "Auth/RBAC", x: 90, y: 130, tier: "service" },
      { id: "church", label: "Church Svc", x: 190, y: 130, tier: "service" },
      { id: "rec", label: "Recommender", x: 310, y: 130, tier: "compute" },
      { id: "db", label: "PostgreSQL", x: 190, y: 250, tier: "data" },
    ],
    edges: [
      { from: "client", to: "api" },
      { from: "api", to: "auth" },
      { from: "api", to: "church", pulse: true },
      { from: "api", to: "rec", pulse: true },
      { from: "auth", to: "church" },
      { from: "church", to: "db" },
      { from: "rec", to: "db" },
    ],
  },
  ductmap: {
    description:
      "The Rust engine runs in a WASM sandbox. Topology and geometry are computed natively; only serializable primitives cross the JS/WASM boundary.",
    nodes: [
      { id: "ui", label: "React UI", x: 190, y: 30, tier: "client" },
      { id: "r3f", label: "R3F Canvas", x: 90, y: 120, tier: "service" },
      { id: "wasm", label: "WASM Bridge", x: 290, y: 120, tier: "gateway" },
      { id: "engine", label: "Rust Engine", x: 190, y: 210, tier: "compute" },
      { id: "solver", label: "Constraints", x: 80, y: 280, tier: "compute" },
      { id: "geo", label: "Geometry", x: 300, y: 280, tier: "compute" },
    ],
    edges: [
      { from: "ui", to: "r3f" },
      { from: "ui", to: "wasm", pulse: true },
      { from: "wasm", to: "engine", pulse: true },
      { from: "r3f", to: "engine" },
      { from: "engine", to: "solver", pulse: true },
      { from: "engine", to: "geo", pulse: true },
    ],
  },
  geography: {
    description:
      "Geographic layers are viewport-culled before tessellation and composed in deterministic render order. Data transformation runs ahead of render time.",
    nodes: [
      { id: "ui", label: "React UI", x: 190, y: 30, tier: "client" },
      { id: "three", label: "Three.js", x: 90, y: 130, tier: "service" },
      { id: "d3", label: "D3 Pipeline", x: 290, y: 130, tier: "service" },
      { id: "gis", label: "GIS APIs", x: 80, y: 240, tier: "data" },
      { id: "store", label: "Dataset Store", x: 300, y: 240, tier: "data" },
    ],
    edges: [
      { from: "ui", to: "three", pulse: true },
      { from: "ui", to: "d3" },
      { from: "three", to: "gis" },
      { from: "d3", to: "store", pulse: true },
      { from: "gis", to: "three", pulse: true },
      { from: "store", to: "d3" },
    ],
  },
  clearspeak: {
    description:
      "Ingestion and analysis are fully decoupled queues. Vector similarity narrows the contradiction search space before LLM scoring — keeping latency bounded.",
    nodes: [
      { id: "ingest", label: "Ingest Worker", x: 80, y: 40, tier: "service" },
      { id: "norm", label: "Normalizer", x: 190, y: 40, tier: "service" },
      { id: "embed", label: "Embedder", x: 300, y: 120, tier: "compute" },
      { id: "detect", label: "Detector", x: 190, y: 200, tier: "compute" },
      { id: "pg", label: "PostgreSQL", x: 80, y: 280, tier: "data" },
      { id: "vec", label: "Vector DB", x: 300, y: 280, tier: "data" },
    ],
    edges: [
      { from: "ingest", to: "norm", pulse: true },
      { from: "norm", to: "embed", pulse: true },
      { from: "norm", to: "pg" },
      { from: "embed", to: "vec" },
      { from: "embed", to: "detect", pulse: true },
      { from: "vec", to: "detect", pulse: true },
      { from: "detect", to: "pg" },
    ],
  },
}
