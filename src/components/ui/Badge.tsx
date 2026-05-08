import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export type BadgeVariant = 'default' | 'accent' | 'gold' | 'blue' | 'green' | 'outline'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-surface-3 text-ink-muted border border-border',
  accent: 'bg-accent-subtle text-accent-light border border-accent/30',
  gold: 'bg-gold-subtle text-gold border border-gold-muted/40',
  blue: 'bg-blue-950 text-blue-300 border border-blue-800/50',
  green: 'bg-emerald-950 text-emerald-400 border border-emerald-800/50',
  outline: 'border border-border text-ink-muted bg-transparent',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-medium',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
