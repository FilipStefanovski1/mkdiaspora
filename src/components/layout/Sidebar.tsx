import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Globe,
  MapPin,
  Handshake,
  Briefcase,
  CalendarDays,
  User,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApi } from '@/hooks/useApi'
import { getCurrentUser } from '@/lib/api'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/explore', icon: Globe, label: 'Explore' },
  { to: '/hubs', icon: MapPin, label: 'Hubs' },
  { to: '/intros', icon: Handshake, label: 'Introductions' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { to: '/events', icon: CalendarDays, label: 'Events' },
] as const

const navItemClass = (isActive: boolean) =>
  cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
    isActive
      ? 'bg-surface-3 text-ink'
      : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
  )

export function Sidebar() {
  const { data: user } = useApi(getCurrentUser)

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-surface-1 border-r border-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <div>
            <span className="text-sm font-bold text-ink tracking-tight">MKDiaspora</span>
            <div className="text-2xs text-ink-faint leading-none mt-0.5">
              Trusted Macedonian Network
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => navItemClass(isActive)}>
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User profile footer */}
      <div className="px-3 py-3 border-t border-border space-y-0.5">
        <NavLink to="/profile" className={({ isActive }) => navItemClass(isActive)}>
          <User size={16} className="shrink-0" />
          Profile
        </NavLink>

        <button className={navItemClass(false)}>
          <Settings size={16} className="shrink-0" />
          Settings
        </button>

        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl bg-surface-2 border border-border">
            <Avatar src={user.avatarUrl} name={user.fullName} size="sm" tier={user.tier} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-ink truncate">{user.fullName}</div>
              <TierBadge tier={user.tier} className="mt-0.5" />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
