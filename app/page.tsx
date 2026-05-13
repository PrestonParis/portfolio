import Scene from "@/features/scene/components/Scene"
import DemoGrid from "@/features/grid/components/DemoGrid"
import Inspector from "@/features/inspector/components/Inspector"
import { PROJECTS } from "@/data/projects"

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#03040c]">
      {/* 3D background */}
      <Scene />

      {/* UI layer */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
            The Observatory
          </span>
          <span className="font-mono text-[10px] text-white/12">
            {PROJECTS.length} systems
          </span>
        </header>

        {/* Bento grid — fills remaining height */}
        <main className="min-h-0 flex-1 px-3 pb-3">
          <DemoGrid />
        </main>
      </div>

      {/* Inspector overlay — lives outside grid to animate from tile position */}
      <Inspector />
    </div>
  )
}
