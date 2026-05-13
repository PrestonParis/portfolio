"use client"

import { useEffect, useState } from "react"
import { MiniShell } from "./MiniShell"

export function PomodoroWidget() {
  const [secs, setSecs] = useState(24 * 60 + 12)
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 25 * 60)), 1000)
    return () => clearInterval(id)
  }, [])

  const mins = String(Math.floor(secs / 60)).padStart(2, "0")
  const ss = String(secs % 60).padStart(2, "0")
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - secs / (25 * 60))

  return (
    <MiniShell
      title="Pomodoro Timer"
      icon={
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6" cy="6" r="5" />
          <path d="M6 3v3l2 2" strokeLinecap="round" />
        </svg>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-0.5 py-1">
        <svg viewBox="0 0 52 52" className="h-11 w-11">
          <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle
            cx="26" cy="26" r={r}
            fill="none" stroke="#3b82f6" strokeWidth="3"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 26 26)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          <text x="26" y="24" textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.8)" fontSize="9" fontFamily="monospace" fontWeight="bold">
            {mins}:{ss}
          </text>
          <text x="26" y="34" textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="monospace">
            Session 1
          </text>
        </svg>
      </div>
    </MiniShell>
  )
}
