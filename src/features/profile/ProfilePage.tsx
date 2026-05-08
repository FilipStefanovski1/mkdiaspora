import { User } from 'lucide-react'
import { PlaceholderPage } from '@/components/shared/PlaceholderPage'

export function ProfilePage() {
  return (
    <PlaceholderPage
      icon={User}
      title="Profile"
      description="Your public profile — trust tier, connections, skills, and open-to signals."
      phase="Phase 1"
    />
  )
}
