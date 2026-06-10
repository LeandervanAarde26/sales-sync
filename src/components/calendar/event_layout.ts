import type { ICalendarEvent } from "@/abstractions/ICalendarEvent"

export interface PositionedEvent {
  event: ICalendarEvent
  /** Zero-based column index within the overlap group */
  col: number
  /** Total columns in this overlap group */
  totalCols: number
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

/**
 * Assigns non-overlapping horizontal column slots to a list of events.
 * Events that overlap in time are placed side-by-side; isolated events
 * take the full column width (totalCols === 1).
 */
export function layoutEvents(events: ICalendarEvent[]): PositionedEvent[] {
  if (events.length === 0) return []

  const sorted = [...events].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )

  // Track the end-time (minutes) of the last event placed in each column
  const columns: number[] = []
  // Buffer for the current conflict group before totalCols is known
  const placed: { event: ICalendarEvent; col: number }[] = []
  let groupEnd = 0
  let groupStart = 0
  const result: PositionedEvent[] = []

  function flushGroup(): void {
    const slice = placed.slice(groupStart)
    if (slice.length === 0) return
    const totalCols = Math.max(...slice.map((p) => p.col)) + 1
    for (const p of slice) {
      result.push({ event: p.event, col: p.col, totalCols })
    }
    groupStart = placed.length
  }

  for (const evt of sorted) {
    const startMin = timeToMinutes(evt.startTime)
    const endMin = timeToMinutes(evt.endTime)

    if (startMin >= groupEnd && placed.length > groupStart) {
      // This event doesn't overlap with any event in the current group — flush it
      flushGroup()
      columns.length = 0
      groupEnd = 0
    }

    groupEnd = Math.max(groupEnd, endMin)

    // Greedy: find the first column whose last event already ended
    let assignedCol = -1
    for (let c = 0; c < columns.length; c++) {
      if (columns[c] <= startMin) {
        columns[c] = endMin
        assignedCol = c
        break
      }
    }

    if (assignedCol === -1) {
      assignedCol = columns.length
      columns.push(endMin)
    }

    placed.push({ event: evt, col: assignedCol })
  }

  flushGroup()

  return result
}
