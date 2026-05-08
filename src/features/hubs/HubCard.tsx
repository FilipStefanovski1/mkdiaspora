import { motion } from 'framer-motion'
import { Users, Handshake, CalendarDays, Briefcase, CheckCircle2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatNumber } from '@/lib/utils'
import type { HubDetail } from '@/types'

interface HubCardProps {
  hub: HubDetail
  index?: number
  featured?: boolean
}

const COUNTRY_FLAGS: Record<string, string> = {
  DE: '🇩🇪', GB: '🇬🇧', US: '🇺🇸', CA: '🇨🇦',
  AT: '🇦🇹', CH: '🇨🇭', AU: '🇦🇺', AE: '🇦🇪',
}

export function HubCard({ hub, index = 0, featured = false }: HubCardProps) {
  const flag = COUNTRY_FLAGS[hub.countryCode] ?? '🌐'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`card-glass flex flex-col gap-4 overflow-hidden ${featured ? 'p-6' : 'p-5'}`}
    >
      {/* Top: city + status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{flag}</span>
            <h3 className={`font-bold text-ink ${featured ? 'text-xl' : 'text-base'}`}>
              {hub.city}
            </h3>
            {hub.isJoined && (
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-ink-muted">
            <MapPin size={11} />
            <span>{hub.country}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge variant={hub.isActive ? 'green' : 'default'}>
            {hub.isActive ? 'Active' : 'Forming'}
          </Badge>
          {hub.isJoined && <Badge variant="accent">Joined</Badge>}
        </div>
      </div>

      {/* Description (featured only) */}
      {featured && hub.description && (
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
          {hub.description}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Users,       value: formatNumber(hub.memberCount),    label: 'Members' },
          { icon: Handshake,   value: hub.activeHelpers,                label: 'Helpers' },
          { icon: CalendarDays,value: hub.upcomingEventCount,           label: 'Events' },
          { icon: Briefcase,   value: hub.opportunityCount,             label: 'Opps' },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-3/60">
            <Icon size={13} className="text-ink-muted" />
            <span className="text-sm font-bold text-ink tabular-nums">{value}</span>
            <span className="text-2xs text-ink-faint">{label}</span>
          </div>
        ))}
      </div>

      {/* Focus tags */}
      <div className="flex flex-wrap gap-1.5">
        {hub.focusTags.slice(0, featured ? 5 : 3).map((tag) => (
          <Badge key={tag} variant="default">{tag}</Badge>
        ))}
      </div>

      {/* Ambassador */}
      {hub.ambassador && (
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-3/60 border border-border/50">
          <Avatar
            src={hub.ambassador.avatarUrl}
            name={hub.ambassador.fullName}
            size="sm"
            tier={hub.ambassador.tier}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-ink truncate">{hub.ambassador.fullName}</span>
              <TierBadge tier={hub.ambassador.tier} />
            </div>
            <span className="text-2xs text-ink-faint">{hub.ambassador.role}</span>
          </div>
        </div>
      )}

      {/* Activity + CTA */}
      {hub.recentActivity && (
        <p className="text-2xs text-ink-faint">{hub.recentActivity}</p>
      )}

      <div className="flex gap-2 mt-auto">
        <Link
          to={`/hubs/${hub.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-xl font-medium bg-surface-3 hover:bg-surface-4 text-ink border border-border transition-all"
        >
          View Hub
        </Link>
        {!hub.isJoined ? (
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-xl font-medium bg-accent hover:bg-accent-light text-white transition-all">
            Join Hub
          </button>
        ) : (
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-xl font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/50 transition-all cursor-default">
            <CheckCircle2 size={12} /> Joined
          </button>
        )}
      </div>
    </motion.div>
  )
}
