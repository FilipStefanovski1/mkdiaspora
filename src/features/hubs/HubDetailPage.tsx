import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Users, Handshake, CalendarDays, Briefcase,
  MapPin, Home, CreditCard, Globe2, Scale, Coffee,
} from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getHubDetail, getEvents, getOpportunities } from '@/lib/api'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { TierBadge } from '@/components/ui/TierBadge'
import { Button } from '@/components/ui/Button'
import { EventCard } from '@/components/shared/EventCard'
import { OpportunityCard } from '@/components/shared/OpportunityCard'
import { IntroRequestModal } from '@/components/shared/IntroRequestModal'
import { PageLoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatNumber } from '@/lib/utils'
import type { RelocationCategory } from '@/types'
import type { LucideIcon } from 'lucide-react'

const RELOC_ICONS: Record<RelocationCategory, LucideIcon> = {
  housing:    Home,
  banking:    CreditCard,
  networking: Globe2,
  community:  Users,
  legal:      Scale,
  lifestyle:  Coffee,
}

const COUNTRY_FLAGS: Record<string, string> = {
  DE: '🇩🇪', GB: '🇬🇧', US: '🇺🇸', CA: '🇨🇦',
  AT: '🇦🇹', CH: '🇨🇭', AU: '🇦🇺', AE: '🇦🇪',
}

