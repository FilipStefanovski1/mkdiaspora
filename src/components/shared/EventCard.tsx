import { motion } from 'framer-motion'
import { MapPin, Video, Users, Lock } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { DiasporaEvent } from '@/types'

interface EventCardProps {
  event: DiasporaEvent
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const dateObj = new Date(event.date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
  const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const spotsLeft =
    event.maxAttendees != null ? event.maxAttendees - event.attendeeCount : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="card-glass p-5 flex gap-4"
    >
      {/* Date block */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-surface-3 border border-border flex flex-col items-center justify-center">
        <span className="text-base font-bold text-ink leading-none">{day}</span>
        <span className="text-2xs text-ink-muted uppercase tracking-wide mt-0.5">{month}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink line-clamp-1 flex-1">{event.title}</h3>
          {event.isPrivate && (
            <Lock size={12} className="text-ink-faint flex-shrink-0 mt-0.5" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              event.type === 'virtual' ? 'blue' : event.type === 'hybrid' ? 'gold' : 'default'
            }
          >
            {event.type === 'virtual' && <Video size={9} />}
            {event.type === 'virtual' ? 'Virtual' : event.type === 'hybrid' ? 'Hybrid' : 'In-Person'}
          </Badge>

          {event.hub && (
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <MapPin size={10} />
              {event.hub.city}
            </span>
          )}

          <span className="flex items-center gap-1 text-xs text-ink-muted ml-auto">
            <Users size={10} />
            {event.attendeeCount}
            {spotsLeft != null && spotsLeft > 0 && (
              <span className="text-ink-faint"> · {spotsLeft} spots left</span>
            )}
          </span>
        </div>

        <p className="text-xs text-ink-faint">{time}</p>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <Avatar
              src={event.organizer.avatarUrl}
              name={event.organizer.fullName}
              size="xs"
            />
            <span className="text-xs text-ink-muted">{event.organizer.fullName}</span>
          </div>
          <Button variant="ghost" size="sm" className="hover:text-accent-light">
            RSVP
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
