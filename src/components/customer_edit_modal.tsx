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
import type { ICustomer, CustomerTier, CustomerStatus } from "@/abstractions/ICustomer"

const TIERS: CustomerTier[] = ["enterprise", "premium", "basic"]
const STATUSES: CustomerStatus[] = ["active", "pending", "inactive"]

interface CustomerEditModalProps {
  customer: ICustomer | null
  onClose: () => void
  onSave: (updated: ICustomer) => void
}

export function CustomerEditModal({ customer, onClose, onSave }: CustomerEditModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [tier, setTier] = useState<CustomerTier>("basic")
  const [status, setStatus] = useState<CustomerStatus>("active")

  useEffect(() => {
    if (!customer) return
    setName(customer.name)
    setEmail(customer.email)
    setPhone(customer.phone)
    setCompany(customer.company)
    setTier(customer.tier)
    setStatus(customer.status)
  }, [customer])

  if (!customer) return null

  function handleSave() {
    onSave({ ...customer!, name, email, phone, company, tier, status })
  }

  return (
    <Dialog open={!!customer} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Edit Customer — {customer.id}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-8 text-xs" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-8 text-xs" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Company</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} className="h-8 text-xs" placeholder="Individual" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Tier</Label>
              <Select value={tier} onValueChange={(v) => setTier(v as CustomerTier)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as CustomerStatus)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
