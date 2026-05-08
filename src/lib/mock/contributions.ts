import type { ContributionItem } from '@/types'

// Contributions for current user (u1 - Elena Petrovska)
export const MOCK_CONTRIBUTIONS: ContributionItem[] = [
  {
    id: 'con1',
    type: 'intro_made',
    description: 'Introduced Aleksandar Dimov to Marija Nikolova — they are now collaborating',
    date: '2024-10-01',
    trustPoints: 15,
  },
  {
    id: 'con2',
    type: 'event_organized',
    description: 'Organized Berlin Diaspora Design Night — 34 attendees',
    date: '2024-09-18',
    trustPoints: 25,
  },
  {
    id: 'con3',
    type: 'mentor_session',
    description: 'Completed 2 mentorship sessions with a junior designer from Skopje',
    date: '2024-09-10',
    trustPoints: 20,
  },
  {
    id: 'con4',
    type: 'opportunity_posted',
    description: 'Posted design mentorship opportunity — 7 applicants',
    date: '2024-10-03',
    trustPoints: 10,
  },
  {
    id: 'con5',
    type: 'profile_verified',
    description: 'Completed full profile verification',
    date: '2024-01-15',
    trustPoints: 10,
  },
  {
    id: 'con6',
    type: 'hub_joined',
    description: 'Joined and became active member of the Berlin hub',
    date: '2024-01-20',
    trustPoints: 5,
  },
  {
    id: 'con7',
    type: 'intro_made',
    description: 'Facilitated intro between Berlin hub members for a product role',
    date: '2024-08-15',
    trustPoints: 15,
  },
]
