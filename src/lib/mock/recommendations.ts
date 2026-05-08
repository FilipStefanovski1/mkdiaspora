import type { RecommendedMember, RecommendedHub, RecommendedOpportunity } from '@/types'
import { MOCK_USERS } from './users'
import { MOCK_HUBS } from './hubs'
import { MOCK_OPPORTUNITIES } from './opportunities'

export const MOCK_RECOMMENDED_MEMBERS: RecommendedMember[] = [
  {
    user: MOCK_USERS[1],
    reason: "Active in Berlin hub and open to co-founding",
    score: 95,
  },
  {
    user: MOCK_USERS[2],
    reason: "2nd-degree connection with 4 mutual contacts",
    score: 88,
  },
  {
    user: MOCK_USERS[3],
    reason: "VC in Vienna — open to investing in your sector",
    score: 82,
  },
  {
    user: MOCK_USERS[4],
    reason: "Growth expert, open to mentoring designers",
    score: 76,
  },
]

export const MOCK_RECOMMENDED_HUBS: RecommendedHub[] = [
  {
    hub: MOCK_HUBS[1],
    reason: "Strong finance network matches your industry background",
    score: 91,
  },
  {
    hub: MOCK_HUBS[2],
    reason: "Active startup scene aligned with your open-to goals",
    score: 78,
  },
  {
    hub: MOCK_HUBS[4],
    reason: "Proximity to Skopje and growing consulting community",
    score: 72,
  },
]

export const MOCK_RECOMMENDED_OPPORTUNITIES: RecommendedOpportunity[] = [
  {
    opportunity: MOCK_OPPORTUNITIES[0],
    reason: "Matches your React and TypeScript skills",
    score: 94,
  },
  {
    opportunity: MOCK_OPPORTUNITIES[2],
    reason: "Posted by a Pillar in your Berlin hub",
    score: 85,
  },
  {
    opportunity: MOCK_OPPORTUNITIES[1],
    reason: "Co-founder search in your network's focus area",
    score: 78,
  },
]
