const datasets = [
  { label: "People", value: "Graph" },
  { label: "Bills", value: "Votes" },
  { label: "Money", value: "FEC" },
  { label: "Maps", value: "Results" },
]

export function WorldviewMini() {
  return (
    <div className="grid h-full grid-cols-4 gap-1.5 p-2">
      {datasets.map((dataset, index) => (
        <div
          key={dataset.label}
          className="flex min-w-0 flex-col justify-center rounded-md border border-violet-400/15 bg-violet-400/[0.04] px-2 opacity-0"
          style={{ animation: `worldviewCard 0.35s ease forwards ${index * 0.12}s` }}
        >
          <span className="truncate font-mono text-[8px] uppercase tracking-wider text-white/25">
            {dataset.label}
          </span>
          <span className="truncate text-[10px] font-medium text-violet-200/70">
            {dataset.value}
          </span>
        </div>
      ))}

      <style>{`
        @keyframes worldviewCard {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
