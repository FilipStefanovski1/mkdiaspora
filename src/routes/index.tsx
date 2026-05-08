import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LandingPage } from '@/features/landing/LandingPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ExplorePage } from '@/features/explore/ExplorePage'
import { HubsPage } from '@/features/hubs/HubsPage'
import { HubDetailPage } from '@/features/hubs/HubDetailPage'
import { IntrosPage } from '@/features/intros/IntrosPage'
import { OpportunitiesPage } from '@/features/opportunities/OpportunitiesPage'
import { EventsPage } from '@/features/events/EventsPage'
import { ProfilePage } from '@/features/profile/ProfilePage'

export const router = createBrowserRouter([
  // ─── Public routes ───────────────────────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  // ─── Legacy redirect ─────────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: <Navigate to="/home" replace />,
  },
  // ─── Authenticated platform ──────────────────────────────────────────────
  {
    element: <AppLayout />,
    children: [
      { path: '/home',              element: <DashboardPage /> },
      { path: '/explore',           element: <ExplorePage /> },
      { path: '/hubs',              element: <HubsPage /> },
      { path: '/hubs/:slug',        element: <HubDetailPage /> },
      { path: '/intros',            element: <IntrosPage /> },
      { path: '/opportunities',     element: <OpportunitiesPage /> },
      { path: '/events',            element: <EventsPage /> },
      { path: '/profile',           element: <ProfilePage /> },
      { path: '/profile/:username', element: <ProfilePage /> },
    ],
  },
])
