export interface RuntimeEntry {
  features: string[]
  note: string
}

export const RUNTIME_CONTENT: Record<string, RuntimeEntry> = {
  webwidgets: {
    features: [
      "Drag widgets to reorder — layout persists automatically",
      "Multiple widget types share synchronized state in real time",
      "Workspace composition saves to Supabase on every change",
      "Configurable layouts with persistent user preferences",
    ],
    note: "Live dashboard embedded above. All widget interactions are real — state mutations propagate across widget boundaries in real time.",
  },
  everychurch: {
    features: [
      "Full-text church search with real-time filtering",
      "Role-based access control enforced at the service layer",
      "Intelligent recommendation scoring based on user profile",
      "Community event coordination and church profiles",
    ],
    note: "EveryChurch is in active development. The embedded preview shows the discovery interface and recommendation engine.",
  },
  ductmap: {
    features: [
      "Drag nodes to reshape duct topology in real time",
      "Constraint propagation runs entirely in Rust / WASM",
      "Geometry recomputes automatically after topology edits",
      "Confidence scoring surfaces uncertain inference areas",
    ],
    note: "The Ductmap editor runs the full Rust constraint engine via WebAssembly. Every interaction is processed natively at near-native performance.",
  },
  geography: {
    features: [
      "High-performance geographic layer rendering via Three.js",
      "Viewport-aware tile culling for efficient large-scale rendering",
      "Historical dataset playback with temporal navigation",
      "Layered geographic data composition with render ordering",
    ],
    note: "Geography is in early development. The visualization engine is operational — data layer integrations are in progress.",
  },
  clearspeak: {
    features: [
      "Statement ingestion with async normalization pipeline",
      "Vector similarity search across speaker statement history",
      "Contradiction detection using embedding distance scoring",
      "Longitudinal communication pattern analysis",
    ],
    note: "ClearSpeak is in the design phase. The analysis architecture is specified and the ingestion pipeline is being built.",
  },
}

export const STATUS_BADGE: Record<string, { label: string; style: string }> = {
  live: { label: "● Live", style: "text-emerald-400" },
  "in-progress": { label: "◐ In Progress", style: "text-amber-400" },
  planned: { label: "○ Planned", style: "text-white/35" },
}
