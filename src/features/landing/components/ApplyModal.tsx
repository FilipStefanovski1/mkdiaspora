import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'

interface ApplyModalProps {
  isOpen: boolean
  onClose: () => void
}

const CITIES = [
  'Berlin', 'London', 'Toronto', 'New York', 'Vienna',
  'Zurich', 'Sydney', 'Dubai', 'Amsterdam', 'Stockholm',
  'Paris', 'Barcelona', 'Skopje', 'Other',
]

export function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    city: '',
    role: '',
    referral: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass =
    'w-full px-4 py-3 text-sm bg-surface-2 border border-border rounded-xl text-ink placeholder:text-ink-faint outline-none focus:border-accent/50 transition-colors'

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface/80 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-md bg-surface-1 border border-border rounded-3xl overflow-hidden shadow-glass"
          >
            {submitted ? (
              /* Success state */
              <div className="p-10 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 size={28} className="text-emerald-400" />
                </motion.div>
                <h2 className="font-editorial text-2xl text-ink">
                  You're on the list.
                </h2>
                <p className="text-sm text-ink-muted leading-relaxed">
                  We review applications every week. When you're in,
                  you'll receive a personal welcome from the team.
                </p>
                <p className="text-xs text-ink-faint">
                  Keep an eye on your inbox.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 text-sm font-medium bg-surface-3 hover:bg-surface-4 text-ink-muted rounded-xl transition-colors border border-border"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Form */
              <>
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                  <div>
                    <h2 className="font-editorial text-xl text-ink">Apply to Join</h2>
                    <p className="text-xs text-ink-faint mt-0.5">
                      Membership is reviewed. We'll be in touch.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-ink-faint hover:text-ink hover:bg-surface-3 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <input
                    required
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className={inputClass}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      required
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="">City</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      required
                      placeholder="Role / profession"
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <input
                    placeholder="How did you hear about us? (optional)"
                    value={form.referral}
                    onChange={(e) => setForm((f) => ({ ...f, referral: e.target.value }))}
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 text-sm font-semibold bg-accent hover:bg-accent-light text-white rounded-xl transition-all mt-2"
                  >
                    Submit Application
                  </button>

                  <p className="text-center text-2xs text-ink-faint leading-relaxed">
                    We review every application personally.
                    Quality over growth — always.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}
