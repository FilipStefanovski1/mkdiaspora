import { motion } from 'framer-motion'

const STORIES = [
  {
    quote:
      "I moved to Berlin not knowing anyone. Within three weeks, I had coffee with four Macedonians through this network who helped me find an apartment, open a bank account, and meet my first client. I don't know how I would have done it alone.",
    name: 'Stefan Nikolov',
    role: 'Product Manager',
    city: 'Berlin',
  },
  {
    quote:
      "I found my technical co-founder through an intro here. We launched six months ago and just closed our pre-seed. This network moves differently from LinkedIn — everyone actually wants to help.",
    name: 'Ana Zdraveva',
    role: 'Founder',
    city: 'Vienna',
  },
  {
    quote:
      "After ten years in London, I still felt like I was figuring things out alone. Joining this network felt like finally finding the group chat that should have existed from day one.",
    name: 'Marija Ilievska',
    role: 'Senior Lawyer',
    city: 'London',
  },
]

export function StoriesSection() {
  return (
    <section className="py-24 md:py-32 bg-surface-1 border-y border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.2em] text-accent uppercase mb-4">Member Stories</p>
          <h2 className="font-editorial text-3xl md:text-4xl text-ink">
            This is what it feels like
            <span className="italic text-ink-muted"> from the inside.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORIES.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="space-y-5"
            >
              {/* Quote mark */}
              <span className="font-editorial text-4xl text-accent/50 italic leading-none block">"</span>

              <p className="text-sm text-ink-muted leading-[1.75] -mt-3">
                {story.quote}
              </p>

              <div className="pt-4 border-t border-border/40">
                <p className="text-sm font-semibold text-ink">{story.name}</p>
                <p className="text-xs text-ink-faint mt-0.5">
                  {story.role} · {story.city}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
