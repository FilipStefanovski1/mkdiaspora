import { motion } from 'framer-motion'
import { getTierLabel, getTierColor } from '@/lib/utils'
import type { UserTier } from '@/types'

interface TrustProgressProps {
  score: number
  tier: UserTier
}

const THRESHOLDS: Record<UserTier, { min: number; max: number; next: UserTier | null }> = {
  explorer:   { min: 0,  max: 40,  next: 'connector' },
  connector:  { min: 40, max: 70,  next: 'ambassador' },
  ambassador: { min: 70, max: 90,  next: 'pillar' },
  pillar:     { min: 90, max: 100, next: null },
}

const TIER_BAR: Record<UserTier, string> = {
  explorer:   'bg-ink-faint',
  connector:  'bg-blue-400',
  ambassador: 'bg-accent-light',
  pillar:     'bg-gold',
}

export function TrustProgress({ score, tier }: TrustProgressProps) {
  const { min, max, next } = THRESHOLDS[tier]
  const pct = Math.min(100, ((score - min) / (max - min)) * 100)
  const isPillar = tier === 'pillar'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${getTierColor(tier)}`}>{getTierLabel(tier)}</span>
        {next && (
          <span className="text-ink-faint">
            {max - score} pts to {getTierLabel(next)}
          </span>
        )}
        {isPillar && <span className="text-gold text-2xs">Maximum tier</span>}
      </div>

      <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${TIER_BAR[tier]}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      <div className="flex justify-between text-2xs text-ink-faint">
        <span>{score} pts</span>
        {!isPillar && <span>{max} pts</span>}
      </div>
    </div>
  )
}
