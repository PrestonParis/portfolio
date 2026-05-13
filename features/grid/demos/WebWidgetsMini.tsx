"use client"

import { CheckmarkIcon } from "@/icons/CheckmarkIcon"
import { MiniShell } from "./MiniShell"
import { PomodoroWidget } from "./PomodoroWidget"

export function WebWidgetsMini() {
  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-2 p-1.5">
      <PomodoroWidget />

      <MiniShell
        title="To-Do"
        icon={
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1.5" y="1.5" width="4" height="4" rx="0.5" />
            <path d="M8 4.5l1.2 1.2L11.5 3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.5 8.5h9M1.5 10.5h6" strokeLinecap="round" />
          </svg>
        }
      >
        <div className="flex flex-col justify-center gap-1.5 px-2 py-2">
          {[
            { text: "Review PR #47", done: true },
            { text: "Write unit tests", done: false },
            { text: "Update docs", done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`flex h-3 w-3 shrink-0 items-center justify-center rounded border ${item.done ? "border-blue-500 bg-blue-500" : "border-white/25"}`}>
                {item.done && <CheckmarkIcon />}
              </div>
              <span className={`text-[9px] ${item.done ? "text-white/25 line-through" : "text-white/55"}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </MiniShell>

      <MiniShell
        title="Habits"
        icon={<span className="text-[10px] leading-none">🔥</span>}
      >
        <div className="flex flex-col justify-center gap-2 px-2 py-2">
          {[
            { emoji: "💧", name: "Drink water", streak: 7, days: [1, 1, 1, 1, 1, 1, 1], done: true },
            { emoji: "📚", name: "Read", streak: 3, days: [1, 1, 1, 0, 1, 1, 0], done: false },
          ].map((habit, i) => (
            <div key={i}>
              <div className="mb-0.5 flex items-center gap-1">
                <div className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-sm border ${habit.done ? "border-violet-500 bg-violet-500" : "border-white/25"}`}>
                  {habit.done && <CheckmarkIcon />}
                </div>
                <span className="text-[9px]">{habit.emoji}</span>
                <span className={`flex-1 truncate text-[9px] ${habit.done ? "text-white/30 line-through" : "text-white/55"}`}>
                  {habit.name}
                </span>
                <span className="text-[8px] text-orange-400">🔥{habit.streak}</span>
              </div>
              <div className="ml-4 flex gap-0.5">
                {habit.days.map((d, j) => (
                  <div key={j} className={`h-2 w-2 rounded-full ${d ? "bg-violet-500/70" : "bg-white/10"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </MiniShell>

      <MiniShell
        title="Weather"
        icon={
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M2.5 8a2.5 2.5 0 1 1 4.6-1.4A2 2 0 0 1 7.5 10.5h-4A1.5 1.5 0 0 1 2.5 8Z" />
          </svg>
        }
      >
        <div className="flex flex-col justify-center px-2 py-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-bold leading-none text-white/80">72°</div>
              <div className="mt-0.5 font-mono text-[8px] text-white/35">Atlanta, GA</div>
            </div>
            <span className="text-2xl leading-none">⛅</span>
          </div>
          <div className="mt-2 font-mono text-[8px] text-white/35">Partly Cloudy</div>
          <div className="font-mono text-[8px] text-white/20">H 78° · L 61°</div>
        </div>
      </MiniShell>
    </div>
  )
}
