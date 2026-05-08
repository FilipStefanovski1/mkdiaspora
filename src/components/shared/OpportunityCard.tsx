import { motion } from 'framer-motion'
import { MapPin, Users, Clock } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatRelativeDate } from '@/lib/utils'
import type { Opportunity, OpportunityType } from '@/types'
import type { BadgeVariant } from '@/components/ui/Badge'

const TYPE_LABELS: Record<OpportunityType, string> = {
  job: 'Job',
  investment: 'Investment',
  cofounder: 'Co-Founder',
  mentorship: 'Mentorship',
  contract: 'Contract',
  advisory: 'Advisory',
}

const TYPE_VARIANT: Record<OpportunityType, BadgeVariant> = {
  job: 'blue',
  investment: 'gold',
  cofounder: 'accent',
  mentorship: 'green',
  contract: 'default',
  advisory: 'default',
}

interface OpportunityCardProps {
  opportunity: Opportunity
  index?: number
}

export function OpportunityCard({ opportunity: opp, index = 0 }: OpportunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="card-glass p-5 flex flex-col gap-4"
    >
      {/* Type + flags */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={TYPE_VARIANT[opp.type]}>{TYPE_LABELS[opp.type]}</Badge>
          {opp.isRemote && <Badge variant="outline">Remote</Badge>}
          {opp.isIntroRequired && (
            <Badge variant="accent">Intro Required</Badge>
          )}
        </div>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="text-sm font-semibold text-ink">{opp.title}</h3>
        <p className="text-xs text-ink-muted mt-1.5 line-clamp-2 leading-relaxed">
          {opp.description}
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-ink-faint -mt-1">
        <MapPin size={11} />
        <span>{opp.location}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {opp.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Footer: poster + meta */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Avatar
          src={opp.postedBy.avatarUrl}
          name={opp.postedBy.fullName}
          size="xs"
          tier={opp.postedBy.tier}
        />
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <span className="text-xs text-ink truncate">{opp.postedBy.fullName}</span>
          <TierBadge tier={opp.postedBy.tier} />
        </div>
        <div className="flex items-center gap-3 text-2xs text-ink-faint flex-shrink-0">
          {opp.applicants != null && (
            <span className="flex items-center gap-1">
              <Users size={10} />
              {opp.applicants}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatRelativeDate(opp.postedAt)}
          </span>
        </div>
      </div>

      <Button variant="secondary" size="sm" className="w-full">
        View Details
      </Button>
    </motion.div>
  )
}
