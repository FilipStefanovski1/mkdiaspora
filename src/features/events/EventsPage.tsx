import { CalendarDays } from 'lucide-react'
import { PlaceholderPage } from '@/components/shared/PlaceholderPage'

export function EventsPage() {
  return (
    <PlaceholderPage
      icon={CalendarDays}
      title="Events"
      description="In-person meetups, virtual talks, and private gatherings across diaspora hubs."
      phase="Phase 1"
    />
  )
}
