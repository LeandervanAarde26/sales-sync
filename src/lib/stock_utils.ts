import type { IStockItem } from "@/abstractions/IStockItem"

export const LOW_STOCK_THRESHOLD = 10
export const OUT_OF_STOCK_THRESHOLD = 3

export type StockSeverity = "low" | "out" | "ok"

export function getEffectiveQty(item: IStockItem): number {
  if (item.rolls && item.rolls.length > 0) {
    return item.rolls.reduce((sum, roll) => sum + roll.qtyOnHand, 0)
  }
  return item.qtyOnHand ?? 0
}

export function getStockSeverity(item: IStockItem): StockSeverity {
  const qty = getEffectiveQty(item)
  if (qty <= OUT_OF_STOCK_THRESHOLD) return "out"
  if (qty < LOW_STOCK_THRESHOLD) return "low"
  return "ok"
}