export function HubDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const { data: hub, isLoading } = useApi(
    () => getHubDetail(slug ?? ''),
    [slug],
  )
  const { data: events } = useApi(
    () => getEvents(hub?.id),
    [hub?.id],
  )
  const { data: oppsResponse } = useApi(getOpportunities)

  if (isLoading) return <PageLoadingSpinner />

  if (!hub) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div className="space-y-3">
          <p className="text-ink-muted">Hub not found.</p>
          <Link to="/hubs" className="text-accent-light text-sm hover:underline">
            ← Back to Hubs
          </Link>
        </div>
      </div>
    )
  }

  const flag = COUNTRY_FLAGS[hub.countryCode] ?? '🌐'
  const hubEvents = events ?? []
  const hubOpps = (oppsResponse?.data ?? []).slice(0, 2)

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-surface-2 via-surface-1 to-surface border-b border-border">
        <div className="container-page py-8">
          <Link
            to="/hubs"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink mb-6 transition-colors"
          >
            <ArrowLeft size={13} /> All Hubs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-6 flex-wrap"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{flag}</span>
                <div>
                  <h1 className="text-3xl font-bold text-ink">{hub.city}</h1>
                  <div className="flex items-center gap-1.5 mt-0.5 text-sm text-ink-muted">
                    <MapPin size={13} />
                    <span>{hub.country}</span>
                    <span className="mx-1.5 text-ink-faint">·</span>
                    <Badge variant={hub.isActive ? 'green' : 'default'}>
                      {hub.isActive ? 'Active Hub' : 'Forming'}
                    </Badge>
                    {hub.isJoined && <Badge variant="accent">You're a member</Badge>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-ink-muted max-w-xl leading-relaxed mt-3">
                {hub.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {hub.focusTags.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Users,        value: formatNumber(hub.memberCount),  label: 'Members' },
                { icon: Handshake,    value: hub.activeHelpers,              label: 'Helpers' },
                { icon: CalendarDays, value: hub.upcomingEventCount,         label: 'Events' },
                { icon: Briefcase,    value: hub.opportunityCount,           label: 'Opportunities' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="card-glass p-3 flex flex-col items-center gap-1">
                  <Icon size={14} className="text-ink-muted" />
                  <span className="text-lg font-bold text-ink tabular-nums">{value}</span>
                  <span className="text-2xs text-ink-faint text-center">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="container-page py-8">
        <div className="flex gap-8 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Featured members */}
            {hub.featuredMembers.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-ink">Featured Members</h2>
                <div className="flex flex-wrap gap-3">
                  {hub.featuredMembers.map((m) => (
                    <Link
                      key={m.id}
                      to={`/profile/${m.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 card-glass hover:border-accent/30 transition-all"
                    >
                      <Avatar src={m.avatarUrl} name={m.fullName} size="sm" tier={m.tier} />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-ink truncate">{m.fullName}</div>
                        <TierBadge tier={m.tier} />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming events */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-ink">Upcoming Events</h2>
              {hubEvents.length === 0 ? (
                <div className="card-glass p-8 text-center">
                  <p className="text-xs text-ink-muted">No upcoming events in this hub.</p>
                  <p className="text-2xs text-ink-faint mt-1">Check back soon or create one.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hubEvents.map((ev, i) => <EventCard key={ev.id} event={ev} index={i} />)}
                </div>
              )}
            </section>

            {/* Local opportunities */}
            {hubOpps.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-ink">Local Opportunities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hubOpps.map((opp, i) => <OpportunityCard key={opp.id} opportunity={opp} index={i} />)}
                </div>
              </section>
            )}

            {/* Soft landing / relocation tips */}
            {hub.relocTips.length > 0 && (
              <section className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-ink">Soft Landing Guide</h2>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Community-curated tips for relocating to {hub.city}.
                  </p>
                </div>
                <div className="space-y-2">
                  {hub.relocTips.map((tip) => {
                    const Icon = RELOC_ICONS[tip.category]
                    const isOpen = expandedTip === tip.id
                    return (
                      <div key={tip.id} className="card-glass overflow-hidden">
                        <button
                          onClick={() => setExpandedTip(isOpen ? null : tip.id)}
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-3/40 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
                            <Icon size={13} className="text-ink-muted" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-ink">{tip.title}</span>
                            <span className="ml-2 text-2xs text-ink-faint capitalize">{tip.category}</span>
                          </div>
                          <span className="text-ink-faint text-xs">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4"
                          >
                            <p className="text-xs text-ink-muted leading-relaxed pl-10">
                              {tip.body}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 space-y-4">
            {/* Ambassador */}
            {hub.ambassador ? (
              <div className="card-glass p-4 space-y-3">
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
                  City Ambassador
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={hub.ambassador.avatarUrl}
                    name={hub.ambassador.fullName}
                    size="md"
                    tier={hub.ambassador.tier}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-ink">{hub.ambassador.fullName}</div>
                    <TierBadge tier={hub.ambassador.tier} />
                    <p className="text-2xs text-ink-faint mt-0.5 line-clamp-2">
                      {hub.ambassador.headline}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  Request Local Intro
                </Button>
              </div>
            ) : (
              <div className="card-glass p-4 text-center space-y-2">
                <p className="text-xs text-ink-muted">No ambassador yet</p>
                <p className="text-2xs text-ink-faint">Interested in leading this hub?</p>
                <Button variant="ghost" size="sm" className="w-full">
                  Apply to Lead
                </Button>
              </div>
            )}

            {/* Trusted helpers */}
            {hub.trustedHelpers.length > 0 && (
              <div className="card-glass p-4 space-y-3">
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
                  Trusted Helpers
                </h3>
                <ul className="space-y-2">
                  {hub.trustedHelpers.map((h) => (
                    <li key={h.id} className="flex items-center gap-2.5">
                      <Avatar src={h.avatarUrl} name={h.fullName} size="xs" tier={h.tier} />
                      <div className="min-w-0">
                        <div className="text-xs text-ink truncate">{h.fullName}</div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {h.openTo.slice(0, 2).map((o) => (
                            <Badge key={o} variant="outline" className="text-2xs capitalize">{o}</Badge>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Join CTA */}
            <div className="card-glass p-4 space-y-3 text-center">
              {hub.isJoined ? (
                <>
                  <p className="text-xs text-emerald-400 font-medium">You're a member of this hub</p>
                  <p className="text-2xs text-ink-faint">
                    Access local intros, events, and opportunities.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-ink">Join the {hub.city} Hub</p>
                  <p className="text-2xs text-ink-muted">
                    Get access to local intros, events, and the soft-landing guide.
                  </p>
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs rounded-xl font-medium bg-accent hover:bg-accent-light text-white transition-all">
                    Join Hub
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      {hub.ambassador && (
        <IntroRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          recipient={hub.ambassador}
          introCredits={5}
        />
      )}
    </div>
  )
}
