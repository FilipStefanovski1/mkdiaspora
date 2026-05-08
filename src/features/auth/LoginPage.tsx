import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4 bg-surface"
    >
      <div className="card-glass max-w-sm w-full p-8 space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-ink">MKDiaspora</h1>
          <p className="text-sm text-ink-muted">The trusted Macedonian network</p>
        </div>
        <p className="text-xs text-ink-faint">
          Authentication UI — Phase 1
        </p>
        <Link
          to="/dashboard"
          className="block w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-light transition-colors text-sm font-medium text-white text-center"
        >
          Enter (Dev Mode)
        </Link>
      </div>
    </motion.div>
  )
}
