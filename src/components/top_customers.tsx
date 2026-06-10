import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type CustomerTier = "enterprise" | "premium" | "casual"

interface Customer {
  id: string
  name: string
  avatarUrl?: string
  totalSpent: string
  tier: CustomerTier
}

const TIER_STYLES: Record<CustomerTier, string> = {
  enterprise: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  premium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  casual: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
}

// Placeholder — replace with real data from API
const TOP_CUSTOMERS: Customer[] = [
  { id: "1", name: "Jane Doe", totalSpent: "R 12 400.00", tier: "enterprise" },
  { id: "2", name: "John Smith", totalSpent: "R 8 750.00", tier: "premium" },
  { id: "3", name: "Sarah Lee", totalSpent: "R 3 200.00", tier: "casual" },
  { id: "4", name: "Mark Nkosi", totalSpent: "R 2 900.00", tier: "premium" },
  { id: "5", name: "Priya Patel", totalSpent: "R 2 100.00", tier: "casual" },
  { id: "6", name: "Carlos Mendes", totalSpent: "R 1 800.00", tier: "enterprise" },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <Avatar size="default">
        {customer.avatarUrl && <AvatarImage src={customer.avatarUrl} alt={customer.name} />}
        <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-sm font-semibold leading-none truncate">{customer.name}</span>
        <span className="text-xs text-muted-foreground leading-none mt-1">{customer.totalSpent}</span>
      </div>

      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize", TIER_STYLES[customer.tier])}>
        {customer.tier}
      </span>
    </div>
  )
}

export function TopCustomers() {
  return (
    <Card className="flex flex-col col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top Customers</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 px-8">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-4 pl-3 pr-3">
            {TOP_CUSTOMERS.map((customer) => (
              <CarouselItem key={customer.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 border-r border-border last:border-r-0">
                <CustomerCard customer={customer} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-7" />
          <CarouselNext className="-right-7" />
        </Carousel>
      </CardContent>
    </Card>
  )
}
