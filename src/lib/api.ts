/**
 * api.ts — Single access point for all data.
 *
 * Components and features MUST import from here, never directly from mock/.
 * When Supabase is wired up, swap the mock implementations below without
 * touching any consumer code.
 */

import type {
  User,
  Hub,
  Opportunity,
  DiasporaEvent,
  IntroRequest,
  PaginatedResponse,
  FilterState,
  OpportunityType,
} from '@/types'
import {
  MOCK_USERS,
  MOCK_CURRENT_USER,
  MOCK_HUBS,
  MOCK_OPPORTUNITIES,
  MOCK_EVENTS,
} from './mock'

// Simulates network latency in development
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms))

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User> {
  await delay(200)
  return MOCK_CURRENT_USER
}

export async function getUserById(id: string): Promise<User | null> {
  await delay()
  return MOCK_USERS.find((u) => u.id === id) ?? null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  await delay()
  return MOCK_USERS.find((u) => u.username === username) ?? null
}

// ─── Members / Explore ────────────────────────────────────────────────────────

export async function getMembers(
  filters?: FilterState,
  page = 1,
  pageSize = 12,
): Promise<PaginatedResponse<User>> {
  await delay()
  let results = [...MOCK_USERS]

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.headline.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q)),
    )
  }

  if (filters?.location) {
    results = results.filter((u) =>
      u.location.city.toLowerCase().includes(filters.location!.toLowerCase()),
    )
  }

  if (filters?.tier) {
    results = results.filter((u) => u.tier === filters.tier)
  }

  if (filters?.openTo) {
    results = results.filter((u) => u.openTo.includes(filters.openTo!))
  }

  const total = results.length
  const start = (page - 1) * pageSize
  const data = results.slice(start, start + pageSize)

  return { data, total, page, pageSize, hasMore: start + pageSize < total }
}

// ─── Hubs ─────────────────────────────────────────────────────────────────────

export async function getHubs(): Promise<Hub[]> {
  await delay()
  return MOCK_HUBS
}

export async function getHubById(id: string): Promise<Hub | null> {
  await delay()
  return MOCK_HUBS.find((h) => h.id === id) ?? null
}

// ─── Opportunities ────────────────────────────────────────────────────────────

export async function getOpportunities(
  type?: OpportunityType,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<Opportunity>> {
  await delay()
  let results = [...MOCK_OPPORTUNITIES]

  if (type) {
    results = results.filter((o) => o.type === type)
  }

  const total = results.length
  const start = (page - 1) * pageSize
  const data = results.slice(start, start + pageSize)

  return { data, total, page, pageSize, hasMore: start + pageSize < total }
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  await delay()
  return MOCK_OPPORTUNITIES.find((o) => o.id === id) ?? null
}

// ─── Introductions ────────────────────────────────────────────────────────────

export async function getMyIntroRequests(): Promise<IntroRequest[]> {
  await delay()
  // No mock intro data yet — returns empty array
  return []
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(hubId?: string): Promise<DiasporaEvent[]> {
  await delay()
  if (hubId) {
    return MOCK_EVENTS.filter((e) => e.hub?.id === hubId)
  }
  return MOCK_EVENTS
}

export async function getEventById(id: string): Promise<DiasporaEvent | null> {
  await delay()
  return MOCK_EVENTS.find((e) => e.id === id) ?? null
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  pendingIntros: number
  newOpportunities: number
  upcomingEvents: number
  newConnections: number
  hubActivity: { hubCity: string; update: string }[]
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  await delay(300)
  return {
    pendingIntros: 2,
    newOpportunities: 4,
    upcomingEvents: 1,
    newConnections: 7,
    hubActivity: [
      { hubCity: 'Berlin', update: 'Founders Night this Friday' },
      { hubCity: 'London', update: '12 new job listings added' },
      { hubCity: 'Toronto', update: '3 new intro connections this week' },
    ],
  }
}
