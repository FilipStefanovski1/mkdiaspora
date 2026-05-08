import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getHubs } from '@/lib/api'

const GlobeBackground = lazy(() =>
  import('@/components/shared/GlobeView').then((m) => ({ default: m.GlobeBackground })),
)

const CITIES = ['BERLIN', 'LONDON', 'TORONTO', 'NEW YORK', 'VIENNA', 'DUBAI']

interface HeroSectionProps {
  onApply: () => void
}

export function HeroSection({ onApply }: HeroSectionProps) {
  const { data: hubs } = useApi(getHubs)

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden flex items-center justify-center bg-surface">
      {/* Globe background */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-full bg-gradient-radial from-accent-subtle/40 via-surface-1 to-surface" />
          }
        >
          <GlobeBackground hubs={hubs ?? []} height={typeof window !== 'undefined' ? window.innerHeight : 700} />
        </Suspense>
      </div>

      {/* Layered gradient overlay — creates depth and text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/50 to-surface/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface/40 via-transparent to-surface/40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">

        {/* City names — stagger in first */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-10">
          {CITIES.map((city, i) => (
            <motion.span
              key={city}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
              className="text-xs tracking-[0.28em] text-ink-faint uppercase font-medium"
            >
              {city}
            </motion.span>
          ))}
        </div>

        {/* Editorial headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-editorial text-[2.6rem] sm:text-6xl md:text-7xl text-ink leading-[1.1] tracking-tight text-balance"
        >
          There are Macedonians
          <br />
          <span className="italic text-ink-muted">everywhere.</span>
          <br />
          You should know them.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.7 }}
          className="mt-7 text-base md:text-lg text-ink-muted max-w-md leading-relaxed"
        >
          A private network of Macedonian professionals across 40+ cities.
          Warm introductions. Local communities. Real opportunities.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          onClick={onApply}
          className="mt-10 px-9 py-4 bg-accent hover:bg-accent-light text-white rounded-2xl text-base font-semibold transition-all shadow-glow-accent hover:shadow-glow-accent"
        >
          Apply to Join
        </motion.button>

        {/* Social proof whisper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.7 }}
          className="mt-5 text-xs text-ink-faint tracking-wide"
        >
          2,100+ members&nbsp;&nbsp;·&nbsp;&nbsp;8 active hubs&nbsp;&nbsp;·&nbsp;&nbsp;340+ intros made
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-faint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 3, duration: 0.6 },
          y: { delay: 3.2, repeat: Infinity, duration: 1.6, ease: 'easeInOut' },
        }}
      >
        <ChevronDown size={20} />
      </motion.div>
    </section>
  )
}
