import { LayoutDashboard } from 'lucide-react'
import { PlaceholderPage } from '@/components/shared/PlaceholderPage'

export function DashboardPage() {
  return (
    <PlaceholderPage
      icon={LayoutDashboard}
      title="Dashboard"
      description="Your personalized hub — pending intros, opportunities, hub activity, and upcoming events."
      phase="Phase 1"
    />
  )
}
