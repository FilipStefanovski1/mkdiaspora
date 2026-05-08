import { motion } from 'framer-motion'

interface FinalCTASectionProps {
  onApply: () => void
}

export function FinalCTASection({ onApply }: FinalCTASectionProps) {
  return (
    <section className="relative py-36 md:py-44 bg-surface overflow-hidden">
      {/* Radial glow from center */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-subtle/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-xs tracking-[0.2em] text-accent uppercase">Ready to Join</p>
            <h2 className="font-editorial text-4xl md:text-5xl text-ink leading-tight">
              Are you a Macedonian professional
              <br />
              <span className="italic text-ink-muted">living abroad?</span>
            </h2>
          </div>

          <p className="text-base text-ink-muted leading-relaxed max-w-md mx-auto">
            If you've ever wished you had a trusted network of Macedonians in your city —
            people who understand what it's like — this is it.
          </p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onApply}
              className="px-10 py-4 bg-accent hover:bg-accent-light text-white rounded-2xl text-base font-semibold transition-all shadow-glow-accent"
            >
              Apply to Join
            </motion.button>

            <p className="text-sm text-ink-faint">
              Membership is reviewed.
              <br />
              We prioritize quality connections over growth.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
