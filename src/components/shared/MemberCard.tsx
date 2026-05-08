import { motion } from 'framer-motion'
import { MapPin, CheckCircle2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { User } from '@/types'

interface MemberCardProps {
  user: User
  index?: number
  onIntroRequest?: (userId: string) => void
}

export function MemberCard({ user, index = 0, onIntroRequest }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="card-glass p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar src={user.avatarUrl} name={user.fullName} size="md" tier={user.tier} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-ink">{user.fullName}</span>
            {user.isVerified && (
              <CheckCircle2 size={12} className="text-blue-400 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <TierBadge tier={user.tier} />
            {user.mutualConnections != null && user.mutualConnections > 0 && (
              <span className="text-2xs text-ink-faint">{user.mutualConnections} mutual</span>
            )}
          </div>
        </div>
      </div>

      {/* Headline */}
      <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed -mt-1">
        {user.headline}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-ink-faint">
        <MapPin size={11} />
        <span>
          {user.location.city}, {user.location.country}
        </span>
      </div>

      {/* Open-to tags */}
      {user.openTo.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {user.openTo.slice(0, 3).map((type) => (
            <Badge key={type} variant="outline" className="capitalize text-2xs">
              {type}
            </Badge>
          ))}
        </div>
      )}

      {/* CTA */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full border border-border/60 hover:border-accent/40 hover:text-accent-light mt-auto"
        onClick={() => onIntroRequest?.(user.id)}
      >
        Request Intro
      </Button>
    </motion.div>
  )
}
