import type { IntroRequestFull, IntroStats } from '@/types'
import { MOCK_USERS } from './users'

const u = (i: number) => ({
  id: MOCK_USERS[i].id,
  fullName: MOCK_USERS[i].fullName,
  avatarUrl: MOCK_USERS[i].avatarUrl,
  tier: MOCK_USERS[i].tier,
})

// current user = MOCK_USERS[0] (Elena)
export const MOCK_INTRO_REQUESTS: IntroRequestFull[] = [
  // ── Received ──────────────────────────────────────────────────────────────
  {
    id: 'ir1',
    fromUser: u(1), // Aleksandar
    toUser: u(0),   // Elena (current user)
    message:
      "Hi Elena, I came across your work at Figma and I would love a quick intro. I'm building a fintech product and desperately need design feedback from someone who gets the B2C space.",
    context: "We have 4 mutual connections in the Berlin and Toronto hubs.",
    whatYouNeed: 'A 30-min call to review our onboarding flow and get honest design feedback.',
    urgency: 'medium',
    status: 'pending',
    isRead: false,
    createdAt: '2024-10-06',
  },
  {
    id: 'ir2',
    fromUser: u(4), // Sofia
    toUser: u(0),   // Elena (current user)
    message:
      "Hey Elena! I work in growth at Notion and I'm researching how diaspora communities adopt productivity tools. Would love to hear your perspective.",
    context: "Sofia was referred by Marija Nikolova.",
    whatYouNeed: "A 20-min informal chat, no pressure.",
    urgency: 'low',
    status: 'accepted',
    isRead: true,
    createdAt: '2024-09-28',
    respondedAt: '2024-09-30',
  },
  {
    id: 'ir3',
    fromUser: u(2), // Marija
    toUser: u(0),   // Elena (current user)
    message:
      'Elena, I am looking for a design partner for a side project — a tool for Macedonian engineers abroad. I think your skills would be a perfect match.',
    context: 'Marija is a verified trusted helper in the London hub.',
    whatYouNeed: 'Exploring a potential collaboration on a 6-week design sprint.',
    urgency: 'low',
    status: 'declined',
    isRead: true,
    createdAt: '2024-09-10',
    respondedAt: '2024-09-15',
  },

  // ── Sent ──────────────────────────────────────────────────────────────────
  {
    id: 'ir4',
    fromUser: u(0), // Elena (current user)
    toUser: u(3),   // Bojan
    message:
      'Hi Bojan, I am exploring the Vienna startup ecosystem and would love to hear your perspective as a VC in the region. I recently connected with two founders looking for CEE investors.',
    context: 'We share 5 mutual connections across the Berlin and Vienna hubs.',
    whatYouNeed: 'Intro call to understand what kind of Macedonian founders you are actively looking to back.',
    urgency: 'medium',
    status: 'pending',
    isRead: true,
    createdAt: '2024-10-04',
  },
  {
    id: 'ir5',
    fromUser: u(0), // Elena (current user)
    toUser: u(2),   // Marija
    message:
      'Marija, I am looking for a senior backend engineer for a short contract at a Berlin startup. Would love to connect you with the founder — I think it could be a great fit.',
    context: 'We are both active in the Berlin and London hubs.',
    whatYouNeed: 'A quick intro between you and the startup founder — no commitment.',
    urgency: 'high',
    status: 'completed',
    isRead: true,
    createdAt: '2024-09-05',
    respondedAt: '2024-09-08',
  },
]

export const MOCK_INTRO_STATS: IntroStats = {
  creditsRemaining: 5,
  creditsTotal: 8,
  totalSent: 2,
  totalReceived: 3,
  totalAccepted: 1,
  pendingReceived: 1,
}
