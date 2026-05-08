import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { useApi } from '@/hooks/useApi'
import { getHubs } from '@/lib/api'

const GlobeView = lazy(() =>
  import('@/components/shared/GlobeView').then((m) => ({ default: m.GlobeView })),
)

export function GlobeSection() {
  const { data: hubs } = useApi(getHubs)

  return (
    <section className="py-20 md:py-28 bg-surface overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.2em] text-accent uppercase mb-4">Global Presence</p>
          <h2 className="font-editorial text-3xl md:text-4xl text-ink">
            Look how far we've spread.
          </h2>
          <p className="mt-4 text-base text-ink-muted max-w-sm mx-auto">
            Eight active city hubs. Forty cities with members.
            One trusted network.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Suspense
            fallback={
              <div className="h-[460px] rounded-2xl border border-border bg-surface-1/60 animate-pulse" />
            }
          >
            <GlobeView hubs={hubs ?? []} height={460} />
          </Suspense>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-xs text-ink-faint mt-6"
        >
          Click a hub pin to preview the community
        </motion.p>
      </div>
    </section>
  )
}
