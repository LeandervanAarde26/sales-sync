import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/orders", label: "Orders" },
  { to: "/customers", label: "Customers" },
  { to: "/stock", label: "Stock" },
  { to: "/calendar", label: "Calendar" },
  { to: "/reps", label: "Reps" },
]

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    "px-3 py-1.5 text-sm rounded-md transition-colors",
    isActive
      ? "bg-muted font-medium text-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
  )
}

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="flex items-center justify-between px-6 h-14">
        <span className="text-sm font-semibold tracking-tight">SalesSync</span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">A</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">Admin</span>
          </div>

          <button
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <nav className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(navLinkClass({ isActive }), "py-2.5")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
