import { Suspense, lazy, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Handshake, Briefcase, CalendarDays, Users,
  MapPin, ArrowRight, Zap, Star, TrendingUp,
  ChevronRight, Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import {
  getCurrentUser,
  getDashboardSummary,
  getOpportunities,
  getEvents,
  getHubs,
  getReceivedIntros,
  getRecommendedMembers,
  getRecommendedHubs,
  getCurrentUserProfile,
} from '@/lib/api'
import { StatCard } from '@/components/ui/StatCard'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { Badge } from '@/components/ui/Badge'
import { OpportunityCard } from '@/components/shared/OpportunityCard'
import { EventCard } from '@/components/shared/EventCard'
import { RecommendedMemberCard, RecommendedHubCard } from '@/components/shared/RecommendationCard'
import { IntroRequestModal } from '@/components/shared/IntroRequestModal'
import { TrustProgress } from '@/components/trust/TrustProgress'
import { ContributionList } from '@/components/trust/ContributionList'
import { IntroStatusBadge } from '@/components/trust/IntroStatusBadge'
import { formatRelativeDate } from '@/lib/utils'

const GlobeView = lazy(() =>
  import('@/components/shared/GlobeView').then((m) => ({ default: m.GlobeView })),
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const navLinkClass =
  'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-medium transition-all'

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

// ─── Welcome Banner ───────────────────────────────────────────────────────────

function WelcomeBanner() {
  const { data: user, isLoading } = useApi(getCurrentUser)
  const { data: summary } = useApi(getDashboardSummary)

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
      className="card-glass p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatarUrl} name={user.fullName} size="xl" tier={user.tier} />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-ink">
                {greeting}, {user.fullName.split(' ')[0]}
              </h1>
              <TierBadge tier={user.tier} />
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-ink-muted flex-wrap">
              <MapPin size={13} />
              <span>{user.location.city}, {user.location.country}</span>
              <span className="text-ink-faint mx-1">·</span>
              <span>{user.connections} connections</span>
            </div>
            {summary && (
              <div className="flex items-center gap-3 mt-2 text-2xs text-ink-faint">
                <span className="flex items-center gap-1">
                  <TrendingUp size={10} className="text-emerald-400" />
                  <span className="text-emerald-400 font-medium">+{summary.networkThisWeek.newConnections}</span> connections this week
                </span>
                <span>·</span>
                <span>{summary.networkThisWeek.introsMade} intros made</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="hidden sm:flex flex-wrap gap-2">
          <Link
            to="/explore"
            className={`${navLinkClass} bg-surface-3 hover:bg-surface-4 text-ink border border-border`}
          >
            <Users size={13} /> Explore
          </Link>
          <Link
            to="/intros"
            className={`${navLinkClass} bg-accent hover:bg-accent-light text-white`}
          >
            <Handshake size={13} /> Request Intro
          </Link>
          <Link
            to="/opportunities"
            className={`${navLinkClass} bg-surface-3 hover:bg-surface-4 text-ink border border-border`}
          >
            <Briefcase size={13} /> Jobs
          </Link>
          <Link
            to="/events"
            className={`${navLinkClass} bg-surface-3 hover:bg-surface-4 text-ink border border-border`}
          >
            <CalendarDays size={13} /> Events
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

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
      <StatCard index={0} label="Pending Intros" value={summary.pendingIntros}
        icon={Handshake} accent={summary.pendingIntros > 0}
        description={summary.pendingIntros > 0 ? 'Awaiting your response' : 'All clear'} />
      <StatCard index={1} label="New Opportunities" value={summary.newOpportunities}
        icon={Briefcase} description="Posted this week" />
      <StatCard index={2} label="Upcoming Events" value={summary.upcomingEvents}
        icon={CalendarDays} description="In your hubs" />
      <StatCard index={3} label="New Connections" value={summary.newConnections}
        icon={Users} description="This month" />
    </div>
  )
}

// ─── Pending Intro Requests ───────────────────────────────────────────────────

function PendingIntroCard() {
  const { data: received, isLoading } = useApi(getReceivedIntros)

  const pending = (received ?? []).filter((r) => r.status === 'pending')

  if (isLoading) {
    return <div className="card-glass h-28 animate-pulse" />
  }

  if (pending.length === 0) {
    return (
      <div className="card-glass p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
          <Handshake size={14} className="text-ink-faint" />
        </div>
        <div>
          <p className="text-xs font-medium text-ink">No pending intro requests</p>
          <p className="text-2xs text-ink-faint mt-0.5">Build your profile to attract quality connections.</p>
        </div>
      </div>
    )
  }

  const first = pending[0]
  const fromUser = first.fromUser

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-glass p-4 border-accent/20 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink">Pending Intros</span>
        {pending.length > 1 && (
          <Badge variant="accent">{pending.length} pending</Badge>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Avatar src={fromUser.avatarUrl} name={fromUser.fullName} size="sm" tier={fromUser.tier} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink">{fromUser.fullName}</span>
            <TierBadge tier={fromUser.tier} />
            <IntroStatusBadge status={first.status} />
          </div>
          <p className="text-2xs text-ink-muted mt-0.5 line-clamp-2 leading-relaxed">
            {first.message}
          </p>
          <p className="text-2xs text-ink-faint mt-1">
            {formatRelativeDate(first.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-1 border-t border-border">
        <button className="flex-1 px-3 py-1.5 text-2xs font-medium rounded-lg bg-accent/10 hover:bg-accent/20 text-accent-light transition-colors border border-accent/20">
          Accept
        </button>
        <button className="flex-1 px-3 py-1.5 text-2xs font-medium rounded-lg bg-surface-3 hover:bg-surface-4 text-ink-muted transition-colors border border-border">
          Decline
        </button>
        <Link
          to="/intros"
          className="px-3 py-1.5 text-2xs font-medium rounded-lg bg-surface-3 hover:bg-surface-4 text-ink-muted transition-colors border border-border"
        >
          View All
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Trust Snapshot ───────────────────────────────────────────────────────────

function TrustSnapshot() {
  const { data: profile, isLoading } = useApi(getCurrentUserProfile)

  if (isLoading || !profile) {
    return <div className="card-glass h-28 animate-pulse" />
  }

  return (
    <div className="card-glass p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink">Trust Score</span>
        <Link to="/profile" className="text-2xs text-ink-muted hover:text-ink transition-colors flex items-center gap-1">
          View Profile <ChevronRight size={10} />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
          <Star size={16} className="text-gold" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-ink tabular-nums">{profile.trustScore}</span>
            <TierBadge tier={profile.tier} />
          </div>
          <p className="text-2xs text-ink-faint">{profile.totalTrustPoints} total trust points</p>
        </div>
      </div>

      <TrustProgress score={profile.trustScore} tier={profile.tier} />
    </div>
  )
}

// ─── Recommended Members ──────────────────────────────────────────────────────

function RecommendedMembersSection() {
  const { data: recs, isLoading } = useApi(getRecommendedMembers)
  const [introTarget, setIntroTarget] = useState<string | null>(null)
  const { data: user } = useApi(getCurrentUser)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 bg-surface-3 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-glass h-52 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const items = recs ?? []
  const targetUser = introTarget
    ? items.find((r) => r.user.id === introTarget)?.user
    : null

  return (
    <div className="space-y-4">
      <SectionHeader title="Recommended for You" to="/explore" label="Explore All" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <RecommendedMemberCard
            key={item.user.id}
            item={item}
            index={i}
            onIntroRequest={setIntroTarget}
          />
        ))}
      </div>

      {targetUser && user && (
        <IntroRequestModal
          isOpen
          onClose={() => setIntroTarget(null)}
          recipient={targetUser}
          introCredits={user.introCredits}
        />
      )}
    </div>
  )
}

// ─── Hub Activity ─────────────────────────────────────────────────────────────

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
              <ArrowRight size={12} className="text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Upcoming Events ──────────────────────────────────────────────────────────

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
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center">
          <Clock size={18} className="text-ink-faint mb-2" />
          <p className="text-xs text-ink-muted">No upcoming events</p>
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

// ─── Featured Opportunities ───────────────────────────────────────────────────

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

// ─── Recommended Hubs ─────────────────────────────────────────────────────────

function RecommendedHubsSection() {
  const { data: recs, isLoading } = useApi(getRecommendedHubs)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-36 bg-surface-3 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-glass h-40 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Recommended Hubs" to="/hubs" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(recs ?? []).map((item, i) => (
          <RecommendedHubCard key={item.hub.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}

// ─── Recent Contributions ─────────────────────────────────────────────────────

function RecentContributions() {
  const { data: profile, isLoading } = useApi(getCurrentUserProfile)

  if (isLoading || !profile) {
    return <div className="card-glass p-5 h-40 animate-pulse" />
  }

  return (
    <div className="card-glass p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
          Recent Activity
        </h2>
        <Zap size={12} className="text-gold" />
      </div>
      <ContributionList contributions={profile.contributions} limit={3} />
    </div>
  )
}

// ─── Globe Section ────────────────────────────────────────────────────────────

function GlobeSection() {
  const { data: hubs } = useApi(getHubs)

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Diaspora Hubs Around the World" to="/explore" label="Full Map" />
      <Suspense fallback={<div className="h-64 card-glass rounded-2xl animate-pulse" />}>
        <GlobeView hubs={hubs ?? []} height={300} />
      </Suspense>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-page py-8 space-y-6">
        <WelcomeBanner />
        <StatsRow />

        {/* Pending intros + Trust snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PendingIntroCard />
          <TrustSnapshot />
        </div>

        <RecommendedMembersSection />

        {/* Events + Hub activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UpcomingEventsPreview />
          <HubActivity />
        </div>

        <FeaturedOpportunities />

        {/* Recommended hubs + Recent contributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecommendedHubsSection />
          </div>
          <RecentContributions />
        </div>

        <GlobeSection />
      </div>
    </div>
  )
}
