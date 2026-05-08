import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface PlaceholderPageProps {
  icon: LucideIcon
  title: string
  description: string
  phase?: string
}

export function PlaceholderPage({ icon: Icon, title, description, phase = 'Phase 1' }: PlaceholderPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-1 items-center justify-center p-8"
    >
      <div className="card-glass max-w-md w-full p-10 text-center space-y-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-3 border border-border mx-auto">
          <Icon size={26} className="text-ink-muted" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
        </div>
        <span className="inline-block text-2xs font-medium px-3 py-1 rounded-full bg-surface-3 text-ink-faint border border-border uppercase tracking-widest">
          {phase}
        </span>
      </div>
    </motion.div>
  )
}
