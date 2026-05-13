export function MiniShell({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.03]">
      <div className="flex shrink-0 items-center gap-1 border-b border-white/[0.06] px-2 py-1">
        <span className="text-white/30">{icon}</span>
        <span className="font-mono text-[8px] text-white/35">{title}</span>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
