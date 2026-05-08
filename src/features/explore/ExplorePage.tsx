import { Suspense, lazy, useState, useCallback } from 'react'
import { SlidersHorizontal, Globe2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApi } from '@/hooks/useApi'
import { getMembers, getHubs } from '@/lib/api'
import { MemberCard } from '@/components/shared/MemberCard'
import { MemberPreviewPanel } from '@/components/shared/MemberPreviewPanel'
import { SearchInput } from '@/components/shared/SearchInput'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatNumber } from '@/lib/utils'
import type { FilterState, UserTier, OpenToType, User } from '@/types'

const GlobeView = lazy(() =>
  import('@/components/shared/GlobeView').then((m) => ({ default: m.GlobeView })),
)

// ─── Filter options ───────────────────────────────────────────────────────────

const TIER_OPTIONS: { value: UserTier; label: string }[] = [
  { value: 'explorer', label: 'Explorer' },
  { value: 'connector', label: 'Connector' },
  { value: 'ambassador', label: 'Ambassador' },
  { value: 'pillar', label: 'Pillar' },
]

const OPEN_TO_OPTIONS: { value: OpenToType; label: string }[] = [
  { value: 'mentoring', label: 'Mentoring' },
  { value: 'hiring', label: 'Hiring' },
  { value: 'investing', label: 'Investing' },
  { value: 'collaborating', label: 'Collaborating' },
  { value: 'relocating', label: 'Relocating' },
  { value: 'cofounding', label: 'Co-founding' },
  { value: 'advising', label: 'Advising' },
]

// ─── Filter sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({
  filters,
  onChange,
  onReset,
}: {
  filters: FilterState
  onChange: (patch: Partial<FilterState>) => void
  onReset: () => void
}) {
  const hasActive = Object.values(filters).some(Boolean)

  return (
    <aside className="w-52 flex-shrink-0 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink uppercase tracking-widest">
          Filters
        </span>
        {hasActive && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-2xs text-ink-muted hover:text-accent-light transition-colors"
          >
            <X size={10} /> Reset all
          </button>
        )}
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <label className="text-2xs text-ink-faint uppercase tracking-widest">City</label>
        <input
          type="text"
          placeholder="e.g. Berlin"
          value={filters.location ?? ''}
          onChange={(e) => onChange({ location: e.target.value || undefined })}
          className="w-full px-3 py-2 text-xs bg-surface-2 border border-border rounded-xl text-ink placeholder:text-ink-faint outline-none focus:border-accent/40 transition-colors"
        />
      </div>

      {/* Tier */}
      <div className="space-y-2">
        <label className="text-2xs text-ink-faint uppercase tracking-widest">Tier</label>
        <div className="flex flex-wrap gap-1.5">
          {TIER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                onChange({ tier: filters.tier === opt.value ? undefined : opt.value })
              }
              className={`px-2.5 py-1 rounded-lg text-2xs font-medium border transition-all ${
                filters.tier === opt.value
                  ? 'bg-accent/20 border-accent/40 text-accent-light'
                  : 'bg-surface-2 border-border text-ink-muted hover:border-ink-faint'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Open To */}
      <div className="space-y-2">
        <label className="text-2xs text-ink-faint uppercase tracking-widest">Open To</label>
        <div className="flex flex-wrap gap-1.5">
          {OPEN_TO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                onChange({ openTo: filters.openTo === opt.value ? undefined : opt.value })
              }
              className={`px-2.5 py-1 rounded-lg text-2xs font-medium border transition-all ${
                filters.openTo === opt.value
                  ? 'bg-accent/20 border-accent/40 text-accent-light'
                  : 'bg-surface-2 border-border text-ink-muted hover:border-ink-faint'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter summary */}
      {hasActive && (
        <div className="pt-2 border-t border-border">
          <div className="space-y-1">
            {filters.location && (
              <div className="flex items-center justify-between text-2xs">
                <span className="text-ink-faint">City</span>
                <button
                  onClick={() => onChange({ location: undefined })}
                  className="flex items-center gap-0.5 text-ink hover:text-accent-light transition-colors"
                >
                  {filters.location} <X size={9} />
                </button>
              </div>
            )}
            {filters.tier && (
              <div className="flex items-center justify-between text-2xs">
                <span className="text-ink-faint">Tier</span>
                <button
                  onClick={() => onChange({ tier: undefined })}
                  className="flex items-center gap-0.5 text-ink capitalize hover:text-accent-light transition-colors"
                >
                  {filters.tier} <X size={9} />
                </button>
              </div>
            )}
            {filters.openTo && (
              <div className="flex items-center justify-between text-2xs">
                <span className="text-ink-faint">Open To</span>
                <button
                  onClick={() => onChange({ openTo: undefined })}
                  className="flex items-center gap-0.5 text-ink capitalize hover:text-accent-light transition-colors"
                >
                  {filters.openTo} <X size={9} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}

// ─── Member grid ──────────────────────────────────────────────────────────────

function MemberGrid({
  filters,
  search,
  selectedUserId,
  onSelect,
}: {
  filters: FilterState
  search: string
  selectedUserId: string | null
  onSelect: (user: User) => void
}) {
  const combinedFilters = { ...filters, search: search || undefined }
  const { data: response, isLoading } = useApi(() => getMembers(combinedFilters))

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-glass h-56 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!response || response.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-ink-muted text-sm">No members found matching your filters.</p>
        <p className="text-ink-faint text-xs mt-1">Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-ink-faint">
        {formatNumber(response.total)} member{response.total !== 1 ? 's' : ''}
      </p>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {response.data.map((user, i) => (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            className={`cursor-pointer rounded-2xl transition-all ${
              selectedUserId === user.id ? 'ring-2 ring-accent/60' : ''
            }`}
          >
            <MemberCard user={user} index={i} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ExplorePage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterState>({})
  const [showGlobe, setShowGlobe] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { data: hubs } = useApi(getHubs)

  const handleFilterChange = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters({})
    setSearch('')
  }, [])

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser((prev) => (prev?.id === user.id ? null : user))
  }, [])

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-page py-8 space-y-6">
        <PageHeader
          title="Explore the Network"
          description="Discover Macedonian professionals and community members worldwide."
          meta={`${hubs?.length ?? 0} active hubs`}
        />

        {/* Search + globe toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, role, or skill…"
            className="flex-1 max-w-sm"
          />

          <Button
            variant={showGlobe ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setShowGlobe((v) => !v)}
            className="flex items-center gap-1.5"
          >
            <Globe2 size={14} />
            Globe
          </Button>

          {activeFilterCount > 0 && (
            <Badge variant="accent">
              <SlidersHorizontal size={10} />
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Globe */}
        <AnimatePresence>
          {showGlobe && (
            <motion.div
              key="globe"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Suspense fallback={<div className="h-[380px] card-glass rounded-2xl animate-pulse" />}>
                <GlobeView hubs={hubs ?? []} height={380} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters + grid + preview panel */}
        <div className="flex gap-6 items-start">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />

          <div className="flex-1 min-w-0">
            <MemberGrid
              filters={filters}
              search={search}
              selectedUserId={selectedUser?.id ?? null}
              onSelect={handleSelectUser}
            />
          </div>

          <AnimatePresence>
            {selectedUser && (
              <MemberPreviewPanel
                key={selectedUser.id}
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
