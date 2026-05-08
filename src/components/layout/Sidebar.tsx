import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Globe,
  MapPin,
  Handshake,
  Briefcase,
  CalendarDays,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/explore', icon: Globe, label: 'Explore' },
  { to: '/hubs', icon: MapPin, label: 'Hubs' },
  { to: '/intros', icon: Handshake, label: 'Introductions' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { to: '/events', icon: CalendarDays, label: 'Events' },
] as const

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-surface-1 border-r border-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <span className="text-lg font-bold text-ink tracking-tight">MKDiaspora</span>
        <p className="text-2xs text-ink-faint mt-0.5 uppercase tracking-widest">Phase 0</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-surface-3 text-ink'
                  : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
              )
            }
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profile stub */}
      <div className="px-3 py-4 border-t border-border">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive
                ? 'bg-surface-3 text-ink'
                : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
            )
          }
        >
          <User size={16} className="shrink-0" />
          Profile
        </NavLink>
      </div>
    </aside>
  )
}
