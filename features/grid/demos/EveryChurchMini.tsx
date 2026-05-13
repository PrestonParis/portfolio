export function EveryChurchMini() {
  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2">
        <svg className="h-3 w-3 text-white/30" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
          <circle cx="7" cy="7" r="4" />
          <path d="M10 10l3 3" />
        </svg>
        <span className="font-mono text-[11px] text-white/40">
          churches near Atlanta
          <span className="animate-pulse">|</span>
        </span>
      </div>

      {[
        { name: "Buckhead Community Church", role: "Admin", delay: "0s" },
        { name: "North Point Ministries", role: "Member", delay: "0.3s" },
        { name: "First Baptist Atlanta", role: "Visitor", delay: "0.6s" },
      ].map((church, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 opacity-0"
          style={{ animation: `fadeSlideUp 0.4s ease forwards ${church.delay}` }}
        >
          <div>
            <div className="text-[11px] text-white/70">{church.name}</div>
            <div className="mt-0.5 font-mono text-[9px] text-white/30">
              2.{i + 1} mi · Sunday 10AM
            </div>
          </div>
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[9px]"
            style={{ background: "#10b98120", color: "#10b981", border: "1px solid #10b98140" }}
          >
            {church.role}
          </span>
        </div>
      ))}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
