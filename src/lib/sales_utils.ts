import type { ISalesRep, RepStatus } from "@/abstractions/ISalesRep"

export function getYtdActual(rep: ISalesRep): number {
  return rep.sales.reduce((sum, m) => sum + m.sales, 0)
}

export function getYtdTarget(rep: ISalesRep): number {
  return rep.sales.reduce((sum, m) => sum + m.target, 0)
}

/**
 * Determines rep performance status against cumulative target.
 * "at_risk" means overall YTD is positive but the last two recorded months
 * both missed their monthly target — a warning that momentum is dropping.
 */
export function getRepStatus(rep: ISalesRep): RepStatus {
  const ytdActual = getYtdActual(rep)
  const ytdTarget = getYtdTarget(rep)

  if (ytdActual < ytdTarget) return "behind"

  const recent = rep.sales.slice(-2)
  const allRecentBehind = recent.every((m) => m.sales < m.target)
  if (allRecentBehind) return "at_risk"

  return "on_track"
}

export function formatZAR(value: number): string {
  return `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}
