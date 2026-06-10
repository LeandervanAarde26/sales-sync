import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { IOrder, OrderStatus } from "@/abstractions/IOrder"

const STATUS_STYLES: Record<OrderStatus, string> = {
  ordered: "text-indigo-600 dark:text-indigo-400",
  completed: "text-emerald-600 dark:text-emerald-400",
  shipped: "text-blue-600 dark:text-blue-400",
  processing: "text-amber-600 dark:text-amber-400",
  cancelled: "text-red-600 dark:text-red-400",
}

function formatAmount(amount: number, currency: string): string {
  const symbol = currency === "ZAR" ? "R" : currency
  return `${symbol} ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function OrderRow({ order }: { order: IOrder }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium leading-none">{order.orderReference}</span>
        <span className="text-xs text-muted-foreground leading-none mt-1">{order.customerName}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-medium leading-none">
          {formatAmount(order.totalAmountPaid, order.currency)}
        </span>
        <span className={cn("text-xs capitalize leading-none mt-1", STATUS_STYLES[order.status])}>
          {order.status}
        </span>
      </div>
    </div>
  )
}

interface RecentOrdersProps {
  orders: IOrder[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between px-5 pb-4">
        <div>
          {orders.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No recent orders.</p>
          ) : (
            orders.map((order) => (
              <OrderRow key={order.orderReference} order={order} />
            ))
          )}
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
