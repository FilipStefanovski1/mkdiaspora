import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getReceivedIntros, getSentIntros, getIntroStats } from '@/lib/api'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { Button } from '@/components/ui/Button'
import { IntroStatusBadge } from '@/components/trust/IntroStatusBadge'
import { IntroRequestModal } from '@/components/shared/IntroRequestModal'
import { PageHeader } from '@/components/shared/PageHeader'
import { formatRelativeDate } from '@/lib/utils'
import type { IntroRequestFull } from '@/types'

const URGENCY_LABELS = { low: 'Low urgency', medium: 'Medium urgency', high: 'Time-sensitive' }
const URGENCY_COLORS = {
  low: 'text-ink-faint',
  medium: 'text-ink-muted',
  high: 'text-accent-light',
}

function IntroCard({
  request,
  direction,
  index,
}: {
  request: IntroRequestFull
  direction: 'received' | 'sent'
  index: number
}) {
  const otherUser = direction === 'received' ? request.fromUser : request.toUser
  const isPending = request.status === 'pending'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      className={`card-glass p-5 space-y-4 ${
        direction === 'received' && !request.isRead ? 'border-accent/20' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={otherUser.avatarUrl}
            name={otherUser.fullName}
            size="md"
            tier={otherUser.tier}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">{otherUser.fullName}</span>
              <TierBadge tier={otherUser.tier} />
              {direction === 'received' && !request.isRead && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-2xs ${URGENCY_COLORS[request.urgency]}`}>
                {URGENCY_LABELS[request.urgency]}
              </span>
              <span className="text-2xs text-ink-faint">
                · {formatRelativeDate(request.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <IntroStatusBadge status={request.status} />
      </div>

      {/* Message */}
      <div className="bg-surface-2 rounded-xl p-3 space-y-1.5">
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">{request.message}</p>
        {request.context && (
          <p className="text-2xs text-ink-faint italic">{request.context}</p>
        )}
      </div>

      {/* What they need */}
      <div className="space-y-1">
        <span className="text-2xs text-ink-faint uppercase tracking-widest">What they need</span>
        <p className="text-xs text-ink leading-relaxed">{request.whatYouNeed}</p>
      </div>

      {/* Actions for received pending */}
      {direction === 'received' && isPending && (
        <div className="flex gap-2 pt-1 border-t border-border">
          <Button variant="primary" size="sm" className="flex-1">
            Accept
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 hover:text-red-400">
            Decline
          </Button>
        </div>
      )}

      {/* Responded date */}
      {request.respondedAt && (
        <p className="text-2xs text-ink-faint">
          Responded {formatRelativeDate(request.respondedAt)}
        </p>
      )}
    </motion.div>
  )
}

function CreditsDisplay({ remaining, total }: { remaining: number; total: number }) {
  const pct = (remaining / total) * 100

  return (
    <div className="card-glass p-5 flex items-center gap-5">
      {/* Credits */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-subtle border border-gold-muted/40 flex items-center justify-center">
          <Star size={18} className="text-gold" />
        </div>
        <div>
          <div className="text-xl font-bold text-ink tabular-nums">
            {remaining}
            <span className="text-sm font-normal text-ink-muted">/{total}</span>
          </div>
          <div className="text-2xs text-ink-faint">Intro Credits Remaining</div>
        </div>
      </div>

      {/* Bar */}
      <div className="flex-1 space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
        <p className="text-2xs text-ink-faint">
          Earn more credits by making successful intros, mentoring, and contributing to hubs.
        </p>
      </div>

      {/* Trust info */}
      <div className="hidden sm:flex items-center gap-1.5 text-2xs text-ink-muted border-l border-border pl-5 flex-shrink-0">
        <ShieldCheck size={12} className="text-accent-light" />
        <span>Warm intros only — no cold messages</span>
      </div>
    </div>
  )
}

export function IntrosPage() {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: received, isLoading: loadingReceived } = useApi(getReceivedIntros)
  const { data: sent, isLoading: loadingSent } = useApi(getSentIntros)
  const { data: stats } = useApi(getIntroStats)

  const pendingCount = (received ?? []).filter((r) => r.status === 'pending').length
  const isLoading = activeTab === 'received' ? loadingReceived : loadingSent
  const items: IntroRequestFull[] = activeTab === 'received' ? (received ?? []) : (sent ?? [])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-page py-8 space-y-6">
        <PageHeader
          title="Introductions"
          description="Warm, intentional connections — no cold outreach."
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl font-medium bg-accent hover:bg-accent-light text-white transition-all"
            >
              <ArrowRight size={15} />
              Request Intro
            </button>
          }
        />

        {/* Credits */}
        {stats && (
          <CreditsDisplay
            remaining={stats.creditsRemaining}
            total={stats.creditsTotal}
          />
        )}

        {/* Trust explanation */}
        <div className="card-glass p-4 flex items-start gap-3 border-accent/20">
          <ShieldCheck size={16} className="text-accent-light flex-shrink-0 mt-0.5" />
          <div className="text-xs text-ink-muted leading-relaxed">
            <span className="font-medium text-ink">How warm intros work: </span>
            Every intro request costs 1 credit and requires a thoughtful message. Recipients
            choose whether to accept. Successful intros earn trust points for both parties.
            Cold, low-effort requests reduce your trust score.
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-2 border border-border rounded-xl w-fit">
          {(['received', 'sent'] as const).map((tab) => {
            const count = tab === 'received' ? pendingCount : 0
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-surface-4 text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab === 'received' ? 'Received' : 'Sent'}
                {count > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-2xs bg-accent text-white">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* List */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-glass h-40 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-3 border border-border flex items-center justify-center mb-4">
                <Clock size={20} className="text-ink-faint" />
              </div>
              <p className="text-sm text-ink-muted">
                {activeTab === 'received'
                  ? 'No intro requests received yet.'
                  : 'You have not sent any intro requests yet.'}
              </p>
              <p className="text-xs text-ink-faint mt-1">
                {activeTab === 'sent'
                  ? 'Find someone in the network and request a warm introduction.'
                  : 'Build your profile to attract quality connections.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {items.map((req, i) => (
                <IntroCard
                  key={req.id}
                  request={req}
                  direction={activeTab}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <IntroRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        introCredits={stats?.creditsRemaining ?? 5}
      />
    </div>
  )
}
