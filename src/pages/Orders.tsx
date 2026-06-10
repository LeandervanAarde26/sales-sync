import { useState } from "react"
import {
  ShoppingCart, Clock, Truck, CheckCircle, XCircle, DollarSign,
} from "lucide-react"
import { StatCard } from "@/components/stat_card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { OrderEditModal } from "@/components/order_edit_modal"
import type { IOrder, OrderStatus } from "@/abstractions/IOrder"
import orderJson from "@/mock_data/order_data.json"

const PAGE_SIZE = 10

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  ordered: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}

function formatZAR(value: number): string {
  return `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total]
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total]
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total]
}

export default function Orders() {
  const [orders, setOrders] = useState<IOrder[]>(orderJson as IOrder[])
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const pageOrders = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmountPaid, 0)
  const countByStatus = (status: OrderStatus) => orders.filter((o) => o.status === status).length

  const STATS = [
    { icon: ShoppingCart, label: "Ordered", value: countByStatus("ordered").toString() },
    { icon: Clock, label: "Processing", value: countByStatus("processing").toString() },
    { icon: Truck, label: "Shipped", value: countByStatus("shipped").toString() },
    { icon: CheckCircle, label: "Completed", value: countByStatus("completed").toString() },
    { icon: XCircle, label: "Cancelled", value: countByStatus("cancelled").toString() },
    { icon: DollarSign, label: "Total Revenue", value: formatZAR(totalRevenue) },
  ]

  function handleSave(updated: IOrder) {
    setOrders((prev) =>
      prev.map((o) => (o.orderReference === updated.orderReference ? updated : o))
    )
    setSelectedOrder(null)
  }

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs pl-5">Reference</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-center">Items</TableHead>
                <TableHead className="text-xs text-right pr-5">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageOrders.map((order) => (
                <TableRow
                  key={order.orderReference}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="text-xs font-medium pl-5">{order.orderReference}</TableCell>
                  <TableCell className="text-xs">{order.customerName}</TableCell>
                  <TableCell className="text-xs">{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize border-0 ${STATUS_BADGE_CLASS[order.status]}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-center">{order.items.length}</TableCell>
                  <TableCell className="text-xs text-right pr-5">
                    {formatZAR(order.totalAmountPaid)}
                  </TableCell>
                </TableRow>
              ))}
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

      <OrderEditModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onSave={handleSave}
      />
    </div>
  )
}
