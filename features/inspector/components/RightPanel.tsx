"use client"

import { useStore } from "@/store/useStore"
import RuntimeMode from "../modes/RuntimeMode"
import StateMode from "../modes/StateMode"
import InfrastructureMode from "../modes/InfrastructureMode"
import CodePathMode from "../modes/CodePathMode"

export function RightPanel() {
  const activeProject = useStore((s) => s.activeProject)
  const activeMode = useStore((s) => s.activeMode)
  if (!activeProject) return null

  switch (activeMode) {
    case "runtime":
      return <RuntimeMode project={activeProject} />
    case "state":
      return <StateMode project={activeProject} />
    case "infrastructure":
      return <InfrastructureMode project={activeProject} />
    case "codepath":
      return <CodePathMode key={activeProject.id} project={activeProject} />
    default:
      return null
  }
}
