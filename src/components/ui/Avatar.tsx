import { getInitials, cn } from '@/lib/utils'
import type { UserTier } from '@/types'

interface AvatarProps {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  tier?: UserTier
  className?: string
}

const SIZES = {
  xs: 'w-6 h-6 text-2xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const TIER_RING: Record<UserTier, string> = {
  explorer: 'ring-ink-faint/30',
  connector: 'ring-blue-500/40',
  ambassador: 'ring-accent/50',
  pillar: 'ring-gold/60',
}

export function Avatar({ src, name, size = 'md', tier, className }: AvatarProps) {
  const ringClass = tier ? `ring-2 ${TIER_RING[tier]}` : ''

  return (
    <div
      className={cn(
        'relative flex-shrink-0 rounded-full overflow-hidden bg-surface-3',
        SIZES[size],
        ringClass,
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-ink-muted font-semibold">
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}
