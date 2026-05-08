import { Clock, CheckCircle2, XCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IntroStatus } from '@/types'

interface IntroStatusBadgeProps {
  status: IntroStatus
  className?: string
}

const CONFIG: Record<IntroStatus, { label: string; icon: typeof Clock; classes: string }> = {
  pending:   { label: 'Pending',   icon: Clock,         classes: 'bg-surface-3 text-ink-muted border-border' },
  accepted:  { label: 'Accepted',  icon: CheckCircle2,  classes: 'bg-emerald-950 text-emerald-400 border-emerald-800/50' },
  declined:  { label: 'Declined',  icon: XCircle,       classes: 'bg-red-950 text-red-400 border-red-800/50' },
  completed: { label: 'Completed', icon: Star,          classes: 'bg-gold-subtle text-gold border-gold-muted/40' },
}

export function IntroStatusBadge({ status, className }: IntroStatusBadgeProps) {
  const { label, icon: Icon, classes } = CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-medium border',
        classes,
        className,
      )}
    >
      <Icon size={10} />
      {label}
    </span>
  )
}
