import { motion } from 'framer-motion'
import { Handshake, Briefcase, CalendarDays, BookOpen, MapPin, ShieldCheck } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'
import type { ContributionItem, ContributionType } from '@/types'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<ContributionType, LucideIcon> = {
  intro_made: Handshake,
  opportunity_posted: Briefcase,
  event_organized: CalendarDays,
  mentor_session: BookOpen,
  hub_joined: MapPin,
  profile_verified: ShieldCheck,
}

const LABEL_MAP: Record<ContributionType, string> = {
  intro_made: 'Intro Made',
  opportunity_posted: 'Opportunity Posted',
  event_organized: 'Event Organized',
  mentor_session: 'Mentorship Session',
  hub_joined: 'Hub Joined',
  profile_verified: 'Profile Verified',
}

interface ContributionListProps {
  contributions: ContributionItem[]
  limit?: number
}

export function ContributionList({ contributions, limit }: ContributionListProps) {
  const items = limit ? contributions.slice(0, limit) : contributions

  if (items.length === 0) {
    return (
      <p className="text-xs text-ink-faint text-center py-6">
        No contributions recorded yet.
      </p>
    )
  }

  return (
    <ul className="space-y-0.5">
      {items.map((item, i) => {
        const Icon = ICON_MAP[item.type]
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-surface-3 border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={13} className="text-ink-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-2xs font-medium text-accent-light/70 uppercase tracking-wide">
                {LABEL_MAP[item.type]}
              </div>
              <p className="text-xs text-ink-muted leading-relaxed mt-0.5 line-clamp-2">
                {item.description}
              </p>
              <span className="text-2xs text-ink-faint">{formatRelativeDate(item.date)}</span>
            </div>
            {item.trustPoints > 0 && (
              <span className="text-2xs font-semibold text-gold flex-shrink-0 mt-1">
                +{item.trustPoints}
              </span>
            )}
          </motion.li>
        )
      })}
    </ul>
  )
}
