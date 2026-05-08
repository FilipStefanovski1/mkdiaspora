import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import {
  Handshake,
  Briefcase,
  CalendarDays,
  Users,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import {
  getCurrentUser,
  getDashboardSummary,
  getOpportunities,
  getEvents,
  getHubs,
} from '@/lib/api'
import { StatCard } from '@/components/ui/StatCard'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { OpportunityCard } from '@/components/shared/OpportunityCard'
import { EventCard } from '@/components/shared/EventCard'

const GlobeView = lazy(() =>
  import('@/components/shared/GlobeView').then((m) => ({ default: m.GlobeView })),
)

const navLinkClass =
  'inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg font-medium transition-all'

function WelcomeBanner() {
  const { data: user, isLoading } = useApi(getCurrentUser)

  if (isLoading || !user) {
    return (
      <div className="card-glass p-6 flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-surface-3 flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-5 w-48 bg-surface-3 rounded" />
          <div className="h-3 w-64 bg-surface-3 rounded" />
        </div>
      </div>
    )
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-6 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <Avatar src={user.avatarUrl} name={user.fullName} size="xl" tier={user.tier} />
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-ink">
              {greeting}, {user.fullName.split(' ')[0]}
            </h1>
            <TierBadge tier={user.tier} />
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-ink-muted">
            <MapPin size={13} />
            <span>
              {user.location.city}, {user.location.country}
            </span>
            <span className="text-ink-faint mx-1">·</span>
            <span>{user.connections} connections</span>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <Link
          to="/explore"
          className={`${navLinkClass} bg-surface-3 hover:bg-surface-4 text-ink border border-border`}
        >
          Explore Network
        </Link>
        <Link
          to="/intros"
          className={`${navLinkClass} bg-accent hover:bg-accent-light text-white`}
        >
          Request Intro
        </Link>
      </div>
    </motion.div>
  )
}

function StatsRow() {
  const { data: summary, isLoading } = useApi(getDashboardSummary)

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-glass p-5 h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        index={0}
        label="Pending Intros"
        value={summary.pendingIntros}
        icon={Handshake}
        accent={summary.pendingIntros > 0}
        description={summary.pendingIntros > 0 ? 'Awaiting your response' : 'All clear'}
      />
      <StatCard
        index={1}
        label="New Opportunities"
        value={summary.newOpportunities}
        icon={Briefcase}
        description="Posted this week"
      />
      <StatCard
        index={2}
        label="Upcoming Events"
        value={summary.upcomingEvents}
        icon={CalendarDays}
        description="In your hubs"
      />
      <StatCard
        index={3}
        label="New Connections"
        value={summary.newConnections}
        icon={Users}
        description="This month"
      />
    </div>
  )
}

function SectionHeader({
  title,
  to,
  label = 'View All',
}: {
  title: string
  to: string
  label?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors"
      >
        {label} <ArrowRight size={12} />
      </Link>
    </div>
  )
}

function HubActivity() {
  const { data: summary, isLoading } = useApi(getDashboardSummary)

  return (
    <div className="card-glass p-5 flex flex-col gap-4">
      <SectionHeader title="Hub Activity" to="/hubs" label="All Hubs" />

      {isLoading || !summary ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-surface-3 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-0.5">
          {summary.hubActivity.map((item) => (
            <li
              key={item.hubCity}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <div className="flex-1 min-w-0 text-xs">
                <span className="font-medium text-ink">{item.hubCity}</span>
                <span className="text-ink-muted"> · {item.update}</span>
              </div>
              <ArrowRight
                size={12}
                className="text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function UpcomingEventsPreview() {
  const { data: events, isLoading } = useApi(getEvents)

  return (
    <div className="card-glass p-5 flex flex-col gap-4">
      <SectionHeader title="Upcoming Events" to="/events" />

      {isLoading || !events ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface-3 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {events.slice(0, 2).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

function FeaturedOpportunities() {
  const { data: response, isLoading } = useApi(getOpportunities)

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Featured Opportunities" to="/opportunities" />

      {isLoading || !response ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card-glass h-52 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {response.data.slice(0, 2).map((opp, i) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function GlobeSection() {
  const { data: hubs } = useApi(getHubs)

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Diaspora Hubs Around the World" to="/explore" label="Full Map" />
      <Suspense
        fallback={<div className="h-64 card-glass rounded-2xl animate-pulse" />}
      >
        <GlobeView hubs={hubs ?? []} height={280} />
      </Suspense>
    </div>
  )
}

export function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-page py-8 space-y-6">
        <WelcomeBanner />
        <StatsRow />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HubActivity />
          <UpcomingEventsPreview />
        </div>

        <FeaturedOpportunities />
        <GlobeSection />
      </div>
    </div>
  )
}
