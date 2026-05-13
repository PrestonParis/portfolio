const lines = [
  { text: "We have always supported this policy", highlight: true },
  { text: "without exception or compromise.", highlight: false },
  { text: "Previously opposed funding measures", highlight: true },
  { text: "that align with current proposals.", highlight: false },
]

export function ClearSpeakMini() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-3">
      {lines.map((line, i) => (
        <div
          key={i}
          className="relative font-mono text-[11px] leading-relaxed"
          style={{ color: line.highlight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}
        >
          {line.text}
          {line.highlight && (
            <div
              className="absolute inset-0 rounded"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(168,85,247,0.2) 40%, rgba(168,85,247,0.2) 60%, transparent)`,
                animation: `scan 3s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          )}
        </div>
      ))}

      <div
        className="mt-1 flex items-center gap-2 rounded border border-violet-500/30 bg-violet-500/10 px-2 py-1.5 opacity-0"
        style={{ animation: "fadeSlideUp 0.5s ease forwards 1.5s" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" style={{ animation: "pulse 1s ease-in-out infinite" }} />
        <span className="font-mono text-[9px] text-violet-300">Contradiction detected</span>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          30%, 70% { opacity: 1; }
          50% { transform: translateX(100%); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
