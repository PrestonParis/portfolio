export type ProjectStatus = "live" | "in-progress" | "planned"

export interface Project {
  id: string
  title: string
  tagline: string
  focus: string
  description: string
  tech: string[]
  color: string
  status: ProjectStatus
  overlayItems: string[]
  url?: string
  repositoryUrl: string
}

export const PROJECTS: Project[] = [
  {
    id: "webwidgets",
    title: "WebWidgets",
    tagline: "Modular Productivity Infrastructure",
    focus: "State Architecture & Systems Design",
    description:
      "A composable productivity ecosystem built around configurable widgets, shared state orchestration, and deeply interactive system workflows. Scales from individual utility tooling to coordinated multi-widget application behavior.",
    tech: ["Next.js", "TypeScript", "FastAPI", "Supabase", "PostgreSQL"],
    color: "#3b82f6",
    status: "live",
    url: process.env.NEXT_PUBLIC_WEBWIDGETS_URL ?? "https://webwidgets.me",
    repositoryUrl: "https://github.com/PrestonParis/aidash",
    overlayItems: [
      "Widget state mutation propagation",
      "Persistence synchronization cycles",
      "Dependency recomputation flow",
      "Cross-widget event coordination",
    ],
  },
  {
    id: "everychurch",
    title: "EveryChurch",
    tagline: "Church Discovery & Community Platform",
    focus: "Enterprise Architecture & Security Systems",
    description:
      "A secure full-stack ecosystem for church discovery, evaluation, and community coordination. Transforms fragmented church web experiences into a unified platform through intelligent recommendation and role-based access control.",
    tech: ["Angular", "Spring Boot", "AWS", "PostgreSQL"],
    color: "#10b981",
    status: "live",
    url: process.env.NEXT_PUBLIC_EVERYCHURCH_URL ?? "https://everychurch.co",
    repositoryUrl: "https://github.com/PrestonParis/everychurch",
    overlayItems: [
      "Authentication / authorization flow",
      "Request lifecycle tracing",
      "Recommendation weighting resolution",
      "Search pipeline execution",
    ],
  },
  {
    id: "ductmap",
    title: "Ductmap",
    tagline: "Computational HVAC Topology Engine",
    focus: "Native Systems & Computational Geometry",
    description:
      "A computational geometry platform for generating, refining, and validating duct system topology through interactive constraint solving and spatial inference. Combines native Rust performance with browser-based 3D visualization.",
    tech: ["Rust", "WebAssembly", "React Three Fiber", "Three.js", "Next.js"],
    color: "#f59e0b",
    status: "in-progress",
    url: process.env.NEXT_PUBLIC_DUCTMAP_URL,
    repositoryUrl: "https://github.com/PrestonParis/ductmap",
    overlayItems: [
      "Graph recomputation",
      "Constraint propagation",
      "Confidence recalculation",
      "Geometry regeneration",
    ],
  },
  {
    id: "geography",
    title: "Geography",
    tagline: "Interactive Spatial Intelligence Platform",
    focus: "Geospatial Rendering & Data Visualization",
    description:
      "A geographic systems exploration platform for visualizing regional relationships and historical change through high-performance interactive rendering. Makes geography observable as a dynamic system rather than static reference material.",
    tech: ["Next.js", "Three.js", "D3", "GIS APIs", "TypeScript"],
    color: "#06b6d4",
    status: "planned",
    repositoryUrl: "https://github.com/PrestonParis/Observatory",
    overlayItems: [
      "Geographic query execution",
      "Layer compositing behavior",
      "Dataset transformation flow",
      "Render optimization metrics",
    ],
  },
  {
    id: "worldview",
    title: "Worldview",
    tagline: "Political Research & Visualization",
    focus: "Graph Data & Public Information Systems",
    description:
      "A political research platform connecting public officials, legislation, money, elections, geography, and institutions across a relational store and a graph database.",
    tech: ["Next.js", "TypeScript", "Neo4j", "PostgreSQL", "MapLibre"],
    color: "#a855f7",
    status: "in-progress",
    repositoryUrl: "https://github.com/PrestonParis/worldview",
    overlayItems: [
      "Idempotent public-data ingestion",
      "Relational and graph data ownership",
      "Entity crosswalk resolution",
      "Map and relationship rendering",
    ],
  },
]
