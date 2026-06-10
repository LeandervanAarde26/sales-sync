import { useState, useEffect } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { IStockItem, IRoll } from "@/abstractions/IStockItem"

interface StockEditModalProps {
  item: IStockItem | null
  onClose: () => void
  onSave: (updated: IStockItem) => void
}

export function StockEditModal({ item, onClose, onSave }: StockEditModalProps) {
  const [collection, setCollection] = useState("")
  const [whse, setWhse] = useState("")
  const [cut, setCut] = useState(0)
  const [roll, setRoll] = useState(0)
  const [retail, setRetail] = useState(0)
  const [rolls, setRolls] = useState<IRoll[]>([])
  const [qtyOnHand, setQtyOnHand] = useState(0)

  useEffect(() => {
    if (!item) return
    setCollection(item.collection)
    setWhse(item.whse)
    setCut(item.cut)
    setRoll(item.roll)
    setRetail(item.retail)
    setRolls(item.rolls ? [...item.rolls] : [])
    setQtyOnHand(item.qtyOnHand ?? 0)
  }, [item])

  if (!item) return null

  const isRollBased = item.rolls && item.rolls.length > 0

  function updateRollQty(index: number, qty: number) {
    setRolls((prev) =>
      prev.map((r, i) => (i === index ? { ...r, qtyOnHand: Math.max(0, qty) } : r))
    )
  }

  function handleSave() {
    if (!item) return
    onSave({
      ...item,
      collection,
      whse,
      cut,
      roll,
      retail,
      ...(isRollBased ? { rolls } : { qtyOnHand }),
    })
  }

  return (
    <Dialog open={!!item} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Edit Product — {item.itemCode}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Core fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Collection</Label>
              <Input value={collection} onChange={(e) => setCollection(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Warehouse</Label>
              <Input value={whse} onChange={(e) => setWhse(e.target.value)} className="h-8 text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Cut Price (R)</Label>
              <Input type="number" min={0} value={cut} onChange={(e) => setCut(parseFloat(e.target.value) || 0)} className="h-8 text-xs" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Roll Price (R)</Label>
              <Input type="number" min={0} value={roll} onChange={(e) => setRoll(parseFloat(e.target.value) || 0)} className="h-8 text-xs" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Retail Price (R)</Label>
              <Input type="number" min={0} value={retail} onChange={(e) => setRetail(parseFloat(e.target.value) || 0)} className="h-8 text-xs" />
            </div>
          </div>

          {/* Stock quantity */}
          {isRollBased ? (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Rolls</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Roll ID</TableHead>
                    <TableHead className="text-xs">Dye Lot</TableHead>
                    <TableHead className="text-xs">Expiry</TableHead>
                    <TableHead className="text-xs w-24">Qty on Hand</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolls.map((r, index) => (
                    <TableRow key={r.rollId}>
                      <TableCell className="text-xs">{r.rollId}</TableCell>
                      <TableCell className="text-xs">{r.dyeLot}</TableCell>
                      <TableCell className="text-xs">{r.expiry}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={r.qtyOnHand}
                          onChange={(e) => updateRollQty(index, parseInt(e.target.value, 10) || 0)}
                          className="h-7 w-20 text-xs"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Qty on Hand</Label>
              <Input
                type="number"
                min={0}
                value={qtyOnHand}
                onChange={(e) => setQtyOnHand(parseInt(e.target.value, 10) || 0)}
                className="h-8 w-32 text-xs"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
