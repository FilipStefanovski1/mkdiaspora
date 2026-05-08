import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ExplorePage } from '@/features/explore/ExplorePage'
import { HubsPage } from '@/features/hubs/HubsPage'
import { IntrosPage } from '@/features/intros/IntrosPage'
import { OpportunitiesPage } from '@/features/opportunities/OpportunitiesPage'
import { EventsPage } from '@/features/events/EventsPage'
import { ProfilePage } from '@/features/profile/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/explore', element: <ExplorePage /> },
      { path: '/hubs', element: <HubsPage /> },
      { path: '/intros', element: <IntrosPage /> },
      { path: '/opportunities', element: <OpportunitiesPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/profile/:username', element: <ProfilePage /> },
    ],
  },
])
