import { Link } from "react-router-dom"
import { AlertTriangle, XCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { IStockItem } from "@/abstractions/IStockItem"

type StockSeverity = "low" | "out"

const LOW_STOCK_THRESHOLD = 10
const OUT_OF_STOCK_THRESHOLD = 3

const SEVERITY_CONFIG: Record<StockSeverity, { label: string; colour: string; icon: typeof AlertTriangle }> = {
  low: { label: "Low stock", colour: "text-amber-600 dark:text-amber-400", icon: AlertTriangle },
  out: { label: "Out of stock", colour: "text-red-600 dark:text-red-400", icon: XCircle },
}

/** Returns total quantity on hand for an item, whether roll-based or flat. */
function getEffectiveQty(item: IStockItem): number {
  if (item.rolls && item.rolls.length > 0) {
    return item.rolls.reduce((sum, roll) => sum + roll.qtyOnHand, 0)
  }
  return item.qtyOnHand ?? 0
}

export function getStockSeverity(item: IStockItem): StockSeverity | null {
  const qty = getEffectiveQty(item)
  if (qty <= OUT_OF_STOCK_THRESHOLD) return "out"
  if (qty < LOW_STOCK_THRESHOLD) return "low"
  return null
}

interface StockAlertsProps {
  items: IStockItem[]
}

export function StockAlerts({ items }: StockAlertsProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1 pb-4">
        <div>
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No stock alerts.</p>
          ) : (
            items.map((item) => {
              const severity = getStockSeverity(item)
              if (!severity) return null
              const { label, colour, icon: Icon } = SEVERITY_CONFIG[severity]
              return (
                <div
                  key={item.itemCode}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("size-3.5 shrink-0", colour)} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm leading-none">{item.itemCode}</span>
                      <span className="text-xs text-muted-foreground leading-none mt-0.5">{item.collection}</span>
                    </div>
                  </div>
                  <span className={cn("text-xs font-medium", colour)}>{label}</span>
                </div>
              )
            })
          )}
        </div>
        <Link
          to="/stock"
          className="mt-4 flex items-center justify-end gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all stock <ArrowRight className="size-3" />
        </Link>
      </CardContent>
    </Card>
  )
}
