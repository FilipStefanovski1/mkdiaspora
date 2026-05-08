import { Link } from 'react-router-dom'

interface PublicNavProps {
  onApply: () => void
}

export function PublicNav({ onApply }: PublicNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16">
      {/* Subtle gradient fade behind nav */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/80 to-transparent pointer-events-none" />

      {/* Logo */}
      <Link to="/" className="relative flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">M</span>
        </div>
        <span className="text-sm font-bold text-ink tracking-tight">MKDiaspora</span>
      </Link>

      {/* Actions */}
      <div className="relative flex items-center gap-3">
        <Link
          to="/login"
          className="text-sm text-ink-muted hover:text-ink transition-colors"
        >
          Sign in
        </Link>
        <button
          onClick={onApply}
          className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-light text-white rounded-xl transition-all"
        >
          Apply to Join
        </button>
      </div>
    </nav>
  )
}
