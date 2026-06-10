import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CalendarEvent {
  id: string
  title: string
  date: Date
}

// Placeholder — replace with real data from API / calendar integration
const UPCOMING_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Teams Meeting", date: new Date("2026-06-12T10:00:00") },
  { id: "2", title: "Product Demo", date: new Date("2026-06-14T14:30:00") },
  { id: "3", title: "Sales Review", date: new Date("2026-06-17T09:00:00") },
]

function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) +
    " · " +
    date.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false })
}

export function UpcomingEvents() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col pb-4">
        {UPCOMING_EVENTS.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
          >
            <div className="mt-0.5 flex items-center justify-center rounded-md bg-muted p-1.5 shrink-0">
              <Calendar className="size-3.5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium leading-none">{event.title}</span>
              <span className="text-xs text-muted-foreground leading-none mt-1">
                {formatEventDate(event.date)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
