import { motion } from 'framer-motion'
import { Sparkles, MapPin, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { Badge } from '@/components/ui/Badge'
import type { RecommendedMember, RecommendedHub, RecommendedOpportunity } from '@/types'
import { formatNumber } from '@/lib/utils'

// ─── Reason pill ─────────────────────────────────────────────────────────────

function ReasonPill({ reason }: { reason: string }) {
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-subtle border border-gold-muted/30 w-fit">
      <Sparkles size={9} className="text-gold flex-shrink-0" />
      <span className="text-2xs text-gold leading-none">{reason}</span>
    </div>
  )
}

// ─── Member recommendation card ───────────────────────────────────────────────

export function RecommendedMemberCard({
  item,
  index = 0,
  onIntroRequest,
}: {
  item: RecommendedMember
  index?: number
  onIntroRequest?: (userId: string) => void
}) {
  const { user, reason } = item

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      className="card-glass p-4 flex flex-col gap-3"
    >
      <Link to={`/profile/${user.id}`} className="flex items-start gap-3 group">
        <Avatar src={user.avatarUrl} name={user.fullName} size="md" tier={user.tier} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-ink group-hover:text-accent-light transition-colors">
              {user.fullName}
            </span>
            {user.isVerified && <CheckCircle2 size={11} className="text-blue-400" />}
          </div>
          <TierBadge tier={user.tier} className="mt-0.5" />
          <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed">
            {user.headline}
          </p>
          <div className="flex items-center gap-1 mt-1 text-2xs text-ink-faint">
            <MapPin size={9} />
            <span>{user.location.city}</span>
          </div>
        </div>
      </Link>

      <ReasonPill reason={reason} />

      <div className="flex items-center gap-2 pt-1 border-t border-border/60">
        <Link
          to={`/profile/${user.id}`}
          className="flex-1 text-center text-2xs text-ink-muted hover:text-ink transition-colors py-1"
        >
          View Profile
        </Link>
        <button
          onClick={() => onIntroRequest?.(user.id)}
          className="flex-1 px-3 py-1.5 text-2xs font-medium rounded-lg bg-accent/10 hover:bg-accent/20 text-accent-light transition-colors border border-accent/20"
        >
          Request Intro
        </button>
      </div>
    </motion.div>
  )
}

// ─── Hub recommendation card ──────────────────────────────────────────────────

const COUNTRY_FLAGS: Record<string, string> = {
  DE: '🇩🇪', GB: '🇬🇧', US: '🇺🇸', CA: '🇨🇦',
  AT: '🇦🇹', CH: '🇨🇭', AU: '🇦🇺', AE: '🇦🇪',
}

export function RecommendedHubCard({
  item,
  index = 0,
}: {
  item: RecommendedHub
  index?: number
}) {
  const { hub, reason } = item
  const flag = COUNTRY_FLAGS[hub.countryCode] ?? '🌐'
  const slug = hub.city.toLowerCase().replace(/\s+/g, '-')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      className="card-glass p-4 flex flex-col gap-3"
    >
      <Link to={`/hubs/${slug}`} className="group">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{flag}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink group-hover:text-accent-light transition-colors">
                {hub.city}
              </span>
              <Badge variant={hub.isActive ? 'green' : 'default'}>
                {hub.isActive ? 'Active' : 'Forming'}
              </Badge>
            </div>
            <p className="text-2xs text-ink-faint mt-0.5">{hub.country}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-ink-muted">
          <span>
            <span className="font-semibold text-ink">{formatNumber(hub.memberCount)}</span> members
          </span>
          <div className="flex gap-1">
            {hub.topIndustries.slice(0, 2).map((ind) => (
              <Badge key={ind} variant="outline" className="text-2xs">{ind}</Badge>
            ))}
          </div>
        </div>
      </Link>

      <ReasonPill reason={reason} />

      <Link
        to={`/hubs/${slug}`}
        className="block text-center text-2xs font-medium py-1.5 rounded-lg bg-surface-3 hover:bg-surface-4 text-ink-muted hover:text-ink transition-colors border border-border"
      >
        View Hub
      </Link>
    </motion.div>
  )
}

// ─── Opportunity recommendation card ─────────────────────────────────────────

const OPP_TYPE_LABELS: Record<string, string> = {
  job: 'Job',
  investment: 'Investment',
  cofounder: 'Co-Founder',
  mentorship: 'Mentorship',
  contract: 'Contract',
  advisory: 'Advisory',
}

export function RecommendedOpportunityCard({
  item,
  index = 0,
}: {
  item: RecommendedOpportunity
  index?: number
}) {
  const { opportunity: opp, reason } = item

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      className="card-glass p-4 flex flex-col gap-3"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-ink leading-snug">{opp.title}</span>
          <Badge variant="accent" className="flex-shrink-0">
            {OPP_TYPE_LABELS[opp.type] ?? opp.type}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-2xs text-ink-faint">
          <Avatar
            src={opp.postedBy.avatarUrl}
            name={opp.postedBy.fullName}
            size="xs"
          />
          <span>{opp.postedBy.fullName}</span>
          <span>·</span>
          <span>{opp.location}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {opp.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-2xs">{t}</Badge>
          ))}
        </div>
      </div>

      <ReasonPill reason={reason} />

      <Link
        to="/opportunities"
        className="block text-center text-2xs font-medium py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent-light transition-colors border border-accent/20"
      >
        View Opportunity
      </Link>
    </motion.div>
  )
}
