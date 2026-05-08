import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  description?: string
  accent?: boolean
  index?: number
}

export function StatCard({ label, value, icon: Icon, description, accent, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'card-glass p-5 flex flex-col gap-3',
        accent && 'border-accent/30 bg-accent-subtle/20',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xs font-medium text-ink-muted uppercase tracking-widest">{label}</span>
        <div className={cn('p-1.5 rounded-lg', accent ? 'bg-accent/20' : 'bg-surface-3')}>
          <Icon size={13} className={accent ? 'text-accent-light' : 'text-ink-muted'} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-ink tabular-nums">{value}</div>
        {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
      </div>
    </motion.div>
  )
}
