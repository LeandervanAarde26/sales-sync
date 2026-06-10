import { useState } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ChartType = "bar" | "pie"

const REVENUE_DATA = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 6800 },
  { month: "Mar", revenue: 5300 },
  { month: "Apr", revenue: 7100 },
  { month: "May", revenue: 9400 },
  { month: "Jun", revenue: 8200 },
]

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]

export function RevenueChart() {
  const [chartType, setChartType] = useState<ChartType>("bar")

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
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
            <BarChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `R${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => [`R ${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={REVENUE_DATA}
                dataKey="revenue"
                nameKey="month"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {REVENUE_DATA.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`R ${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{ fontSize: 12 }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
