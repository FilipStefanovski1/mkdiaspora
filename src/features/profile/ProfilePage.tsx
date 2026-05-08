import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, CheckCircle2, Globe2, Bookmark, Languages,
  Building2, ChevronRight,
} from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getProfileDetail, getCurrentUserProfile, getIntroStats } from '@/lib/api'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { TierBadge } from '@/components/ui/TierBadge'
import { Button } from '@/components/ui/Button'
import { TrustScoreCard } from '@/components/trust/TrustScoreCard'
import { TrustProgress } from '@/components/trust/TrustProgress'
import { ContributionList } from '@/components/trust/ContributionList'
import { ConnectionPathDisplay } from '@/components/trust/ConnectionPathDisplay'
import { IntroRequestModal } from '@/components/shared/IntroRequestModal'
import { PageLoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatRelativeDate } from '@/lib/utils'

const OPEN_TO_LABELS: Record<string, string> = {
  mentoring: 'Mentoring',
  hiring: 'Hiring',
  investing: 'Investing',
  collaborating: 'Collaborating',
  relocating: 'Relocating',
  advising: 'Advising',
  cofounding: 'Co-founding',
}

export function ProfilePage() {
  const { username } = useParams<{ username?: string }>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const isOwnProfile = !username

  const { data: profile, isLoading } = useApi(
    () => (isOwnProfile ? getCurrentUserProfile() : getProfileDetail(username ?? '')),
    [username],
  )
  const { data: introStats } = useApi(getIntroStats)

  if (isLoading) return <PageLoadingSpinner />

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <p className="text-ink-muted text-sm">Profile not found.</p>
      </div>
    )
  }

  const credits = introStats?.creditsRemaining ?? profile.introCredits

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-page py-8 space-y-8">

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass p-6"
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-5">
              <Avatar
                src={profile.avatarUrl}
                name={profile.fullName}
                size="xl"
                tier={profile.tier}
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-bold text-ink">{profile.fullName}</h1>
                  <TierBadge tier={profile.tier} />
                  {profile.isVerified && (
                    <span className="flex items-center gap-1 text-2xs text-blue-400 bg-blue-950 border border-blue-800/50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 size={9} /> Verified
                    </span>
                  )}
                </div>

                <p className="text-sm text-ink-muted">{profile.headline}</p>

                <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {profile.location.city}, {profile.location.country}
                  </span>
                  {profile.originCity && (
                    <span className="flex items-center gap-1">
                      <Globe2 size={12} />
                      From {profile.originCity}
                    </span>
                  )}
                  <span className="text-ink-faint">
                    Member since {formatRelativeDate(profile.joinedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-4 pt-1 text-xs text-ink-muted">
                  <span>
                    <span className="font-semibold text-ink">{profile.connections}</span> connections
                  </span>
                  {profile.mutualConnections != null && profile.mutualConnections > 0 && (
                    <span className="text-ink-faint">
                      {profile.mutualConnections} mutual
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isOwnProfile && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsSaved((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium border transition-all ${
                    isSaved
                      ? 'bg-gold-subtle text-gold border-gold-muted/40'
                      : 'bg-surface-3 hover:bg-surface-4 text-ink-muted border-border'
                  }`}
                >
                  <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
                  {isSaved ? 'Saved' : 'Save Profile'}
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5"
                >
                  <ChevronRight size={13} />
                  Request Intro
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Body */}
        <div className="flex gap-8 items-start">

          {/* Left: Bio + Skills + Tags */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Bio */}
            {profile.bio && (
              <div className="card-glass p-5 space-y-2">
                <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">About</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="card-glass p-5 space-y-3">
                <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} variant="default">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Open to */}
            {profile.openTo.length > 0 && (
              <div className="card-glass p-5 space-y-3">
                <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
                  Open To
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.openTo.map((o) => (
                    <Badge key={o} variant="accent">{OPEN_TO_LABELS[o] ?? o}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages + Industries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.languages && profile.languages.length > 0 && (
                <div className="card-glass p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Languages size={13} className="text-ink-muted" />
                    <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Languages</h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.languages.map((l) => (
                      <Badge key={l} variant="outline">{l}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.industries.length > 0 && (
                <div className="card-glass p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 size={13} className="text-ink-muted" />
                    <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Industries</h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.industries.map((i) => (
                      <Badge key={i} variant="default">{i}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trust progress (own profile) */}
            {isOwnProfile && (
              <div className="card-glass p-5 space-y-3">
                <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
                  Trust Progress
                </h2>
                <TrustProgress score={profile.trustScore} tier={profile.tier} />
              </div>
            )}

            {/* Contributions */}
            <div className="card-glass p-5 space-y-3">
              <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
                Contributions
              </h2>
              <ContributionList contributions={profile.contributions} limit={5} />
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="w-64 flex-shrink-0 space-y-4">

            {/* Trust score card */}
            <TrustScoreCard
              trustScore={profile.trustScore}
              tier={profile.tier}
              totalTrustPoints={profile.totalTrustPoints}
              introCredits={profile.introCredits}
              isVerified={profile.isVerified}
            />

            {/* Connection path (other profile) */}
            {!isOwnProfile && profile.connectionPath && (
              <div className="card-glass p-4 space-y-3">
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
                  Connection Path
                </h3>
                <ConnectionPathDisplay path={profile.connectionPath} />
              </div>
            )}

            {/* Request intro CTA (other profile) */}
            {!isOwnProfile && (
              <div className="card-glass p-4 space-y-3">
                <p className="text-xs font-medium text-ink">
                  Want to connect with {profile.fullName.split(' ')[0]}?
                </p>
                <p className="text-2xs text-ink-muted leading-relaxed">
                  Send a warm intro request. Be specific and respectful of their time.
                </p>
                <div className="text-2xs text-ink-faint flex items-center gap-1">
                  You have <span className="text-ink font-medium mx-0.5">{credits}</span> intro credits remaining
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsModalOpen(true)}
                  disabled={credits === 0}
                >
                  Request Introduction
                </Button>
              </div>
            )}
          </aside>
        </div>
      </div>

      <IntroRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipient={profile}
        introCredits={credits}
      />
    </div>
  )
}
