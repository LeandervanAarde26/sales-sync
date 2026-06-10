import {
  ComposedChart, Bar, Line, BarChart,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ISalesRep, RepStatus } from "@/abstractions/ISalesRep"
import { getYtdActual, getYtdTarget, getRepStatus, formatZAR } from "@/lib/sales_utils"
import salesJson from "@/mock_data/sales_data.json"

const salesData = salesJson as ISalesRep[]

const REP_COLOURS: Record<string, string> = {
  Craig: "#3b82f6",
  Moe:   "#8b5cf6",
  Eric:  "#10b981",
}

const STATUS_CONFIG: Record<RepStatus, { bg: string; text: string; label: string }> = {
  on_track: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", label: "On Track" },
  at_risk:  { bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-300",   label: "At Risk"   },
  behind:   { bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-700 dark:text-red-300",       label: "Behind"    },
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ─── Progress bar ────────────────────────────────────────────────────────────

interface ProgressBarProps {
  pct: number
  color: string
}

function ProgressBar({ pct, color }: ProgressBarProps) {
  const clamped = Math.min(Math.max(pct, 0), 100)
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}

// ─── Per-rep card ─────────────────────────────────────────────────────────────

interface RepCardProps {
  rep: ISalesRep
}

function RepCard({ rep }: RepCardProps) {
  const ytdActual  = getYtdActual(rep)
  const ytdTarget  = getYtdTarget(rep)
  const status     = getRepStatus(rep)
  const statusConf = STATUS_CONFIG[status]
  const colour     = REP_COLOURS[rep.rep] ?? "#6366f1"

  // Progress against annual target (how much of the year target is done)
  const yearPct = (ytdActual / rep.yearTarget) * 100
  // Progress against YTD cumulative target (are they ahead/behind pace?)
  const pacePct = ytdTarget > 0 ? (ytdActual / ytdTarget) * 100 : 0

  const chartData = rep.sales.map((m) => ({
    month: capitalise(m.month).slice(0, 3),
    Sales: m.sales,
    Target: m.target,
  }))

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: colour }} />
            <CardTitle className="text-sm font-semibold">{rep.rep}</CardTitle>
          </div>
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", statusConf.bg, statusConf.text)}>
            {statusConf.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Year target summary */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Year Target</span>
            <span className="font-medium">{formatZAR(rep.yearTarget)}</span>
          </div>
          <ProgressBar pct={yearPct} color={colour} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>YTD: {formatZAR(ytdActual)}</span>
            <span>{yearPct.toFixed(1)}% of year</span>
          </div>
        </div>

        {/* Pace vs cumulative monthly target */}
        <div className="rounded-lg bg-muted/40 px-3 py-2.5 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pace vs monthly targets</span>
            <span className={cn("font-semibold", pacePct >= 100 ? "text-emerald-600" : "text-red-600")}>
              {pacePct.toFixed(1)}%
            </span>
          </div>
          <ProgressBar
            pct={pacePct}
            color={pacePct >= 100 ? "#10b981" : "#ef4444"}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
            <span>Expected: {formatZAR(ytdTarget)}</span>
            <span className={cn(ytdActual >= ytdTarget ? "text-emerald-600" : "text-red-600")}>
              {ytdActual >= ytdTarget
                ? `+${formatZAR(ytdActual - ytdTarget)}`
                : `−${formatZAR(ytdTarget - ytdActual)}`}
            </span>
          </div>
        </div>

        {/* Monthly sales vs target mini chart */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Monthly breakdown</p>
          <ResponsiveContainer width="100%" height={130}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [formatZAR(Number(value)), ""]}
                contentStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="Sales" fill={colour} radius={[3, 3, 0, 0]} maxBarSize={32} />
              <Line
                dataKey="Target"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
                legendType="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="inline-block w-4 border-t border-dashed border-slate-400 mr-1 align-middle" />
            Monthly target
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Combined comparison chart ────────────────────────────────────────────────

function CombinedChart() {
  // Build month-keyed entries with each rep's sales
  const monthMap = new Map<string, Record<string, number>>()

  for (const rep of salesData) {
    for (const m of rep.sales) {
      const key = capitalise(m.month).slice(0, 3)
      if (!monthMap.has(key)) monthMap.set(key, { month_label: 0 })
      monthMap.get(key)![rep.rep] = m.sales
    }
  }

  const chartData = Array.from(monthMap.entries()).map(([month, vals]) => ({
    month,
    ...vals,
  }))

  // Average monthly target across all reps (used as a soft reference)
  const avgMonthlyTarget =
    salesData.reduce((sum, r) => sum + r.sales.reduce((s, m) => s + m.target, 0) / r.sales.length, 0) /
    salesData.length

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">All Reps — Monthly Sales Comparison</CardTitle>
        <p className="text-xs text-muted-foreground">Side-by-side monthly revenue per rep</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `R${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value, name) => [formatZAR(Number(value)), String(name)]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine
              y={avgMonthlyTarget}
              stroke="#94a3b8"
              strokeDasharray="5 4"
              label={{ value: "Avg target", position: "insideTopRight", fontSize: 10, fill: "#94a3b8" }}
            />
            {salesData.map((rep) => (
              <Bar
                key={rep.rep}
                dataKey={rep.rep}
                fill={REP_COLOURS[rep.rep] ?? "#6366f1"}
                radius={[3, 3, 0, 0]}
                maxBarSize={36}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Reps() {
  return (
    <div className="p-6 space-y-6">
      {/* Rep cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {salesData.map((rep) => (
          <RepCard key={rep.rep} rep={rep} />
        ))}
      </div>

      {/* Combined comparison chart */}
      <CombinedChart />
    </div>
  )
}
