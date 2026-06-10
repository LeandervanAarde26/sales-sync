import { cn } from "@/lib/utils"
import type { ICalendarEvent } from "@/abstractions/ICalendarEvent"
import { REP_COLOURS, CATEGORY_LABELS } from "@/abstractions/ICalendarEvent"
import { layoutEvents } from "./event_layout"

const HOUR_HEIGHT = 64 // px per hour
const DAY_START = 6   // 07:00
const DAY_END = 18   // 20:00
const HOURS = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i)

interface WeeklyViewProps {
  currentDate: Date
  events: ICalendarEvent[]
  onEventClick: (event: ICalendarEvent) => void
  onSlotClick: (date: string, time: string) => void
}

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekDays(date: Date): Date[] {
  const monday = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function getEventStyle(startTime: string, endTime: string): { top: number; height: number } {
  const startMin = timeToMinutes(startTime)
  const endMin = timeToMinutes(endTime)
  const dayStartMin = DAY_START * 60
  const top = ((startMin - dayStartMin) / 60) * HOUR_HEIGHT
  const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 20)
  return { top, height }
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function WeeklyView({ currentDate, events, onEventClick, onSlotClick }: WeeklyViewProps) {
  const today = toDateString(new Date())
  const weekDays = getWeekDays(currentDate)
  const totalHeight = (DAY_END - DAY_START) * HOUR_HEIGHT

  const eventsByDate = events.reduce<Record<string, ICalendarEvent[]>>((acc, evt) => {
    const start = timeToMinutes(evt.startTime)
    if (start >= DAY_START * 60 && start < DAY_END * 60) {
      acc[evt.date] = [...(acc[evt.date] ?? []), evt]
    }
    return acc
  }, {})

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Day headers */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
        <div />
        {weekDays.map((day, i) => {
          const dateStr = toDateString(day)
          const isToday = dateStr === today
          return (
            <div key={i} className="py-2 text-center border-l border-border first:border-l-0">
              <div className="text-xs text-muted-foreground">{DAY_LABELS[i]}</div>
              <div className={cn(
                "text-sm font-semibold mx-auto w-7 h-7 flex items-center justify-center rounded-full",
                isToday && "bg-primary text-primary-foreground"
              )}>
                {day.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
          {/* Hour labels */}
          <div className="relative" style={{ height: totalHeight }}>
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

          {/* Day columns */}
          {weekDays.map((day, di) => {
            const dateStr = toDateString(day)
            const dayEvents = eventsByDate[dateStr] ?? []
            return (
              <div
                key={di}
                className="relative border-l border-border"
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

                {/* Events — side-by-side within overlap groups */}
                {layoutEvents(dayEvents).map(({ event: evt, col, totalCols }) => {
                  const { top, height } = getEventStyle(evt.startTime, evt.endTime)
                  const colours = REP_COLOURS[evt.rep]
                  const leftPct = (col / totalCols) * 100
                  const widthPct = (1 / totalCols) * 100
                  return (
                    <button
                      key={evt.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(evt) }}
                      className={cn(
                        "absolute rounded px-1.5 py-0.5 text-left overflow-hidden",
                        colours.light, colours.text
                      )}
                      style={{
                        top,
                        height,
                        left: `calc(${leftPct}% + 2px)`,
                        width: `calc(${widthPct}% - 4px)`,
                      }}
                    >
                      <div className="text-xs font-medium leading-tight truncate">{evt.title}</div>
                      <div className="text-xs opacity-70 leading-tight">{evt.startTime} · {CATEGORY_LABELS[evt.category]}</div>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
