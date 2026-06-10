import { DollarSign, Users, ShoppingCart, Package } from "lucide-react"
import { StatCard } from "@/components/stat_card"
import { RevenueChart } from "@/components/revenue_chart"
import { RecentOrders } from "@/components/recent_orders"
import { OrderStatus } from "@/components/order_status"
import { StockAlerts } from "@/components/stock_alerts"
import { getStockSeverity } from "@/lib/stock_utils"
import { UpcomingEvents } from "@/components/upcoming_events"
import { TopCustomers } from "@/components/top_customers"
import type { IStockItem } from "@/abstractions/IStockItem"
import type { IOrder } from "@/abstractions/IOrder"
import stockData from "@/mock_data/stock_data.json"
import orderData from "@/mock_data/order_data.json"

const stockAlertItems = (stockData as IStockItem[]).filter(
  (item) => getStockSeverity(item) !== "ok"
)

const allOrders = orderData as IOrder[]

const recentOrders = [...allOrders]
  .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  .slice(0, 3)



export default function Dashboard() {
  const STATS = [
  { icon: Users, label: "Total Customers", value: "1" },
  { icon: ShoppingCart, label: "Total Orders", value: "4" },
  { icon: DollarSign, label: "Revenue", value: "R 38 000.00" },
  { icon: Package, label: " Low Stock Products", value: stockAlertItems.length.toString()  },
] as const
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <RevenueChart orders={allOrders} />
        <RecentOrders orders={recentOrders} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <OrderStatus />
        <StockAlerts items={stockAlertItems} />
        <UpcomingEvents />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <TopCustomers />
      </div>
    </div>
  )
}
