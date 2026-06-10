import { Mail, Phone, Building2, DollarSign, Pencil, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { ICustomer, CustomerTier, CustomerStatus } from "@/abstractions/ICustomer"
import { cn } from "@/lib/utils"

const TIER_STYLES: Record<CustomerTier, string> = {
  enterprise: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  premium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  basic: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
}

const STATUS_CONFIG: Record<CustomerStatus, { colour: string; label: string }> = {
  active: { colour: "bg-emerald-500", label: "Active" },
  pending: { colour: "bg-amber-400", label: "Pending" },
  inactive: { colour: "bg-slate-400", label: "Inactive" },
}

function formatZAR(value: number): string {
  return `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
}

export interface CustomerCardProps {
  customer: ICustomer
  onEdit: (customer: ICustomer) => void
  onDelete: (id: string) => void
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const { colour, label } = STATUS_CONFIG[customer.status]

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Header: avatar + name + tier badge */}
        <div className="flex items-center gap-3">
          <Avatar size="default">
            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1 min-w-0">
            <span className="text-sm font-semibold leading-none truncate">{customer.name}</span>
            <Badge
              variant="outline"
              className={cn("w-fit text-xs capitalize border-0 px-1.5 py-0", TIER_STYLES[customer.tier])}
            >
              {customer.tier}
            </Badge>
          </div>
        </div>

        {/* Detail rows */}
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <Mail className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">
              {customer.company || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{formatZAR(customer.totalSpent)}</span>
          </div>
        </div>

        {/* Footer: status indicator + action buttons */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full shrink-0", colour)} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onEdit(customer)}
              aria-label="Edit customer"
            >
              <Pencil className="size-3.5" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon-sm" variant="ghost" aria-label="Delete customer">
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-sm">Delete customer?</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs">
                    This will permanently remove <strong>{customer.name}</strong> and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete(customer.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
