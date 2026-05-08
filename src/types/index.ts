// ─── User & Profile ───────────────────────────────────────────────────────────

export type UserTier = 'explorer' | 'connector' | 'ambassador' | 'pillar'

export interface UserLocation {
  city: string
  country: string
  countryCode: string
  lat: number
  lng: number
}

export interface User {
  id: string
  fullName: string
  username: string
  avatarUrl?: string
  headline: string
  bio?: string
  location: UserLocation
  originCity?: string
  tier: UserTier
  trustScore: number
  introCredits: number
  isVerified: boolean
  joinedAt: string
  skills: string[]
  industries: string[]
  openTo: OpenToType[]
  connections: number
  mutualConnections?: number
}

export type OpenToType =
  | 'mentoring'
  | 'hiring'
  | 'investing'
  | 'collaborating'
  | 'relocating'
  | 'advising'
  | 'cofounding'

// ─── Hubs ─────────────────────────────────────────────────────────────────────

export interface Hub {
  id: string
  city: string
  country: string
  countryCode: string
  lat: number
  lng: number
  memberCount: number
  isActive: boolean
  topIndustries: string[]
  recentActivity?: string
}

// ─── Opportunities ────────────────────────────────────────────────────────────

export type OpportunityType =
  | 'job'
  | 'investment'
  | 'cofounder'
  | 'mentorship'
  | 'contract'
  | 'advisory'

export interface Opportunity {
  id: string
  title: string
  type: OpportunityType
  postedBy: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'tier'>
  location: string
  isRemote: boolean
  description: string
  tags: string[]
  postedAt: string
  expiresAt?: string
  applicants?: number
  isIntroRequired: boolean
}

// ─── Introductions ────────────────────────────────────────────────────────────

export type IntroStatus = 'pending' | 'accepted' | 'declined' | 'completed'

export interface IntroRequest {
  id: string
  fromUser: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'tier'>
  toUser: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'tier'>
  facilitator?: Pick<User, 'id' | 'fullName' | 'avatarUrl'>
  message: string
  context: string
  status: IntroStatus
  createdAt: string
  respondedAt?: string
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type EventType = 'in-person' | 'virtual' | 'hybrid'

export interface DiasporaEvent {
  id: string
  title: string
  description: string
  type: EventType
  hub?: Pick<Hub, 'id' | 'city' | 'country'>
  organizer: Pick<User, 'id' | 'fullName' | 'avatarUrl'>
  date: string
  endDate?: string
  location?: string
  virtualLink?: string
  coverImageUrl?: string
  attendeeCount: number
  maxAttendees?: number
  tags: string[]
  isPrivate: boolean
  createdAt: string
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiResponse<T> {
  data: T
  error?: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthSession {
  user: User
  accessToken: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupPayload extends LoginCredentials {
  fullName: string
  location: UserLocation
}

// ─── UI / Shared ──────────────────────────────────────────────────────────────

export type SortOrder = 'asc' | 'desc'

export interface FilterState {
  search?: string
  location?: string
  industry?: string
  tier?: UserTier
  openTo?: OpenToType
}
