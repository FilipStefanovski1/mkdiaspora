import { motion } from 'framer-motion'
import { MapPin, Lock } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getMembers } from '@/lib/api'
import { Avatar } from '@/components/ui/Avatar'
import type { User } from '@/types'

// Indices that appear locked/blurred — creates curiosity
const LOCKED_INDICES = new Set([2, 5, 7])

const OPEN_TO_DISPLAY: Record<string, string> = {
  mentoring: 'Mentoring', hiring: 'Hiring', investing: 'Investing',
  collaborating: 'Collaborating', cofounding: 'Co-founding', advising: 'Advising',
}

function PublicMemberCard({ user, index }: { user: User; index: number }) {
  const isLocked = LOCKED_INDICES.has(index)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: 'easeOut' }}
      className="relative group"
    >
      <div
        className={`relative rounded-2xl border bg-surface-2/40 p-5 space-y-3 transition-all duration-300 ${
          isLocked
            ? 'border-border/40'
            : 'border-border/60 hover:border-border hover:bg-surface-2/70'
        }`}
      >
        {/* Blurred content for locked */}
        <div className={isLocked ? 'blur-[5px] select-none pointer-events-none' : ''}>
          <div className="flex items-center gap-3">
            <Avatar src={user.avatarUrl} name={user.fullName} size="md" tier={user.tier} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{user.fullName}</p>
              <p className="text-xs text-ink-muted truncate mt-0.5">{user.headline.split(' ').slice(0, 5).join(' ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-faint">
            <MapPin size={10} />
            <span>{user.location.city}, {user.location.country}</span>
          </div>
          {user.openTo.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {user.openTo.slice(0, 2).map((o) => (
                <span
                  key={o}
                  className="px-2 py-0.5 rounded-full text-2xs bg-surface-3 border border-border/60 text-ink-faint"
                >
                  {OPEN_TO_DISPLAY[o] ?? o}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-surface-1/70 backdrop-blur-[2px]">
            <Lock size={14} className="text-ink-faint mb-1.5" />
            <span className="text-2xs text-ink-faint">Members only</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Ghost cards — suggest more people exist beyond what's shown
function GhostCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="rounded-2xl border border-border/30 bg-surface-2/20 p-5 space-y-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-3/60 border border-border/40" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-28 bg-surface-3/60 rounded" />
          <div className="h-2.5 w-36 bg-surface-3/40 rounded" />
        </div>
      </div>
      <div className="h-2.5 w-20 bg-surface-3/40 rounded" />
      <div className="flex gap-1">
        <div className="h-5 w-16 bg-surface-3/40 rounded-full" />
        <div className="h-5 w-20 bg-surface-3/40 rounded-full" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl">
        <Lock size={12} className="text-ink-faint/50 mb-1" />
        <span className="text-2xs text-ink-faint/50">Members only</span>
      </div>
    </motion.div>
  )
}

export function PeopleSection() {
  const { data: response, isLoading } = useApi(() => getMembers(undefined, 1, 8))

  const members = response?.data ?? []

  return (
    <section className="py-24 md:py-32 bg-surface-1 border-y border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.2em] text-accent uppercase mb-4">The Network</p>
          <h2 className="font-editorial text-3xl md:text-4xl text-ink">
            Meet some of the people inside.
          </h2>
          <p className="mt-4 text-base text-ink-muted max-w-md mx-auto">
            Not a directory. A network of people who{' '}
            <span className="text-ink italic">actually help each other.</span>
          </p>
        </motion.div>

        {/* Member grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-surface-2/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((user, i) => (
              <PublicMemberCard key={user.id} user={user} index={i} />
            ))}
            {/* Ghost cards suggesting more exist */}
            <div className="relative">
              <GhostCard index={members.length} />
            </div>
            <div className="relative">
              <GhostCard index={members.length + 1} />
            </div>
          </div>
        )}

        {/* Footer nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-ink-faint">
            2,100+ members across 40+ cities.{' '}
            <span className="text-ink-muted">Join to see everyone.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
