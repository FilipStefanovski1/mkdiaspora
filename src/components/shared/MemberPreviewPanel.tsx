import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, MapPin, CheckCircle2, ChevronRight, Bookmark } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConnectionPathDisplay } from '@/components/trust/ConnectionPathDisplay'
import { IntroRequestModal } from '@/components/shared/IntroRequestModal'
import { useApi } from '@/hooks/useApi'
import { getIntroStats, getProfileDetail } from '@/lib/api'
import type { User } from '@/types'

const OPEN_TO_LABELS: Record<string, string> = {
  mentoring: 'Mentoring', hiring: 'Hiring', investing: 'Investing',
  collaborating: 'Collaborating', relocating: 'Relocating',
  advising: 'Advising', cofounding: 'Co-founding',
}

interface MemberPreviewPanelProps {
  user: User
  onClose: () => void
}

export function MemberPreviewPanel({ user, onClose }: MemberPreviewPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const { data: profile } = useApi(
    () => getProfileDetail(user.id),
    [user.id],
  )
  const { data: introStats } = useApi(getIntroStats)

  const credits = introStats?.creditsRemaining ?? user.introCredits
  const connectionPath = profile?.connectionPath ?? null

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-72 flex-shrink-0 card-glass flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
            Profile Preview
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-faint hover:text-ink hover:bg-surface-3 transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Identity */}
          <div className="flex items-start gap-3">
            <Avatar src={user.avatarUrl} name={user.fullName} size="lg" tier={user.tier} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-ink">{user.fullName}</span>
                {user.isVerified && <CheckCircle2 size={11} className="text-blue-400" />}
              </div>
              <TierBadge tier={user.tier} className="mt-0.5" />
              <div className="flex items-center gap-1 mt-1.5 text-2xs text-ink-faint">
                <MapPin size={9} />
                <span>{user.location.city}, {user.location.country}</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <p className="text-xs text-ink-muted leading-relaxed">{user.headline}</p>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-2 rounded-xl p-2.5 text-center">
              <div className="text-sm font-bold text-ink">{user.connections}</div>
              <div className="text-2xs text-ink-faint">connections</div>
            </div>
            <div className="bg-surface-2 rounded-xl p-2.5 text-center">
              <div className="text-sm font-bold text-ink">{user.trustScore}</div>
              <div className="text-2xs text-ink-faint">trust score</div>
            </div>
          </div>

          {/* Mutual connections */}
          {user.mutualConnections != null && user.mutualConnections > 0 && (
            <div className="text-2xs text-ink-muted bg-surface-2 rounded-xl px-3 py-2">
              <span className="text-accent-light font-medium">{user.mutualConnections} mutual</span> connections
              {" "}in your network
            </div>
          )}

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-2xs text-ink-faint uppercase tracking-widest">Skills</span>
              <div className="flex flex-wrap gap-1">
                {user.skills.slice(0, 5).map((s) => (
                  <Badge key={s} variant="default" className="text-2xs">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Open to */}
          {user.openTo.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-2xs text-ink-faint uppercase tracking-widest">Open To</span>
              <div className="flex flex-wrap gap-1">
                {user.openTo.map((o) => (
                  <Badge key={o} variant="accent" className="text-2xs">
                    {OPEN_TO_LABELS[o] ?? o}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Connection path */}
          {connectionPath && (
            <div className="space-y-1.5">
              <span className="text-2xs text-ink-faint uppercase tracking-widest">Connection Path</span>
              <ConnectionPathDisplay path={connectionPath} />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-border p-4 space-y-2">
          <Button
            variant="primary"
            size="sm"
            className="w-full flex items-center gap-1.5"
            onClick={() => setIsModalOpen(true)}
            disabled={credits === 0}
          >
            <ChevronRight size={13} />
            Request Introduction
          </Button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsSaved((v) => !v)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-2xs rounded-lg font-medium border transition-all ${
                isSaved
                  ? 'bg-gold-subtle text-gold border-gold-muted/40'
                  : 'bg-surface-3 hover:bg-surface-4 text-ink-muted border-border'
              }`}
            >
              <Bookmark size={11} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <Link
              to={`/profile/${user.id}`}
              className="flex-1 flex items-center justify-center text-2xs text-ink-muted hover:text-ink bg-surface-3 hover:bg-surface-4 rounded-lg border border-border transition-colors px-3 py-1.5"
            >
              Full Profile
            </Link>
          </div>

          <p className="text-2xs text-ink-faint text-center">
            {credits} intro credit{credits !== 1 ? 's' : ''} remaining
          </p>
        </div>
      </motion.aside>

      <IntroRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipient={user}
        introCredits={credits}
      />
    </>
  )
}
