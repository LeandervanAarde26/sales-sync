import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  className?: string
}

export function StatCard({ icon: Icon, label, value, className }: StatCardProps) {
  return (
    <Card className={cn("flex-row items-center gap-4 py-4", className)}>
      <CardContent className="flex flex-row items-center gap-4 py-0 w-full">
        <div className="flex items-center justify-center rounded-lg bg-muted p-2 text-muted-foreground shrink-0">
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground leading-none">{label}</span>
          <span className="text-sm font-semibold leading-none">{value}</span>
        </div>
      </CardContent>
    </Card>
  )
}
