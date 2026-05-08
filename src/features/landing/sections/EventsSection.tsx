import { motion } from 'framer-motion'
import { MapPin, Lock, CalendarDays } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getEvents } from '@/lib/api'
import type { DiasporaEvent } from '@/types'
import { formatRelativeDate } from '@/lib/utils'

function PublicEventCard({ event, index }: { event: DiasporaEvent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group rounded-2xl border border-border/60 bg-surface-2/30 hover:bg-surface-2/60 transition-all duration-300 p-5 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink leading-snug">{event.title}</h3>
          {event.hub && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-ink-faint">
              <MapPin size={10} />
              <span>{event.hub.city}, {event.hub.country}</span>
            </div>
          )}
        </div>
        <span
          className={`flex-shrink-0 text-2xs font-medium px-2 py-0.5 rounded-full border ${
            event.type === 'virtual'
              ? 'text-blue-400 bg-blue-950/50 border-blue-800/30'
              : 'text-emerald-400 bg-emerald-950/50 border-emerald-800/30'
          }`}
        >
          {event.type === 'virtual' ? 'Virtual' : event.type === 'hybrid' ? 'Hybrid' : 'In-person'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
        <CalendarDays size={11} />
        <span>{formatRelativeDate(event.date)}</span>
        {event.attendeeCount > 0 && (
          <>
            <span className="text-ink-faint">·</span>
            <span className="text-ink-faint">{event.attendeeCount} attending</span>
          </>
        )}
      </div>

      <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
        {event.description}
      </p>

      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
        <Lock size={11} className="text-ink-faint" />
        <span className="text-xs text-ink-faint">Join to RSVP</span>
      </div>
    </motion.div>
  )
}

export function EventsSection() {
  const { data: events, isLoading } = useApi(getEvents)
  const preview = (events ?? []).slice(0, 3)

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.2em] text-accent uppercase mb-4">Events</p>
          <h2 className="font-editorial text-3xl md:text-4xl text-ink">
            The network meets in real life.
          </h2>
          <p className="mt-4 text-base text-ink-muted max-w-sm mx-auto">
            Dinners, founder nights, mixers, and virtual sessions.
            Community events in your city, every month.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-surface-2/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preview.map((event, i) => (
              <PublicEventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
