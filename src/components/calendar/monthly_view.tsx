import { cn } from "@/lib/utils"
import type { ICalendarEvent } from "@/abstractions/ICalendarEvent"
import { REP_COLOURS } from "@/abstractions/ICalendarEvent"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MAX_VISIBLE = 3

interface MonthlyViewProps {
  currentDate: Date
  events: ICalendarEvent[]
  onEventClick: (event: ICalendarEvent) => void
  onDayClick: (date: string) => void
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function buildGridDays(date: Date): Date[] {
  const first = startOfMonth(date)
  // Monday-based week: getDay() 0=Sun → shift to 6, 1=Mon → 0, etc.
  const startOffset = (first.getDay() + 6) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - startOffset)

  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

export function MonthlyView({ currentDate, events, onEventClick, onDayClick }: MonthlyViewProps) {
  const today = toDateString(new Date())
  const gridDays = buildGridDays(currentDate)
  const currentMonth = currentDate.getMonth()

  const eventsByDate = events.reduce<Record<string, ICalendarEvent[]>>((acc, evt) => {
    acc[evt.date] = [...(acc[evt.date] ?? []), evt]
    return acc
  }, {})

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 flex-1 divide-x divide-border">
        {gridDays.map((day, i) => {
          const dateStr = toDateString(day)
          const isToday = dateStr === today
          const isCurrentMonth = day.getMonth() === currentMonth
          const dayEvents = eventsByDate[dateStr] ?? []
          const visible = dayEvents.slice(0, MAX_VISIBLE)
          const overflow = dayEvents.length - MAX_VISIBLE

          return (
            <div
              key={i}
              className={cn(
                "min-h-24 p-1 border-b border-border flex flex-col gap-0.5 cursor-pointer hover:bg-muted/30 transition-colors",
                !isCurrentMonth && "bg-muted/20"
              )}
              onClick={() => onDayClick(dateStr)}
            >
              <span
                className={cn(
                  "text-xs w-6 h-6 flex items-center justify-center rounded-full self-start font-medium",
                  isToday && "bg-primary text-primary-foreground",
                  !isCurrentMonth && "text-muted-foreground",
                  !isToday && isCurrentMonth && "text-foreground"
                )}
              >
                {day.getDate()}
              </span>

              {visible.map((evt) => (
                <button
                  key={evt.id}
                  onClick={(e) => { e.stopPropagation(); onEventClick(evt) }}
                  className={cn(
                    "w-full text-left rounded px-1 py-0.5 text-xs truncate leading-tight",
                    REP_COLOURS[evt.rep].light,
                    REP_COLOURS[evt.rep].text
                  )}
                >
                  <span className="font-medium">{evt.startTime}</span> {evt.title}
                </button>
              ))}

              {overflow > 0 && (
                <span className="text-xs text-muted-foreground px-1">+{overflow} more</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
