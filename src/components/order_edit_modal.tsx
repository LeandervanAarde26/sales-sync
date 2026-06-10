import { useState, useEffect } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { IOrder, IOrderItem, OrderStatus } from "@/abstractions/IOrder"

const VAT_RATE = 0.15

const ORDER_STATUSES: OrderStatus[] = [
  "ordered", "processing", "shipped", "completed", "cancelled",
]

interface EditableItem extends IOrderItem {
  editQty: number
}

function buildEditableItems(items: IOrderItem[]): EditableItem[] {
  return items.map((item) => ({ ...item, editQty: item.quantity }))
}

function computeTotals(items: EditableItem[], discount: number, shippingCost: number) {
  const subtotal = items.reduce((sum, item) => sum + item.editQty * item.unitPrice, 0)
  const tax = (subtotal - discount) * VAT_RATE
  const total = subtotal - discount + tax + shippingCost
  return { subtotal, tax, total }
}

interface OrderEditModalProps {
  order: IOrder | null
  onClose: () => void
  onSave: (updated: IOrder) => void
}

export function OrderEditModal({ order, onClose, onSave }: OrderEditModalProps) {
  const [status, setStatus] = useState<OrderStatus>("ordered")
  const [items, setItems] = useState<EditableItem[]>([])
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (!order) return
    setStatus(order.status)
    setItems(buildEditableItems(order.items))
    setDiscount(order.discount)
  }, [order])

  if (!order) return null

  const shippingCost = order.shippingCost ?? 0
  const { subtotal, tax, total } = computeTotals(items, discount, shippingCost)

  function updateItemQty(index: number, qty: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, editQty: Math.max(0, qty), lineTotal: Math.max(0, qty) * item.unitPrice }
          : item
      )
    )
  }

  function handleSave() {
    if (!order) return
    const updatedItems: IOrderItem[] = items.map(({ editQty, ...rest }) => ({
      ...rest,
      quantity: editQty,
      lineTotal: editQty * rest.unitPrice,
    }))

    onSave({
      ...order,
      status,
      items: updatedItems,
      discount,
      subtotal,
      tax: parseFloat(tax.toFixed(2)),
      totalAmountPaid: parseFloat(total.toFixed(2)),
    })
  }

  function formatZAR(value: number): string {
    return `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Dialog open={!!order} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Edit Order — {order.orderReference}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
              <SelectTrigger className="w-48 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Items</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Item</TableHead>
                  <TableHead className="text-xs">Unit Price</TableHead>
                  <TableHead className="text-xs w-24">Qty</TableHead>
                  <TableHead className="text-xs text-right">Line Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={`${item.itemCode}-${index}`}>
                    <TableCell className="text-xs">{item.itemCode}</TableCell>
                    <TableCell className="text-xs">{formatZAR(item.unitPrice)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={item.editQty}
                        onChange={(e) => updateItemQty(index, parseInt(e.target.value, 10) || 0)}
                        className="h-7 w-20 text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      {formatZAR(item.editQty * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Discount */}
          <div className="flex items-center gap-3">
            <Label className="text-xs w-20 shrink-0">Discount (R)</Label>
            <Input
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className="h-7 w-32 text-xs"
            />
          </div>

          {/* Totals summary */}
          <div className="rounded-lg border border-border p-3 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>{formatZAR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span><span>− {formatZAR(discount)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT (15%)</span><span>{formatZAR(tax)}</span>
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span>{formatZAR(shippingCost)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t border-border pt-1.5 mt-0.5">
              <span>Total</span><span>{formatZAR(total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
