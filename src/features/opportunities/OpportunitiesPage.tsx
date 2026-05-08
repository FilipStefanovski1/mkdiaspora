import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getOpportunities } from '@/lib/api'
import { OpportunityCard } from '@/components/shared/OpportunityCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import type { OpportunityType } from '@/types'

type TabOption = { value: OpportunityType | 'all'; label: string }

const TABS: TabOption[] = [
  { value: 'all', label: 'All' },
  { value: 'job', label: 'Jobs' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'cofounder', label: 'Co-Founders' },
  { value: 'investment', label: 'Investment' },
  { value: 'advisory', label: 'Advisory' },
]

function OpportunitiesList({ type }: { type: OpportunityType | 'all' }) {
  const { data: response, isLoading } = useApi(() =>
    getOpportunities(type === 'all' ? undefined : type),
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-glass h-52 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!response || response.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-ink-muted text-sm">No opportunities in this category yet.</p>
        <p className="text-ink-faint text-xs mt-1">Be the first to post one.</p>
      </div>
    )
  }

  return (
    <motion.div
      key={type}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {response.data.map((opp, i) => (
        <OpportunityCard key={opp.id} opportunity={opp} index={i} />
      ))}
    </motion.div>
  )
}

export function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<OpportunityType | 'all'>('all')

  const handleTab = useCallback((val: OpportunityType | 'all') => {
    setActiveTab(val)
  }, [])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-page py-8 space-y-6">
        <PageHeader
          title="Opportunities"
          description="Jobs, co-founder searches, investments, and mentorships — posted by trusted network members."
          action={
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl font-medium bg-accent hover:bg-accent-light text-white transition-all">
              <PlusCircle size={15} />
              Post Opportunity
            </button>
          }
        />

        {/* Tab bar */}
        <div className="flex items-center gap-1 p-1 bg-surface-2 border border-border rounded-xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTab(tab.value)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                activeTab === tab.value
                  ? 'bg-surface-4 text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <OpportunitiesList key={activeTab} type={activeTab} />
        </AnimatePresence>
      </div>
    </div>
  )
}
