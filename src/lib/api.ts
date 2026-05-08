/**
 * api.ts — Single access point for all data.
 *
 * Components and features MUST import from here, never from mock/ directly.
 * When Supabase is wired up, swap the mock implementations below without
 * touching any consumer code.
 */

import type {
  User,
  Hub,
  HubDetail,
  Opportunity,
  DiasporaEvent,
  IntroRequestFull,
  IntroStats,
  ProfileDetail,
  PaginatedResponse,
  FilterState,
  OpportunityType,
  AppNotification,
  RecommendedMember,
  RecommendedHub,
  RecommendedOpportunity,
} from '@/types'
import {
  MOCK_USERS,
  MOCK_CURRENT_USER,
  MOCK_PROFILE_DETAILS,
  MOCK_HUBS,
  MOCK_HUB_DETAILS,
  MOCK_OPPORTUNITIES,
  MOCK_EVENTS,
  MOCK_INTRO_REQUESTS,
  MOCK_INTRO_STATS,
  MOCK_NOTIFICATIONS,
  MOCK_RECOMMENDED_MEMBERS,
  MOCK_RECOMMENDED_HUBS,
  MOCK_RECOMMENDED_OPPORTUNITIES,
} from './mock'

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

// ─── Profiles ─────────────────────────────────────────────────────────────────

export async function getProfileDetail(usernameOrId: string): Promise<ProfileDetail | null> {
  await delay()
  const byUsername = Object.values(MOCK_PROFILE_DETAILS).find(
    (p) => p.username === usernameOrId,
  )
  if (byUsername) return byUsername
  return MOCK_PROFILE_DETAILS[usernameOrId] ?? null
}

export async function getCurrentUserProfile(): Promise<ProfileDetail> {
  await delay(200)
  return MOCK_PROFILE_DETAILS['u1']
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

export async function getHubDetails(search?: string): Promise<HubDetail[]> {
  await delay()
  let results = [...MOCK_HUB_DETAILS]

  if (search) {
    const q = search.toLowerCase()
    results = results.filter(
      (h) =>
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.focusTags.some((t) => t.toLowerCase().includes(q)) ||
        h.topIndustries.some((i) => i.toLowerCase().includes(q)),
    )
  }

  return results
}

export async function getHubDetail(slug: string): Promise<HubDetail | null> {
  await delay()
  return MOCK_HUB_DETAILS.find((h) => h.slug === slug) ?? null
}

export async function getHubMembers(hubId: string): Promise<User[]> {
  await delay()
  const hub = MOCK_HUB_DETAILS.find((h) => h.id === hubId)
  if (!hub) return []
  const memberIds = new Set(hub.featuredMembers.map((m) => m.id))
  return MOCK_USERS.filter((u) => memberIds.has(u.id))
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

export async function getMyIntroRequests(): Promise<IntroRequestFull[]> {
  await delay()
  return MOCK_INTRO_REQUESTS
}

export async function getReceivedIntros(): Promise<IntroRequestFull[]> {
  await delay()
  const currentUserId = MOCK_CURRENT_USER.id
  return MOCK_INTRO_REQUESTS.filter((r) => r.toUser.id === currentUserId)
}

export async function getSentIntros(): Promise<IntroRequestFull[]> {
  await delay()
  const currentUserId = MOCK_CURRENT_USER.id
  return MOCK_INTRO_REQUESTS.filter((r) => r.fromUser.id === currentUserId)
}

export async function getIntroStats(): Promise<IntroStats> {
  await delay(200)
  return MOCK_INTRO_STATS
}

export async function sendIntroRequest(
  _toUserId: string,
  _payload: { message: string; context: string; whatYouNeed: string; urgency: string },
): Promise<{ success: boolean }> {
  await delay(600)
  return { success: true }
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

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(): Promise<AppNotification[]> {
  await delay(300)
  return MOCK_NOTIFICATIONS
}

export async function markNotificationRead(_id: string): Promise<{ success: boolean }> {
  await delay(200)
  return { success: true }
}

export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  await delay(300)
  return { success: true }
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export async function getRecommendedMembers(): Promise<RecommendedMember[]> {
  await delay(400)
  return MOCK_RECOMMENDED_MEMBERS
}

export async function getRecommendedHubs(): Promise<RecommendedHub[]> {
  await delay(400)
  return MOCK_RECOMMENDED_HUBS
}

export async function getRecommendedOpportunities(): Promise<RecommendedOpportunity[]> {
  await delay(400)
  return MOCK_RECOMMENDED_OPPORTUNITIES
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  pendingIntros: number
  newOpportunities: number
  upcomingEvents: number
  newConnections: number
  hubActivity: { hubCity: string; update: string }[]
  networkThisWeek: { newConnections: number; introsMade: number; hubUpdates: number }
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
    networkThisWeek: { newConnections: 7, introsMade: 2, hubUpdates: 3 },
  }
}
