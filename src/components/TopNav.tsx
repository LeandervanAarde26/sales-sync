import { NavLink } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/orders', label: 'Orders' },
  { to: '/customers', label: 'Customers' },
  { to: '/stock', label: 'Stock' },
  { to: '/calendar', label: 'Calendar' },
]

export default function TopNav() {
  return (
    <header className="sticky top-0 flex items-center justify-between border-border px-6 h-14">
      <NavigationMenu>
        <NavigationMenuList>
          {links.map(({ to, label }) => (
            <NavigationMenuItem key={to}>
              <NavLink to={to} end={to === '/'}>
                {({ isActive }) => (
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    data-active={isActive}
                  >
                    {label}
                  </NavigationMenuLink>
                )}
              </NavLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
        <Avatar>
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        Leander
      </div>
    </header>
  )
}
