import { getTierLabel, getTierBadgeClasses, cn } from '@/lib/utils'
import type { UserTier } from '@/types'

interface TierBadgeProps {
  tier: UserTier
  className?: string
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-semibold border',
        getTierBadgeClasses(tier),
        className,
      )}
    >
      {getTierLabel(tier)}
    </span>
  )
}
