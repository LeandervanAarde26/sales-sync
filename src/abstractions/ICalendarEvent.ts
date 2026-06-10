export type EventCategory = "meeting" | "call" | "presentation" | "other"

export type RepName = "Craig" | "Moe" | "Eric"

export interface ICalendarEvent {
  id: string
  title: string
  category: EventCategory
  rep: RepName
  date: string      // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string   // HH:mm
  description?: string
}

export const REPS: RepName[] = ["Craig", "Moe", "Eric"]

export const EVENT_CATEGORIES: EventCategory[] = ["meeting", "call", "presentation", "other"]

export const REP_COLOURS: Record<RepName, { bg: string; light: string; text: string; dot: string }> = {
  Craig: {
    bg: "bg-blue-500",
    light: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-700 dark:text-blue-300",
    dot: "#3b82f6",
  },
  Moe: {
    bg: "bg-purple-500",
    light: "bg-purple-100 dark:bg-purple-900/40",
    text: "text-purple-700 dark:text-purple-300",
    dot: "#8b5cf6",
  },
  Eric: {
    bg: "bg-emerald-500",
    light: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "#10b981",
  },
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  meeting: "Meeting",
  call: "Call",
  presentation: "Presentation",
  other: "Other",
}
