import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicNav } from './components/PublicNav'
import { ApplyModal } from './components/ApplyModal'
import { HeroSection } from './sections/HeroSection'
import { ManifestoSection } from './sections/ManifestoSection'
import { PeopleSection } from './sections/PeopleSection'
import { GlobeSection } from './sections/GlobeSection'
import { HubsSection } from './sections/HubsSection'
import { HowItWorksSection } from './sections/HowItWorksSection'
import { OpportunitiesSection } from './sections/OpportunitiesSection'
import { EventsSection } from './sections/EventsSection'
import { StoriesSection } from './sections/StoriesSection'
import { FinalCTASection } from './sections/FinalCTASection'

function PublicFooter() {
  return (
    <footer className="bg-surface-1 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <div>
              <span className="text-sm font-bold text-ink tracking-tight">MKDiaspora</span>
              <p className="text-2xs text-ink-faint leading-none mt-0.5">
                Trusted Macedonian Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm text-ink-faint">
            <Link to="/login" className="hover:text-ink transition-colors">
              Sign in
            </Link>
            <span className="text-ink-faint/40">·</span>
            <span className="text-ink-faint text-xs">
              © {new Date().getFullYear()} MKDiaspora
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openApply = () => setIsModalOpen(true)

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <PublicNav onApply={openApply} />

      <HeroSection onApply={openApply} />
      <ManifestoSection />
      <PeopleSection />
      <GlobeSection />
      <HubsSection />
      <HowItWorksSection />
      <OpportunitiesSection />
      <EventsSection />
      <StoriesSection />
      <FinalCTASection onApply={openApply} />

      <PublicFooter />

      <ApplyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
