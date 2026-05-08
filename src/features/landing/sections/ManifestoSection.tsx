import { motion } from 'framer-motion'

const MANIFESTO_LINES = [
  "Macedonians are scattered across every major city in the world.",
  "Most of us navigate new countries alone —",
  "figuring out housing, visas, banks, and careers",
  "without knowing a single person who has done it before.",
]

const MANIFESTO_CLOSING = [
  "This network exists to change that.",
  "",
  "Not a social media platform.",
  "Not a job board.",
  "A trusted community built on real introductions",
  "and genuine help between people who understand",
  "what it means to build a life far from home.",
]

export function ManifestoSection() {
  return (
    <section className="relative py-32 md:py-40 bg-surface overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-subtle/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="space-y-0.5"
        >
          {/* Opening lines */}
          <div className="space-y-0 mb-10">
            {MANIFESTO_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="text-lg md:text-xl text-ink-muted leading-relaxed"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Divider — a single horizontal rule with glow */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-16 h-px bg-accent mx-auto my-10 origin-center"
          />

          {/* Closing — bigger, more decisive */}
          <div className="space-y-1">
            {MANIFESTO_CLOSING.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className={
                  line === ''
                    ? 'h-4'
                    : i === 0
                    ? 'font-editorial text-2xl md:text-3xl text-ink italic'
                    : 'text-base text-ink-muted leading-relaxed'
                }
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
