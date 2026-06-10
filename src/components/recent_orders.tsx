import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type OrderStatus = "completed" | "shipped" | "processing" | "cancelled"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  value: string
  status: OrderStatus
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  completed: "text-emerald-600 dark:text-emerald-400",
  shipped: "text-blue-600 dark:text-blue-400",
  processing: "text-amber-600 dark:text-amber-400",
  cancelled: "text-red-600 dark:text-red-400",
}

// Placeholder — replace with real data from API
const RECENT_ORDERS: Order[] = [
  { id: "1", orderNumber: "#ORD-001", customerName: "Jane Doe", value: "R 450.00", status: "completed" },
  { id: "2", orderNumber: "#ORD-002", customerName: "John Smith", value: "R 200.00", status: "processing" },
  { id: "3", orderNumber: "#ORD-003", customerName: "Sarah Lee", value: "R 850.00", status: "shipped" },
]

function OrderRow({ order }: { order: Order }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium leading-none">{order.orderNumber}</span>
        <span className="text-xs text-muted-foreground leading-none mt-1">{order.customerName}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-medium leading-none">{order.value}</span>
        <span className={cn("text-xs capitalize leading-none mt-1", STATUS_STYLES[order.status])}>
          {order.status}
        </span>
      </div>
    </div>
  )
}

export function RecentOrders() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between px-5 pb-4">
        <div>
          {RECENT_ORDERS.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
        <Link
          to="/orders"
          className="mt-4 flex items-center justify-end gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all orders <ArrowRight className="size-3" />
        </Link>
      </CardContent>
    </Card>
  )
}
