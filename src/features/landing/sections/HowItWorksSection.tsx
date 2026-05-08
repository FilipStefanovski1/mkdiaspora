import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Apply and get verified.',
    body: "Submit a short application. We review it personally. When you're in, you receive a welcome and get connected to your city hub.",
  },
  {
    number: '02',
    title: 'Find your people.',
    body: 'Browse your local hub. Get warm introductions. Connect with Macedonians who are already where you are — or where you want to be.',
  },
  {
    number: '03',
    title: 'Build something together.',
    body: "Mentorship. Opportunities. Events. Referrals. The network compounds over time — the more you contribute, the more you receive.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.2em] text-accent uppercase mb-4">How It Works</p>
          <h2 className="font-editorial text-3xl md:text-4xl text-ink">
            Simple. Intentional. Real.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="space-y-4"
            >
              <span className="font-editorial text-5xl text-accent/40 italic">{step.number}</span>
              <h3 className="font-editorial text-xl text-ink leading-snug">{step.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
