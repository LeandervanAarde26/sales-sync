import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Calendar as MiniCalendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EventFormModal } from "@/components/calendar/event_form_modal"
import { MonthlyView } from "@/components/calendar/monthly_view"
import { WeeklyView } from "@/components/calendar/weekly_view"
import { DailyView } from "@/components/calendar/daily_view"
import type { ICalendarEvent, RepName } from "@/abstractions/ICalendarEvent"
import { REPS, REP_COLOURS } from "@/abstractions/ICalendarEvent"
import calendarJson from "@/mock_data/calendar_data.json"

type ViewType = "daily" | "weekly" | "monthly"

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function getViewLabel(date: Date, view: ViewType): string {
  if (view === "monthly") {
    return date.toLocaleDateString("en-ZA", { month: "long", year: "numeric" })
  }
  if (view === "weekly") {
    const monday = new Date(date)
    const day = monday.getDay()
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const start = monday.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })
    const end = sunday.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
    return `${start} – ${end}`
  }
  return date.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

function navigate(date: Date, view: ViewType, direction: -1 | 1): Date {
  const d = new Date(date)
  if (view === "monthly") d.setMonth(d.getMonth() + direction)
  if (view === "weekly") d.setDate(d.getDate() + direction * 7)
  if (view === "daily") d.setDate(d.getDate() + direction)
  return d
}

export default function Calendar() {
  const [events, setEvents] = useState<ICalendarEvent[]>(calendarJson as ICalendarEvent[])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>("weekly")
  const [selectedReps, setSelectedReps] = useState<Set<RepName>>(new Set(REPS))
  const [formEvent, setFormEvent] = useState<Partial<ICalendarEvent> | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const filteredEvents = events.filter((e) => selectedReps.has(e.rep))

  function toggleRep(rep: RepName) {
    setSelectedReps((prev) => {
      const next = new Set(prev)
      if (next.has(rep)) {
        if (next.size === 1) return prev // keep at least one
        next.delete(rep)
      } else {
        next.add(rep)
      }
      return next
    })
  }

  function toggleAll() {
    setSelectedReps(selectedReps.size === REPS.length ? new Set([REPS[0]]) : new Set(REPS))
  }

  function openAdd(defaults: Partial<ICalendarEvent> = {}) {
    setFormEvent({ date: toDateString(currentDate), startTime: "09:00", endTime: "10:00", ...defaults })
    setIsEditing(false)
  }

  function openEdit(event: ICalendarEvent) {
    setFormEvent(event)
    setIsEditing(true)
  }

  function handleSave(event: ICalendarEvent) {
    setEvents((prev) =>
      isEditing
        ? prev.map((e) => (e.id === event.id ? event : e))
        : [...prev, event]
    )
    setFormEvent(null)
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setFormEvent(null)
  }

  return (
    <div className="flex h-80vh flex-row">
      {/* Sidebar */}
      <aside className="w-70 shrink-0 flex flex-col gap-4 border-r border-border p-4">
        <Button size="sm" className="w-full gap-1.5" onClick={() => openAdd()}>
          <Plus className="size-3.5" /> Add event
        </Button>

        {/* Mini calendar */}
        <MiniCalendar
          mode="single"
          selected={currentDate}
          onSelect={(d) => d && setCurrentDate(d)}
          className="rounded-lg border border-border p-2 text-xs"
        />

        {/* Rep filters */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reps</span>

          <button
            onClick={toggleAll}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
              selectedReps.size === REPS.length
                ? "bg-muted font-medium"
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            <span className="size-2.5 rounded-full bg-foreground/30 shrink-0" />
            All reps
          </button>

          {REPS.map((rep) => {
            const colours = REP_COLOURS[rep]
            const active = selectedReps.has(rep)
            return (
              <button
                key={rep}
                onClick={() => toggleRep(rep)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                  active ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <span
                  className={cn("size-2.5 rounded-full shrink-0", active ? colours.bg : "bg-muted-foreground/30")}
                />
                {rep}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" onClick={() => setCurrentDate(navigate(currentDate, viewType, -1))}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="icon-sm" onClick={() => setCurrentDate(navigate(currentDate, viewType, 1))}>
              <ChevronRight className="size-4" />
            </Button>
            <span className="text-sm font-medium ml-1">{getViewLabel(currentDate, viewType)}</span>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
            {(["daily", "weekly", "monthly"] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewType(v)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md capitalize transition-colors",
                  viewType === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar view */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {viewType === "monthly" && (
            <MonthlyView
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={openEdit}
              onDayClick={(date) => { setCurrentDate(new Date(date)); setViewType("daily") }}
            />
          )}
          {viewType === "weekly" && (
            <WeeklyView
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={openEdit}
              onSlotClick={(date, time) => openAdd({ date, startTime: time })}
            />
          )}
          {viewType === "daily" && (
            <DailyView
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={openEdit}
              onSlotClick={(date, time) => openAdd({ date, startTime: time })}
            />
          )}
        </div>
      </div>

      <EventFormModal
        event={formEvent}
        isEditing={isEditing}
        onClose={() => setFormEvent(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
