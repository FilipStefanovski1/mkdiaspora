import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  meta?: string
}

export function PageHeader({ title, description, action, meta }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start justify-between gap-4 mb-8"
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          {meta && (
            <span className="px-2 py-0.5 rounded-md bg-surface-3 border border-border text-xs text-ink-muted">
              {meta}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-ink-muted mt-1 max-w-xl">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  )
}
