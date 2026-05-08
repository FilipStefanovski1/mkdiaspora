import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApi } from '@/hooks/useApi'
import { getHubDetails } from '@/lib/api'
import { HubCard } from './HubCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { formatNumber } from '@/lib/utils'

const REGION_FILTERS = ['All Regions', 'Europe', 'North America', 'Middle East', 'Oceania']

const REGION_MATCH: Record<string, string[]> = {
  Europe:        ['Germany', 'United Kingdom', 'Austria', 'Switzerland'],
  'North America': ['Canada', 'United States'],
  'Middle East': ['UAE'],
  Oceania:       ['Australia'],
}

export function HubsPage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All Regions')

  const { data: hubs, isLoading } = useApi(getHubDetails)

  const filtered = (hubs ?? []).filter((h) => {
    const matchesSearch =
      !search ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.country.toLowerCase().includes(search.toLowerCase()) ||
      h.focusTags.some((t) => t.toLowerCase().includes(search.toLowerCase()))

    const matchesRegion =
      region === 'All Regions' || (REGION_MATCH[region] ?? []).includes(h.country)

    return matchesSearch && matchesRegion
  })

  const featured = filtered.find((h) => h.isJoined) ?? filtered[0]
  const rest = filtered.filter((h) => h.id !== featured?.id)

  const totalMembers = (hubs ?? []).reduce((s, h) => s + h.memberCount, 0)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-page py-8 space-y-8">
        <PageHeader
          title="Diaspora Hubs"
          description="Local Macedonian communities in cities around the world — your gateway to trusted local networks."
          meta={`${(hubs ?? []).length} cities · ${formatNumber(totalMembers)} members`}
        />

        {/* Search + region filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search city, country, or focus…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-2 border border-border rounded-xl text-ink placeholder:text-ink-faint outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {REGION_FILTERS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  region === r
                    ? 'bg-surface-3 border-accent/30 text-ink'
                    : 'border-border text-ink-muted hover:text-ink hover:border-ink-faint/30'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="card-glass h-64 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-glass h-72 animate-pulse" />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-ink-muted text-sm">No hubs match your search.</p>
            <button
              onClick={() => { setSearch(''); setRegion('All Regions') }}
              className="text-accent-light text-xs mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured hub */}
            {featured && (
              <div className="space-y-3">
                <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
                  {featured.isJoined ? 'Your Hub' : 'Featured Hub'}
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <HubCard hub={featured} featured />
                </motion.div>
              </div>
            )}

            {/* All hubs grid */}
            {rest.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
                  All Hubs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((hub, i) => (
                    <HubCard key={hub.id} hub={hub} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
