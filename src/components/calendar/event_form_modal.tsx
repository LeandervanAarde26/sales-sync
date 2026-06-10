import { useState, useEffect } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { ICalendarEvent, EventCategory, RepName } from "@/abstractions/ICalendarEvent"
import { REPS, EVENT_CATEGORIES, CATEGORY_LABELS } from "@/abstractions/ICalendarEvent"

interface EventFormModalProps {
  event: Partial<ICalendarEvent> | null
  isEditing: boolean
  onClose: () => void
  onSave: (event: ICalendarEvent) => void
  onDelete: (id: string) => void
}

function generateId(): string {
  return `EVT-${Date.now()}`
}

export function EventFormModal({ event, isEditing, onClose, onSave, onDelete }: EventFormModalProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<EventCategory>("meeting")
  const [rep, setRep] = useState<RepName>("Craig")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (!event) return
    setTitle(event.title ?? "")
    setCategory(event.category ?? "meeting")
    setRep(event.rep ?? "Craig")
    setDate(event.date ?? new Date().toISOString().split("T")[0])
    setStartTime(event.startTime ?? "09:00")
    setEndTime(event.endTime ?? "10:00")
    setDescription(event.description ?? "")
  }, [event])

  if (event === null) return null

  function handleSave() {
    if (!title.trim() || !date) return
    onSave({
      id: (event as ICalendarEvent).id ?? generateId(),
      title: title.trim(),
      category,
      rep,
      date,
      startTime,
      endTime,
      description: description.trim() || undefined,
    })
  }

  return (
    <Dialog open={event !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            {isEditing ? "Edit Event" : "Add Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">{CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Rep</Label>
              <Select value={rep} onValueChange={(v) => setRep(v as RepName)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REPS.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes..."
              className="text-xs resize-none min-h-16"
            />
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-2">
          {isEditing && (event as ICalendarEvent).id ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="mr-auto">Cancel event</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-sm">Cancel this event?</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs">
                    <strong>{title}</strong> will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="h-8 text-xs">Keep it</AlertDialogCancel>
                  <AlertDialogAction
                    className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete((event as ICalendarEvent).id)}
                  >
                    Cancel event
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            <Button size="sm" onClick={handleSave} disabled={!title.trim() || !date}>
              {isEditing ? "Save changes" : "Add event"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
