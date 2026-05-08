import { motion } from 'framer-motion'
import { ShieldCheck, Star } from 'lucide-react'
import { TrustProgress } from './TrustProgress'
import { getTierLabel, getTierBadgeClasses, cn } from '@/lib/utils'
import type { UserTier } from '@/types'

interface TrustScoreCardProps {
  trustScore: number
  tier: UserTier
  totalTrustPoints: number
  introCredits: number
  isVerified: boolean
}

const TIER_DESCRIPTIONS: Record<UserTier, string> = {
  explorer:
    'New to the network. Build trust by completing your profile, joining a hub, and making quality connections.',
  connector:
    'An active and trusted member. You have built meaningful connections and contributed to the community.',
  ambassador:
    'A respected voice in the Macedonian diaspora. You are trusted to facilitate introductions and mentor others.',
  pillar:
    'A cornerstone of the network. Your reputation and contributions define what MKDiaspora stands for.',
}

export function TrustScoreCard({
  trustScore,
  tier,
  totalTrustPoints,
  introCredits,
  isVerified,
}: TrustScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-accent-light" />
          <span className="text-sm font-semibold text-ink">Trust Profile</span>
        </div>
        {isVerified && (
          <span className="flex items-center gap-1 text-2xs text-blue-400 bg-blue-950 border border-blue-800/50 px-2 py-0.5 rounded-md">
            <ShieldCheck size={9} /> Verified
          </span>
        )}
      </div>

      {/* Tier identity */}
      <div className={cn('p-3 rounded-xl border', getTierBadgeClasses(tier))}>
        <div className="text-xs font-semibold mb-1">{getTierLabel(tier)}</div>
        <p className="text-2xs leading-relaxed opacity-80">{TIER_DESCRIPTIONS[tier]}</p>
      </div>

      {/* Progress */}
      <TrustProgress score={trustScore} tier={tier} />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
        <div className="text-center">
          <div className="text-base font-bold text-ink">{totalTrustPoints}</div>
          <div className="text-2xs text-ink-faint mt-0.5">Trust Points</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star size={13} className="text-gold" />
            <span className="text-base font-bold text-ink">{introCredits}</span>
          </div>
          <div className="text-2xs text-ink-faint mt-0.5">Intro Credits</div>
        </div>
      </div>
    </motion.div>
  )
}
