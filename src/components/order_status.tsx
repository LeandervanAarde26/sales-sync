import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type OrderStatus = "completed" | "shipped" | "processing" | "cancelled"

interface StatusRow {
  status: OrderStatus
  count: number
}

const STATUS_BAR_COLOUR: Record<OrderStatus, string> = {
  completed: "bg-emerald-500",
  shipped: "bg-blue-500",
  processing: "bg-amber-500",
  cancelled: "bg-red-500",
}

// Placeholder — replace with real data from API
const STATUS_DATA: StatusRow[] = [
  { status: "completed", count: 6 },
  { status: "shipped", count: 3 },
  { status: "processing", count: 2 },
  { status: "cancelled", count: 1 },
]

const TOTAL_ORDERS = STATUS_DATA.reduce((sum, row) => sum + row.count, 0)

export function OrderStatus() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Order Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">All orders</span>
          <span className="text-xs font-semibold">{TOTAL_ORDERS}</span>
        </div>

        {STATUS_DATA.map(({ status, count }) => {
          const percent = Math.round((count / TOTAL_ORDERS) * 100)
          return (
            <div key={status} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs capitalize text-muted-foreground">{status}</span>
                <span className="text-xs font-medium">{count} · {percent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", STATUS_BAR_COLOUR[status])}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
