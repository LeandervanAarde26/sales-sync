import { cn } from "@/lib/utils"
import type { ICalendarEvent } from "@/abstractions/ICalendarEvent"
import { REP_COLOURS, CATEGORY_LABELS } from "@/abstractions/ICalendarEvent"
import { layoutEvents } from "./event_layout"

const HOUR_HEIGHT = 72
const DAY_START = 6
const DAY_END = 18
const HOURS = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i)

interface DailyViewProps {
  currentDate: Date
  events: ICalendarEvent[]
  onEventClick: (event: ICalendarEvent) => void
  onSlotClick: (date: string, time: string) => void
}

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export function DailyView({ currentDate, events, onEventClick, onSlotClick }: DailyViewProps) {
  const dateStr = toDateString(currentDate)
  const today = toDateString(new Date())
  const isToday = dateStr === today
  const totalHeight = (DAY_END - DAY_START) * HOUR_HEIGHT

  const dayEvents = events.filter((e) => {
    const start = timeToMinutes(e.startTime)
    return e.date === dateStr && start >= DAY_START * 60 && start < DAY_END * 60
  })

  const label = currentDate.toLocaleDateString("en-ZA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="border-b border-border py-3 px-4">
        <div className={cn("text-sm font-semibold", isToday && "text-primary")}>{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {dayEvents.length === 0 ? "No events" : `${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: totalHeight }}>
          {/* Hour labels */}
          <div className="w-14 shrink-0 relative" style={{ height: totalHeight }}>
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute right-2 text-xs text-muted-foreground"
                style={{ top: (h - DAY_START) * HOUR_HEIGHT - 8 }}
              >
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Event column */}
          <div
            className="flex-1 relative border-l border-border cursor-pointer"
            style={{ height: totalHeight }}
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
              const y = e.clientY - rect.top
              const totalMin = DAY_START * 60 + Math.floor((y / HOUR_HEIGHT) * 60)
              const h = Math.floor(totalMin / 60)
              const m = Math.floor((totalMin % 60) / 15) * 15
              onSlotClick(dateStr, `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
            }}
          >
            {/* Hour grid lines */}
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute w-full border-t border-border/50"
                style={{ top: (h - DAY_START) * HOUR_HEIGHT }}
              />
            ))}

            {/* Current time indicator */}
            {isToday && (() => {
              const now = new Date()
              const nowMin = now.getHours() * 60 + now.getMinutes()
              const top = ((nowMin - DAY_START * 60) / 60) * HOUR_HEIGHT
              if (top < 0 || top > totalHeight) return null
              return (
                <div className="absolute w-full flex items-center z-10 pointer-events-none" style={{ top }}>
                  <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shrink-0" />
                  <div className="flex-1 h-px bg-red-500" />
                </div>
              )
            })()}

            {/* Events — side-by-side within overlap groups */}
            {layoutEvents(dayEvents).map(({ event: evt, col, totalCols }) => {
              const startMin = timeToMinutes(evt.startTime)
              const endMin = timeToMinutes(evt.endTime)
              const top = ((startMin - DAY_START * 60) / 60) * HOUR_HEIGHT
              const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 28)
              const colours = REP_COLOURS[evt.rep]
              const leftPct = (col / totalCols) * 100
              const widthPct = (1 / totalCols) * 100

              return (
                <button
                  key={evt.id}
                  onClick={(e) => { e.stopPropagation(); onEventClick(evt) }}
                  className={cn(
                    "absolute rounded-lg px-3 py-1.5 text-left overflow-hidden shadow-sm",
                    colours.light, colours.text
                  )}
                  style={{
                    top,
                    height,
                    left: `calc(${leftPct}% + 4px)`,
                    width: `calc(${widthPct}% - 8px)`,
                  }}
                >
                  <div className="text-xs font-semibold leading-tight truncate">{evt.title}</div>
                  <div className="text-xs opacity-70 leading-tight mt-0.5">
                    {evt.startTime}–{evt.endTime} · {CATEGORY_LABELS[evt.category]} · {evt.rep}
                  </div>
                  {evt.description && height > 56 && (
                    <div className="text-xs opacity-60 leading-tight mt-1 line-clamp-2">{evt.description}</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
