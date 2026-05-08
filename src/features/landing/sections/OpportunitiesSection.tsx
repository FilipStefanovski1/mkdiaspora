import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getOpportunities } from '@/lib/api'
import { Avatar } from '@/components/ui/Avatar'
import type { Opportunity } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  job: 'Job', investment: 'Investment', cofounder: 'Co-Founder',
  mentorship: 'Mentorship', contract: 'Contract', advisory: 'Advisory',
}

const TYPE_COLORS: Record<string, string> = {
  job: 'text-blue-400 bg-blue-950/50 border-blue-800/30',
  investment: 'text-gold bg-gold-subtle border-gold-muted/30',
  cofounder: 'text-accent-light bg-accent-subtle border-accent-muted/30',
  mentorship: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/30',
  contract: 'text-purple-400 bg-purple-950/50 border-purple-800/30',
  advisory: 'text-ink-muted bg-surface-3 border-border',
}

function PublicOpportunityCard({ opp, index }: { opp: Opportunity; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="group relative rounded-2xl border border-border/60 bg-surface-2/30 hover:bg-surface-2/50 transition-all duration-300 overflow-hidden"
    >
      {/* Type badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`text-2xs font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[opp.type] ?? TYPE_COLORS.advisory}`}
        >
          {TYPE_LABELS[opp.type] ?? opp.type}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div className="pr-16">
          <h3 className="text-sm font-semibold text-ink leading-snug">{opp.title}</h3>
          <p className="text-xs text-ink-faint mt-1">{opp.location}</p>
        </div>

        {/* Posted by */}
        <div className="flex items-center gap-2">
          <Avatar src={opp.postedBy.avatarUrl} name={opp.postedBy.fullName} size="xs" />
          <span className="text-xs text-ink-muted">{opp.postedBy.fullName}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {opp.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-2xs rounded-full bg-surface-3 border border-border/60 text-ink-faint"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Locked gate */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <Lock size={11} className="text-ink-faint" />
          <span className="text-xs text-ink-faint">
            {opp.isIntroRequired ? 'Intro required to apply' : 'Members only'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function OpportunitiesSection() {
  const { data: response, isLoading } = useApi(() => getOpportunities(undefined, 1, 3))

  return (
    <section className="py-24 md:py-32 bg-surface-1 border-y border-border/40">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.2em] text-accent uppercase mb-4">Opportunities</p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h2 className="font-editorial text-3xl md:text-4xl text-ink max-w-sm">
              Opportunities move through the network,
              <span className="italic text-ink-muted"> not job boards.</span>
            </h2>
            <p className="text-sm text-ink-muted max-w-xs">
              Jobs, co-founder searches, investment rounds, mentorships.
              Posted by trusted members, accessible through warm intros.
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-surface-2/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(response?.data ?? []).map((opp, i) => (
              <PublicOpportunityCard key={opp.id} opp={opp} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
