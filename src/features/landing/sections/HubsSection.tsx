import { motion } from 'framer-motion'
import { Users, Lock, ArrowRight } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getHubDetails } from '@/lib/api'
import { formatNumber } from '@/lib/utils'
import type { HubDetail } from '@/types'

const COUNTRY_FLAGS: Record<string, string> = {
  DE: '🇩🇪', GB: '🇬🇧', US: '🇺🇸', CA: '🇨🇦',
  AT: '🇦🇹', CH: '🇨🇭', AU: '🇦🇺', AE: '🇦🇪',
}

function PublicHubCard({ hub, index }: { hub: HubDetail; index: number }) {
  const flag = COUNTRY_FLAGS[hub.countryCode] ?? '🌐'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group rounded-2xl border border-border/60 bg-surface-2/30 hover:bg-surface-2/60 hover:border-border transition-all duration-300 overflow-hidden"
    >
      {/* Top */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="text-3xl">{flag}</span>
          <span
            className={`text-2xs font-medium px-2 py-0.5 rounded-full border ${
              hub.isActive
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40'
                : 'text-ink-faint bg-surface-3 border-border'
            }`}
          >
            {hub.isActive ? 'Active' : 'Forming'}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-ink">{hub.city}</h3>
        <p className="text-xs text-ink-faint mt-0.5">{hub.country}</p>

        <div className="flex items-center gap-1.5 mt-3 text-sm text-ink-muted">
          <Users size={13} />
          <span>
            <span className="font-semibold text-ink">{formatNumber(hub.memberCount)}</span> members
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {hub.topIndustries.slice(0, 3).map((ind) => (
            <span
              key={ind}
              className="px-2 py-0.5 rounded-full text-2xs bg-surface-3 border border-border/60 text-ink-faint"
            >
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* Activity line */}
      {hub.recentActivity && (
        <div className="px-5 py-3 border-t border-border/40 bg-surface-3/20">
          <p className="text-xs text-ink-faint line-clamp-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block mr-2 mb-px" />
            {hub.recentActivity}
          </p>
        </div>
      )}

      {/* Locked CTA */}
      <div className="px-5 py-4 border-t border-border/40">
        <div className="flex items-center justify-between text-xs text-ink-faint group-hover:text-ink-muted transition-colors">
          <span className="flex items-center gap-1.5">
            <Lock size={11} />
            <span>Join to see members &amp; events</span>
          </span>
          <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  )
}

export function HubsSection() {
  const { data: hubs, isLoading } = useApi(getHubDetails)

  const visibleHubs = (hubs ?? []).filter((h) => h.isActive).slice(0, 4)

  return (
    <section className="py-24 md:py-32 bg-surface-1 border-y border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.2em] text-accent uppercase mb-4">City Hubs</p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h2 className="font-editorial text-3xl md:text-4xl text-ink max-w-md">
              Your people are
              <span className="italic text-ink-muted"> already there.</span>
            </h2>
            <p className="text-base text-ink-muted max-w-xs">
              Local communities in every major diaspora city.
              Events, intros, and support — all in one place.
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-surface-2/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleHubs.map((hub, i) => (
              <PublicHubCard key={hub.id} hub={hub} index={i} />
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 text-sm text-ink-faint"
        >
          8 active hubs · 40+ cities with members
        </motion.p>
      </div>
    </section>
  )
}
