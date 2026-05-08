import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, ShieldCheck, AlertCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { sendIntroRequest } from '@/lib/api'
import type { User, IntroUrgency } from '@/types'

interface IntroRequestModalProps {
  isOpen: boolean
  onClose: () => void
  recipient?: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'tier' | 'headline'>
  introCredits: number
}

const URGENCY_OPTIONS: { value: IntroUrgency; label: string; desc: string }[] = [
  { value: 'low',    label: 'Low',    desc: 'No rush — happy to wait a few weeks' },
  { value: 'medium', label: 'Medium', desc: 'Within the next 1–2 weeks would be great' },
  { value: 'high',   label: 'High',   desc: 'This is time-sensitive — within a few days' },
]

export function IntroRequestModal({
  isOpen,
  onClose,
  recipient,
  introCredits,
}: IntroRequestModalProps) {
  const [message, setMessage] = useState('')
  const [context, setContext] = useState('')
  const [whatYouNeed, setWhatYouNeed] = useState('')
  const [urgency, setUrgency] = useState<IntroUrgency>('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const canSubmit =
    message.trim().length > 20 &&
    whatYouNeed.trim().length > 10 &&
    introCredits > 0

  async function handleSubmit() {
    if (!recipient || !canSubmit) return
    setIsSubmitting(true)
    try {
      await sendIntroRequest(recipient.id, { message, context, whatYouNeed, urgency })
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setMessage('')
        setContext('')
        setWhatYouNeed('')
        setUrgency('medium')
      }, 1800)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="card-glass w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-ink">Request Introduction</h2>
                <p className="text-2xs text-ink-faint mt-0.5">
                  Warm intros only — personalise your message
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-surface-3 text-ink-muted transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800/50 flex items-center justify-center mx-auto">
                  <ShieldCheck size={22} className="text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-ink">Intro request sent</p>
                <p className="text-xs text-ink-muted">
                  {recipient?.fullName} will be notified. You will hear back within a few days.
                </p>
              </div>
            ) : (
              <div className="p-5 space-y-5">
                {/* Credits warning */}
                {introCredits <= 1 && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-subtle border border-accent/20 text-xs text-accent-light">
                    <AlertCircle size={13} />
                    {introCredits === 0
                      ? 'You have no intro credits remaining. Build trust to earn more.'
                      : 'This is your last intro credit. Use it wisely.'}
                  </div>
                )}

                {/* Recipient */}
                {recipient && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-border">
                    <Avatar src={recipient.avatarUrl} name={recipient.fullName} size="sm" tier={recipient.tier} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-ink">{recipient.fullName}</div>
                      <p className="text-2xs text-ink-muted truncate">{recipient.headline}</p>
                    </div>
                    <div className="flex items-center gap-1 text-2xs text-gold flex-shrink-0">
                      <Star size={10} />
                      1 credit
                    </div>
                  </div>
                )}

                {/* Trust reminder */}
                <div className="p-3 rounded-xl bg-surface-2 border border-border text-2xs text-ink-muted leading-relaxed">
                  <span className="font-medium text-ink-muted">Warm intros work because they're personal.</span>{' '}
                  Be specific about who you are, why you're reaching out, and what you genuinely need.
                  Low-effort requests hurt your trust score.
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-2xs text-ink-faint uppercase tracking-widest">
                    Your message <span className="text-accent-light">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Introduce yourself and explain why you'd like to connect..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-xs bg-surface-2 border border-border rounded-xl text-ink placeholder:text-ink-faint outline-none focus:border-accent/40 transition-colors resize-none leading-relaxed"
                  />
                  <p className="text-2xs text-ink-faint text-right">{message.length}/500</p>
                </div>

                {/* Context */}
                <div className="space-y-1.5">
                  <label className="text-2xs text-ink-faint uppercase tracking-widest">
                    Shared context (optional)
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. We both attended the Berlin hub meetup last month"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-border rounded-xl text-ink placeholder:text-ink-faint outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                {/* What you need */}
                <div className="space-y-1.5">
                  <label className="text-2xs text-ink-faint uppercase tracking-widest">
                    What you need <span className="text-accent-light">*</span>
                  </label>
                  <input
                    type="text"
                    value={whatYouNeed}
                    onChange={(e) => setWhatYouNeed(e.target.value)}
                    placeholder="e.g. A 20-min call to discuss the Berlin fintech ecosystem"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-border rounded-xl text-ink placeholder:text-ink-faint outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                  <label className="text-2xs text-ink-faint uppercase tracking-widest">
                    Urgency
                  </label>
                  <div className="space-y-1.5">
                    {URGENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setUrgency(opt.value)}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          urgency === opt.value
                            ? 'border-accent/40 bg-accent-subtle/30'
                            : 'border-border bg-surface-2 hover:border-ink-faint/30'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                            urgency === opt.value
                              ? 'border-accent-light bg-accent-light'
                              : 'border-ink-faint'
                          }`}
                        />
                        <div>
                          <div className="text-xs font-medium text-ink">{opt.label}</div>
                          <div className="text-2xs text-ink-muted">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Button variant="ghost" size="sm" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting || introCredits === 0}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Sending…' : 'Send Request'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}
