import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Handshake, Briefcase, CalendarDays,
  MapPin, TrendingUp, CheckCheck, X,
} from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { getNotifications, markAllNotificationsRead } from '@/lib/api'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeDate } from '@/lib/utils'
import type { AppNotification, NotificationType } from '@/types'

// ─── Icon map for notification types ─────────────────────────────────────────

const NOTIF_ICONS: Record<NotificationType, React.ElementType> = {
  intro_request:    Handshake,
  intro_accepted:   Handshake,
  opportunity_match: Briefcase,
  event_reminder:   CalendarDays,
  hub_activity:     MapPin,
  trust_update:     TrendingUp,
}

const NOTIF_COLORS: Record<NotificationType, string> = {
  intro_request:    'text-accent-light bg-accent/10',
  intro_accepted:   'text-emerald-400 bg-emerald-950/60',
  opportunity_match: 'text-blue-400 bg-blue-950/60',
  event_reminder:   'text-purple-400 bg-purple-950/60',
  hub_activity:     'text-ink-muted bg-surface-3',
  trust_update:     'text-gold bg-gold-subtle',
}

// ─── Single notification row ──────────────────────────────────────────────────

function NotificationRow({
  notif,
  onClose,
}: {
  notif: AppNotification
  onClose: () => void
}) {
  const Icon = NOTIF_ICONS[notif.type]
  const colorClass = NOTIF_COLORS[notif.type]
  const navigate = useNavigate()

  const handleClick = () => {
    if (notif.link) navigate(notif.link)
    onClose()
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-3/60 transition-colors ${
        !notif.isRead ? 'bg-surface-2/80' : ''
      }`}
    >
      {notif.actor ? (
        <Avatar
          src={notif.actor.avatarUrl}
          name={notif.actor.fullName}
          size="sm"
          className="flex-shrink-0 mt-0.5"
        />
      ) : (
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass}`}>
          <Icon size={13} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-xs font-medium ${notif.isRead ? 'text-ink-muted' : 'text-ink'}`}>
            {notif.title}
          </span>
          {!notif.isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-2xs text-ink-faint mt-0.5 leading-relaxed line-clamp-2">
          {notif.body}
        </p>
        <span className="text-2xs text-ink-faint mt-1 block">
          {formatRelativeDate(notif.createdAt)}
        </span>
      </div>
    </button>
  )
}

// ─── Notification tray ────────────────────────────────────────────────────────

function NotificationTray({
  notifications,
  onClose,
  onMarkAllRead,
}: {
  notifications: AppNotification[]
  onClose: () => void
  onMarkAllRead: () => void
}) {
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute right-0 top-full mt-2 w-80 bg-surface-1 border border-border rounded-2xl shadow-glass overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-2xs bg-accent text-white font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-surface-3 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck size={13} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-surface-3 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-border/50">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <Bell size={20} className="text-ink-faint mb-2" />
            <p className="text-xs text-ink-muted">No notifications yet</p>
            <p className="text-2xs text-ink-faint mt-1">
              Stay active to receive updates from your network.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationRow key={n.id} notif={n} onClose={onClose} />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-border text-center">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-2xs text-ink-muted hover:text-accent-light transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </motion.div>
  )
}

// ─── Bell button ──────────────────────────────────────────────────────────────

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [localNotifs, setLocalNotifs] = useState<AppNotification[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: notifications } = useApi(getNotifications)

  useEffect(() => {
    if (notifications) setLocalNotifs(notifications)
  }, [notifications])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  const unreadCount = localNotifs.filter((n) => !n.isRead).length

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    setLocalNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`relative p-2 rounded-xl transition-all ${
          isOpen
            ? 'bg-surface-3 text-ink'
            : 'text-ink-muted hover:bg-surface-2 hover:text-ink'
        }`}
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-2xs font-bold flex items-center justify-center leading-none"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <NotificationTray
            notifications={localNotifs}
            onClose={() => setIsOpen(false)}
            onMarkAllRead={handleMarkAllRead}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  return (
    <header className="h-12 flex-shrink-0 flex items-center justify-end px-6 border-b border-border bg-surface-1/80 backdrop-blur-sm sticky top-0 z-40">
      <NotificationBell />
    </header>
  )
}
