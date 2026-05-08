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
  languages?: string[]
}

export type OpenToType =
  | 'mentoring'
  | 'hiring'
  | 'investing'
  | 'collaborating'
  | 'relocating'
  | 'advising'
  | 'cofounding'

// ─── Contributions & Trust ────────────────────────────────────────────────────

export type ContributionType =
  | 'intro_made'
  | 'opportunity_posted'
  | 'event_organized'
  | 'mentor_session'
  | 'hub_joined'
  | 'profile_verified'

export interface ContributionItem {
  id: string
  type: ContributionType
  description: string
  date: string
  trustPoints: number
}

export type ConnectionHop = Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'tier'>

export interface ConnectionPath {
  fromUserId: string
  toUserId: string
  hops: ConnectionHop[]
  degree: number
}

export interface ProfileDetail extends User {
  languages: string[]
  contributions: ContributionItem[]
  connectionPath: ConnectionPath | null
  totalTrustPoints: number
}

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

export interface HubAmbassador {
  id: string
  fullName: string
  avatarUrl?: string
  headline: string
  tier: UserTier
  role: string
}

export type RelocationCategory =
  | 'housing'
  | 'banking'
  | 'networking'
  | 'community'
  | 'legal'
  | 'lifestyle'

export interface RelocationTip {
  id: string
  category: RelocationCategory
  title: string
  body: string
}

export interface HubDetail extends Hub {
  slug: string
  description: string
  focusTags: string[]
  ambassador: HubAmbassador | null
  activeHelpers: number
  upcomingEventCount: number
  opportunityCount: number
  relocTips: RelocationTip[]
  featuredMembers: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'tier' | 'headline' | 'location'>[]
  trustedHelpers: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'tier' | 'openTo' | 'headline'>[]
  isJoined: boolean
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
export type IntroUrgency = 'low' | 'medium' | 'high'

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

export interface IntroRequestFull extends IntroRequest {
  urgency: IntroUrgency
  whatYouNeed: string
  isRead: boolean
}

export interface IntroStats {
  creditsRemaining: number
  creditsTotal: number
  totalSent: number
  totalReceived: number
  totalAccepted: number
  pendingReceived: number
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
