import type { UserTier } from '@/types'

// ─── Tier System ──────────────────────────────────────────────────────────────

const TIER_THRESHOLDS: Record<UserTier, number> = {
  explorer: 0,
  connector: 40,
  ambassador: 70,
  pillar: 90,
}

/**
 * Derives a user's trust tier from their trust score (0–100).
 * Thresholds: Explorer <40 · Connector 40–69 · Ambassador 70–89 · Pillar 90+
 */
export function calculateTier(trustScore: number): UserTier {
  if (trustScore >= TIER_THRESHOLDS.pillar) return 'pillar'
  if (trustScore >= TIER_THRESHOLDS.ambassador) return 'ambassador'
  if (trustScore >= TIER_THRESHOLDS.connector) return 'connector'
  return 'explorer'
}

export function getTierLabel(tier: UserTier): string {
  return { explorer: 'Explorer', connector: 'Connector', ambassador: 'Ambassador', pillar: 'Pillar' }[tier]
}

export function getTierColor(tier: UserTier): string {
  return {
    explorer: 'text-ink-muted',
    connector: 'text-blue-400',
    ambassador: 'text-accent-light',
    pillar: 'text-gold',
  }[tier]
}

export function getTierBadgeClasses(tier: UserTier): string {
  return {
    explorer: 'bg-surface-3 text-ink-muted border-border',
    connector: 'bg-blue-950 text-blue-300 border-blue-800',
    ambassador: 'bg-accent-subtle text-accent-light border-accent-muted',
    pillar: 'bg-gold-subtle text-gold border-gold-muted',
  }[tier]
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

export function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
