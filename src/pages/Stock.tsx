import { useState } from "react"
import { Package, CheckCircle, AlertTriangle, XCircle, Pencil, Trash2 } from "lucide-react"
import { StatCard } from "@/components/stat_card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { StockEditModal } from "@/components/stock_edit_modal"
import type { IStockItem } from "@/abstractions/IStockItem"
import { getEffectiveQty, getStockSeverity, type StockSeverity } from "@/lib/stock_utils"
import stockJson from "@/mock_data/stock_data.json"

const PAGE_SIZE = 10

const SEVERITY_BADGE: Record<StockSeverity, { label: string; className: string }> = {
  ok: { label: "In Stock", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  low: { label: "Low Stock", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  out: { label: "Out of Stock", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
}

function formatZAR(value: number): string {
  return `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total]
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total]
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total]
}

export default function Stock() {
  const [items, setItems] = useState<IStockItem[]>(stockJson as IStockItem[])
  const [editingItem, setEditingItem] = useState<IStockItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const pageItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const totalProducts = items.length
  const inStock = items.filter((i) => getStockSeverity(i) === "ok").length
  const lowStock = items.filter((i) => getStockSeverity(i) === "low").length
  const outOfStock = items.filter((i) => getStockSeverity(i) === "out").length

  const STATS = [
    { icon: Package, label: "Total Products", value: totalProducts.toString() },
    { icon: CheckCircle, label: "In Stock", value: inStock.toString() },
    { icon: AlertTriangle, label: "Low Stock", value: lowStock.toString() },
    { icon: XCircle, label: "Out of Stock", value: outOfStock.toString() },
  ]

  function handleSave(updated: IStockItem) {
    setItems((prev) => prev.map((i) => (i.itemCode === updated.itemCode ? updated : i)))
    setEditingItem(null)
  }

  function handleDelete(itemCode: string) {
    setItems((prev) => prev.filter((i) => i.itemCode !== itemCode))
  }

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs pl-5">Item Code</TableHead>
                <TableHead className="text-xs">Collection</TableHead>
                <TableHead className="text-xs">Warehouse</TableHead>
                <TableHead className="text-xs text-right">Retail</TableHead>
                <TableHead className="text-xs text-right">Qty on Hand</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((item) => {
                const qty = getEffectiveQty(item)
                const severity = getStockSeverity(item)
                const { label, className } = SEVERITY_BADGE[severity]
                return (
                  <TableRow key={item.itemCode}>
                    <TableCell className="text-xs font-medium pl-5">{item.itemCode}</TableCell>
                    <TableCell className="text-xs">{item.collection}</TableCell>
                    <TableCell className="text-xs">{item.whse}</TableCell>
                    <TableCell className="text-xs text-right">{formatZAR(item.retail)}</TableCell>
                    <TableCell className="text-xs text-right">{qty}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs border-0 ${className}`}>
                        {label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => setEditingItem(item)}
                          aria-label="Edit product"
                        >
                          <Pencil className="size-3.5" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon-sm" variant="ghost" aria-label="Delete product">
                              <Trash2 className="size-3.5 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-sm">Delete product?</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs">
                                This will permanently remove <strong>{item.itemCode}</strong> and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(item.itemCode)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="border-t border-border px-4 py-3">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(currentPage - 1)}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {buildPageNumbers(currentPage, totalPages).map((page, i) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => goToPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(currentPage + 1)}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <StockEditModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
      />
    </div>
  )
}
