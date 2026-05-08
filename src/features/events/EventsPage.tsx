import { motion } from 'framer-motion'
import { CalendarPlus } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getEvents } from '@/lib/api'
import { EventCard } from '@/components/shared/EventCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/Badge'

function EventTypeFilter({
  active,
  onChange,
}: {
  active: string
  onChange: (v: string) => void
}) {
  const options = [
    { value: 'all', label: 'All Events' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' },
  ]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
            active === opt.value
              ? 'bg-surface-3 border-accent/40 text-ink'
              : 'border-border text-ink-muted hover:text-ink hover:border-ink-faint'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function EventsPage() {
  const { data: events, isLoading } = useApi(getEvents)

  const upcomingCount = events?.filter((e) => new Date(e.date) > new Date()).length ?? 0

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-page py-8 space-y-6">
        <PageHeader
          title="Events"
          description="In-person meetups, virtual talks, and private gatherings across diaspora hubs worldwide."
          meta={upcomingCount > 0 ? `${upcomingCount} upcoming` : undefined}
          action={
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl font-medium bg-accent hover:bg-accent-light text-white transition-all">
              <CalendarPlus size={15} />
              Create Event
            </button>
          }
        />

        <div className="flex items-center gap-3 flex-wrap">
          <EventTypeFilter active="all" onChange={() => {}} />
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="default">All Hubs</Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-glass h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {(events ?? []).map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && (events ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-ink-muted text-sm">No events scheduled yet.</p>
            <p className="text-ink-faint text-xs mt-1">Create the first event in your hub.</p>
          </div>
        )}
      </div>
    </div>
  )
}
