import { useState } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { IOrder, OrderStatus } from "@/abstractions/IOrder"

type ChartType = "bar" | "pie"

const STATUS_COLOURS: Record<OrderStatus, string> = {
  ordered: "#6366f1",
  processing: "#f59e0b",
  shipped: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
}

interface RevenueByStatus {
  status: OrderStatus
  revenue: number
}

function buildChartData(orders: IOrder[]): RevenueByStatus[] {
  const totals = orders.reduce<Partial<Record<OrderStatus, number>>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + order.totalAmountPaid
    return acc
  }, {})

  return (Object.entries(totals) as [OrderStatus, number][])
    .filter(([, revenue]) => revenue > 0)
    .map(([status, revenue]) => ({ status, revenue }))
}

interface RevenueChartProps {
  orders: IOrder[]
}

export function RevenueChart({ orders }: RevenueChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar")
  const chartData = buildChartData(orders)

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Revenue by Status</CardTitle>
        <div className="flex gap-1">
          <Button
            size="xs"
            variant={chartType === "bar" ? "default" : "outline"}
            onClick={() => setChartType("bar")}
          >
            Bar
          </Button>
          <Button
            size="xs"
            variant={chartType === "pie" ? "default" : "outline"}
            onClick={() => setChartType("pie")}
          >
            Pie
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ResponsiveContainer width="100%" height={320}>
          {chartType === "bar" ? (
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `R${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [
                  `R ${Number(value).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
                  "Revenue",
                ]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLOURS[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="revenue"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) =>
                  `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLOURS[entry.status]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `R ${Number(value).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
                  "Revenue",
                ]}
                contentStyle={{ fontSize: 12 }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
